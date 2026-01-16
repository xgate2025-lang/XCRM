import React, { useState, useMemo } from 'react';
import { Key, Trash2, Edit3, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';
import { APIToken } from '../../../types';

interface TokenListProps {
  tokens: APIToken[];
  isLoading: boolean;
  onDelete: (id: string) => Promise<void>;
  onEdit: (token: APIToken) => void;
}

const ITEMS_PER_PAGE = 10;

const TokenList: React.FC<TokenListProps> = ({ tokens, isLoading, onDelete, onEdit }) => {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // Delete confirmation state
  const [deleteConfirm, setDeleteConfirm] = useState<APIToken | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Sort tokens by created time DESC (newest first)
  const sortedTokens = useMemo(() => {
    return [...tokens].sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [tokens]);

  // Pagination calculations
  const totalPages = Math.ceil(sortedTokens.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedTokens = sortedTokens.slice(startIndex, endIndex);

  // Reset to page 1 if current page becomes invalid
  React.useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Handle delete confirmation
  const handleDeleteClick = (token: APIToken) => {
    setDeleteConfirm(token);
  };

  // Handle confirmed delete
  const handleConfirmDelete = async () => {
    if (!deleteConfirm) return;

    setIsDeleting(true);
    try {
      await onDelete(deleteConfirm.id);
      setDeleteConfirm(null);
    } catch (err) {
      console.error('Failed to delete token:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="p-12 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
        <p className="text-slate-500 mt-4">Loading tokens...</p>
      </div>
    );
  }

  // Empty state
  if (tokens.length === 0) {
    return (
      <div className="p-12 text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Key size={32} className="text-slate-400" />
        </div>
        <p className="text-slate-500 font-medium mb-2">No API tokens yet</p>
        <p className="text-slate-400 text-sm">Create your first token to enable third-party integrations</p>
      </div>
    );
  }

  return (
    <>
      {/* Table */}
      <table className="w-full">
        <thead>
          <tr className="bg-slate-50/50 border-b border-slate-100">
            <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Name</th>
            <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Token</th>
            <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Created</th>
            <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {paginatedTokens.map((token) => (
            <tr key={token.id} className="hover:bg-slate-50/50 transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center">
                    <Key size={18} className="text-primary-600" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{token.name}</p>
                    <p className="text-xs text-slate-400">ID: {token.id.slice(0, 8)}...</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <code className="px-3 py-1.5 bg-slate-100 text-slate-700 font-mono text-sm rounded-lg">
                  {token.maskedToken}
                </code>
              </td>
              <td className="px-6 py-4">
                <span className="text-slate-600 text-sm">{formatDate(token.createdAt)}</span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => onEdit(token)}
                    className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all"
                    title="Edit name"
                  >
                    <Edit3 size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(token)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                    title="Delete token"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Showing {startIndex + 1}-{Math.min(endIndex, sortedTokens.length)} of {sortedTokens.length} tokens
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg text-sm font-bold transition-all ${
                    currentPage === page
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm animate-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="text-red-600" size={28} />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">Delete Token?</h2>
              <p className="text-slate-500 mb-2">
                Are you sure you want to delete <span className="font-bold">"{deleteConfirm.name}"</span>?
              </p>
              <p className="text-sm text-amber-600 bg-amber-50 rounded-xl p-3 mb-6">
                This will immediately disconnect any integrations using this credential. This action cannot be undone.
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  disabled={isDeleting}
                  className="flex-1 px-5 py-2.5 text-slate-600 font-bold rounded-xl hover:bg-slate-100 transition-all border border-slate-200 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  disabled={isDeleting}
                  className="flex-1 px-5 py-2.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isDeleting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 size={16} />
                      Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TokenList;
