import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Truck, Package, CheckCircle2, Clock, ChevronLeft, MapPin, ShieldCheck, Box, Info } from 'lucide-react';
import API from '../api/axios';

const TrackOrder = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const { data } = await API.get(`/orders/${id}`);
                setOrder(data.order);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id]);

    const stages = [
        { label: 'Commissioned', status: 'pending', date: 'Received', icon: Clock },
        { label: 'Inventory Processing', status: 'processing', date: 'Authorized', icon: Box },
        { label: 'In Transit', status: 'shipped', date: 'En Route', icon: Truck },
        { label: 'Deliveries Finalized', status: 'delivered', date: 'Completed', icon: CheckCircle2 }
    ];

    const currentStatusIndex = stages.findIndex(s => s.status === (order?.status || 'pending'));

    if (loading) return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-[#BC612C] border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="bg-[#fcfcfc] min-h-screen pt-24 pb-32 font-sans text-gray-900">
            <div className="max-w-[900px] mx-auto px-6">

                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-gray-900 mb-12 transition-colors">
                    <ChevronLeft size={14} /> Back to acquisitions
                </button>

                <div className="flex flex-col lg:flex-row gap-20">
                    {/* LEFT COL: STATUS TIMELINE */}
                    <div className="flex-1 space-y-16">
                        <header className="space-y-4">
                            <h1 className="text-5xl font-light tracking-tight text-gray-800">Track <span className="font-semibold">Logistics</span></h1>
                            <div className="flex items-center gap-4">
                                <span className="text-[11px] font-bold text-white bg-gray-900 px-3 py-1 uppercase tracking-widest">#{id}</span>
                                <span className="text-[11px] font-bold text-[#BC612C] uppercase tracking-widest border-b border-[#BC612C]">Scheduled Arrival: TBD</span>
                            </div>
                        </header>

                        <div className="relative pl-12 space-y-16">
                            {/* VERTICAL LINE */}
                            <div className="absolute left-[20px] top-4 bottom-4 w-[1px] bg-gray-100"></div>

                            {stages.map((stage, idx) => {
                                const isCompleted = idx <= currentStatusIndex;
                                const isCurrent = idx === currentStatusIndex;
                                const Icon = stage.icon;

                                return (
                                    <div key={idx} className={`relative flex items-center gap-8 ${isCompleted ? 'opacity-100' : 'opacity-20'}`}>
                                        <div className={`absolute -left-12 w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all duration-1000 ${isCompleted ? 'bg-[#BC612C] text-white shadow-xl shadow-[#BC612C]/30' : 'bg-gray-50 text-gray-300 border border-gray-100 uppercase'}`}>
                                            <Icon size={18} strokeWidth={2.5} />
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className={`text-sm font-bold uppercase tracking-widest ${isCurrent ? 'text-[#BC612C]' : 'text-gray-800'}`}>{stage.label}</h3>
                                            <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">{isCompleted ? `${stage.date} - Bangalore Hub` : 'Awaiting initialization'}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* RIGHT COL: CONSIGNMENT DETAILS */}
                    <div className="w-full lg:w-80 space-y-12">
                        {/* MAP MOCKUP (CINEMATIC) */}
                        <div className="h-64 bg-gray-100 rounded-sm relative overflow-hidden saturate-0 border border-gray-100 flex items-center justify-center group cursor-crosshair">
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                            <MapPin className="text-[#BC612C] animate-bounce" size={32} strokeWidth={1} />
                            <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md p-4 space-y-1 border border-gray-100">
                                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-[0.2em]">Current Geolocation</p>
                                <p className="text-[10px] font-black text-gray-900 uppercase">Primary Distribution Node</p>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#BC612C]">Destination Dossier</h4>
                                <div className="p-6 border border-gray-100 space-y-6">
                                    <div className="flex gap-4">
                                        <MapPin size={16} className="text-gray-300" />
                                        <p className="text-[10px] font-medium text-gray-500 uppercase leading-relaxed tracking-widest">
                                            {(() => {
                                                try {
                                                    const addrStr = order?.shipping_address;
                                                    if (!addrStr) return 'Consignee Address on File';
                                                    const addr = typeof addrStr === 'string' ? JSON.parse(addrStr) : addrStr;
                                                    return `${addr.street || addr.address}, ${addr.city}, ${addr.state} - ${addr.pinCode || addr.zipCode}`;
                                                } catch (e) { return 'Consignee Address on File'; }
                                            })()}
                                        </p>
                                    </div>

                                    {order?.tracking_id && (
                                        <div className="pt-4 border-t border-gray-50 space-y-3">
                                            <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-gray-400">
                                                <span>Carrier Service</span>
                                                <span className="text-gray-900">{order.carrier || 'Global Express'}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-gray-400">
                                                <span>Tracking Reference</span>
                                                <span className="text-[#BC612C]">{order.tracking_id}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#BC612C]">Security Status</h4>
                                <div className="flex items-start gap-4 text-gray-400">
                                    <ShieldCheck size={20} strokeWidth={1} />
                                    <p className="text-[9px] font-medium uppercase tracking-[0.2em] leading-relaxed">
                                        Transit secured via <br /> high-integrity protocols
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ITEMS LIST (MINIMALIST) */}
                <div className="mt-32 pt-16 border-t border-gray-100">
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#BC612C] mb-12">Consignment Items</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {order?.items?.map(item => (
                            <div key={item.id} className="flex gap-6 items-center group">
                                <Link to={`/product/${item.product_id}`} className="w-16 h-20 bg-white border border-gray-50 p-2 flex-shrink-0">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all" />
                                </Link>
                                <div className="space-y-1">
                                    <Link to={`/product/${item.product_id}`} className="text-[11px] font-semibold text-gray-800 uppercase line-clamp-1 hover:text-[#BC612C] transition-colors">{item.name}</Link>
                                    <p className="text-[10px] font-medium text-gray-300 uppercase tracking-widest">SKU Secured: 184-KY-{item.id}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default TrackOrder;
