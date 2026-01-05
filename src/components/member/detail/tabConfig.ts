// Tab definitions for MemberDetail page
// This enables modular tab content implementation

export type MemberDetailTab = 'profile' | 'transactions' | 'tier' | 'points' | 'coupons' | 'log';

export interface TabConfig {
    id: MemberDetailTab;
    label: string;
    icon: string; // Lucide icon name for reference
}

export const MEMBER_DETAIL_TABS: TabConfig[] = [
    { id: 'profile', label: 'Profile', icon: 'User' },
    { id: 'transactions', label: 'Transactions', icon: 'ShoppingBag' },
    { id: 'tier', label: 'Tier Journey', icon: 'Crown' },
    { id: 'points', label: 'Points', icon: 'Coins' },
    { id: 'coupons', label: 'Coupons', icon: 'Ticket' },
    { id: 'log', label: 'Activity Log', icon: 'History' },
];

// Tier visual config utility
export const getTierConfig = (tier: string) => {
    switch (tier.toLowerCase()) {
        case 'platinum':
            return { gradient: 'from-cyan-500 to-blue-700', badge: 'bg-cyan-100 text-cyan-700 border-cyan-200' };
        case 'gold':
            return { gradient: 'from-yellow-400 to-amber-600', badge: 'bg-yellow-100 text-yellow-700 border-yellow-200' };
        case 'silver':
            return { gradient: 'from-slate-400 to-slate-600', badge: 'bg-slate-100 text-slate-700 border-slate-200' };
        case 'bronze':
            return { gradient: 'from-orange-400 to-orange-600', badge: 'bg-orange-100 text-orange-700 border-orange-200' };
        default:
            return { gradient: 'from-primary-500 to-primary-700', badge: 'bg-slate-100 text-slate-600' };
    }
};
