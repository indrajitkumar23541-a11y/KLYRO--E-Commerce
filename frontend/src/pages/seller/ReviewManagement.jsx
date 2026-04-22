import React, { useState, useEffect } from 'react';
import {
    Star, MessageSquare, Reply, Filter, Search,
    ChevronRight, ArrowUpRight, Loader2, MessageCircle,
    User as UserIcon, CheckCircle2, Clock, AlertCircle,
    ThumbsUp, ShieldCheck, CornerDownRight
} from 'lucide-react';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const ReviewManagement = () => {
    const { token } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const res = await API.get('/seller/reviews', config);
            if (res.data.success) {
                setReviews(res.data.reviews);
            }
        } catch (error) {
            console.error('Failed to fetch reviews', error);
        } finally {
            setLoading(false);
        }
    };

    const handleReply = async (reviewId) => {
        if (!replyText.trim()) return;
        setIsSubmitting(true);
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await API.put(`/seller/reviews/${reviewId}/reply`, { reply: replyText }, config);

            // Update local state
            setReviews(reviews.map(r => r.id === reviewId ? { ...r, seller_reply: replyText } : r));
            setReplyingTo(null);
            setReplyText('');
        } catch (error) {
            console.error('Failed to post reply', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredReviews = reviews.filter(r => {
        const matchesSearch = r.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.comment?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = activeFilter === 'All' ||
            (activeFilter === 'Awaiting Reply' && !r.seller_reply) ||
            (activeFilter === 'Critical' && r.rating <= 2) ||
            (activeFilter === 'Positive' && r.rating >= 4);
        return matchesSearch && matchesFilter;
    });

    const stats = {
        avgRating: reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : 0,
        totalReviews: reviews.length,
        replyRate: reviews.length > 0 ? ((reviews.filter(r => r.seller_reply).length / reviews.length) * 100).toFixed(0) : 0
    };

    const renderStars = (rating) => {
        return (
            <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map(star => (
                    <Star key={star} size={14} className={star <= rating ? "fill-orange-400 text-orange-400" : "text-slate-200"} />
                ))}
            </div>
        );
    };

    return (
        <div className="space-y-8 animate-reveal">
            {/* Reputation Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {[
                    { label: 'Merchant Reputation', value: `${stats.avgRating} / 5.0`, icon: ShieldCheck, color: 'text-orange-600', bg: 'bg-orange-50', sub: 'Trust Index' },
                    { label: 'Social Engagement', value: stats.totalReviews, icon: MessageCircle, color: 'text-blue-600', bg: 'bg-blue-50', sub: 'Total Feedback' },
                    { label: 'Responsiveness', value: `${stats.replyRate}%`, icon: Reply, color: 'text-emerald-600', bg: 'bg-emerald-50', sub: 'Review Sync' }
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
                <div className="absolute inset-0 bg-orange-500/5 pointer-events-none"></div>
                <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
                            <Star size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black italic tracking-tighter">Reputation Management</h2>
                            <p className="text-[9px] font-black text-orange-400 uppercase tracking-[0.2em] mt-0.5">Customer Trust Protocol</p>
                        </div>
                    </div>

                    <div className="flex bg-slate-800 p-1.5 rounded-2xl border border-slate-700/50 overflow-x-auto no-scrollbar items-center gap-2">
                        {['All', 'Awaiting Reply', 'Critical', 'Positive'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveFilter(tab)}
                                className={`whitespace-nowrap px-6 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeFilter === tab ? 'bg-white text-slate-900 shadow-xl' : 'text-slate-500 hover:text-white'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="flex-1 w-full lg:max-w-xs relative">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                        <input
                            type="text"
                            placeholder="Scan feedback content..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl pl-12 pr-6 py-3.5 text-sm font-bold text-white outline-none focus:bg-slate-800 transition-all placeholder:text-slate-600"
                        />
                    </div>
                </div>
            </div>

            {/* Review Flow */}
            <div className={`grid grid-cols-1 gap-6 ${loading ? 'opacity-50' : ''}`}>
                {loading ? (
                    <div className="p-32 text-center flex flex-col items-center gap-4 bg-white rounded-[3rem] border border-slate-100 shadow-sm">
                        <Loader2 className="animate-spin text-orange-500" size={40} />
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Scanning Social Nodes</p>
                    </div>
                ) : filteredReviews.length > 0 ? (
                    filteredReviews.map(review => (
                        <div key={review.id} className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm hover:shadow-xl hover:shadow-slate-200/40 transition-all relative group">
                            <div className="flex flex-col lg:flex-row gap-8">
                                {/* Left Side: User & Product */}
                                <div className="lg:w-1/4 space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 p-1 overflow-hidden shadow-inner">
                                            {review.user_avatar ? (
                                                <img src={review.user_avatar} className="w-full h-full object-cover" alt="" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-300"><UserIcon size={20} /></div>
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-black text-slate-800 text-xs tracking-tight">{review.user_name}</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">Verified Buyer</p>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 p-1 flex-shrink-0">
                                            <img src={review.product_image} className="w-full h-full object-contain" alt="" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[10px] font-black text-slate-800 truncate leading-tight mb-1">{review.product_name}</p>
                                            <div className="flex items-center gap-2">
                                                <CheckCircle2 size={10} className="text-emerald-500" />
                                                <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">In Stock</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side: Content & Actions */}
                                <div className="flex-1 space-y-6">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="mb-2">{renderStars(review.rating)}</div>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
                                                <Clock size={12} /> {new Date(review.created_at).toLocaleDateString('en-IN', { dateStyle: 'long' })}
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="p-3 bg-slate-50 text-slate-400 hover:text-blue-600 rounded-xl transition-all"><ThumbsUp size={18} /></button>
                                            <button className="p-3 bg-slate-50 text-slate-400 hover:text-red-500 rounded-xl transition-all"><AlertCircle size={18} /></button>
                                        </div>
                                    </div>
                                    <p className="text-slate-600 text-sm font-medium leading-relaxed italic">"{review.comment}"</p>

                                    {/* Seller Response Logic */}
                                    {review.seller_reply ? (
                                        <div className="p-6 bg-blue-50/50 rounded-[2rem] border border-blue-100 relative group/reply">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white"><Reply size={14} className="rotate-180" /></div>
                                                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Official Merchant Response</span>
                                            </div>
                                            <p className="text-slate-700 text-xs font-bold leading-relaxed">{review.seller_reply}</p>
                                        </div>
                                    ) : replyingTo === review.id ? (
                                        <div className="space-y-4 animate-reveal">
                                            <textarea
                                                autoFocus
                                                value={replyText}
                                                onChange={(e) => setReplyText(e.target.value)}
                                                className="w-full bg-slate-50 border-2 border-orange-500/20 rounded-2xl px-6 py-4 text-xs font-bold text-slate-800 focus:bg-white focus:border-orange-500 outline-none transition-all resize-none"
                                                placeholder="Craft your professional response..."
                                                rows="3"
                                            />
                                            <div className="flex justify-end gap-3">
                                                <button onClick={() => setReplyingTo(null)} className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Cancel</button>
                                                <button
                                                    disabled={isSubmitting}
                                                    onClick={() => handleReply(review.id)}
                                                    className="px-8 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-black transition-all shadow-lg"
                                                >
                                                    {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                                                    Post Engagement
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => { setReplyingTo(review.id); setReplyText(''); }}
                                            className="flex items-center gap-2 px-6 py-3 text-[10px] font-black text-orange-600 uppercase tracking-widest border-2 border-orange-100 rounded-xl hover:bg-orange-50 transition-all opacity-0 group-hover:opacity-100"
                                        >
                                            <Reply size={16} className="rotate-180" /> Interact with Customer
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-32 text-center flex flex-col items-center gap-4 bg-white rounded-[3rem] border border-dashed border-slate-200">
                        <Star size={64} strokeWidth={1} className="text-slate-100 mb-2" />
                        <h3 className="text-lg font-black text-slate-300 uppercase tracking-[0.3em]">No Social Signatures Found</h3>
                        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest max-w-sm leading-relaxed">Customers are yet to provide social validation for these inventory items.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReviewManagement;
