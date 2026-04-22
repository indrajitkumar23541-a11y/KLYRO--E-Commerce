import React, { useState, useEffect } from 'react';
import {
    TrendingUp, TrendingDown, IndianRupee, ShoppingCart,
    Package, Calendar, Users, MousePointer2, Target,
    BarChart3, PieChart as PieChartIcon, LineChart as LineChartIcon,
    Sparkles, Zap, BrainCircuit, Info, Download, Filter,
    ArrowUpRight, ArrowDownRight, Activity, Percent, AlertCircle
} from 'lucide-react';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import {
    AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell
} from 'recharts';

const Analytics = () => {
    const { token } = useAuth();
    const [analytics, setAnalytics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('30d');

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const res = await API.get('/seller/analytics', config);
                if (res.data.success) {
                    const formattedData = res.data.analytics.map(item => ({
                        date: new Date(item.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
                        orders: item.orders,
                        revenue: parseFloat(item.revenue),
                        visitors: Math.floor(item.orders * (10 + Math.random() * 20)), // Mock visitor data
                        conversion: ((item.orders / (item.orders * 15)) * 100).toFixed(1)
                    }));
                    setAnalytics(formattedData);
                }
            } catch (error) {
                console.error('Failed to fetch analytics', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, [token]);

    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

    const summaryStats = [
        { label: 'Conversion Protocol', value: '4.2%', trend: '+0.8%', icon: Target, color: 'text-emerald-500', bg: 'bg-emerald-50' },
        { label: 'Visitor Flux', value: '1,284', trend: '+12%', icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
        { label: 'Avg Order Value', value: '₹1,420', trend: '-2%', icon: IndianRupee, color: 'text-indigo-500', bg: 'bg-indigo-50' },
        { label: 'Product Reach', value: '8.4K', trend: '+24%', icon: Activity, color: 'text-orange-500', bg: 'bg-orange-50' }
    ];

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
                <BrainCircuit className="animate-pulse text-blue-600" size={48} />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Compiling Intelligence Nodes</p>
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-reveal">
            {/* Intel Header */}
            <div className="bg-slate-900 p-10 rounded-[3rem] text-white border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent opacity-50"></div>

                <div className="relative z-10 flex items-center gap-6">
                    <div className="w-16 h-16 rounded-[2rem] bg-blue-600 flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
                        <BarChart3 size={32} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black italic uppercase tracking-[0.1em]">Intelligence Ops</h1>
                        <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.4em] mt-1 flex items-center gap-2">
                            <Activity size={12} className="animate-pulse" /> Real-time Analytics Feed
                        </p>
                    </div>
                </div>

                <div className="relative z-10 flex bg-slate-800 p-1.5 rounded-2xl border border-slate-700/50">
                    {['7d', '30d', '90d', 'All'].map(range => (
                        <button
                            key={range}
                            onClick={() => setTimeRange(range)}
                            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${timeRange === range ? 'bg-white text-slate-900 shadow-xl' : 'text-slate-500 hover:text-white'}`}
                        >
                            {range}
                        </button>
                    ))}
                </div>
            </div>

            {/* Core Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {summaryStats.map((s, i) => (
                    <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                        <div className="relative flex items-center justify-between mb-4">
                            <div className={`w-12 h-12 rounded-2xl ${s.bg} ${s.color} flex items-center justify-center shadow-inner`}>
                                <s.icon size={24} />
                            </div>
                            <span className={`text-[10px] font-black px-3 py-1 rounded-full flex items-center gap-1 ${s.trend.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                {s.trend.startsWith('+') ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />} {s.trend}
                            </span>
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">{s.label}</p>
                        <h3 className="text-2xl font-black text-slate-900 tracking-tighter italic">{s.value}</h3>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Revenue Main Chart */}
                <div className="lg:col-span-2 bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-lg font-black italic tracking-tight text-slate-800">Gross Revenue Delta</h3>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Financial Trajectory</p>
                        </div>
                        <button className="p-3 bg-slate-50 rounded-xl text-slate-400 hover:text-slate-900 transition-all"><Download size={20} /></button>
                    </div>
                    <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={analytics}>
                                <defs>
                                    <linearGradient id="colorRevenuePremium" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontBold: '800', fill: '#94a3b8' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fontBold: '800', fill: '#94a3b8' }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)', background: '#0f172a', color: '#fff' }}
                                    itemStyle={{ color: '#60a5fa', fontWeight: '800', fontSize: '12px' }}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={4} fill="url(#colorRevenuePremium)" activeDot={{ r: 8, strokeWidth: 0, fill: '#3b82f6' }} />
                                <Area type="monotone" dataKey="visitors" stroke="#94a3b8" strokeWidth={2} fill="transparent" strokeDasharray="5 5" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* AI Recommendation Sidebar */}
                <div className="space-y-6">
                    <div className="bg-slate-900 p-8 rounded-[3rem] text-white border border-slate-800 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-6 opacity-20"><Sparkles className="animate-spin-slow" size={48} /></div>
                        <div className="relative z-10 space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center shadow-lg"><BrainCircuit size={20} /></div>
                                <h3 className="text-sm font-black uppercase tracking-widest italic">AI Optimization Feed</h3>
                            </div>

                            <div className="space-y-4">
                                {[
                                    { msg: "Price reduction of 5% on SKU-X12 could yield 15% more volume.", type: "inventory", icon: Zap },
                                    { msg: "Organic traffic is spiking in Electronics category. Run a coupon?", type: "marketing", icon: Target },
                                    { msg: "Restock required: Summer T-Shirt stock below 10%", type: "alert", icon: AlertCircle }
                                ].map((rec, i) => (
                                    <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all cursor-pointer group/item">
                                        <div className="flex gap-4">
                                            <rec.icon size={16} className="text-indigo-400 mt-1 flex-shrink-0" />
                                            <p className="text-[11px] font-bold text-slate-300 leading-relaxed group-hover/item:text-white transition-colors">{rec.msg}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2">
                                <Sparkles size={14} /> Execute All Ops
                            </button>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
                        <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-6 italic">Traffic Attribution</h4>
                        <div className="space-y-4">
                            {[
                                { name: 'Direct Search', value: 45, color: 'bg-blue-500' },
                                { name: 'Social Media', value: 30, color: 'bg-indigo-500' },
                                { name: 'Email Campaigns', value: 15, color: 'bg-emerald-500' },
                                { name: 'Referral', value: 10, color: 'bg-orange-500' }
                            ].map((s, i) => (
                                <div key={i} className="space-y-1.5">
                                    <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-slate-400">
                                        <span>{s.name}</span>
                                        <span>{s.value}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                                        <div className={`h-full ${s.color} transition-all duration-1000`} style={{ width: `${s.value}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Category Intelligence */}
            <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-lg font-black italic tracking-tight text-slate-800">Operational Performance</h3>
                    <div className="flex gap-2">
                        <button className="px-5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all">By SKU</button>
                        <button className="px-5 py-2.5 bg-slate-900 border border-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest text-white shadow-lg">By Category</button>
                    </div>
                </div>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analytics}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontBold: '800', fill: '#94a3b8' }} />
                            <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)' }} />
                            <Bar dataKey="orders" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={12} />
                            <Bar dataKey="conversion" fill="#fbbf24" radius={[6, 6, 0, 0]} barSize={12} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
