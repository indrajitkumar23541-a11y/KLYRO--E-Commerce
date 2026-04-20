import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { 
    ChevronRight, 
    MapPin, 
    CreditCard, 
    ShieldCheck, 
    ArrowLeft, 
    CheckCircle2, 
    Smartphone, 
    Building2,
    Truck,
    Clock
} from 'lucide-react';

const Checkout = () => {
    const { cartItems, checkout } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Form States
    const [address, setAddress] = useState({
        name: user?.name || '',
        mobile: '',
        street: '',
        city: '',
        state: '',
        pinCode: '',
        type: 'Home'
    });

    const [paymentMethod, setPaymentMethod] = useState('UPI');

    const total = cartItems.reduce((acc, item) => acc + (item.product?.price || 0) * item.quantity, 0);

    const handleAddressSubmit = (e) => {
        e.preventDefault();
        setStep(2);
        window.scrollTo(0, 0);
    };

    const handlePlaceOrder = async () => {
        setLoading(true);
        try {
            const orderData = {
                orderItems: cartItems.map(item => ({
                    product: item.product.id,
                    quantity: item.quantity,
                    price: item.product.price
                })),
                shippingAddress: address,
                paymentMethod,
                totalPrice: total
            };

            const result = await checkout(orderData);
            if (result && result.success) {
                navigate(`/order-success/${result.orderId}`); 
            }
        } catch (error) {
            console.error('Order Placement Error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center p-8 pt-32">
                <div className="text-center space-y-4">
                    <h2 className="text-2xl font-black text-slate-800">Your bag is empty</h2>
                    <Link to="/products" className="text-blue-600 font-bold hover:underline">Continue Shopping</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-slate-50 min-h-screen pt-32 pb-24 px-6 lg:px-12 font-sans">
            <div className="max-w-[1240px] mx-auto">
                
                {/* CHECKOUT HEADER & STEPS */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 md:mb-12 gap-6 md:gap-8">
                    <div>
                        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 font-bold text-[10px] md:text-xs uppercase tracking-widest hover:text-slate-800 transition-colors mb-1 md:mb-2">
                            <ArrowLeft size={12} md={14} /> Back to Bag
                        </button>
                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">Checkout</h1>
                    </div>

                    {/* Step Indicator */}
                    <div className="flex items-center gap-2 md:gap-4 bg-white p-1.5 md:p-2 rounded-2xl shadow-sm border border-slate-100 overflow-x-auto no-scrollbar max-w-full">
                        {[
                            { n: 1, label: 'Shipping', icon: <MapPin size={14} md={16} /> },
                            { n: 2, label: 'Payment', icon: <CreditCard size={14} md={16} /> },
                            { n: 3, label: 'Review', icon: <ShieldCheck size={14} md={16} /> }
                        ].map((s) => (
                            <div key={s.n} className="flex items-center flex-shrink-0">
                                <div className={`flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 rounded-xl transition-all ${step === s.n ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400'}`}>
                                    {s.icon}
                                    <span className="text-[9px] md:text-[11px] font-black uppercase tracking-wider hidden xs:block">{s.label}</span>
                                </div>
                                {s.n < 3 && <ChevronRight size={12} className="mx-1 md:mx-2 text-slate-200" />}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    
                    {/* LEFT COLUMN: STEPS */}
                    <div className="lg:col-span-8 space-y-6">
                        
                        {/* STEP 1: SHIPPING ADDRESS */}
                        {step === 1 && (
                            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 animate-reveal">
                                <div className="flex justify-between items-center mb-6 md:mb-8">
                                    <h2 className="text-lg md:text-xl font-black text-slate-900 flex items-center gap-2 md:gap-3">
                                        <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xs md:text-sm">1</div>
                                        Shipping Information
                                    </h2>
                                </div>

                                <form onSubmit={handleAddressSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Full Name</label>
                                        <input 
                                            required
                                            type="text" 
                                            value={address.name}
                                            onChange={(e) => setAddress({...address, name: e.target.value})}
                                            className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm font-bold placeholder:text-slate-300 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Mobile Number</label>
                                        <input 
                                            required
                                            type="tel" 
                                            value={address.mobile}
                                            onChange={(e) => setAddress({...address, mobile: e.target.value})}
                                            className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm font-bold placeholder:text-slate-300 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                            placeholder="9876543210"
                                        />
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Street Address</label>
                                        <input 
                                            required
                                            type="text" 
                                            value={address.street}
                                            onChange={(e) => setAddress({...address, street: e.target.value})}
                                            className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm font-bold placeholder:text-slate-300 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                            placeholder="Building, Street, Area"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">City</label>
                                        <input 
                                            required
                                            type="text" 
                                            value={address.city}
                                            onChange={(e) => setAddress({...address, city: e.target.value})}
                                            className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm font-bold placeholder:text-slate-300 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                            placeholder="New Delhi"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Pin Code</label>
                                        <input 
                                            required
                                            type="text" 
                                            value={address.pinCode}
                                            onChange={(e) => setAddress({...address, pinCode: e.target.value})}
                                            className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm font-bold placeholder:text-slate-300 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                            placeholder="110001"
                                        />
                                    </div>

                                    <div className="md:col-span-2 pt-4">
                                        <button 
                                            type="submit"
                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-blue-500/20 transition-all active:scale-95"
                                        >
                                            Continue to Payment
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* STEP 2: PAYMENT METHOD */}
                        {step === 2 && (
                            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 animate-reveal">
                                <h2 className="text-lg md:text-xl font-black text-slate-900 flex items-center gap-2 md:gap-3 mb-6 md:mb-8">
                                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xs md:text-sm">2</div>
                                    Select Payment Method
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[
                                        { id: 'UPI', label: 'UPI (GPay / PhonePe)', icon: <Smartphone className="text-emerald-500" />, desc: 'Instant & Secure' },
                                        { id: 'Card', label: 'Credit / Debit Card', icon: <CreditCard className="text-blue-500" />, desc: 'All Global Cards' },
                                        { id: 'NetBanking', label: 'Net Banking', icon: <Building2 className="text-slate-600" />, desc: 'All Major Banks' },
                                        { id: 'COD', label: 'Cash on Delivery', icon: <Truck className="text-amber-500" />, desc: 'Pay when delivered' }
                                    ].map((method) => (
                                        <div 
                                            key={method.id}
                                            onClick={() => setPaymentMethod(method.id)}
                                            className={`p-6 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-5 ${paymentMethod === method.id ? 'border-blue-600 bg-blue-50/30' : 'border-slate-50 bg-slate-50 hover:border-slate-200'}`}
                                        >
                                            <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center">
                                                {method.icon}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-slate-900">{method.label}</h4>
                                                <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider font-sans">{method.desc}</p>
                                            </div>
                                            <div className={`w-5 h-5 rounded-full border-4 transition-all ${paymentMethod === method.id ? 'border-blue-600 bg-white' : 'border-slate-200 bg-white'}`} />
                                        </div>
                                    ))}
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 pt-10">
                                    <button 
                                        onClick={() => setStep(1)}
                                        className="flex-1 border-2 border-slate-100 hover:border-slate-300 text-slate-500 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all"
                                    >
                                        Change Address
                                    </button>
                                    <button 
                                        onClick={() => setStep(3)}
                                        className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-blue-500/20 transition-all active:scale-95"
                                    >
                                        Review Your Order
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* STEP 3: REVIEW ORDER */}
                        {step === 3 && (
                            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 animate-reveal">
                                <h2 className="text-lg md:text-xl font-black text-slate-900 flex items-center gap-2 md:gap-3 mb-6 md:mb-8">
                                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xs md:text-sm">3</div>
                                    Order Review
                                </h2>

                                <div className="space-y-8">
                                    {/* Order Items Summary */}
                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Items to Deliver</h4>
                                        <div className="divide-y divide-slate-50 border border-slate-50 rounded-2xl overflow-hidden">
                                            {cartItems.map((item) => (
                                                <div key={item.product?.id} className="p-4 flex items-center gap-4 hover:bg-slate-50/50 transition-colors">
                                                    <img src={item.product?.image} alt={item.product?.name} className="w-12 h-16 object-contain rounded-lg bg-slate-50" />
                                                    <div className="flex-1">
                                                        <h5 className="font-bold text-slate-800 text-sm">{item.product?.name}</h5>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Qty: {item.quantity}</p>
                                                    </div>
                                                    <div className="font-black text-slate-900 text-sm italic">₹{item.product?.price * item.quantity}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Summary Row */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                        <div className="p-4 md:p-6 bg-slate-50 rounded-2xl space-y-3">
                                            <div className="flex justify-between items-center bg-white px-3 py-1 rounded-full w-fit">
                                                <MapPin size={10} md={12} className="text-blue-600 mr-1" />
                                                <span className="text-[9px] md:text-[10px] font-black uppercase text-blue-600 tracking-wider">Shipping To</span>
                                            </div>
                                            <p className="text-xs md:text-sm font-bold text-slate-800">{address.name}</p>
                                            <p className="text-[11px] md:text-xs text-slate-500 leading-relaxed font-sans">{address.street}, {address.city}, {address.pinCode}</p>
                                        </div>
                                        <div className="p-4 md:p-6 bg-slate-50 rounded-2xl space-y-3">
                                            <div className="flex justify-between items-center bg-white px-3 py-1 rounded-full w-fit">
                                                <CreditCard size={10} md={12} className="text-emerald-600 mr-1" />
                                                <span className="text-[9px] md:text-[10px] font-black uppercase text-emerald-600 tracking-wider">Payment Method</span>
                                            </div>
                                            <p className="text-xs md:text-sm font-bold text-slate-800">{paymentMethod}</p>
                                            <p className="text-[11px] md:text-xs text-slate-500 italic font-sans pr-4">Processed via KLYRO Secure Gateway</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-4 pt-6">
                                        <button 
                                            onClick={() => setStep(2)}
                                            className="flex-1 border-2 border-slate-100 hover:border-slate-300 text-slate-500 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all"
                                        >
                                            Modify Choices
                                        </button>
                                        <button 
                                            onClick={handlePlaceOrder}
                                            disabled={loading}
                                            className={`flex-[2] py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 ${loading ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' : 'bg-slate-900 hover:bg-black text-white shadow-slate-900/20'}`}
                                        >
                                            {loading ? 'Processing Order...' : <>Confirm & Place Order <CheckCircle2 size={16} /></>}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>

                    {/* RIGHT COLUMN: ORDER SUMMARY (Sticky) */}
                    <div className="lg:col-span-4 lg:sticky lg:top-32 h-fit space-y-4 md:space-y-6">
                        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 space-y-6 md:space-y-8">
                            <h3 className="font-black text-slate-900 text-base md:text-lg uppercase tracking-tight">Price Breakdown</h3>
                            
                            <div className="space-y-3 md:space-y-4">
                                <div className="flex justify-between text-xs md:text-sm font-bold text-slate-500">
                                    <span>Bag Subtotal ({cartItems.length})</span>
                                    <span>₹{total}</span>
                                </div>
                                <div className="flex justify-between text-xs md:text-sm font-bold text-slate-500">
                                    <span>Delivery Charge</span>
                                    <span className="text-emerald-500 font-black">FREE</span>
                                </div>
                                <div className="flex justify-between text-xs md:text-sm font-bold text-slate-500">
                                    <span>Total Tax (GST 18%)</span>
                                    <span>Inclusive</span>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-slate-50 flex justify-between items-end">
                                <div>
                                    <p className="text-[9px] md:text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-1">Total Payable</p>
                                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 italic">₹{total}</h2>
                                </div>
                                <div className="bg-emerald-50 text-emerald-600 px-2 md:px-3 py-1 rounded-lg text-[9px] md:text-[10px] font-black uppercase tracking-widest mb-1">
                                    Save ₹499
                                </div>
                            </div>
                        </div>

                        {/* TRUST BADGE */}
                        <div className="bg-[#f0f9ff]/50 border border-blue-100 rounded-3xl p-6 flex items-start gap-4">
                            <div className="w-10 h-10 rounded-xl bg-white border border-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                                <ShieldCheck size={20} />
                            </div>
                            <div>
                                <h4 className="font-black text-slate-800 text-xs uppercase tracking-widest mb-1">KLYRO Buyer Protection</h4>
                                <p className="text-[10px] text-slate-500 font-bold leading-relaxed pr-4">Shop with confidence. 100% money back guarantee on authentic luxury products.</p>
                            </div>
                        </div>

                        {/* DELIVERY SPEED */}
                        <div className="bg-slate-900 text-white rounded-3xl p-6 space-y-4">
                            <div className="flex items-center gap-3">
                                <Clock size={16} className="text-amber-400" />
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em]">Estimated Delivery</h4>
                            </div>
                            <div>
                                <h3 className="text-xl font-black italic">Next 3-4 Working Days</h3>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Free Express Shipping Globally</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Checkout;
