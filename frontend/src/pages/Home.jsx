import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import ProductCard from '../components/ProductCard';
import { ArrowRight, Zap, ShieldCheck, Truck, Car, Sparkles, BookOpen, ShoppingBasket, Home as HomeIcon, Dumbbell, Tv, Shirt, Baby, LayoutGrid } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [activeTab, setActiveTab] = useState('All Products');
    const [activeCategoryId, setActiveCategoryId] = useState(null);
    const [loading, setLoading] = useState(false);

    // Categories mapping from DB (Source of Truth)


    const slides = [
        {
            image: '/assets/digital_lifestyle_v3.webp',
            subtitle: 'New Arrivals 2026',
            title: 'Modern Digital Lifestyle',
            accent: 'bg-primary-color',
            id: 1
        },
        {
            image: '/assets/fashion_hero.webp',
            subtitle: 'Luxury Trends',
            title: 'High-End Fashion Collection',
            accent: 'bg-accent-color',
            id: 2
        },

        {
            image: '/assets/grocery_hero.webp',
            subtitle: 'Fresh & Organic',
            title: 'Premium Grocery Essentials',
            accent: 'bg-primary-color',
            id: 7
        },
        {
            image: '/books_hero_premium.png',
            subtitle: 'Academic Excellence',
            title: 'Premium Books & Education',
            accent: 'bg-[#F37021]',
            id: 49
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => setCurrentSlide(prev => (prev + 1) % slides.length), 8000);
        return () => clearInterval(timer);
    }, [slides.length]);

    const fetchProducts = async (catId) => {
        setLoading(true);
        try {
            const params = { limit: 8, sort: 'popular' };
            if (catId) params.category_id = catId;
            const response = await API.get('/products', { params });
            setProducts(response.data.products || []);
        } catch (error) {
            console.error('Home product fetch error:', error);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts(activeCategoryId);
    }, [activeCategoryId]);

    const homeCategories = [
        { name: 'Electronics', img: '/assets/electronics.webp', icon: Tv, id: 1, path: '/electronics' },
        { name: 'Fashion', img: '/assets/fashion.webp', icon: Shirt, id: 8, path: '/fashion' },
        { name: 'Home & Living', img: '/assets/home_living.webp', icon: HomeIcon, id: 16, path: '/home-living' },
        { name: 'Beauty & Health', img: '/assets/beauty_health_hero.webp', icon: Sparkles, id: 21, path: '/beauty-health' },
        { name: 'Sports & Fitness', img: '/assets/sports.webp', icon: Dumbbell, id: 34, path: '/sports-fitness' },
        { name: 'Books & Education', img: '/books_hero_premium.png', icon: BookOpen, id: 49, path: '/books-education' },
        { name: 'Automotive', img: '/assets/auto_hero_v2.png', icon: Car, id: 46, path: '/automotive' },
        { name: 'Grocery', img: '/assets/grocery_hero.webp', icon: ShoppingBasket, id: 38, path: '/grocery' },
        { name: 'Kids & Baby', img: '/assets/cat_kids.png', icon: Baby, id: 42, path: '/kids-baby' },
        { name: 'Others', img: '/assets/others/cat_stationery_luxury.png', icon: LayoutGrid, id: 53, path: '/others' }
    ];

    const mobileCategoryIcons = homeCategories.slice(0, 6);

    return (
        <div className="bg-white min-h-screen pt-[64px] md:pt-[120px] pb-32 md:pb-24 page-transition overflow-x-hidden">
            
            {/* MOBILE ONLY: Premium Hero Section (Overlay Style) */}
            <div className="md:hidden relative w-full h-[460px] overflow-hidden">
                <img 
                    src="/assets/home_collage_premium.png" 
                    className="w-full h-full object-cover" 
                    alt="Hero Collage" 
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60 flex flex-col items-center justify-start pt-16 px-6 text-center">
                    <h1 className="text-white text-3xl font-black uppercase tracking-tight drop-shadow-2xl animate-reveal-down">
                        Welcome to KLYRO
                    </h1>
                    <p className="text-white/80 text-[11px] font-bold uppercase tracking-[0.2em] mt-3 drop-shadow-lg">
                        Discover our premium online<br/>marketplace
                    </p>
                </div>
            </div>

            {/* DESKTOP ONLY: Hero Slider */}
            <section className="hidden md:block w-full mb-12 md:mb-24 relative overflow-hidden h-[450px] md:h-[calc(100vh-120px)] group animation-reveal">
                {slides.map((slide, index) => (
                    <div 
                        key={index}
                        className={`absolute inset-0 transition-all duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent z-10" />
                        <img src={slide.image} alt="Hero" className="w-full h-full object-cover" />
                        <div className="absolute top-1/2 -translate-y-1/2 left-6 sm:left-12 md:left-24 z-20 space-y-4 md:space-y-6 max-w-[90%] md:max-w-2xl">
                            <span className={`${slide.accent} text-white px-3 py-1 text-[10px] md:text-[11px] font-black uppercase tracking-widest rounded-full`}>{slide.subtitle}</span>
                            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight drop-shadow-lg animate-reveal">
                                {slide.title.split(' ').map((w,i)=> i===2 ? <span key={i} className="text-white bg-accent-color px-2 md:px-4 py-0 md:py-1 inline-block -rotate-1 shadow-xl">{w}</span> : w+' ')}
                            </h1>
                            <Link 
                                to={
                                    slide.title.toLowerCase().includes('beauty') ? '/beauty-health' : 
                                    slide.title.toLowerCase().includes('books') ? '/books-education' : 
                                    slide.title.toLowerCase().includes('fitness') ? '/sports-fitness' : 
                                    `/products?category_id=${slide.id}`
                                } 
                                className="inline-flex items-center gap-2 md:gap-4 bg-white text-text-color px-6 md:px-10 py-3 md:py-4 rounded-full font-bold uppercase tracking-widest text-[11px] md:text-sm hover:bg-accent-color hover:text-white transition-all shadow-xl"
                            >
                                Explore Now <ArrowRight size={18} />
                            </Link>
                        </div>
                    </div>
                ))}
            </section>

            {/* MOBILE ONLY: Refined Trust Markers (List Style) */}
            <section className="md:hidden bg-white px-2 mb-12">
                <div className="flex flex-col">
                    {[
                        { text: 'Shop Top Brands', id: 1 },
                        { text: 'Exclusive Deals', id: 2 },
                        { text: 'Fast & Free Shipping', id: 3 }
                    ].map((item, idx) => (
                        <div 
                            key={item.id} 
                            className={`flex items-center gap-4 px-10 py-5 ${idx !== 2 ? 'border-b border-gray-100' : ''}`}
                        >
                            <div className="w-6 h-6 rounded-full bg-[#2b5a9a] flex items-center justify-center shadow-lg shadow-blue-500/20">
                                <ShieldCheck size={12} className="text-white" strokeWidth={3} />
                            </div>
                            <span className="text-[15px] font-bold text-gray-800 tracking-tight">
                                {item.text}
                            </span>
                        </div>
                    ))}
                </div>
            </section>

            {/* MOBILE ONLY: Premium Icon Category Grid */}
            <section className="md:hidden bg-gray-50/80 px-4 py-16 mb-12">
                <div className="grid grid-cols-3 gap-y-12 gap-x-4">
                    {mobileCategoryIcons.map((cat) => (
                        <Link 
                            key={cat.id} 
                            to={cat.path} 
                            className="flex flex-col items-center gap-4 active:scale-95 transition-all"
                        >
                            <div className="w-full aspect-square bg-white rounded-3xl shadow-xl flex items-center justify-center p-3 border border-white">
                                <img 
                                    src={cat.img} 
                                    alt={cat.name} 
                                    className="max-h-full max-w-full object-contain filter drop-shadow-md" 
                                />
                            </div>
                            <span className="text-[10px] font-black uppercase text-center text-gray-800 tracking-tight leading-tight px-1">
                                {cat.name.replace(' & ', ' &\n')}
                            </span>
                        </Link>
                    ))}
                </div>
            </section>

            {/* DESKTOP ONLY: Category Cards */}
            <section className="hidden md:block max-w-[1440px] mx-auto px-4 md:px-6 mb-16 md:mb-24">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                    {homeCategories.map((cat) => (
                        <Link 
                            key={cat.id} 
                            to={
                                cat.name.toLowerCase().includes('beauty') ? '/beauty-health' : 
                                cat.name.toLowerCase().includes('books') ? '/books-education' : 
                                cat.name.toLowerCase().includes('sports') ? '/sports-fitness' : 
                                cat.name.toLowerCase().includes('auto') ? '/automotive' : 
                                `/products?category_id=${cat.id}`
                            }
                            className="bg-white rounded-xl p-4 md:p-8 flex flex-col items-center justify-between shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-white group h-[200px] md:h-[260px]"
                        >
                            <div className="w-full flex-grow flex items-center justify-center p-2 md:p-4 overflow-hidden">
                                <img src={cat.img} alt={cat.name} className="max-h-full max-w-full object-contain drop-shadow-2xl opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-transform duration-700" />
                            </div>
                            <h3 className="text-sm md:text-[17px] font-black uppercase text-primary-color tracking-tight group-hover:text-accent-color transition-colors text-center">{cat.name}</h3>
                        </Link>
                    ))}
                </div>
            </section>

            {/* DESKTOP ONLY: Benefits */}
            <section className="hidden md:grid max-w-[1440px] mx-auto px-4 md:px-6 mb-16 md:mb-24 grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                <div className="bg-white p-6 md:p-8 rounded-xl flex items-center gap-4 md:gap-6 shadow-md border-b-4 border-primary-color">
                    <div className="bg-primary-color/10 p-4 md:p-5 rounded-full text-primary-color"><Truck size={28} /></div>
                    <div>
                        <h4 className="font-black uppercase text-xs md:text-sm text-text-color">Fast Logistic</h4>
                        <p className="text-[10px] md:text-xs text-gray-400 font-bold">Orders ₹5000+</p>
                    </div>
                </div>
                <div className="bg-white p-6 md:p-8 rounded-xl flex items-center gap-4 md:gap-6 shadow-md border-b-4 border-accent-color">
                    <div className="bg-accent-color/10 p-4 md:p-5 rounded-full text-accent-color"><ShieldCheck size={28} /></div>
                    <div>
                        <h4 className="font-black uppercase text-xs md:text-sm text-text-color">Secure Checkout</h4>
                        <p className="text-[10px] md:text-xs text-gray-400 font-bold">Verified protection</p>
                    </div>
                </div>
                <div className="bg-white p-6 md:p-8 rounded-xl flex items-center gap-4 md:gap-6 shadow-md border-b-4 border-primary-color">
                    <div className="bg-primary-color/10 p-4 md:p-5 rounded-full text-primary-color"><Zap size={28} /></div>
                    <div>
                        <h4 className="font-black uppercase text-xs md:text-sm text-text-color">24/7 Support</h4>
                        <p className="text-[10px] md:text-xs text-gray-400 font-bold">Priority assistance</p>
                    </div>
                </div>
            </section>

            {/* Product Highlights */}
            <section className="max-w-[1440px] mx-auto px-4 md:px-6">
                <div className="flex flex-col md:flex-row justify-between items-baseline mb-8 md:mb-12 gap-4 md:gap-6 border-b border-gray-200 pb-6 md:pb-8">
                    <div className="space-y-1 md:space-y-2">
                        <h2 className="text-xl md:text-4xl font-black uppercase text-text-color tracking-tight">Product Highlights</h2>
                    </div>
                </div>

                <div className={`grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-10 transition-opacity duration-500 ${loading ? 'opacity-30' : 'opacity-100'}`}>
                    {products.length > 0 ? (
                        products.slice(0, 8).map(p => (
                            <ProductCard key={p.id} product={p} />
                        ))
                    ) : (
                        <div className="col-span-full py-20 md:py-32 text-center text-gray-300 font-black uppercase tracking-[0.2em] md:tracking-[0.3em] border-2 border-dashed border-gray-100 rounded-xl px-4">
                            No products matching criteria
                        </div>
                    )}
                </div>

                <div className="mt-8 md:mt-20 flex justify-center">
                    <Link 
                        to="/products"
                        className="bg-[#2b5a9a] text-white px-10 md:px-16 py-4 md:py-5 rounded-full font-black uppercase tracking-widest text-xs md:text-sm hover:bg-accent-color transition-all duration-500 shadow-2xl active:scale-95"
                    >
                        View Full Boutique
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Home;

