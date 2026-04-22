import React, { useState, useEffect } from 'react';
import {
    Users, Search, Filter, Mail, Phone, Calendar,
    TrendingUp, ShoppingBag, CreditCard, ChevronRight,
    ArrowUpRight, Download, MoreHorizontal, MessageSquare,
    Loader2, User as UserIcon, Award, Target
} from 'lucide-react';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const CustomerManagement = () => {
    const { token } = useAuth();
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const res = await API.get('/seller/customers', config);
            if (res.data.success) {
                setCustomers(res.data.customers);
            }
        } catch (error) {
            console.error('Failed to fetch customers', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredCustomers = customers.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const stats = {
        totalCustomers: customers.length,
        avgLTV: customers.length > 0 ? (customers.reduce((acc, c) => acc + parseFloat(c.total_spend), 0) / customers.length).toFixed(2) : 0,
        repeatRate: customers.length > 0 ? ((customers.filter(c => c.total_orders > 1).length / customers.length) * 100).toFixed(1) : 0
    };

    return (
        <div className="space-y-8 animate-reveal">
            {/* Header / Analytics Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {[
                    { label: 'Total Buyer Base', value: stats.totalCustomers, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', sub: 'Active Reach' },
                    { label: 'Avg Customer LTV', value: `₹${parseFloat(stats.avgLTV).toLocaleString()}`, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50', sub: 'Lifetime Value' },
                    { label: 'Retention Flow', value: `${stats.repeatRate}%`, icon: Target, color: 'text-indigo-600', bg: 'bg-indigo-50', sub: 'Repeat Purchase' }
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

            {/* Hub Console */}
            <div className="bg-slate-900 rounded-[3rem] p-8 text-white border border-slate-800 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-500/5 pointer-events-none"></div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                            <Target size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black italic tracking-tighter">Customer Command Center</h2>
                            <p className="text-[9px] font-black text-blue-400 uppercase tracking-[0.2em] mt-0.5">Relational Intelligence Hub</p>
                        </div>
                    </div>
                    <div className="flex-1 w-full md:max-w-xl relative">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input
                            type="text"
                            placeholder="Execute persona search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl pl-14 pr-6 py-4 text-sm font-bold text-white outline-none focus:bg-slate-800 transition-all placeholder:text-slate-600"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-6 py-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl transition-all group">
                        <Download size={18} className="text-blue-400 group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Export Core</span>
                    </button>
                </div>
            </div>

            {/* Customer Roster */}
            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50 border-b border-slate-100">
                            <tr>
                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer Persona</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Engagement</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Value (LTV)</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Last Interaction</th>
                                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr><td colSpan="5" className="p-24 text-center"><Loader2 className="animate-spin text-blue-600 mx-auto mb-4" size={40} /><p className="text-xs font-black text-slate-400 uppercase tracking-widest">Compiling Identities</p></td></tr>
                            ) : filteredCustomers.map(customer => (
                                <tr key={customer.id} className="hover:bg-slate-50/80 transition-colors group">
                                    <td className="px-10 py-6">
                                        <div className="flex items-center gap-5">
                                            <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 p-1 flex items-center justify-center overflow-hidden shadow-sm group-hover:scale-110 transition-transform">
                                                {customer.avatar ? (
                                                    <img src={customer.avatar} className="w-full h-full object-cover" alt="" />
                                                ) : (
                                                    <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">
                                                        <UserIcon size={24} />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-black text-slate-800 text-sm tracking-tight mb-0.5">{customer.name}</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide italic">{customer.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="flex bg-slate-100 px-3 py-1 rounded-full items-center gap-2">
                                                <ShoppingBag size={12} className="text-blue-500" />
                                                <span className="text-[10px] font-black text-slate-700">{customer.total_orders} Orders</span>
                                            </div>
                                            {customer.total_orders > 1 && (
                                                <span className="bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border border-emerald-100">Loyal</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <div className="flex flex-col items-center">
                                            <span className="text-base font-black text-slate-900 italic">₹{parseFloat(customer.total_spend).toLocaleString()}</span>
                                            <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mt-0.5">Gross Spend</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <div className="flex flex-col items-center">
                                            <span className="text-xs font-black text-slate-700">{new Date(customer.last_order_date).toLocaleDateString()}</span>
                                            <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mt-0.5">Order Sync</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                                            <button className="p-3 bg-white border border-slate-100 rounded-xl hover:text-blue-600 hover:shadow-lg transition-all"><MessageSquare size={18} /></button>
                                            <button className="p-3 bg-white border border-slate-100 rounded-xl hover:text-slate-900 hover:shadow-lg transition-all"><ArrowUpRight size={18} /></button>
                                            <button className="p-3 bg-white border border-slate-100 rounded-xl text-slate-300 hover:text-slate-900 transition-all"><MoreHorizontal size={18} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Empty State / Bottom Info */}
            {!loading && filteredCustomers.length === 0 && (
                <div className="p-32 text-center flex flex-col items-center gap-4 bg-white rounded-[3rem] border border-dashed border-slate-200">
                    <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-4 border border-slate-100 shadow-inner">
                        <Award size={48} strokeWidth={1} />
                    </div>
                    <h3 className="text-lg font-black text-slate-400 uppercase tracking-widest">Identity Manifest Null</h3>
                    <p className="text-xs font-bold text-slate-300 uppercase tracking-widest max-w-sm leading-relaxed">No customers matching your search query were found in the relational grid.</p>
                </div>
            )}
        </div>
    );
};

export default CustomerManagement;
