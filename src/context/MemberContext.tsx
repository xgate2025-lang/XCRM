
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Member } from '../types';

// Enhanced Mock Data with valid phones and card numbers
const MOCK_MEMBERS: Member[] = [
  { 
    id: 'MEM-001', 
    firstName: 'Alina', 
    lastName: 'Sawayn', 
    email: 'alina@example.com', 
    phone: '+1 (555) 123-4567', 
    cardNo: '8839 2930 1234', 
    tier: 'Gold', 
    points: 12500, 
    joinDate: 'Jan 12, 2024', 
    status: 'Active', 
    avatar: 'https://i.pravatar.cc/150?u=1',
    lifetimeSpend: '$4,250.00',
    preferredLanguage: 'English',
    optInChannels: [{ channel: 'Email', optInTime: '2024-01-12' }],
    memberCode: 'MEM-001',
    memberCodeMode: 'manual',
    cardNoMode: 'manual'
  },
  { 
    id: 'MEM-002', 
    firstName: 'John', 
    lastName: 'Doe', 
    email: 'john.doe@example.com', 
    phone: '+1 (555) 987-6543', 
    cardNo: '8839 2930 5678', 
    tier: 'Silver', 
    points: 3400, 
    joinDate: 'Feb 28, 2024', 
    status: 'Active', 
    avatar: 'https://i.pravatar.cc/150?u=2',
    lifetimeSpend: '$1,120.00'
  },
  { 
    id: 'MEM-003', 
    firstName: 'Sarah', 
    lastName: 'Smith', 
    email: 'sarah@example.com', 
    phone: '+1 (555) 456-7890', 
    cardNo: '8839 2930 9012', 
    tier: 'Platinum', 
    points: 45000, 
    joinDate: 'Mar 15, 2023', 
    status: 'Active', 
    avatar: 'https://i.pravatar.cc/150?u=3',
    lifetimeSpend: '$12,450.00'
  },
  { 
    id: 'MEM-004', 
    firstName: 'Michael', 
    lastName: 'Brown', 
    email: 'mike.b@example.com', 
    phone: '+1 (555) 234-5678', 
    cardNo: '8839 2930 3456', 
    tier: 'Bronze', 
    points: 120, 
    joinDate: 'Dec 01, 2023', 
    status: 'Inactive', 
    avatar: 'https://i.pravatar.cc/150?u=4',
    lifetimeSpend: '$150.00'
  },
  { 
    id: 'MEM-005', 
    firstName: 'Emily', 
    lastName: 'Davis', 
    email: 'emily.d@example.com', 
    phone: '+1 (555) 876-5432', 
    cardNo: '8839 2930 7890', 
    tier: 'Gold', 
    points: 11200, 
    joinDate: 'Nov 10, 2023', 
    status: 'Active', 
    avatar: 'https://i.pravatar.cc/150?u=5',
    lifetimeSpend: '$3,890.00'
  }
];

interface MemberContextType {
  members: Member[];
  selectedMemberId: string | null;
  setSelectedMemberId: (id: string | null) => void;
  getMember: (id: string) => Member | undefined;
  addMember: (member: Partial<Member>) => void;
  updateMember: (id: string, updates: Partial<Member>) => void;
  filterOverride: string | null;
  setFilterOverride: (filter: string | null) => void;
}

const MemberContext = createContext<MemberContextType | undefined>(undefined);

export const MemberProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [members, setMembers] = useState<Member[]>(MOCK_MEMBERS);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [filterOverride, setFilterOverride] = useState<string | null>(null);

  const getMember = (id: string) => {
    return members.find(m => m.id === id);
  };

  const addMember = (memberData: Partial<Member>) => {
    const newMember: Member = {
      id: memberData.memberCode || `MEM-${Math.floor(1000 + Math.random() * 9000)}`,
      firstName: memberData.firstName || '',
      lastName: memberData.lastName || '',
      email: memberData.email || '',
      phone: memberData.phone || '',
      cardNo: memberData.cardNo || '',
      tier: memberData.initialTier || 'Bronze',
      points: 0,
      joinDate: memberData.joinDate || new Date().toISOString().split('T')[0],
      status: 'Active',
      avatar: `https://i.pravatar.cc/150?u=${Math.random()}`,
      lifetimeSpend: '$0.00',
      ...memberData
    };
    setMembers(prev => [newMember, ...prev]);
  };

  const updateMember = (id: string, updates: Partial<Member>) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
  };

  return (
    <MemberContext.Provider value={{ 
        members, 
        selectedMemberId, 
        setSelectedMemberId,
        getMember,
        addMember,
        updateMember,
        filterOverride,
        setFilterOverride
    }}>
      {children}
    </MemberContext.Provider>
  );
};

export const useMember = () => {
  const context = useContext(MemberContext);
  if (context === undefined) {
    throw new Error('useMember must be used within a MemberProvider');
  }
  return context;
};
