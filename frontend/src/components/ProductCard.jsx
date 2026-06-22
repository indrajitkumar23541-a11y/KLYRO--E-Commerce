import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Heart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductModal from './ProductModal';

const ProductCard = ({ product, v2, index }) => {
    const { addToCart } = useCart();
    const [isIdOpen, setIsIdOpen] = useState(false);
    const [hearted, setHearted] = useState(false);
    const [adding, setAdding] = useState(false);

    if (!product || typeof product !== 'object') return null;

    const handleAddToCart = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setAdding(true);
        await addToCart(product.id);
        setTimeout(() => setAdding(false), 800);
    };

    // Modern Compact Card (Mobile First)
    return (
        <>
            <div className="group relative bg-[var(--card-bg)] overflow-hidden transition-all duration-500 hover:shadow-xl rounded-2xl md:rounded-3xl border border-[var(--card-border)] flex flex-col h-full active:scale-[0.98]">
                {/* Image Area */}
                <div className="relative aspect-square overflow-hidden bg-[var(--surface)] flex items-center justify-center p-3 md:p-6">
                    <Link to={`/product/${product.id}`} className="block w-full h-full">
                        <img
                            src={product.image || 'https://via.placeholder.com/400'}
                            alt={product.name}
                            className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
                        />
                    </Link>

                    {/* Discount Badge */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                        <span className="bg-[#ff3e6c] text-white text-[7px] md:text-[8px] font-black uppercase px-2 py-0.5 rounded-md shadow-sm">
                            -{Math.floor(Math.random() * 40 + 10)}%
                        </span>
                    </div>

                    {/* Wishlist button — always visible on mobile, hover on desktop */}
                    <button
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setHearted(!hearted); }}
                        className="touch-sm absolute top-2 right-2 bg-white/90 backdrop-blur-md p-2.5 rounded-full shadow-sm transition-all active:scale-90 md:opacity-0 md:group-hover:opacity-100 md:translate-y-1 md:group-hover:translate-y-0"
                    >
                        <Heart
                            size={15}
                            className={hearted ? 'text-red-500 fill-red-500' : 'text-gray-300'}
                        />
                    </button>
                </div>

                {/* Content Area */}
                <div className="p-3 md:p-5 flex-grow flex flex-col justify-between space-y-2">
                    <div>
                        <div className="flex items-center gap-1 text-[#ffb400] mb-1">
                            <Star size={9} fill="currentColor" className="md:w-3 md:h-3" />
                            <span className="text-[9px] md:text-[10px] font-black text-gray-400">4.5</span>
                        </div>

                        <Link
                            to={`/product/${product.id}`}
                            className="text-[12px] md:text-[15px] font-bold text-[var(--text-color)] hover:text-[#717fe0] transition-colors line-clamp-2 leading-tight"
                        >
                            {product.name}
                        </Link>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-baseline gap-2 flex-wrap">
                            <span className="text-[15px] md:text-[20px] font-black text-[#717fe0] italic">₹{product.price}</span>
                            <span className="text-[9px] md:text-xs text-gray-300 line-through font-bold">₹{Math.floor(product.price * 1.4)}</span>
                        </div>

                        <button
                            onClick={handleAddToCart}
                            className={`w-full py-3 md:py-3.5 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-sm flex items-center justify-center gap-1.5 min-h-[44px] ${
                                adding
                                    ? 'bg-[#717fe0] text-white'
                                    : 'bg-[#717fe0]/10 hover:bg-[#717fe0] text-[#717fe0] hover:text-white'
                            }`}
                        >
                            <ShoppingBag size={13} />
                            {adding ? 'Added!' : 'Add to Bag'}
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
