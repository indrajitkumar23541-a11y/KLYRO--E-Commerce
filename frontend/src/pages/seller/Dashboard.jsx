import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ShoppingBag, ShoppingCart, IndianRupee, ChevronRight, TrendingUp,
    Package, ArrowUpRight, Clock, Target, CreditCard, PieChart as PieChartIcon,
    Bell, Zap, Users, Star, ArrowUp, ArrowDown, Calendar, Filter, MoreHorizontal,
    Plus, CheckCircle2, ChevronLeft, Layout, Megaphone, Smartphone, HelpCircle,
    BarChart2, ChevronDown, Ticket, Smartphone as SmartphoneIcon
} from 'lucide-react';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line
} from 'recharts';

const Dashboard = () => {
    const navigate = useNavigate();
    const { token, user } = useAuth();
    const [stats, setStats] = useState({
        totalOrders: 1248,
        totalProducts: 45,
        totalRevenue: 245890.00,
        unitsSold: 2350,
        payoutBalance: 68750.00,
        conversionRate: 6.35
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const salesData = [
        { name: 'May 22', value: 20000, last: 18000 },
        { name: 'May 23', value: 35000, last: 32000 },
        { name: 'May 24', value: 28000, last: 30000 },
        { name: 'May 25', value: 45000, last: 38000 },
        { name: 'May 26', value: 38000, last: 42000 },
        { name: 'May 27', value: 52000, last: 45000 },
        { name: 'May 28', value: 48000, last: 40000 },
    ];

    const channelData = [
        { name: 'KLYRO Marketplace', value: 145200, color: '#2563eb' },
        { name: 'Your Store', value: 76400, color: '#10b981' },
        { name: 'Other Channels', value: 24290, color: '#f59e0b' },
    ];

    const tasks = [
        { id: 1, text: 'Upload Return Documents', count: 3, checked: false },
        { id: 2, text: 'Pending Orders to Ship', count: 12, checked: false },
        { id: 3, text: 'Low Stock Products', count: 8, checked: false },
        { id: 4, text: 'Out of Stock Products', count: 5, checked: false },
    ];

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const resOrders = await API.get('/seller/orders', config);
                if (resOrders.data.success) {
                    setRecentOrders(resOrders.data.orders.slice(0, 5));
                }
            } catch (error) {
                console.error('Failed to fetch dashboard data', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, [token]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-12 animate-reveal">
            {/* Greeting & Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight">Welcome back, {user?.name || 'Pooki Store'}! 👋</h1>
                    <p className="text-slate-500 text-sm font-medium mt-1">Here's what's happening with your business today.</p>
                </div>
                <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
                    <Calendar size={18} className="text-slate-400" />
                    <span className="text-sm font-bold text-slate-600">May 22 — May 28, 2024</span>
                    <ChevronDown size={14} className="text-slate-300" />
                </div>
            </div>

            {/* Performance Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {[
                    { label: 'Total Sales', value: `₹${(stats?.total_revenue ?? 0).toLocaleString()}`, change: '+ 18.6%', trend: 'up', icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                    { label: 'Orders', value: (stats?.orders_count ?? 0).toLocaleString(), change: '+ 12.4%', trend: 'up', icon: ShoppingBag, color: 'text-blue-500', bg: 'bg-blue-50' },
                    { label: 'Units Sold', value: (stats?.units_sold ?? 0).toLocaleString(), change: '+ 15.7%', trend: 'up', icon: Package, color: 'text-purple-500', bg: 'bg-purple-50' },
                    { label: 'Payout Balance', value: `₹${(stats?.payout_balance ?? 0).toLocaleString()}`, sub: 'View Payments', icon: CreditCard, color: 'text-orange-500', bg: 'bg-orange-50' },
                    { label: 'Conversion Rate', value: `${stats?.conversion_rate ?? 0}%`, change: '+ 8.2%', trend: 'up', icon: Target, color: 'text-cyan-500', bg: 'bg-cyan-50' }
                ].map((s, i) => (
                    <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex flex-col">
                                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{s.label}</span>
                                <h2 className="text-xl font-black text-slate-800 tracking-tighter italic">
                                    {s.value}
                                </h2>
                            </div>
                            <div className={`w-10 h-10 rounded-xl ${s.bg} ${s.color} flex items-center justify-center shadow-inner`}>
                                <s.icon size={20} />
                            </div>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                            {s.change ? (
                                <div className="flex items-center gap-1.5">
                                    <span className={`text-[11px] font-black ${s.trend === 'up' ? 'text-emerald-500' : 'text-red-500'}`}>
                                        {s.trend === 'up' ? '↑' : '↓'} {s.change}
                                    </span>
                                    <span className="text-[10px] font-bold text-slate-300">vs May 15 — May 21</span>
                                </div>
                            ) : (
                                <button className="text-[10px] font-black text-blue-600 hover:underline">{s.sub}</button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Analytics Row */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Sales Overview */}
                <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 relative overflow-hidden">
                    <div className="flex justify-between items-center mb-8 relative z-10">
                        <div>
                            <h3 className="text-lg font-black text-slate-800 tracking-tight">Sales Overview</h3>
                            <p className="text-xs font-bold text-slate-400">Track your store performance daily</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                                    <span className="text-[10px] font-bold text-slate-500">This Week</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-slate-200"></div>
                                    <span className="text-[10px] font-bold text-slate-500">Last Week</span>
                                </div>
                            </div>
                            <button className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-[10px] font-black text-slate-600 uppercase tracking-widest">
                                This Week <ChevronDown size={14} />
                            </button>
                        </div>
                    </div>
                    <div className="h-[320px] w-full relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={salesData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 700 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 700 }} tickFormatter={(val) => `₹${val / 1000}K`} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                    labelStyle={{ fontWeight: 800, fontSize: '11px', color: '#1e293b' }}
                                />
                                <Line type="monotone" dataKey="last" stroke="#e2e8f0" strokeWidth={3} strokeDasharray="5 5" dot={false} />
                                <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={4} dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4, stroke: '#fff' }} activeDot={{ r: 6, strokeWidth: 0 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Sales by Channel */}
                <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
                    <h3 className="text-lg font-black text-slate-800 tracking-tight mb-1">Sales by Channel</h3>
                    <p className="text-xs font-bold text-slate-400 mb-8">Revenue distribution breakdown</p>
                    <div className="h-[220px] relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={channelData}
                                    innerRadius={70}
                                    outerRadius={90}
                                    paddingAngle={5}
                                    dataKey="value"
                                    animationDuration={1500}
                                >
                                    {channelData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-[-5px]">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total</span>
                            <span className="text-xl font-black text-slate-800">₹2,45,890</span>
                        </div>
                    </div>
                    <div className="space-y-4 mt-6">
                        {channelData.map((ch, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ch.color }}></div>
                                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">{ch.name}</span>
                                </div>
                                <div className="text-right">
                                    <p className="text-[11px] font-black text-slate-800 leading-none">₹{ch.value.toLocaleString()}</p>
                                    <p className="text-[9px] font-bold text-slate-300 mt-0.5">({Math.round((ch.value / 245890) * 100)}%)</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Info Row: Ads Banner & Announcements */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Ads Banner */}
                <div className="lg:col-span-8 relative rounded-3xl overflow-hidden group shadow-lg shadow-blue-500/10 h-full">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700"></div>
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                    <div className="relative z-10 px-8 py-10 flex flex-col justify-center items-start text-white">
                        <h2 className="text-2xl font-black tracking-tight mb-2">Boost Your Sales with KLYRO Ads</h2>
                        <p className="text-blue-100 text-sm font-medium mb-6 max-w-sm">Run Sponsored Ads and reach millions of potential customers shopping on the KLYRO platform.</p>
                        <button className="bg-white text-blue-600 px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-900/20 hover:scale-105 active:scale-95 transition-all">
                            Create Ad Campaign
                        </button>
                    </div>
                </div>

                {/* Announcements */}
                <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-black text-slate-800 tracking-tight">Announcements</h3>
                        <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">View All</button>
                    </div>
                    <div className="space-y-5">
                        {[
                            { title: 'KLYRO Mega Sale is Live! 🚀', desc: 'Boost your sales with exciting offers and great discounts.', date: 'May 20, 2024', icon: Megaphone, color: 'text-blue-500', bg: 'bg-blue-50' },
                            { title: 'New Feature: AI Pricing', desc: 'Use AI to automatically optimize your product prices.', date: 'May 18, 2024', icon: Zap, color: 'text-orange-500', bg: 'bg-orange-50' },
                            { title: 'Payouts Update', desc: 'Payouts for this week will be processed on May 30, 2024.', date: 'May 17, 2024', icon: CreditCard, color: 'text-emerald-500', bg: 'bg-emerald-50' }
                        ].map((ann, i) => (
                            <div key={i} className="flex gap-4 group cursor-pointer hover:bg-slate-50 p-1.5 rounded-2xl transition-all">
                                <div className={`w-10 h-10 rounded-xl ${ann.bg} ${ann.color} flex items-center justify-center flex-shrink-0 transition-transform`}>
                                    <ann.icon size={18} />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-xs font-black text-slate-800 transition-colors leading-tight">{ann.title}</h4>
                                    <p className="text-[10px] font-bold text-slate-400 line-clamp-1 leading-relaxed">{ann.desc}</p>
                                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{ann.date}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Operations Row: Recent Orders & Tasks To Do */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Recent Orders */}
                <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-slate-50 flex justify-between items-center">
                        <h3 className="text-lg font-black text-slate-800 tracking-tight italic">Recent Orders</h3>
                        <button onClick={() => navigate('/seller/orders')} className="text-[10px] font-black text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-xl transition-all uppercase tracking-widest">View All</button>
                    </div>
                    <div className="overflow-x-auto flex-1">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    {['Order ID', 'Customer', 'Product', 'Amount', 'Status', 'Date'].map(h => (
                                        <th key={h} className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {recentOrders.length > 0 ? recentOrders.map((o) => (
                                    <tr key={o.id} className="hover:bg-slate-50/50 transition-colors cursor-pointer group">
                                        <td className="px-6 py-4 text-xs font-black text-slate-800">#ORD{o.id}</td>
                                        <td className="px-6 py-4 text-xs font-bold text-slate-700">{o.buyer_name}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-slate-100 p-1 flex items-center justify-center">
                                                    <Package size={14} className="text-slate-400" />
                                                </div>
                                                <span className="text-[11px] font-bold text-slate-600 truncate max-w-[120px]">Sample Product</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-xs font-black text-slate-800">₹{parseFloat(o.total_price).toLocaleString()}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${o.status === 'delivered' ? 'bg-emerald-50 text-emerald-600' :
                                                o.status === 'shipped' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'
                                                }`}>
                                                {o.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-[10px] font-bold text-slate-400">{new Date(o.created_at).toLocaleDateString()}</td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-20 text-center text-xs font-bold text-slate-400 italic">Executing data retrieval...</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Tasks To Do */}
                <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex flex-col">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-lg font-black text-slate-800 tracking-tight">Tasks To Do</h3>
                        <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">View All</button>
                    </div>
                    <div className="space-y-4 flex-1">
                        {tasks.map((t) => (
                            <div key={t.id} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl group hover:border-blue-200 transition-all cursor-pointer">
                                <div className="flex items-center gap-4">
                                    <div className="w-5 h-5 rounded border-2 border-slate-300 group-hover:border-blue-500 transition-colors flex items-center justify-center">
                                    </div>
                                    <span className="text-[13px] font-bold text-slate-600 transition-colors">{t.text}</span>
                                </div>
                                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black shadow-inner ${t.count > 10 ? 'bg-red-500 text-white' : 'bg-orange-500 text-white'
                                    }`}>{t.count}</span>
                            </div>
                        ))}
                    </div>
                    <div className="mt-8">
                        <button className="flex items-center gap-2 text-xs font-black text-blue-600 hover:underline">
                            <Plus size={16} /> Add Custom Task
                        </button>
                    </div>
                </div>
            </div>

            {/* Growth Row: Top Selling Products & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Top Selling Products */}
                <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 overflow-hidden">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-lg font-black text-slate-800 tracking-tight italic">Top Selling Products</h3>
                        <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">View All</button>
                    </div>
                    <div className="space-y-5">
                        {[
                            { name: 'Wireless Earbuds', sales: '2,350 Units', img: '🎧', rank: 1 },
                            { name: 'Smart Watch', sales: '1,890 Units', img: '⌚', rank: 2 },
                            { name: 'Running Shoes', sales: '1,540 Units', img: '👟', rank: 3 },
                            { name: 'Backpack', sales: '1,230 Units', img: '🎒', rank: 4 },
                            { name: 'Sunglasses', sales: '980 Units', img: '🕶️', rank: 5 }
                        ].map((p, i) => (
                            <div key={i} className="flex items-center justify-between group cursor-pointer hover:bg-slate-50 p-2 rounded-2xl transition-all">
                                <div className="flex items-center gap-6">
                                    <span className="text-sm font-black text-slate-300 transition-colors italic w-4">{p.rank}</span>
                                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                                        {p.img}
                                    </div>
                                    <div className="space-y-0.5">
                                        <h4 className="text-sm font-black text-slate-800 transition-colors">{p.name}</h4>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Premium Tech</p>
                                    </div>
                                </div>
                                <span className="text-sm font-black text-slate-800 italic">{p.sales}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions Grid */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-black text-slate-800 tracking-tight">Quick Actions</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { label: 'Add Product', icon: Plus, color: 'bg-blue-600', textColor: 'text-white', path: '/seller/products/add' },
                            { label: 'Manage Inventory', icon: Package, color: 'bg-emerald-500/10', textColor: 'text-emerald-600', path: '/seller/inventory' },
                            { label: 'Create Coupon', icon: Ticket, color: 'bg-amber-500/10', textColor: 'text-amber-600', path: '/seller/marketing/coupons' },
                            { label: 'View Reports', icon: BarChart2, color: 'bg-purple-500/10', textColor: 'text-purple-600', path: '/seller/analytics' }
                        ].map((act, i) => (
                            <button
                                key={i}
                                onClick={() => navigate(act.path)}
                                className={`flex flex-col items-center justify-center gap-3 p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all group active:scale-95 bg-white`}
                            >
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${act.color} ${act.textColor} shadow-md group-hover:scale-110 transition-transform`}>
                                    <act.icon size={22} />
                                </div>
                                <span className="text-[11px] font-black text-slate-700 text-center leading-tight">{act.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
