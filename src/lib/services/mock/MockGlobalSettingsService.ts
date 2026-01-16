import { CurrencyConfig, CustomerAttribute, IGlobalSettingsService } from '../../../types';

// LocalStorage keys
const CURRENCIES_KEY = 'xcrm_currencies';
const ATTRIBUTES_KEY = 'xcrm_customer_attributes';

// --- Initial Mock Data ---

const INITIAL_CURRENCIES: CurrencyConfig[] = [
  {
    code: 'THB',
    name: 'Thai Baht',
    rate: 1,
    isDefault: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    code: 'USD',
    name: 'US Dollar',
    rate: 34.50,
    isDefault: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    code: 'EUR',
    name: 'Euro',
    rate: 37.80,
    isDefault: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

const INITIAL_ATTRIBUTES: CustomerAttribute[] = [
  // Standard attributes (non-deletable)
  {
    code: 'email',
    displayName: 'Email Address',
    type: 'STANDARD',
    format: 'TEXT',
    isRequired: true,
    isUnique: true,
    status: 'ACTIVE',
  },
  {
    code: 'phone',
    displayName: 'Phone Number',
    type: 'STANDARD',
    format: 'TEXT',
    isRequired: true,
    isUnique: true,
    status: 'ACTIVE',
  },
  {
    code: 'first_name',
    displayName: 'First Name',
    type: 'STANDARD',
    format: 'TEXT',
    isRequired: true,
    isUnique: false,
    status: 'ACTIVE',
  },
  {
    code: 'last_name',
    displayName: 'Last Name',
    type: 'STANDARD',
    format: 'TEXT',
    isRequired: true,
    isUnique: false,
    status: 'ACTIVE',
  },
  {
    code: 'birthday',
    displayName: 'Birthday',
    type: 'STANDARD',
    format: 'DATE',
    isRequired: false,
    isUnique: false,
    status: 'ACTIVE',
  },
  // Custom attributes (examples)
  {
    code: 'c_loyalty_tier',
    displayName: 'Loyalty Tier',
    type: 'CUSTOM',
    format: 'SELECT',
    isRequired: false,
    isUnique: false,
    status: 'ACTIVE',
    options: [
      { label: 'Bronze', value: 'bronze' },
      { label: 'Silver', value: 'silver' },
      { label: 'Gold', value: 'gold' },
      { label: 'Platinum', value: 'platinum' },
    ],
  },
  {
    code: 'c_preferred_contact',
    displayName: 'Preferred Contact Method',
    type: 'CUSTOM',
    format: 'MULTISELECT',
    isRequired: false,
    isUnique: false,
    status: 'ACTIVE',
    options: [
      { label: 'Email', value: 'email' },
      { label: 'SMS', value: 'sms' },
      { label: 'WhatsApp', value: 'whatsapp' },
      { label: 'Line', value: 'line' },
    ],
  },
];

// --- Helper Functions ---

const loadFromStorage = <T>(key: string, initialData: T[]): T[] => {
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
  }
  // Initialize with default data
  localStorage.setItem(key, JSON.stringify(initialData));
  return initialData;
};

const saveToStorage = <T>(key: string, data: T[]): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};

// --- Service Implementation ---

class MockGlobalSettingsService implements IGlobalSettingsService {
  // Currency Methods

  async getCurrencies(): Promise<CurrencyConfig[]> {
    return loadFromStorage<CurrencyConfig>(CURRENCIES_KEY, INITIAL_CURRENCIES);
  }

  async addCurrency(currency: Omit<CurrencyConfig, 'createdAt' | 'updatedAt'>): Promise<CurrencyConfig> {
    const currencies = await this.getCurrencies();

    // Check for duplicate
    if (currencies.some(c => c.code === currency.code)) {
      throw new Error(`Currency ${currency.code} already exists`);
    }

    const now = new Date().toISOString();
    const newCurrency: CurrencyConfig = {
      ...currency,
      createdAt: now,
      updatedAt: now,
    };

    currencies.push(newCurrency);
    saveToStorage(CURRENCIES_KEY, currencies);
    return newCurrency;
  }

  async updateCurrency(code: string, rate: number): Promise<CurrencyConfig> {
    const currencies = await this.getCurrencies();
    const index = currencies.findIndex(c => c.code === code);

    if (index === -1) {
      throw new Error(`Currency ${code} not found`);
    }

    if (currencies[index].isDefault) {
      throw new Error('Cannot modify the default currency rate');
    }

    currencies[index] = {
      ...currencies[index],
      rate,
      updatedAt: new Date().toISOString(),
    };

    saveToStorage(CURRENCIES_KEY, currencies);
    return currencies[index];
  }

  async deleteCurrency(code: string): Promise<void> {
    const currencies = await this.getCurrencies();
    const currency = currencies.find(c => c.code === code);

    if (!currency) {
      throw new Error(`Currency ${code} not found`);
    }

    if (currency.isDefault) {
      throw new Error('Cannot delete the default currency');
    }

    const filtered = currencies.filter(c => c.code !== code);
    saveToStorage(CURRENCIES_KEY, filtered);
  }

  // Customer Attribute Methods

  async getAttributes(): Promise<CustomerAttribute[]> {
    return loadFromStorage<CustomerAttribute>(ATTRIBUTES_KEY, INITIAL_ATTRIBUTES);
  }

  async addAttribute(attribute: CustomerAttribute): Promise<CustomerAttribute> {
    const attributes = await this.getAttributes();

    // Check for duplicate code
    if (attributes.some(a => a.code === attribute.code)) {
      throw new Error(`Attribute ${attribute.code} already exists`);
    }

    // Ensure custom attributes start with c_
    if (attribute.type === 'CUSTOM' && !attribute.code.startsWith('c_')) {
      throw new Error('Custom attribute codes must start with "c_"');
    }

    // Validate options for SELECT/MULTISELECT
    if ((attribute.format === 'SELECT' || attribute.format === 'MULTISELECT') &&
        (!attribute.options || attribute.options.length === 0)) {
      throw new Error('SELECT/MULTISELECT attributes must have at least one option');
    }

    attributes.push(attribute);
    saveToStorage(ATTRIBUTES_KEY, attributes);
    return attribute;
  }

  async updateAttribute(code: string, updates: Partial<CustomerAttribute>): Promise<CustomerAttribute> {
    const attributes = await this.getAttributes();
    const index = attributes.findIndex(a => a.code === code);

    if (index === -1) {
      throw new Error(`Attribute ${code} not found`);
    }

    // Prevent changing the code (immutable)
    if (updates.code && updates.code !== code) {
      throw new Error('Attribute code cannot be changed after creation');
    }

    // Prevent changing type from STANDARD to CUSTOM or vice versa
    if (updates.type && updates.type !== attributes[index].type) {
      throw new Error('Attribute type cannot be changed');
    }

    attributes[index] = {
      ...attributes[index],
      ...updates,
      code, // Ensure code remains unchanged
    };

    saveToStorage(ATTRIBUTES_KEY, attributes);
    return attributes[index];
  }

  async deleteAttribute(code: string): Promise<void> {
    const attributes = await this.getAttributes();
    const attribute = attributes.find(a => a.code === code);

    if (!attribute) {
      throw new Error(`Attribute ${code} not found`);
    }

    if (attribute.type === 'STANDARD') {
      throw new Error('Standard attributes cannot be deleted');
    }

    const filtered = attributes.filter(a => a.code !== code);
    saveToStorage(ATTRIBUTES_KEY, filtered);
  }

  // Utility method to reset to defaults (for testing)
  async reset(): Promise<void> {
    localStorage.removeItem(CURRENCIES_KEY);
    localStorage.removeItem(ATTRIBUTES_KEY);
  }
}

// Export singleton instance
export const globalSettingsService = new MockGlobalSettingsService();
export default globalSettingsService;
