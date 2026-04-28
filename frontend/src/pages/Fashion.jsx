import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, ArrowRight, X, Heart, Sparkles, Truck, RotateCcw, Headphones } from 'lucide-react';
import API from '../api/axios';
import ProductCard from '../components/ProductCard';
import StyleGuideData from '../data/StyleGuideData';

const Fashion = () => {
    const [products, setProducts] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [activeSubId, setActiveSubId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedGuide, setSelectedGuide] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "KLYRO | Fashion";
        fetchMetadata();
    }, []);

    const fetchMetadata = async () => {
        try {
            const response = await API.get('/categories');
            const raw = response.data.categories || [];
            // Fashion ID is 8 based on research
            const root = raw.find(c => c.id === 8 || c.name.toLowerCase() === 'fashion');
            if (root) {
                const subCats = raw.filter(c => c.parent_id === root.id);
                setSubCategories(subCats);
            }
        } catch (error) {
            console.error('Fashion metadata fetch error:', error);
        }
    };

    const fetchProducts = async (subId) => {
        setLoading(true);
        try {
            const params = { limit: 4 };
            if (subId) params.category_id = subId;
            else params.category_id = 8; 
            
            const response = await API.get('/products', { params });
            if(response.data.products?.length > 0) {
                setProducts(response.data.products);
            } else {
                // Fallback for demo
                setProducts([
                    { id: 3001, name: "Women's Floral Maxi Dress", price: 1999, discount_price: 1399, image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=600", stock: 12 },
                    { id: 3002, name: "Premium Slim Fit Tan Blazer", price: 2999, discount_price: 2199, image: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=600", stock: 5 },
                    { id: 3003, name: "Fossil Rose Gold Watch", price: 6999, discount_price: 3499, image: "https://images.unsplash.com/photo-1558981359-219d6364c9c8?auto=format&fit=crop&q=80&w=600", stock: 20 },
                    { id: 3004, name: "Gold & Pearl Necklace Set", price: 4599, discount_price: 2299, image: "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&q=80&w=600", stock: 15 }
                ]);
            }
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
            name: 'Nike', 
            svg: <svg viewBox="0 0 100 40" className="h-full w-auto"><path d="M10 25 L35 25 L85 10 C 60 15, 30 22, 10 22 Z" fill="currentColor"/><text x="45" y="38" font-family="Arial Black, sans-serif" font-weight="900" font-size="11" text-anchor="middle" fill="currentColor">NIKE</text></svg> 
        },
        { 
            name: 'Adidas', 
            svg: <svg viewBox="0 0 100 40" className="h-full w-auto"><path d="M25 32 L35 32 L20 12 Z M40 32 L50 32 L35 7 Z M55 32 L65 32 L50 2 Z" fill="currentColor"/><text x="45" y="40" font-family="Arial Black, sans-serif" font-weight="900" font-size="7" text-anchor="middle" fill="currentColor">adidas</text></svg>
        },
        { 
            name: 'Puma', 
            svg: <svg viewBox="0 0 100 40" className="h-full w-auto"><path d="M75 10 C 80 5, 95 10, 95 25 C 85 20, 75 22, 70 15 C 65 20, 55 18, 50 10 C 60 15, 70 15, 75 10 Z" fill="currentColor"/><text x="25" y="32" font-family="Arial Black" font-weight="900" font-size="18" fill="currentColor">PUMA</text></svg>
        },
        { 
            name: 'Gucci', 
            svg: <svg viewBox="0 0 100 40" className="h-full w-auto"><text x="50" y="28" font-family="Optima, serif" font-weight="bold" font-size="22" text-anchor="middle" fill="currentColor" letter-spacing="5">GUCCI</text></svg>
        },
        { 
            name: 'Armani', 
            svg: <svg viewBox="0 0 100 40" className="h-full w-auto"><path d="M30 15 L70 15 L80 25 L50 22 L20 25 Z M45 10 L55 10 L55 14 L45 14 Z" fill="currentColor"/><text x="50" y="36" font-family="Times New Roman, serif" font-weight="bold" font-size="10" text-anchor="middle" fill="currentColor" letter-spacing="3">ARMANI</text></svg>
        },
        { 
            name: 'AX', 
            svg: <svg viewBox="0 0 100 40" className="h-full w-auto"><text x="50" y="28" font-family="Arial Black" font-weight="900" font-size="24" text-anchor="middle" fill="currentColor">A|X</text></svg>
        },
        { 
            name: 'H&M', 
            svg: <svg viewBox="0 0 100 40" className="h-full w-auto"><text x="50" y="28" font-family="Arial Black" font-weight="900" font-size="22" text-anchor="middle" fill="#cc0000">H&M</text></svg>
        },
        { 
            name: "Levi's", 
            svg: <svg viewBox="0 0 100 40" className="h-full w-auto"><path d="M10 5 L90 5 L90 30 Q50 38 10 30 Z" fill="#c41230"/><text x="50" y="24" font-family="Arial" font-weight="bold" font-size="16" text-anchor="middle" fill="white">LEVI'S</text></svg>
        }
    ];

    const subNavbarItems = ['Fashion', 'Women', 'Men', 'Footwear', 'Watches', 'Jewelry', 'Accessories'];

    return (
        <div className="bg-[#fff9fa] min-h-screen pt-[100px] md:pt-[112px] pb-24 page-transition font-sans">
            
            {/* SUB-NAVBAR CATEGORIES (Sticky and Rose Theme) */}
            <div className="bg-white border-b sticky top-[56px] md:top-[64px] lg:top-[112px] z-50 overflow-x-auto whitespace-nowrap no-scrollbar shadow-sm transition-all duration-300">
                <div className="max-w-[1440px] mx-auto flex items-center h-12 px-4 md:px-6 gap-6 md:gap-8">
                    <button onClick={() => { setActiveSubId(null); navigate('/fashion'); }} className={`text-[10px] md:text-[12px] font-black uppercase h-full border-b-2 transition-all ${activeSubId === null ? 'text-pink-600 border-pink-600' : 'text-gray-400 border-transparent hover:text-pink-600'}`}>Fashion</button>
                    {subNavbarItems.filter(item => item !== 'Fashion').map((item) => (
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
                            className={`text-[9px] md:text-[11px] font-bold uppercase transition-all h-full border-b-2 ${activeSubId && subCategories.find(c => c.id === activeSubId)?.name.toLowerCase().includes(item.toLowerCase()) ? 'text-pink-600 border-pink-600' : 'text-gray-500 border-transparent hover:text-pink-600'}`}
                        >
                            {item}
                        </button>
                    ))}
                </div>
            </div>

            {/* BREADCRUMBS */}
            <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-12 py-2 flex items-center gap-2 text-[10px] md:text-[11px] text-pink-600 font-bold uppercase tracking-wider overflow-x-auto no-scrollbar whitespace-nowrap">
                <Link to="/" className="hover:underline">Home</Link>
                <ChevronRight size={10} strokeWidth={4} className="mt-[1px] flex-shrink-0" />
                <span>Fashion</span>
            </div>

            {/* FULL-WIDTH CINEMATIC HERO */}
            <section className="mb-8 md:mb-16 w-full animate-reveal relative group px-0 md:px-6 lg:px-0">
                <div className="relative h-[40vh] md:h-[50vh] min-h-[350px] md:min-h-[450px] w-full overflow-hidden shadow-sm md:rounded-3xl lg:rounded-none border-b border-rose-50 bg-white">
                    
                    {/* Background Image */}
                    <div 
                        className="absolute inset-0 w-full bg-cover bg-center transition-transform duration-[6000ms] group-hover:scale-110 ease-out"
                        style={{ backgroundImage: `url(/assets/fashion_hero.webp)` }}
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#fdf2f8] via-[#fdf2f8]/90 md:via-[#fdf2f8]/80 to-transparent z-10" />

                    {/* Content Layer */}
                    <div className="relative z-20 h-full flex flex-col justify-center px-6 md:px-12 lg:px-24 max-w-[1440px] mx-auto space-y-4 md:space-y-6">

                        <div className="space-y-2 md:space-y-4">
                            <h1 className="text-4xl sm:text-6xl lg:text-8xl font-black text-[#4c0519] tracking-tight leading-[0.9]">
                                Fashion <span className="text-pink-600">Luxe</span>
                            </h1>
                            <p className="text-sm md:text-xl lg:text-2xl font-bold text-slate-600 tracking-tight leading-relaxed max-w-lg mb-4 md:mb-8 uppercase">
                                Modern Elegance for the Sophisticated Soul.
                            </p>
                            <div className="hidden sm:flex flex-wrap gap-2 md:gap-4 pt-2">
                                {['Latest Collections', 'Top Brands', 'Exclusive Offers', 'Designer Couture'].map((bullet, i) => (
                                    <div key={i} className="bg-white/80 backdrop-blur-md px-3 md:px-4 py-1.5 rounded-full border border-pink-100 text-[8px] md:text-[10px] font-black uppercase tracking-widest text-[#4c0519]">
                                        {bullet}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-10 pt-2 md:pt-4">
                            <button 
                                onClick={() => navigate('/products?category_id=8')} 
                                className="bg-rose-600 hover:bg-rose-700 text-white px-8 md:px-12 py-3 md:py-4 rounded-md font-black text-[10px] md:text-xs transition-all shadow-lg active:scale-95 uppercase tracking-widest"
                            >
                                Shop Collection &rarr;
                            </button>
                            <button 
                                onClick={() => navigate('/products?category_id=8&sort=popularity')}
                                className="text-[#4c0519] hover:text-rose-600 font-black text-[10px] md:text-xs transition-all uppercase tracking-widest flex items-center gap-2 group/btn"
                            >
                                New Arrivals <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* SHOP BY CATEGORY (Premium White Card Grid) */}
            <section className="bg-gray-50/50 py-16 md:py-24 mb-12 md:mb-20 animate-reveal stagger-1">
                <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-12">
                    <div className="flex items-center justify-between mb-12 border-b border-gray-200/50 pb-6">
                        <h2 className="text-2xl md:text-3xl font-black text-rose-900 uppercase tracking-tight">Shop by Collection</h2>
                        <button onClick={() => navigate('/products?category_id=8')} className="text-[10px] md:text-[12px] font-black uppercase tracking-widest text-[#4c0519] border-2 border-rose-200 px-6 py-3 rounded-full hover:bg-[#4c0519] hover:text-white transition-all shadow-sm">
                            View All Collections
                        </button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
                        {[
                            { name: "Men", img: "/assets/cat_men.png" },
                            { name: "Women", img: "/assets/cat_women.png" },
                            { name: "Footwear", img: "/assets/cat_footwear.png" },
                            { name: "Bags", img: "/assets/cat_bags.png" },
                            { name: "Jewellery", img: "/assets/cat_jewellery.png" },
                            { name: "Sportswear", img: "/assets/cat_sportswear.png" }
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
            <section className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-12 mb-12 md:mb-20 animate-reveal stagger-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    {/* Sale Banner */}
                    <div className="rounded-[30px] md:rounded-[40px] overflow-hidden relative shadow-xl group cursor-pointer h-[240px] md:h-[280px] bg-pink-100">
                        <img src="/assets/fashion_promo_1.png" alt="Mega Sale" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 opacity-90" />
                        <div className="absolute inset-0 bg-gradient-to-r from-pink-900/50 via-pink-900/20 to-transparent p-6 md:p-12 flex flex-col justify-center text-white">
                            <div className="space-y-1 mb-4 md:mb-6">
                                <p className="text-sm md:text-lg font-bold tracking-[0.2em] uppercase opacity-90">Mega Fashion Sale</p>
                                <h3 className="text-3xl md:text-5xl font-black flex items-baseline gap-2">UP TO <span className="text-yellow-300 text-4xl md:text-6xl">50%</span> OFF</h3>
                            </div>
                            <button className="bg-white text-pink-900 px-6 md:px-8 py-2.5 md:py-3 rounded-xl font-black text-[10px] md:text-[12px] w-fit transition-all uppercase tracking-widest shadow-lg hover:bg-pink-900 hover:text-white">
                                Hot Styles & Trends
                            </button>
                        </div>
                    </div>
                    
                    {/* Offer Zone */}
                    <div className="rounded-[30px] md:rounded-[40px] overflow-hidden relative shadow-lg group cursor-pointer h-[240px] md:h-[280px] bg-[#fff1f2] border border-pink-100">
                        <div className="absolute top-0 right-0 w-1/2 h-full p-6 md:p-8 flex items-center justify-center">
                             <img src="https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=300" alt="Accessory" className="w-full h-full object-contain filter drop-shadow-xl group-hover:rotate-6 transition-transform duration-700" />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-[#fff1f2] via-[#fff1f2]/90 to-transparent p-6 md:p-12 flex flex-col justify-center text-[#9f1239]">
                            <div className="space-y-1 md:space-y-2 mb-4 md:mb-6">
                                <h3 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">Offer Zone</h3>
                                <p className="text-xs md:text-lg font-bold opacity-70">Extra 10% OFF | Bank Offers</p>
                                <p className="text-sm md:text-xl font-black mt-2">From ₹799 Only</p>
                            </div>
                            <div className="flex gap-2 flex-wrap max-w-[150px] md:max-w-[200px]">
                                {['HDFC', 'SBI', 'ICICI', 'AXIS'].map(bank => (
                                    <div key={bank} className="bg-pink-900/10 border border-pink-900/20 text-[8px] font-black px-2 md:px-3 py-1 rounded-sm tracking-tighter">{bank} BANK</div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* TOP SELLERS */}
            <section className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-12 mb-12 md:mb-20 animate-reveal stagger-2">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 md:mb-10 border-b border-pink-100 pb-4 gap-4">
                    <h2 className="text-xl md:text-2xl font-bold text-slate-800">Top Sellers in Fashion</h2>
                    <button onClick={() => navigate('/products?category_id=8')} className="text-[9px] md:text-[11px] font-semibold uppercase tracking-widest text-pink-600 border border-pink-100 px-6 py-2.5 rounded-full hover:bg-pink-50 transition-colors">
                        View All Products &rsaquo;
                    </button>
                </div>
                
                {loading ? (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                        {[1,2,3,4].map(i => <div key={i} className="aspect-[3/4] bg-pink-50/50 rounded-3xl animate-pulse" />)}
                    </div>
                ) : products.length > 0 && (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                        {products.map((product) => (
                             <div key={product.id} className="bg-white rounded-[24px] md:rounded-[32px] p-4 md:p-6 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col border border-pink-50 h-full group">
                                <div className="h-48 md:h-64 flex items-center justify-center mb-4 md:mb-6 relative z-0 overflow-hidden rounded-xl md:rounded-2xl bg-pink-50/30">
                                    <img src={product.image} alt={product.name} className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-700" />
                                    <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-md rounded-full text-pink-400 hover:text-pink-600 transition-colors shadow-sm opacity-100 sm:opacity-0 sm:group-hover:opacity-100 translate-y-0 sm:translate-y-2 sm:group-hover:translate-y-0 duration-300">
                                        <Heart size={16} md={18} />
                                    </button>
                                </div>
                                <div className="flex flex-col flex-grow text-center">
                                    <h4 className="font-bold text-slate-700 text-sm md:text-base leading-tight mb-2 md:mb-3 line-clamp-2">{product.name}</h4>
                                    <div className="flex items-center justify-center gap-2 md:gap-3 mb-4 md:mb-6">
                                        <span className="text-pink-600 font-black text-lg md:text-xl">₹{product.discount_price || product.price}</span>
                                        {product.discount_price && <span className="text-[10px] md:text-xs text-slate-300 line-through font-bold italic">₹{product.price}</span>}
                                    </div>
                                    <button className="w-full bg-slate-900 text-white py-3 md:py-4 rounded-xl md:rounded-2xl font-black text-[10px] md:text-[12px] uppercase tracking-widest mt-auto shadow-md hover:bg-pink-600 transition-all active:scale-95 duration-200">Add to Cart</button>
                                </div>
                             </div>
                        ))}
                    </div>
                )}
            </section>

            {/* VALUE STRIP */}
            <section className="bg-gradient-to-b from-white to-[#fff1f2] py-12 md:py-20 px-4 md:px-6 lg:px-12 mb-12 md:mb-20 overflow-hidden">
                <div className="max-w-[1440px] mx-auto">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-12 md:mb-20 border-b border-pink-100 pb-12 md:pb-16">
                        {[
                            { title: 'Style Tips & Guides', sub: 'Top Expert Advice', icon: <Sparkles size={24} />, guide: StyleGuideData[0] },
                            { title: 'Fast Delivery', sub: 'On Orders above ₹499', icon: <Truck size={24} /> },
                            { title: 'Easy Returns', sub: 'Hassle-Free Policy', icon: <RotateCcw size={24} /> },
                            { title: '24/7 Service', sub: 'Quality Support', icon: <Headphones size={24} /> }
                        ].map((item, i) => (
                            <div key={i} onClick={() => item.guide && setSelectedGuide(item.guide)} className={`flex flex-col items-center text-center gap-2 md:gap-3 group cursor-pointer ${item.guide ? 'hover:scale-105 transition-transform' : ''}`}>
                                <div className="text-pink-300 group-hover:text-pink-600 transition-all duration-300 mb-1 lg:mb-2">
                                    {item.icon}
                                </div>
                                <div className="space-y-1">
                                    <h4 className="font-black text-[10px] md:text-[13px] text-pink-900 uppercase tracking-widest">{item.title}</h4>
                                    <p className="text-[8px] md:text-[11px] text-slate-400 font-bold uppercase">{item.sub}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* TOP BRANDS */}
                    <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                        <h2 className="text-xl md:text-2xl font-bold text-[#1e293b]">Top Brands</h2>
                    </div>
                    <div className="flex overflow-x-auto no-scrollbar gap-4 pb-4">
                        {brands.map((brand, i) => (
                            <div key={i} className="bg-white border text-center border-gray-100 h-16 md:h-20 w-28 md:w-32 lg:w-40 flex-shrink-0 rounded-xl flex items-center justify-center p-3 md:p-4 shadow-sm hover:shadow-md hover:border-blue-100 transition-all cursor-pointer group">
                                 <div className="filter opacity-60 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0 h-6 md:h-8 lg:h-10 flex items-center justify-center scale-75 md:scale-90 lg:scale-100">
                                    {brand.svg}
                                 </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* STYLE GUIDE MODAL */}
            {selectedGuide && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-pink-900/40 backdrop-blur-md transition-opacity" onClick={() => setSelectedGuide(null)} />
                    <div className="bg-white rounded-[32px] md:rounded-[48px] w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col relative z-10 shadow-3xl animate-reveal border border-white">
                        <div className="p-6 md:p-10 border-b border-pink-50 bg-pink-50/50 flex justify-between items-start">
                            <div className="pr-10">
                                <h2 className="text-xl md:text-3xl font-black text-pink-900 mb-1 md:mb-2">{selectedGuide.title}</h2>
                                <p className="text-pink-500 font-bold text-xs md:text-sm tracking-widest uppercase italic">{selectedGuide.subtitle}</p>
                            </div>
                            <button onClick={() => setSelectedGuide(null)} className="p-2 bg-white rounded-full text-pink-300 hover:text-pink-600 transition-colors shadow-sm border border-pink-100 flex-shrink-0"><X size={20} /></button>
                        </div>
                        <div className="p-6 md:p-10 overflow-y-auto no-scrollbar bg-white">
                            <div className="prose prose-pink prose-sm md:prose-base max-w-none">
                                {selectedGuide.content.split('\n\n').map((paragraph, idx) => {
                                    if(paragraph.startsWith('###')) {
                                        return <h3 key={idx} className="text-lg md:text-xl font-black mt-6 md:mt-10 mb-3 md:mb-5 border-l-4 md:border-l-8 border-pink-500 pl-4 leading-tight text-pink-900 uppercase tracking-tight">{paragraph.replace('###', '').trim()}</h3>
                                    }
                                    return <p key={idx} className="mb-4 md:mb-6 text-sm md:text-[16px] leading-relaxed text-slate-600 font-medium">{paragraph}</p>
                                })}
                            </div>
                        </div>
                        <div className="p-6 md:p-8 border-t border-pink-50 bg-pink-50/50 flex justify-end">
                            <button onClick={() => setSelectedGuide(null)} className="bg-pink-900 text-white px-8 md:px-10 py-3 md:py-4 rounded-full font-black uppercase tracking-widest hover:bg-pink-600 transition-colors shadow-xl active:scale-95 duration-200 text-[10px] md:text-xs">Close Guide</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Fashion;
