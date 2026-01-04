import React, { useState } from 'react';
import { X, UploadCloud, FileText, CheckCircle2, AlertCircle, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';

interface ImportWizardProps {
  isOpen: boolean;
  onClose: () => void;
}

const ImportWizard: React.FC<ImportWizardProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [isUploading, setIsUploading] = useState(false);

  if (!isOpen) return null;

  const handleNext = () => {
    if (step === 1) {
        setIsUploading(true);
        setTimeout(() => {
            setIsUploading(false);
            setStep(2);
        }, 1500);
    } else if (step < 4) {
        setStep(prev => (prev + 1) as 1 | 2 | 3 | 4);
    } else {
        onClose();
    }
  };

  const handleBack = () => {
    if (step > 1) {
        setStep(prev => (prev - 1) as 1 | 2 | 3 | 4);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-[2px] animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl animate-in zoom-in-95 duration-200 border border-slate-100 flex flex-col max-h-[90vh]">
        
        {/* Header with Stepper */}
        <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 rounded-t-3xl">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-900">Import Members</h3>
                <button onClick={onClose} className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
                    <X size={20} />
                </button>
            </div>
            
            {/* Stepper */}
            <div className="flex items-center justify-between relative px-2">
                <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -z-10 rounded-full"></div>
                
                {[
                    { id: 1, label: 'Upload' },
                    { id: 2, label: 'Mapping' },
                    { id: 3, label: 'Preview' },
                    { id: 4, label: 'Done' }
                ].map((s) => {
                    const isActive = step >= s.id;
                    const isCurrent = step === s.id;
                    return (
                        <div key={s.id} className="flex flex-col items-center gap-2 bg-slate-50 px-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${isActive ? 'bg-slate-900 text-white shadow-lg' : 'bg-white border-2 border-slate-200 text-slate-400'}`}>
                                {isActive ? <CheckCircle2 size={14} /> : s.id}
                            </div>
                            <span className={`text-[10px] font-bold uppercase tracking-wider transition-colors ${isCurrent ? 'text-slate-900' : 'text-slate-400'}`}>
                                {s.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>

        {/* Content Body */}
        <div className="p-8 min-h-[300px] flex flex-col items-center justify-center">
            
            {/* STEP 1: UPLOAD */}
            {step === 1 && (
                <div 
                    className="w-full h-64 border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50 flex flex-col items-center justify-center cursor-pointer hover:border-primary-400 hover:bg-primary-50/50 transition-all group"
                >
                    {isUploading ? (
                        <div className="flex flex-col items-center gap-3 animate-in fade-in">
                            <Loader2 size={32} className="text-primary-500 animate-spin" />
                            <span className="font-bold text-slate-500">Processing File...</span>
                        </div>
                    ) : (
                        <>
                            <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <UploadCloud size={32} className="text-primary-500" />
                            </div>
                            <h4 className="text-lg font-bold text-slate-900 mb-1">Click to upload or drag and drop</h4>
                            <p className="text-sm text-slate-400">CSV, XLS up to 10MB</p>
                        </>
                    )}
                </div>
            )}

            {/* STEP 2: MAPPING */}
            {step === 2 && (
                <div className="w-full space-y-4 animate-in fade-in slide-in-from-right-4">
                    <div className="flex items-center gap-3 p-3 bg-blue-50 text-blue-700 rounded-xl text-sm font-medium border border-blue-100">
                        <AlertCircle size={18} />
                        <span>We found 3 columns in your file. Please map them below.</span>
                    </div>

                    <div className="border border-slate-200 rounded-xl overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                                <tr>
                                    <th className="px-4 py-3 text-left font-bold">File Header</th>
                                    <th className="px-4 py-3 text-left font-bold">Preview Data</th>
                                    <th className="px-4 py-3 text-left font-bold">System Field</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                <tr>
                                    <td className="px-4 py-3 font-medium text-slate-900">full_name</td>
                                    <td className="px-4 py-3 text-slate-500">John Doe</td>
                                    <td className="px-4 py-2">
                                        <select className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 font-medium text-slate-700 focus:border-primary-500 outline-none">
                                            <option>Full Name</option>
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 font-medium text-slate-900">email_addr</td>
                                    <td className="px-4 py-3 text-slate-500">john@example.com</td>
                                    <td className="px-4 py-2">
                                        <select className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 font-medium text-slate-700 focus:border-primary-500 outline-none">
                                            <option>Email Address</option>
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 font-medium text-slate-900">mobile</td>
                                    <td className="px-4 py-3 text-slate-500">+852 9123 4567</td>
                                    <td className="px-4 py-2">
                                        <select className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 font-medium text-slate-700 focus:border-primary-500 outline-none">
                                            <option>Phone Number</option>
                                        </select>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* STEP 3: PREVIEW */}
            {step === 3 && (
                <div className="w-full text-center space-y-6 animate-in fade-in slide-in-from-right-4">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
                        <FileText size={40} />
                    </div>
                    <div>
                        <h4 className="text-2xl font-bold text-slate-900 mb-2">Ready to Import</h4>
                        <p className="text-slate-500">
                            We are about to import <strong className="text-slate-900">128 new members</strong> into the database.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="text-2xl font-bold text-slate-900">128</div>
                            <div className="text-xs font-bold text-slate-400 uppercase">Valid Rows</div>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="text-2xl font-bold text-slate-900">0</div>
                            <div className="text-xs font-bold text-slate-400 uppercase">Errors</div>
                        </div>
                    </div>
                </div>
            )}

            {/* STEP 4: SUCCESS */}
            {step === 4 && (
                <div className="w-full text-center space-y-6 animate-in fade-in zoom-in-95">
                    <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto text-white shadow-xl shadow-green-200">
                        <CheckCircle2 size={48} />
                    </div>
                    <div>
                        <h4 className="text-2xl font-bold text-slate-900 mb-2">Import Successful!</h4>
                        <p className="text-slate-500">
                            The member list has been updated. Background processing is complete.
                        </p>
                    </div>
                </div>
            )}
        </div>

        {/* Footer Actions */}
        <div className="px-8 py-5 border-t border-slate-100 bg-slate-50/50 rounded-b-3xl flex justify-between items-center">
            <button 
                onClick={handleBack}
                disabled={step === 1 || step === 4}
                className={`flex items-center gap-2 px-4 py-2 font-bold text-slate-500 rounded-xl transition-colors ${step === 1 || step === 4 ? 'opacity-0 cursor-default' : 'hover:bg-slate-100 hover:text-slate-700'}`}
            >
                <ArrowLeft size={16} /> Back
            </button>
            <button 
                onClick={handleNext}
                disabled={isUploading}
                className="flex items-center gap-2 px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 shadow-lg shadow-slate-200 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {step === 3 ? 'Start Import' : step === 4 ? 'Close' : 'Next Step'} 
                {step < 4 && <ArrowRight size={16} />}
            </button>
        </div>

      </div>
    </div>
  );
};

export default ImportWizard;