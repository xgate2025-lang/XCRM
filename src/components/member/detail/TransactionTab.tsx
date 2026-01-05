import React, { useState } from 'react';
import { Search, ShoppingBag, ChevronRight, ArrowDownLeft, ArrowUpRight } from 'lucide-react';

interface Transaction {
    id: string;
    date: string;
    type: string;
    channel: string;
    total: number;
    status: string;
    points: string;
}

interface TransactionTabProps {
    transactions: Transaction[];
    onSelectTransaction: (id: string) => void;
}

/**
 * TransactionTab displays a searchable list of member transactions.
 * Clicking a row opens the OrderDetailModal.
 */
const TransactionTab: React.FC<TransactionTabProps> = ({
    transactions,
    onSelectTransaction,
}) => {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredTransactions = transactions.filter((t) =>
        t.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            {/* Search Bar */}
            <div className="relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by Order ID..."
                    className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:border-slate-900 transition-colors"
                />
            </div>

            {/* Transaction List */}
            <div className="space-y-3">
                {filteredTransactions.length === 0 ? (
                    <div className="text-center py-12 text-slate-400">
                        <ShoppingBag size={48} className="mx-auto mb-4 opacity-50" />
                        <p className="font-bold">No transactions found</p>
                    </div>
                ) : (
                    filteredTransactions.map((tx) => (
                        <button
                            key={tx.id}
                            onClick={() => onSelectTransaction(tx.id)}
                            className="w-full p-5 bg-white rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all flex items-center justify-between group text-left"
                        >
                            <div className="flex items-center gap-4">
                                <div
                                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${tx.type === 'Return'
                                            ? 'bg-red-50 text-red-500'
                                            : 'bg-green-50 text-green-500'
                                        }`}
                                >
                                    {tx.type === 'Return' ? (
                                        <ArrowDownLeft size={20} />
                                    ) : (
                                        <ArrowUpRight size={20} />
                                    )}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900">{tx.id}</p>
                                    <p className="text-xs text-slate-500">
                                        {tx.date} • {tx.channel}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="text-right">
                                    <p
                                        className={`text-lg font-black ${tx.total < 0 ? 'text-red-500' : 'text-slate-900'
                                            }`}
                                    >
                                        {tx.total < 0 ? '-' : ''}${Math.abs(tx.total).toFixed(2)}
                                    </p>
                                    <p
                                        className={`text-xs font-bold ${tx.points.startsWith('-') ? 'text-red-400' : 'text-green-500'
                                            }`}
                                    >
                                        {tx.points} pts
                                    </p>
                                </div>
                                <div
                                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${tx.status === 'Completed'
                                            ? 'bg-green-50 text-green-600'
                                            : tx.status === 'Refunded'
                                                ? 'bg-red-50 text-red-600'
                                                : 'bg-slate-100 text-slate-600'
                                        }`}
                                >
                                    {tx.status}
                                </div>
                                <ChevronRight
                                    size={20}
                                    className="text-slate-300 group-hover:text-slate-500 transition-colors"
                                />
                            </div>
                        </button>
                    ))
                )}
            </div>
        </div>
    );
};

export default TransactionTab;
