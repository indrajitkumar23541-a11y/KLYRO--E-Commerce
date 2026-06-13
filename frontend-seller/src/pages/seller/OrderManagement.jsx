import React, { useState, useEffect } from 'react';
import {
    Package, Search, ChevronRight, Filter, Clock, MapPin,
    CreditCard, ChevronDown, Truck, CheckCircle2, Download,
    FileText, Printer, ShieldAlert, RefreshCcw, MoreVertical,
    ExternalLink, AlertCircle, X, Loader2, ArrowRight, Boxes,
    Navigation, Calendar, DollarSign, Box
} from 'lucide-react';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { useSearchParams } from 'react-router-dom';

const OrderManagement = () => {
    const { token } = useAuth();
    const [searchParams] = useSearchParams();
    const statusQuery = searchParams.get('status');
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState(statusQuery ? statusQuery.charAt(0).toUpperCase() + statusQuery.slice(1) : 'All');
    const [dateFilter, setDateFilter] = useState('All time');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isLabelModalOpen, setIsLabelModalOpen] = useState(false);
    const [isStatusUpdating, setIsStatusUpdating] = useState(false);

    useEffect(() => {
        fetchSellerOrders();
    }, []);

    useEffect(() => {
        if (statusQuery) {
            setActiveTab(statusQuery.charAt(0).toUpperCase() + statusQuery.slice(1));
        }
    }, [statusQuery]);

    const fetchSellerOrders = async () => {
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const res = await API.get('/seller/orders', config);
            if (res.data.success) {
                setOrders(res.data.orders);
            }
        } catch (error) {
            console.error('Failed to fetch seller orders', error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, newStatus, trackingData = {}) => {
        setIsStatusUpdating(true);
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const payload = { status: newStatus, ...trackingData };
            await API.put(`/seller/orders/${id}/status`, payload, config);

            const updatedOrders = orders.map(o => o.id === id ? { ...o, status: newStatus, ...trackingData } : o);
            setOrders(updatedOrders);

            if (selectedOrder?.id === id) {
                setSelectedOrder({ ...selectedOrder, status: newStatus, ...trackingData });
            }
        } catch (error) {
            console.error('Failed to update status', error);
        } finally {
            setIsStatusUpdating(false);
        }
    };

    const getStatusStyle = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending': return 'bg-amber-50 text-amber-600 border-amber-200/60 shadow-amber-500/10';
            case 'processing': return 'bg-blue-50 text-blue-600 border-blue-200/60 shadow-blue-500/10';
            case 'shipped': return 'bg-violet-50 text-violet-600 border-violet-200/60 shadow-violet-500/10';
            case 'delivered': return 'bg-emerald-50 text-emerald-600 border-emerald-200/60 shadow-emerald-500/10';
            case 'cancelled':
            case 'returned': return 'bg-rose-50 text-rose-600 border-rose-200/60 shadow-rose-500/10';
            default: return 'bg-slate-50 text-slate-500 border-slate-200/60 shadow-slate-500/10';
        }
    };

    const filterOrders = () => {
        let filtered = orders;
        if (activeTab === 'Returns') {
            filtered = filtered.filter(o => o.status?.toLowerCase() === 'returned');
        } else if (activeTab !== 'All') {
            filtered = filtered.filter(o => o.status?.toLowerCase() === activeTab.toLowerCase());
        }
        if (dateFilter !== 'All time') {
            const now = new Date();
            const days = parseInt(dateFilter.split(' ')[1]);
            const cutoff = new Date(now.setDate(now.getDate() - days));
            filtered = filtered.filter(o => new Date(o.created_at) >= cutoff);
        }
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(o =>
                o.id.toString().includes(term) ||
                (o.buyer_name && o.buyer_name.toLowerCase().includes(term))
            );
        }
        return filtered;
    };

    const filteredOrders = filterOrders();

    const handlePrintInvoice = () => {
        window.print();
    };

    const handleGenerateLabel = () => {
        setIsLabelModalOpen(true);
    };

    return (
        <div className="space-y-10 animate-reveal">
            {/* HUD: Logistics Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Unshipped Orders', value: orders.filter(o => o.status === 'pending').length, icon: Package, color: 'text-amber-500', bg: 'bg-amber-500/5', ring: 'ring-amber-500/10' },
                    { label: 'Carrier Handover', value: orders.filter(o => o.status === 'shipped').length, icon: Truck, color: 'text-blue-500', bg: 'bg-blue-500/5', ring: 'ring-blue-500/10' },
                    { label: 'Return Manifest', value: orders.filter(o => o.status === 'returned').length, icon: RefreshCcw, color: 'text-rose-500', bg: 'bg-rose-500/5', ring: 'ring-rose-500/10' },
                    { label: 'Fulfillment Rate', value: '98.5%', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/5', ring: 'ring-emerald-500/10' }
                ].map((s, i) => (
                    <div key={i} className={`bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-100/40 flex items-center gap-6 group hover:scale-[1.02] transition-all ring-1 ${s.ring}`}>
                        <div className={`w-14 h-14 rounded-2xl ${s.bg} ${s.color} flex items-center justify-center group-hover:rotate-12 transition-transform duration-500`}>
                            <s.icon size={26} strokeWidth={1.5} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none mb-2">{s.label}</p>
                            <p className="text-2xl font-black text-slate-800 tracking-tight">{s.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Command Workspace */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

                {/* Left: Operations Manifest */}
                <div className="lg:col-span-12 xl:col-span-7 space-y-8">
                    {/* Manifest Header Block */}
                    <div className="bg-slate-900 rounded-[3rem] p-10 text-white border border-slate-800 shadow-2xl relative overflow-hidden group/header">
                        {/* Abstract Background Aesthetic */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] pointer-events-none group-hover/header:bg-blue-600/20 transition-all duration-700"></div>

                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 relative z-10">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 rounded-[1.5rem] bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center shadow-2xl shadow-blue-500/40">
                                    <Boxes size={32} className="text-white" />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black italic tracking-tighter">Orders Central</h2>
                                    <div className="flex items-center gap-3 mt-1.5">
                                        <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em]">Operational Manifest</p>
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                    </div>
                                </div>
                            </div>

                            {/* Manifest Navigation */}
                            <div className="flex bg-slate-800/80 backdrop-blur-xl p-2 rounded-[1.75rem] border border-white/5 no-scrollbar items-center gap-2">
                                {['All', 'Pending', 'Shipped', 'Delivered', 'Returns'].map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`whitespace-nowrap px-7 py-3 text-[11px] font-black uppercase tracking-[0.15em] rounded-2xl transition-all duration-500 ${activeTab === tab ? 'bg-white text-slate-900 shadow-[0_10px_25px_rgba(255,255,255,0.1)]' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Universal Scan Search */}
                        <div className="mt-10 relative group/search">
                            <div className="absolute inset-0 bg-blue-500/10 blur-xl opacity-0 group-focus-within/search:opacity-100 transition-opacity"></div>
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/search:text-blue-400 transition-colors" size={20} />
                            <input
                                type="text"
                                placeholder="Scan by Order ID or Recipient Name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-slate-800/40 border border-white/5 rounded-[1.5rem] pl-16 pr-8 py-5 text-sm font-bold text-white outline-none focus:bg-slate-800 focus:border-blue-500/30 transition-all placeholder:text-slate-600 placeholder:italic placeholder:font-black placeholder:uppercase placeholder:text-[10px] placeholder:tracking-[0.2em]"
                            />
                        </div>
                    </div>

                    {/* Manifest Content */}
                    <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-2xl shadow-slate-200/40 overflow-hidden divide-y divide-slate-50">
                        {loading ? (
                            <div className="p-32 text-center flex flex-col items-center gap-6">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-2xl animate-pulse"></div>
                                    <Loader2 className="animate-spin text-blue-600 relative" size={56} />
                                </div>
                                <div>
                                    <p className="text-[12px] font-black text-slate-800 uppercase tracking-[0.4em]">Node Sync in Progress</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 italic">Fetching global order vectors...</p>
                                </div>
                            </div>
                        ) : filteredOrders.length > 0 ? filteredOrders.map((order, idx) => (
                            <div
                                key={order.id}
                                onClick={() => setSelectedOrder(order)}
                                className={`p-10 cursor-pointer transition-all hover:bg-slate-50 relative group ${selectedOrder?.id === order.id ? 'bg-blue-50/40 border-l-8 border-blue-600' : 'border-l-8 border-transparent'}`}
                                style={{ animationDelay: `${idx * 0.05}s` }}
                            >
                                <div className="flex flex-col md:flex-row justify-between md:items-center gap-8">
                                    <div className="flex items-center gap-8">
                                        <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-slate-400 border border-slate-100 shadow-xl shadow-slate-100 group-hover:rotate-[10deg] transition-all duration-500">
                                            <Package size={28} strokeWidth={1.5} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-4 mb-2">
                                                <h4 className="font-black text-slate-900 text-xl tracking-tighter italic">#ORD{order.id}</h4>
                                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] border shadow-sm ${getStatusStyle(order.status)}`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-1.5 text-slate-400">
                                                    <Navigation size={12} className="text-blue-500" />
                                                    <span className="text-[11px] font-black uppercase tracking-widest truncate max-w-[200px]">{order.buyer_name}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 text-slate-400">
                                                    <Calendar size={12} className="text-slate-300" />
                                                    <span className="text-[11px] font-bold tracking-tight">{new Date(order.created_at).toDateString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right flex flex-col items-end">
                                        <div className="flex items-center gap-2 text-slate-800 mb-1">
                                            <span className="text-sm font-black opacity-30">₹</span>
                                            <p className="text-2xl font-black tracking-tighter italic">{(parseFloat(order.total_price) || 0).toLocaleString()}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{order.items?.length || 0} ITEMS</span>
                                            <div className="w-1 h-1 rounded-full bg-slate-200"></div>
                                            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded-md">{order.payment_method}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="p-32 text-center flex flex-col items-center gap-8">
                                <div className="w-24 h-24 rounded-[2rem] bg-slate-50 flex items-center justify-center text-slate-200 border-2 border-dashed border-slate-200">
                                    <Box size={40} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-slate-300 uppercase tracking-[0.3em]">Manifest Empty</h3>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-3 max-w-[280px] leading-relaxed">No orders found in the current vector. Try adjusting your filters.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Order Action Insight */}
                <div className="lg:col-span-12 xl:col-span-5">
                    {selectedOrder ? (
                        <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-2xl overflow-hidden sticky top-32 animate-reveal-right">
                            {/* Insight Header */}
                            <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-2 h-full bg-blue-600"></div>
                                <div>
                                    <h3 className="text-2xl font-black italic text-slate-900 tracking-tighter">Order Insight</h3>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Detailed Procedural Data</p>
                                </div>
                                <div className="flex gap-3">
                                    <button onClick={handlePrintInvoice} className="w-12 h-12 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-slate-500 hover:text-blue-600 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/10 transition-all active:scale-90"><Printer size={20} /></button>
                                    <button onClick={handleGenerateLabel} className="w-12 h-12 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-slate-500 hover:text-emerald-600 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-500/10 transition-all active:scale-90"><Download size={20} /></button>
                                </div>
                            </div>

                            <div className="p-10 space-y-10 max-h-[75vh] overflow-y-auto custom-scroll">
                                {/* Section: Logistics Vector */}
                                <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group/notif">
                                    <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-[40px]"></div>

                                    <div className="flex items-center justify-between mb-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-blue-400 border border-white/5 shadow-inner">
                                                <Truck size={22} />
                                            </div>
                                            <div>
                                                <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em]">Logistics Link</span>
                                                <p className="text-sm font-black italic mt-1">{selectedOrder.status === 'pending' ? 'Awaiting Dispatch' : 'Active Transit'}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Courier</span>
                                            <p className="text-xs font-black uppercase text-blue-300">{selectedOrder.carrier || 'Not Assigned'}</p>
                                        </div>
                                    </div>

                                    {/* Dispatch Workflow */}
                                    {['pending', 'processing', 'shipped'].includes(selectedOrder.status) && (
                                        <div className="space-y-6 relative z-10">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Carrier Provider</label>
                                                    <input
                                                        type="text"
                                                        value={selectedOrder.carrier || ''}
                                                        onChange={(e) => setSelectedOrder({ ...selectedOrder, carrier: e.target.value })}
                                                        placeholder="e.g. FedEx"
                                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-xs font-bold outline-none focus:bg-white/10 focus:border-blue-500/30 transition-all placeholder:text-slate-700"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">LWB / AWB Vector</label>
                                                    <input
                                                        type="text"
                                                        value={selectedOrder.tracking_id || ''}
                                                        onChange={(e) => setSelectedOrder({ ...selectedOrder, tracking_id: e.target.value })}
                                                        placeholder="TRK-990088"
                                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-xs font-bold outline-none focus:bg-white/10 focus:border-blue-500/30 transition-all placeholder:text-slate-700"
                                                    />
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => updateStatus(selectedOrder.id, 'shipped', { tracking_id: selectedOrder.tracking_id, carrier: selectedOrder.carrier })}
                                                disabled={isStatusUpdating}
                                                className="w-full bg-blue-600 hover:bg-blue-500 text-white h-14 rounded-2xl font-black text-[11px] uppercase tracking-[0.25em] shadow-2xl shadow-blue-500/30 transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
                                            >
                                                {isStatusUpdating ? <Loader2 className="animate-spin" size={18} /> : (
                                                    <>
                                                        Initialize Dispatch Flow <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    )}

                                    {selectedOrder.status === 'delivered' && (
                                        <div className="flex items-center gap-4 bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl text-emerald-400">
                                            <div className="p-2 bg-emerald-500 rounded-lg text-white">
                                                <CheckCircle2 size={16} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest">Transit Resolved</p>
                                                <p className="text-xs font-black">Proof of delivery verified via carrier manifest.</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Section: Global Workflow Stage */}
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2 italic">Procedural Stage</label>
                                    <div className="relative">
                                        <select
                                            value={selectedOrder.status}
                                            onChange={(e) => updateStatus(selectedOrder.id, e.target.value)}
                                            disabled={isStatusUpdating}
                                            className={`w-full h-16 rounded-[1.75rem] border-2 font-black text-xs uppercase tracking-[0.2em] px-8 outline-none transition-all cursor-pointer appearance-none ${getStatusStyle(selectedOrder.status)}`}
                                        >
                                            <option value="pending">01. Order Inbound (Pending)</option>
                                            <option value="processing">02. Node Processing</option>
                                            <option value="shipped">03. Transit Vector (Shipped)</option>
                                            <option value="delivered">04. Goal Resolved (Delivered)</option>
                                            <option value="returned">05. Return Inverse (Returned)</option>
                                            <option value="cancelled">06. Void Transaction (Cancelled)</option>
                                        </select>
                                        <ChevronDown size={20} className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-40" />
                                    </div>
                                </div>

                                {/* Section: Delivery Coordinates */}
                                <div className="p-8 bg-slate-50 border border-slate-100 rounded-[2.5rem] group/address hover:border-blue-200 transition-colors">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-blue-600 shadow-xl shadow-blue-500/5 group-hover/address:scale-110 transition-transform">
                                                <MapPin size={24} />
                                            </div>
                                            <div>
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Coordinates</span>
                                                <p className="text-[13px] font-black italic mt-1">Recipient Node</p>
                                            </div>
                                        </div>
                                        <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">View Map</button>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-sm font-black text-slate-800">{selectedOrder.buyer_name}</p>
                                        <p className="text-xs font-bold text-slate-500 leading-relaxed italic">
                                            {(() => {
                                                try {
                                                    const addr = typeof selectedOrder.shipping_address === 'string' ? JSON.parse(selectedOrder.shipping_address) : selectedOrder.shipping_address;
                                                    return `${addr.street || addr.address}, ${addr.city}, ${addr.state} - ${addr.pinCode || addr.zipCode}`;
                                                } catch (e) { return selectedOrder.shipping_address; }
                                            })()}
                                        </p>
                                    </div>
                                </div>

                                {/* Section: Payload Manifest */}
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between px-2">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] italic">Payload Manifest</span>
                                        <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">{selectedOrder.items?.length || 0} SELECTIONS</span>
                                    </div>
                                    <div className="space-y-4">
                                        {selectedOrder.items?.map(item => (
                                            <div key={item.id} className="flex items-center gap-5 p-5 border border-slate-100 rounded-[2rem] bg-white shadow-xl shadow-slate-200/20 group/item hover:border-blue-100 transition-all">
                                                <div className="w-16 h-16 bg-slate-50 rounded-2xl p-1 border border-slate-100 flex items-center justify-center overflow-hidden shadow-inner group-hover/item:rotate-6 transition-transform">
                                                    <img src={item.image} alt="" className="w-full h-full object-contain" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-[13px] font-black text-slate-800 leading-tight group-hover/item:text-blue-600 transition-colors uppercase tracking-tight">{item.name}</p>
                                                    <div className="flex items-center gap-3 mt-1.5 text-slate-400">
                                                        <span className="text-[11px] font-bold">QTY: {item.quantity}</span>
                                                        <div className="w-1 h-1 rounded-full bg-slate-200"></div>
                                                        <span className="text-[11px] font-black text-slate-800">₹{parseFloat(item.price).toLocaleString()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Insight Summary Footer */}
                            <div className="p-10 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Total Commitment</p>
                                    <p className="text-2xl font-black italic text-slate-900 mt-1">₹{(parseFloat(selectedOrder.total_price) || 0).toLocaleString()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Payment Vector</p>
                                    <div className="flex items-center gap-2 mt-1.5 justify-end">
                                        <div className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center text-blue-600"><CreditCard size={10} /></div>
                                        <p className="text-xs font-black uppercase text-slate-700">{selectedOrder.payment_method}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-[750px] border-4 border-dashed border-slate-100 rounded-[4rem] flex flex-col items-center justify-center text-slate-200 text-center p-16 animate-pulse">
                            <div className="w-32 h-32 rounded-full border-2 border-slate-100 flex items-center justify-center mb-8 bg-slate-50">
                                <Clock size={64} strokeWidth={1} className="opacity-20 text-slate-400" />
                            </div>
                            <h4 className="text-lg font-black text-slate-300 uppercase tracking-[0.4em] italic">Awaiting Vector</h4>
                            <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.2em] mt-6 max-w-[300px] leading-relaxed">Select an active order from the manifest to initiate deep procedural analysis and orchestration.</p>
                            <div className="mt-12 flex gap-2">
                                <div className="w-2 h-2 rounded-full bg-slate-100"></div>
                                <div className="w-2 h-2 rounded-full bg-slate-100 animate-bounce stagger-1"></div>
                                <div className="w-2 h-2 rounded-full bg-slate-100 animate-bounce stagger-2"></div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Shipping Label Mock Modal */}
            {isLabelModalOpen && (
                <div className="fixed inset-0 bg-slate-900/90 z-[600] flex items-center justify-center backdrop-blur-2xl p-6 animate-fade-in">
                    <div className="bg-white w-full max-w-2xl rounded-[4rem] shadow-2xl overflow-hidden text-slate-900 border-8 border-slate-100 relative">
                        <div className="p-12 text-center border-b-2 border-slate-50 relative pb-10">
                            <button onClick={() => setIsLabelModalOpen(false)} className="absolute top-10 right-10 p-3 hover:bg-slate-50 rounded-full text-slate-400 hover:text-rose-500 transition-all-colors active:scale-90"><X size={28} /></button>
                            <div className="flex items-center justify-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-xl shadow-blue-500/30">
                                    <Package size={24} />
                                </div>
                                <div className="text-left">
                                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.5em] block leading-none">Internal Logistics</span>
                                    <h2 className="text-2xl font-black italic tracking-tighter mt-1">Certified Handover Label</h2>
                                </div>
                            </div>
                        </div>
                        <div className="p-14 space-y-12">
                            <div className="flex justify-between items-start gap-10">
                                <div className="space-y-8 flex-1">
                                    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 underline decoration-blue-500/30 underline-offset-4">Dispatch Source (Seller)</span>
                                        <p className="text-sm font-black italic text-slate-800">KLYRO MERCHANT HUB</p>
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-tight mt-1">Warehouse Sector 42, IN-77</p>
                                    </div>
                                    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 underline decoration-blue-500/30 underline-offset-4">Recipient Node (Buyer)</span>
                                        <p className="text-sm font-black italic text-slate-800 uppercase">{selectedOrder?.buyer_name}</p>
                                        <p className="text-[10px] font-black text-slate-500 tracking-tight mt-1 max-w-[200px]">
                                            {(() => {
                                                try {
                                                    const addr = typeof selectedOrder.shipping_address === 'string' ? JSON.parse(selectedOrder.shipping_address) : selectedOrder.shipping_address;
                                                    return `${addr.street || addr.address}, ${addr.city}, ${addr.state} - ${addr.pinCode || addr.zipCode}`;
                                                } catch (e) { return selectedOrder.shipping_address; }
                                            })()}
                                        </p>
                                    </div>
                                </div>
                                <div className="p-6 bg-slate-100 rounded-[3rem] border-2 border-slate-200 flex items-center justify-center shadow-inner">
                                    <ShieldAlert size={100} strokeWidth={1} className="text-slate-300" />
                                </div>
                            </div>

                            {/* Barcode Mock */}
                            <div className="p-10 bg-slate-900 rounded-[3rem] border-4 border-slate-800 flex flex-col items-center gap-8 relative overflow-hidden group/barcode">
                                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/10 to-transparent"></div>
                                <div className="w-full h-32 flex items-center justify-between gap-1 relative z-10">
                                    {Array.from({ length: 48 }).map((_, i) => (
                                        <div
                                            key={i}
                                            className={`h-full bg-white rounded-full transition-transform duration-500 group-hover/barcode:scale-y-75 ${i % 3 === 0 ? 'w-2' : i % 5 === 0 ? 'w-[1px] opacity-40' : 'w-1'}`}
                                            style={{ transitionDelay: `${i * 10}ms` }}
                                        />
                                    ))}
                                </div>
                                <div className="text-center relative z-10">
                                    <p className="text-white font-black text-2xl tracking-[0.5em] italic">#ORD{selectedOrder?.id}-KLY-2026</p>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mt-3">Auth Key: SEC-VET-LOG-X99</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button onClick={() => setIsLabelModalOpen(false)} className="flex-1 bg-slate-100 text-slate-600 py-6 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.25em] hover:bg-slate-200 transition-all active:scale-95">Edit Config</button>
                                <button onClick={() => window.print()} className="flex-[2] bg-slate-900 text-white py-6 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.35em] shadow-2xl shadow-slate-900/20 hover:scale-[1.02] active:scale-95 transition-all outline-none flex items-center justify-center gap-3">
                                    <Printer size={18} /> Print & Deploy
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderManagement;
