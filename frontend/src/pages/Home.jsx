import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import {
    Search, Mic, SlidersHorizontal, ArrowUpDown,
    Star, Clock, Heart
} from 'lucide-react';

/* ── MOCK DATA FOR EMPTY STATES ── */
const MOCK_PRODUCTS = [
    { id: 1, name: "Black Winter Coat", description: "Autumn And Winter Casual cotton-padded jacket...", price: 499, image: "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=400&q=80" },
    { id: 2, name: "Mens Starry Shirt", description: "Mens Starry Sky Printed Shirt 100% Cotton", price: 399, image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&q=80" },
    { id: 3, name: "Black Dress", description: "Solid Black Dress for Women, Sexy Chain...", price: 2000, image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=400&q=80" },
    { id: 4, name: "Pink Embroidered", description: "EARTHEN Rose Pink Embroidered Tiered Max...", price: 1900, image: "https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=400&q=80" },
    { id: 5, name: "Nike Sneakers", description: "Vision Alta Men's Shoes Size (All Colours)", price: 1500, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80" }
];

/* ── COUNTDOWN HOOK ── */
function useCountdown(hours = 22, minutes = 55, seconds = 20) {
    const [time, setTime] = useState({ h: hours, m: minutes, s: seconds });
    useEffect(() => {
        const id = setInterval(() => {
            setTime(prev => {
                let { h, m, s } = prev;
                if (s > 0) return { h, m, s: s - 1 };
                if (m > 0) return { h, m: m - 1, s: 59 };
                if (h > 0) return { h: h - 1, m: 59, s: 59 };
                return { h: 0, m: 0, s: 0 };
            });
        }, 1000);
        return () => clearInterval(id);
    }, []);
    const pad = n => String(n).padStart(2, '0');
    return `${pad(time.h)}h ${pad(time.m)}m ${pad(time.s)}s`;
}

/* ── STAR RATING ── */
const Stars = ({ rating = 4, count }) => (
    <div className="flex items-center gap-0.5 mt-1">
        {[1, 2, 3, 4, 5].map(s => (
            <Star key={s} size={10} fill={s <= rating ? '#FBBF24' : 'none'}
                className={s <= rating ? 'text-yellow-400' : 'text-gray-200'} />
        ))}
    </div>
);

/* ── PRODUCT CARD ── */
const ProductCard = ({ product }) => {
    const original = product.price ? product.price + 500 : 999;
    return (
        <Link to={`/product/${product.id}`} className="flex-shrink-0 w-[140px] bg-white rounded-xl shadow-sm overflow-hidden block pb-2">
            <div className="relative h-[120px] bg-gray-50">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <div className="p-2">
                <h3 className="text-[11px] font-bold text-gray-900 line-clamp-1">{product.name}</h3>
                <p className="text-[9px] text-gray-500 line-clamp-2 leading-tight mt-0.5">{product.description}</p>
                <div className="flex items-center gap-1 mt-1">
                    <span className="text-[13px] font-black text-gray-900">₹{product.price}</span>
                    <span className="text-[9px] text-gray-400 line-through">₹{original}</span>
                </div>
                <Stars rating={4} />
            </div>
        </Link>
    );
};

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const countdown = useCountdown(22, 55, 20);

    const categories = [
        { name: 'Beauty', img: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=100&q=80' },
        { name: 'Fashion', img: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=100&q=80' },
        { name: 'Kids', img: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=100&q=80' },
        { name: 'Mens', img: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=100&q=80' },
        { name: 'Womens', img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=100&q=80' },
    ];

    useEffect(() => {
        (async () => {
            try {
                const r = await API.get('/products', { params: { limit: 12 } });
                setProducts(r.data.products && r.data.products.length > 0 ? r.data.products : MOCK_PRODUCTS);
            } catch { 
                setProducts(MOCK_PRODUCTS); 
            }
            finally { setLoading(false); }
        })();
    }, []);

    if (loading) return <div className="min-h-screen bg-white" />;

    return (
        <div className="bg-[#FDFDFD] min-h-screen pb-24">
            {/* ── HEADER ── */}
            <div className="px-5 pt-12 pb-4 flex items-center justify-between bg-white sticky top-0 z-50">
                <button className="w-10 h-10 flex flex-col justify-center gap-1.5 p-2 bg-gray-100 rounded-full">
                    <span className="w-5 h-[2px] bg-gray-900 rounded-full"></span>
                    <span className="w-3 h-[2px] bg-gray-900 rounded-full"></span>
                    <span className="w-4 h-[2px] bg-gray-900 rounded-full"></span>
                </button>
                <div className="flex items-center gap-2">
                    <div className="relative flex items-center justify-center w-8 h-8">
                        <svg viewBox="0 0 100 100" className="w-full h-full text-[#F83758]" fill="currentColor">
                            <path d="M50 0C22.4 0 0 22.4 0 50s22.4 50 50 50 50-22.4 50-50S77.6 0 50 0zm0 80c-16.6 0-30-13.4-30-30s13.4-30 30-30 30 13.4 30 30-13.4 30-30 30z"/>
                            <path d="M50 30c-11 0-20 9-20 20s9 20 20 20 20-9 20-20-9-20-20-20zm0 30c-5.5 0-10-4.5-10-10s4.5-10 10-10 10 4.5 10 10-4.5 10-10 10z" className="text-[#4392F9]" fill="currentColor"/>
                        </svg>
                    </div>
                    <span className="text-xl font-black tracking-tight text-[#4392F9]">KLYRO</span>
                </div>
                <div className="w-10 h-10 rounded-full overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80" alt="Profile" className="w-full h-full object-cover"/>
                </div>
            </div>

            {/* ── SEARCH BAR ── */}
            <div className="px-5 pb-4 bg-white" onClick={() => navigate('/search')}>
                <div className="relative flex items-center cursor-text">
                    <Search size={18} className="absolute left-4 text-gray-400" />
                    <div className="w-full bg-[#F3F4F6] text-[14px] rounded-xl py-3 pl-11 pr-11 text-gray-400">
                        Search any Product..
                    </div>
                    <Mic size={18} className="absolute right-4 text-gray-400" />
                </div>
            </div>

            {/* ── ALL FEATURED & FILTERS ── */}
            <div className="px-5 py-4 flex items-center justify-between bg-white">
                <span className="text-[16px] font-black text-gray-900">All Featured</span>
                <div className="flex gap-2">
                    <button className="flex items-center gap-1.5 bg-white border border-gray-200 shadow-sm rounded-lg px-3 py-1.5 text-[11px] font-bold text-gray-600">
                        Sort <ArrowUpDown size={12} />
                    </button>
                    <button className="flex items-center gap-1.5 bg-white border border-gray-200 shadow-sm rounded-lg px-3 py-1.5 text-[11px] font-bold text-gray-600">
                        Filter <SlidersHorizontal size={12} />
                    </button>
                </div>
            </div>

            {/* ── CATEGORIES (Circular) ── */}
            <div className="flex overflow-x-auto hide-scrollbar px-5 gap-4 pb-4 bg-white">
                {categories.map((cat, i) => (
                    <div key={i} className="flex flex-col items-center gap-2">
                        <div className="w-[60px] h-[60px] rounded-full overflow-hidden border-2 border-transparent hover:border-[#F83758] transition-all p-0.5">
                            <div className="w-full h-full rounded-full overflow-hidden">
                                <img src={cat.img} alt={cat.name} className="w-full h-full object-cover" />
                            </div>
                        </div>
                        <span className="text-[11px] font-medium text-gray-700">{cat.name}</span>
                    </div>
                ))}
            </div>

            {/* ── MAIN HERO BANNER ── */}
            <div className="px-5 mt-4">
                <div className="w-full h-[180px] rounded-xl overflow-hidden relative shadow-md">
                    <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80" alt="Hero" className="w-full h-full object-cover"/>
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex flex-col justify-center p-6">
                        <h2 className="text-white text-[24px] font-black leading-tight mb-2">50-40% OFF</h2>
                        <p className="text-white/90 text-[13px] font-medium mb-4">Now in (product)<br/>All colours</p>
                        <button className="self-start border border-white text-white text-[12px] font-bold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-white hover:text-black transition-all">
                            Shop Now <ArrowRight size={14} />
                        </button>
                    </div>
                </div>
            </div>

            {/* ── DEAL OF THE DAY ── */}
            <div className="mt-6 mx-5 bg-[#4392F9] rounded-xl overflow-hidden shadow-lg shadow-blue-200">
                <div className="p-4 flex items-center justify-between text-white">
                    <div>
                        <h3 className="text-[15px] font-black">Deal of the Day</h3>
                        <div className="flex items-center gap-1.5 mt-1 text-[11px] font-medium">
                            <Clock size={12} /> {countdown} remaining
                        </div>
                    </div>
                    <button className="border border-white text-white text-[10px] font-bold px-3 py-1.5 rounded-md flex items-center gap-1 hover:bg-white hover:text-[#4392F9]">
                        View all <ArrowRight size={10} />
                    </button>
                </div>
                <div className="bg-[#F5F6FA] p-4 flex gap-4 overflow-x-auto hide-scrollbar">
                    {products.slice(0, 3).map(p => <ProductCard key={p.id} product={p} />)}
                </div>
            </div>

            {/* ── SPECIAL OFFERS ── */}
            <div className="px-5 mt-6">
                <div className="w-full rounded-xl overflow-hidden bg-white shadow-sm flex border border-gray-100">
                    <div className="flex-1 p-5 flex flex-col justify-center relative">
                        <div className="flex items-center gap-2 mb-2">
                            <img src="https://cdn-icons-png.flaticon.com/512/3225/3225219.png" className="w-5 h-5 object-contain" alt="icon"/>
                            <span className="text-[18px] font-black text-gray-900">Special Offers</span>
                        </div>
                        <p className="text-[11px] text-gray-500 font-medium">We make sure you get the offer you need at best prices</p>
                    </div>
                    <div className="w-[120px] h-[120px]">
                        <img src="https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&q=80" alt="Shoes" className="w-full h-full object-cover"/>
                    </div>
                </div>
            </div>

            {/* ── TRENDING PRODUCTS ── */}
            <div className="mt-6 mx-5 bg-[#F83758] rounded-xl overflow-hidden shadow-lg shadow-red-200">
                <div className="p-4 flex items-center justify-between text-white">
                    <h3 className="text-[15px] font-black flex items-center gap-2"><Heart size={14} fill="white"/> Trending Products</h3>
                    <button className="border border-white text-white text-[10px] font-bold px-3 py-1.5 rounded-md flex items-center gap-1 hover:bg-white hover:text-[#F83758]">
                        View all <ArrowRight size={10} />
                    </button>
                </div>
                <div className="bg-[#F5F6FA] p-4 flex gap-4 overflow-x-auto hide-scrollbar">
                    {products.slice(2, 5).map(p => <ProductCard key={p.id} product={p} />)}
                </div>
            </div>

            {/* ── NEW ARRIVALS ── */}
            <div className="mt-6">
                <div className="px-5 mb-4 flex items-center justify-between">
                    <div>
                        <h3 className="text-[16px] font-black text-gray-900">New Arrivals</h3>
                        <p className="text-[11px] text-gray-500">Summer' 25 Collections</p>
                    </div>
                    <button className="bg-[#F83758] text-white text-[10px] font-bold px-3 py-1.5 rounded-md flex items-center gap-1 shadow-sm">
                        View all <ArrowRight size={10} />
                    </button>
                </div>
                <div className="px-5 flex gap-4 overflow-x-auto hide-scrollbar">
                    {products.slice(1, 4).map(p => <ProductCard key={p.id} product={p} />)}
                </div>
            </div>

            {/* ── SPONSORED ── */}
            <div className="mt-8 px-5">
                <h3 className="text-[16px] font-black text-gray-900 mb-3">Sponsored</h3>
                <div className="w-full h-[180px] rounded-xl overflow-hidden relative shadow-md">
                    <img src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80" alt="Sponsored" className="w-full h-full object-cover"/>
                    <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-center">
                        <span className="bg-white text-gray-900 text-[18px] font-black px-4 py-1.5 rounded-md mb-2">UP TO</span>
                        <span className="text-white text-[32px] font-black drop-shadow-md">50% OFF</span>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Home;
