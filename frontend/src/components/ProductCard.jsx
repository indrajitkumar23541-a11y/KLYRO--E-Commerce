import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Eye, Heart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductModal from './ProductModal';

const ProductCard = ({ product, v2, index }) => {
    const { addToCart } = useCart();
    const [isIdOpen, setIsIdOpen] = useState(false);

    if (!product || typeof product !== 'object') return null;

    // Modern Compact Card (Mobile First)
    return (
        <>
            <div className="group relative bg-white overflow-hidden transition-all duration-500 hover:shadow-xl rounded-2xl md:rounded-3xl border border-gray-100 flex flex-col h-full active:scale-[0.98]">
                {/* Image Area */}
                <div className="relative aspect-square overflow-hidden bg-gray-50/50 flex items-center justify-center p-3 md:p-6">
                    <Link to={`/product/${product.id}`} className="block w-full h-full">
                        <img 
                            src={product.image || 'https://via.placeholder.com/400'} 
                            alt={product.name} 
                            className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110" 
                        />
                    </Link>
                    
                    {/* Mobile Badge */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                        <span className="bg-[#ff3e6c] text-white text-[7px] md:text-[8px] font-black uppercase px-2 py-0.5 rounded-md shadow-sm">
                            -{Math.floor(Math.random() * 40 + 10)}%
                        </span>
                    </div>

                    <button className="absolute top-2 right-2 bg-white/80 backdrop-blur-md p-2 rounded-full shadow-sm text-gray-300 hover:text-red-500 transition-all">
                        <Heart size={14} className="md:w-4 md:h-4" />
                    </button>
                </div>

                {/* Content Area */}
                <div className="p-3 md:p-5 flex-grow flex flex-col justify-between space-y-2">
                    <div>
                        <div className="flex items-center gap-1 text-[#ffb400] mb-1">
                            <Star size={8} fill="currentColor" className="md:w-3 md:h-3" />
                            <span className="text-[8px] md:text-[10px] font-black text-gray-400">4.5</span>
                        </div>
                        
                        <Link to={`/product/${product.id}`} className="text-[11px] md:text-[15px] font-bold text-gray-800 hover:text-[#717fe0] transition-colors line-clamp-2 leading-tight">
                            {product.name}
                        </Link>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-baseline gap-2 flex-wrap">
                            <span className="text-[14px] md:text-[20px] font-black text-[#717fe0] italic">₹{product.price}</span>
                            <span className="text-[9px] md:text-xs text-gray-300 line-through font-bold">₹{Math.floor(product.price * 1.4)}</span>
                        </div>

                        <button 
                            onClick={() => addToCart(product.id)}
                            className="w-full bg-[#717fe0]/10 hover:bg-[#717fe0] text-[#717fe0] hover:text-white py-2.5 md:py-3.5 rounded-xl md:rounded-2xl text-[8px] md:text-[10px] font-black uppercase tracking-widest transition-all shadow-sm active:scale-95"
                        >
                            Add to Bag
                        </button>
                    </div>
                </div>
            </div>

            {/* Quick View Modal */}
            <ProductModal 
                isOpen={isIdOpen} 
                onClose={() => setIsIdOpen(false)} 
                product={product} 
            />
        </>
    );
};

export default ProductCard;

