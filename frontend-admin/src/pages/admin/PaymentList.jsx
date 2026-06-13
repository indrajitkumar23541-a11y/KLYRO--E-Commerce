import React, { useState, useEffect } from 'react';
import { CreditCard, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const PaymentList = () => {
    const { token } = useAuth();
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Since we don't have a dedicated payments table, we will mock transaction ledger using orders data
        const fetchLedger = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const res = await API.get('/orders', config);
                if (res.data.success) {
                    const mockPayments = res.data.orders.map(o => ({
                        id: o.id.toString() + 'TRX',
                        order_id: o.id,
                        user: o.user_name,
                        amount: parseFloat(o.total_price),
                        method: o.payment_method.toUpperCase(),
                        date: o.created_at,
                        status: o.status === 'cancelled' ? 'Refunded' : (['pending', 'processing'].includes(o.status) ? 'Pending' : 'Completed')
                    }));
                    setPayments(mockPayments);
                }
            } catch (error) {
                console.error('Failed to fetch payments', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLedger();
    }, [token]);

    return (
        <div className="space-y-6 animate-reveal">
            <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-normal text-[#383a48] mb-1">Payments & Ledger</h1>
                <p className="text-[#84879b] text-xs md:text-sm">Gross transactions, payouts, and financial logs.</p>
            </div>

             {/* Stat Overview */}
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                <div className="bg-white rounded-[20px] shadow-sm border border-slate-100/60 p-4 md:p-5 flex flex-col justify-center">
                    <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 md:mb-2">Net Volume</p>
                    <h2 className="text-xl md:text-2xl font-black text-[#5b7296]">₹{payments.reduce((acc, p) => p.status === 'Completed' ? acc + p.amount : acc, 0).toLocaleString()}</h2>
                </div>
                <div className="bg-white rounded-[20px] shadow-sm border border-slate-100/60 p-4 md:p-5 flex flex-col justify-center">
                    <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 md:mb-2">Pending</p>
                    <h2 className="text-xl md:text-2xl font-black text-[#e5a975]">₹{payments.reduce((acc, p) => p.status === 'Pending' ? acc + p.amount : acc, 0).toLocaleString()}</h2>
                </div>
                <div className="bg-white rounded-[20px] shadow-sm border border-slate-100/60 p-4 md:p-5 flex flex-col justify-center sm:col-span-2 lg:col-span-1">
                    <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 md:mb-2">Platform Fees (2%)</p>
                    <h2 className="text-xl md:text-2xl font-black text-[#7ba987]">₹{(payments.reduce((acc, p) => p.status === 'Completed' ? acc + p.amount : acc, 0) * 0.02).toLocaleString()}</h2>
                </div>
            </div>

            <div className="bg-white rounded-[20px] shadow-sm border border-slate-100/60 overflow-hidden">
                <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[700px] md:min-w-0">
                        <thead className="bg-slate-50/50 uppercase text-[10px] font-black text-slate-400">
                            <tr>
                                <th className="px-4 md:px-6 py-4">Transaction ID</th>
                                <th className="px-4 md:px-6 py-4">Customer</th>
                                <th className="px-4 md:px-6 py-4">Amount</th>
                                <th className="px-4 md:px-6 py-4">Gateway</th>
                                <th className="px-4 md:px-6 py-4">Date</th>
                                <th className="px-4 md:px-6 py-4 text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-slate-400 font-bold animate-pulse">Loading Ledger...</td>
                                </tr>
                            ) : payments.length > 0 ? payments.map((p, i) => (
                                <tr key={i} className="hover:bg-slate-50/50 transition-colors border-b border-slate-50">
                                    <td className="px-4 md:px-6 py-4 font-bold text-[10px] md:text-xs text-[#383a48]">#{p.id}</td>
                                    <td className="px-4 md:px-6 py-4 text-xs md:text-sm font-bold text-slate-600 truncate max-w-[120px]">{p.user}</td>
                                    <td className="px-4 md:px-6 py-4">
                                        <div className={`flex items-center gap-1 font-black text-xs md:text-sm ${p.status === 'Refunded' ? 'text-red-500' : 'text-[#7ba987]'}`}>
                                            {p.status === 'Refunded' ? <ArrowUpRight size={12} md={14}/> : <ArrowDownLeft size={12} md={14} />} ₹{p.amount.toLocaleString()}
                                        </div>
                                    </td>
                                    <td className="px-4 md:px-6 py-4 text-[10px] md:text-xs font-bold text-slate-500 flex items-center gap-2">
                                        <CreditCard size={12} md={14} /> <span className="truncate">{p.method}</span>
                                    </td>
                                    <td className="px-4 md:px-6 py-4 text-[10px] md:text-xs font-bold text-slate-500 whitespace-nowrap">
                                        {new Date(p.date).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 md:px-6 py-4 text-right">
                                        <span className={`px-2 md:px-3 py-1 rounded-[4px] text-[9px] md:text-[10px] font-black uppercase tracking-wider ${p.status === 'Completed' ? 'bg-[#7ba987] text-white' : p.status === 'Pending' ? 'bg-[#e5a975] text-white' : 'bg-red-500 text-white'}`}>
                                            {p.status}
                                        </span>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-slate-400 font-bold">No transactions found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PaymentList;
