import React from 'react';
import { X, ShoppingBag, Star, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ProductModal = ({ isOpen, onClose, product }) => {
    const { addToCart } = useCart();
    const [quantity, setQuantity] = React.useState(1);
    
    if (!isOpen || !product) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-fade-in">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose}></div>

            {/* Modal Content */}
            <div className="relative bg-white w-full max-w-5xl rounded-sm overflow-hidden shadow-2xl flex flex-col md:flex-row animate-reveal h-[90vh] md:h-auto overflow-y-auto">
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 md:top-6 md:right-6 z-20 text-[#888] hover:text-[#717fe0] transition-all duration-300"
                >
                    <X size={24} md={32} strokeWidth={1} />
                </button>

                {/* Image Section */}
                <div className="md:w-3/5 min-h-[300px] md:h-auto bg-[#f7f7f7] flex items-center justify-center p-6 md:p-8">
                     <img 
                        src={product.image || 'https://via.placeholder.com/600'} 
                        alt={product.name} 
                        className="max-w-full max-h-full object-contain transition-transform duration-700 hover:scale-105" 
                    />
                </div>

                {/* Details Section */}
                <div className="md:w-2/5 p-8 md:p-12 flex flex-col bg-white">
                    <div className="mb-8">
                        <h2 className="text-2xl font-semibold text-[#333] mb-4">{product.name}</h2>
                        <div className="flex items-center gap-4 mb-6">
                            <span className="text-xl font-bold text-[#333] italic">₹{product.price}</span>
                        </div>
                        <p className="text-sm text-[#666] leading-relaxed mb-8">
                            {product.description || "Nulla eget sem vitae eros pharetra viverra. Nam vitae luctus ligula. Mauris consequat ornare feugiat."}
                        </p>
                    </div>

                    {/* Size/Color Selects (Simulated) */}
                    <div className="grid grid-cols-2 md:grid-cols-1 gap-4 md:gap-6 mb-8">
                        <div>
                           <label className="block text-[10px] md:text-sm font-medium text-[#333] mb-1 md:mb-2 uppercase">Size</label>
                           <select className="w-full border border-[#e6e6e6] p-2 md:p-3 text-xs md:text-sm rounded-sm focus:outline-none focus:border-[#717fe0]">
                               <option>Choose</option>
                               <option>Size S</option>
                               <option>Size M</option>
                               <option>Size L</option>
                           </select>
                        </div>
                        <div>
                           <label className="block text-[10px] md:text-sm font-medium text-[#333] mb-1 md:mb-2 uppercase">Color</label>
                           <select className="w-full border border-[#e6e6e6] p-2 md:p-3 text-xs md:text-sm rounded-sm focus:outline-none focus:border-[#717fe0]">
                               <option>Choose</option>
                               <option>Red</option>
                               <option>Blue</option>
                               <option>Black</option>
                           </select>
                        </div>
                    </div>

                    <div className="mt-auto pt-8 border-t border-[#e6e6e6] flex gap-4">
                        <div className="flex items-center border border-[#e6e6e6] rounded-sm">
                            <button 
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="px-4 py-2 hover:bg-[#717fe0] hover:text-white transition-colors"
                            >-</button>
                            <span className="px-4 text-sm font-medium">{quantity}</span>
                            <button 
                                onClick={() => setQuantity(quantity + 1)}
                                className="px-4 py-2 hover:bg-[#717fe0] hover:text-white transition-colors"
                            >+</button>
                        </div>
                        <button 
                            onClick={() => { addToCart(product._id, quantity); onClose(); }}
                            className="flex-grow bg-[#717fe0] text-white py-3 px-8 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-[#333] transition-all duration-500 shadow-md"
                        >
                            Add to Cart
                        </button>
                    </div>

                    <div className="flex items-center justify-center gap-6 mt-8">
                        <button className="text-[#888] hover:text-[#717fe0] transition-colors"><Heart size={20} /></button>
                        <div className="h-4 w-px bg-[#e6e6e6]"></div>
                        <div className="flex gap-4">
                            {/* Dummy Share Icons */}
                            <span className="text-[#888] hover:text-[#717fe0] cursor-pointer transition-colors text-xs uppercase font-bold tracking-widest">Share</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductModal;

