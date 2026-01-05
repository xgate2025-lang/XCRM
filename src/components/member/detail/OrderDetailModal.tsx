import React from 'react';
import { X, Package, Receipt, Tag, DollarSign, Ticket, Clock, Store, User } from 'lucide-react';
import { TransactionItem, SettlementRecord, BenefitUsage } from '../../../types';

interface OrderDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    order: {
        id: string;
        date: string;
        creationDate: string;
        type: string;
        channel: string;
        staff: string;
        total: number;
        paid: number;
        status: string;
        originalOrderId?: string;
        points: string;
        pointsUsed: number;
        vouchers: BenefitUsage[];
        fees: { tax: number; shipping: number; other: number };
        remarks: string;
        items: TransactionItem[];
    } | null;
}

/**
 * Order Detail Modal showing SKU-level details and settlement breakdown.
 * Note: No print/download actions per specification requirement.
 */
const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ isOpen, onClose, order }) => {
    if (!isOpen || !order) return null;

    const subtotal = order.items.reduce((sum, item) => sum + item.total, 0);
    const totalDiscount = order.items.reduce((sum, item) => sum + item.discount, 0);

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-[2px] animate-in fade-in duration-200">
            <div className="bg-white rounded-4xl shadow-2xl w-full max-w-4xl animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
                    <div>
                        <h3 className="text-xl font-black text-slate-900 tracking-tight">
                            Order Details
                        </h3>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">
                            {order.id} • {order.type}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full text-slate-300 hover:text-slate-600 hover:bg-white transition-all"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
                    {/* Basic Order Info */}
                    <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <InfoCard icon={<Clock size={14} />} label="Transaction Date" value={order.date} />
                        <InfoCard icon={<Store size={14} />} label="Channel" value={order.channel} />
                        <InfoCard icon={<User size={14} />} label="Sales Personnel" value={order.staff} />
                        <InfoCard
                            icon={<Receipt size={14} />}
                            label="Status"
                            value={order.status}
                            highlight={order.status === 'Completed'}
                        />
                    </section>

                    {order.originalOrderId && (
                        <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl">
                            <p className="text-sm font-bold text-amber-800">
                                Return Order — Original: <span className="font-mono">{order.originalOrderId}</span>
                            </p>
                        </div>
                    )}

                    {order.remarks && (
                        <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                            <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Remarks</p>
                            <p className="text-sm text-slate-700">{order.remarks}</p>
                        </div>
                    )}

                    {/* Product Details Table */}
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <Package size={18} className="text-primary-500" />
                            <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                                Product Details
                            </h4>
                        </div>
                        <div className="overflow-x-auto rounded-2xl border border-slate-100">
                            <table className="w-full text-sm">
                                <thead className="bg-slate-50 text-slate-500">
                                    <tr>
                                        <th className="text-left px-4 py-3 font-black text-[10px] uppercase">SKU</th>
                                        <th className="text-left px-4 py-3 font-black text-[10px] uppercase">Product</th>
                                        <th className="text-left px-4 py-3 font-black text-[10px] uppercase">Spec</th>
                                        <th className="text-right px-4 py-3 font-black text-[10px] uppercase">MSRP</th>
                                        <th className="text-right px-4 py-3 font-black text-[10px] uppercase">Unit Price</th>
                                        <th className="text-center px-4 py-3 font-black text-[10px] uppercase">Qty</th>
                                        <th className="text-right px-4 py-3 font-black text-[10px] uppercase">Discount</th>
                                        <th className="text-right px-4 py-3 font-black text-[10px] uppercase">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {order.items.map((item, idx) => (
                                        <tr key={idx} className="border-t border-slate-100 hover:bg-slate-50/50">
                                            <td className="px-4 py-3 font-mono text-xs text-slate-500">{item.sku}</td>
                                            <td className="px-4 py-3 font-bold text-slate-900">{item.name}</td>
                                            <td className="px-4 py-3 text-slate-500">{item.spec}</td>
                                            <td className="px-4 py-3 text-right text-slate-400 line-through">
                                                ${item.msrp.toFixed(2)}
                                            </td>
                                            <td className="px-4 py-3 text-right font-bold text-slate-900">
                                                ${item.unitPrice.toFixed(2)}
                                            </td>
                                            <td className="px-4 py-3 text-center">{item.qty}</td>
                                            <td className="px-4 py-3 text-right text-red-500">
                                                -${item.discount.toFixed(2)}
                                            </td>
                                            <td className="px-4 py-3 text-right font-bold text-slate-900">
                                                ${item.total.toFixed(2)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* Settlement Info */}
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <DollarSign size={18} className="text-primary-500" />
                            <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                                Settlement Breakdown
                            </h4>
                        </div>
                        <div className="bg-slate-50 rounded-2xl p-6 space-y-3">
                            <SettlementRow label="Subtotal" value={subtotal} />
                            <SettlementRow label="Item Discounts" value={-totalDiscount} isNegative />
                            <SettlementRow label="Tax" value={order.fees.tax} />
                            <SettlementRow label="Shipping" value={order.fees.shipping} />
                            <SettlementRow label="Other Fees" value={order.fees.other} />
                            <div className="border-t border-slate-200 pt-3 mt-3">
                                <SettlementRow label="Total Paid" value={order.paid} isBold />
                            </div>
                        </div>
                    </section>

                    {/* Benefit Usage */}
                    {(order.pointsUsed > 0 || order.vouchers.length > 0) && (
                        <section>
                            <div className="flex items-center gap-2 mb-4">
                                <Tag size={18} className="text-primary-500" />
                                <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                                    Benefits Applied
                                </h4>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {order.pointsUsed > 0 && (
                                    <div className="px-4 py-2 bg-blue-50 border border-blue-100 rounded-xl">
                                        <span className="text-xs font-black text-blue-700">
                                            {order.pointsUsed.toLocaleString()} Points Redeemed
                                        </span>
                                    </div>
                                )}
                                {order.vouchers.map((v, i) => (
                                    <div
                                        key={i}
                                        className="px-4 py-2 bg-purple-50 border border-purple-100 rounded-xl flex items-center gap-2"
                                    >
                                        <Ticket size={14} className="text-purple-500" />
                                        <span className="text-xs font-bold text-purple-700">
                                            {v.name} ({v.value})
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                {/* Footer - No print/download per spec */}
                <div className="px-8 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-end shrink-0">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

// Helper components
const InfoCard: React.FC<{
    icon: React.ReactNode;
    label: string;
    value: string;
    highlight?: boolean;
}> = ({ icon, label, value, highlight }) => (
    <div className="bg-slate-50 rounded-2xl p-4">
        <div className="flex items-center gap-2 text-slate-400 mb-1">
            {icon}
            <span className="text-[10px] font-black uppercase">{label}</span>
        </div>
        <p className={`text-sm font-bold ${highlight ? 'text-green-600' : 'text-slate-900'}`}>
            {value}
        </p>
    </div>
);

const SettlementRow: React.FC<{
    label: string;
    value: number;
    isNegative?: boolean;
    isBold?: boolean;
}> = ({ label, value, isNegative, isBold }) => (
    <div className="flex justify-between items-center">
        <span className={`text-sm ${isBold ? 'font-black text-slate-900' : 'text-slate-600'}`}>
            {label}
        </span>
        <span
            className={`text-sm ${isBold ? 'font-black text-slate-900 text-lg' : isNegative ? 'text-red-500' : 'text-slate-900'
                }`}
        >
            {isNegative && value !== 0 ? '-' : ''}${Math.abs(value).toFixed(2)}
        </span>
    </div>
);

export default OrderDetailModal;
