import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ChevronRight, ChevronLeft, ArrowRight, Star, Heart, RotateCcw, Truck, ShieldCheck, Headphones } from 'lucide-react';
import API from '../api/axios';
import OthersData from '../data/OthersData';

// Custom card component for the product slider to match the screenshot
const CollectionCard = ({ product }) => {
    const navigate = useNavigate();
    const discountPercent = Math.round(((product.price - product.discount_price) / product.price) * 100);

    return (
        <div className="min-w-[240px] md:min-w-[280px] bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-sm border border-stone-100 flex flex-col group cursor-pointer hover:shadow-xl transition-all duration-500">
            <div className="relative aspect-square mb-4 md:mb-6 overflow-hidden rounded-xl md:rounded-2xl bg-[#fdfaf5]/50 border border-stone-50 flex items-center justify-center p-4">
                {discountPercent > 0 && (
                    <span className="absolute top-2 left-2 md:top-3 md:left-3 bg-[#BC612C] text-white text-[8px] md:text-[10px] font-black px-2 md:px-3 py-1 rounded-full z-10 shadow-sm lowercase tracking-tighter">
                        {discountPercent}% off
                    </span>
                )}
                <img 
                    src={product.image} 
                    alt={product.name} 
                    className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-700"
                />
            </div>
            <div className="space-y-1 md:space-y-2">
                <h4 className="font-bold text-slate-800 text-sm md:text-[15px] leading-tight line-clamp-1">{product.name}</h4>
                <div className="flex items-center gap-2 md:gap-3">
                    <span className="text-slate-900 font-black text-base md:text-lg">₹{product.discount_price || product.price}</span>
                    {product.discount_price && (
                        <span className="text-slate-400 text-xs md:text-sm line-through font-medium">₹{product.price}</span>
                    )}
                </div>
                <button 
                    onClick={() => navigate(`/product/${product.id}`)}
                    className="w-full bg-[#5D6B60] hover:bg-[#4A574D] text-white py-2.5 md:py-3 rounded-lg md:rounded-xl font-black text-[8px] md:text-[10px] uppercase tracking-widest mt-2 md:mt-4 transition-all shadow-md active:scale-95"
                >
                    View Collection
                </button>
            </div>
        </div>
    );
};

const Others = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeSubId, setActiveSubId] = useState(null);
    const [subCategories, setSubCategories] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "KLYRO | Others Marketplace";
        fetchMetadata();
        fetchProducts();
    }, []);

    const fetchMetadata = async () => {
        try {
            const response = await API.get('/categories');
            const tree = response.data.categories || [];
            // category 45 is "Others"
            const subCats = tree.filter(c => c.parent_id === 45);
            setSubCategories(subCats);
        } catch (error) {
            console.error('Metadata fetch error:', error);
        }
    };

    const subNavbarItems = ['Others', 'Stationery', 'Pet Supplies', 'Hobbies', 'Travel', 'Office', 'Hardware'];

    const fetchProducts = async () => {
        try {
            // Fetch products from categories under "Others" (ID 45)
            const response = await API.get('/products', { params: { category_id: 45, limit: 12 } });
            setProducts(response.data.products || []);
        } catch (error) {
            console.error('Error fetching others products:', error);
        } finally {
            setLoading(false);
        }
    };

    const scrollLeft = () => {
        const container = document.getElementById('collection-scroll');
        container.scrollBy({ left: -320, behavior: 'smooth' });
    };

    const scrollRight = () => {
        const container = document.getElementById('collection-scroll');
        container.scrollBy({ left: 320, behavior: 'smooth' });
    };

    const icons = {
        RotateCcw: <RotateCcw size={22} />,
        Truck: <Truck size={22} />,
        ShieldCheck: <ShieldCheck size={22} />,
        Headphones: <Headphones size={22} />
    };

    return (
        <div className="bg-[#fdfaf5] min-h-screen pt-[100px] md:pt-[120px] pb-24 page-transition font-sans relative">
            {/* Paper Texture Overlay */}


            {/* SUB-NAVBAR CATEGORIES */}
            <div className="bg-white border-b sticky top-[64px] md:top-[72px] lg:top-[120px] z-50 overflow-x-auto whitespace-nowrap no-scrollbar shadow-sm transition-all duration-300">
                <div className="max-w-[1440px] mx-auto flex items-center h-12 md:h-14 px-4 md:px-6 gap-6 md:gap-8">
                    <button 
                        onClick={() => { setActiveSubId(null); navigate('/others'); }} 
                        className={`text-[10px] md:text-[12px] font-black uppercase h-full border-b-2 transition-all ${activeSubId === null ? 'text-[#5D6B60] border-[#5D6B60]' : 'text-gray-400 border-transparent hover:text-[#5D6B60]'}`}
                    >
                        Others
                    </button>
                    {subNavbarItems.filter(item => item !== 'Others').map((item) => (
                        <button 
                            key={item} 
                            onClick={() => {
                                const found = subCategories.find(c => c.name.toLowerCase().includes(item.toLowerCase()));
                                if (found) {
                                    navigate(`/products?category_id=${found.id}`);
                                } else {
                                    navigate(`/products?search=${item.toLowerCase()}`);
                                }
                            }}
                            className={`text-[9px] md:text-[11px] font-bold uppercase transition-all h-full border-b-2 text-gray-500 border-transparent hover:text-[#5D6B60]`}
                        >
                            {item}
                        </button>
                    ))}
                </div>
            </div>

            {/* BREADCRUMBS */}
            <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-12 py-2 flex items-center gap-2 text-[10px] md:text-[11px] text-[#5D6B60] font-bold uppercase tracking-wider overflow-x-auto no-scrollbar whitespace-nowrap">
                <Link to="/" className="hover:underline">Home</Link>
                <ChevronRight size={10} strokeWidth={4} className="mt-[1px] flex-shrink-0" />
                <span>Others</span>
            </div>

            {/* CINEMATIC HERO */}
            <section className="mb-12 md:mb-16 w-full animate-reveal relative group px-0 md:px-6 lg:px-0">
                <div className="relative h-[40vh] md:h-[50vh] min-h-[350px] md:min-h-[450px] w-full overflow-hidden shadow-sm md:rounded-3xl lg:rounded-none border-b border-white bg-white">
                    
                    {/* Background Image */}
                    <div 
                        className="absolute inset-0 w-full bg-cover bg-center transition-transform duration-[6000ms] group-hover:scale-110 ease-out"
                        style={{ backgroundImage: `url(${OthersData.hero.image})` }}
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#fdfaf5] via-[#fdfaf5]/90 md:via-[#fdfaf5]/80 to-transparent z-10" />

                    {/* Content Layer */}
                    <div className="relative z-20 h-full flex flex-col justify-center px-6 md:px-12 lg:px-24 max-w-[1440px] mx-auto space-y-4 md:space-y-6">
                        <div className="space-y-2 md:space-y-4 text-left">
                            <h1 className="text-4xl sm:text-6xl lg:text-8xl font-black text-[#2d231b] tracking-tight leading-[0.9]">
                                <span className="text-[#5D6B60]">Curated</span> & Essentials
                            </h1>
                            <p className="text-sm md:text-xl lg:text-2xl font-bold text-slate-600 tracking-tight leading-relaxed max-w-lg mb-4 md:mb-8 uppercase">
                                {OthersData.hero.subtitle}
                            </p>
                            <div className="hidden sm:flex flex-wrap gap-2 md:gap-4 pt-2">
                                {OthersData.hero.bullets.map((bullet, i) => (
                                    <div key={i} className="bg-white/80 backdrop-blur-md px-3 md:px-4 py-1.5 rounded-full border border-[#5D6B60]/20 text-[8px] md:text-[10px] font-black uppercase tracking-widest text-[#5D6B60]">
                                        {bullet}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-10 pt-2 md:pt-4">
                            <button 
                                onClick={() => navigate('/products?category_id=45')} 
                                className="bg-[#5D6B60] hover:bg-[#4A574D] text-white px-8 md:px-12 py-3 md:py-4 rounded-md font-black text-[10px] md:text-xs transition-all shadow-lg active:scale-95 uppercase tracking-widest"
                            >
                                Shop Now &rarr;
                            </button>
                            <button className="text-[#2d231b] hover:text-[#5D6B60] font-black text-[10px] md:text-xs transition-all uppercase tracking-widest flex items-center gap-2 group/btn">
                                Explore Deals <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* SHOP BY CATEGORY (Premium White Card Grid) */}
            <section className="bg-gray-50/50 py-16 md:py-24 mb-12 md:mb-20 animate-reveal stagger-1">
                <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-12">
                    <div className="flex items-center justify-between mb-12 border-b border-gray-200/50 pb-6">
                        <h2 className="text-2xl md:text-3xl font-black text-slate-800 uppercase tracking-tight">Shop by Essentials</h2>
                        <button onClick={() => navigate('/products')} className="text-[10px] md:text-[12px] font-black uppercase tracking-widest text-[#5D6B60] border-2 border-[#5D6B60]/20 px-6 py-3 rounded-full hover:bg-[#5D6B60] hover:text-white transition-all shadow-sm">
                            View All Categories
                        </button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">
                        {[
                            { name: "Stationery", img: "/assets/others/cat_stationery_luxury.png" },
                            { name: "Pet Supplies", img: "/assets/others/cat_pet_supplies_luxury.png" },
                            { name: "Gifts", img: "/assets/others/cat_hobbies_luxury.png" },
                            { name: "Travel", img: "/assets/others/cat_travel_luxury.png" },
                            { name: "Office", img: "/assets/others/cat_office_luxury.png" },
                            { name: "Hardware", img: "/assets/others/cat_tools_luxury.png" },
                            { name: "Art & Craft", img: "/assets/others/cat_hobbies_luxury.png" }
                        ].map((cat, i) => (
                            <div 
                                key={i} 
                                onClick={() => navigate(`/products?search=${cat.name.toLowerCase()}`)} 
                                className="flex flex-col items-center gap-6 group cursor-pointer"
                            >
                                <div className="w-full aspect-square bg-white rounded-[2rem] shadow-xl flex items-center justify-center border border-white p-6 transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl">
                                    <img 
                                        src={cat.img} 
                                        alt={cat.name} 
                                        className="max-h-full max-w-full object-contain filter drop-shadow-md group-hover:scale-110 transition-transform duration-500" 
                                    />
                                </div>
                                <span className="text-xs md:text-[11px] font-black uppercase text-gray-800 tracking-tight text-center leading-tight group-hover:text-[#5D6B60] transition-colors">
                                    {cat.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* LATEST COLLECTIONS SECTION */}
            <section className="mb-12 md:mb-24 w-full animate-reveal stagger-3">
                <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-12 flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 md:mb-10 border-b border-[#5D6B60]/20 pb-6 gap-6">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-black text-[#2d231b] leading-none mb-2">Latest Collections</h2>
                        <p className="text-[8px] md:text-[10px] font-black uppercase text-[#5D6B60] opacity-60 tracking-[0.2em] md:tracking-[0.3em]">Handpicked essentials for your home</p>
                    </div>
                    <div className="flex items-center justify-between w-full sm:w-auto gap-6">
                        <button onClick={() => navigate('/products')} className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-slate-400 border-b-2 border-transparent hover:border-slate-800 pb-1 transition-all">View All</button>
                        <div className="flex gap-2">
                            <button onClick={scrollLeft} className="p-2 md:p-3 bg-white/50 border border-stone-100 rounded-full text-slate-800 hover:bg-white hover:shadow-lg transition-all shadow-sm"><ChevronLeft size={18} md={20} /></button>
                            <button onClick={scrollRight} className="p-2 md:p-3 bg-white/50 border border-stone-100 rounded-full text-slate-800 hover:bg-white hover:shadow-lg transition-all shadow-sm"><ChevronRight size={18} md={20} /></button>
                        </div>
                    </div>
                </div>

                <div 
                    id="collection-scroll" 
                    className="flex gap-4 md:gap-8 overflow-x-auto no-scrollbar snap-x snap-mandatory px-4 md:px-6 lg:px-12 pb-8 md:pb-12"
                >
                    {loading ? (
                        [1,2,3,4].map(i => <div key={i} className="min-w-[240px] md:min-w-[280px] h-[300px] md:h-[350px] bg-stone-100 rounded-[24px] md:rounded-[32px] animate-pulse" />)
                    ) : products.length > 0 ? (
                        products.map(product => (
                            <CollectionCard key={product.id} product={product} />
                        ))
                    ) : (
                        <div className="w-full text-center py-12 md:py-20 bg-stone-50 rounded-[30px] md:rounded-[40px] border-2 border-dashed border-stone-200">
                             <ShoppingBag size={40} md={48} className="mx-auto text-stone-300 mb-4" />
                             <h3 className="text-lg md:text-xl font-black text-stone-400 uppercase tracking-widest">No Collections Found</h3>
                        </div>
                    )}
                </div>
            </section>

            {/* TRUST STRIP & TOP BRANDS */}
            <section className="bg-gradient-to-b from-white to-[#fdfaf5] py-12 md:py-20 px-4 md:px-6 lg:px-12 mb-12 md:mb-20 overflow-hidden">
                <div className="max-w-[1440px] mx-auto">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-12 md:mb-20 border-b border-[#5D6B60]/20 pb-12 md:pb-16">
                        {OthersData.trustBadges.map((badge, i) => (
                            <div key={i} className="flex flex-col items-center text-center gap-2 md:gap-3 group cursor-pointer hover:scale-105 transition-transform">
                                <div className="text-[#5D6B60] opacity-60 group-hover:opacity-100 transition-all duration-300 mb-1 md:mb-2">
                                    {icons[badge.icon]}
                                </div>
                                <div className="space-y-0.5 md:space-y-1">
                                    <h4 className="font-black text-[11px] md:text-[13px] text-[#2d231b] uppercase tracking-widest">{badge.title}</h4>
                                    <p className="text-[9px] md:text-[11px] text-slate-400 font-bold uppercase">{badge.sub}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* TOP BRANDS */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b border-gray-100 pb-4 gap-4 mt-12 md:mt-20">
                        <h2 className="text-xl md:text-2xl font-bold text-[#1e293b]">Top Brands</h2>
                    </div>
                    <div className="flex overflow-x-auto no-scrollbar gap-4 pb-4">
                        {OthersData.brands.map((brand, i) => (
                            <div key={i} className="bg-white border text-center border-gray-100 h-16 md:h-20 px-6 md:px-8 flex-shrink-0 rounded-xl flex items-center justify-center shadow-sm hover:shadow-md transition-all cursor-pointer group">
                                 <img src={brand.logo} alt={brand.name} className="h-6 md:h-10 opacity-60 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0 filter" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FOOTER CTA */}
            <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-12 text-center pb-12 md:pb-20 border-t border-stone-100 pt-12 md:pt-20">
                <button 
                  onClick={() => navigate('/products?category_id=45')}
                  className="bg-[#2d231b] hover:bg-[#5D6B60] text-white px-8 md:px-16 py-4 md:py-6 rounded-xl md:rounded-2xl font-black text-xs md:text-sm uppercase tracking-widest shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-2 md:gap-3 mx-auto"
                >
                    Browse Collection <ChevronRight size={20} />
                </button>
            </div>
        </div>
    );
};

export default Others;
