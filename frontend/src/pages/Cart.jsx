import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { 
    Trash2, ShoppingBag, ArrowRight, Minus, 
    Plus, ChevronRight, ShieldCheck, Truck, 
    CheckCircle, Info, Lock
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity } = useCart();
    const navigate = useNavigate();
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    
    const subtotal = cartItems.reduce((acc, item) => acc + (item.product?.price || 0) * item.quantity, 0);
    const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    const handleCheckout = () => {
        if (cartItems.length > 0) {
            navigate('/checkout');
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="bg-white min-h-screen pt-32 pb-20 px-6">
                <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row gap-12 items-center">
                    <div className="w-full md:w-1/3">
                        <div className="bg-blue-50/50 p-12 rounded-full">
                            <ShoppingBag className="w-32 h-32 text-blue-200 mx-auto" strokeWidth={1} />
                        </div>
                    </div>
                    <div className="flex-1 space-y-6 text-center md:text-left">
                        <h1 className="text-4xl font-bold text-[#111]">Your KLYRO Cart is empty</h1>
                        <p className="text-gray-500 max-w-lg">
                            Your Shopping Cart lives to serve. Give it purpose — fill it with electronics, fashion, 
                            and more. Continue shopping on the KLYRO homepage, learn about today's deals, or visit your Wish List.
                        </p>
                        <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-4">
                            <Link to="/products" className="px-8 py-3 bg-[#ffd814] hover:bg-[#f7ca00] text-[#111] rounded-lg font-bold shadow-sm border border-[#fcd200] transition-colors">
                                Browse Marketplace
                            </Link>
                            <Link to="/login" className="px-8 py-3 border border-gray-300 rounded-lg font-bold text-sm hover:bg-gray-50 transition-colors">
                                Sign in to your account
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#f0f2f2] min-h-screen pt-24 pb-20 py-16 px-4 md:px-8">
            <div className="max-w-[1400px] mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* LEFT COLUMN: ITEM LIST */}
                    <div className="lg:col-span-9 space-y-6">
                        <div className="bg-white p-6 md:p-8 rounded-sm shadow-sm">
                            <div className="flex justify-between items-end border-b border-gray-200 pb-4 mb-6">
                                <h1 className="text-2xl font-medium text-[#111]">Shopping Cart</h1>
                                <span className="text-sm text-gray-500">Price</span>
                            </div>

                            <div className="space-y-8 divide-y divide-gray-100">
                                {cartItems.map((item) => (
                                    <div key={item.product?.id} className="pt-8 flex flex-col md:flex-row gap-6 group">
                                        {/* Product Image */}
                                        <div className="w-48 h-48 bg-white flex-shrink-0 flex items-center justify-center p-2 relative group-hover:scale-105 transition-transform duration-500">
                                            <img src={item.product?.image} alt={item.product?.name} className="max-w-full max-h-full object-contain" />
                                        </div>

                                        {/* Product Info */}
                                        <div className="flex-grow space-y-2">
                                            <div className="flex justify-between items-start gap-4">
                                                <Link to={`/products/${item.product?.id}`} className="text-lg font-medium text-[#007185] hover:text-[#c45500] hover:underline line-clamp-2 leading-snug">
                                                    {item.product?.name}
                                                </Link>
                                                <span className="text-xl font-bold text-[#111] whitespace-nowrap">₹{parseFloat(item.product?.price).toLocaleString()}</span>
                                            </div>
                                            
                                            <div className="text-xs space-y-1">
                                                <p className="text-[#007600] font-bold">In Stock</p>
                                                <p className="text-gray-500">Eligible for FREE Shipping</p>
                                                <div className="flex items-center gap-2">
                                                    <input type="checkbox" checked readOnly className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                                    <span className="text-gray-600">This is a gift <button className="text-[#007185] hover:underline">Learn more</button></span>
                                                </div>
                                            </div>

                                            {/* Quantity & Actions */}
                                            <div className="flex flex-wrap items-center gap-4 pt-4">
                                                <div className="flex items-center bg-[#f0f2f2] border border-gray-300 rounded-lg overflow-hidden shadow-sm">
                                                    <button 
                                                        onClick={() => updateQuantity?.(item.product?.id, item.quantity - 1)}
                                                        className="px-3 py-1.5 hover:bg-gray-200 transition-colors"
                                                    >
                                                        <Minus size={14} />
                                                    </button>
                                                    <span className="px-4 py-1.5 text-sm font-bold bg-white border-x border-gray-300 min-w-[40px] text-center">
                                                        {item.quantity}
                                                    </span>
                                                    <button 
                                                        onClick={() => updateQuantity?.(item.product?.id, item.quantity + 1)}
                                                        className="px-3 py-1.5 hover:bg-gray-200 transition-colors"
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>
                                                <span className="h-4 w-[1px] bg-gray-200"></span>
                                                <button onClick={() => removeFromCart(item.product?.id)} className="text-xs text-[#007185] hover:underline">Delete</button>
                                                <span className="h-4 w-[1px] bg-gray-200"></span>
                                                <button className="text-xs text-[#007185] hover:underline">Save for later</button>
                                                <span className="h-4 w-[1px] bg-gray-200"></span>
                                                <button className="text-xs text-[#007185] hover:underline">See more like this</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-gray-200 mt-8 pt-4 text-right">
                                <p className="text-lg text-[#111]">
                                    Subtotal ({itemCount} items): <span className="font-bold">₹{subtotal.toLocaleString()}</span>
                                </p>
                            </div>
                        </div>

                        {/* Recommendation Banner */}
                        <div className="bg-white p-6 rounded-sm shadow-sm border-l-4 border-[#007185]">
                            <div className="flex gap-4">
                                <Info className="text-[#007185] shrink-0" />
                                <p className="text-sm text-gray-700">
                                    The price and availability of items at KLYRO are subject to change. The shopping cart is a temporary 
                                    place to store a list of your items and reflects each item's most recent price.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: SUMMARY (STICKY) */}
                    <div className="lg:col-span-3">
                        <div className="lg:sticky lg:top-24 space-y-5">
                            <div className="bg-white p-6 rounded-sm shadow-sm space-y-4">
                                <div className="flex items-start gap-2 text-[#007600]">
                                    <CheckCircle size={18} className="shrink-0" />
                                    <div className="text-[13px] leading-tight font-medium">
                                        Part of your order qualifies for <span className="font-bold">FREE Delivery</span>. Select this option at checkout. <button className="text-[#007185] hover:underline">Details</button>
                                    </div>
                                </div>
                                
                                <div className="space-y-1">
                                    <p className="text-lg text-[#111]">
                                        Subtotal ({itemCount} items): <span className="font-bold">₹{subtotal.toLocaleString()}</span>
                                    </p>
                                    <div className="flex items-center gap-2 pt-1">
                                        <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                        <span className="text-sm text-gray-600">This order contains a gift</span>
                                    </div>
                                </div>

                                <button 
                                    onClick={handleCheckout}
                                    className="w-full bg-[#ffd814] hover:bg-[#f7ca00] text-[#111] py-2 rounded-lg font-bold text-sm shadow-sm border border-[#fcd200] transition-colors"
                                >
                                    Proceed to Buy
                                </button>
                            </div>

                            {/* Trust Badge */}
                            <div className="bg-white p-4 rounded-sm shadow-sm flex items-center justify-center gap-6">
                                <div className="flex flex-col items-center text-center gap-1">
                                    <ShieldCheck size={20} className="text-gray-400" />
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Secure Checkout</span>
                                </div>
                                <div className="h-8 w-[1px] bg-gray-100"></div>
                                <div className="flex flex-col items-center text-center gap-1">
                                    <Lock size={20} className="text-gray-400" />
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Verified Site</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
