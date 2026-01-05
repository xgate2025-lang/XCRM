/**
 * LocalStorageClient - Namespaced persistence helper for Onboarding state.
 * 
 * Keys follow the pattern: xcrm:onboarding:{tenantId}:{userId}:{key}
 */

const STORAGE_PREFIX = 'xcrm:onboarding';

export const LocalStorageClient = {
    /**
     * Builds a namespaced key.
     */
    buildKey(tenantId: string, userId: string, key: string): string {
        return `${STORAGE_PREFIX}:${tenantId}:${userId}:${key}`;
    },

    /**
     * Gets a value from localStorage.
     */
    get<T>(tenantId: string, userId: string, key: string): T | null {
        try {
            const fullKey = this.buildKey(tenantId, userId, key);
            const value = localStorage.getItem(fullKey);
            return value ? JSON.parse(value) : null;
        } catch (error) {
            console.error('[LocalStorageClient] Error reading:', error);
            return null;
        }
    },

    /**
     * Sets a value in localStorage.
     */
    set<T>(tenantId: string, userId: string, key: string, value: T): void {
        try {
            const fullKey = this.buildKey(tenantId, userId, key);
            localStorage.setItem(fullKey, JSON.stringify(value));
        } catch (error) {
            console.error('[LocalStorageClient] Error writing:', error);
        }
    },

    /**
     * Removes a value from localStorage.
     */
    remove(tenantId: string, userId: string, key: string): void {
        try {
            const fullKey = this.buildKey(tenantId, userId, key);
            localStorage.removeItem(fullKey);
        } catch (error) {
            console.error('[LocalStorageClient] Error removing:', error);
        }
    },

    /**
     * Clears all onboarding-related keys for a tenant/user.
     */
    clearAll(tenantId: string, userId: string): void {
        try {
            const prefix = `${STORAGE_PREFIX}:${tenantId}:${userId}:`;
            Object.keys(localStorage)
                .filter((key) => key.startsWith(prefix))
                .forEach((key) => localStorage.removeItem(key));
        } catch (error) {
            console.error('[LocalStorageClient] Error clearing:', error);
        }
    },
};

export default LocalStorageClient;
