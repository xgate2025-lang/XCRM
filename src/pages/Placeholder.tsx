import React from 'react';
import { Construction, CheckCircle2 } from 'lucide-react';
import { NavItemId } from '../types';
import { useOnboarding } from '../context/OnboardingContext';

const PlaceholderPage = ({ title, id, onNavigate }: { title: string, id: NavItemId, onNavigate: (id: NavItemId) => void }) => {
  const { toggleSubtask } = useOnboarding();

  const handleSimulateSetup = async () => {
    if (id === 'setting') {
      await toggleSubtask('identity', 'upload_logo', true);
      await toggleSubtask('identity', 'set_timezone', true);
      onNavigate('dashboard');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-[70vh] text-center animate-in fade-in zoom-in duration-300">
      <div className="bg-primary-100 p-6 rounded-full mb-6">
        <Construction size={48} className="text-primary-500" />
      </div>
      <h2 className="text-3xl font-bold text-slate-900 mb-2">{title}</h2>
      <p className="text-slate-500 max-w-md mx-auto mb-8">
        This module is currently under active development. The <strong>{id}</strong> view will be available in the next sprint release.
      </p>

      <div className="flex gap-4">
        {id === 'setting' && (
          <button
            onClick={handleSimulateSetup}
            className="px-6 py-3 bg-white border border-primary-200 text-primary-600 font-bold rounded-xl hover:bg-primary-50 transition-all flex items-center gap-2"
          >
            <CheckCircle2 size={18} />
            Simulate Identity Setup
          </button>
        )}
        <button
          onClick={() => onNavigate('dashboard')}
          className="px-6 py-3 bg-primary-500 text-white font-medium rounded-xl hover:bg-primary-600 transition-colors shadow-lg shadow-primary-200"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
};

export default PlaceholderPage;