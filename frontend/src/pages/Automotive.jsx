import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ChevronRight, ArrowRight, Star, Heart, RotateCcw, Truck, ShieldCheck, Headphones, X, Zap } from 'lucide-react';
import API from '../api/axios';
import ProductCard from '../components/ProductCard';

const AutoGuideData = [
    {
        id: 'tyres',
        title: "High-Performance Tyre Maintenance",
        subtitle: "Maximized grip and safety for both Car and Bike enthusiasts",
        content: "Tyres are the only contact point between your vehicle and the road. Maintaining them perfectly is not an option—it is a necessity for your safety.\n\n### 1. Understanding Air Pressure (PSI)\nNever rely on visual inspection. Use a digital pressure gauge at least once every two weeks when the tyres are ‘cold’ (driven less than 3km). Under-inflated tyres increase rolling resistance, drastically reducing fuel efficiency and killing your handling. Over-inflation makes the ride harsh and leads to uneven wear in the center of the tread.\n\n### 2. The Penny Test (Tread Depth)\nHow do you know when to replace them? Take a coin and insert it into the tread grooves. If you can see the top of the symbol, your tread is dangerously low (less than 1.6mm for cars, usually 2mm for bikes). Bald tyres cannot displace water, leading to ‘Hydroplaning’ where the vehicle literally floats on water, losing all braking power.\n\n### 3. Sidewall Codes Deciphered\nEver seen codes like **190/55 ZR17**? The first number is the width in millimeters, the second is the Aspect Ratio (height as a percentage of width), and the last is the rim size. The 'ZR' or 'V/W' rating tells you the maximum speed the tyre can safely handle—never exceed this limit.\n\n### 4. Rotation and Balancing\nFor cars, rotate your tyres every 10,000km to ensure even wear across all four. If you feel vibrations through the steering wheel at high speeds, your wheel balancing is likely off, which can damage your suspension over time."
    },
    {
        id: 'oil',
        title: "The Master Engine Oil Guide",
        subtitle: "Why synthetic matters and how to protect your engine's heart",
        content: "Engine oil is the lifeblood of your vehicle. It lubricates, cools, and cleans. Choosing the wrong oil can lead to catastrophic engine failure.\n\n### 1. Synthetic vs. Mineral Oils\nMineral oil is basically refined crude oil—fine for older, low-stress engines. However, in modern high-performance vehicles, **Full Synthetic Oil** is mandatory. It contains lab-engineered molecules that don't break down under extreme heat, providing consistent protection even at the redline. \n\n### 2. Viscosity Ratings (e.g., 5W-30)\nThe 'W' stands for Winter. The first number (5) tells you how easily the oil flows in cold starts. The second number (30) is the thickness at operating temperature. If you use a thicker oil than recommended, the oil pump has to work harder, robbing you of power and fuel economy.\n\n### 3. Motorcycle Specific (JASO MA2)\nNever put car engine oil into a motorcycle with a 'Wet Clutch'. Car oils contain friction modifiers that will make your bike's clutch slip, rendering it unrideable. Always look for the **JASO MA2** certification on the bottle for 4-stroke motorcycles.\n\n### 4. When to Change?\nModern synthetic oils can last 10,000km to 15,000km in cars, but for high-revving bikes, we recommend changing every 5,000km. Always replace the Oil Filter simultaneously; a dirty filter will immediately contaminate your fresh oil."
    },
    {
        id: 'brakes',
        title: "Brake Safety & Performance Pads",
        subtitle: "Upgrade your stopping power and prevent brake fade",
        content: "Power is nothing without control. Your brakes work by converting kinetic energy into heat through friction. Knowing your brake pads can save your life.\n\n### 1. Sintered vs. Organic Pads\n**Organic pads** are quiet and soft, great for daily city commuting. However, they 'fade' quickly under heavy braking. **Sintered (Metallic) pads** contain copper/bronze particles. They handle massive heat, provide a stronger 'initial bite', and are essential for performance driving or track days. Note: Sintered pads are noisier and wear down your discs faster.\n\n### 2. Brake Fluid (The Hydraulic Force)\nBrake fluid is 'Hygroscopic', meaning it absorbs moisture from the air over time. If your fluid turns dark/black, it’s contaminated. Boiling moisture in the lines creates air bubbles, leading to a 'spongy' brake lever that won't stop the vehicle. Replace your fluid every 2 years regardless of mileage.\n\n### 3. Disc Inspection\nCheck your rotors for 'Grooving' or blue-ish discoloration (heat spots). If you feel a vibration (pulsing) when braking, your rotors are likely warped and need to be resurfaced or replaced immediately.\n\n### 4. Cleaning & Lubrication\nAlways keep your calipers clean of brake dust. Use a dedicated Brake Cleaner spray—never use WD-40 or grease anywhere near the friction surface of the pads or discs!"
    }
];

const Automotive = () => {
    const [products, setProducts] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [activeSubId, setActiveSubId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedGuide, setSelectedGuide] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "KLYRO | Automotive";
        fetchMetadata();
    }, []);

    const fetchMetadata = async () => {
        try {
            const response = await API.get('/categories');
            const raw = response.data.categories || [];
            const autoRoot = raw.find(c => c.id === 46 || c.name.toLowerCase() === 'automotive');
            if (autoRoot) {
                const subCats = raw.filter(c => c.parent_id === autoRoot.id);
                setSubCategories(subCats);
            }
        } catch (error) {
            console.error('Automotive metadata fetch error:', error);
        }
    };

    const fetchProducts = async (subId) => {
        setLoading(true);
        try {
            const params = { limit: 4 };
            if (subId) params.category_id = subId;
            else params.category_id = 46; 
            
            const response = await API.get('/products', { params });
            if(response.data.products?.length > 0) {
                setProducts(response.data.products);
            } else {
                setProducts([
                    { id: 2001, name: "Michelin Pilot Sport 4 Tyre (Car)", price: 12999, discount_price: 10499, image: "https://images.unsplash.com/photo-1621360841013-e76d97a0224a?auto=format&fit=crop&q=80&w=600", stock: 12 },
                    { id: 2002, name: "VR-Pro Carbon Fiber Helmet", price: 24999, discount_price: 19999, image: "https://images.unsplash.com/photo-1558981359-219d6364c9c8?auto=format&fit=crop&q=80&w=600", stock: 5 },
                    { id: 2003, name: "Philips LED Headlight Conversion Kit", price: 8999, discount_price: 5499, image: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=600", stock: 20 },
                    { id: 2004, name: "ArmorAll Professional Car Care Kit", price: 4599, discount_price: 3299, image: "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&q=80&w=600", stock: 15 }
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
        { name: 'Michelin', logo: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 40"><text x="0" y="30" font-family="%27Arial Black%27, sans-serif" font-weight="900" font-size="20" fill="%231e3a8a" font-style="italic" letter-spacing="-1">MICHELIN</text></svg>' },
        { name: 'Toyota', logo: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 40"><text x="0" y="30" font-family="%27Arial Black%27, sans-serif" font-weight="900" font-size="22" fill="%23eb0a1e" letter-spacing="1">TOYOTA</text></svg>' },
        { name: 'Tesla', logo: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 40"><text x="0" y="30" font-family="%27Arial Black%27, sans-serif" font-weight="900" font-size="22" fill="%23e31937" letter-spacing="2">TESLA</text></svg>' },
        { name: 'Hyundai', logo: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 40"><text x="0" y="30" font-family="%27Arial Black%27, sans-serif" font-weight="900" font-size="20" fill="%23002c5f" letter-spacing="0">HYUNDAI</text></svg>' },
        { name: 'Tata Motors', logo: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 30"><circle cx="15" cy="15" r="14" fill="none" stroke="%2300529b" stroke-width="2"/><text x="40" y="24" font-family="%27Arial Black%27, sans-serif" font-weight="900" font-size="14" fill="%2300529b">TATA MOTORS</text></svg>' },
        { name: 'Kia', logo: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 22"><path d="M2 2 L12 18 L22 2 M25 2 L25 18 M32 18 L42 2 L52 18" fill="none" stroke="%23000" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>' },
        { name: 'Mahindra', logo: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 30"><text x="0" y="24" font-family="%27Arial Black%27, sans-serif" font-weight="900" font-size="16" fill="%23dd1f26" letter-spacing="1">MAHINDRA</text></svg>' },
        { name: 'Maruti Suzuki', logo: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 30"><path d="M10 5 Q20 2 30 5 L10 20 Q15 25 30 20" fill="none" stroke="%23000" stroke-width="4" stroke-linecap="round"/><text x="45" y="22" font-family="%27Arial Black%27, sans-serif" font-weight="900" font-size="12" fill="%23000">MARUTI SUZUKI</text></svg>' },
        { name: 'Nissan', logo: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 40"><text x="0" y="30" font-family="%27Arial Black%27, sans-serif" font-weight="900" font-size="22" fill="%23000" letter-spacing="2">NISSAN</text></svg>' },
        { name: 'BYD', logo: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 40"><text x="0" y="30" font-family="%27Arial Black%27, sans-serif" font-weight="900" font-size="28" fill="%23000" letter-spacing="3">BYD</text></svg>' },
        { name: 'Bosch', logo: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 40"><text x="0" y="30" font-family="%27Arial Black%27, sans-serif" font-weight="900" font-size="24" fill="%23cc0000" letter-spacing="1">BOSCH</text></svg>' },
        { name: 'Castrol', logo: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 40"><text x="0" y="30" font-family="%27Arial Black%27, sans-serif" font-weight="900" font-size="22" fill="%2301804b" letter-spacing="0">Castrol</text></svg>' }
    ];

    const subNavbarItems = ['Automotive', 'Car Electronics', 'Car Accessories', 'Bike Gear', 'Performance Spares'];

    return (
        <div className="bg-[#fcfdfd] min-h-screen pt-[100px] md:pt-[112px] pb-24 page-transition font-sans">
            
            <div className="bg-white border-b sticky top-[56px] md:top-[64px] lg:top-[112px] z-50 overflow-x-auto whitespace-nowrap no-scrollbar shadow-sm transition-all duration-300">
                <div className="max-w-[1440px] mx-auto flex items-center h-12 px-4 md:px-6 gap-6 md:gap-8">
                    <button onClick={() => { setActiveSubId(null); navigate('/automotive'); }} className={`text-[10px] md:text-[12px] font-black uppercase h-full border-b-2 transition-all ${activeSubId === null ? 'text-blue-600 border-blue-600' : 'text-gray-400 border-transparent hover:text-blue-600'}`}>Automotive</button>
                    {subNavbarItems.filter(item => item !== 'Automotive').map((item) => (
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
                            className={`text-[9px] md:text-[11px] font-bold uppercase transition-all h-full border-b-2 text-gray-500 border-transparent hover:text-blue-600`}
                        >
                            {item}
                        </button>
                    ))}
                </div>
            </div>

            <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-12 py-2 flex items-center gap-2 text-[10px] md:text-[11px] text-blue-600 font-bold uppercase tracking-wider overflow-x-auto no-scrollbar whitespace-nowrap">
                <Link to="/" className="hover:underline">Home</Link>
                <ChevronRight size={10} strokeWidth={4} className="mt-[1px] flex-shrink-0" />
                <span>Automotive</span>
            </div>

            <section className="mb-8 md:mb-16 w-full animate-reveal relative group px-0 md:px-6 lg:px-0">
                <div className="relative h-[40vh] md:h-[50vh] min-h-[350px] md:min-h-[450px] w-full overflow-hidden shadow-sm md:rounded-3xl lg:rounded-none border-b border-blue-50 bg-white">
                    <div 
                        className="absolute inset-0 w-full bg-cover bg-center transition-transform duration-[6000ms] group-hover:scale-110 ease-out"
                        style={{ backgroundImage: `url(/assets/auto_hero_v2.png)` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#f8fafc] via-[#f8fafc]/90 md:via-[#f8fafc]/80 to-transparent z-10" />
                    <div className="relative z-20 h-full flex flex-col justify-center px-6 md:px-12 lg:px-24 max-w-[1440px] mx-auto space-y-4 md:space-y-6">
                        <div className="space-y-2 md:space-y-4">
                            <h1 className="text-4xl sm:text-6xl lg:text-8xl font-black text-[#1e1b4b] tracking-tight leading-[0.9]">
                                Auto <span className="text-blue-600">Elite</span>
                            </h1>
                            <p className="text-sm md:text-xl lg:text-2xl font-bold text-slate-600 tracking-tight leading-relaxed max-w-lg mb-4 md:mb-8 uppercase">
                                Premium Performance & Care for Your Machine.
                            </p>
                            <div className="hidden sm:flex flex-wrap gap-2 md:gap-4 pt-2">
                                {['Performance Tuning', 'Premium Detailing', 'Original Parts', 'Expert Consultation'].map((bullet, i) => (
                                    <div key={i} className="bg-white/80 backdrop-blur-md px-3 md:px-4 py-1.5 rounded-full border border-blue-100 text-[8px] md:text-[10px] font-black uppercase tracking-widest text-[#1e1b4b]">
                                        {bullet}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-10 pt-2 md:pt-4">
                            <button 
                                onClick={() => navigate('/products?category_id=46')} 
                                className="bg-blue-600 hover:bg-blue-700 text-white px-8 md:px-12 py-3 md:py-4 rounded-md font-black text-[10px] md:text-xs transition-all shadow-lg active:scale-95 uppercase tracking-widest"
                            >
                                Shop All Parts &rarr;
                            </button>
                            <button 
                                onClick={() => document.getElementById('bestsellers').scrollIntoView({behavior:'smooth'})}
                                className="text-[#1e1b4b] hover:text-blue-600 font-black text-[10px] md:text-xs transition-all uppercase tracking-widest flex items-center gap-2 group/btn"
                            >
                                Best Sellers <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-gray-50/50 py-16 md:py-24 mb-12 md:mb-20 animate-reveal stagger-1">
                <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-12">
                    <div className="flex items-center justify-between mb-12 border-b border-gray-200/50 pb-6">
                        <h2 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tight">Shop by Sub-Category</h2>
                        <button onClick={() => navigate('/products?category_id=46')} className="text-[10px] md:text-[12px] font-black uppercase tracking-widest text-blue-600 border-2 border-blue-100 px-6 py-3 rounded-full hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                            View All Categories
                        </button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
                        {[
                            { name: "Car Care", img: "/assets/auto_hero_v2.png" },
                            { name: "Tools", img: "/assets/others/cat_tools_luxury.png" },
                            { name: "Perfume", img: "/assets/wellness_pack_v2.webp" },
                            { name: "Gadgets", img: "/assets/cat_gadgets.png" },
                            { name: "Cleaning", img: "/assets/auto_promo1_1775025200901.png" }
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
                                <span className="text-xs md:text-sm font-black uppercase text-gray-800 tracking-tight text-center leading-tight group-hover:text-blue-600 transition-colors">
                                    {cat.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section id="bestsellers" className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-12 mb-12 md:mb-20 animate-reveal stagger-2">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8 border-b border-gray-100 pb-4">
                    <h2 className="text-xl md:text-2xl font-bold text-slate-800 whitespace-nowrap">Performance Top Sellers</h2>
                    <button onClick={() => navigate('/products?category_id=46')} className="text-[9px] md:text-[11px] font-semibold uppercase tracking-widest text-[#64748b] border border-gray-200 px-5 py-2 rounded-full hover:bg-gray-50 transition-colors whitespace-nowrap">
                        View All Parts &rsaquo;
                    </button>
                </div>
                
                {/* Promo Banners Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8 md:mb-12">
                    <div className="rounded-[24px] md:rounded-[30px] overflow-hidden relative shadow-lg group cursor-pointer h-[200px] md:h-[240px] bg-slate-900">
                        <img src="/assets/auto_promo1_1775025200901.png" alt="Accessories" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80" />
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-transparent p-6 md:p-10 flex flex-col justify-center text-white">
                            <h3 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2">Up to <span className="text-amber-400">40% OFF</span></h3>
                            <p className="text-sm md:text-lg mb-4 md:mb-6 opacity-90 tracking-wide font-light">Premium Auto Essentials</p>
                            <button className="bg-amber-400 hover:bg-amber-500 text-amber-900 px-5 md:px-6 py-2 rounded-lg font-bold text-[10px] md:text-sm w-fit transition-all uppercase tracking-widest">
                                Save Now
                            </button>
                        </div>
                    </div>
                    
                    <div className="rounded-[24px] md:rounded-[30px] overflow-hidden relative shadow-md group cursor-pointer h-[200px] md:h-[240px] border border-blue-50 bg-white">
                        <img src="/assets/auto_promo2_1775025226834.png" alt="Tyres" className="absolute inset-0 w-full h-full object-cover object-right group-hover:scale-105 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/95 via-blue-50/80 to-transparent p-6 md:p-10 flex flex-col justify-center text-blue-900">
                            <h3 className="text-xl md:text-3xl font-bold mb-1 md:mb-2 leading-tight">Tyre Exchange Offer</h3>
                            <p className="text-sm md:text-base text-slate-600 mb-4 md:mb-6 font-medium">Extra Discount on Performance Tyres</p>
                            <button className="bg-blue-900 hover:bg-blue-700 text-white px-5 md:px-6 py-2 rounded-lg font-semibold text-[10px] md:text-sm w-fit transition-all shadow-lg flex items-center gap-2">
                                Check Exchange &rarr;
                            </button>
                        </div>
                    </div>
                </div>

                {/* Product Grid */}
                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                        {[1,2,3,4].map(i => <div key={i} className="aspect-square bg-gray-100 rounded-2xl animate-pulse" />)}
                    </div>
                ) : products.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                        {products.slice(0, 4).map((product, i) => (
                             <div key={product.id} className="bg-white rounded-[24px] p-4 md:p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col border border-gray-100 h-full group">
                                <div className="h-32 md:h-44 flex items-center justify-center mb-3 md:mb-4 relative z-0 overflow-hidden">
                                    <img src={product.image} alt={product.name} className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-500 mix-blend-multiply" />
                                </div>
                                <div className="flex flex-col flex-grow">
                                    <h4 className="font-bold text-slate-700 text-sm md:text-base leading-tight mb-2 line-clamp-2">{product.name}</h4>
                                    <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                                        <span className="text-blue-700 font-black text-base md:text-lg font-mono">₹{product.discount_price || product.price}</span>
                                        {product.discount_price && <span className="text-[10px] md:text-xs text-slate-400 line-through font-bold">₹{product.price}</span>}
                                    </div>
                                    <button className="w-full bg-blue-600 text-white py-2.5 md:py-3 rounded-xl font-bold text-[10px] md:text-sm mt-auto shadow-md hover:bg-blue-700 transition-all">Add to Cart</button>
                                </div>
                             </div>
                        ))}
                    </div>
                )}
            </section>

            {/* TRUSTED BRANDS */}
            <section className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-12 mb-12 md:mb-20 animate-reveal stagger-2">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b border-gray-100 pb-4 gap-4">
                    <h2 className="text-xl md:text-2xl font-bold text-slate-800">Trusted Automotive Brands</h2>
                </div>
                <div className="flex overflow-x-auto no-scrollbar gap-4 pb-4">
                    {brands.map((brand, i) => (
                        <div key={i} className="bg-white border text-center border-gray-100 h-16 md:h-20 px-6 md:px-8 flex-shrink-0 rounded-xl flex items-center justify-center shadow-sm hover:shadow-md hover:border-blue-100 transition-all cursor-pointer group">
                             <img src={brand.logo} alt={brand.name} className={`h-6 md:h-10 w-auto opacity-60 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0 filter`} />
                        </div>
                    ))}
                </div>
            </section>

            {/* MAINTENANCE GUIDES */}
            <section className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-12 mb-12 md:mb-16 animate-reveal stagger-3">
                <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-6 border-b border-gray-100 pb-4">Automotive & Bike Care Guides</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                    {/* Tip 1 */}
                    <div onClick={() => setSelectedGuide(AutoGuideData[0])} className="bg-gradient-to-r from-blue-50 to-white border border-blue-100 rounded-2xl p-4 md:p-6 flex items-center gap-4 md:gap-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer hover:scale-[1.02] active:scale-95 duration-200">
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-xl p-2 md:p-3 flex-shrink-0 shadow-inner">
                            <img src="https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=200" alt="Tyre" className="w-full h-full object-contain" />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 text-base md:text-lg mb-1 leading-tight">Tyre Care Guide</h4>
                            <p className="text-slate-500 text-[10px] md:text-xs mb-2 md:mb-3 leading-snug">Maximize grip and safety.</p>
                            <span className="text-blue-600 text-[8px] md:text-[10px] uppercase font-black tracking-widest">+ Read Expert Advice</span>
                        </div>
                    </div>
                    {/* Tip 2 */}
                    <div onClick={() => setSelectedGuide(AutoGuideData[1])} className="bg-gradient-to-r from-slate-50 to-white border border-slate-200 rounded-2xl p-4 md:p-6 flex items-center gap-4 md:gap-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer hover:scale-[1.02] active:scale-95 duration-200">
                        <div className="flex-1">
                            <h4 className="font-bold text-slate-900 text-base md:text-lg mb-1 leading-tight">Engine Oil Bible</h4>
                            <p className="text-slate-500 text-[10px] md:text-xs mb-2 md:mb-3 leading-snug">Why synthetic matters for you.</p>
                            <button className="bg-blue-600 text-white text-[8px] md:text-[10px] px-3 md:px-4 py-1.5 rounded uppercase font-black tracking-widest shadow-sm">Explore Guide &rarr;</button>
                        </div>
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-xl p-2 md:p-3 flex-shrink-0 shadow-inner">
                            <img src="https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=200" alt="Oil" className="w-full h-full object-contain" />
                        </div>
                    </div>
                    {/* Tip 3 */}
                    <div onClick={() => setSelectedGuide(AutoGuideData[2])} className="bg-gradient-to-r from-blue-50 to-white border border-blue-100 rounded-2xl p-4 md:p-6 flex items-center gap-4 md:gap-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer hover:scale-[1.02] active:scale-95 duration-200">
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-xl p-2 md:p-3 flex-shrink-0 shadow-inner">
                            <img src="https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=200" alt="Brakes" className="w-full h-full object-contain -rotate-12" />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 text-base md:text-lg mb-1 leading-tight">Brake Safety Tips</h4>
                            <p className="text-slate-500 text-[10px] md:text-xs mb-2 md:mb-3 leading-snug">Stopping power hacks.</p>
                            <button className="bg-blue-600 text-white text-[8px] md:text-[10px] px-3 md:px-4 py-1.5 rounded uppercase font-black tracking-widest shadow-sm">Learn More &rarr;</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* OFFERS RIBBON */}
            <section className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-12 mb-12 md:mb-16">
                <div className="bg-gradient-to-r from-blue-900 via-blue-700 to-indigo-900 rounded-xl flex flex-col md:flex-row items-center justify-between p-4 md:p-6 shadow-lg overflow-hidden relative">
                    <div className="flex items-center gap-3 md:gap-4 text-white z-10 w-full mb-3 md:mb-0 md:w-auto">
                        <Zap className="text-amber-400" size={20} md={24} fill="currentColor" />
                        <div className="flex items-center flex-wrap gap-1 md:gap-2 text-[11px] sm:text-base">
                            <span className="font-black whitespace-nowrap">Auto Mega Deals</span>
                            <span className="opacity-50">|</span>
                            <span>Save up to ₹2000 on Service Kits</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-start md:justify-end gap-2 w-full md:w-auto overflow-x-auto no-scrollbar pb-1 md:pb-0 z-10">
                        {['Michelin', 'Bosch', 'Castrol', 'Philips'].map(b => (
                             <div key={b} className="bg-white/10 border border-white/20 text-white px-3 md:px-4 py-1 md:py-1.5 rounded shadow whitespace-nowrap font-bold text-[8px] md:text-[10px] uppercase cursor-pointer hover:bg-white/20 transition-colors tracking-widest">{b}</div>
                        ))}
                    </div>
                </div>
            </section>

            {/* VALUE STRIP */}
            <section className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-12 border-t pt-8 md:pt-10 pb-6 md:pb-8">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    {[
                        { title: 'Premium Car Parts', sub: 'Original Standards' },
                        { title: 'Fast Shipping', sub: 'Doorstep Delivery' },
                        { title: 'Hassle-Free Returns', sub: '7 Days Policy' },
                        { title: 'Online Expert Support', sub: 'Mechanical Advice' }
                    ].map((item, i) => (
                        <div key={i} className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-2 md:gap-4 group cursor-pointer">
                            <div className="text-slate-300 group-hover:text-blue-600 transition-all duration-300 flex-shrink-0">
                                {i === 0 && <Star size={20} md={24} />}
                                {i === 1 && <ArrowRight size={20} md={24} />}
                                {i === 2 && <Zap size={20} md={24} />}
                                {i === 3 && <ShieldCheck size={20} md={24} />}
                            </div>
                            <div className="space-y-0.5">
                                <h4 className="font-bold text-xs md:text-sm text-[#3f3f46]">{item.title}</h4>
                                <p className="text-[10px] md:text-xs text-[#71717a] font-medium leading-tight">{item.sub}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* MAINTENANCE GUIDES MODAL */}
            {selectedGuide && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity" onClick={() => setSelectedGuide(null)} />
                    <div className="bg-white rounded-[24px] md:rounded-[32px] w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col relative z-10 shadow-2xl animate-reveal">
                        <div className="p-6 md:p-8 border-b border-gray-100 bg-slate-50 flex justify-between items-start">
                            <div className="pr-10">
                                <h2 className="text-xl md:text-3xl font-black text-slate-900 mb-1 md:mb-2">{selectedGuide.title}</h2>
                                <p className="text-slate-500 font-medium text-xs md:text-sm italic">{selectedGuide.subtitle}</p>
                            </div>
                            <button onClick={() => setSelectedGuide(null)} className="p-2 bg-white rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors shadow-sm border border-gray-200 flex-shrink-0"><X size={20} /></button>
                        </div>
                        <div className="p-6 md:p-8 overflow-y-auto no-scrollbar bg-white">
                            <div className="prose prose-sm md:prose-base max-w-none">
                                {selectedGuide.content.split('\n\n').map((paragraph, idx) => {
                                    if(paragraph.startsWith('###')) {
                                        return <h3 key={idx} className="text-base md:text-xl font-black mt-6 md:mt-8 mb-3 md:mb-4 border-l-4 border-blue-600 pl-3 leading-tight text-slate-800">{paragraph.replace('###', '').trim()}</h3>
                                    }
                                    return <p key={idx} className="mb-4 md:mb-5 text-[14px] md:text-[15px] leading-relaxed text-slate-600">{paragraph}</p>
                                })}
                            </div>
                        </div>
                        <div className="p-6 border-t border-gray-100 bg-slate-50 flex justify-end">
                            <button onClick={() => setSelectedGuide(null)} className="bg-blue-900 text-white px-6 md:px-8 py-2 md:py-3 rounded-full font-bold hover:bg-blue-600 transition-colors shadow-lg active:scale-95 duration-200 text-xs md:text-sm">Done Reading</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Automotive;
