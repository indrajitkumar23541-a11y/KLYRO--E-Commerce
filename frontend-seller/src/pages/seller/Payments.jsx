import React, { useState, useEffect } from 'react';
import {
    IndianRupee, CreditCard, ArrowUpRight, ArrowDownRight,
    Calendar, Download, Search, Filter, Loader2,
    PieChart, Wallet, Banknote, Landmark, ShieldCheck,
    TrendingUp, FileText, ExternalLink, ChevronRight,
    Clock, AlertCircle, CheckCircle2
} from 'lucide-react';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const Payments = () => {
    const { token } = useAuth();
    const [payments, setPayments] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const res = await API.get('/seller/payments', config);
            if (res.data.success) {
                setPayments(res.data);
            }
        } catch (error) {
            console.error('Failed to fetch payments', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'delivered': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'shipped': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'pending': return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'cancelled': return 'bg-red-50 text-red-600 border-red-100';
            default: return 'bg-slate-50 text-slate-600 border-slate-100';
        }
    };

    return (
        <div className="space-y-10 animate-reveal">
            {/* Financial Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Net Earnings', value: `₹${(payments?.summary?.net_earnings || 0).toLocaleString()}`, icon: Wallet, color: 'text-emerald-600', bg: 'bg-emerald-50', sub: 'Post Commission' },
                    { label: 'Gross Revenue', value: `₹${(payments?.summary?.gross_earnings || 0).toLocaleString()}`, icon: IndianRupee, color: 'text-blue-600', bg: 'bg-blue-50', sub: 'Total Volume' },
                    { label: 'Total Sales', value: payments?.summary?.total_sales || 0, icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50', sub: 'Completed Orders' },
                    { label: 'Settlement Status', value: 'Ready', icon: ShieldCheck, color: 'text-orange-600', bg: 'bg-orange-50', sub: 'Next Payout: 15 Oct' }
                ].map((s, i) => (
                    <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                        <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 group-hover:scale-150 transition-transform ${s.bg}`}></div>
                        <div className="relative flex items-center gap-6">
                            <div className={`w-14 h-14 rounded-2xl ${s.bg} ${s.color} flex items-center justify-center shadow-inner`}>
                                <s.icon size={28} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.label}</p>
                                <h3 className="text-2xl font-black text-slate-900 tracking-tighter italic">{s.value}</h3>
                                <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mt-0.5">{s.sub}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Payout Console */}
            <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden flex flex-col items-center justify-center min-h-[300px] border border-slate-800 shadow-2xl">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent opacity-50"></div>

                <div className="relative z-10 text-center space-y-6">
                    <div className="w-20 h-20 bg-blue-600/20 rounded-[2rem] border border-blue-500/30 flex items-center justify-center mx-auto mb-4 group hover:scale-110 transition-transform cursor-pointer">
                        <Landmark size={36} className="text-blue-400 group-hover:text-white transition-colors" />
                    </div>
                    <div className="space-y-1">
                        <h2 className="text-2xl font-black italic uppercase tracking-[0.1em]">Settlement Pipeline</h2>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center justify-center gap-2">
                            <ShieldCheck size={12} className="text-emerald-500" /> Verify Bank Reconciliation
                        </p>
                    </div>
                    <div className="pt-4 flex gap-4 justify-center">
                        <button className="px-10 py-4 bg-white text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-50 transition-all shadow-xl shadow-white/10">Configure Bank Entry</button>
                        <button className="px-10 py-4 bg-slate-800 border border-slate-700 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-700 transition-all">Download Audit Log</button>
                    </div>
                </div>
            </div>

            {/* Transaction Hub */}
            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
                {/* Hub Actions */}
                <div className="p-8 border-b border-slate-100 flex flex-col lg:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white"><FileText size={20} /></div>
                        <div>
                            <h3 className="text-lg font-black italic tracking-tight text-slate-800">Transaction History</h3>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Real-time Ledger Node</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 w-full lg:w-auto">
                        <div className="relative flex-1 lg:w-64">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search Ledger..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-12 pr-4 py-3 text-sm font-bold text-slate-800 outline-none focus:ring-4 ring-blue-50 transition-all"
                            />
                        </div>
                        <button className="p-3 bg-slate-50 text-slate-400 border border-slate-100 rounded-xl hover:text-slate-900 transition-all"><Filter size={20} /></button>
                        <button className="p-3 bg-slate-50 text-slate-400 border border-slate-100 rounded-xl hover:text-slate-900 transition-all"><Download size={20} /></button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50">
                            <tr>
                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Descriptor</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Chronology</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Magnitude</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">State</th>
                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Method</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr><td colSpan="5" className="p-24 text-center"><Loader2 className="animate-spin text-blue-600 mx-auto mb-4" size={40} /><p className="text-xs font-black text-slate-400 uppercase tracking-widest">Accessing Ledger Chain</p></td></tr>
                            ) : payments?.transactions?.length > 0 ? (
                                payments.transactions.map(tx => (
                                    <tr key={tx.order_id} className="hover:bg-slate-50/80 transition-colors group">
                                        <td className="px-10 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xs">#TX</div>
                                                <div>
                                                    <p className="font-black text-slate-800 text-sm tracking-tight">Order #{tx.order_id}</p>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">Platform Sale</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-black text-slate-700">{new Date(tx.date).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</span>
                                                <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mt-1">{new Date(tx.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <span className="text-base font-black text-slate-900 italic">₹{parseFloat(tx.amount).toLocaleString()}</span>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <span className={`inline-flex items-center px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusColor(tx.status)}`}>
                                                {tx.status}
                                            </span>
                                        </td>
                                        <td className="px-10 py-6 text-right">
                                            <div className="flex flex-col items-end">
                                                <span className="text-xs font-black text-slate-800 uppercase tracking-widest">{tx.payment_method}</span>
                                                <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest mt-1">Verified Gate</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="5" className="p-32 text-center flex flex-col items-center gap-4"><IndianRupee size={48} className="text-slate-100" strokeWidth={1} /><h3 className="text-lg font-black text-slate-300 uppercase tracking-widest">Financial Void</h3></td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Payments;
