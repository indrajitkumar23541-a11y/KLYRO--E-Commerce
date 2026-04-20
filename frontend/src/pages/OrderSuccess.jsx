import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight, ShoppingBag, Truck, Calendar } from 'lucide-react';

const OrderSuccess = () => {
    const { id } = useParams();

    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = "Order Placed! | KLYRO";
    }, []);

    // Helper for delivery date (3 days from now)
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 3);
    const dateString = deliveryDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

    return (
        <div className="bg-[#fbFAF7] min-h-screen pt-32 pb-24 px-6 font-sans">
            <div className="max-w-[700px] mx-auto text-center space-y-12">
                
                {/* SUCCESS ANIMATION & TITLE */}
                <div className="space-y-6">
                    <div className="w-24 h-24 bg-emerald-100 rounded-[2.5rem] flex items-center justify-center text-emerald-600 mx-auto animate-bounce shadow-xl shadow-emerald-500/10">
                        <CheckCircle size={48} strokeWidth={2.5} />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-4xl lg:text-5xl font-black text-[#2d231b] tracking-tight">Success!</h1>
                        <p className="text-slate-500 font-bold uppercase text-xs tracking-[0.3em]">Your order has been received</p>
                    </div>
                </div>

                {/* ORDER CARD */}
                <div className="bg-white rounded-[2.5rem] p-6 md:p-10 shadow-2xl shadow-slate-200/50 border border-slate-100 space-y-8 relative overflow-hidden">
                    {/* Decorative Background Element */}
                    <div className="absolute -top-12 -right-12 w-32 h-32 bg-slate-50 rounded-full opacity-50" />
                    
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-b border-slate-50 pb-8">
                        <div className="text-left space-y-1">
                            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Order Reference</p>
                            <h3 className="text-xl font-black text-slate-900 italic">#{id || 'ORD-82739'}</h3>
                        </div>
                        <div className="flex items-center gap-3 bg-slate-50 px-5 py-3 rounded-2xl">
                            <Package className="text-blue-600" size={18} />
                            <div className="text-left">
                                <p className="text-[9px] font-black uppercase text-slate-400">Current Status</p>
                                <p className="text-xs font-black text-slate-900 tracking-wide uppercase">Processing</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4">
                        <div className="flex items-start gap-4 text-left">
                            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
                                <Calendar size={18} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Estimated Delivery</p>
                                <p className="text-sm font-black text-slate-800 italic">{dateString}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 text-left">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                                <Truck size={18} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Shipping Via</p>
                                <p className="text-sm font-black text-slate-800 italic">KLYRO Express</p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4">
                        <p className="text-xs text-slate-500 font-bold leading-relaxed max-w-[400px] mx-auto">
                            A confirmation email has been sent to your inbox. We will notify you once your luxury items have been shipped.
                        </p>
                    </div>
                </div>

                {/* CALL TO ACTIONS */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <Link 
                        to="/orders" 
                        className="w-full sm:w-auto bg-slate-900 hover:bg-black text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-900/10 transition-all active:scale-95 flex items-center justify-center gap-3"
                    >
                        Track Orders <Package size={16} />
                    </Link>
                    <Link 
                        to="/products" 
                        className="w-full sm:w-auto bg-white border-2 border-slate-100 hover:border-slate-300 text-slate-800 px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-3"
                    >
                        Continue Shopping <ArrowRight size={16} />
                    </Link>
                </div>

                {/* HELP FOOTER */}
                <div className="pt-8 flex items-center justify-center gap-8 text-[#BC612C]">
                    <div className="flex items-center gap-2 cursor-pointer hover:underline underline-offset-4">
                        <ShoppingBag size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Need Help?</span>
                    </div>
                    <div className="w-1 h-1 bg-slate-200 rounded-full" />
                    <div className="flex items-center gap-2 cursor-pointer hover:underline underline-offset-4">
                        <CheckCircle size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Policies</span>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default OrderSuccess;
