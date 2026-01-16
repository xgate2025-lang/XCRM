import React, { useState, useEffect } from 'react';
import { X, Edit3, Check, AlertCircle, Key } from 'lucide-react';
import { useIntegration } from '../../../context/IntegrationContext';
import { APIToken } from '../../../types';

interface EditTokenModalProps {
  isOpen: boolean;
  token: APIToken | null;
  onClose: () => void;
}

const EditTokenModal: React.FC<EditTokenModalProps> = ({ isOpen, token, onClose }) => {
  const { updateTokenName, isNameUnique } = useIntegration();

  // Form state
  const [tokenName, setTokenName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form when token changes
  useEffect(() => {
    if (token) {
      setTokenName(token.name);
      setError(null);
    }
  }, [token]);

  // Reset modal state
  const resetModal = () => {
    setTokenName('');
    setError(null);
    setIsSubmitting(false);
  };

  // Handle close
  const handleClose = () => {
    resetModal();
    onClose();
  };

  // Handle save
  const handleSave = async () => {
    if (!token) return;

    setError(null);

    // Validate name
    const trimmedName = tokenName.trim();
    if (!trimmedName) {
      setError('Token name is required');
      return;
    }
    if (trimmedName.length > 100) {
      setError('Token name must be 100 characters or less');
      return;
    }
    // Check if name changed
    if (trimmedName === token.name) {
      handleClose();
      return;
    }
    // Check uniqueness (excluding current token)
    if (!isNameUnique(trimmedName, token.id)) {
      setError('A token with this name already exists');
      return;
    }

    setIsSubmitting(true);
    try {
      await updateTokenName(token.id, trimmedName);
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update token');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle key press for Enter
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isSubmitting) {
      handleSave();
    }
  };

  if (!isOpen || !token) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="bg-primary-50 p-2 rounded-xl">
              <Edit3 size={20} className="text-primary-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Edit Token</h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Token Name Input */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Token Name
            </label>
            <input
              type="text"
              value={tokenName}
              onChange={(e) => {
                setTokenName(e.target.value);
                setError(null);
              }}
              onKeyPress={handleKeyPress}
              placeholder="e.g., POS System A"
              maxLength={100}
              autoFocus
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-300 transition-all"
            />
            <p className="text-xs text-slate-400 mt-2">
              A descriptive name to identify this integration (max 100 characters)
            </p>
          </div>

          {/* Token Display (Read-only) */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              API Token
              <span className="text-slate-400 font-normal ml-2">(cannot be changed)</span>
            </label>
            <div className="flex items-center gap-3 px-4 py-3 bg-slate-100 rounded-2xl">
              <Key size={18} className="text-slate-400" />
              <code className="text-slate-600 font-mono text-sm">{token.maskedToken}</code>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              The token string is immutable and hidden for security
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2">
              <AlertCircle className="text-red-500 flex-shrink-0" size={16} />
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-2.5 text-slate-600 font-bold rounded-xl hover:bg-slate-100 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSubmitting || !tokenName.trim()}
              className="px-6 py-2.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Check size={18} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditTokenModal;
