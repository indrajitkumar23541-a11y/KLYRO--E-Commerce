import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, ArrowRight, Heart, Sparkles, Truck, RotateCcw, Headphones, X } from 'lucide-react';
import HomeLivingData from '../data/HomeLivingData';

const HomeLiving = () => {
    const navigate = useNavigate();
    const [selectedGuide, setSelectedGuide] = React.useState(null);

    useEffect(() => {
        document.title = "KLYRO | Home & Living";
    }, []);

    const subNavbarItems = ['Home & Living', 'Furniture', 'Decor', 'Kitchen', 'Bedding', 'Lighting', 'Appliances'];

    return (
        <div className="bg-[#fbFAF7] min-h-screen pt-[100px] md:pt-[120px] pb-24 page-transition font-sans">
            
            {/* SUB-NAVBAR CATEGORIES (Sticky and High-Fidelity) */}
            <div className="bg-white border-b sticky top-[64px] md:top-[72px] lg:top-[120px] z-50 overflow-x-auto whitespace-nowrap no-scrollbar shadow-sm transition-all duration-300">
                <div className="max-w-[1440px] mx-auto flex items-center h-12 md:h-14 px-4 md:px-6 gap-6 md:gap-8">
                    <button onClick={() => navigate('/home-living')} className={`text-[10px] md:text-[12px] font-black uppercase h-full border-b-2 transition-all text-[#9e5d3c] border-[#9e5d3c]`}>Home & Living</button>
                    {subNavbarItems.filter(item => item !== 'Home & Living').map((item) => (
                        <button 
                            key={item} 
                            onClick={() => {
                                navigate(`/products?search=${item.toLowerCase()}`);
                            }}
                            className={`text-[9px] md:text-[11px] font-bold uppercase transition-all h-full border-b-2 text-gray-500 border-transparent hover:text-[#9e5d3c]`}
                        >
                            {item}
                        </button>
                    ))}
                </div>
            </div>

            {/* BREADCRUMBS */}
            <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-12 py-2 flex items-center gap-2 text-[10px] md:text-[11px] text-[#9e5d3c] font-bold uppercase tracking-wider overflow-x-auto no-scrollbar whitespace-nowrap">
                <Link to="/" className="hover:underline">Home</Link>
                <ChevronRight size={10} strokeWidth={4} className="mt-[1px] flex-shrink-0" />
                <span>Home & Living</span>
            </div>

            {/* FULL-WIDTH CINEMATIC HERO */}
            <section className="mb-8 md:mb-16 w-full animate-reveal relative group px-0 md:px-6 lg:px-0">
                <div className="relative h-[40vh] md:h-[50vh] min-h-[350px] md:min-h-[450px] w-full overflow-hidden shadow-sm md:rounded-3xl lg:rounded-none border-b border-stone-100 bg-white">
                    
                    {/* Background Image */}
                    <div 
                        className="absolute inset-0 w-full bg-cover bg-center transition-transform duration-[6000ms] group-hover:scale-110 ease-out"
                        style={{ backgroundImage: `url(${HomeLivingData.hero.image})` }}
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#fbFAF7] via-[#fbFAF7]/90 md:via-[#fbFAF7]/80 to-transparent z-10" />

                    {/* Content Layer */}
                    <div className="relative z-20 h-full flex flex-col justify-center px-6 md:px-12 lg:px-24 max-w-[1440px] mx-auto space-y-4 md:space-y-6">

                        <div className="space-y-2 md:space-y-4">
                            <h1 className="text-4xl sm:text-6xl lg:text-8xl font-black text-[#2d231b] tracking-tight leading-[0.9]">
                                Home <span className="text-[#9e5d3c]">Living</span>
                            </h1>
                            <p className="text-sm md:text-xl lg:text-2xl font-bold text-slate-600 tracking-tight leading-relaxed max-w-lg mb-4 md:mb-8 uppercase">
                                {HomeLivingData.hero.subtitle}
                            </p>
                            <div className="hidden sm:flex flex-wrap gap-2 md:gap-4 pt-2">
                                {HomeLivingData.hero.bullets.map((bullet, i) => (
                                    <div key={i} className="bg-white/80 backdrop-blur-md px-3 md:px-4 py-1.5 rounded-full border border-[#9e5d3c]/20 text-[8px] md:text-[10px] font-black uppercase tracking-widest text-[#9e5d3c]">
                                        {bullet}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-10 pt-2 md:pt-4">
                            <button 
                                onClick={() => navigate('/products?category_id=1')} 
                                className="bg-[#bc612c] hover:bg-[#9e5d3c] text-white px-8 md:px-12 py-3 md:py-4 rounded-md font-black text-[10px] md:text-xs transition-all shadow-lg active:scale-95 uppercase tracking-widest"
                            >
                                Shop Collection &rarr;
                            </button>
                            <button 
                                onClick={() => navigate('/products?category_id=1&sort=popularity')}
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
                        <h2 className="text-2xl md:text-3xl font-black text-slate-800 uppercase tracking-tight">Shop by Aesthetics</h2>
                        <button onClick={() => navigate('/products')} className="text-[10px] md:text-[12px] font-black uppercase tracking-widest text-[#bc612c] border-2 border-[#dcc6a6]/30 px-6 py-3 rounded-full hover:bg-[#bc612c] hover:text-white transition-all shadow-sm">
                            View All Categories
                        </button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
                        {[
                            { name: "Furniture", img: "/assets/home/cat_furniture.png" },
                            { name: "Decor", img: "/assets/home/cat_decor.png" },
                            { name: "Kitchen", img: "/assets/home/cat_kitchen.png" },
                            { name: "Lighting", img: "/assets/home/cat_lighting.png" },
                            { name: "Appliances", img: "/assets/home/cat_appliances.png" },
                            { name: "Furnishing", img: "/assets/home/cat_furnishing.png" }
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
                                <span className="text-xs md:text-sm font-black uppercase text-gray-800 tracking-tight text-center leading-tight group-hover:text-[#bc612c] transition-colors">
                                    {cat.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* PROMO BANNER */}
            <section className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-12 mb-12 md:mb-20 animate-reveal stagger-2">
                <div className="rounded-[30px] md:rounded-[40px] overflow-hidden relative shadow-xl h-[250px] md:h-[300px] bg-[#f9f3eb]">
                    <img src={HomeLivingData.promoDeals.image} alt="Home Decor" className="absolute inset-0 w-full h-full object-cover opacity-60" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#fdfaf5] via-[#fdfaf5]/60 md:via-[#fdfaf5]/40 to-transparent p-8 md:p-12 flex flex-col justify-center">
                        <h3 className="text-2xl md:text-4xl font-serif text-[#2d231b] mb-2" style={{ fontFamily: 'Georgia, serif' }}>{HomeLivingData.promoDeals.title}</h3>
                        <p className="text-sm md:text-lg text-slate-600 mb-6 md:mb-8 font-medium max-w-xs">{HomeLivingData.promoDeals.subtitle}</p>
                        <button className="bg-[#bc612c] hover:bg-[#9e5d3c] text-white px-6 md:px-8 py-2 md:py-3 rounded-xl font-black text-[10px] md:text-xs w-fit transition-all shadow-md uppercase tracking-widest active:scale-95">
                            Shop Now &rsaquo;
                        </button>
                    </div>
                </div>
            </section>

            {/* TOP DEALS */}
            <section className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-12 mb-12 md:mb-20 animate-reveal stagger-2">
                <div className="flex justify-between items-center mb-6 md:mb-8 border-b border-[#dcc6a6]/30 pb-4">
                    <h2 className="text-xl md:text-2xl font-bold text-slate-800">Top Deals</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                    {HomeLivingData.topDeals.map((deal, i) => (
                        <div key={i} className="rounded-[24px] md:rounded-[32px] overflow-hidden relative shadow-lg group cursor-pointer h-[220px] md:h-[280px]">
                            <img src={deal.image} alt={deal.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all p-6 md:p-10 flex flex-col justify-end text-white">
                                <h3 className="text-xl md:text-2xl font-black">{deal.title}</h3>
                                <p className="text-base md:text-lg font-bold text-yellow-500 mb-2 md:mb-4">{deal.offer}</p>
                                <button className="bg-white/90 backdrop-blur-md text-[#2d231b] px-4 md:px-6 py-2 rounded-lg font-black text-[10px] md:text-xs w-fit shadow-md uppercase tracking-widest hover:bg-[#bc612c] hover:text-white transition-all">
                                    Shop Now &rsaquo;
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* TOP PICKS GRID */}
            <section className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-12 mb-12 md:mb-20 animate-reveal stagger-3">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 border-b border-[#dcc6a6]/30 pb-4 gap-4">
                    <h2 className="text-xl md:text-2xl font-bold text-slate-800">Top Picks</h2>
                    <button className="text-[9px] md:text-[11px] font-semibold uppercase tracking-widest text-[#bc612c] border border-[#dcc6a6]/30 px-4 md:px-6 py-2.5 rounded-full hover:bg-white transition-colors w-fit">
                        View All &rsaquo;
                    </button>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
                    {HomeLivingData.topPicks.map((item) => (
                        <div key={item.id} className="bg-white rounded-[24px] md:rounded-[32px] p-4 md:p-5 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col border border-stone-50 h-full group">
                            <div className="h-40 md:h-56 flex items-center justify-center mb-4 md:mb-6 relative z-0 overflow-hidden rounded-xl md:rounded-2xl bg-[#fdfaf5]">
                                <img src={item.image} alt={item.name} className="max-h-[85%] max-w-[85%] object-contain group-hover:scale-110 transition-transform duration-700" />
                                <button className="absolute top-2 right-2 md:top-3 md:right-3 p-1.5 md:p-2 bg-white/80 backdrop-blur-md rounded-full text-[#bc612c] shadow-sm opacity-0 group-hover:opacity-100 transition-all">
                                    <Heart size={14} md={16} />
                                </button>
                            </div>
                            <div className="flex flex-col flex-grow text-center">
                                <h4 className="font-bold text-slate-700 text-[10px] md:text-sm leading-tight mb-1 md:mb-2 line-clamp-2 px-1">{item.name}</h4>
                                <div className="text-[#bc612c] font-black text-sm md:text-lg mb-3 md:mb-4">₹{item.price}</div>
                                <button className="w-full bg-slate-900 text-white py-2.5 md:py-3 rounded-lg md:rounded-xl font-black text-[8px] md:text-[10px] uppercase tracking-widest mt-auto shadow-md hover:bg-[#bc612c] transition-all">Add to Cart</button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

             {/* STYLE TIPS & VALUE STRIP */}
            <section className="bg-gradient-to-b from-white to-[#fdfaf5] py-12 md:py-20 px-4 md:px-6 lg:px-12 mb-12 md:mb-20 overflow-hidden">
                <div className="max-w-[1440px] mx-auto">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-12 mb-12 md:mb-20 border-b border-[#dcc6a6]/30 pb-12 md:pb-16">
                        {[
                            { title: 'Styling', sub: 'Expert Tips', icon: <Sparkles size={20} md={24} />, guide: HomeLivingData.expertTips[0] },
                            { title: 'Assembly', sub: 'On Select Items', icon: <Truck size={20} md={24} /> },
                            { title: 'Packing', sub: 'Zero Damage', icon: <RotateCcw size={20} md={24} /> },
                            { title: 'Support', sub: '24/7 Consult', icon: <Headphones size={20} md={24} /> }
                        ].map((item, i) => (
                            <div key={i} onClick={() => item.guide && setSelectedGuide(item.guide)} className={`flex flex-col items-center text-center gap-2 md:gap-3 group cursor-pointer ${item.guide ? 'hover:scale-105 transition-transform' : ''}`}>
                                <div className="text-[#bc612c] opacity-60 group-hover:opacity-100 transition-all duration-300 mb-1 md:mb-2">
                                    {item.icon}
                                </div>
                                <div className="space-y-0.5 md:space-y-1">
                                    <h4 className="font-black text-[10px] md:text-[13px] text-[#2d231b] uppercase tracking-widest">{item.title}</h4>
                                    <p className="text-[8px] md:text-[11px] text-slate-400 font-bold uppercase">{item.sub}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* TOP BRANDS */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b border-gray-100 pb-4 gap-4 mt-12 md:mt-20">
                        <h2 className="text-xl md:text-2xl font-bold text-[#1e293b]">Top Brands</h2>
                    </div>
                    <div className="flex overflow-x-auto no-scrollbar gap-4 pb-4">
                        {HomeLivingData.brands.map((brand, i) => (
                            <div key={i} className="bg-white border text-center border-gray-100 h-16 md:h-20 px-6 md:px-8 flex-shrink-0 rounded-xl flex items-center justify-center shadow-sm hover:shadow-md transition-all cursor-pointer group">
                                 <img src={brand.logo} alt={brand.name} className="h-6 md:h-10 opacity-60 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0 filter" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* EXPERT GUIDE MODAL */}
            {selectedGuide && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[#2d231b]/60 backdrop-blur-md transition-opacity" onClick={() => setSelectedGuide(null)} />
                    <div className="bg-white rounded-[32px] md:rounded-[48px] w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col relative z-10 shadow-3xl animate-reveal border border-white">
                        <div className="p-6 md:p-10 border-b border-[#fdfaf5] bg-[#fdfaf5]/50 flex justify-between items-start">
                            <div className="pr-6 md:pr-10">
                                <h2 className="text-xl md:text-3xl font-black text-[#2d231b] mb-1 md:mb-2">{selectedGuide.title}</h2>
                                <p className="text-[#bc612c] font-bold text-[10px] md:text-sm tracking-widest uppercase italic">{selectedGuide.subtitle}</p>
                            </div>
                            <button onClick={() => setSelectedGuide(null)} className="p-2 bg-white rounded-full text-[#bc612c] hover:text-[#9e5d3c] transition-colors shadow-sm border border-[#dcc6a6]/30"><X size={18} md={20} /></button>
                        </div>
                        <div className="p-6 md:p-10 overflow-y-auto no-scrollbar bg-white">
                            <div className="prose prose-stone prose-sm md:prose-base max-w-none text-[#2d231b]">
                                {selectedGuide.content.split('\n\n').map((paragraph, idx) => {
                                    if(paragraph.startsWith('###')) {
                                        return <h3 key={idx} className="text-lg md:text-xl font-black mt-8 md:mt-10 mb-4 md:mb-5 border-l-8 border-[#bc612c] pl-4 leading-tight text-[#2d231b] uppercase tracking-tight">{paragraph.replace('###', '').trim()}</h3>
                                    }
                                    return <p key={idx} className="mb-4 md:mb-6 text-sm md:text-[16px] leading-relaxed text-slate-600 font-medium">{paragraph}</p>
                                })}
                            </div>
                        </div>
                        <div className="p-6 md:p-8 border-t border-[#fdfaf5] bg-[#fdfaf5]/50 flex justify-end">
                            <button onClick={() => setSelectedGuide(null)} className="w-full md:w-auto bg-[#2d231b] text-white px-8 md:px-10 py-3 md:py-4 rounded-full font-black uppercase tracking-widest hover:bg-[#bc612c] transition-colors shadow-xl active:scale-95 duration-200 text-xs">Close Guide</button>
                        </div>
                    </div>
                </div>
            )}

            {/* FOOTER CTA */}
            <section className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-12 mb-12 md:mb-32 text-center">
                <div className="py-12 md:py-20 border-t border-stone-200">
                    <h2 className="text-2xl md:text-4xl font-serif text-[#2d231b] mb-2 md:mb-4 px-4" style={{ fontFamily: 'Georgia, serif' }}>Create Your Dream Space.</h2>
                    <p className="text-sm md:text-lg text-slate-500 mb-8 md:mb-10 font-bold uppercase tracking-[0.1em] md:tracking-[0.2em]">Shop Home & Living Now!</p>
                    <button className="bg-[#2d231b] hover:bg-[#bc612c] text-white px-8 md:px-12 py-4 md:py-5 rounded-xl md:rounded-2xl font-black text-[10px] md:text-sm uppercase tracking-widest shadow-xl transition-all active:scale-95 flex items-center gap-2 mx-auto">
                        Browse Collection <ChevronRight size={20} />
                    </button>
                </div>
            </section>
        </div>
    );
};

export default HomeLiving;
