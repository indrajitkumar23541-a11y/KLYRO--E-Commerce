import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ChevronRight, ArrowRight, Star, Zap, ShieldCheck, Heart, X, Sparkles, Truck, RotateCcw, Headphones } from 'lucide-react';
import API from '../api/axios';
import ProductCard from '../components/ProductCard';

const TechGuideData = [
    {
        id: 'smartphones',
        title: "Smartphone Ultimate Buying Guide (2026 Edition)",
        subtitle: "Every fundamental specification you must understand before upgrading your phone",
        content: "Upgrading your smartphone can be confusing with terms like AMOLED, Refresh Rates, and Bionic Chips floating around. Here is the ultimate, simplified breakdown to help you get the best value for your money:\n\n### 1. Display & Screen Technology\nThe screen is what you stare at 90% of the time. Look for an **AMOLED** or **OLED** panel rather than LCD; OLED allows each pixel to turn on and off individually, providing true deep blacks and vibrant colors. Secondly, prioritize the **Refresh Rate**. A 60Hz screen refreshes 60 times a second. Upgrading to a 90Hz or 120Hz display makes scrolling through social media, reading articles, and playing games feel butter-smooth and significantly more premium.\n\n### 2. Processing Power (The Chips)\nThe processor (CPU) acts as the brain, while the GPU handles graphics. If you are a heavy gamer or edit 4K videos on your phone, you need a high-end chip (like Apple's A16/A17 Pro series, or Qualcomm's Snapdragon 8 Gen-series). If you just browse WhatsApp, watch YouTube, and take normal photos, mid-range processors (like Snapdragon 7 series or MediaTek Dimensity) will easily save you money without you ever noticing a lag.\n\n### 3. RAM & Storage Capabilities\nRAM is your phone's short-term memory. In 2026, **8GB of RAM** is the recommended minimum for Android devices to allow smooth multi-tasking without apps refreshing continuously in the background. (iPhones need less due to iOS optimization). For Storage (ROM), 128GB fills up incredibly fast due to massive 4K video files, high-res photos, and large game apps. Always aim for **256GB** if you plan to keep the device for 2 to 3 years.\n\n### 4. Cameras & Megapixel Myths\nDon't fall into the ‘Megapixel Trap’. A 200MP camera isn’t automatically better than a 12MP camera. Image quality depends on the **Sensor Size** (which captures light) and **Image Processing Software** (like Apple or Google's computational photography). Look for Optical Image Stabilization (OIS) which mechanically stabilizes the camera lens to prevent blurry night shots and shaky videos.\n\n### 5. Battery Chemistry & Fast Charging\nLook for a battery capacity of around **4500mAh to 5000mAh**. However, having a massive battery is useless if it takes 3 hours to charge. Check the fast-charging wattage; a 65W or higher charging speed can comfortably take your phone from 0 to 100% in under 45 minutes!"
    },
    {
        id: 'laptops',
        title: "Laptop Purchasing Matrix",
        subtitle: "Deciphering Gaming Laptops, Student Ultrabooks, and Professional Workstations",
        content: "Laptops are long-term investments. Buying the wrong type to save a few dollars now will result in extreme frustration later. Before analyzing the spec sheet, define exactly who you are:\n\n### 1. The Light Traveler (Ultrabooks)\nIf you are a student, a writer, or a manager who travels frequently, **portability and battery life** are your top priorities. Look for Ultrabooks (like MacBook Air, HP Envy, or Dell XPS). These weigh under 1.4kg. You don't need a dedicated graphics card. Instead, look for Intel Evo certified machines or Apple Silicon (M2/M3 chips) that can effortlessly deliver **12+ hours of battery life**.\n\n### 2. The Hardcore Gamer\nGaming laptops are heavy and powerful. Your absolute priority here is the **GPU (Graphics Card)**. Do not compromise on the GPU (e.g., Nvidia RTX 4060 or AMD Radeon RX 7600m minimum). Because gaming generates immense heat, you actually *want* a thicker chassis laptop, as thin gaming laptops often suffer from 'Thermal Throttling' (slowing down because they get too hot). Be aware: gaming laptops rarely survive past 3 to 4 hours on battery power.\n\n### 3. The Professional Creator (Video Editing & 3D)\nIf you run Premiere Pro, AutoCAD, or Blender, you are bridging the gap between Gaming and Ultrabook. You need an incredible **Display Quality**. Ensure the screen has 100% sRGB or DCI-P3 color accuracy so your video colors don't look wrong when exported. Furthermore, RAM is your bottleneck here—16GB is the bare minimum, but **32GB of RAM** is highly recommended for scrubbing 4K timelines without freezing.\n\n### 4. Storage Type: HDD vs SSD\nNever buy a laptop with an HDD (Hard Disk Drive) as its main drive; it will take minutes to boot up. Always ensure the laptop is equipped with an **NVMe PCIe SSD** (Solid State Drive). It transfers data 10 times faster, allowing your laptop to turn on in literally 5 seconds."
    },
    {
        id: 'gadgets',
        title: "Smart Gadget Troubleshooting Tips",
        subtitle: "Secret hacks to fix everyday bugs and extend the lifespan of your smart devices",
        content: "Smartwatches, TWS Earbuds, and smart-home accessories run on complex micro-software. When things glitch, don't panic. Here is our expert cheat-sheet for tackling the most stubborn everyday electronic issues:\n\n### 1. Bluetooth Earbuds Refuse to Pair (One Side Not Working)\nThis usually happens when Earbud 'A' desyncs from Earbud 'B'. The fix is forcing a hard factory-reset:\n1. Open your phone’s Bluetooth menu, tap the earbuds, and click **'Forget Device'**.\n2. Put both earbuds back into the charging case and keep the lid open.\n3. Press and hold the physical button on the case for 10-15 seconds until the LED light flashes red and white.\n4. Close the lid, wait 5 seconds, reopen it, and pair them to your phone dynamically as a brand-new device.\n\n### 2. Smartwatch Notifications Delayed or Not Syncing\nYour Smartwatch relies heavily on its companion app running in the background on your phone (like the Galaxy Wearable or NoiseFit app). Your phone's battery-saver software often aggressively kills these background apps. To fix this:\nGo into your phone's 'App Settings', find your Watch App, and change the Battery Restriction from 'Optimized/Restricted' to **'Unrestricted'**. Then, lock the app in your recent-apps tray so a \"Clear All\" swipe doesn't shut it down.\n\n### 3. Preserving Lithium-Ion Battery Lifespans\nThe worst thing you can do to a lithium battery is chronically drain it to 0% and charge it to 100% overnight.\nLithium cells face extreme physical stress at the very top and very bottom of their charge limits. Ideally, keep your electronics charged between **20% and 80%**. If your smartphone or laptop has an **'Optimized Battery Charging'** toggle in the settings, turn it on immediately; it learns your sleep schedule and prevents the battery from sitting at 100% while plugged in all night.\n\n### 4. Spilled Liquid on Your Device\nIgnore the 'rice trick'—rice dust can actually get lodged in charging ports and create concrete-like paste when wet. If you spill liquid, immediately turn off the device. Do not plug it into a charger (which will short-circuit the motherboard). Wipe it down, remove SIM trays, and position the ports facing downward on a dry towel in a well-ventilated room with a fan blowing air over it for at least 24 hours before attempting to turn it back on."
    }
];

const Electronics = () => {
    const [products, setProducts] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [activeSubId, setActiveSubId] = useState(null);
    const [activeTab, setActiveTab] = useState('All');
    const [loading, setLoading] = useState(false);
    const [selectedGuide, setSelectedGuide] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "KLYRO | Electronics";
        fetchMetadata();
    }, []);

    const fetchMetadata = async () => {
        try {
            const response = await API.get('/categories');
            const raw = response.data.categories || [];
            const electronicsRoot = raw.find(c => c.name.toLowerCase() === 'electronics');
            if (electronicsRoot) {
                const subCats = raw.filter(c => c.parent_id === electronicsRoot.id);
                setSubCategories(subCats);
            }
        } catch (error) {
            console.error('Electronics metadata fetch error:', error);
        }
    };

    const fetchProducts = async (subId) => {
        setLoading(true);
        try {
            const params = { limit: 8 };
            if (subId) params.category_id = subId;
            else params.category_id = 4; 
            
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
        { name: 'Noise', logo: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 30"><text x="0" y="24" font-family="%27Arial Black%27, sans-serif" font-weight="900" font-size="28" fill="%23000">NOISE</text></svg>' },
        { name: 'HP', logo: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="%230096D6"/><text x="50" y="66" font-family="%27Arial Black%27, sans-serif" font-weight="900" font-size="50" font-style="italic" fill="%23FFFFFF" text-anchor="middle" letter-spacing="-3">hp</text></svg>' },
        { name: 'Samsung', logo: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 30"><text x="0" y="24" font-family="%27Arial Black%27, sans-serif" font-weight="900" font-size="22" fill="%231428A0" letter-spacing="-1">SAMSUNG</text></svg>' },
        { name: 'Apple', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg' },
        { name: 'JBL', logo: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 34"><rect x="0" y="0" width="84" height="34" fill="%23FF3300" rx="4"/><text x="10" y="26" font-family="%27Arial Black%27, sans-serif" font-weight="900" font-size="26" fill="%23FFFFFF">JBL</text></svg>' },
        { name: 'Sony', logo: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 30"><text x="0" y="24" font-family="%27Times New Roman%27, serif" font-weight="900" font-size="28" fill="%23000000" letter-spacing="1">SONY</text></svg>' },
        { name: 'Dell', logo: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 30"><text x="10" y="24" font-family="%27Arial Black%27, sans-serif" font-weight="900" font-size="24" fill="%23007DB8" letter-spacing="-1">DELL</text></svg>' },
        { name: 'OnePlus', logo: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 30"><rect x="0" y="0" width="30" height="30" fill="%23EB0029"/><text x="5" y="23" font-family="%27Arial Black%27, sans-serif" font-weight="900" font-size="22" fill="%23FFFFFF">1+</text><text x="36" y="22" font-family="%27Arial Black%27, sans-serif" font-weight="900" font-size="16" fill="%23EB0029">ONEPLUS</text></svg>' },
        { name: 'Vivo', logo: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 30"><text x="10" y="24" font-family="%27Arial Black%27, sans-serif" font-weight="900" font-size="28" fill="%23415FFF" letter-spacing="-1">vivo</text></svg>' },
        { name: 'Oppo', logo: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 30"><text x="5" y="24" font-family="%27Arial Black%27, sans-serif" font-weight="900" font-size="24" fill="%23006B5F" letter-spacing="2">oppo</text></svg>' },
        { name: 'Xiaomi', logo: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect x="0" y="0" width="40" height="40" fill="%23FF6700" rx="8"/><text x="4" y="28" font-family="%27Arial Black%27, sans-serif" font-weight="900" font-size="20" fill="%23FFFFFF">mi</text></svg>' },
        { name: 'Acer', logo: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 30"><text x="10" y="24" font-family="%27Arial Black%27, sans-serif" font-weight="900" font-size="26" fill="%2383B81A" letter-spacing="1">acer</text></svg>' },
        { name: 'Huawei', logo: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 30"><text x="0" y="24" font-family="%27Arial Black%27, sans-serif" font-weight="900" font-size="22" fill="%23CF0A2C">HUAWEI</text></svg>' },
        { name: 'Fire-Boltt', logo: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130 30"><text x="0" y="22" font-family="%27Arial Black%27, sans-serif" font-weight="900" font-size="16" fill="%23FF5E14" font-style="italic">FIRE-BOLTT</text></svg>' }
    ];
    const subNavbarItems = ['Electronics', 'Mobiles', 'Laptops', 'Tablets', 'Smart Gadgets', 'Accessories', 'Audio'];

    return (
        <div className="bg-[#f0f9ff] min-h-screen pt-[100px] md:pt-[120px] pb-24 page-transition font-sans">
            
            {/* SUB-NAVBAR CATEGORIES (Sticky Tech Style) */}
            <div className="bg-white border-b sticky top-[64px] md:top-[72px] lg:top-[120px] z-50 overflow-x-auto whitespace-nowrap no-scrollbar shadow-sm transition-all duration-300">
                <div className="max-w-[1440px] mx-auto flex items-center h-12 md:h-14 px-4 md:px-6 gap-6 md:gap-8">
                    <button onClick={() => { setActiveSubId(null); navigate('/electronics'); }} className={`text-[10px] md:text-[12px] font-black uppercase h-full border-b-2 transition-all ${activeSubId === null ? 'text-blue-600 border-blue-600' : 'text-gray-400 border-transparent hover:text-blue-600'}`}>Electronics</button>
                    {subNavbarItems.filter(item => item !== 'Electronics').map((item) => (
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

            {/* BREADCRUMBS */}
            <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-12 py-2 flex items-center gap-2 text-[10px] md:text-[11px] text-blue-600 font-bold uppercase tracking-wider overflow-x-auto no-scrollbar whitespace-nowrap">
                <Link to="/" className="hover:underline">Home</Link>
                <ChevronRight size={10} strokeWidth={4} className="mt-[1px] flex-shrink-0" />
                <span>Electronics</span>
            </div>

            {/* FULL-WIDTH CINEMATIC HERO */}
            <section className="mb-8 md:mb-16 w-full animate-reveal relative group px-0 md:px-6 lg:px-0">
                <div className="relative h-[40vh] md:h-[50vh] min-h-[350px] md:min-h-[450px] w-full overflow-hidden shadow-sm md:rounded-3xl lg:rounded-none border-b border-blue-50 bg-white">
                    
                    {/* Background Image */}
                    <div 
                        className="absolute inset-0 w-full bg-cover bg-center transition-transform duration-[6000ms] group-hover:scale-110 ease-out"
                        style={{ backgroundImage: `url(/assets/electronics_hero_v2.png)` }}
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#f0f9ff] via-[#f0f9ff]/90 md:via-[#f0f9ff]/80 to-transparent z-10" />

                    {/* Content Layer */}
                    <div className="relative z-20 h-full flex flex-col justify-center px-6 md:px-12 lg:px-24 max-w-[1440px] mx-auto space-y-4 md:space-y-6">

                        <div className="space-y-2 md:space-y-4">
                            <h1 className="text-4xl sm:text-6xl lg:text-8xl font-black text-[#1e3a8a] tracking-tight leading-[0.9]">
                                Tech <span className="text-cyan-500">Innovation</span>
                            </h1>
                            <p className="text-sm md:text-xl lg:text-2xl font-bold text-slate-600 tracking-tight leading-relaxed max-w-lg mb-4 md:mb-8 uppercase">
                                The Latest Gadgets at Your Fingertips.
                            </p>
                            <div className="hidden sm:flex flex-wrap gap-2 md:gap-4 pt-2">
                                {['Premium Gear', 'Innovation', 'Next-Gen Tech', 'Reliable Support'].map((bullet, i) => (
                                    <div key={i} className="bg-white/80 backdrop-blur-md px-3 md:px-4 py-1.5 rounded-full border border-blue-100 text-[8px] md:text-[10px] font-black uppercase tracking-widest text-[#1e3a8a]">
                                        {bullet}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-10 pt-2 md:pt-4">
                            <button 
                                onClick={() => navigate('/products?category_id=4')} 
                                className="bg-[#fbbf24] hover:bg-[#f59e0b] text-[#78350f] px-8 md:px-12 py-3 md:py-4 rounded-md font-black text-[10px] md:text-xs transition-all shadow-lg active:scale-95 uppercase tracking-widest"
                            >
                                Shop All Tech &rarr;
                            </button>
                            <button 
                                onClick={() => navigate('/products?category_id=4&sort=popularity')}
                                className="text-[#1e3a8a] hover:text-[#fbbf24] font-black text-[10px] md:text-xs transition-all uppercase tracking-widest flex items-center gap-2 group/btn"
                            >
                                Bestsellers <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* SHOP BY CATEGORY (Premium White Card Grid) */}
            <section className="bg-gray-50/50 py-16 md:py-24 mb-12 md:mb-20 animate-reveal stagger-1">
                <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-12">
                    <div className="flex items-center justify-between mb-12 border-b border-gray-200/50 pb-6">
                        <h2 className="text-2xl md:text-3xl font-black text-slate-800 uppercase tracking-tight">Shop by Sub-Category</h2>
                        <button onClick={() => navigate('/products')} className="text-[10px] md:text-[12px] font-black uppercase tracking-widest text-[#1e3a8a] border-2 border-blue-100 px-6 py-3 rounded-full hover:bg-[#1e3a8a] hover:text-white transition-all shadow-sm">
                            View All Categories
                        </button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
                        {[
                            { name: "Mobiles", img: "/assets/cat_mobiles.png" },
                            { name: "Laptops", img: "/assets/cat_laptops.png" },
                            { name: "Tablets", img: "/assets/cat_tablets.png" },
                            { name: "Watches", img: "/assets/cat_watches.png" },
                            { name: "Gadgets", img: "/assets/cat_gadgets.png" }
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
                                <span className="text-xs md:text-sm font-black uppercase text-gray-800 tracking-tight text-center leading-tight group-hover:text-[#1e3a8a] transition-colors">
                                    {cat.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* TOP SELLERS */}
            <section className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-12 mb-12 md:mb-20 animate-reveal stagger-2">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8 border-b border-gray-100 pb-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-6">
                        <h2 className="text-xl md:text-2xl font-bold text-[#1e293b] whitespace-nowrap">Top Sellers</h2>
                        <div className="flex bg-gray-100 p-1 rounded-full overflow-x-auto no-scrollbar gap-1 max-w-full">
                            {['All', 'Mobiles', 'Laptops'].map((tab, idx) => (
                                <button 
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-4 md:px-5 py-1.5 rounded-full text-[10px] md:text-xs font-semibold transition-all whitespace-nowrap ${activeTab === tab ? 'bg-white text-[#1e293b] shadow-sm' : 'text-[#64748b] hover:text-[#1e293b]'}`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                
                {/* Promo Banners Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8 md:mb-12">
                    <div className="rounded-[24px] md:rounded-[30px] overflow-hidden relative shadow-lg group cursor-pointer h-[200px] md:h-[240px] bg-black">
                        <img src="/assets/electronics_promo_1.png" alt="Mega Bonanza" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100" />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#0a192f]/90 via-[#0a192f]/50 to-transparent p-6 md:p-10 flex flex-col justify-center text-white">
                            <h3 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2">Up to <span className="text-[#fbbf24]">40% OFF</span></h3>
                            <p className="text-sm md:text-lg mb-4 md:mb-6 opacity-90 tracking-wide font-light">Mega Gadget Bonanza</p>
                            <button className="bg-[#fbbf24] hover:bg-[#f59e0b] text-[#78350f] px-5 md:px-6 py-2 rounded-lg font-bold text-[10px] md:text-sm w-fit transition-colors">
                                Code: AC4D28
                            </button>
                        </div>
                    </div>
                    
                    <div className="rounded-[24px] md:rounded-[30px] overflow-hidden relative shadow-md group cursor-pointer h-[200px] md:h-[240px] border border-blue-100 bg-white">
                        <img src="/assets/electronics_promo_2.png" alt="Exchange Offer" className="absolute inset-0 w-full h-full object-cover object-right group-hover:scale-105 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#e0f2fe]/95 via-[#e0f2fe]/80 to-transparent p-6 md:p-10 flex flex-col justify-center text-[#1e3a8a]">
                            <h3 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2 leading-tight">Exchange Offer</h3>
                            <p className="text-sm md:text-base text-[#475569] mb-4 md:mb-6 font-medium">Extra Off up to ₹10,000</p>
                            <button className="bg-[#1e3a8a] hover:bg-[#1e40af] text-white px-5 md:px-6 py-2 rounded-lg font-semibold text-[10px] md:text-sm w-fit transition-colors shadow-blue-900/20 shadow-lg flex items-center gap-2">
                                Shop Now &rarr;
                            </button>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        {[1,2,3,4].map(i => <div key={i} className="aspect-square bg-gray-100 rounded-2xl animate-pulse" />)}
                    </div>
                ) : products.length > 0 && (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
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

            {/* TOP BRANDS */}
            <section className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-12 mb-12 md:mb-20">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b border-gray-100 pb-4 gap-4">
                    <h2 className="text-xl md:text-2xl font-bold text-[#1e293b]">Top Tech Brands</h2>
                </div>
                <div className="flex overflow-x-auto no-scrollbar gap-4 pb-4">
                    {brands.map((brand, i) => (
                        <div key={i} className="bg-white border text-center border-gray-100 h-16 md:h-20 px-6 md:px-8 flex-shrink-0 rounded-xl flex items-center justify-center shadow-sm hover:shadow-md hover:border-blue-100 transition-all cursor-pointer group">
                             <img src={brand.logo} alt={brand.name} className={`md:h-10 opacity-60 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0 filter ${brand.name === 'Noise' ? 'h-6' : 'h-8'}`} />
                        </div>
                    ))}
                </div>
            </section>

            {/* TECH TIPS & GUIDES */}
            <section className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-12 mb-12 md:mb-16">
                <h2 className="text-xl md:text-2xl font-bold text-[#1e293b] mb-6 border-b border-gray-100 pb-4">Tech Tips & Guides</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                    {/* Tip 1 */}
                    <div onClick={() => setSelectedGuide(TechGuideData[0])} className="bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-2xl p-4 md:p-6 flex items-center gap-4 md:gap-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer hover:scale-[1.02] active:scale-95 duration-200">
                        <div className="w-16 h-20 md:w-16 md:h-24 bg-blue-50/50 rounded-lg p-2 flex-shrink-0">
                            <img src="/assets/cat_mobiles.png" alt="Phone" className="w-full h-full object-contain" />
                        </div>
                        <div>
                            <h4 className="font-bold text-[#0f172a] text-base md:text-lg mb-1 leading-tight">Smartphone Guide</h4>
                            <p className="text-[#64748b] text-[10px] md:text-xs mb-2 md:mb-3 leading-snug">Get the perfect daily companion.</p>
                            <span className="text-[#f97316] text-[8px] md:text-[10px] uppercase font-bold tracking-widest">+ Read Article</span>
                        </div>
                    </div>
                    {/* Tip 2 */}
                    <div onClick={() => setSelectedGuide(TechGuideData[1])} className="bg-gradient-to-r from-orange-50 to-white border border-orange-100/50 rounded-2xl p-4 md:p-6 flex items-center gap-4 md:gap-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer hover:scale-[1.02] active:scale-95 duration-200">
                        <div className="flex-1">
                            <h4 className="font-bold text-[#0f172a] text-base md:text-lg mb-1 leading-tight">Laptop Buying Tips</h4>
                            <p className="text-[#64748b] text-[10px] md:text-xs mb-2 md:mb-3 leading-snug">Choosing the right laptop.</p>
                            <button className="bg-[#f97316] text-white text-[8px] md:text-[10px] px-3 md:px-4 py-1.5 rounded uppercase font-bold tracking-widest shadow-sm">Explore Guide &rarr;</button>
                        </div>
                        <div className="w-20 h-16 md:w-24 md:h-20 flex-shrink-0">
                            <img src="/assets/cat_laptops.png" alt="Laptop" className="w-full h-full object-contain" />
                        </div>
                    </div>
                    {/* Tip 3 */}
                    <div onClick={() => setSelectedGuide(TechGuideData[2])} className="bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-2xl p-4 md:p-6 flex items-center gap-4 md:gap-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer hover:scale-[1.02] active:scale-95 duration-200">
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-100 rounded-xl p-2 md:p-3 flex-shrink-0">
                            <img src="/assets/cat_gadgets.png" alt="Gadget" className="w-full h-full object-contain -rotate-12" />
                        </div>
                        <div>
                            <h4 className="font-bold text-[#0f172a] text-base md:text-lg mb-1 leading-tight">Gadget How-Tos</h4>
                            <p className="text-[#64748b] text-[10px] md:text-xs mb-2 md:mb-3 leading-snug">Troubleshooting guides.</p>
                            <button className="bg-[#f97316] text-white text-[8px] md:text-[10px] px-3 md:px-4 py-1.5 rounded uppercase font-bold tracking-widest shadow-sm">Learn More &rarr;</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* BANK OFFERS RIBBON */}
            <section className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-12 mb-12 md:mb-16">
                <div className="bg-gradient-to-r from-[#1e3a8a] via-[#1e40af] to-[#991b1b] rounded-xl flex flex-col md:flex-row items-center justify-between p-4 md:p-6 shadow-lg overflow-hidden relative">
                    <div className="flex items-center gap-3 md:gap-4 text-white z-10 w-full mb-3 md:mb-0 md:w-auto">
                        <Zap className="text-yellow-400" size={20} md={24} fill="currentColor" />
                        <div className="flex items-center flex-wrap gap-1 md:gap-2 text-[11px] sm:text-base">
                            <span className="font-black whitespace-nowrap">Extra 10% Off</span>
                            <span className="opacity-50">|</span>
                            <span>Bank Offers</span>
                        </div>
                    </div>
                    
                    <div className="flex items-center justify-start md:justify-end gap-2 w-full md:w-auto overflow-x-auto no-scrollbar pb-1 md:pb-0 z-10">
                        <div className="bg-[#0f172a] border border-white/10 text-white px-3 md:px-4 py-1 md:py-1.5 rounded shadow whitespace-nowrap font-bold text-[8px] md:text-[10px] uppercase cursor-pointer hover:bg-black transition-colors"><span>HDFC Bank</span></div>
                        <div className="bg-[#2563eb] border border-white/10 text-white px-3 md:px-4 py-1 md:py-1.5 rounded shadow whitespace-nowrap font-bold text-[8px] md:text-[10px] uppercase cursor-pointer hover:bg-blue-700 transition-colors"><span>SBI</span></div>
                        <div className="bg-[#b91c1c] border border-white/10 text-white px-3 md:px-4 py-1 md:py-1.5 rounded shadow whitespace-nowrap font-bold text-[8px] md:text-[10px] uppercase cursor-pointer hover:bg-red-800 transition-colors"><span>ICICI Bank</span></div>
                        <div className="bg-[#831843] border border-white/10 text-white px-3 md:px-4 py-1 md:py-1.5 rounded shadow whitespace-nowrap font-bold text-[8px] md:text-[10px] uppercase cursor-pointer hover:bg-pink-900 transition-colors"><span>Axis Bank</span></div>
                    </div>
                </div>
            </section>

            {/* VALUE STRIP */}
            <section className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-12 border-t pt-8 md:pt-10 pb-6 md:pb-8">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    {[
                        { title: 'Latest Tech Deals', sub: 'Top Discounts' },
                        { title: 'Secure Delivery', sub: 'On orders above ₹999' },
                        { title: 'Easy Returns', sub: 'Hassle Free 7 Days' },
                        { title: '24/7 Service', sub: 'Expert Care' }
                    ].map((item, i) => (
                        <div key={i} className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-2 md:gap-4 group cursor-pointer">
                            <div className="text-[#a1a1aa] group-hover:text-[#1e3a8a] transition-all duration-300 flex-shrink-0">
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

            {/* TECH GUIDES MODAL */}
            {selectedGuide && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity" onClick={() => setSelectedGuide(null)} />
                    <div className="bg-white rounded-[24px] md:rounded-[32px] w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col relative z-10 shadow-2xl animate-reveal border border-gray-100">
                        <div className="p-6 md:p-8 border-b border-gray-100 bg-gray-50/80 flex justify-between items-start">
                            <div className="pr-10">
                                <h2 className="text-xl md:text-3xl font-black text-[#0f172a] mb-1 md:mb-2">{selectedGuide.title}</h2>
                                <p className="text-[#64748b] font-medium text-xs md:text-sm italic">{selectedGuide.subtitle}</p>
                            </div>
                            <button onClick={() => setSelectedGuide(null)} className="p-2 bg-white rounded-full text-gray-400 hover:text-red-500 hover:bg-gray-100 transition-colors shadow-sm border border-gray-200 flex-shrink-0"><X size={20} /></button>
                        </div>
                        <div className="p-6 md:p-8 overflow-y-auto no-scrollbar bg-white">
                            <div className="prose prose-sm md:prose-base prose-headings:font-black prose-headings:text-[#0f172a] prose-p:text-[#475569] prose-p:leading-relaxed max-w-none break-words">
                                {selectedGuide.content.split('\n\n').map((paragraph, idx) => {
                                    if(paragraph.startsWith('###')) {
                                        return <h3 key={idx} className="text-base md:text-xl mt-6 md:mt-8 mb-3 md:mb-4 border-l-4 border-[#f97316] pl-3 leading-tight">{paragraph.replace('###', '').trim()}</h3>
                                    }
                                    return <p key={idx} className="mb-4 md:mb-5 text-[14px] md:text-[15px]">{paragraph}</p>
                                })}
                            </div>
                        </div>
                        <div className="p-6 border-t border-gray-100 bg-gray-50/80 flex justify-end">
                            <button onClick={() => setSelectedGuide(null)} className="bg-black text-white px-6 md:px-8 py-2 md:py-3 rounded-full font-bold hover:bg-[#f97316] transition-colors shadow-lg active:scale-95 duration-200 text-xs md:text-sm">Done Reading</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Electronics;
