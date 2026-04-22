import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import {
    Package, Search, ChevronRight, Truck, Clock,
    CheckCircle2, RotateCcw, XCircle, ShoppingBag,
    Calendar, MapPin, Box, ArrowRight, HelpCircle,
    ShoppingCart, RefreshCcw, Star, ChevronDown,
    ShieldCheck, Info, Zap, Link as LinkIcon
} from 'lucide-react';
import { useCart } from '../context/CartContext';

import ConciergeChat from '../components/ConciergeChat';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('Orders');
    const { addToCart } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Order History | KLYRO";
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

    const handleBuyAgain = async (productId) => {
        try {
            await addToCart(productId, 1);
            navigate('/cart');
        } catch (error) {
            alert('Could not add to cart.');
        }
    };

    const OrderStatusTimeline = ({ status }) => {
        const stages = ['Pending', 'Processing', 'Shipped', 'Delivered'];
        const statusIndex = stages.findIndex(s => s.toLowerCase() === status?.toLowerCase());

        return (
            <div className="w-full py-8">
                <div className="relative flex justify-between items-center max-w-lg">
                    <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gray-100 -translate-y-1/2 z-0"></div>
                    <div
                        className="absolute top-1/2 left-0 h-[1px] bg-[#BC612C] -translate-y-1/2 z-0 transition-all duration-1000"
                        style={{ width: `${(Math.max(0, statusIndex) / (stages.length - 1)) * 100}%` }}
                    ></div>

                    {stages.map((stage, i) => (
                        <div key={stage} className="relative z-10 flex flex-col items-center">
                            <div className={`w-2 h-2 rounded-full transition-all duration-500 ${i <= statusIndex ? 'bg-[#BC612C]' : 'bg-gray-200'}`}></div>
                            <span className={`text-[9px] font-medium uppercase tracking-[0.1em] mt-3 transition-colors ${i <= statusIndex ? 'text-gray-900' : 'text-gray-300'}`}>{stage}</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const filterOrdersByTab = () => {
        let filtered = orders;

        switch (activeTab) {
            case 'Not Yet Shipped':
                return filtered?.filter(o => ['pending', 'processing'].includes(o.status?.toLowerCase()));
            case 'Cancelled':
                return filtered?.filter(o => o.status?.toLowerCase() === 'cancelled');
            default:
                return filtered;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-6 h-6 border-2 border-[#BC612C] border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-[10px] font-medium uppercase tracking-widest text-gray-400">Loading your history</span>
                </div>
            </div>
        );
    }

    const currentOrders = filterOrdersByTab();

    return (
        <div className="bg-[#fcfcfc] min-h-screen pt-44 pb-32 font-sans text-gray-900">
            <div className="max-w-[1100px] mx-auto px-6">

                {/* GALLERY STYLE HEADER */}
                <div className="flex flex-col md:flex-row justify-between items-baseline gap-10 mb-16">
                    <div className="space-y-4">
                        <h1 className="text-4xl font-light tracking-tight text-gray-800">Your <span className="font-semibold">Orders</span></h1>
                        <nav className="flex items-center gap-2 text-xs font-medium text-gray-400">
                            <Link to="/" className="hover:text-gray-900 transition-colors">Home</Link>
                            <ChevronRight size={12} />
                            <span className="text-gray-900">Orders</span>
                        </nav>
                    </div>
                </div>

                {/* MINIMAL TAB SYSTEM */}
                <div className="flex gap-10 border-b border-gray-100 mb-12 overflow-x-auto no-scrollbar">
                    {['Orders', 'Not Yet Shipped', 'Cancelled'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-4 text-xs font-semibold uppercase tracking-[0.15em] transition-all relative ${activeTab === tab ? 'text-gray-900' : 'text-gray-300 hover:text-gray-500'}`}
                        >
                            {tab}
                            {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#BC612C]"></div>}
                        </button>
                    ))}
                </div>

                {/* ARCHITECTURAL ORDERS LIST */}
                {currentOrders.length === 0 ? (
                    <div className="py-32 text-center flex flex-col items-center gap-6">
                        <ShoppingBag className="w-12 h-12 text-gray-100" strokeWidth={1} />
                        <div className="space-y-2">
                            <h2 className="text-xl font-light text-gray-400">No history found</h2>
                            <Link to="/products" className="text-sm font-bold text-[#BC612C] hover:underline uppercase tracking-widest">Start Shopping</Link>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-16">
                        {currentOrders.map((order, idx) => (
                            <div key={order?.id} className="group animate-reveal" style={{ animationDelay: `${idx * 0.1}s` }}>

                                {/* MINIMALIST HEADER BAR */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-6 border-b border-gray-100 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                    <div className="space-y-1">
                                        <p>Date</p>
                                        <p className="text-gray-900 font-semibold">{order?.created_at ? new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '---'}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p>Total</p>
                                        <p className="text-gray-900 font-semibold">₹{parseFloat(order?.total_price || 0).toLocaleString()}</p>
                                    </div>
                                    <div className="space-y-1 hidden md:block">
                                        <p>Ship To</p>
                                        <div className="flex items-center gap-1 text-[#BC612C] font-semibold cursor-pointer group-hover:underline">
                                            {(() => {
                                                try {
                                                    const addrStr = order?.shipping_address;
                                                    if (!addrStr) return 'Customer';
                                                    const addr = typeof addrStr === 'string' ? JSON.parse(addrStr) : addrStr;
                                                    return addr?.name?.split(' ')[0] || 'Customer';
                                                } catch (e) { return 'Customer'; }
                                            })()} <ChevronDown size={12} />
                                        </div>
                                    </div>
                                    <div className="text-right space-y-1">
                                        <p>Order ID</p>
                                        <p className="text-gray-200 group-hover:text-gray-900 transition-colors">#KY{order?.id}</p>
                                    </div>
                                </div>

                                {/* ITEMS & SYSTEM CONTROLS */}
                                <div className="mt-8 flex flex-col lg:flex-row gap-12 lg:gap-24">
                                    <div className="flex-1 space-y-12">
                                        <div className="space-y-10">
                                            {order?.items?.map(item => (
                                                <div key={item?.id} className="flex gap-8 items-start">
                                                    <div className="w-24 h-28 bg-white border border-gray-50 flex-shrink-0 flex items-center justify-center p-4">
                                                        <img src={item?.image} alt={item?.name} className="max-w-full max-h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-700" />
                                                    </div>
                                                    <div className="space-y-4 flex-grow">
                                                        <div className="space-y-2">
                                                            <Link to={`/product/${item?.product_id}`} className="text-lg font-medium text-gray-800 hover:text-[#BC612C] transition-colors line-clamp-1 leading-tight">{item?.name}</Link>
                                                            <p className="text-[10px] font-medium text-gray-300 uppercase tracking-widest">Return eligible until Jun 24, 2026</p>
                                                        </div>

                                                        <div className="flex items-center gap-6 pt-2">
                                                            <button
                                                                onClick={() => handleBuyAgain(item?.product_id)}
                                                                className="px-6 py-2 bg-gray-900 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-[#BC612C] transition-colors"
                                                            >
                                                                Buy again
                                                            </button>
                                                            <button className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-gray-900">Support</button>
                                                            <button className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-gray-900">Invoice</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* REFINED TIMELINE */}
                                        <div className="pt-8 space-y-4">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-1.5 h-1.5 rounded-full ${order?.status === 'delivered' ? 'bg-[#BC612C]' : 'bg-gray-200'}`}></div>
                                                <h4 className="text-[11px] font-semibold text-gray-900 uppercase tracking-widest">{order?.status || 'Processing'}</h4>
                                                <span className="text-[10px] font-medium text-gray-300 uppercase tracking-widest">— Tracking Active</span>
                                            </div>
                                            <OrderStatusTimeline status={order?.status} />
                                        </div>
                                    </div>

                                    {/* MINIMALIST ACTION SIDEBAR */}
                                    <div className="w-full lg:w-48 space-y-3">
                                        <button
                                            onClick={() => navigate(`/order/${order?.id}/track`)}
                                            className="w-full border border-gray-100 hover:border-gray-300 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-600 transition-all text-center"
                                        >
                                            Track arrival
                                        </button>
                                        <button
                                            onClick={() => navigate(`/order/${order?.id}/return`)}
                                            className="w-full border border-gray-100 hover:border-gray-300 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-600 transition-all text-center"
                                        >
                                            Return Items
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (order?.items?.length > 0) {
                                                    navigate(`/product/${order.items[0].product_id}/review`);
                                                }
                                            }}
                                            className="w-full border border-gray-100 hover:border-gray-300 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-600 transition-all text-center"
                                        >
                                            Write review
                                        </button>
                                        <div className="pt-6 flex flex-col items-center gap-4 group-hover:opacity-100 opacity-30 transition-opacity">
                                            <ShieldCheck size={20} className="text-gray-400" strokeWidth={1.5} />
                                            <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Payment Protected</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* CONCIERGE FOOTER - AI DRIVEN */}
                <div className="mt-40 pt-16 border-t border-gray-100 flex flex-col gap-12">
                    <ConciergeChat />
                </div>

            </div>
        </div>
    );
};

export default Orders;
