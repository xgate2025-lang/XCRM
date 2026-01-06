
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CouponData, CouponStatus } from '../types';

interface CouponContextType {
  coupons: CouponData[];
  addCoupon: (coupon: CouponData) => void;
  updateCoupon: (id: string, updates: Partial<CouponData>) => void;
  replaceCoupon: (id: string, coupon: CouponData) => void;
  deleteCoupon: (id: string) => void;
  duplicateCoupon: (id: string) => void;
  toggleCouponStatus: (id: string) => void;
}

const CouponContext = createContext<CouponContextType | undefined>(undefined);

const INITIAL_COUPONS: CouponData[] = [
  {
    id: 'cpn_001',
    code: 'WELCOME10',
    name: 'New Member Welcome $10',
    displayName: '$10 Cash Voucher',
    type: 'cash',
    value: '$10',
    audience: ['All Tiers'],
    inventory: { total: 5000, used: 1240 },
    validity: { start: '2024-01-01', end: null, isRolling: true },
    status: 'Live',
    revenue: 12400
  },
  {
    id: 'cpn_002',
    code: 'GOLD20OFF',
    name: 'Gold Tier Anniversary 20%',
    displayName: '20% Discount',
    type: 'percentage',
    value: '20%',
    audience: ['Gold', 'Platinum'],
    inventory: { total: 1000, used: 850 },
    validity: { start: '2024-06-01', end: '2024-12-31' },
    status: 'Live',
    revenue: 45200
  },
  {
    id: 'cpn_003',
    code: 'FLASH_SHIP',
    name: 'Weekend Free Shipping',
    displayName: 'Free Standard Shipping',
    type: 'shipping',
    value: 'FREE',
    audience: ['All Tiers'],
    inventory: { total: 10000, used: 2100 },
    validity: { start: '2024-12-14', end: '2024-12-16' },
    status: 'Scheduled',
    revenue: 0
  }
];

export const CouponProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [coupons, setCoupons] = useState<CouponData[]>(INITIAL_COUPONS);

  const addCoupon = (coupon: CouponData) => {
    setCoupons(prev => [coupon, ...prev]);
  };

  const updateCoupon = (id: string, updates: Partial<CouponData>) => {
    setCoupons(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const replaceCoupon = (id: string, coupon: CouponData) => {
    setCoupons(prev => {
      const existingIndex = prev.findIndex(c => c.id === id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = coupon;
        return updated;
      }
      // If not found, add to beginning
      return [coupon, ...prev];
    });
  };

  const deleteCoupon = (id: string) => {
    setCoupons(prev => prev.filter(c => c.id !== id));
  };

  const duplicateCoupon = (id: string) => {
    const existing = coupons.find(c => c.id === id);
    if (!existing) return;
    const newCoupon: CouponData = {
      ...existing,
      id: `cpn_${Math.random().toString(36).substr(2, 9)}`,
      name: `${existing.name} (Copy)`,
      code: `${existing.code}_COPY`,
      status: 'Paused',
      revenue: 0,
      inventory: { ...existing.inventory, used: 0 }
    };
    setCoupons(prev => [newCoupon, ...prev]);
  };

  const toggleCouponStatus = (id: string) => {
    setCoupons(prev => prev.map(c => {
      if (c.id !== id) return c;
      const newStatus: CouponStatus = c.status === 'Paused' ? 'Live' : 'Paused';
      return { ...c, status: newStatus };
    }));
  };

  return (
    <CouponContext.Provider value={{
        coupons,
        addCoupon,
        updateCoupon,
        replaceCoupon,
        deleteCoupon,
        duplicateCoupon,
        toggleCouponStatus
    }}>
      {children}
    </CouponContext.Provider>
  );
};

export const useCoupon = () => {
  const context = useContext(CouponContext);
  if (context === undefined) {
    throw new Error('useCoupon must be used within a CouponProvider');
  }
  return context;
};
