import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import { 
    Package, 
    Search, 
    ChevronRight, 
    Truck, 
    Clock, 
    CheckCircle2, 
    RotateCcw,
    XCircle,
    ShoppingBag,
    Calendar,
    MapPin
} from 'lucide-react';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Your Orders | KLYRO";
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await API.get('/orders/myorders');
            if (response.data.success) {
                setOrders(response.data.orders);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const StatusChip = ({ status }) => {
        const styles = {
            pending: 'bg-amber-50 text-amber-600 border-amber-100',
            processing: 'bg-blue-50 text-blue-600 border-blue-100',
            shipped: 'bg-purple-50 text-purple-600 border-purple-100',
            delivered: 'bg-emerald-50 text-emerald-600 border-emerald-100',
            cancelled: 'bg-rose-50 text-rose-600 border-rose-100'
        };

        const icons = {
            pending: <Clock size={12} />,
            processing: <RotateCcw size={12} className="animate-spin-slow" />,
            shipped: <Truck size={12} />,
            delivered: <CheckCircle2 size={12} />,
            cancelled: <XCircle size={12} />
        };

        return (
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${styles[status?.toLowerCase()] || styles.pending}`}>
                {icons[status?.toLowerCase()] || icons.pending}
                {status || 'Pending'}
            </div>
        );
    };

    const filteredOrders = orders.filter(order => 
        order.id.toString().includes(searchTerm) || 
        order.shipping_address?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-32">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-slate-100 border-t-slate-900 rounded-full animate-spin" />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Syncing Collections...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#fcfdfd] min-h-screen pt-32 pb-24 px-6 lg:px-12 font-sans">
            <div className="max-w-[1240px] mx-auto">
                
                {/* PAGE HEADER */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-8">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Your Orders</h1>
                        <p className="text-slate-500 font-bold uppercase text-xs tracking-widest flex items-center gap-2">
                            <ShoppingBag size={14} className="text-[#BC612C]" /> View history and track your luxury items
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="relative w-full md:w-96 group">
                        <input 
                            type="text" 
                            placeholder="Order ID / Keyword"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white border border-slate-100 rounded-2xl px-12 py-4 text-sm font-bold shadow-sm focus:ring-2 focus:ring-slate-900/5 transition-all outline-none"
                        />
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-900 transition-colors" size={18} />
                    </div>
                </div>

                {filteredOrders.length === 0 ? (
                    <div className="bg-white rounded-[3rem] p-24 text-center border border-slate-50 shadow-sm flex flex-col items-center gap-6 animate-reveal">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                            <Package size={40} />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-black text-slate-800 tracking-tight leading-none">No Orders Found</h2>
                            <p className="text-slate-400 font-bold text-sm max-w-xs mx-auto">Looks like you haven't placed any luxury orders yet.</p>
                        </div>
                        <Link to="/products" className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-900/10 hover:bg-black transition-all active:scale-95">
                            Discover Collections
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {filteredOrders.map((order, i) => (
                            <div key={order.id} className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-50 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all group animate-reveal" style={{ animationDelay: `${i * 0.1}s` }}>
                                
                                {/* Order List Header (Amazon Style) */}
                                <div className="bg-slate-50/80 px-8 py-5 flex flex-wrap items-center justify-between gap-6 border-b border-slate-100">
                                    <div className="flex gap-10">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Order Date</p>
                                            <p className="text-xs font-black text-slate-700">{new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Total Amount</p>
                                            <p className="text-xs font-black text-slate-900">₹{order.total_price}</p>
                                        </div>
                                        <div className="space-y-1 hidden sm:block">
                                            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Payment</p>
                                            <p className="text-xs font-black text-slate-700 italic">{order.payment_method}</p>
                                        </div>
                                    </div>

                                    <div className="text-right flex items-center flex-wrap gap-4">
                                        <div className="space-y-1 mr-4 hidden lg:block">
                                            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Order ID</p>
                                            <p className="text-xs font-black text-slate-900">#KLYRO-{order.id}</p>
                                        </div>
                                        <StatusChip status={order.status} />
                                    </div>
                                </div>

                                {/* Order Content */}
                                <div className="p-8 flex flex-col md:flex-row gap-10">
                                    {/* Action Links & Tracking */}
                                    <div className="flex-1 space-y-6">
                                        <div className="flex items-center gap-4 text-emerald-600 bg-emerald-50 w-fit px-4 py-1.5 rounded-full border border-emerald-100">
                                            <Truck size={16} />
                                            <p className="text-[10px] font-black uppercase tracking-widest">Est. Delivery: {new Date(new Date(order.created_at).getTime() + 4*24*60*60*1000).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                                        </div>

                                        <div className="space-y-2">
                                            <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2"><MapPin size={12} className="text-blue-500" /> Shipping Destination</h4>
                                            <p className="text-sm font-bold text-slate-700 leading-relaxed max-w-sm">
                                                {typeof order.shipping_address === 'string' && order.shipping_address.startsWith('{') 
                                                    ? JSON.parse(order.shipping_address).street + ", " + JSON.parse(order.shipping_address).city 
                                                    : order.shipping_address}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Buttons */}
                                    <div className="flex flex-col gap-3 min-w-[200px]">
                                        <button className="bg-slate-900 text-white py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-slate-900/10 hover:bg-black transition-all">Track Order</button>
                                        <button className="bg-white border-2 border-slate-100 hover:border-slate-300 text-slate-700 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all">View Invoice</button>
                                        <button className="bg-white border-2 border-slate-100 hover:text-rose-500 hover:border-rose-100 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all">Cancel Order</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* FAQ / HELP */}
                <div className="mt-24 pt-16 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 justify-center md:justify-start">
                             <Truck className="text-[#BC612C]" size={20} />
                             <h4 className="font-black text-slate-900 uppercase text-xs tracking-widest">Free Express Shipping</h4>
                        </div>
                        <p className="text-[11px] font-bold text-slate-400 uppercase leading-relaxed">Next day delivery on all luxury memberships.</p>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 justify-center md:justify-start">
                             <CheckCircle2 className="text-[#BC612C]" size={20} />
                             <h4 className="font-black text-slate-900 uppercase text-xs tracking-widest">Easy Exchanges</h4>
                        </div>
                        <p className="text-[11px] font-bold text-slate-400 uppercase leading-relaxed">7 day hassle free returns on all items.</p>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 justify-center md:justify-start">
                             <ShieldCheck className="text-[#BC612C]" size={20} />
                             <h4 className="font-black text-slate-900 uppercase text-xs tracking-widest">Secure Gateway</h4>
                        </div>
                        <p className="text-[11px] font-bold text-slate-400 uppercase leading-relaxed">PCI Certified encrypted transactions.</p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Orders;
