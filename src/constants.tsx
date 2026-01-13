
import { 
  LayoutDashboard, 
  Users, 
  Megaphone, 
  Package, 
  BarChart2, 
  Zap, 
  Settings 
} from 'lucide-react';
import { NavItem } from './types';

// Zone B: Operational Navigation
export const OPERATIONAL_NAV: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    id: 'member-list',
    label: 'Member',
    icon: Users,
  },
  {
    id: 'campaign',
    label: 'Campaign',
    icon: Megaphone,
  },
  {
    id: 'assets-coupon',
    label: 'Coupon',
    icon: Package,
  },
  {
    id: 'performance-analytics',
    label: 'Performance',
    icon: BarChart2,
  },
];

// Zone D: Configuration Navigation
export const CONFIG_NAV: NavItem[] = [
  {
    id: 'program',
    label: 'Program',
    icon: Zap,
    children: [
      { id: 'program-tier', label: 'Tier' },
      { id: 'program-point', label: 'Point' },
    ],
  },
  {
    id: 'setting',
    label: 'Setting',
    icon: Settings,
    children: [
      { id: 'settings-global', label: 'Global Settings' },
      { id: 'settings-integration', label: 'Integration Settings' },
      { id: 'settings-basic', label: 'Basic Data' },
    ],
  },
];
