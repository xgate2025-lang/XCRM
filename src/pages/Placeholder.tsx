import React from 'react';
import { Construction } from 'lucide-react';
import { NavItemId } from '../types';

const PlaceholderPage = ({ title, id, onNavigate }: { title: string, id: NavItemId, onNavigate: (id: NavItemId) => void }) => {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] text-center animate-in fade-in zoom-in duration-300">
      <div className="bg-primary-100 p-6 rounded-full mb-6">
        <Construction size={48} className="text-primary-500" />
      </div>
      <h2 className="text-3xl font-bold text-slate-900 mb-2">{title}</h2>
      <p className="text-slate-500 max-w-md mx-auto mb-8">
        This module is currently under active development. The <strong>{id}</strong> view will be available in the next sprint release.
      </p>
      <button 
        onClick={() => onNavigate('dashboard')}
        className="px-6 py-3 bg-primary-500 text-white font-medium rounded-xl hover:bg-primary-600 transition-colors shadow-lg shadow-primary-200"
      >
        Return to Dashboard
      </button>
    </div>
  );
};

export default PlaceholderPage;