import React, { useState, useEffect } from 'react';
import {
    Shield,
    MapPin,
    Globe,
    Zap,
    User,
    Mail,
    Phone,
    Calendar,
    Smartphone,
    Languages,
    CreditCard,
    ChevronDown,
    Sparkles,
} from 'lucide-react';
import { Member, OptInChannel } from '../../../types';
import MemberCodeToggle from './MemberCodeToggle';
import MarketingPreferences from './MarketingPreferences';

interface MemberFormProps {
    initialData?: Partial<Member>;
    onChange: (data: Partial<Member>) => void;
}

const COUNTRY_CODES = ['+852', '+86', '+1', '+44', '+65', '+81'];
const TITLES = ['Mr.', 'Mrs.', 'Ms.', 'Dr.', 'Prof.'];
const GENDERS = ['Male', 'Female', 'Non-binary', 'Prefer not to say'];
const TIERS = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'];
const COUNTRIES = ['Hong Kong SAR', 'Mainland China', 'Singapore', 'Taiwan', 'United Kingdom', 'USA'];
const LANGUAGES = ['English', 'Traditional Chinese', 'Simplified Chinese'];

/**
 * Unified Member Form with logical groupings:
 * - Zone I: Core Identity (Basic Info)
 * - Zone II: Logistics & Residence (Address)
 * - Zone III: Communication & Consent (Marketing)
 * - Zone IV: Program Enrollment (Membership)
 */
const MemberForm: React.FC<MemberFormProps> = ({ initialData, onChange }) => {
    const [formData, setFormData] = useState<Partial<Member>>({
        memberCodeMode: 'auto',
        memberCode: '',
        cardNoMode: 'auto',
        cardNo: '',
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
        joinDate: new Date().toISOString().split('T')[0],
        ...initialData,
    });

    // Initialize auto-generated code if needed
    useEffect(() => {
        if (formData.memberCodeMode === 'auto' && !formData.memberCode) {
            const autoId = `SYS-${Math.floor(1000 + Math.random() * 9000)}`;
            updateField('memberCode', autoId);
        }
    }, []);

    // Age Group Auto-Calculation from Birthday
    useEffect(() => {
        if (formData.birthday) {
            const birthYear = new Date(formData.birthday).getFullYear();
            const currentYear = new Date().getFullYear();
            const age = currentYear - birthYear;

            let cluster = '';
            if (age < 18) cluster = 'Under 18';
            else if (age <= 24) cluster = '18-24';
            else if (age <= 34) cluster = '25-34';
            else if (age <= 44) cluster = '35-44';
            else if (age <= 54) cluster = '45-54';
            else cluster = '55+';

            if (formData.ageGroup !== cluster) {
                updateField('ageGroup', cluster);
            }
        }
    }, [formData.birthday]);

    // Card Number Sync: Mirrors Member Code in 'auto' mode
    useEffect(() => {
        if (formData.cardNoMode === 'auto' && formData.cardNo !== formData.memberCode) {
            updateField('cardNo', formData.memberCode || '');
        }
    }, [formData.memberCode, formData.cardNoMode]);

    const updateField = (key: keyof Member, value: any) => {
        setFormData((prev) => {
            const updated = { ...prev, [key]: value };
            onChange(updated);
            return updated;
        });
    };

    const handleOptInChange = (channels: OptInChannel[]) => {
        updateField('optInChannels', channels);
    };

    return (
        <div className="space-y-12">
            {/* ZONE I: CORE IDENTITY */}
            <section className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                    <Shield size={18} className="text-primary-500" />
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">
                        I. Core Identity
                    </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Member Code Toggle */}
                    <div className="md:col-span-1">
                        <MemberCodeToggle
                            mode={formData.memberCodeMode || 'auto'}
                            value={formData.memberCode || ''}
                            onModeChange={(mode) => updateField('memberCodeMode', mode)}
                            onValueChange={(value) => updateField('memberCode', value)}
                        />
                    </div>

                    {/* Title */}
                    <div className="md:col-span-1">
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-3">
                            Title
                        </label>
                        <div className="relative">
                            <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <select
                                value={formData.title}
                                onChange={(e) => updateField('title', e.target.value)}
                                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 appearance-none focus:ring-2 focus:ring-primary-100 outline-none"
                            >
                                <option value="">Select salutation...</option>
                                {TITLES.map((t) => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                            <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                        </div>
                    </div>
                </div>

                {/* Names */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">
                            First Name
                        </label>
                        <input
                            type="text"
                            value={formData.firstName}
                            onChange={(e) => updateField('firstName', e.target.value)}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:border-primary-500 focus:bg-white outline-none transition-all"
                            placeholder="e.g. John"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">
                            Last Name
                        </label>
                        <input
                            type="text"
                            value={formData.lastName}
                            onChange={(e) => updateField('lastName', e.target.value)}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:border-primary-500 focus:bg-white outline-none transition-all"
                            placeholder="e.g. Doe"
                        />
                    </div>
                </div>

                {/* Contact */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">
                            Mobile Phone
                        </label>
                        <div className="flex gap-3">
                            <div className="relative w-28 shrink-0">
                                <select
                                    value={formData.countryCode}
                                    onChange={(e) => updateField('countryCode', e.target.value)}
                                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-black text-slate-700 appearance-none focus:border-primary-500 outline-none"
                                >
                                    {COUNTRY_CODES.map((code) => (
                                        <option key={code} value={code}>{code}</option>
                                    ))}
                                </select>
                                <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                            </div>
                            <div className="relative flex-1">
                                <Smartphone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => updateField('phone', e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:border-primary-500 outline-none transition-all"
                                    placeholder="9XXX XXXX"
                                />
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => updateField('email', e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:border-primary-500 outline-none transition-all"
                                placeholder="customer@example.com"
                            />
                        </div>
                    </div>
                </div>

                {/* Demographics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">
                            Gender
                        </label>
                        <select
                            value={formData.gender}
                            onChange={(e) => updateField('gender', e.target.value)}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 outline-none appearance-none"
                        >
                            <option value="">Select...</option>
                            {GENDERS.map((g) => (
                                <option key={g} value={g}>{g}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">
                            Birthday
                        </label>
                        <div className="relative">
                            <Calendar size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="date"
                                value={formData.birthday}
                                onChange={(e) => updateField('birthday', e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:border-primary-500 outline-none transition-all"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">
                            Age Group
                        </label>
                        <div className="relative">
                            <select
                                value={formData.ageGroup}
                                onChange={(e) => updateField('ageGroup', e.target.value)}
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
                                <Sparkles size={14} className="text-primary-400" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ZONE II: LOGISTICS & RESIDENCE */}
            <section className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                    <MapPin size={18} className="text-primary-500" />
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">
                        II. Logistics & Residence
                    </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">
                            Country / Region
                        </label>
                        <div className="relative">
                            <Globe size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <select
                                value={formData.country}
                                onChange={(e) => updateField('country', e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 outline-none appearance-none"
                            >
                                <option value="">Choose region...</option>
                                {COUNTRIES.map((c) => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                            <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">
                            State / Province
                        </label>
                        <input
                            type="text"
                            value={formData.state}
                            onChange={(e) => updateField('state', e.target.value)}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:border-primary-500 outline-none"
                            placeholder="Territory or state"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">
                            City / District
                        </label>
                        <input
                            type="text"
                            value={formData.city}
                            onChange={(e) => updateField('city', e.target.value)}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:border-primary-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">
                            Street
                        </label>
                        <input
                            type="text"
                            value={formData.street}
                            onChange={(e) => updateField('street', e.target.value)}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:border-primary-500 outline-none"
                            placeholder="Number and Street name"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">
                        Detailed Address
                    </label>
                    <textarea
                        value={formData.addressLine2}
                        onChange={(e) => updateField('addressLine2', e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:border-primary-500 focus:bg-white outline-none h-24 resize-none transition-all"
                        placeholder="Unit, Floor, Building Name, Estate..."
                    />
                </div>
            </section>

            {/* ZONE III: COMMUNICATION & CONSENT */}
            <section className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                    <Globe size={18} className="text-primary-500" />
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">
                        III. Communication & Consent
                    </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-3">
                            Preferred Marketing Language
                        </label>
                        <div className="relative">
                            <Languages size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <select
                                value={formData.preferredLanguage}
                                onChange={(e) => updateField('preferredLanguage', e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:border-primary-500 outline-none appearance-none"
                            >
                                {LANGUAGES.map((lang) => (
                                    <option key={lang} value={lang}>{lang}</option>
                                ))}
                            </select>
                            <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                        </div>
                    </div>
                </div>

                <MarketingPreferences
                    optInChannels={formData.optInChannels || []}
                    onChange={handleOptInChange}
                />
            </section>

            {/* ZONE IV: PROGRAM ENROLLMENT */}
            <section className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                    <Zap size={18} className="text-primary-500" />
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">
                        IV. Program Enrollment
                    </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* Card Number Toggle */}
                    <div className="space-y-4">
                        <MemberCodeToggle
                            mode={formData.cardNoMode || 'auto'}
                            value={formData.cardNo || ''}
                            onModeChange={(mode) => {
                                updateField('cardNoMode', mode);
                                if (mode === 'auto') {
                                    updateField('cardNo', formData.memberCode || '');
                                }
                            }}
                            onValueChange={(value) => updateField('cardNo', value)}
                            label="Card Provisioning Strategy"
                            placeholder="Enter barcode or physical ID..."
                        />
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase mb-3">
                                Initial Tier Assignment
                            </label>
                            <div className="relative">
                                <CreditCard size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <select
                                    value={formData.initialTier}
                                    onChange={(e) => updateField('initialTier', e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:border-primary-500 outline-none appearance-none transition-all"
                                >
                                    {TIERS.map((tier) => (
                                        <option key={tier} value={tier}>{tier}</option>
                                    ))}
                                </select>
                                <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase mb-3">
                                Enrollment Join Date
                            </label>
                            <div className="relative">
                                <Calendar size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="date"
                                    value={formData.joinDate}
                                    onChange={(e) => updateField('joinDate', e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:border-primary-500 outline-none transition-all"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default MemberForm;
