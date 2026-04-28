import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ChevronRight, ArrowRight, Heart, Sparkles, ShieldCheck, Truck, Award, Headphones, X, Zap, RefreshCw, Star } from 'lucide-react';
import API from '../api/axios';
import ProductCard from '../components/ProductCard';

const BooksEducation = () => {
    const [products, setProducts] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [activeSubId, setActiveSubId] = useState(null);
    const [activeTab, setActiveTab] = useState('All');
    const [loading, setLoading] = useState(true);
    const [rootCategoryId, setRootCategoryId] = useState(null);
    const navigate = useNavigate();
    const publishers = [
        { name: 'Penguin', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/d/d3/Penguin_logo.svg/1200px-Penguin_logo.svg.png' },
        { name: 'HarperCollins', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/41/HarperCollins_%282013%29.svg' },
        { name: 'Oxford', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Oxford_University_Press_logo.svg/1280px-Oxford_University_Press_logo.svg.png' },
        { name: 'Pearson', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Pearson_logo.svg/1200px-Pearson_logo.svg.png' },
        { name: 'Scholastic', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Scholastic_logo.svg/1200px-Scholastic_logo.svg.png' }
    ];

    useEffect(() => {
        document.title = "KLYRO | Books & Education Store";
        fetchMetadata();
    }, []);

    const fetchMetadata = async () => {
        try {
            const catResponse = await API.get('/categories');
            const allCats = catResponse.data.categories || [];
            const root = allCats.find(c => c.name === "Books & Education");
            if (root) {
                setRootCategoryId(root.id);
                setSubCategories(allCats.filter(c => c.parent_id === root.id));
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchProducts = async (subId) => {
        setLoading(true);
        try {
            const prodResponse = await API.get('/products');
            const allProds = prodResponse.data.products || [];
            
            // If no subId, show all from root
            if (!subId) {
                const bookIds = [rootCategoryId, ...subCategories.map(c => c.id)];
                setProducts(allProds.filter(p => bookIds.includes(p.category_id)));
            } else {
                setProducts(allProds.filter(p => p.category_id === subId));
            }
            
            setLoading(false);
        } catch (error) {
            console.error('Error fetching books:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (rootCategoryId) {
            fetchProducts(activeSubId);
        }
    }, [rootCategoryId, activeSubId]);

    return (
        <div className="bg-[#fcfdfd] min-h-screen pt-[100px] md:pt-[112px] pb-24 page-transition">
            
            {/* SUB-NAVBAR CATEGORIES (Sticky Academic Theme) */}
            <div className="bg-white border-b sticky top-[56px] md:top-[64px] lg:top-[112px] z-50 overflow-x-auto whitespace-nowrap no-scrollbar shadow-sm transition-all duration-300">
                <div className="max-w-[1440px] mx-auto flex items-center h-12 px-4 md:px-6 gap-6 md:gap-8">
                    <button 
                        onClick={() => { setActiveSubId(null); navigate('/books-education'); }} 
                        className={`text-[10px] md:text-[12px] font-black uppercase h-full border-b-2 transition-all ${activeSubId === null ? 'text-[#F37021] border-[#F37021]' : 'text-gray-400 border-transparent hover:text-[#F37021]'}`}
                    >
                        Books & Education
                    </button>
                    {subCategories.map(cat => (
                        <button 
                            key={cat.id} 
                            onClick={() => {
                                setActiveSubId(cat.id);
                                navigate(`/products?category_id=${cat.id}`);
                            }}
                            className={`text-[9px] md:text-[11px] font-bold uppercase transition-all h-full border-b-2 ${activeSubId === cat.id ? 'text-[#F37021] border-[#F37021]' : 'text-gray-500 border-transparent hover:text-[#F37021] hover:border-[#F37021]'}`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* BREADCRUMBS */}
            <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-12 py-2 flex items-center gap-2 text-[10px] md:text-[11px] text-[#F37021] font-bold uppercase tracking-wider overflow-x-auto no-scrollbar whitespace-nowrap">
                <Link to="/" className="hover:underline">Home</Link>
                <ChevronRight size={10} strokeWidth={4} className="mt-[1px] flex-shrink-0" />
                <span>Books & Education</span>
            </div>

            {/* FULL-WIDTH CINEMATIC HERO */}
            <section className="mb-8 md:mb-16 w-full animate-reveal relative group px-0 md:px-6 lg:px-0">
                <div className="relative h-[40vh] md:h-[50vh] min-h-[350px] md:min-h-[450px] w-full overflow-hidden shadow-sm md:rounded-3xl lg:rounded-none border-b border-orange-50 bg-white">
                    
                    {/* Background Image */}
                    <div 
                        className="absolute inset-0 w-full bg-cover bg-center transition-transform duration-[6000ms] group-hover:scale-110 ease-out"
                        style={{ backgroundImage: `url(/assets/books_hero_v2.png)` }}
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#FFF8F0] via-[#FFF8F0]/90 md:via-[#FFF8F0]/80 to-transparent z-10" />

                    {/* Content Layer */}
                    <div className="relative z-20 h-full flex flex-col justify-center px-6 md:px-12 lg:px-24 max-w-[1440px] mx-auto space-y-4 md:space-y-6">

                        <div className="space-y-2 md:space-y-4">
                            <h1 className="text-4xl sm:text-6xl lg:text-8xl font-black text-[#4a2c2a] tracking-tight leading-[0.9]">
                                Books <span className="text-[#F37021]">Education</span>
                            </h1>
                            <p className="text-sm md:text-xl lg:text-2xl font-bold text-slate-600 tracking-tight leading-relaxed max-w-lg mb-4 md:mb-8 uppercase">
                                Unlock Knowledge. Build Your Future.
                            </p>
                            <div className="hidden sm:flex flex-wrap gap-2 md:gap-4 pt-2">
                                {['Academic Excellence', 'Novel Bestsellers', 'Premium Stationery', 'Global Publishers'].map((bullet, i) => (
                                    <div key={i} className="bg-white/80 backdrop-blur-md px-3 md:px-4 py-1.5 rounded-full border border-orange-100 text-[8px] md:text-[10px] font-black uppercase tracking-widest text-[#4a2c2a]">
                                        {bullet}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-10 pt-2 md:pt-4">
                            <button 
                                onClick={() => navigate('/products?category_id=14')} 
                                className="bg-[#F37021] hover:bg-[#e05d1a] text-white px-8 md:px-12 py-3 md:py-4 rounded-md font-black text-[10px] md:text-xs transition-all shadow-lg active:scale-95 uppercase tracking-widest"
                            >
                                Shop Wisdom &rarr;
                            </button>
                            <button 
                                onClick={() => navigate('/products?category_id=14&sort=popularity')}
                                className="text-[#4a2c2a] hover:text-[#F37021] font-black text-[10px] md:text-xs transition-all uppercase tracking-widest flex items-center gap-2 group/btn"
                            >
                                New Arrivals <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
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
                            className="text-[10px] md:text-[12px] font-black uppercase tracking-widest text-[#F37021] border-2 border-orange-100 px-6 py-3 rounded-full hover:bg-[#F37021] hover:text-white transition-all shadow-sm"
                        >
                            View All Categories
                        </button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
                        {[
                            { name: "Academic", img: "/assets/kids/cat_learning.png" },
                            { name: "Literature", img: "/assets/others/cat_office_luxury.png" },
                            { name: "Stationery", img: "/assets/others/cat_stationery_luxury.png" },
                            { name: "Hobbies", img: "/assets/others/cat_hobbies_luxury.png" },
                            { name: "Learning", img: "/assets/kids/cat_learning.png" }
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
                                <span className="text-xs md:text-sm font-black uppercase text-gray-800 tracking-tight text-center leading-tight group-hover:text-[#F37021] transition-colors">
                                    {cat.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* BESTSELLERS */}
            <section id="products-grid" className="max-w-[1440px] mx-auto px-4 md:px-6 mb-12 md:mb-24">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 md:mb-12 border-b border-gray-100 pb-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-6">
                        <h2 className="text-xl md:text-3xl font-black text-[#2d3748] tracking-tighter whitespace-nowrap">Top Sellers</h2>
                        <div className="flex bg-gray-100 p-1 rounded-full overflow-x-auto no-scrollbar gap-1 max-w-full">
                            {['All', 'Academic', 'Novels'].map((tab, idx) => (
                                <button 
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-4 md:px-5 py-1 md:py-1.5 rounded-full text-[9px] md:text-[11px] font-black uppercase transition-all whitespace-nowrap ${activeTab === tab ? 'bg-white text-[#F37021] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>
                    <button className="text-[9px] md:text-[11px] font-semibold uppercase tracking-widest text-gray-400 border border-gray-200 px-4 md:px-5 py-2 rounded-full hover:bg-gray-50 transition-colors whitespace-nowrap">
                        View All Books &rsaquo;
                    </button>
                </div>

                {loading ? (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                        {[1,2,3,4].map(i => <div key={i} className="aspect-[3/4] bg-gray-50 rounded-[24px] md:rounded-[40px] animate-pulse" />)}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                        {products
                            .filter(p => activeTab === 'All' || p.category_id === (activeTab === 'Academic' ? products.find(prod => prod.name.includes('Aptitude'))?.category_id : products.find(prod => prod.name.includes('Rich Dad'))?.category_id))
                            .slice(0, 8)
                            .map((product, i) => (
                                <div key={product.id} className="animate-reveal" style={{ animationDelay: `${i*0.1}s` }}>
                                    <ProductCard product={product} v2 index={i} />
                                </div>
                        ))}
                    </div>
                )}
                
                <div className="flex justify-center mt-8 md:mt-12">
                    <button 
                        onClick={() => {
                            setActiveSubId(null);
                            setActiveTab('All');
                            document.getElementById('products-grid')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="bg-white border-2 border-gray-100 text-[#F37021] px-8 md:px-12 py-3 md:py-4 rounded-full font-black uppercase text-[10px] md:text-[11px] tracking-widest hover:border-[#F37021] transition-all flex items-center gap-2 md:gap-3"
                    >
                        View More Books <ChevronRight size={16} />
                    </button>
                </div>
            </section>

            {/* PROMO STRIP */}
            <section className="max-w-[1440px] mx-auto px-4 md:px-6 mb-12 md:mb-24">
                <div className="bg-[#EBF5FF] p-6 md:p-8 rounded-[24px] md:rounded-[30px] flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 border border-blue-100">
                    <div className="flex items-center gap-4 md:gap-6">
                        <div className="bg-white p-3 md:p-4 rounded-xl md:rounded-2xl shadow-sm text-yellow-500 flex-shrink-0"><Zap size={24} className="fill-current" /></div>
                        <div>
                            <h3 className="font-black text-lg md:text-xl text-blue-900 uppercase italic leading-none">FREE Health Checkup</h3>
                            <p className="text-xs md:text-sm font-bold text-blue-500 mt-1">Orders above ₹399</p>
                        </div>
                    </div>
                    <button className="w-full md:w-auto bg-[#F37021] text-white px-8 md:px-10 py-2.5 md:py-3 rounded-full font-black uppercase text-[10px] md:text-[11px] shadow-lg shadow-orange-100 hover:scale-105 transition-all flex items-center justify-center gap-2 md:gap-3">Shop Now <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-white animate-ping" /></button>
                </div>
            </section>

            {/* TOP BRANDS */}
            <section className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-12 mb-12 md:mb-20">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b border-gray-100 pb-4 gap-4">
                    <h2 className="text-xl md:text-2xl font-bold text-[#1e293b]">Top Publishers</h2>
                </div>
                <div className="flex overflow-x-auto no-scrollbar gap-4 pb-4">
                    {publishers.map((brand, i) => (
                        <div key={i} className="bg-white border text-center border-gray-100 h-16 md:h-20 px-6 md:px-8 flex-shrink-0 rounded-xl flex items-center justify-center shadow-sm hover:shadow-md hover:border-blue-100 transition-all cursor-pointer group">
                             <img src={brand.logo} alt={brand.name} className="h-6 md:h-10 opacity-60 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0 filter" />
                        </div>
                    ))}
                </div>
            </section>

            {/* FOOTER VALUES */}
            <section className="max-w-[1440px] mx-auto px-4 md:px-6 border-t pt-12 md:pt-20 pb-8">
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 md:gap-12">
                    {[
                        { icon: <ShieldCheck size={32} md={40} />, title: 'Wide Selection', sub: '7.5L+ titles' },
                        { icon: <Zap size={32} md={40} />, title: 'Fast Delivery', sub: 'Express shipping' },
                        { icon: <RefreshCw size={32} md={40} />, title: 'Easy Returns', sub: 'Friction-less policy' },
                        { icon: <ShieldCheck size={32} md={40} />, title: 'Reliable Care', sub: '24/7 dedicated line' },
                        { icon: <Star size={32} md={40} />, title: 'Expert Desk', sub: 'Instant resolution' }
                    ].map((item, i) => (
                        <div key={i} className="flex flex-col items-center text-center space-y-2 md:space-y-4 group">
                            <div className="text-[#F37021] opacity-30 group-hover:opacity-100 transition-all transform group-hover:-translate-y-1">{item.icon}</div>
                            <div className="space-y-0.5 md:space-y-1">
                                <h4 className="font-black text-[10px] uppercase tracking-widest leading-tight">{item.title}</h4>
                                <p className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-tighter opacity-80">{item.sub}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default BooksEducation;
