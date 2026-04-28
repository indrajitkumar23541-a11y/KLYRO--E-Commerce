import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Star, ChevronRight, ArrowRight, Heart, Sparkles, Truck, RotateCcw, Headphones, X, Zap, ShieldCheck } from 'lucide-react';
import API from '../api/axios';
import ProductCard from '../components/ProductCard';

const BeautyHealth = () => {
    const [products, setProducts] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [activeSubId, setActiveSubId] = useState(null);
    const [activeTab, setActiveTab] = useState('All');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "KLYRO | Beauty & Health Store";
        fetchMetadata();
    }, []);

    const fetchMetadata = async () => {
        try {
            const response = await API.get('/categories');
            const raw = response.data.categories || [];
            // Root Beauty & Health ID is 21
            const beautySub = raw.filter(c => c.parent_id === 21);
            setSubCategories(beautySub);
        } catch (error) {
            console.error('Beauty metadata fetch error:', error);
        }
    };

    const fetchProducts = async (subId) => {
        setLoading(true);
        try {
            const params = { limit: 12 };
            if (subId) params.category_id = subId;
            else params.category_id = 21; // Default to Beauty & Health
            
            const response = await API.get('/products', { params });
            setProducts(response.data.products || []);
        } catch (error) {
            console.error('Products fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts(activeSubId);
    }, [activeSubId]);

    const brands = [
        { 
            name: 'CeraVe', 
            svg: <svg viewBox="0 0 100 40" className="h-full w-auto"><text x="50" y="28" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="22" textAnchor="middle" fill="#1b418a">CeraVe</text></svg> 
        },
        { 
            name: 'Minimalist', 
            svg: <svg viewBox="0 0 100 40" className="h-full w-auto"><text x="50" y="26" fontFamily="Helvetica, Arial, sans-serif" fontWeight="400" fontSize="18" textAnchor="middle" fill="#000000" letterSpacing="1">Minimalist</text></svg> 
        },
        { 
            name: 'WOW', 
            svg: <svg viewBox="0 0 100 40" className="h-full w-auto"><text x="50" y="28" fontFamily="Arial Black, sans-serif" fontWeight="900" fontSize="24" textAnchor="middle" fill="#58595b">WOW</text></svg> 
        },
        { 
            name: 'Himalaya', 
            svg: <svg viewBox="0 0 100 40" className="h-full w-auto"><text x="50" y="28" fontFamily="Georgia, serif" fontWeight="bold" fontSize="18" textAnchor="middle" fill="#00693e" letterSpacing="1">Himalaya</text></svg> 
        },
        { 
            name: "Nature's Bounty", 
            svg: <svg viewBox="0 0 140 40" className="h-full w-auto"><text x="70" y="26" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="14" textAnchor="middle" fill="#184b2c">NATURE'S BOUNTY</text></svg> 
        },
        { 
            name: 'Lakmé', 
            svg: <svg viewBox="0 0 100 40" className="h-full w-auto"><text x="50" y="28" fontFamily="Times New Roman, serif" fontWeight="bold" fontSize="22" textAnchor="middle" fill="#4d0008" letterSpacing="2">LAKMÉ</text></svg> 
        }
    ];

    return (
        <div className="bg-[#fcfdfd] min-h-screen pt-[100px] md:pt-[112px] pb-24 page-transition">
            
            {/* SUB-NAVBAR CATEGORIES (Sticky Wellness Theme) */}
            <div className="bg-white border-b sticky top-[56px] md:top-[64px] lg:top-[112px] z-50 overflow-x-auto whitespace-nowrap no-scrollbar shadow-sm transition-all duration-300">
                <div className="max-w-[1440px] mx-auto flex items-center h-12 px-4 md:px-6 gap-6 md:gap-8">
                    <button onClick={() => { setActiveSubId(null); navigate('/beauty-health'); }} className={`text-[10px] md:text-[12px] font-black uppercase h-full border-b-2 transition-all ${activeSubId === null ? 'text-pink-600 border-pink-600' : 'text-gray-400 border-transparent hover:text-pink-600'}`}>Beauty & Health</button>
                    {subCategories.map(cat => (
                        <button 
                            key={cat.id} 
                            onClick={() => {
                                setActiveSubId(cat.id);
                                navigate(`/products?category_id=${cat.id}`);
                            }}
                            className={`text-[9px] md:text-[11px] font-bold uppercase transition-all h-full border-b-2 ${activeSubId === cat.id ? 'text-pink-600 border-pink-600' : 'text-gray-500 border-transparent hover:text-pink-600'}`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* BREADCRUMBS */}
            <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-12 py-2 flex items-center gap-2 text-[10px] md:text-[11px] text-pink-600 font-bold uppercase tracking-wider overflow-x-auto no-scrollbar whitespace-nowrap">
                <Link to="/" className="hover:underline">Home</Link>
                <ChevronRight size={10} strokeWidth={4} className="mt-[1px] flex-shrink-0" />
                <span>Beauty & Wellness</span>
            </div>

            {/* FULL-WIDTH CINEMATIC HERO */}
            <section className="mb-8 md:mb-16 w-full animate-reveal relative group px-0 md:px-6 lg:px-0">
                <div className="relative h-[40vh] md:h-[50vh] min-h-[350px] md:min-h-[450px] w-full overflow-hidden shadow-sm md:rounded-3xl lg:rounded-none border-b border-purple-50 bg-white">
                    
                    {/* Background Image */}
                    <div 
                        className="absolute inset-0 w-full bg-cover bg-center transition-transform duration-[6000ms] group-hover:scale-110 ease-out"
                        style={{ backgroundImage: `url(/assets/beauty_hero_v2.png)` }}
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#faf5ff] via-[#faf5ff]/90 md:via-[#faf5ff]/80 to-transparent z-10" />

                    {/* Content Layer */}
                    <div className="relative z-20 h-full flex flex-col justify-center px-6 md:px-12 lg:px-24 max-w-[1440px] mx-auto space-y-4 md:space-y-6">

                        <div className="space-y-2 md:space-y-4">
                            <h1 className="text-4xl sm:text-6xl lg:text-8xl font-black text-[#4c1d95] tracking-tight leading-[0.9]">
                                Beauty <span className="text-pink-500">Wellness</span>
                            </h1>
                            <p className="text-sm md:text-xl lg:text-2xl font-bold text-slate-600 tracking-tight leading-relaxed max-w-lg mb-4 md:mb-8 uppercase">
                                Glow Naturally. Live Healthy.
                            </p>
                            <div className="hidden sm:flex flex-wrap gap-2 md:gap-4 pt-2">
                                {['Dermatologist Tested', 'Organic Ingredients', 'Premium Brands', 'Personalized Care'].map((bullet, i) => (
                                    <div key={i} className="bg-white/80 backdrop-blur-md px-3 md:px-4 py-1.5 rounded-full border border-purple-100 text-[8px] md:text-[10px] font-black uppercase tracking-widest text-[#4c1d95]">
                                        {bullet}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-10 pt-2 md:pt-4">
                            <button 
                                onClick={() => navigate('/products?category_id=21')} 
                                className="bg-[#ff3e6c] hover:bg-[#e03a61] text-white px-8 md:px-12 py-3 md:py-4 rounded-md font-black text-[10px] md:text-xs transition-all shadow-lg active:scale-95 uppercase tracking-widest"
                            >
                                Shop Bestsellers &rarr;
                            </button>
                            <button 
                                onClick={() => navigate('/products?category_id=21&sort=popularity')}
                                className="text-[#4c1d95] hover:text-[#ff3e6c] font-black text-[10px] md:text-xs transition-all uppercase tracking-widest flex items-center gap-2 group/btn"
                            >
                                Health Essentials <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* SHOP BY CATEGORY (Premium White Card Grid) */}
            <section id="categories-section" className="bg-gray-50/50 py-16 md:py-24 mb-12 md:mb-20 animate-reveal">
                <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-12">
                    <div className="flex items-center justify-between mb-12 border-b border-gray-200/50 pb-6">
                        <h2 className="text-2xl md:text-3xl font-black text-slate-800 uppercase tracking-tight">Shop by Sub-Category</h2>
                        <button 
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            className="text-[10px] md:text-[12px] font-black uppercase tracking-widest text-pink-600 border-2 border-pink-100 px-6 py-3 rounded-full hover:bg-pink-600 hover:text-white transition-all shadow-sm"
                        >
                            View All Categories
                        </button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
                        {[
                            { name: "Skincare", img: "/assets/beauty_royale.webp" },
                            { name: "Wellness", img: "/assets/wellness_pack.webp" },
                            { name: "Beauty", img: "/assets/beauty_health_elite.webp" },
                            { name: "Essentials", img: "/assets/wellness_pack_v2.webp" }
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
                                <span className="text-xs md:text-sm font-black uppercase text-gray-800 tracking-tight text-center leading-tight group-hover:text-pink-600 transition-colors">
                                    {cat.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* PROMO BANNERS */}
            <section className="max-w-[1440px] mx-auto px-4 md:px-6 mb-12 md:mb-20 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                <div className="bg-[#FFE4E1] p-6 md:p-10 rounded-[30px] md:rounded-[40px] flex items-center justify-between group cursor-pointer relative overflow-hidden shadow-sm">
                    <div className="z-10">
                        <h4 className="text-accent-color font-black text-2xl md:text-3xl mb-1 italic">Flat 20% OFF</h4>
                        <p className="text-gray-600 font-bold text-xs md:text-sm mb-4 md:mb-6">on Top Brands</p>
                        <div className="bg-[#ff3e6c] text-white px-4 md:px-6 py-1.5 md:py-2 rounded-lg font-black text-[10px] md:text-xs inline-block">Code: GLOW20</div>
                    </div>
                    <img src="/assets/beauty_health_hero.webp" alt="Skincare" className="w-24 md:w-40 drop-shadow-xl group-hover:scale-110 transition-transform" />
                </div>
                <div className="bg-[#E0FFF0] p-6 md:p-10 rounded-[30px] md:rounded-[40px] flex items-center justify-between group cursor-pointer relative overflow-hidden shadow-sm">
                    <div className="z-10">
                        <h4 className="text-green-600 font-black text-2xl md:text-3xl mb-1 italic">Buy 2 Get 1 FREE</h4>
                        <p className="text-gray-600 font-bold text-xs md:text-sm mb-4 md:mb-6">on Supplements</p>
                        <button className="bg-green-600 text-white px-5 md:px-8 py-2 md:py-3 rounded-full font-black text-[9px] md:text-[10px] uppercase flex items-center gap-2 transition-all">Shop Now <ArrowRight size={14} /></button>
                    </div>
                    <img src="/assets/beauty_royale.webp" alt="Health" className="w-24 md:w-40 drop-shadow-xl group-hover:scale-110 transition-transform" />
                </div>
            </section>

            {/* PRODUCT GRID */}
            <section id="products-grid" className="max-w-[1440px] mx-auto px-4 md:px-6 mb-12 md:mb-20">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 md:mb-12 border-b border-gray-100 pb-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-6">
                        <h2 className="text-xl md:text-2xl font-black text-primary-color whitespace-nowrap">Bestsellers</h2>
                        <div className="flex bg-gray-100 p-1 rounded-full overflow-x-auto no-scrollbar gap-1 max-w-full">
                            {['All', 'Trending', 'Offers'].map((tab, idx) => (
                                <button 
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-4 md:px-5 py-1 md:py-1.5 rounded-full text-[9px] md:text-[11px] font-black uppercase transition-all whitespace-nowrap ${activeTab === tab ? 'bg-white text-accent-color shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>
                    <button className="text-[9px] md:text-[11px] font-semibold uppercase tracking-widest text-gray-400 border border-gray-200 px-4 md:px-5 py-2 rounded-full hover:bg-gray-50 transition-colors whitespace-nowrap">
                        View All &rsaquo;
                    </button>
                </div>

                {loading ? (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                        {[1,2,3,4].map(i => <div key={i} className="aspect-[3/4] bg-gray-50 rounded-[24px] md:rounded-[40px] animate-pulse" />)}
                    </div>
                ) : products.length > 0 ? (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                        {products.map((product, i) => (
                            <div key={product.id} className="animate-reveal" style={{ animationDelay: `${i*0.1}s` }}>
                                <ProductCard product={product} v2 index={i} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 md:py-20 bg-gray-50 rounded-[24px] md:rounded-[40px] border-2 border-dashed border-gray-200">
                        <ShoppingBag size={32} md={48} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="text-lg md:text-xl font-black text-gray-400 uppercase tracking-widest">No Products Found</h3>
                        <p className="text-xs md:text-sm font-bold text-gray-400 mt-2 px-6">Try a different category or search.</p>
                    </div>
                )}
            </section>

            {/* PROMO STRIP */}
            <section className="max-w-[1440px] mx-auto px-4 md:px-6 mb-12 md:mb-20">
                <div className="bg-[#E4F1FF] p-4 md:p-6 rounded-[24px] md:rounded-[30px] flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4 md:gap-6">
                        <div className="bg-white p-3 md:p-4 rounded-xl md:rounded-2xl shadow-sm text-yellow-500 flex-shrink-0"><Zap size={20} md={24} /></div>
                        <div>
                            <h3 className="font-black text-base md:text-lg text-primary-color uppercase italic">FREE Health Checkup</h3>
                            <p className="text-[10px] md:text-sm font-bold text-gray-500">Orders above ₹999</p>
                        </div>
                    </div>
                    <button className="w-full md:w-auto bg-accent-color text-white px-8 md:px-10 py-2.5 md:py-3 rounded-full font-black uppercase text-[9px] md:text-[10px] shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2">Book Now <ArrowRight size={14} /></button>
                </div>
            </section>

            {/* TOP BRANDS */}
            <section className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-12 mb-12 md:mb-20">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b border-gray-100 pb-4 gap-4">
                    <h2 className="text-xl md:text-2xl font-bold text-[#1e293b]">Top Brands</h2>
                </div>
                <div className="flex overflow-x-auto no-scrollbar gap-4 pb-4">
                    {brands.map((brand, i) => (
                        <div key={i} className="bg-white border text-center border-gray-100 h-16 md:h-20 px-6 md:px-8 flex-shrink-0 rounded-xl flex items-center justify-center shadow-sm hover:shadow-md hover:border-pink-100 transition-all cursor-pointer group">
                             <div className="filter opacity-60 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0 h-8 md:h-10 flex items-center justify-center scale-75 md:scale-100">
                                {brand.svg ? brand.svg : <img src={brand.logo} alt={brand.name} className="max-h-full max-w-full object-contain" />}
                             </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* DAILY WELLNESS TIPS */}
            <section className="mb-12 md:mb-24 w-full">
                <div className="bg-[#FFF8F0] overflow-hidden flex flex-col md:flex-row shadow-sm md:h-[50vh] min-h-[400px] md:min-h-[450px]">
                    <div className="w-full md:w-3/5 p-8 md:p-12 lg:px-24 flex flex-col justify-center space-y-6 md:space-y-8">
                        <div className="space-y-2 md:space-y-4 text-center md:text-left">
                             <h2 className="text-3xl md:text-4xl lg:text-6xl font-black text-primary-color tracking-tighter leading-none">Daily Wellness <br className="hidden md:block" /> <span className="text-orange-500">Tips.</span></h2>
                             <p className="font-black text-gray-400 uppercase tracking-[0.3em] md:tracking-[0.5em] text-[7px] md:text-[8px]">Expert advice for healthy living</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                            <div className="bg-white p-4 md:p-6 rounded-[20px] md:rounded-[25px] shadow-sm space-y-2 md:space-y-3 hover:-translate-y-1 md:hover:-translate-y-2 transition-all duration-500 cursor-pointer group hover:shadow-lg">
                                <div className="text-orange-400 bg-orange-50 w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center"><Star size={16} md={20} /></div>
                                <h4 className="font-black text-[10px] md:text-xs tracking-tight">Morning Skincare</h4>
                                <p className="text-[9px] md:text-[10px] text-gray-400 font-bold leading-relaxed">Serum & sunscreen.</p>
                            </div>
                            <div className="bg-white p-4 md:p-6 rounded-[20px] md:rounded-[25px] shadow-sm space-y-2 md:space-y-3 hover:-translate-y-1 md:hover:-translate-y-2 transition-all duration-500 cursor-pointer group hover:shadow-lg">
                                <div className="text-blue-400 bg-blue-50 w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center"><Heart size={16} md={20} /></div>
                                <h4 className="font-black text-[10px] md:text-xs tracking-tight">Stay Hydrated</h4>
                                <p className="text-[9px] md:text-[10px] text-gray-400 font-bold leading-relaxed">Drink pure water.</p>
                            </div>
                            <div className="hidden lg:block bg-white p-6 rounded-[25px] shadow-sm space-y-3 hover:-translate-y-2 transition-all duration-500 cursor-pointer group hover:shadow-lg">
                                <div className="text-purple-400 bg-purple-50 w-10 h-10 rounded-xl flex items-center justify-center"><Zap size={20} /></div>
                                <h4 className="font-black text-xs tracking-tight">Night Routine</h4>
                                <p className="text-[10px] text-gray-400 font-bold leading-relaxed">Retinol skincare.</p>
                            </div>
                        </div>
                        <button className="flex items-center gap-3 md:gap-4 text-accent-color font-black uppercase text-[9px] md:text-[10px] tracking-widest bg-white border-2 border-accent-color/10 pl-6 md:pl-8 pr-2 md:pr-3 py-2 md:py-3 rounded-full hover:bg-accent-color hover:text-white transition-all shadow-sm w-fit mx-auto md:mx-0">View All Tips <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-accent-color/10 group-hover:bg-white/20 flex items-center justify-center"><ChevronRight size={12} /></div></button>
                    </div>
                    <div className="w-full md:w-2/5 relative h-[250px] md:h-full">
                        <img src="/assets/beauty_royale.webp" alt="Wellness" className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-1000" />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#FFF8F0] via-transparent to-transparent hidden md:block" />
                    </div>
                </div>
            </section>

            {/* FOOTER VALUES STRIP */}
            <section className="max-w-[1440px] mx-auto px-4 md:px-6 border-t pt-12 md:pt-20 pb-8">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-12">
                    {[
                        { icon: <ShieldCheck size={32} md={40} />, title: '100% Original', sub: 'Clinical authenticity' },
                        { icon: <Zap size={32} md={40} />, title: 'Express Ship', sub: 'Priority delivery' },
                        { icon: <ArrowRight size={32} md={40} />, title: '7-Day Return', sub: 'Friction-less returns' },
                        { icon: <Star size={32} md={40} />, title: 'Expert Desk', sub: '24/7 beauty line' }
                    ].map((item, i) => (
                        <div key={i} className="flex flex-col items-center text-center space-y-3 md:space-y-5 lg:items-start lg:text-left group cursor-pointer">
                            <div className="text-accent-color opacity-40 group-hover:opacity-100 transition-all duration-500 transform group-hover:-translate-y-1 md:group-hover:-translate-y-2">{item.icon}</div>
                            <div className="space-y-1">
                                <h4 className="font-black text-[10px] md:text-xs uppercase tracking-[0.1em] md:tracking-[0.2em]">{item.title}</h4>
                                <p className="text-[9px] md:text-[11px] font-bold text-gray-400 uppercase tracking-tighter opacity-80">{item.sub}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default BeautyHealth;
