import React, { useState } from 'react';
import { X, Key, Copy, Check, AlertCircle, AlertTriangle } from 'lucide-react';
import { useIntegration } from '../../../context/IntegrationContext';

interface NewTokenModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ModalStep = 'input' | 'generated';

const NewTokenModal: React.FC<NewTokenModalProps> = ({ isOpen, onClose }) => {
  const { generateToken, isNameUnique } = useIntegration();

  // Form state
  const [tokenName, setTokenName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Generated token state
  const [step, setStep] = useState<ModalStep>('input');
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  // Reset modal state
  const resetModal = () => {
    setTokenName('');
    setError(null);
    setIsSubmitting(false);
    setStep('input');
    setGeneratedToken(null);
    setIsCopied(false);
  };

  // Handle close
  const handleClose = () => {
    resetModal();
    onClose();
  };

  // Handle generate
  const handleGenerate = async () => {
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
    if (!isNameUnique(trimmedName)) {
      setError('A token with this name already exists');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await generateToken(trimmedName);
      setGeneratedToken(result.fullToken);
      setStep('generated');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate token');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle copy to clipboard
  const handleCopy = async () => {
    if (!generatedToken) return;

    try {
      await navigator.clipboard.writeText(generatedToken);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      // Fallback: select the text for manual copy
      const textArea = document.getElementById('token-display') as HTMLTextAreaElement;
      if (textArea) {
        textArea.select();
        setError('Could not copy automatically. Please copy manually (Ctrl+C / Cmd+C)');
      }
    }
  };

  // Handle key press for Enter
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && step === 'input' && !isSubmitting) {
      handleGenerate();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="bg-primary-50 p-2 rounded-xl">
              <Key size={20} className="text-primary-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              {step === 'input' ? 'New API Token' : 'Token Generated'}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {step === 'input' ? (
            // Step 1: Input token name
            <div className="space-y-6">
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
                  onClick={handleGenerate}
                  disabled={isSubmitting || !tokenName.trim()}
                  className="px-6 py-2.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Key size={18} />
                      Generate Token
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            // Step 2: Show generated token
            <div className="space-y-6">
              {/* Success Message */}
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
                <Check className="text-green-600 flex-shrink-0 mt-0.5" size={18} />
                <div>
                  <p className="text-green-800 font-bold">Token generated successfully!</p>
                  <p className="text-green-700 text-sm mt-1">
                    Your new API token for "{tokenName}" is ready.
                  </p>
                </div>
              </div>

              {/* Token Display */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Your API Token
                </label>
                <div className="relative">
                  <textarea
                    id="token-display"
                    readOnly
                    value={generatedToken || ''}
                    className="w-full px-4 py-3 pr-12 bg-slate-900 text-green-400 font-mono text-sm rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-primary-300"
                    rows={2}
                  />
                  <button
                    onClick={handleCopy}
                    className={`absolute right-3 top-3 p-2 rounded-lg transition-all ${
                      isCopied
                        ? 'bg-green-500 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white'
                    }`}
                    title={isCopied ? 'Copied!' : 'Copy to clipboard'}
                  >
                    {isCopied ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
                {isCopied && (
                  <p className="text-green-600 text-sm font-medium mt-2 flex items-center gap-1">
                    <Check size={14} /> Copied to clipboard!
                  </p>
                )}
              </div>

              {/* Warning */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                <AlertTriangle className="text-amber-600 flex-shrink-0 mt-0.5" size={18} />
                <div>
                  <p className="text-amber-800 font-bold">Save this token now!</p>
                  <p className="text-amber-700 text-sm mt-1">
                    Make sure to copy your API token now. You won't be able to see it again after closing this dialog.
                  </p>
                </div>
              </div>

              {/* Error (for copy failures) */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2">
                  <AlertCircle className="text-red-500 flex-shrink-0" size={16} />
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={handleCopy}
                  className="px-5 py-2.5 text-slate-600 font-bold rounded-xl hover:bg-slate-100 transition-all flex items-center gap-2"
                >
                  <Copy size={16} />
                  {isCopied ? 'Copied!' : 'Copy Token'}
                </button>
                <button
                  onClick={handleClose}
                  className="px-6 py-2.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewTokenModal;
