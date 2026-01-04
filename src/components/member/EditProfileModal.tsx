
import React, { useState, useEffect } from 'react';
import { 
  X, User, Mail, Phone, Calendar, MapPin, 
  Shield, Globe, Smartphone, Hash, UserCheck,
  Languages, Send, Zap, CreditCard, ToggleRight,
  ToggleLeft, Save, Loader2, Sparkles, ChevronDown
} from 'lucide-react';
import { Member, OptInChannel } from '../../types';
import { useMember } from '../../context/MemberContext';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: Member | undefined;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose, initialData }) => {
  const { addMember, updateMember } = useMember();
  const [loading, setLoading] = useState(false);
  
  // --- Form State ---
  const [formData, setFormData] = useState<Partial<Member>>({
    memberCodeMode: 'auto',
    cardNoMode: 'auto',
    countryCode: '+852',
    title: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: '',
    birthday: '',
    ageGroup: '',
    country: '',
    state: '',
    city: '',
    street: '',
    addressLine2: '',
    preferredLanguage: 'English',
    optInChannels: [],
    initialTier: 'Bronze',
    joinDate: new Date().toISOString().split('T')[0]
  });

  // Buffers for manual inputs when toggling from auto
  const [manualCodeBuffer, setManualCodeBuffer] = useState('');
  const [manualCardBuffer, setManualCardBuffer] = useState('');

  // --- Logic Heuristics ---

  // Auto-calculate Age Group from Birthday
  useEffect(() => {
    if (formData.birthday) {
      const birthYear = new Date(formData.birthday).getFullYear();
      const currentYear = new Date().getFullYear();
      const age = currentYear - birthYear;
      
      let cluster = "";
      if (age < 18) cluster = "Under 18";
      else if (age <= 24) cluster = "18-24";
      else if (age <= 34) cluster = "25-34";
      else if (age <= 44) cluster = "35-44";
      else if (age <= 54) cluster = "45-54";
      else cluster = "55+";

      setFormData(prev => ({ ...prev, ageGroup: cluster }));
    }
  }, [formData.birthday]);

  // Identity Sync: Card No mirrors Member Code if in 'auto' mode (Constraint #1)
  useEffect(() => {
    if (formData.cardNoMode === 'auto') {
      setFormData(prev => ({ ...prev, cardNo: prev.memberCode }));
    }
  }, [formData.memberCode, formData.cardNoMode]);

  // Load initial data or reset for new member
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({ ...initialData });
        if (initialData.memberCodeMode === 'manual') setManualCodeBuffer(initialData.memberCode || '');
        if (initialData.cardNoMode === 'manual') setManualCardBuffer(initialData.cardNo || '');
      } else {
        const autoID = 'SYS-' + Math.floor(1000 + Math.random() * 9000);
        setFormData({
          memberCodeMode: 'auto',
          memberCode: autoID,
          cardNoMode: 'auto',
          cardNo: autoID,
          countryCode: '+852',
          status: 'Active',
          initialTier: 'Bronze',
          joinDate: new Date().toISOString().split('T')[0],
          optInChannels: [],
          preferredLanguage: 'English'
        });
        setManualCodeBuffer('');
        setManualCardBuffer('');
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  // --- Interaction Handlers ---

  const handleCodeModeToggle = (mode: 'auto' | 'manual') => {
    if (mode === 'auto') {
        const autoID = 'SYS-' + Math.floor(1000 + Math.random() * 9000);
        setFormData(prev => ({ ...prev, memberCodeMode: 'auto', memberCode: autoID }));
    } else {
        setFormData(prev => ({ ...prev, memberCodeMode: 'manual', memberCode: manualCodeBuffer }));
    }
  };

  const handleCardModeToggle = (mode: 'auto' | 'manual') => {
    if (mode === 'auto') {
      setFormData(prev => ({ ...prev, cardNoMode: 'auto', cardNo: prev.memberCode }));
    } else {
      setFormData(prev => ({ ...prev, cardNoMode: 'manual', cardNo: manualCardBuffer }));
    }
  };

  const handleChannelToggle = (channelName: OptInChannel['channel']) => {
    const currentChannels = formData.optInChannels || [];
    const exists = currentChannels.find(c => c.channel === channelName);
    
    if (exists) {
      setFormData(prev => ({
        ...prev,
        optInChannels: currentChannels.filter(c => c.channel !== channelName)
      }));
    } else {
      // Conditional opt-in date picker defaults to current date for audit compliance (Constraint #2)
      setFormData(prev => ({
        ...prev,
        optInChannels: [
          ...currentChannels,
          { channel: channelName, optInTime: new Date().toISOString().split('T')[0] }
        ]
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate network processing for the Audit Vibration
    setTimeout(() => {
      if (initialData) {
        updateMember(initialData.id, formData);
      } else {
        addMember(formData);
      }
      setLoading(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-[2px] animate-in fade-in duration-200">
      <div className="bg-white rounded-5xl shadow-2xl w-full max-w-4xl animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[95vh]">
        
        {/* 1. MODAL SHELL & GLOBAL CONTROLS */}
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary-200">
                    <User size={24} />
                </div>
                <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">
                        {initialData ? 'Update Member Profile' : 'Register New Member'}
                    </h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">CRM Strategic Record Management</p>
                </div>
            </div>
            <button 
                onClick={onClose} 
                className="p-2 rounded-full text-slate-300 hover:text-slate-600 hover:bg-white transition-all shadow-none hover:shadow-sm"
                aria-label="Close modal"
            >
                <X size={24} />
            </button>
        </div>

        {/* Scrollable Form Body */}
        <form id="member-edit-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-10 space-y-12 no-scrollbar">
            
            {/* ZONE I: CORE IDENTITY (BIOLOGICAL PROFILE) */}
            <section className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                    <Shield size={18} className="text-primary-500" />
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">I. Core Identity</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Member Code Logic */}
                    <div className="md:col-span-1">
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-3">Member Identification Strategy</label>
                        <div className="space-y-3">
                            <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
                                <button 
                                    type="button" 
                                    onClick={() => handleCodeModeToggle('auto')}
                                    className={`px-4 py-1.5 text-[9px] font-black uppercase rounded-lg transition-all ${formData.memberCodeMode === 'auto' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    System Auto
                                </button>
                                <button 
                                    type="button" 
                                    onClick={() => handleCodeModeToggle('manual')}
                                    className={`px-4 py-1.5 text-[9px] font-black uppercase rounded-lg transition-all ${formData.memberCodeMode === 'manual' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    Manual Entry
                                </button>
                            </div>
                            
                            <div className="relative">
                                <Hash size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" />
                                <input 
                                    type="text" 
                                    readOnly={formData.memberCodeMode === 'auto'}
                                    value={formData.memberCode}
                                    onChange={(e) => {
                                        setFormData({ ...formData, memberCode: e.target.value });
                                        setManualCodeBuffer(e.target.value);
                                    }}
                                    className={`w-full pl-9 pr-4 py-2.5 rounded-xl text-sm font-bold transition-all border-2 ${
                                        formData.memberCodeMode === 'auto' 
                                        ? 'bg-slate-50 border-slate-100 text-slate-400 italic font-mono' 
                                        : 'bg-white border-slate-200 text-slate-900 focus:border-primary-500 outline-none'
                                    }`}
                                    placeholder="Enter unique ID..."
                                />
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-1">
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-3">Title</label>
                        <div className="relative">
                            <UserCheck size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <select 
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 appearance-none focus:ring-2 focus:ring-primary-100 outline-none"
                            >
                                <option value="">Select salutation...</option>
                                <option>Mr.</option>
                                <option>Mrs.</option>
                                <option>Ms.</option>
                                <option>Dr.</option>
                                <option>Prof.</option>
                            </select>
                            <ChevronDownIcon />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">First Name</label>
                        <input 
                            type="text" 
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:border-primary-500 focus:bg-white outline-none transition-all"
                            placeholder="e.g. John"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Last Name</label>
                        <input 
                            type="text" 
                            value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:border-primary-500 focus:bg-white outline-none transition-all"
                            placeholder="e.g. Doe"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Mobile Phone</label>
                        <div className="flex gap-3">
                            <div className="relative w-28 shrink-0">
                                <select 
                                    value={formData.countryCode}
                                    onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-black text-slate-700 appearance-none focus:border-primary-500 outline-none"
                                >
                                    <option>+852</option>
                                    <option>+86</option>
                                    <option>+1</option>
                                    <option>+44</option>
                                    <option>+65</option>
                                </select>
                                <ChevronDownIcon size={12} />
                            </div>
                            <div className="relative flex-1">
                                <Smartphone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input 
                                    type="tel" 
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:border-primary-500 outline-none transition-all"
                                    placeholder="9XXX XXXX"
                                />
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Email Address</label>
                        <div className="relative">
                            <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input 
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:border-primary-500 outline-none transition-all"
                                placeholder="customer@example.com"
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Gender</label>
                        <select 
                            value={formData.gender}
                            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 outline-none"
                        >
                            <option value="">Select...</option>
                            <option>Male</option>
                            <option>Female</option>
                            <option>Non-binary</option>
                            <option>Prefer not to say</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Birthday</label>
                        <div className="relative">
                            <Calendar size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input 
                                type="date"
                                value={formData.birthday}
                                onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:border-primary-500 outline-none transition-all"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Age Group</label>
                        <div className="relative">
                            <select 
                                value={formData.ageGroup}
                                onChange={(e) => setFormData({ ...formData, ageGroup: e.target.value })}
                                className="w-full px-4 py-2.5 bg-white border-2 border-primary-50 rounded-xl text-sm font-black text-primary-600 appearance-none focus:border-primary-200 outline-none"
                            >
                                <option value="">Auto-calculated...</option>
                                <option>Under 18</option>
                                <option>18-24</option>
                                <option>25-34</option>
                                <option>35-44</option>
                                <option>45-54</option>
                                <option>55+</option>
                            </select>
                            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                                <SparklesIcon />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ZONE II: LOGISTICS & RESIDENCE (PHYSICAL PROFILE) */}
            <section className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                    <MapPin size={18} className="text-primary-500" />
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">II. Logistics & Residence</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Country / Region</label>
                        <div className="relative">
                            <Globe size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <select 
                                value={formData.country}
                                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 outline-none appearance-none"
                            >
                                <option value="">Choose region...</option>
                                <option>Hong Kong SAR</option>
                                <option>Mainland China</option>
                                <option>Singapore</option>
                                <option>Taiwan</option>
                                <option>United Kingdom</option>
                                <option>USA</option>
                            </select>
                            <ChevronDownIcon />
                        </div>
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">State / Province</label>
                        <input 
                            type="text"
                            value={formData.state}
                            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:border-primary-500 outline-none"
                            placeholder="Territory or state"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">City / District</label>
                        <input 
                            type="text"
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:border-primary-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Street</label>
                        <input 
                            type="text"
                            value={formData.street}
                            onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:border-primary-500 outline-none"
                            placeholder="Number and Street name"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Structural Details (Detailed Address)</label>
                    <textarea 
                        value={formData.addressLine2}
                        onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:border-primary-500 focus:bg-white outline-none h-32 resize-none transition-all"
                        placeholder="Unit, Floor, Building Name, Estate..."
                    ></textarea>
                </div>
            </section>

            {/* ZONE III: COMMUNICATION & CONSENT (MARKETING PROFILE) */}
            <section className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                    <Globe size={18} className="text-primary-500" />
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">III. Communication & Consent</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-3">Preferred Marketing Language</label>
                        <div className="relative">
                            <Languages size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <select 
                                value={formData.preferredLanguage}
                                onChange={e => setFormData({...formData, preferredLanguage: e.target.value})}
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:border-primary-500 outline-none appearance-none"
                            >
                                <option>English</option>
                                <option>Traditional Chinese</option>
                                <option>Simplified Chinese</option>
                            </select>
                            <ChevronDownIcon />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Marketing Opt-in Channels (Audit Traceable)</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            { id: 'Email', icon: Mail, label: 'Email Newsletter' },
                            { id: 'SMS', icon: Smartphone, label: 'SMS Marketing' },
                            { id: 'Push', icon: Send, label: 'App Push Notification' },
                            { id: 'WhatsApp', icon: Languages, label: 'WhatsApp Direct' }
                        ].map((channel) => {
                            const optIn = (formData.optInChannels || []).find(c => c.channel === channel.id);
                            const isActive = !!optIn;
                            return (
                                <div key={channel.id} className={`p-5 rounded-2xl border transition-all duration-300 ${isActive ? 'bg-primary-50 border-primary-200 shadow-sm' : 'bg-slate-50 border-slate-100 opacity-60 hover:opacity-100'}`}>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isActive ? 'bg-primary-500 text-white shadow-lg shadow-primary-200' : 'bg-slate-200 text-slate-400'}`}>
                                                <channel.icon size={18} />
                                            </div>
                                            <div>
                                                <span className={`text-sm font-black block ${isActive ? 'text-primary-900' : 'text-slate-400'}`}>{channel.label}</span>
                                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">{isActive ? 'Status: Active' : 'Status: Disabled'}</span>
                                            </div>
                                        </div>
                                        <button 
                                            type="button"
                                            onClick={() => handleChannelToggle(channel.id as any)}
                                            className={`transition-colors ${isActive ? 'text-primary-600' : 'text-slate-300'}`}
                                        >
                                            {isActive ? <ToggleRight size={36} /> : <ToggleLeft size={36} />}
                                        </button>
                                    </div>
                                    {isActive && (
                                        <div className="animate-in fade-in slide-in-from-top-1">
                                            <label className="block text-[8px] font-black text-primary-400 uppercase mb-1.5 ml-0.5">Opt-in Effective Date</label>
                                            <div className="relative">
                                                <Calendar size={10} className="absolute left-2 top-1/2 -translate-y-1/2 text-primary-300" />
                                                <input 
                                                    type="date"
                                                    value={optIn.optInTime}
                                                    onChange={e => {
                                                        const updated = (formData.optInChannels || []).map(c => 
                                                            c.channel === channel.id ? { ...c, optInTime: e.target.value } : c
                                                        );
                                                        setFormData({ ...formData, optInChannels: updated });
                                                    }}
                                                    className="w-full bg-white border border-primary-100 rounded-lg pl-7 pr-2 py-1.5 text-xs font-bold text-primary-600 focus:outline-none focus:ring-1 focus:ring-primary-300 transition-all"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ZONE IV: PROGRAM ENROLLMENT (MEMBERSHIP PROFILE) */}
            <section className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                    <Zap size={18} className="text-primary-500" />
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">IV. Program Enrollment</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-3">Card Provisioning Strategy</label>
                        <div className="space-y-4">
                            <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
                                <button 
                                    type="button" 
                                    onClick={() => handleCardModeToggle('auto')}
                                    className={`px-5 py-2 text-[10px] font-black uppercase rounded-lg transition-all ${formData.cardNoMode === 'auto' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    Sync ID
                                </button>
                                <button 
                                    type="button" 
                                    onClick={() => handleCardModeToggle('manual')}
                                    className={`px-5 py-2 text-[10px] font-black uppercase rounded-lg transition-all ${formData.cardNoMode === 'manual' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    Manual Barcode
                                </button>
                            </div>
                            
                            <div className="relative">
                                <CreditCard size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" />
                                <input 
                                    type="text" 
                                    readOnly={formData.cardNoMode === 'auto'}
                                    value={formData.cardNo}
                                    onChange={(e) => {
                                        setFormData({ ...formData, cardNo: e.target.value });
                                        setManualCardBuffer(e.target.value);
                                    }}
                                    className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm font-bold border-2 transition-all ${
                                        formData.cardNoMode === 'auto' 
                                        ? 'bg-slate-50 border-slate-100 text-slate-400 italic font-mono' 
                                        : 'bg-white border-slate-200 text-slate-900 focus:border-primary-500 outline-none'
                                    }`}
                                    placeholder="Enter barcode or physical ID..."
                                />
                                {formData.cardNoMode === 'auto' && (
                                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[8px] font-black uppercase text-slate-300 tracking-widest bg-white/50 px-1.5 py-0.5 rounded">Locked</span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase mb-3">Initial Status Assignment</label>
                            <div className="relative">
                                <ChevronDownIcon />
                                <select 
                                    value={formData.initialTier}
                                    onChange={e => setFormData({...formData, initialTier: e.target.value})}
                                    className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:border-primary-500 outline-none appearance-none transition-all"
                                >
                                    <option>Bronze</option>
                                    <option>Silver</option>
                                    <option>Gold</option>
                                    <option>Platinum</option>
                                    <option>Diamond</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase mb-3">Enrolment Join Date</label>
                            <div className="relative">
                                <Calendar size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input 
                                    type="date"
                                    value={formData.joinDate}
                                    onChange={e => setFormData({...formData, joinDate: e.target.value})}
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:border-primary-500 outline-none transition-all"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </form>

        {/* COMMITMENT FOOTER */}
        <div className="px-8 py-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between shrink-0">
            <button 
                onClick={onClose} 
                className="px-6 py-3 text-sm font-black text-slate-400 hover:text-slate-700 transition-colors uppercase tracking-[0.2em]"
            >
                Discard Changes
            </button>
            
            <div className="flex items-center gap-4">
                <div className="hidden lg:flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mr-4">
                    <Shield size={12} className="text-green-500" /> Audit Logged Session
                </div>
                <button 
                    type="submit"
                    form="member-edit-form"
                    disabled={loading}
                    className="group px-10 py-3.5 bg-slate-900 text-white text-sm font-black rounded-2xl hover:bg-slate-800 shadow-xl shadow-slate-200 flex items-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70"
                >
                    {loading ? (
                        <Loader2 size={18} className="animate-spin text-primary-400" />
                    ) : (
                        <Save size={18} className="text-primary-400 group-hover:scale-110 transition-transform" />
                    )}
                    {initialData ? 'Sync Strategic Updates' : 'Commit Registration'}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

// --- Local Mini Components ---

const ChevronDownIcon = ({ size = 14 }) => (
    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none">
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="m6 9 6 6 6-6"/>
        </svg>
    </div>
);

const SparklesIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L12 3Z"/>
        <path d="M5 3v4"/>
        <path d="M19 17v4"/>
        <path d="M3 5h4"/>
        <path d="M17 19h4"/>
    </svg>
);

export default EditProfileModal;
