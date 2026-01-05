import { AssetLog, PointPacket } from '../../../types';

// LocalStorage keys
const ASSET_LOGS_KEY = 'xcrm_asset_logs';
const POINT_PACKETS_KEY = 'xcrm_point_packets';

// --- Mock Data ---

const generateId = () => `LOG-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

const INITIAL_ASSET_LOGS: AssetLog[] = [
    {
        id: 'LOG-001',
        memberId: 'MEM-001',
        type: 'point',
        changeType: 'Earn',
        changeValue: 342,
        balanceBefore: 12158,
        balanceAfter: 12500,
        source: 'ORD-99281',
        reasonType: '',
        remark: 'Points earned from purchase.',
        timestamp: '2024-12-02T10:30:00Z',
    },
    {
        id: 'LOG-002',
        memberId: 'MEM-001',
        type: 'point',
        changeType: 'Redeem',
        changeValue: -2000,
        balanceBefore: 14500,
        balanceAfter: 12500,
        source: 'ORD-99105',
        reasonType: '',
        remark: 'Points redeemed at checkout.',
        timestamp: '2024-11-15T14:00:00Z',
    },
    {
        id: 'LOG-003',
        memberId: 'MEM-001',
        type: 'tier',
        changeType: 'Upgrade',
        changeValue: 'Gold → Platinum',
        balanceBefore: 'Gold',
        balanceAfter: 'Platinum',
        source: 'System',
        reasonType: '',
        remark: 'Tier upgraded based on annual spend.',
        timestamp: '2024-10-01T09:00:00Z',
    },
];

const INITIAL_POINT_PACKETS: PointPacket[] = [
    {
        id: 'PKT-001',
        memberId: 'MEM-001',
        totalPoints: 5000,
        remainingPoints: 3200,
        receivedDate: '2024-01-15',
        expiryDate: '2025-01-15',
        source: 'ORD-88101',
        remark: 'New Year promotion bonus.',
    },
    {
        id: 'PKT-002',
        memberId: 'MEM-001',
        totalPoints: 2500,
        remainingPoints: 2500,
        receivedDate: '2024-06-20',
        expiryDate: '2025-06-20',
        source: 'ORD-92445',
        remark: 'Birthday reward.',
    },
    {
        id: 'PKT-003',
        memberId: 'MEM-001',
        totalPoints: 4800,
        remainingPoints: 4800,
        receivedDate: '2024-11-01',
        expiryDate: '2025-11-01',
        source: 'ORD-98001',
        remark: 'Double points campaign.',
    },
];

// --- Service Functions ---

const getStoredLogs = (): AssetLog[] => {
    const stored = localStorage.getItem(ASSET_LOGS_KEY);
    if (stored) {
        return JSON.parse(stored);
    }
    // Initialize with mock data
    localStorage.setItem(ASSET_LOGS_KEY, JSON.stringify(INITIAL_ASSET_LOGS));
    return INITIAL_ASSET_LOGS;
};

const getStoredPackets = (): PointPacket[] => {
    const stored = localStorage.getItem(POINT_PACKETS_KEY);
    if (stored) {
        return JSON.parse(stored);
    }
    // Initialize with mock data
    localStorage.setItem(POINT_PACKETS_KEY, JSON.stringify(INITIAL_POINT_PACKETS));
    return INITIAL_POINT_PACKETS;
};

export const MockAssetService = {
    /**
     * Get all asset logs for a member, optionally filtered by type.
     */
    getAssetLogs: (memberId: string, type?: 'point' | 'tier'): AssetLog[] => {
        const logs = getStoredLogs();
        return logs
            .filter((log) => log.memberId === memberId && (!type || log.type === type))
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    },

    /**
     * Add a new asset log entry (e.g., for point adjustment or tier change).
     */
    addAssetLog: (log: Omit<AssetLog, 'id' | 'timestamp'>): AssetLog => {
        const logs = getStoredLogs();
        const newLog: AssetLog = {
            ...log,
            id: generateId(),
            timestamp: new Date().toISOString(),
        };
        logs.unshift(newLog);
        localStorage.setItem(ASSET_LOGS_KEY, JSON.stringify(logs));
        return newLog;
    },

    /**
     * Get all point packets for a member.
     */
    getPointPackets: (memberId: string): PointPacket[] => {
        const packets = getStoredPackets();
        return packets
            .filter((p) => p.memberId === memberId)
            .sort((a, b) => new Date(b.receivedDate).getTime() - new Date(a.receivedDate).getTime());
    },

    /**
     * Add a new point packet (e.g., from a purchase).
     */
    addPointPacket: (packet: Omit<PointPacket, 'id'>): PointPacket => {
        const packets = getStoredPackets();
        const newPacket: PointPacket = {
            ...packet,
            id: `PKT-${Date.now()}`,
        };
        packets.unshift(newPacket);
        localStorage.setItem(POINT_PACKETS_KEY, JSON.stringify(packets));
        return newPacket;
    },

    /**
     * Reset to initial mock data (for testing).
     */
    resetMockData: (): void => {
        localStorage.setItem(ASSET_LOGS_KEY, JSON.stringify(INITIAL_ASSET_LOGS));
        localStorage.setItem(POINT_PACKETS_KEY, JSON.stringify(INITIAL_POINT_PACKETS));
    },
};

export default MockAssetService;
