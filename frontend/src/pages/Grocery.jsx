import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Star, ChevronRight, ArrowRight, CheckCircle, Zap, ShieldCheck, Heart, Info, RotateCcw, Clock, X } from 'lucide-react';
import API from '../api/axios';
import GroceryV2Data from '../data/GroceryV2Data';

const Grocery = () => {
    const [products, setProducts] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "KLYRO | Grocery & Essentials";
        fetchMetadata();
    }, []);

    const fetchMetadata = async () => {
        try {
            const response = await API.get('/categories');
            const raw = response.data.categories || [];
            const root = raw.find(c => c.name.toLowerCase().includes('grocery'));
            if (root) {
                const subCats = raw.filter(c => c.parent_id === root.id);
                setSubCategories(subCats);
            }
        } catch (error) {
            console.error('Grocery metadata fetch error:', error);
        }
    };

    const brands = [
        { name: 'Tata Sampann', logo: '/assets/grocery/brands/tata.svg' },
        { name: 'Nestle', logo: '/assets/grocery/brands/nestle.svg' },
        { name: 'Daawat', logo: '/assets/grocery/brands/daawat.svg' },
        { name: 'Surf Excel', logo: '/assets/grocery/brands/surf_excel.svg' },
        { name: 'Dove', logo: '/assets/grocery/brands/dove.svg' },
        { name: 'Huggies', logo: '/assets/grocery/brands/huggies.svg' },
        { name: 'Pepsi', logo: '/assets/grocery/brands/pepsi.svg' },
        { name: 'Dr. Oetker', logo: '/assets/grocery/brands/dr_oetker.svg' }
    ];

    const subNavbarItems = ['Grocery', 'Fruits', 'Vegetables', 'Dairy', 'Staples', 'Snacks', 'Household'];

    return (
        <div className="bg-[#fffdfa] min-h-screen pt-[100px] md:pt-[120px] pb-24 page-transition font-sans relative">
            {/* Background Texture Overlay */}
            <div className="bg-paper" />

            {/* SUB-NAVBAR CATEGORIES (Sticky Organic Theme) */}
            <div className="bg-white border-b sticky top-[64px] md:top-[72px] lg:top-[120px] z-50 overflow-x-auto whitespace-nowrap no-scrollbar shadow-sm transition-all duration-300">
                <div className="max-w-[1440px] mx-auto flex items-center h-12 md:h-14 px-4 md:px-6 gap-6 md:gap-8">
                    <button onClick={() => navigate('/grocery')} className="text-[10px] md:text-[12px] font-black uppercase h-full border-b-2 border-[#bc612c] text-[#bc612c] transition-all">Grocery</button>
                    {subNavbarItems.filter(item => item !== 'Grocery').map((item) => (
                        <button 
                            key={item} 
                            onClick={() => navigate(`/products?search=${item.toLowerCase()}`)}
                            className="text-[9px] md:text-[11px] font-bold uppercase transition-all h-full border-b-2 border-transparent text-gray-500 hover:text-[#bc612c] hover:border-[#bc612c]"
                        >
                            {item}
                        </button>
                    ))}
                </div>
            </div>

            {/* BREADCRUMBS */}
            <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-12 py-2 flex items-center gap-2 text-[10px] md:text-[11px] text-[#bc612c] font-bold uppercase tracking-wider overflow-x-auto no-scrollbar whitespace-nowrap">
                <Link to="/" className="hover:underline">Home</Link>
                <ChevronRight size={10} strokeWidth={4} className="mt-[1px] flex-shrink-0" />
                <span>Grocery & Essentials</span>
            </div>

            {/* FULL-WIDTH CINEMATIC HERO */}
            <section className="mb-8 md:mb-16 w-full animate-reveal relative group z-10 px-0 md:px-6 lg:px-0">
                <div className="relative h-[40vh] md:h-[50vh] min-h-[350px] md:min-h-[450px] w-full overflow-hidden shadow-sm md:rounded-3xl lg:rounded-none border-b border-[#dcc6a6]/20 bg-white">
                    
                    {/* Background Image */}
                    <div 
                        className="absolute inset-0 w-full bg-cover bg-center transition-transform duration-[6000ms] group-hover:scale-110 ease-out"
                        style={{ backgroundImage: `url(/assets/grocery_hero.webp)` }}
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#fffdfa] via-[#fffdfa]/90 md:via-[#fffdfa]/80 to-transparent z-10" />

                    {/* Content Layer */}
                    <div className="relative z-20 h-full flex flex-col justify-center px-6 md:px-12 lg:px-24 max-w-[1440px] mx-auto space-y-4 md:space-y-6">

                        <div className="space-y-2 md:space-y-4">
                            <h1 className="text-4xl sm:text-6xl lg:text-8xl font-black text-[#2d231b] tracking-tight leading-[0.9]">
                                Fresh <span className="text-[#bc612c]">Organic</span>
                            </h1>
                            <p className="text-sm md:text-xl lg:text-2xl font-bold text-slate-600 tracking-tight leading-relaxed max-w-lg mb-4 md:mb-8 uppercase">
                                Pure Essentials for Your Healthy Lifestyle.
                            </p>
                            <div className="hidden sm:flex flex-wrap gap-2 md:gap-4 pt-2">
                                {GroceryV2Data.hero.bullets.map((bullet, i) => (
                                    <div key={i} className="bg-white/80 backdrop-blur-md px-3 md:px-4 py-1.5 rounded-full border border-[#bc612c]/20 text-[8px] md:text-[10px] font-black uppercase tracking-widest text-[#bc612c]">
                                        {bullet}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-10 pt-2 md:pt-4">
                            <button 
                                onClick={() => navigate('/products?category_id=5')} 
                                className="bg-[#bc612c] hover:bg-[#a05225] text-white px-8 md:px-12 py-3 md:py-4 rounded-md font-black text-[10px] md:text-xs transition-all shadow-lg active:scale-95 uppercase tracking-widest"
                            >
                                Shop Harvest &rarr;
                            </button>
                            <button 
                                onClick={() => navigate('/products?category_id=5&sort=popularity')}
                                className="text-[#2d231b] hover:text-[#bc612c] font-black text-[10px] md:text-xs transition-all uppercase tracking-widest flex items-center gap-2 group/btn"
                            >
                                Best Sellers <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* SHOP BY CATEGORY (Premium White Card Grid) */}
            <section className="bg-gray-50/50 py-16 md:py-24 mb-12 md:mb-20 animate-reveal stagger-1">
                <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-12">
                    <div className="flex items-center justify-between mb-12 border-b border-gray-200/50 pb-6">
                        <h2 className="text-2xl md:text-3xl font-black text-green-900 uppercase tracking-tight">Shop by Essentials</h2>
                        <button onClick={() => navigate('/products?category_id=38')} className="text-[10px] md:text-[12px] font-black uppercase tracking-widest text-[#15402a] border-2 border-green-100 px-6 py-3 rounded-full hover:bg-[#15402a] hover:text-white transition-all shadow-sm">
                            View All Items
                        </button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
                        {[
                            { name: "Fruits & Veg", img: "/assets/top_fruits.png" },
                            { name: "Snacks", img: "/assets/snack_pack.png" },
                            { name: "Dairy", img: "/assets/dairy_fresh.png" },
                            { name: "Bevarages", img: "/assets/juice_pack.png" },
                            { name: "Staples", img: "/assets/staple_food.png" },
                            { name: "Cleaning", img: "/assets/cleaning_kit.png" }
                        ].map((cat, i) => (
                            <div 
                                key={i} 
                                onClick={() => navigate(`/products?search=${cat.name.toLowerCase()}`)} 
                                className="flex flex-col items-center gap-6 group cursor-pointer"
                            >
                                <div className="w-full aspect-square bg-white rounded-[2rem] shadow-xl flex items-center justify-center border border-white p-8 transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl">
                                    <img 
                                        src={cat.img} 
                                        alt={cat.name} 
                                        className="max-h-full max-w-full object-contain filter drop-shadow-md group-hover:scale-110 transition-transform duration-500" 
                                    />
                                </div>
                                <span className="text-xs md:text-sm font-black uppercase text-gray-800 tracking-tight text-center leading-tight group-hover:text-green-700 transition-colors">
                                    {cat.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* PROMO BANNERS */}
            <section className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-12 mb-12 md:mb-20 animate-reveal stagger-2 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                    {/* Organic Banner */}
                    <div className="rounded-[30px] md:rounded-[40px] overflow-hidden relative shadow-xl group cursor-pointer h-[220px] md:h-[280px] bg-[#f2f7f0]">
                        <img src="/assets/grocery/top_fruits.png" alt="Fruits" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 opacity-90" />
                        <div className="absolute inset-0 bg-gradient-to-r from-green-900/40 via-green-900/20 to-transparent p-6 md:p-12 flex flex-col justify-center text-white">
                            <div className="space-y-1 mb-4 md:mb-6">
                                <p className="text-sm md:text-lg font-bold tracking-[0.2em] uppercase opacity-90">Fresh Harvest Sale</p>
                                <h3 className="text-2xl md:text-5xl font-black flex items-baseline gap-2">UP TO <span className="text-yellow-300 text-3xl md:text-6xl">40%</span> OFF</h3>
                            </div>
                            <button className="bg-white text-green-900 px-6 md:px-8 py-2 md:py-3 rounded-xl font-black text-[10px] md:text-[12px] w-fit transition-all uppercase tracking-widest shadow-lg hover:bg-green-900 hover:text-white">
                                Shop Healthy
                            </button>
                        </div>
                    </div>
                    
                    {/* Offer Zone */}
                    <div className="rounded-[30px] md:rounded-[40px] overflow-hidden relative shadow-lg group cursor-pointer h-[220px] md:h-[280px] bg-[#fffaf5] border border-[#dcc6a6]/20">
                        <div className="absolute top-0 right-0 w-1/2 h-full p-4 md:p-8 flex items-center justify-center">
                             <img src="/assets/grocery/top_dairy.png" alt="Dairy" className="w-full h-full object-contain filter drop-shadow-xl group-hover:rotate-6 transition-transform duration-700" />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-[#fffaf5] via-[#fffaf5]/90 to-transparent p-6 md:p-12 flex flex-col justify-center text-[#bc612c]">
                            <div className="space-y-1 md:space-y-2 mb-4 md:mb-6">
                                <h3 className="text-2xl md:text-4xl font-black tracking-tight leading-tight">Offer Zone</h3>
                                <p className="text-sm md:text-lg font-bold opacity-70">Extra 10% OFF | UPI Offers</p>
                                <p className="text-base md:text-xl font-black mt-1 md:mt-2">Starts @ ₹49</p>
                            </div>
                            <div className="flex gap-1.5 md:gap-2 flex-wrap max-w-[200px]">
                                {['FRESH10', 'VISA', 'UPI'].map(code => (
                                    <div key={code} className="bg-[#bc612c]/10 border border-[#bc612c]/20 text-[7px] md:text-[8px] font-black px-2 md:px-3 py-1 rounded-sm tracking-tighter uppercase">{code}</div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* TOP SELLERS */}
            <section className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-12 mb-12 md:mb-20 animate-reveal stagger-3 relative z-10">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 md:mb-10 border-b border-[#dcc6a6]/30 pb-4 gap-4">
                    <h2 className="text-xl md:text-2xl font-bold text-slate-800">Top Sellers</h2>
                    <button onClick={() => navigate('/products')} className="text-[9px] md:text-[11px] font-semibold uppercase tracking-widest text-[#bc612c] border border-[#dcc6a6]/30 px-5 md:px-6 py-2 md:py-2.5 rounded-full hover:bg-[#fffaf5] transition-colors">
                        View All Products &rsaquo;
                    </button>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                    {GroceryV2Data.exclusiveOffers.map((item) => (
                         <div key={item.id} className="bg-white rounded-[24px] md:rounded-[32px] p-4 md:p-6 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col border border-stone-100 h-full group">
                            <div className="h-40 md:h-64 flex items-center justify-center mb-4 md:mb-6 relative z-0 overflow-hidden rounded-2xl bg-[#fdfaf5]/50">
                                <img src={item.img} alt={item.name} className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-700" />
                                <button className="absolute top-2 right-2 md:top-4 md:right-4 p-2 bg-white/80 backdrop-blur-md rounded-full text-[#bc612c] hover:text-white hover:bg-[#bc612c] transition-all shadow-sm opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 duration-300">
                                    <ShoppingBag size={16} md={18} />
                                </button>
                            </div>
                            <div className="flex flex-col flex-grow text-center">
                                <h4 className="font-bold text-slate-700 text-sm md:text-base leading-tight mb-2 md:mb-3 line-clamp-2">{item.name}</h4>
                                <div className="flex items-center justify-center gap-2 md:gap-3 mb-4 md:mb-6">
                                    <span className="text-[#bc612c] font-black text-base md:text-xl">₹{item.price}</span>
                                    <span className="text-[10px] md:text-xs text-slate-300 line-through font-bold italic">₹{item.originalPrice}</span>
                                </div>
                                <button className="w-full bg-slate-900 text-white py-2.5 md:py-4 rounded-xl md:rounded-2xl font-black text-[10px] md:text-[12px] uppercase tracking-widest mt-auto shadow-md hover:bg-[#bc612c] transition-all active:scale-95 duration-200">Add to Bag</button>
                            </div>
                         </div>
                    ))}
                </div>
            </section>

            {/* TOP BRANDS */}
            <section className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-12 mb-12 md:mb-20 relative z-10">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b border-gray-100 pb-4 gap-4">
                    <h2 className="text-xl md:text-2xl font-bold text-[#1e293b]">Top Brands</h2>
                </div>
                <div className="flex overflow-x-auto no-scrollbar gap-4 pb-4">
                    {brands.map((brand, i) => (
                        <div key={i} className="bg-white border text-center border-gray-100 h-16 md:h-20 px-6 md:px-8 flex-shrink-0 rounded-xl flex items-center justify-center shadow-sm hover:shadow-md hover:border-blue-100 transition-all cursor-pointer group">
                             <img src={brand.logo} alt={brand.name} className="h-6 md:h-10 opacity-60 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0 filter" />
                        </div>
                    ))}
                </div>
            </section>

            {/* SERVICE BAR */}
            <section className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-12 mb-12 md:mb-32 grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-12 relative z-10 border-t border-stone-100 pt-8 md:pt-16">
                {[
                    { title: 'Fast Delivery', sub: 'Reliable & Timely', icon: <Clock size={20} md={24} /> },
                    { title: 'Safe Payments', sub: 'Secure Transactions', icon: <ShieldCheck size={20} md={24} /> },
                    { title: 'Easy Returns', sub: 'Hassle-Free Policy', icon: <X size={20} md={24} /> },
                    { title: '24/7 Service', sub: 'Expert Help Center', icon: <Star size={20} md={24} /> }
                ].map((item, i) => (
                    <div key={i} className="flex flex-col items-center text-center gap-2 md:gap-3 group cursor-pointer">
                        <div className="text-[#bc612c]/40 group-hover:text-[#bc612c] transition-all duration-300 mb-1 md:mb-2">
                            {item.icon}
                        </div>
                        <div className="space-y-0.5 md:space-y-1">
                            <h4 className="font-black text-[11px] md:text-[13px] text-[#2d231b] uppercase tracking-widest">{item.title}</h4>
                            <p className="text-[9px] md:text-[11px] text-stone-400 font-bold uppercase">{item.sub}</p>
                        </div>
                    </div>
                ))}
            </section>
        </div>
    );
};

export default Grocery;
