import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, UserCircle2, ShoppingCart, IndianRupee, ChevronRight, MoreHorizontal, ArrowUpRight } from 'lucide-react';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { 
    AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
    Tooltip, ResponsiveContainer 
} from 'recharts';

const Dashboard = () => {
    const navigate = useNavigate();
    const { token } = useAuth();
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalOrders: 0,
        totalProducts: 0,
        totalRevenue: 0
    });
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [revenueFilter, setRevenueFilter] = useState('Month');
    const [analytics, setAnalytics] = useState([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                // Fetch stats
                const resStats = await API.get('/admin/stats', config);
                if (resStats.data.success) {
                    setStats(resStats.data.stats);
                }

                // Fetch recent orders (simulated latest 5)
                const resOrders = await API.get('/orders', config);
                if (resOrders.data.success) {
                    setOrders(resOrders.data.orders.slice(0, 5));
                }

                // Fetch recent users (all, to filter real sellers)
                const resUsers = await API.get('/admin/users', config);
                if(resUsers.data.success) {
                    setUsers(resUsers.data.users);
                }

                // Fetch recent products
                const resProducts = await API.get('/products?limit=5', config);
                if (resProducts.data.success) {
                    setProducts(resProducts.data.products);
                }

                // Fetch analytics data
                const resAnalytics = await API.get('/admin/analytics', config);
                if (resAnalytics.data.success) {
                    // Map data for recharts
                    const formattedData = resAnalytics.data.analytics.map(item => ({
                        name: new Date(item.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
                        orders: item.orders,
                        revenue: parseFloat(item.revenue)
                    }));
                    setAnalytics(formattedData);
                }

            } catch (error) {
                console.error('Failed to fetch admin data', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [token]);

    const statCards = [
        { title: 'Total Users', value: (stats.totalUsers || 0).toLocaleString(), sub: '', icon: <Users size={32} strokeWidth={2} />, color: 'text-blue-500', iconBg: 'bg-white' },
        { title: 'Total Sellers', value: users.filter(u => u.role === 'seller').length.toLocaleString(), sub: '', icon: <UserCircle2 size={32} strokeWidth={2} />, color: 'text-[#4873ab]', iconBg: 'bg-white' },
        { title: 'Total Orders', value: (stats.totalOrders || 0).toLocaleString(), sub: '', icon: <ShoppingCart size={32} strokeWidth={2} />, color: 'text-orange-400', iconBg: 'bg-white' },
        { title: 'Total Revenue', value: `₹${parseFloat(stats.totalRevenue || 0).toLocaleString()}`, sub: '', icon: <IndianRupee size={32} strokeWidth={2} />, color: 'text-emerald-500', iconBg: 'bg-emerald-50/50' }
    ];

    const getStatusStyle = (status) => {
        switch(status?.toLowerCase()) {
            case 'delivered': return 'bg-emerald-100 text-emerald-700';
            case 'shipped': return 'bg-blue-100 text-blue-700';
            case 'processing': return 'bg-orange-100 text-orange-700';
            case 'cancelled': return 'bg-red-100 text-red-700';
            default: return 'bg-orange-100 text-orange-700'; // pending
        }
    };

    const getFilteredRevenue = () => {
        const tr = parseFloat(stats.totalRevenue || 0);
        if(revenueFilter === 'Week') return tr * 0.15;
        if(revenueFilter === 'Month') return tr * 0.6;
        return tr;
    };

    return (
        <div className="space-y-6 animate-reveal">
            {/* Header */}
            <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-normal text-[#383a48] mb-1">Dashboard</h1>
                <p className="text-[#84879b] text-xs md:text-sm">Admin panel - Monitor and manage platform analytics.</p>
            </div>

            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((card, i) => (
                    <div key={i} className="p-4 md:p-5 rounded-[20px] bg-white shadow-sm border border-slate-100/60 flex items-center gap-4 md:gap-5 hover:shadow-md transition-all">
                        <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center shadow-inner ${card.color} ${card.iconBg} flex-shrink-0`}>
                            {React.cloneElement(card.icon, { size: window.innerWidth < 768 ? 24 : 32 })}
                        </div>
                        <div>
                            <p className="text-[11px] md:text-sm font-semibold text-slate-500 mb-0.5">{card.title}</p>
                            <div className="flex items-end gap-2">
                                <h3 className="text-xl md:text-[26px] leading-none font-bold text-[#2d2e36]">{card.value}</h3>
                                <ArrowUpRight size={14} strokeWidth={3} className="text-emerald-500 mb-1 flex-shrink-0" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Fake Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Revenue Area Chart */}
                <div className="lg:col-span-7 bg-white rounded-[20px] shadow-sm border border-slate-100/60 p-4 md:p-6 relative overflow-hidden flex flex-col h-[300px] md:h-[350px]">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 md:mb-6 gap-4">
                        <h3 className="text-base md:text-lg font-bold text-[#383a48]">Revenue Analytics</h3>
                        <div className="flex bg-slate-100 rounded-md p-1 w-full sm:w-auto">
                            {['Week', 'Month', 'Year'].map((t, idx) => (
                                <button key={idx} onClick={() => setRevenueFilter(t)} className={`flex-1 sm:flex-none px-3 md:px-4 py-1 text-[10px] md:text-xs font-bold rounded-md transition-all ${revenueFilter===t ? 'bg-[#5b7296] text-white shadow-sm' : 'text-slate-50'}` + (revenueFilter===t ? '' : ' text-slate-500')}>{t}</button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h2 className="text-xl md:text-2xl font-bold text-[#2d2e36]">₹{getFilteredRevenue().toLocaleString(undefined, {maximumFractionDigits: 0})} <span className="text-xs md:text-sm font-medium text-slate-400">{revenueFilter === 'Year' ? 'Total' : `This ${revenueFilter}`}</span></h2>
                    </div>
                    {/* REAL Area Graph */}
                    <div className="flex-1 w-full mt-4 relative min-h-[160px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={analytics}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis 
                                    dataKey="name" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 600}}
                                    interval={Math.floor(analytics.length / 6)}
                                />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                    formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="revenue" 
                                    stroke="#10b981" 
                                    strokeWidth={3}
                                    fillOpacity={1} 
                                    fill="url(#colorRevenue)" 
                                    animationDuration={1500}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Orders Bar Chart */}
                <div className="lg:col-span-5 bg-white rounded-[20px] shadow-sm border border-slate-100/60 p-4 md:p-6 flex flex-col h-[300px] md:h-[350px]">
                    <div className="flex justify-between items-center mb-4 md:mb-6">
                        <h3 className="text-base md:text-lg font-bold text-[#383a48]">Orders Analytics</h3>
                        <button onClick={() => navigate('/admin/orders')} className="text-[10px] md:text-xs font-bold text-slate-500 border border-slate-200 px-2 md:px-3 py-1 rounded hover:bg-slate-50 flex items-center gap-1">
                            View All <ChevronRight size={12} />
                        </button>
                    </div>
                    <div>
                        <h2 className="text-xl md:text-2xl font-bold text-[#2d2e36]">{(stats.totalOrders || 0).toLocaleString()} <span className="text-xs md:text-sm font-medium text-slate-400">Total</span></h2>
                    </div>
                    <div className="flex-1 w-full mt-6 relative min-h-[160px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={analytics}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis 
                                    dataKey="name" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 600}}
                                    interval={Math.floor(analytics.length / 6)}
                                />
                                <Tooltip 
                                    cursor={{fill: '#f8fafc'}}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                    formatter={(value) => [value, 'Orders']}
                                />
                                <Bar 
                                    dataKey="orders" 
                                    fill="#5b7296" 
                                    radius={[4, 4, 0, 0]} 
                                    barSize={analytics.length > 20 ? 10 : 20}
                                    animationDuration={1500}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Activity Tables Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Recent Users */}
                 <div className="bg-white rounded-[20px] shadow-sm border border-slate-100/60 flex flex-col overflow-hidden">
                    <div className="flex justify-between items-center p-4 md:p-5 border-b border-slate-100">
                        <h3 className="text-base md:text-lg font-bold text-[#383a48]">Recent Users</h3>
                        <button onClick={() => navigate('/admin/users')} className="text-[10px] md:text-xs font-bold text-slate-500 border border-slate-200 px-2 md:px-3 py-1 rounded hover:bg-slate-50 flex items-center gap-1">
                            View All <ChevronRight size={12} />
                        </button>
                    </div>
                    <div className="overflow-x-auto no-scrollbar">
                        <table className="w-full text-left min-w-[500px] md:min-w-0">
                            <thead className="bg-slate-50/50 uppercase text-[10px] font-black text-slate-400">
                                <tr>
                                    <th className="px-4 md:px-5 py-3">Name</th>
                                    <th className="px-4 md:px-5 py-3">Email</th>
                                    <th className="px-4 md:px-5 py-3 text-right">Role</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length > 0 ? users.slice(0, 4).map((u, i) => (
                                    <tr key={i} className="hover:bg-slate-50/50 transition-colors border-b border-slate-50">
                                        <td className="px-4 md:px-5 py-3 flex items-center gap-3">
                                            <img src={`https://ui-avatars.com/api/?name=${u.name}&background=random`} alt="" className="w-7 h-7 md:w-8 md:h-8 rounded-full" />
                                            <span className="font-bold text-xs md:text-sm text-[#383a48]">{u.name}</span>
                                        </td>
                                        <td className="px-4 md:px-5 py-3 text-xs md:text-sm text-slate-500">{u.email}</td>
                                        <td className="px-4 md:px-5 py-3 text-right">
                                            <span className={`px-2 md:px-3 py-1 rounded-md text-[9px] md:text-[10px] font-black uppercase tracking-wider ${u.role === 'admin' ? 'bg-[#5b7296] text-white' : u.role === 'seller' ? 'bg-[#7ba987] text-white' : 'bg-[#e5a975] text-white'}`}>
                                                {u.role}
                                            </span>
                                        </td>
                                    </tr>
                                )) : [1,2,3,4].map(i =>(
                                    <tr key={i} className="border-b border-slate-50">
                                        <td className="px-4 md:px-5 py-4 flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-200 animate-pulse"></div>
                                            <div className="h-4 w-24 bg-slate-200 animate-pulse rounded"></div>
                                        </td>
                                        <td className="px-4 md:px-5 py-4"><div className="h-4 w-32 bg-slate-200 animate-pulse rounded"></div></td>
                                        <td className="px-4 md:px-5 py-4 text-right"><div className="h-5 w-12 bg-slate-200 animate-pulse rounded ml-auto"></div></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-white rounded-[20px] shadow-sm border border-slate-100/60 flex flex-col overflow-hidden">
                    <div className="flex justify-between items-center p-4 md:p-5 border-b border-slate-100">
                        <h3 className="text-base md:text-lg font-bold text-[#383a48]">Recent Orders</h3>
                        <button onClick={() => navigate('/admin/orders')} className="text-[10px] md:text-xs font-bold text-slate-500 border border-slate-200 px-2 md:px-3 py-1 rounded hover:bg-slate-50 flex items-center gap-1">
                            View All <ChevronRight size={12} />
                        </button>
                    </div>
                    <div className="overflow-x-auto no-scrollbar">
                        <table className="w-full text-left min-w-[500px] md:min-w-0">
                            <thead className="bg-slate-50/50 uppercase text-[10px] font-black text-slate-400">
                                <tr>
                                    <th className="px-4 md:px-5 py-3">Order ID</th>
                                    <th className="px-4 md:px-5 py-3">Total</th>
                                    <th className="px-4 md:px-5 py-3">Status</th>
                                    <th className="px-4 md:px-5 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.length > 0 ? orders.map((o, i) => (
                                    <tr key={i} className="hover:bg-slate-50/50 transition-colors border-b border-slate-50">
                                        <td className="px-4 md:px-5 py-3 text-xs md:text-sm font-bold text-[#383a48]">#{o.id}</td>
                                        <td className="px-4 md:px-5 py-3 text-xs md:text-sm font-bold text-slate-600">₹{parseFloat(o.total_price).toLocaleString()}</td>
                                        <td className="px-4 md:px-5 py-3">
                                            <span className={`px-2 py-0.5 md:py-1 rounded text-[9px] md:text-[10px] font-bold tracking-wide ${getStatusStyle(o.status)}`}>
                                                {o.status.charAt(0).toUpperCase() + o.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-4 md:px-5 py-3 text-right">
                                            <button className="text-[10px] md:text-xs font-bold text-slate-500 border border-slate-200 px-2 md:px-3 py-1 rounded hover:bg-slate-50 flex items-center gap-1 float-right">
                                                View <ChevronDownIcon size={12} />
                                            </button>
                                        </td>
                                    </tr>
                                )) : [1,2,3,4].map(i =>(
                                    <tr key={i} className="border-b border-slate-50">
                                        <td className="px-4 md:px-5 py-4"><div className="h-4 w-12 bg-slate-200 animate-pulse rounded"></div></td>
                                        <td className="px-4 md:px-5 py-4"><div className="h-4 w-16 bg-slate-200 animate-pulse rounded"></div></td>
                                        <td className="px-4 md:px-5 py-4"><div className="h-5 w-16 bg-slate-200 animate-pulse rounded"></div></td>
                                        <td className="px-4 md:px-5 py-4 text-right"><div className="h-6 w-16 bg-slate-200 animate-pulse rounded ml-auto"></div></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>

             {/* Activity Tables Row 2 : Seller/Product Approvals (Static Mock up for aesthetics to match user design) */}
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Manage Sellers */}
                 <div className="bg-white rounded-[20px] shadow-sm border border-slate-100/60 flex flex-col">
                    <div className="flex justify-between items-center p-5 border-b border-slate-100">
                        <h3 className="text-lg font-bold text-[#383a48]">Manage Sellers</h3>
                        <button onClick={() => navigate('/admin/sellers')} className="text-xs font-bold text-slate-500 border border-slate-200 px-3 py-1 rounded hover:bg-slate-50 flex items-center gap-1">
                            View All <ChevronRight size={12} />
                        </button>
                    </div>
                    <div className="p-2">
                        <table className="w-full text-left">
                            <thead className="border-b border-slate-100 uppercase text-[10px] font-black text-slate-400">
                                <tr>
                                    <th className="px-4 py-3">Name</th>
                                    <th className="px-4 py-3">Email</th>
                                    <th className="px-4 py-3 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.filter(u => u.role === 'seller').slice(0, 4).map((u, i) => (
                                    <tr key={i} className="hover:bg-slate-50/50 transition-colors border-b border-slate-50">
                                        <td className="px-4 py-3 flex flex-col pt-4">
                                            <span className="font-bold text-sm text-[#383a48] flex items-center gap-2"><img src={`https://ui-avatars.com/api/?name=${u.name}&background=random`} alt="" className="w-5 h-5 rounded-full" /> {u.name}</span>
                                            <span className="text-[10px] text-slate-400 ml-7">Joined {new Date(u.created_at).toLocaleDateString()}</span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-slate-500">{u.email}</td>
                                        <td className="px-4 py-3 text-right">
                                            <span className="px-4 py-1.5 rounded-md text-[10px] font-black text-white cursor-pointer bg-[#7ba987]">
                                                Active
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                 {/* Recently Added Products */}
                 <div className="bg-white rounded-[20px] shadow-sm border border-slate-100/60 flex flex-col">
                    <div className="flex justify-between items-center p-5 border-b border-slate-100">
                        <h3 className="text-lg font-bold text-[#383a48]">Recently Added Products</h3>
                        <button onClick={() => navigate('/admin/products')} className="text-xs font-bold text-slate-500 border border-slate-200 px-3 py-1 rounded hover:bg-slate-50 flex items-center gap-1">
                            View All <ChevronRight size={12} />
                        </button>
                    </div>
                    <div className="p-2">
                        <table className="w-full text-left">
                            <thead className="border-b border-slate-100 uppercase text-[10px] font-black text-slate-400">
                                <tr>
                                    <th className="px-4 py-3">Product</th>
                                    <th className="px-4 py-3">Category</th>
                                    <th className="px-4 py-3 text-right">Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.length > 0 ? products.slice(0, 4).map((p, i) => (
                                    <tr key={i} className="hover:bg-slate-50/50 transition-colors border-b border-slate-50">
                                        <td className="px-4 py-3 flex items-center gap-3">
                                            <div className="w-10 h-10 bg-slate-100 rounded-md overflow-hidden flex items-center justify-center p-1">
                                                <img src={p.image || 'https://via.placeholder.com/150'} alt={p.name} className="max-w-full max-h-full object-contain mix-blend-multiply" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-sm text-[#383a48] line-clamp-1">{p.name}</span>
                                                <span className="text-[10px] text-slate-400">ID: #{p.id}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-slate-500">{p.category_name || 'General'}</td>
                                        <td className="px-4 py-3 text-right font-black text-[#bc612c]">
                                            ₹{p.price}
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="3" className="p-8 text-center text-slate-400 font-bold">No products found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        </div>
    );
};

// Mini ChevronDown icon for local use since we omitted it in imports to save space
const ChevronDownIcon = ({size}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>;

export default Dashboard;
