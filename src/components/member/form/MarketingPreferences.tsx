import React from 'react';
import { Mail, Smartphone, Send, MessageCircle, Calendar, ToggleRight, ToggleLeft } from 'lucide-react';
import { OptInChannel } from '../../../types';

type ChannelType = OptInChannel['channel'];

interface MarketingPreferencesProps {
    optInChannels: OptInChannel[];
    onChange: (channels: OptInChannel[]) => void;
}

const CHANNEL_CONFIG: { id: ChannelType; icon: React.ElementType; label: string }[] = [
    { id: 'Email', icon: Mail, label: 'Email Newsletter' },
    { id: 'SMS', icon: Smartphone, label: 'SMS Marketing' },
    { id: 'Push', icon: Send, label: 'App Push Notification' },
    { id: 'WhatsApp', icon: MessageCircle, label: 'WhatsApp Direct' },
];

/**
 * Marketing Preferences component with multi-select channels and dynamic opt-in date pickers.
 * Each selected channel requires an opt-in date for audit compliance.
 */
const MarketingPreferences: React.FC<MarketingPreferencesProps> = ({
    optInChannels,
    onChange,
}) => {
    const handleChannelToggle = (channelId: ChannelType) => {
        const exists = optInChannels.find((c) => c.channel === channelId);

        if (exists) {
            // Remove channel
            onChange(optInChannels.filter((c) => c.channel !== channelId));
        } else {
            // Add channel with today's date as default
            onChange([
                ...optInChannels,
                { channel: channelId, optInTime: new Date().toISOString().split('T')[0] },
            ]);
        }
    };

    const handleDateChange = (channelId: ChannelType, newDate: string) => {
        onChange(
            optInChannels.map((c) =>
                c.channel === channelId ? { ...c, optInTime: newDate } : c
            )
        );
    };

    return (
        <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                Marketing Opt-in Channels (Audit Traceable)
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {CHANNEL_CONFIG.map((channel) => {
                    const optIn = optInChannels.find((c) => c.channel === channel.id);
                    const isActive = !!optIn;
                    const Icon = channel.icon;

                    return (
                        <div
                            key={channel.id}
                            className={`p-5 rounded-2xl border transition-all duration-300 ${isActive
                                    ? 'bg-primary-50 border-primary-200 shadow-sm'
                                    : 'bg-slate-50 border-slate-100 opacity-60 hover:opacity-100'
                                }`}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isActive
                                                ? 'bg-primary-500 text-white shadow-lg shadow-primary-200'
                                                : 'bg-slate-200 text-slate-400'
                                            }`}
                                    >
                                        <Icon size={18} />
                                    </div>
                                    <div>
                                        <span
                                            className={`text-sm font-black block ${isActive ? 'text-primary-900' : 'text-slate-400'
                                                }`}
                                        >
                                            {channel.label}
                                        </span>
                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">
                                            {isActive ? 'Status: Active' : 'Status: Disabled'}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleChannelToggle(channel.id)}
                                    className={`transition-colors ${isActive ? 'text-primary-600' : 'text-slate-300'
                                        }`}
                                >
                                    {isActive ? <ToggleRight size={36} /> : <ToggleLeft size={36} />}
                                </button>
                            </div>

                            {/* Conditional Date Picker */}
                            {isActive && optIn && (
                                <div className="animate-in fade-in slide-in-from-top-1">
                                    <label className="block text-[8px] font-black text-primary-400 uppercase mb-1.5 ml-0.5">
                                        Opt-in Effective Date
                                    </label>
                                    <div className="relative">
                                        <Calendar
                                            size={10}
                                            className="absolute left-2 top-1/2 -translate-y-1/2 text-primary-300"
                                        />
                                        <input
                                            type="date"
                                            value={optIn.optInTime}
                                            onChange={(e) => handleDateChange(channel.id, e.target.value)}
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
    );
};

export default MarketingPreferences;
