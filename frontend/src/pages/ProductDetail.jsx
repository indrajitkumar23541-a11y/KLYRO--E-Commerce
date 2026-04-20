import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import { ShoppingBag, ArrowLeft, Star, ShieldCheck, Truck, RefreshCw, Heart, Share2, ChevronRight, Zap, CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';

const categoryMetadata = {
    // ACADEMIC (ID 63)
    63: {
        parent: "Books & Education",
        sub: "Academic",
        usp: "Curriculum Excellence & Depth",
        features: [
            "Official Curriculum (CBSE/ICSE/NCERT)",
            "Comprehensive Theory & Problem Sets",
            "Updated with Latest Exam Patterns",
            "Authoritative Scholarly Insights",
            "High-Quality Print & Durable Binding",
            "Includes Digital Companion Access",
            "Trusted by Leading Educators"
        ],
        badges: ["https://img.icons8.com/color/48/000000/education.png", "https://img.icons8.com/color/48/000000/certificate.png", "https://img.icons8.com/color/48/000000/bookmark.png"],
        variants: [
            { label: "Paperback", multiplier: 1 },
            { label: "Hardcover", multiplier: 1.4 },
            { label: "Digital Edition", multiplier: 0.7 }
        ],
        variantLabel: "Choose Format",
        variantTitle: "Academic Pack"
    },
    // NOVELS (ID 64)
    64: {
        parent: "Books & Education",
        sub: "Novels",
        usp: "Timeless Financial Wisdom",
        features: [
            "Bestselling Literary Masterpiece",
            "Engaging Prose & Narrative Depth",
            "Compact Travel-Friendly Edition",
            "Authoritative Collaborative Works",
            "Acid-Free Sustainable Paper",
            "Premium Textured Cover Design",
            "A Must-Have for Every Library"
        ],
        badges: ["https://img.icons8.com/color/48/000000/literature.png", "https://img.icons8.com/color/48/000000/book.png", "https://img.icons8.com/color/48/000000/heart-with-pulse.png"],
        variants: [
            { label: "Paperback", multiplier: 1 },
            { label: "Hardcover", multiplier: 1.5 },
            { label: "Kindle / E-Book", multiplier: 0.6 }
        ],
        variantLabel: "Select Edition",
        variantTitle: "Premium Finish"
    },
    // STATIONERY (ID 65)
    65: {
        parent: "Books & Education",
        sub: "Stationery",
        usp: "Precision & Flow in Every Stroke",
        features: [
            "Premium Archival Grade Paper",
            "Smudge-Proof Fast-Drying Ink",
            "Ergonomic Grip for Long Writing",
            "Sustainable & Eco-Friendly Material",
            "Vibrant & Fade-Resistant Colors",
            "Professional Aesthetic Finish",
            "Perfect for Organized Note-Taking"
        ],
        badges: ["https://img.icons8.com/color/48/000000/pen.png", "https://img.icons8.com/color/48/000000/notebook.png", "https://img.icons8.com/color/48/000000/paint-palette.png"],
        variants: [
            { label: "Single Unit", multiplier: 1 },
            { label: "Set of 3", multiplier: 2.8 },
            { label: "Gift Pack", multiplier: 3.5 }
        ],
        variantLabel: "Choose Set",
        variantTitle: "Creator Series"
    },
    // STUDY MATERIAL (ID 66)
    66: {
        parent: "Books & Education",
        sub: "Study Material",
        usp: "Master Your Exams with Precision",
        features: [
            "Expertly Crafted Study Modules",
            "Previous Year Question Banks",
            "Quick Revision Summary Cards",
            "Mind-Maps & Visual Learning Aids",
            "Step-by-Step Detailed Solutions",
            "Peer-Reviewed Academic Content",
            "Comprehensive Competitive Edge"
        ],
        badges: ["https://img.icons8.com/color/48/000000/test-passed.png", "https://img.icons8.com/color/48/000000/brain.png", "https://img.icons8.com/color/48/000000/idea.png"],
        variants: [
            { label: "Standard Pack", multiplier: 1 },
            { label: "Full Kit", multiplier: 2.5 },
            { label: "Revision Unit", multiplier: 0.8 }
        ],
        variantLabel: "Select Prep",
        variantTitle: "Exam Ready"
    },
    // LEARNING TOYS (ID 67)
    67: {
        parent: "Books & Education",
        sub: "Learning Toys",
        usp: "Play. Learn. Grow.",
        features: [
            "S.T.E.M Inspired Educational Play",
            "Non-Toxic BPA-Free Safe Materials",
            "Develops Fine Motor & Cognitive Skills",
            "Interactive Problem-Solving Tasks",
            "Engaging Colors & Tactile Textures",
            "Curated for Developmental Milestones",
            "Durable Design for Endless Fun"
        ],
        badges: ["https://img.icons8.com/color/48/000000/toy.png", "https://img.icons8.com/color/48/000000/puzzle.png", "https://img.icons8.com/color/48/000000/baby-bottle.png"],
        variants: [
            { label: "Basic Set", multiplier: 1 },
            { label: "Advanced Kit", multiplier: 2 },
            { label: "Pro Explorer", multiplier: 3.5 }
        ],
        variantLabel: "Choose Growth",
        variantTitle: "Small Genius"
    },
    // DEFAULT / ELECTRONICS
    default: {
        parent: "Electronics",
        sub: "Mobiles",
        usp: "High Performance Professional",
        features: [
            "128 GB ROM, Latest Software v17",
            "6.1\" Ultra-HD Pro XDR Display (120Hz)",
            "Powerful A17 Bionic Hybrid Chipset",
            "Advanced Pro Triple Sensor Camera System",
            "Lightweight Strong Professional Build",
            "Superfast 5G, All-day Battery Life",
            "Dynamic Interface Integration"
        ],
        badges: ["https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg", "https://img.icons8.com/color/48/000000/intel.png", "https://img.icons8.com/color/48/000000/google-logo.png"],
        variants: [
            { label: "64 GB", multiplier: 1 },
            { label: "128 GB", multiplier: 1.2 },
            { label: "256 GB", multiplier: 1.5 }
        ],
        variantLabel: "Choose Storage",
        variantTitle: "Pro Model"
    }
};

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('Product Details');
    const [mainImage, setMainImage] = useState(null);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const { addToCart } = useCart();
    const navigate = useNavigate();

    const handleInstantCheckout = async () => {
        await addToCart(product.id, 1);
        navigate('/cart');
    };

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const response = await API.get(`/products/${id}`);
                const { success, product } = response.data;
                if (success) {
                    setProduct(product);
                    setMainImage(product.image);
                    const meta = categoryMetadata[product.category_id] || categoryMetadata.default;
                    if (meta.variants && meta.variants.length > 0) {
                        setSelectedVariant(meta.variants[0]);
                    }
                }
            } catch (error) {
                console.error('Error fetching product detail:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [id]);

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#fcfdfd]">
            <div className="relative w-16 h-16">
                <div className="absolute inset-0 border-2 border-accent-color/20 rounded-full"></div>
                <div className="absolute inset-0 border-t-2 border-accent-color rounded-full animate-spin"></div>
            </div>
        </div>
    );
    
    if (!product) return (
        <div className="bg-[#fcfdfd] min-h-screen flex items-center justify-center pt-32 p-6 text-center">
            <div className="space-y-6">
                 <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tighter">Product Not Found</h1>
                 <button onClick={() => navigate('/products')} className="px-10 py-4 bg-accent-color text-white rounded-full font-black uppercase text-xs">Back To Shop</button>
            </div>
        </div>
    );

    const meta = categoryMetadata[product.category_id] || categoryMetadata.default;
    const isBook = meta.parent === "Books & Education";
    const themeColor = isBook ? "text-[#F37021]" : "text-blue-600";
    const themeBg = isBook ? "bg-[#F37021]" : "bg-blue-600";
    const themeBorder = isBook ? "border-[#F37021]" : "border-blue-600";
    const themeLightBg = isBook ? "bg-orange-50" : "bg-blue-50";
    const themeLightText = isBook ? "text-orange-600" : "text-blue-600";

    return (
        <div className="bg-[#fcfdfd] min-h-screen pt-[72px] lg:pt-[120px] page-transition">
            
            {/* SUB-NAVBAR */}
            <div className="bg-white border-b hidden lg:block overflow-x-auto whitespace-nowrap scrollbar-hide">
                <div className="max-w-[1440px] mx-auto flex items-center h-12 px-6 gap-8 text-[11px] font-bold text-gray-500">
                    <Link to="/" className="hover:text-accent-color transition-colors">Home</Link>
                    <ChevronRight size={12} className="text-gray-300" />
                    <Link to={isBook ? "/books-education" : "/beauty-health"} className="hover:text-accent-color transition-colors uppercase">{meta.parent}</Link>
                    <Link to="#" className="hover:text-accent-color transition-colors uppercase font-black text-black border-b-2 border-black h-full flex items-center">{meta.sub}</Link>
                    <Link to="#" className="hover:text-accent-color transition-colors uppercase">Trending</Link>
                    <Link to="#" className="hover:text-accent-color transition-colors uppercase">Offers</Link>
                </div>
            </div>

            {/* VISUAL SECTION (Full Width on Mobile) */}
            <section className="relative overflow-hidden bg-white">
                <div className="max-w-[1440px] mx-auto">
                    <div className="flex flex-col lg:flex-row lg:gap-24 relative z-10 transition-all duration-700">
                        {/* IMAGE AREA (Mobile: Full Width, No Padding) */}
                        <div className="w-full lg:w-1/2 flex flex-col items-center animate-reveal lg:order-2">
                             <div className="relative w-full aspect-square md:max-w-[500px] flex items-center justify-center bg-gray-50/30">
                                 <img 
                                    src={mainImage} 
                                    alt={product.name} 
                                    className="w-full h-full object-contain filter drop-shadow-[0_40px_80px_rgba(0,0,0,0.1)] transition-all duration-700 hover:scale-105" 
                                 />
                                 
                                 <div className="absolute top-6 right-6 flex flex-col gap-4 z-20">
                                     <button className="w-10 h-10 md:w-12 md:h-12 bg-white/80 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center text-gray-300 hover:text-pink-500 transition-all active:scale-95 border border-white"><Heart size={18} /></button>
                                     <button className="w-10 h-10 md:w-12 md:h-12 bg-white/80 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center text-gray-300 hover:text-blue-500 transition-all active:scale-95 border border-white"><Share2 size={18} /></button>
                                 </div>

                                 {/* Custom Badge */}
                                 <div className="absolute bottom-6 left-6">
                                     <span className="bg-[#717fe0] text-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-xl">Exclusive Release</span>
                                 </div>
                             </div>

                             <div className="flex gap-3 px-6 pb-6 overflow-x-auto w-full no-scrollbar lg:justify-center md:pb-12 mt-6">
                                 {[product.image, product.image, product.image].map((img, i) => (
                                     <div 
                                        key={i} 
                                        onClick={() => setMainImage(img)}
                                        className={`flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden cursor-pointer border-2 transition-all p-2 flex items-center justify-center bg-white ${mainImage === img ? 'border-[#717fe0] shadow-lg' : 'border-transparent opacity-60'}`}
                                     >
                                         <img src={img} alt="Thumb" className="max-w-full max-h-full object-contain" />
                                     </div>
                                 ))}
                             </div>
                        </div>

                        {/* CONTENT AREA */}
                        <div className="w-full lg:w-1/2 space-y-8 md:space-y-10 px-6 pt-8 pb-32 md:pb-24 animate-reveal order-2 lg:order-1">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex text-orange-400">
                                        {[1,2,3,4,5].map(i => <Star key={i} size={12} fill="currentColor" />)}
                                    </div>
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mt-0.5">Highly Recommended</span>
                                </div>
                                <h1 className="text-3xl md:text-5xl font-black text-[#1e293b] tracking-tight leading-tight">{product.name}</h1>
                                <p className="text-lg md:text-xl font-bold text-gray-400">{meta.usp}</p>
                            </div>

                            <div className="space-y-4 py-4 md:py-6 border-y border-gray-100">
                                <div className="flex items-baseline gap-4">
                                     <span className="text-4xl md:text-6xl font-black text-gray-900 leading-none tracking-tighter">
                                        ₹{Math.floor(product.price * (selectedVariant?.multiplier || 1))}
                                     </span>
                                     <span className="text-xl font-bold text-gray-300 line-through">
                                        ₹{Math.floor(product.price * (selectedVariant?.multiplier || 1) * 1.4)}
                                     </span>
                                     <span className="text-green-600 bg-green-50 font-black text-[9px] uppercase px-3 py-1 rounded-lg">Best Price Online</span>
                                </div>
                                <div className="flex items-center gap-2 text-[#717fe0]">
                                    <CheckCircle size={14} />
                                    <p className="text-[10px] font-black uppercase tracking-widest">In Stock • Ships within 24 hours</p>
                                </div>
                            </div>

                            {/* Specification Checklist */}
                            <div className="space-y-6">
                                <h3 className="text-sm font-black uppercase tracking-widest text-[#1e293b]">Core Specifications</h3>
                                <div className="grid grid-cols-1 gap-4">
                                    {meta.features.map((feat, i) => (
                                        <div key={i} className="flex gap-4 p-4 rounded-2xl bg-gray-50/50 border border-transparent hover:border-gray-100 transition-all hover:bg-white group">
                                            <div className="w-5 h-5 rounded-full bg-white shadow-sm flex items-center justify-center text-green-500 group-hover:bg-green-500 group-hover:text-white transition-all transform group-hover:scale-110">
                                                <CheckCircle size={12} />
                                            </div>
                                            <span className="text-[12px] font-bold text-gray-700">{feat}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Action Buttons (Desktop Only) */}
                            <div className="hidden md:flex gap-4 pt-10">
                                <button 
                                    onClick={() => addToCart(product.id)}
                                    className="flex-grow bg-[#1e293b] text-white py-5 rounded-3xl font-black text-[14px] uppercase tracking-widest flex items-center justify-center gap-4 transition-all hover:bg-accent-color shadow-2xl"
                                >
                                    Add to Collection
                                </button>
                                <button 
                                    onClick={handleInstantCheckout}
                                    className="px-12 py-5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-3xl font-black text-[14px] uppercase tracking-widest transition-all"
                                >
                                    Quick Checkout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* MOBILE ONLY: Sticky Footer CTA */}
            <div className="md:hidden fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-xl border-t border-gray-100 p-4 z-[150] shadow-[0_-20px_50px_rgba(0,0,0,0.1)] animate-reveal-up">
                <div className="flex gap-4 max-w-sm mx-auto">
                    <button className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 active:scale-95 transition-all"><Heart size={20} /></button>
                    <button 
                        onClick={() => addToCart(product.id)}
                        className="flex-grow bg-[#1e293b] text-white rounded-2xl font-black uppercase text-[12px] tracking-widest active:scale-95 shadow-xl shadow-black/20"
                    >
                        Add to Bag • ₹{Math.floor(product.price * (selectedVariant?.multiplier || 1))}
                    </button>
                </div>
            </div>


            {/* PRODUCT DETAILS TABS & CONTENT */}
            <section className="bg-white py-20 px-6">
                <div className="max-w-[1440px] mx-auto">
                    <div className="flex border-b mb-12 overflow-x-auto scrollbar-hide">
                        {['Product Details', 'Reviews (2,556)', 'FAQs'].map(tab => (
                            <button 
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-10 py-5 text-[11px] font-black uppercase tracking-widest border-b-4 transition-all whitespace-nowrap ${activeTab === tab ? (isBook ? 'border-orange-500 text-orange-600' : 'border-blue-600 text-blue-600') : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
                        {/* LEFT: KEY FEATURES */}
                        <div className="lg:col-span-8 bg-[#f8fafc] p-6 md:p-12 rounded-[30px] md:rounded-[40px] space-y-8 md:space-y-12">
                             <div className="space-y-6">
                                <h3 className="text-2xl font-black text-[#1e293b]">Key Benefits</h3>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {meta.features.map((feat, i) => (
                                        <li key={i} className="flex items-center gap-4 text-gray-600 font-bold text-sm">
                                            <div className={`w-5 h-5 rounded-full ${isBook ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'} flex items-center justify-center`}><CheckCircle size={12} /></div>
                                            {feat}
                                        </li>
                                    ))}
                                </ul>
                             </div>

                             <div className="flex flex-wrap gap-10 opacity-30 pt-10 border-t items-center justify-center md:justify-start grayscale">
                                 {meta.badges.map((badge, i) => (
                                     <img key={i} src={badge} alt="Badge" className="h-8" />
                                 ))}
                             </div>
                        </div>

                        {/* RIGHT: VARIANTS */}
                        <div className="lg:col-span-4 space-y-8">
                             <div className="bg-white p-8 rounded-[40px] shadow-[0_25px_60px_rgba(0,0,0,0.06)] border border-gray-50 space-y-8">
                                <h3 className="font-black text-gray-500 uppercase tracking-widest text-xs">{meta.variantLabel}</h3>
                                
                                <div className="space-y-4">
                                     <div className="flex flex-wrap gap-2">
                                         {meta.variants.map((v, i) => (
                                             <button 
                                                key={i} 
                                                onClick={() => setSelectedVariant(v)}
                                                className={`px-6 py-3 rounded-xl border-2 transition-all font-black text-[10px] uppercase ${selectedVariant?.label === v.label ? (isBook ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-blue-500 bg-blue-50 text-blue-600') : 'border-gray-100 text-gray-400 hover:border-gray-200'}`}
                                             >
                                                 {v.label}
                                             </button>
                                         ))}
                                     </div>
                                </div>

                                <div className={`${isBook ? 'bg-orange-50 hover:bg-orange-100' : 'bg-blue-50 hover:bg-blue-100'} p-6 rounded-[30px] flex items-center justify-between group cursor-pointer transition-colors`}>
                                     <div className="space-y-1">
                                         <h4 className={`font-black text-xs uppercase ${isBook ? 'text-orange-600' : 'text-blue-600'}`}>Selected Selection</h4>
                                         <p className="font-black text-[10px] text-gray-400 uppercase italic">{selectedVariant?.label || meta.variantTitle}</p>
                                     </div>
                                     <button className={`w-12 h-12 rounded-2xl ${isBook ? 'bg-orange-500' : 'bg-blue-500'} text-white flex items-center justify-center transition-transform group-hover:scale-110 shadow-lg shadow-orange-200`}><ShoppingBag size={20} /></button>
                                </div>
                             </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* TRUST BOTTOM */}
            <section className="bg-gray-50 border-t py-12 px-6 text-center lg:text-left">
                <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {[
                        { icon: <ShieldCheck size={32} />, title: '100% Genuine', sub: 'Verified Sources Only' },
                        { icon: <Truck size={32} />, title: 'Luxe Global Shipping', sub: 'Priority Delivery v2' },
                        { icon: <RefreshCw size={32} />, title: 'Easy Returns', sub: 'Hassle-Free Policy' },
                        { icon: <ShieldCheck size={32} />, title: 'Safe Checkout', sub: '256-Bit Encrypted' }
                    ].map((item, i) => (
                        <div key={i} className="flex flex-col lg:flex-row items-center gap-6 group cursor-pointer">
                            <div className={`w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-gray-400 group-hover:${isBook ? 'text-orange-600' : 'text-blue-600'} transition-all`}>{item.icon}</div>
                            <div>
                                <h4 className="font-black text-xs uppercase tracking-widest">{item.title}</h4>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mt-1">{item.sub}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default ProductDetail;
