import React, { useState, useEffect } from 'react';
import {
    Megaphone, Ticket, Plus, Tag, Calendar,
    Trash2, Save, X, Search, Filter, Loader2,
    TrendingUp, MousePointer2, Eye, CircleDollarSign,
    Target, Share2, Copy, CheckCircle2, AlertCircle,
    LayoutGrid, Image as ImageIcon, Sparkles, Zap
} from 'lucide-react';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const MarketingManagement = () => {
    const { token } = useAuth();
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('coupons'); // 'coupons' or 'ads'

    // Coupon Modal State
    const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [newCoupon, setNewCoupon] = useState({
        code: '',
        discount_type: 'percentage',
        discount_value: '',
        min_purchase: 0,
        max_discount: '',
        expiry_date: '',
        usage_limit: ''
    });

    useEffect(() => {
        if (activeTab === 'coupons') fetchCoupons();
    }, [activeTab]);

    const fetchCoupons = async () => {
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const res = await API.get('/seller/coupons', config);
            if (res.data.success) {
                setCoupons(res.data.coupons);
            }
        } catch (error) {
            console.error('Failed to fetch coupons', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateCoupon = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await API.post('/seller/coupons', newCoupon, config);
            fetchCoupons();
            setIsCouponModalOpen(false);
            setNewCoupon({ code: '', discount_type: 'percentage', discount_value: '', min_purchase: 0, max_discount: '', expiry_date: '', usage_limit: '' });
        } catch (error) {
            console.error('Failed to create coupon', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteCoupon = async (id) => {
        if (!window.confirm('Delete this promotional code?')) return;
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await API.delete(`/seller/coupons/${id}`, config);
            setCoupons(coupons.filter(c => c.id !== id));
        } catch (error) {
            console.error('Failed to delete coupon', error);
        }
    };

    const toggleCouponStatus = async (coupon) => {
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await API.put(`/seller/coupons/${coupon.id}`, { ...coupon, is_active: !coupon.is_active }, config);
            setCoupons(coupons.map(c => c.id === coupon.id ? { ...c, is_active: !c.is_active } : c));
        } catch (error) {
            console.error('Failed to update coupon status', error);
        }
    };

    return (
        <div className="space-y-8 animate-reveal">
            {/* Strategy Header */}
            <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-[2rem] bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-500/20">
                        <Megaphone size={32} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black italic tracking-tighter text-slate-800 uppercase">Growth Engine</h1>
                        <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em] mt-1 flex items-center gap-2">
                            <Zap size={12} className="fill-indigo-500" /> Marketplace Scaling Suite v2.0
                        </p>
                    </div>
                </div>

                <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
                    <button
                        onClick={() => setActiveTab('coupons')}
                        className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'coupons' ? 'bg-white text-indigo-600 shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        Promotions
                    </button>
                    <button
                        onClick={() => setActiveTab('ads')}
                        className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'ads' ? 'bg-white text-indigo-600 shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        Ad Manager
                    </button>
                </div>
            </div>

            {activeTab === 'coupons' ? (
                <div className="space-y-8">
                    {/* Coupons Utility Row */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex-1 w-full relative">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search by Promo Code..."
                                className="w-full bg-white border border-slate-100 rounded-2xl pl-14 pr-6 py-4 text-sm font-bold text-slate-800 outline-none focus:ring-4 ring-indigo-50 transition-all"
                            />
                        </div>
                        <button
                            onClick={() => setIsCouponModalOpen(true)}
                            className="w-full md:w-auto px-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl shadow-slate-900/20 active:scale-95"
                        >
                            <Plus size={20} /> Generate Promo Code
                        </button>
                    </div>

                    {/* Coupons List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {loading ? (
                            <div className="col-span-full p-24 text-center"><Loader2 className="animate-spin text-indigo-500 mx-auto mb-4" size={40} /><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Accessing Offer Nodes</p></div>
                        ) : coupons.length > 0 ? (
                            coupons.map(coupon => (
                                <div key={coupon.id} className="bg-white border-2 border-slate-50 rounded-[2.5rem] p-8 relative overflow-hidden group hover:border-indigo-100 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all">
                                    <div className={`absolute top-0 right-0 px-6 py-1.5 text-[8px] font-black uppercase tracking-[0.2em] rounded-bl-2xl ${coupon.is_active ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                                        {coupon.is_active ? 'Active' : 'Paused'}
                                    </div>

                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
                                            <Ticket size={24} strokeWidth={2.5} />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-black text-slate-800 tracking-tighter italic uppercase">{coupon.code}</h4>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Expires: {new Date(coupon.expiry_date).toLocaleDateString()}</p>
                                        </div>
                                    </div>

                                    <div className="p-6 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-100 mb-6 flex justify-between items-center">
                                        <div>
                                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Discount Magnitude</p>
                                            <p className="text-xl font-black text-indigo-600 italic">
                                                {coupon.discount_type === 'percentage' ? `${coupon.discount_value}%` : `₹${coupon.discount_value}`}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Usage Count</p>
                                            <p className="text-xl font-black text-slate-800 italic">{coupon.usage_count} <span className="text-[10px] text-slate-300">/ {coupon.usage_limit || '∞'}</span></p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between gap-4">
                                        <button
                                            onClick={() => toggleCouponStatus(coupon)}
                                            className={`flex-1 py-3.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${coupon.is_active ? 'bg-red-50 text-red-500 hover:bg-red-500 hover:text-white border border-red-100' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white border border-emerald-100'}`}
                                        >
                                            {coupon.is_active ? 'Deactivate' : 'Reactivate'}
                                        </button>
                                        <button onClick={() => handleDeleteCoupon(coupon.id)} className="p-3.5 bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all border border-slate-100">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full p-24 text-center flex flex-col items-center gap-4 bg-white rounded-[3rem] border border-dashed border-slate-200">
                                <Sparkles size={64} strokeWidth={1} className="text-slate-100" />
                                <h3 className="text-lg font-black text-slate-300 uppercase tracking-widest">Promotional Void Detected</h3>
                                <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest max-w-sm">Initiate a promo sequence to boost marketplace discovery.</p>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="space-y-8 animate-reveal">
                    {/* Ads Management Mockup */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {[
                            { label: 'Ad Impressions', value: '128.4K', icon: Eye, color: 'text-blue-500' },
                            { label: 'Click Rate (CTR)', value: '4.2%', icon: MousePointer2, color: 'text-purple-500' },
                            { label: 'Attributed Sales', value: '₹42,800', icon: CircleDollarSign, color: 'text-emerald-500' },
                            { label: 'ROAS', value: '6.4x', icon: TrendingUp, color: 'text-orange-500' }
                        ].map((s, i) => (
                            <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center ${s.color}`}>
                                    <s.icon size={20} />
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
                                    <p className="text-lg font-black text-slate-800">{s.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-slate-900 rounded-[3rem] p-12 text-white relative overflow-hidden min-h-[400px] flex flex-col items-center justify-center text-center">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/40 to-transparent"></div>

                        <div className="relative z-10 space-y-6">
                            <div className="w-24 h-24 bg-white/10 rounded-[2rem] border border-white/10 flex items-center justify-center mx-auto backdrop-blur-xl mb-6 group hover:scale-110 transition-transform">
                                <ImageIcon size={40} className="text-indigo-400 group-hover:text-white transition-colors" />
                            </div>
                            <h2 className="text-3xl font-black italic tracking-tighter uppercase max-w-xl">Bespoke Storefront Campaigns</h2>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em] max-w-sm mx-auto leading-relaxed">
                                Upload cinematic banners to dominate category real estate and secure prime marketplace placement.
                            </p>
                            <div className="pt-4 flex gap-4 justify-center">
                                <button className="px-10 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-600/30 transition-all active:scale-95">Configure Placement</button>
                                <button className="px-10 py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest border border-white/10 transition-all">View Specs</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Coupon Modal */}
            {isCouponModalOpen && (
                <div className="fixed inset-0 bg-slate-900/70 z-[600] flex items-center justify-center backdrop-blur-md p-4 animate-reveal">
                    <div className="bg-white w-full max-w-3xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col border border-white/20">
                        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <div>
                                <h3 className="text-xl font-black italic text-slate-800 tracking-tight uppercase">Generate Promo Signature</h3>
                                <p className="text-[9px] font-black text-indigo-600 uppercase tracking-[0.4em] mt-1 italic">Protocol ALPHA-MARKET</p>
                            </div>
                            <button onClick={() => setIsCouponModalOpen(false)} className="p-3 bg-white border border-slate-200 rounded-full hover:text-red-500 transition-all shadow-sm"><X size={24} /></button>
                        </div>

                        <form onSubmit={handleCreateCoupon} className="p-10 space-y-8 overflow-y-auto no-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Promo Code</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="e.g. SUMMER50"
                                        value={newCoupon.code}
                                        onChange={e => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                                        className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-6 py-4 font-black text-slate-900 focus:bg-white focus:border-indigo-500 outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Magnitude Type</label>
                                    <div className="flex bg-slate-50 p-1.5 rounded-2xl border-2 border-transparent">
                                        <button
                                            type="button"
                                            onClick={() => setNewCoupon({ ...newCoupon, discount_type: 'percentage' })}
                                            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${newCoupon.discount_type === 'percentage' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}
                                        >
                                            Percentage
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setNewCoupon({ ...newCoupon, discount_type: 'fixed' })}
                                            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${newCoupon.discount_type === 'fixed' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}
                                        >
                                            Fixed Amount
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Value</label>
                                    <input
                                        required type="number" placeholder="20"
                                        value={newCoupon.discount_value}
                                        onChange={e => setNewCoupon({ ...newCoupon, discount_value: e.target.value })}
                                        className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-6 py-4 font-black text-slate-900 focus:bg-white focus:border-indigo-500 outline-none transition-all text-center"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Min Purchase (₹)</label>
                                    <input
                                        type="number" placeholder="499"
                                        value={newCoupon.min_purchase}
                                        onChange={e => setNewCoupon({ ...newCoupon, min_purchase: e.target.value })}
                                        className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-6 py-4 font-black text-slate-900 focus:bg-white focus:border-indigo-500 outline-none transition-all text-center"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Usage Cap</label>
                                    <input
                                        type="number" placeholder="Unlimited"
                                        value={newCoupon.usage_limit}
                                        onChange={e => setNewCoupon({ ...newCoupon, usage_limit: e.target.value })}
                                        className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-6 py-4 font-black text-slate-900 focus:bg-white focus:border-indigo-500 outline-none transition-all text-center"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Expiry Protocol (Date)</label>
                                <input
                                    required type="date"
                                    value={newCoupon.expiry_date}
                                    onChange={e => setNewCoupon({ ...newCoupon, expiry_date: e.target.value })}
                                    className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-6 py-4 font-black text-slate-900 focus:bg-white focus:border-indigo-500 outline-none transition-all"
                                />
                            </div>

                            <div className="pt-8 flex justify-end items-center gap-8">
                                <button type="button" onClick={() => setIsCouponModalOpen(false)} className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors">Discard Draft</button>
                                <button
                                    disabled={isSaving}
                                    type="submit"
                                    className="px-16 py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all shadow-2xl shadow-indigo-600/30 hover:-translate-y-1 active:scale-95 disabled:bg-slate-300"
                                >
                                    {isSaving ? <Loader2 className="animate-spin" /> : 'Synchronize Offer'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MarketingManagement;
