import React from 'react';
import {
    User,
    Mail,
    Phone,
    Calendar,
    MapPin,
    Globe,
    Languages,
    CreditCard,
    Crown,
    CheckCircle2,
} from 'lucide-react';
import { Member } from '../../../types';

interface ProfileTabProps {
    member: Member;
}

/**
 * ProfileTab displays member information in structured groups:
 * - Basic Info (Name, Contact, Demographics)
 * - Address Info
 * - Marketing Preferences
 * - Membership Info
 */
const ProfileTab: React.FC<ProfileTabProps> = ({ member }) => {
    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            {/* Basic Info */}
            <section className="bg-white rounded-3xl border border-slate-100 p-6">
                <div className="flex items-center gap-2 mb-6">
                    <User size={18} className="text-primary-500" />
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                        Basic Information
                    </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <InfoItem label="Full Name" value={`${member.firstName} ${member.lastName}`} />
                    <InfoItem label="Title" value={member.title || '—'} />
                    <InfoItem label="Gender" value={member.gender || '—'} />
                    <InfoItem label="Email" value={member.email} icon={<Mail size={14} />} />
                    <InfoItem label="Phone" value={member.phone} icon={<Phone size={14} />} />
                    <InfoItem label="Birthday" value={member.birthday || '—'} icon={<Calendar size={14} />} />
                    <InfoItem label="Age Group" value={member.ageGroup || '—'} />
                </div>
            </section>

            {/* Address Info */}
            <section className="bg-white rounded-3xl border border-slate-100 p-6">
                <div className="flex items-center gap-2 mb-6">
                    <MapPin size={18} className="text-primary-500" />
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                        Address Information
                    </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <InfoItem label="Country" value={member.country || '—'} icon={<Globe size={14} />} />
                    <InfoItem label="State/Province" value={member.state || '—'} />
                    <InfoItem label="City" value={member.city || '—'} />
                    <InfoItem label="Street" value={member.street || '—'} />
                    <div className="md:col-span-2">
                        <InfoItem label="Detailed Address" value={member.addressLine2 || '—'} />
                    </div>
                </div>
            </section>

            {/* Marketing Preferences */}
            <section className="bg-white rounded-3xl border border-slate-100 p-6">
                <div className="flex items-center gap-2 mb-6">
                    <Languages size={18} className="text-primary-500" />
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                        Marketing Preferences
                    </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <InfoItem label="Preferred Language" value={member.preferredLanguage || 'English'} />
                    <div className="md:col-span-2">
                        <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Opt-in Channels</p>
                        <div className="flex flex-wrap gap-2">
                            {member.optInChannels && member.optInChannels.length > 0 ? (
                                member.optInChannels.map((ch) => (
                                    <span
                                        key={ch.channel}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-xs font-bold border border-green-100"
                                    >
                                        <CheckCircle2 size={12} />
                                        {ch.channel} (since {ch.optInTime})
                                    </span>
                                ))
                            ) : (
                                <span className="text-slate-400 text-sm">No channels opted in</span>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Membership Info */}
            <section className="bg-white rounded-3xl border border-slate-100 p-6">
                <div className="flex items-center gap-2 mb-6">
                    <Crown size={18} className="text-primary-500" />
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                        Membership Information
                    </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <InfoItem label="Member Code" value={member.memberCode || member.id} icon={<CreditCard size={14} />} />
                    <InfoItem label="Card Number" value={member.cardNo} />
                    <InfoItem label="Current Tier" value={member.tier} icon={<Crown size={14} />} />
                    <InfoItem label="Points Balance" value={member.points.toLocaleString()} />
                    <InfoItem label="Join Date" value={member.joinDate} icon={<Calendar size={14} />} />
                    <InfoItem label="Lifetime Spend" value={member.lifetimeSpend} />
                </div>
            </section>
        </div>
    );
};

// Helper component for consistent info display
const InfoItem: React.FC<{ label: string; value: string; icon?: React.ReactNode }> = ({
    label,
    value,
    icon,
}) => (
    <div>
        <p className="text-[10px] font-black text-slate-400 uppercase mb-1">{label}</p>
        <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
            {icon && <span className="text-slate-400">{icon}</span>}
            {value}
        </div>
    </div>
);

export default ProfileTab;
