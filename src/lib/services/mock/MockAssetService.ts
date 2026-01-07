import { AssetLog, PointPacket, PointsSummary, MemberCoupon, MemberCouponStatus, ManualRedemptionForm, ManualVoidForm } from '../../../types';

// LocalStorage keys
const ASSET_LOGS_KEY = 'xcrm_asset_logs';
const POINT_PACKETS_KEY = 'xcrm_point_packets';
const MEMBER_COUPONS_KEY = 'xcrm_member_coupons';

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

const INITIAL_MEMBER_COUPONS: MemberCoupon[] = [
    {
        id: 'MC-001',
        memberId: 'MEM-001',
        couponTemplateId: 'COUP-001',
        code: 'WELCOME10',
        name: 'Welcome Discount',
        identifier: 'WEL-2024-001',
        earnTime: '2024-01-15T10:00:00Z',
        expiryTime: '2025-01-15T23:59:59Z',
        source: 'Points Mall',
        status: 'available',
    },
    {
        id: 'MC-002',
        memberId: 'MEM-001',
        couponTemplateId: 'COUP-002',
        code: 'BDAY20',
        name: 'Birthday Special',
        identifier: 'BDAY-2024-001',
        earnTime: '2024-06-20T00:00:00Z',
        expiryTime: '2024-07-20T23:59:59Z',
        source: 'Birthday Campaign',
        status: 'used',
        usedStore: 'Downtown Store',
        usedDate: '2024-06-25T14:30:00Z',
        usedNote: 'Applied to purchase #ORD-92445',
    },
    {
        id: 'MC-003',
        memberId: 'MEM-001',
        couponTemplateId: 'COUP-003',
        code: 'FREESHIP',
        name: 'Free Shipping',
        identifier: 'SHIP-2024-001',
        earnTime: '2024-11-01T10:00:00Z',
        expiryTime: '2024-11-30T23:59:59Z',
        source: 'Manual Issue',
        status: 'expired',
    },
    {
        id: 'MC-004',
        memberId: 'MEM-001',
        couponTemplateId: 'COUP-004',
        code: 'HOLIDAY25',
        name: 'Holiday Special 25% Off',
        identifier: 'HOL-2024-001',
        earnTime: '2024-12-01T00:00:00Z',
        expiryTime: '2025-12-31T23:59:59Z',
        source: 'Campaign',
        status: 'available',
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

const getStoredMemberCoupons = (): MemberCoupon[] => {
    const stored = localStorage.getItem(MEMBER_COUPONS_KEY);
    if (stored) {
        return JSON.parse(stored);
    }
    // Initialize with mock data
    localStorage.setItem(MEMBER_COUPONS_KEY, JSON.stringify(INITIAL_MEMBER_COUPONS));
    return INITIAL_MEMBER_COUPONS;
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
     * Calculate point summary statistics for a member (FR-MEM-03).
     */
    getPointsSummary: (memberId: string): PointsSummary => {
        const packets = getStoredPackets().filter(p => p.memberId === memberId);
        const logs = getStoredLogs().filter(l => l.memberId === memberId && l.type === 'point');
        const now = new Date();

        // Available = sum of remaining points from non-expired packets
        const availableBalance = packets
            .filter(p => new Date(p.expiryDate) >= now)
            .reduce((sum, p) => sum + p.remainingPoints, 0);

        // Lifetime earned = sum of all totalPoints from all packets
        const lifetimeEarned = packets.reduce((sum, p) => sum + p.totalPoints, 0);

        // Used = sum of negative changeValues from point logs (redemptions, adjustments)
        const used = logs
            .filter(l => typeof l.changeValue === 'number' && l.changeValue < 0)
            .reduce((sum, l) => sum + Math.abs(l.changeValue as number), 0);

        // Expired = totalPoints - remainingPoints from expired packets
        const expired = packets
            .filter(p => new Date(p.expiryDate) < now)
            .reduce((sum, p) => sum + (p.totalPoints - p.remainingPoints), 0);

        return { availableBalance, lifetimeEarned, used, expired };
    },

    // --- Member Coupon Methods (FR-MEM-07) ---

    /**
     * Get all coupons in a member's wallet.
     */
    getMemberCoupons: (memberId: string, status?: MemberCouponStatus): MemberCoupon[] => {
        const coupons = getStoredMemberCoupons();
        return coupons
            .filter(c => c.memberId === memberId && (!status || c.status === status))
            .sort((a, b) => new Date(b.earnTime).getTime() - new Date(a.earnTime).getTime());
    },

    /**
     * Get a single member coupon by ID.
     */
    getMemberCoupon: (couponId: string): MemberCoupon | undefined => {
        const coupons = getStoredMemberCoupons();
        return coupons.find(c => c.id === couponId);
    },

    /**
     * Manually redeem a coupon for a member.
     */
    redeemCouponManually: (couponId: string, form: ManualRedemptionForm): MemberCoupon | null => {
        const coupons = getStoredMemberCoupons();
        const index = coupons.findIndex(c => c.id === couponId);
        if (index === -1) return null;

        const coupon = coupons[index];
        if (coupon.status !== 'available') return null;

        const updatedCoupon: MemberCoupon = {
            ...coupon,
            status: 'used',
            usedStore: form.storeId,
            usedDate: form.redemptionTime,
            usedNote: `[${form.reasonCategory}] ${form.notes}`,
        };

        coupons[index] = updatedCoupon;
        localStorage.setItem(MEMBER_COUPONS_KEY, JSON.stringify(coupons));
        return updatedCoupon;
    },

    /**
     * Manually void a coupon for a member.
     */
    voidCouponManually: (couponId: string, form: ManualVoidForm): MemberCoupon | null => {
        const coupons = getStoredMemberCoupons();
        const index = coupons.findIndex(c => c.id === couponId);
        if (index === -1) return null;

        const coupon = coupons[index];
        if (coupon.status !== 'available') return null;

        const updatedCoupon: MemberCoupon = {
            ...coupon,
            status: 'voided',
            voidReason: form.reasonCategory,
            voidNote: form.notes,
            voidDate: new Date().toISOString(),
        };

        coupons[index] = updatedCoupon;
        localStorage.setItem(MEMBER_COUPONS_KEY, JSON.stringify(coupons));
        return updatedCoupon;
    },

    /**
     * Reset to initial mock data (for testing).
     */
    resetMockData: (): void => {
        localStorage.setItem(ASSET_LOGS_KEY, JSON.stringify(INITIAL_ASSET_LOGS));
        localStorage.setItem(POINT_PACKETS_KEY, JSON.stringify(INITIAL_POINT_PACKETS));
        localStorage.setItem(MEMBER_COUPONS_KEY, JSON.stringify(INITIAL_MEMBER_COUPONS));
    },
};

export default MockAssetService;
