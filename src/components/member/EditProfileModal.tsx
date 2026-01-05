import React, { useState, useEffect } from 'react';
import { X, User, Save, Loader2, Shield } from 'lucide-react';
import { Member } from '../../types';
import { useMember } from '../../context/MemberContext';
import MemberForm from './form/MemberForm';

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData: Member | undefined;
}

/**
 * Refactored EditProfileModal using the new MemberForm component.
 * Handles modal shell, loading state, and submission logic.
 */
const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose, initialData }) => {
    const { addMember, updateMember } = useMember();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<Partial<Member>>({});

    // Reset form data when modal opens
    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setFormData({ ...initialData });
            } else {
                // New member defaults
                setFormData({
                    memberCodeMode: 'auto',
                    cardNoMode: 'auto',
                    countryCode: '+852',
                    status: 'Active',
                    initialTier: 'Bronze',
                    joinDate: new Date().toISOString().split('T')[0],
                    optInChannels: [],
                    preferredLanguage: 'English',
                });
            }
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleFormChange = (data: Partial<Member>) => {
        setFormData(data);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate network processing
        setTimeout(() => {
            if (initialData) {
                updateMember(initialData.id, formData);
            } else {
                addMember(formData);
            }
            setLoading(false);
            onClose();
        }, 1200);
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-[2px] animate-in fade-in duration-200">
            <div className="bg-white rounded-5xl shadow-2xl w-full max-w-4xl animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[95vh]">

                {/* Modal Header */}
                <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary-200">
                            <User size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-slate-900 tracking-tight">
                                {initialData ? 'Update Member Profile' : 'Register New Member'}
                            </h3>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                CRM Strategic Record Management
                            </p>
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
                <form id="member-edit-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-10 no-scrollbar">
                    <MemberForm initialData={formData} onChange={handleFormChange} />
                </form>

                {/* Footer Actions */}
                <div className="px-8 py-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between shrink-0">
                    <button
                        type="button"
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

export default EditProfileModal;
