import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus, ChevronRight, ShieldCheck, Truck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity, checkout } = useCart();
    const navigate = useNavigate();
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const total = cartItems.reduce((acc, item) => acc + (item.product?.price || 0) * item.quantity, 0);

    const handleCheckout = () => {
        if (cartItems.length > 0) {
            navigate('/checkout');
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="bg-white min-h-screen flex items-center justify-center p-8 pt-20">
                <div className="text-center space-y-6">
                    <ShoppingBag className="w-20 h-20 text-[#e6e6e6] mx-auto" strokeWidth={1} />
                    <h1 className="text-4xl font-black uppercase text-[#333] tracking-tight">Your Bag Is Empty</h1>
                    <p className="text-[#888] text-sm max-w-xs mx-auto">Luxury awaits. Discover our curated collection and find something you love.</p>
                    <Link to="/products" className="inline-block bg-[#333] text-white px-10 py-3 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-[#717fe0] transition-all duration-500">
                        Start Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen py-16 md:py-24 px-4 md:px-12">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8 md:mb-12 border-b border-[#e6e6e6] pb-6 md:pb-8">
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-black uppercase text-[#333] tracking-tight">Shopping Bag</h1>
                    <p className="text-[#888] text-[10px] md:text-sm mt-1 md:mt-2">Home / Shopping Bag</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Items */}
                    <div className="lg:col-span-8">
                        {/* Desktop Table */}
                        <div className="hidden md:block border border-[#e6e6e6] rounded-sm overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-[#f9f9f9] border-b border-[#e6e6e6]">
                                    <tr>
                                        <th className="px-6 py-4 text-[13px] font-bold uppercase text-[#333] tracking-widest">Product</th>
                                        <th className="px-6 py-4 text-[13px] font-bold uppercase text-[#333] tracking-widest text-center">Price</th>
                                        <th className="px-6 py-4 text-[13px] font-bold uppercase text-[#333] tracking-widest text-center">Quantity</th>
                                        <th className="px-6 py-4 text-[13px] font-bold uppercase text-[#333] tracking-widest text-right">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#e6e6e6]">
                                    {cartItems.map((item) => (
                                        <tr key={item.product?.id} className="hover:bg-[#fcfcfc] transition-colors">
                                            <td className="px-6 py-8">
                                                <div className="flex items-center gap-6">
                                                    <div className="w-20 h-24 bg-[#f2f2f2] flex-shrink-0 flex items-center justify-center p-2">
                                                        <img src={item.product?.image} alt={item.product?.name} className="max-w-full max-h-full object-contain" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-[#333] text-[15px]">{item.product?.name}</h3>
                                                        <button 
                                                            onClick={() => removeFromCart(item.product?.id)}
                                                            className="text-[11px] font-bold text-[#888] hover:text-[#717fe0] uppercase tracking-widest mt-2 transition-colors"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                </div>
                                            </td>
                                             <td className="px-6 py-8 text-[#555] font-medium text-center">₹{item.product?.price}</td>
                                            <td className="px-6 py-8">
                                                <div className="flex items-center justify-center gap-4 border border-[#e6e6e6] w-fit mx-auto px-4 py-2">
                                                    <button onClick={() => updateQuantity?.(item.product?.id, item.quantity - 1)} className="text-[#888] hover:text-[#333]"><Minus size={12} /></button>
                                                    <span className="text-sm font-bold text-[#333] w-6 text-center">{item.quantity}</span>
                                                    <button onClick={() => updateQuantity?.(item.product?.id, item.quantity + 1)} className="text-[#888] hover:text-[#333]"><Plus size={12} /></button>
                                                </div>
                                            </td>
                                            <td className="px-6 py-8 text-right font-bold text-[#333]">₹{((item.product?.price || 0) * item.quantity).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Cards */}
                        <div className="md:hidden space-y-4">
                            {cartItems.map((item) => (
                                <div key={item.product?.id} className="border border-[#e6e6e6] p-4 flex gap-4 bg-white shadow-sm">
                                    <div className="w-24 h-32 bg-[#f2f2f2] flex-shrink-0 flex items-center justify-center p-2">
                                        <img src={item.product?.image} alt={item.product?.name} className="max-w-full max-h-full object-contain" />
                                    </div>
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start">
                                                <h3 className="font-bold text-[#333] text-sm line-clamp-2 pr-2">{item.product?.name}</h3>
                                                <button onClick={() => removeFromCart(item.product?.id)} className="text-[#888] hover:text-red-500 transition-colors">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                            <p className="text-[#555] font-medium text-sm mt-1">₹{item.product?.price}</p>
                                        </div>
                                        
                                        <div className="flex justify-between items-center mt-4">
                                            <div className="flex items-center gap-3 border border-[#e6e6e6] px-3 py-1.5">
                                                <button onClick={() => updateQuantity?.(item.product?.id, item.quantity - 1)} className="text-[#888]"><Minus size={12} /></button>
                                                <span className="text-xs font-bold text-[#333] w-4 text-center">{item.quantity}</span>
                                                <button onClick={() => updateQuantity?.(item.product?.id, item.quantity + 1)} className="text-[#888]"><Plus size={12} /></button>
                                            </div>
                                            <span className="font-bold text-[#333] text-sm italic">₹{((item.product?.price || 0) * item.quantity).toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="lg:col-span-4 h-fit">
                        <div className="border border-[#e6e6e6] p-6 md:p-10 space-y-6 md:space-y-8 bg-[#f9f9f9]">
                            <h2 className="text-xl md:text-2xl font-black uppercase text-[#333] tracking-tight">Cart Totals</h2>
                            
                            <div className="space-y-4 pb-6 md:pb-8 border-b border-[#e6e6e6]">
                                <div className="flex justify-between text-sm">
                                    <span className="text-[#333] font-bold">Subtotal:</span>
                                    <span className="text-[#555]">₹{total.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-[#333] font-bold">Shipping:</span>
                                    <span className="text-[#717fe0] font-medium">Free</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center py-4">
                                <span className="text-base md:text-lg font-black uppercase text-[#333]">Total:</span>
                                <span className="text-xl md:text-2xl font-black text-[#333]">₹{total.toFixed(2)}</span>
                            </div>

                            <button 
                                onClick={handleCheckout}
                                disabled={isCheckingOut}
                                className={`w-full text-white py-4 rounded-full font-bold uppercase tracking-widest text-xs md:text-sm transition-all duration-500 shadow-md ${isCheckingOut ? 'bg-[#888] cursor-not-allowed' : 'bg-[#333] hover:bg-[#717fe0]'}`}
                            >
                                {isCheckingOut ? 'Processing Luxury...' : 'Proceed to Checkout'}
                            </button>
                            
                            <div className="flex items-center justify-center gap-2 text-[#888] text-[9px] md:text-[11px] font-bold uppercase tracking-widest pt-4">
                                <ShieldCheck size={14} /> Secure Payment Guaranteed
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;

