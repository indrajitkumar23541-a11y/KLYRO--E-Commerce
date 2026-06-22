import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, MapPin, Plus, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Cart = () => {
    const navigate = useNavigate();
    const { cart } = useCart();

    // Mock cart items based on screenshot
    const mockItems = [
        { id: 1, name: "Women's Casual Wear", variations: "Black, Red", rating: 4.8, size: 42, qty: 1, price: 34.00, image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=200&q=80" },
        { id: 2, name: "Men's Jacket", variations: "Green, Grey", rating: 4.7, size: 42, qty: 1, price: 45.00, image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=200&q=80" }
    ];

    const items = cart?.items?.length > 0 ? cart.items : mockItems;

    return (
        <div className="min-h-screen bg-[#FDFDFD] pb-10">
            {/* ── HEADER ── */}
            <div className="px-5 pt-12 pb-4 flex items-center justify-between bg-white sticky top-0 z-50 shadow-sm border-b border-gray-100">
                <button onClick={() => navigate(-1)} className="w-8 h-8 flex items-center justify-center -ml-2">
                    <ChevronLeft size={24} className="text-gray-900" />
                </button>
                <h1 className="text-[16px] font-black text-gray-900">Checkout</h1>
                <div className="w-8"></div>
            </div>

            <div className="px-5 mt-6 space-y-6">
                
                {/* ── DELIVERY ADDRESS ── */}
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <MapPin size={16} className="text-gray-900" />
                        <h2 className="text-[14px] font-black text-gray-900">Delivery Address</h2>
                    </div>
                    <div className="bg-white border border-gray-100 rounded-xl p-4 flex items-start justify-between shadow-sm">
                        <div className="flex items-start gap-3">
                            <div className="mt-1 w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
                                <img src="/assets/icons/home_location.png" alt="home" className="w-4 h-4 object-contain opacity-50" onError={(e) => e.target.style.display='none'} />
                            </div>
                            <div>
                                <h3 className="text-[13px] font-bold text-gray-900 mb-1">Address:</h3>
                                <p className="text-[11px] text-gray-500 leading-snug">216 St Paul's Rd, London N1 2LL, UK<br/>Contact :  +44-784232</p>
                            </div>
                        </div>
                        <button className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center bg-white shadow-sm flex-shrink-0">
                            <Plus size={14} className="text-gray-500" />
                        </button>
                    </div>
                </div>

                {/* ── SHOPPING LIST ── */}
                <div>
                    <h2 className="text-[14px] font-black text-gray-900 mb-3">Shopping List</h2>
                    <div className="space-y-4">
                        {items.map(item => (
                            <div key={item.id} className="bg-white border border-gray-100 rounded-xl p-3 flex gap-3 shadow-sm">
                                <div className="w-20 h-24 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-[12px] font-bold text-gray-900 line-clamp-1">{item.name}</h3>
                                        <p className="text-[10px] text-gray-500 mt-1">Variations : <span className="font-medium text-gray-700">{item.variations || 'Default'}</span></p>
                                        <div className="flex items-center gap-1 mt-1">
                                            <span className="text-[10px] font-bold text-gray-700">{item.rating || '4.5'}</span>
                                            <div className="flex">
                                                {[1,2,3,4,5].map(s => <Star key={s} size={8} fill={s <= (item.rating||4) ? '#FBBF24' : 'none'} className={s <= (item.rating||4) ? 'text-yellow-400' : 'text-gray-200'}/>)}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 border border-gray-200 rounded-md px-2 py-0.5">
                                            <button className="text-gray-500 text-[10px] font-bold">-</button>
                                            <span className="text-[10px] font-bold text-gray-900 px-1">{item.qty || 1}</span>
                                            <button className="text-gray-500 text-[10px] font-bold">+</button>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span className="text-[14px] font-black text-gray-900">${item.price.toFixed(2)}</span>
                                            <span className="text-[10px] text-gray-400 line-through">${(item.price + 20).toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <hr className="border-gray-100" />

                {/* ── COUPONS ── */}
                <div className="flex items-center justify-between bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                    <div className="flex items-center gap-2">
                        <img src="https://cdn-icons-png.flaticon.com/512/7634/7634125.png" alt="coupon" className="w-5 h-5 opacity-70" />
                        <span className="text-[13px] font-bold text-gray-900">Apply Coupons</span>
                    </div>
                    <button className="text-[12px] font-black text-[#F83758] uppercase tracking-wider">Select</button>
                </div>

                {/* ── ORDER PAYMENT DETAILS ── */}
                <div>
                    <h2 className="text-[14px] font-black text-gray-900 mb-4">Order Payment Details</h2>
                    <div className="space-y-3 mb-4">
                        <div className="flex items-center justify-between">
                            <span className="text-[12px] font-medium text-gray-600">Order Amounts</span>
                            <span className="text-[13px] font-black text-gray-900">₹ 7,000.00</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-[12px] font-medium text-gray-600">Convenience <span className="text-[#F83758] text-[10px] font-bold ml-1">Know More</span></span>
                            <span className="text-[12px] font-bold text-[#F83758]">Apply Coupon</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-[12px] font-medium text-gray-600">Delivery Fee</span>
                            <span className="text-[12px] font-bold text-gray-900">Free</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100 mb-2">
                        <span className="text-[14px] font-black text-gray-900">Order Total</span>
                        <span className="text-[15px] font-black text-gray-900">₹ 7,000.00</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-gray-800">EMI Available</span>
                        <span className="text-[10px] font-bold text-[#F83758]">Details</span>
                    </div>
                </div>

                {/* ── BOTTOM BUTTON ── */}
                <div className="pt-4 pb-8">
                    <button 
                        onClick={() => navigate('/checkout')}
                        className="w-full bg-[#F83758] text-white py-4 rounded-xl font-black text-[14px] shadow-lg shadow-red-200 active:scale-95 transition-all flex items-center justify-between px-6"
                    >
                        <span>₹ 7,000.00 <span className="text-[9px] font-medium opacity-80 ml-1 block text-left">View details</span></span>
                        <span>Proceed to Payment</span>
                    </button>
                </div>

            </div>
        </div>
    );
};

export default Cart;
