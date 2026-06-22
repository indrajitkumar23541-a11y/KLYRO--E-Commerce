import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { useCart } from '../context/CartContext';
import { Search, Mic, SlidersHorizontal, ArrowUpDown, Star, Heart } from 'lucide-react';

/* ── MOCK DATA FOR EMPTY STATES ── */
const MOCK_PRODUCTS = [
    { id: 1, name: "Black Winter Coat", description: "Autumn And Winter Casual cotton-padded jacket...", price: 499, image: "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=400&q=80" },
    { id: 2, name: "Mens Starry Shirt", description: "Mens Starry Sky Printed Shirt 100% Cotton", price: 399, image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&q=80" },
    { id: 3, name: "Black Dress", description: "Solid Black Dress for Women, Sexy Chain...", price: 2000, image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=400&q=80" },
    { id: 4, name: "Pink Embroidered", description: "EARTHEN Rose Pink Embroidered Tiered Max...", price: 1900, image: "https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=400&q=80" },
    { id: 5, name: "Flare Dress", description: "Antheaa Black & Rust Orange Floral Print", price: 1990, image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&q=80" },
    { id: 6, name: "Denim Dress", description: "Blue cotton denim dress Look 2 Printed", price: 999, image: "https://images.unsplash.com/photo-1604136172384-90a6125b2eb3?w=400&q=80" },
    { id: 7, name: "Jordan Stay", description: "The classic Air Jordan 12 to create a shoe that's fresh...", price: 4999, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80" },
    { id: 8, name: "Realme 7", description: "6 GB RAM | 64 GB ROM | Expandable Upto 256", price: 3499, image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&q=80" }
];

/* ── STAR RATING ── */
const Stars = ({ rating = 4, count }) => (
    <div className="flex items-center gap-0.5 mt-1">
        {[1, 2, 3, 4, 5].map(s => (
            <Star key={s} size={10} fill={s <= rating ? '#FBBF24' : 'none'}
                className={s <= rating ? 'text-yellow-400' : 'text-gray-200'} />
        ))}
        {count && <span className="text-[8px] text-gray-400 font-bold ml-1">{count}</span>}
    </div>
);

/* ── PRODUCT CARD ── */
const ProductCard = ({ product }) => {
    const original = product.price ? product.price + 500 : 999;
    const discount = Math.floor(((original - product.price) / original) * 100);
    const reviews = Math.floor(Math.random() * 50000) + 1000;
    
    return (
        <Link to={`/product/${product.id}`} className="bg-white rounded-xl shadow-sm overflow-hidden block pb-2 border border-gray-100">
            <div className="relative aspect-[4/5] bg-gray-50">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                {discount > 0 && (
                    <span className="absolute top-2 left-2 bg-[#F83758] text-white text-[7px] font-black px-1.5 py-0.5 rounded-md shadow-sm">
                        -{discount}%
                    </span>
                )}
            </div>
            <div className="p-2.5">
                <h3 className="text-[11px] font-bold text-gray-900 line-clamp-1">{product.name}</h3>
                <p className="text-[9px] text-gray-500 line-clamp-2 leading-tight mt-0.5 min-h-[22px]">{product.description}</p>
                <div className="flex items-center gap-1 mt-1">
                    <span className="text-[13px] font-black text-gray-900">₹{product.price}</span>
                    <span className="text-[9px] text-gray-400 line-through">₹{original}</span>
                </div>
                <Stars rating={4} count={reviews} />
            </div>
        </Link>
    );
};

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const r = await API.get('/products', { params: { limit: 20 } });
                setProducts(r.data.products && r.data.products.length > 0 ? r.data.products : MOCK_PRODUCTS);
            } catch {
                setProducts(MOCK_PRODUCTS);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if (loading) return <div className="min-h-screen bg-[#FDFDFD]" />;

    return (
        <div className="bg-[#FDFDFD] min-h-screen pb-24">
            {/* ── HEADER (Logo/Hamburger/Profile omitted here to match standard subpage if needed, but mockup shows full header) ── */}
            <div className="px-5 pt-12 pb-4 flex items-center justify-between bg-white sticky top-0 z-40">
                <button className="w-10 h-10 flex flex-col justify-center gap-1.5 p-2 bg-gray-100 rounded-full">
                    <span className="w-5 h-[2px] bg-gray-900 rounded-full"></span>
                    <span className="w-3 h-[2px] bg-gray-900 rounded-full"></span>
                    <span className="w-4 h-[2px] bg-gray-900 rounded-full"></span>
                </button>
                <div className="flex items-center gap-2">
                    <div className="relative flex items-center justify-center w-8 h-8">
                        <svg viewBox="0 0 100 100" className="w-full h-full text-[#4392F9]" fill="currentColor">
                            <path d="M50 0C22.4 0 0 22.4 0 50s22.4 50 50 50 50-22.4 50-50S77.6 0 50 0zm0 80c-16.6 0-30-13.4-30-30s13.4-30 30-30 30 13.4 30 30-13.4 30-30 30z"/>
                            <path d="M50 30c-11 0-20 9-20 20s9 20 20 20 20-9 20-20-9-20-20-20zm0 30c-5.5 0-10-4.5-10-10s4.5-10 10-10 10 4.5 10 10-4.5 10-10 10z" className="text-[#F83758]" fill="currentColor"/>
                        </svg>
                    </div>
                    <span className="text-xl font-black tracking-tight text-[#4392F9]">KLYRO</span>
                </div>
                <div className="w-10 h-10 rounded-full overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80" alt="Profile" className="w-full h-full object-cover"/>
                </div>
            </div>

            {/* ── SEARCH BAR ── */}
            <div className="px-5 pb-4 bg-white sticky top-[80px] z-40">
                <div className="relative flex items-center shadow-sm">
                    <Search size={18} className="absolute left-4 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search..."
                        className="w-full bg-[#F3F4F6] text-[14px] rounded-xl py-3 pl-11 pr-11 outline-none text-gray-700"
                    />
                    <Mic size={18} className="absolute right-4 text-gray-400" />
                </div>
            </div>

            {/* ── FILTER ROW ── */}
            <div className="px-5 py-4 flex items-center justify-between">
                <span className="text-[14px] font-black text-gray-900">52,082+ Items</span>
                <div className="flex gap-2">
                    <button className="flex items-center gap-1.5 bg-white border border-gray-200 shadow-sm rounded-lg px-3 py-1.5 text-[11px] font-bold text-gray-600">
                        Sort <ArrowUpDown size={12} />
                    </button>
                    <button className="flex items-center gap-1.5 bg-white border border-gray-200 shadow-sm rounded-lg px-3 py-1.5 text-[11px] font-bold text-gray-600">
                        Filter <SlidersHorizontal size={12} />
                    </button>
                </div>
            </div>

            {/* ── GRID ── */}
            <div className="px-5 grid grid-cols-2 gap-4">
                {products.map(p => (
                    <ProductCard key={p.id} product={p} />
                ))}
            </div>

        </div>
    );
};

export default Products;
