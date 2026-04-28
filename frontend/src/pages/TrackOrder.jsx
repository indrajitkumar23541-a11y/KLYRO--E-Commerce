import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Truck, Package, CheckCircle2, Clock, ChevronLeft, MapPin, ShieldCheck, Box, Info, Navigation, Globe, Activity } from 'lucide-react';
import API from '../api/axios';

const TrackOrder = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                // Fetching from the Order Microservice (Port 5004) via Gateway
                const { data } = await API.get(`/orders/${id}`);
                setOrder(data.order);
            } catch (err) {
                console.error('Tracking fetch error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id]);

    const stages = [
        { label: 'Commissioned', status: 'pending', date: 'Order Received', icon: Clock, desc: 'Your request is being authorized.' },
        { label: 'Processing', status: 'processing', date: 'Logistics Prep', icon: Box, desc: 'Inventory is being secured and verified.' },
        { label: 'In Transit', status: 'shipped', date: 'Global Transit', icon: Truck, desc: 'Your consignment is en route to the hub.' },
        { label: 'Delivered', status: 'delivered', date: 'Handover Complete', icon: CheckCircle2, desc: 'Package secured at destination.' }
    ];

    const currentStatusIndex = stages.findIndex(s => s.status === (order?.status || 'pending'));

    if (loading) return (
        <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-white/5 border-t-[#717fe0] rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <Activity size={20} className="text-[#717fe0] animate-pulse" />
                </div>
            </div>
        </div>
    );

    return (
        <div className="bg-[#0a0a0c] min-h-screen pt-24 pb-32 text-white font-sans selection:bg-[#717fe0]/30 overflow-hidden relative">
            {/* Cinematic Background Gradients */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#717fe0]/5 rounded-full blur-[150px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="max-w-[1200px] mx-auto px-6 relative z-10">
                
                <button 
                    onClick={() => navigate(-1)} 
                    className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-white/40 hover:text-[#717fe0] mb-16 transition-all"
                >
                    <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
                    Return to Acquisitions
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
                    
                    {/* LEFT COL: STATUS TIMELINE (8 COLS) */}
                    <div className="lg:col-span-7 space-y-20">
                        <header className="space-y-6">
                            <div className="flex items-center gap-4 animate-reveal">
                                <span className="bg-[#717fe0]/10 text-[#717fe0] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-[#717fe0]/20">
                                    Consignment Locked
                                </span>
                                <span className="text-white/20 text-[10px] font-bold uppercase tracking-widest">Est. Arrival: 48 Hours</span>
                            </div>
                            <h1 className="text-5xl md:text-6xl font-black tracking-tighter uppercase leading-none">
                                Tracking <span className="text-[#717fe0]">Logistics</span>
                            </h1>
                            <div className="flex items-center gap-6">
                                <p className="text-white/40 text-[11px] font-bold uppercase tracking-[0.4em]">Reference ID: {id}</p>
                            </div>
                        </header>

                        {/* HIGH-END TIMELINE */}
                        <div className="relative space-y-12 pl-4">
                            {/* TRACK LINE */}
                            <div className="absolute left-[34px] top-6 bottom-6 w-[2px] bg-white/5 overflow-hidden">
                                <div 
                                    className="absolute top-0 left-0 w-full bg-gradient-to-b from-[#717fe0] to-blue-500 transition-all duration-[2000ms] ease-in-out shadow-[0_0_20px_rgba(113,127,224,0.5)]"
                                    style={{ height: `${(currentStatusIndex / (stages.length - 1)) * 100}%` }}
                                ></div>
                            </div>

                            {stages.map((stage, idx) => {
                                const isCompleted = idx <= currentStatusIndex;
                                const isCurrent = idx === currentStatusIndex;
                                const Icon = stage.icon;

                                return (
                                    <div key={idx} className={`relative flex items-start gap-12 group transition-all duration-700 ${isCompleted ? 'opacity-100' : 'opacity-20'}`}>
                                        {/* ICON NODE */}
                                        <div className={`relative z-10 w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-700 border ${isCompleted ? 'bg-[#717fe0] border-[#717fe0] shadow-[0_0_30px_rgba(113,127,224,0.4)] text-white' : 'bg-white/5 border-white/10 text-white/20'}`}>
                                            <Icon size={20} strokeWidth={isCurrent ? 2.5 : 2} className={isCurrent ? 'animate-pulse' : ''} />
                                            {isCurrent && (
                                                <div className="absolute -inset-2 bg-[#717fe0]/20 rounded-3xl blur-xl animate-pulse"></div>
                                            )}
                                        </div>

                                        <div className="space-y-2 pt-1">
                                            <div className="flex items-center gap-4">
                                                <h3 className={`text-sm font-black uppercase tracking-[0.2em] transition-colors ${isCurrent ? 'text-[#717fe0]' : 'text-white'}`}>
                                                    {stage.label}
                                                </h3>
                                                {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-[#717fe0] animate-ping"></span>}
                                            </div>
                                            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{stage.date} • Bangalore Distribution Hub</p>
                                            <p className="text-[11px] text-white/30 font-medium leading-relaxed max-w-xs">{stage.desc}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* RIGHT COL: ANALYTICS & DETAILS (4 COLS) */}
                    <div className="lg:col-span-5 space-y-12">
                        {/* CINEMATIC MAP MODULE */}
                        <div className="bg-white/5 rounded-[40px] border border-white/10 p-2 overflow-hidden relative group">
                            <div className="h-[340px] bg-[#0c0c0e] rounded-[34px] relative overflow-hidden flex items-center justify-center">
                                {/* SCANNING GRID OVERLAY */}
                                <div className="absolute inset-0 bg-[linear-gradient(rgba(113,127,224,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(113,127,224,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
                                
                                <div className="relative z-10 flex flex-col items-center">
                                    <div className="relative">
                                        <Navigation className="text-[#717fe0] animate-bounce mb-4" size={48} strokeWidth={1} />
                                        <div className="absolute -inset-8 bg-[#717fe0]/20 rounded-full blur-[40px] animate-pulse"></div>
                                    </div>
                                    <div className="text-center space-y-2">
                                        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#717fe0]">Live Telemetry</p>
                                        <p className="text-[12px] font-bold text-white/60 uppercase">12.9716° N, 77.5946° E</p>
                                    </div>
                                </div>

                                <div className="absolute bottom-6 left-6 right-6 bg-black/80 backdrop-blur-xl border border-white/10 p-6 rounded-2xl space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">Protocol Status</span>
                                        <span className="text-[9px] font-black text-green-500 uppercase tracking-widest">Optimized</span>
                                    </div>
                                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full w-2/3 bg-gradient-to-r from-[#717fe0] to-blue-400 animate-[shimmer_2s_infinite]"></div>
                                    </div>
                                    <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest flex items-center gap-2">
                                        <Globe size={12} className="text-[#717fe0]" /> Transit Integrity Confirmed
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* DESTINATION DOSSIER */}
                        <div className="bg-white/5 rounded-[40px] border border-white/10 p-10 space-y-10 backdrop-blur-xl">
                            <div className="space-y-6">
                                <h4 className="text-xs font-black uppercase tracking-[0.3em] text-[#717fe0] flex items-center gap-3">
                                    <MapPin size={16} /> Destination Dossier
                                </h4>
                                <div className="space-y-2">
                                    <p className="text-sm font-bold leading-relaxed text-white/80">
                                        {(() => {
                                            try {
                                                const addrStr = order?.shipping_address;
                                                if (!addrStr) return 'Analyzing address data...';
                                                const addr = typeof addrStr === 'string' ? JSON.parse(addrStr) : addrStr;
                                                return `${addr.street || addr.address}, ${addr.city}, ${addr.state} - ${addr.pinCode || addr.zipCode}`;
                                            } catch (e) { return 'Analyzing address data...'; }
                                        })()}
                                    </p>
                                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Verified Primary Hub</p>
                                </div>
                            </div>

                            <div className="pt-10 border-t border-white/5 space-y-6">
                                <div className="flex justify-between items-center group cursor-pointer">
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">Carrier Service</p>
                                        <p className="text-xs font-bold uppercase tracking-widest text-[#717fe0]">Global Express Prime</p>
                                    </div>
                                    <ShieldCheck className="text-white/20 group-hover:text-green-500 transition-colors" size={24} strokeWidth={1} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CONSIGNMENT ITEMS LIST */}
                <div className="mt-40">
                    <div className="flex items-end justify-between mb-16">
                        <div className="space-y-4">
                            <h4 className="text-xs font-black uppercase tracking-[0.4em] text-[#717fe0]">Consignment Contents</h4>
                            <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Verified manifests for all items</p>
                        </div>
                        <div className="h-[1px] flex-grow mx-12 bg-white/5 hidden md:block"></div>
                        <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">KLYRO Distribution 2026</div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {order?.items?.map(item => (
                            <Link 
                                to={`/product/${item.product_id}`} 
                                key={item.id} 
                                className="group flex items-center gap-8 bg-white/5 p-6 rounded-[30px] border border-white/5 hover:border-[#717fe0]/30 transition-all duration-500"
                            >
                                <div className="w-24 h-28 bg-white rounded-2xl p-4 flex-shrink-0 group-hover:scale-105 transition-transform duration-500">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                                </div>
                                <div className="space-y-3">
                                    <h5 className="text-sm font-black uppercase tracking-tight line-clamp-1 group-hover:text-[#717fe0] transition-colors">{item.name}</h5>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Qty: {item.quantity}</p>
                                        <p className="text-[9px] font-black text-[#717fe0]/60 uppercase tracking-[0.2em]">Ref: 184-KY-{item.id}</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default TrackOrder;
