import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Cell
} from 'recharts';
import { 
  Users, Award, 
  Calendar, Bell, Plus, Search, ChevronDown, ChevronRight, ArrowRight,
  FileText, MessageCircle, Settings
} from 'lucide-react';

// --- Mock Data ---
const activityData = [
  { name: 'Mon', value: 4000 },
  { name: 'Tue', value: 3000 },
  { name: 'Wed', value: 5000 }, // Higher middle
  { name: 'Thu', value: 2780 },
  { name: 'Fri', value: 1890 },
  { name: 'Sat', value: 2390 },
  { name: 'Sun', value: 3490 },
];

const transactions = [
  { id: 'WWX123XZ', name: 'Amazon Support', type: 'Send', date: '12 Jan 2024', time: '08.00 AM', amount: '$10.00', balance: '=$56', status: 'Success', icon: 'A', color: 'bg-orange-100 text-orange-600' },
  { id: 'WWX123XZ', name: 'Upwork', type: 'Receive', date: '12 Jan 2024', time: '08.00 AM', amount: '$150.00', balance: '+$150', status: 'Pending', icon: 'U', color: 'bg-green-100 text-green-600' },
  { id: 'WWX123XZ', name: 'EA Games', type: 'Send', date: '12 Jan 2024', time: '08.00 AM', amount: '$59.00', balance: '=$56', status: 'Pending', icon: 'E', color: 'bg-red-100 text-red-600' },
  { id: 'WWX123XZ', name: 'Apple Inc', type: 'Send', date: '12 Jan 2024', time: '08.00 AM', amount: '$999.00', balance: '=$56', status: 'Cancelled', icon: 'A', color: 'bg-slate-100 text-slate-600' },
];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<'history' | 'upcoming'>('history');
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);

  return (
    <div className="space-y-5 animate-in fade-in duration-500 pb-10">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Good Morning, Matt!</h1>
          <p className="text-slate-500 mt-2 text-lg">Welcome to Loyalty Management Dashboard</p>
        </div>
        
        {/* Search & Profile Actions */}
        <div className="flex items-center gap-4">

            {/* Product Switcher */}
            <div className="hidden xl:flex items-center bg-white rounded-full border border-slate-200 shadow-sm relative z-50">
                <div className="flex items-center gap-2 px-4 py-2.5 border-r border-slate-200">
                    <FileText size={18} className="text-slate-500" />
                    <span className="font-bold text-slate-700 text-sm">Loyalty Admin</span>
                </div>
                <div 
                    className="flex items-center gap-2 px-4 py-2.5 cursor-pointer hover:bg-slate-50 rounded-r-full transition-colors select-none"
                    onClick={() => setIsProductDropdownOpen(!isProductDropdownOpen)}
                >
                    <span className="text-slate-500 text-sm font-medium">Switch Product</span>
                    <ChevronDown 
                        size={14} 
                        className={`text-slate-400 transition-transform duration-200 ${isProductDropdownOpen ? 'rotate-180' : ''}`} 
                    />
                </div>

                {/* Dropdown Menu */}
                {isProductDropdownOpen && (
                    <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Available Products</div>
                        
                        <div className="px-4 py-3 hover:bg-slate-50 cursor-pointer flex items-center gap-3 transition-colors group">
                             <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center text-green-600 group-hover:scale-105 transition-transform">
                                <MessageCircle size={20} />
                             </div>
                             <div>
                                <div className="text-sm font-bold text-slate-700">DIY WhatsApp</div>
                                <div className="text-xs text-slate-400">Campaign Manager</div>
                             </div>
                        </div>

                        <div className="px-4 py-3 hover:bg-slate-50 cursor-pointer flex items-center gap-3 transition-colors group">
                             <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 group-hover:scale-105 transition-transform">
                                <Settings size={20} />
                             </div>
                             <div>
                                <div className="text-sm font-bold text-slate-700">Admin Console</div>
                                <div className="text-xs text-slate-400">System Configuration</div>
                             </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="hidden md:flex items-center bg-white px-4 py-2.5 rounded-full border border-slate-200 shadow-sm w-64">
                <Search size={18} className="text-slate-400 mr-2" />
                <input type="text" placeholder="Search" className="bg-transparent border-none outline-none text-sm w-full placeholder:text-slate-400" />
            </div>
            <button className="p-3 text-slate-400 hover:text-slate-600 bg-white rounded-full border border-slate-200 shadow-sm transition-colors relative">
                <Bell size={20} />
                <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border border-slate-200">
                 <img src="https://picsum.photos/200" alt="Profile" className="w-full h-full object-cover" />
            </div>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        
        {/* Left Column: Activity Graph & Invite Friend */}
        <div className="xl:col-span-1 space-y-5 min-w-0">
            {/* Activity Graph Card */}
            <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200 flex flex-col min-w-0">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Activity Graph</h3>
                        <div className="text-4xl font-extrabold text-slate-900">$ 256K</div>
                    </div>
                    <button className="text-xs font-bold text-primary-500 hover:text-primary-700 flex items-center uppercase tracking-wide">
                        See More <ChevronRight size={14} className="ml-1" />
                    </button>
                </div>
                
                {/* Chart Area - Using strict inline styles to fix Recharts 'width(-1)' warning */}
                <div style={{ width: '100%', height: 250, minWidth: 0 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={activityData} barSize={24}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis 
                                    dataKey="name" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 500}} 
                                    dy={10} 
                                />
                                <Tooltip 
                                    cursor={{fill: 'transparent'}}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="value" radius={[10, 10, 10, 10]}>
                                    {activityData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index === 2 ? '#055DDB' : '#38bdf8'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                </div>

                {/* In-card Navigation List */}
                <div className="mt-8 space-y-3">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl cursor-pointer hover:bg-slate-100 transition-colors group">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-500">
                                    <Award size={20} />
                                </div>
                                <span className="font-bold text-slate-700">Goals</span>
                            </div>
                            <ChevronRight size={20} className="text-slate-400 group-hover:text-slate-600" />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl cursor-pointer hover:bg-slate-100 transition-colors group">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-500">
                                    <Calendar size={20} />
                                </div>
                                <span className="font-bold text-slate-700">Monthly Plan</span>
                            </div>
                            <ChevronRight size={20} className="text-slate-400 group-hover:text-slate-600" />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl cursor-pointer hover:bg-slate-100 transition-colors group">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-500">
                                    <Users size={20} />
                                </div>
                                <span className="font-bold text-slate-700">Settings</span>
                            </div>
                            <ChevronRight size={20} className="text-slate-400 group-hover:text-slate-600" />
                    </div>
                </div>
            </div>

            {/* Invite Friend (Moved from Sidebar) */}
            <div className="relative overflow-hidden rounded-3xl bg-brand-gradient p-5 text-white text-center shadow-xl shadow-slate-200">
                {/* Abstract bg shapes */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-black opacity-10 rounded-full -ml-16 -mb-16 blur-2xl"></div>
                
                <h4 className="relative z-10 text-xl font-bold mb-3">Invite your friend by referral code</h4>
                <p className="relative z-10 text-sm text-white/80 mb-8 leading-relaxed max-w-xs mx-auto">
                    Maximize rewards - Share your unique referral code for exclusive benefits!
                </p>
                <button className="relative z-10 w-40 mx-auto py-3 bg-white text-primary-500 rounded-2xl text-sm font-bold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 shadow-sm">
                    Invite Now <ArrowRight size={16} />
                </button>
            </div>
        </div>

        {/* Right Column: Payment Overview & Quick Send & Recent Activity */}
        <div className="xl:col-span-2 space-y-5 min-w-0">
            
            {/* Top Row: Payment Overview + Quick Send */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* Payment Overview */}
                <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200">
                    <h3 className="text-lg font-bold text-slate-900 mb-1">Payment Overview</h3>
                    <p className="text-slate-500 text-sm mb-6">View your income in a certain period of time</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <PastelCard 
                            title="Murabahah" 
                            amount="$1.00" 
                            color="bg-pastel-peach" 
                            textColor="text-slate-800"
                        />
                        <PastelCard 
                            title="Ijarah" 
                            amount="$20.198" 
                            color="bg-pastel-blue" 
                            textColor="text-slate-800"
                        />
                        <PastelCard 
                            title="Mushakarah" 
                            amount="$43.092" 
                            color="bg-pastel-green" 
                            textColor="text-slate-800"
                        />
                        <PastelCard 
                            title="Istisna" 
                            amount="$12.662" 
                            color="bg-pastel-purple" 
                            textColor="text-slate-800"
                        />
                    </div>
                </div>

                {/* Quick Send */}
                <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200">
                    <h3 className="text-lg font-bold text-slate-900 mb-6">Quick send</h3>
                    <p className="text-slate-500 text-sm mb-6">View your income in a certain period of time</p>
                    
                    {/* Avatars */}
                    <div className="flex items-center gap-2 mb-8 overflow-x-auto no-scrollbar pb-2">
                        {[1,2,3,4,5].map(i => (
                                <div key={i} className="w-12 h-12 rounded-full border-2 border-white shadow-sm flex-shrink-0 relative cursor-pointer hover:scale-110 transition-transform">
                                <img src={`https://picsum.photos/100?random=${i}`} className="w-full h-full rounded-full object-cover" alt="User" />
                                </div>
                        ))}
                        <button className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 flex-shrink-0">
                            <ChevronRight size={20} />
                        </button>
                    </div>

                    {/* Amount Input */}
                    <div className="bg-slate-50 rounded-2xl p-4 mb-6 flex items-center justify-between">
                            <div>
                            <span className="text-xs text-slate-400 font-semibold uppercase">Enter Amount</span>
                            <div className="text-2xl font-bold text-slate-900 flex items-baseline">
                                100,000 <span className="text-slate-300 ml-1 text-xl">0</span>
                            </div>
                            <div className="text-xs text-primary-500 font-medium mt-1">Balance: $185.389</div>
                            </div>
                            <div className="h-8 w-12 bg-white rounded border border-slate-200 flex items-center justify-center">
                                <span className="font-bold text-xs italic text-slate-800">VISA</span>
                            </div>
                    </div>

                    <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-semibold text-lg hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
                        Send
                    </button>
                </div>
            </div>

            {/* Recent Activity Card */}
            <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">Recent activity</h3>
                        <p className="text-slate-500 text-sm">View your recent transaction</p>
                    </div>
                    <div className="flex items-center gap-3">
                            {/* Date Picker (Mock) */}
                            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-slate-200 text-sm font-medium text-slate-600 shadow-sm cursor-pointer hover:bg-slate-50">
                                <Calendar size={16} />
                                <span>12 Jan - 12 Feb</span>
                                <ChevronDown size={14} className="ml-1 text-slate-400" />
                            </div>
                            <button className="p-2 rounded-full bg-primary-500 text-white shadow-lg shadow-primary-200 hover:bg-primary-600 transition-all">
                                <Plus size={20} />
                            </button>
                    </div>
                </div>

                {/* Toggle Pills */}
                <div className="flex gap-2 mb-3">
                    <button 
                        onClick={() => setActiveTab('history')}
                        className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${activeTab === 'history' ? 'bg-slate-900 text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                    >
                        History
                    </button>
                    <button 
                        onClick={() => setActiveTab('upcoming')}
                        className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${activeTab === 'upcoming' ? 'bg-slate-900 text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                    >
                        Upcoming
                    </button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50/50">
                            <tr>
                                <th className="px-6 py-4 text-left">
                                    <div className="w-5 h-5 rounded border border-slate-300 bg-white"></div>
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Name/Business</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider hidden sm:table-cell">Invoice ID</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Fee</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Balance</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {transactions.map((trx, idx) => (
                                <tr key={idx} className="group hover:bg-slate-50/80 transition-colors">
                                    <td className="px-6 py-3">
                                        <div className="w-5 h-5 rounded border border-slate-300 bg-white cursor-pointer hover:border-primary-500"></div>
                                    </td>
                                    <td className="px-6 py-3">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${trx.color}`}>
                                                {trx.icon}
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-800">{trx.name}</div>
                                                <div className="text-xs text-slate-400 font-medium">{trx.type}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-3">
                                        <div className="text-sm font-semibold text-slate-700">{trx.date}</div>
                                        <div className="text-xs text-slate-400">at {trx.time}</div>
                                    </td>
                                    <td className="px-6 py-3 hidden sm:table-cell text-sm text-slate-500 font-medium">
                                        {trx.id}
                                    </td>
                                    <td className="px-6 py-3 text-sm font-bold text-slate-800">
                                        {trx.amount}
                                    </td>
                                    <td className="px-6 py-3 text-sm font-bold text-slate-800">
                                        {trx.balance}
                                    </td>
                                    <td className="px-6 py-3">
                                        <StatusBadge status={trx.status} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

// --- Helper Components ---

const PastelCard = ({ title, amount, color, textColor }: { title: string, amount: string, color: string, textColor: string }) => (
    <div className={`${color} p-6 rounded-3xl flex flex-col justify-between h-40 transition-transform hover:scale-[1.02] cursor-pointer`}>
        <div className={`text-sm font-medium ${textColor} opacity-80`}>{title}</div>
        <div className={`text-4xl font-extrabold ${textColor} tracking-tight`}>{amount}</div>
    </div>
);

const StatusBadge = ({ status }: { status: string }) => {
    let styles = "";
    if (status === 'Success') styles = "bg-green-100 text-green-700 border-green-200";
    else if (status === 'Pending') styles = "bg-amber-100 text-amber-700 border-amber-200";
    else styles = "bg-red-100 text-red-700 border-red-200";

    return (
        <span className={`px-4 py-1.5 rounded-full text-xs font-bold border ${styles}`}>
            {status}
        </span>
    );
};

export default Dashboard;