import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import { 
    ShoppingBag, ShieldCheck, Truck, RefreshCw, 
    Heart, Share2, ChevronRight, Zap, CheckCircle, 
    Info, Package, MapPin, Lock, ChevronDown, 
    ShoppingCart
} from 'lucide-react';
import { useCart } from '../context/CartContext';

import ProductExpertAI from '../components/ProductExpertAI';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [mainImage, setMainImage] = useState(null);
    const [isZoomed, setIsZoomed] = useState(false);
    const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
    const { addToCart } = useCart();
    const navigate = useNavigate();
    const mainImageRef = useRef(null);

    const handleInstantCheckout = async () => {
        await addToCart(product.id, 1);
        navigate('/checkout');
    };

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const response = await API.get(`/products/${id}`);
                const { success, product } = response.data;
                if (success) {
                    setProduct(product);
                    setMainImage(product.image);
                }
            } catch (error) {
                console.error('Error fetching product detail:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
        window.scrollTo(0, 0);
    }, [id]);

    const handleMouseMove = (e) => {
        if (!mainImageRef.current) return;
        const { left, top, width, height } = mainImageRef.current.getBoundingClientRect();
        const x = ((e.pageX - left - window.scrollX) / width) * 100;
        const y = ((e.pageY - top - window.scrollY) / height) * 100;
        setZoomPos({ x, y });
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-vh-100 bg-white">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
    
    if (!product) return (
        <div className="min-h-screen flex items-center justify-center p-6 text-center">
            <div className="space-y-6">
                 <h1 className="text-3xl font-bold text-gray-900 uppercase">Product Not Found</h1>
                 <button onClick={() => navigate('/products')} className="px-8 py-3 bg-blue-600 text-white rounded-lg font-bold">Return to Shop</button>
            </div>
        </div>
    );

    // Helper to generate bullet points from description
    const descriptionBullets = product.description 
        ? product.description.split('\n').filter(line => line.trim().length > 0).slice(0, 5)
        : ["Quality tested selection", "Prime eligible standards", "Secure packaging assured"];

    return (
        <div className="bg-white min-h-screen pt-[72px] lg:pt-[100px] animate-reveal">
            
            {/* Breadcrumbs */}
            <div className="max-w-[1500px] mx-auto px-4 md:px-8 py-4 text-[13px] text-gray-500 whitespace-nowrap overflow-x-auto no-scrollbar">
                <div className="flex items-center gap-2">
                    <Link to="/" className="hover:text-[#c45500] hover:underline">Home</Link>
                    <ChevronRight size={12} className="text-gray-300" />
                    <Link to="/products" className="hover:text-[#c45500] hover:underline">Marketplace</Link>
                    <ChevronRight size={12} className="text-gray-300" />
                    <span className="text-[#c45500] font-medium">{product.category_name || 'General Product'}</span>
                </div>
            </div>

            {/* Amazon 3-Column Layout */}
            <main className="max-w-[1500px] mx-auto px-4 md:px-8 pb-20">
                <div className="flex flex-col lg:flex-row gap-8">
                    
                    {/* COLUMN 1: GALLERY AREA */}
                    <div className="w-full lg:w-[45%] flex flex-col md:flex-row gap-4">
                        {/* Thumbnails (Desktop: Vertical, Mobile: Horizontal) */}
                        <div className="order-2 md:order-1 flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto no-scrollbar md:h-[500px] flex-shrink-0">
                            {(product.images && product.images.length > 0) ? product.images.map((img, i) => (
                                <div 
                                    key={i} 
                                    onMouseEnter={() => setMainImage(img.image_url)}
                                    className={`w-12 h-12 md:w-16 md:h-16 border-2 rounded-lg p-1 cursor-pointer transition-all bg-white flex-shrink-0 flex items-center justify-center ${mainImage === img.image_url ? 'border-[#e77600] shadow-[0_0_8px_rgba(231,118,0,0.4)]' : 'border-gray-200 hover:border-[#e77600]'}`}
                                >
                                    <img src={img.image_url} alt="" className="max-w-full max-h-full object-contain" />
                                </div>
                            )) : (
                                <div className="w-16 h-16 border-2 border-[#e77600] rounded-lg p-1 bg-white flex items-center justify-center">
                                    <img src={product.image} alt="" className="max-w-full max-h-full object-contain" />
                                </div>
                            )}
                        </div>

                        {/* Main Image with Zoom */}
                        <div className="order-1 md:order-2 flex-grow relative bg-white">
                            <div 
                                ref={mainImageRef}
                                className="w-full aspect-square border border-gray-100 rounded-xl overflow-hidden flex items-center justify-center cursor-crosshair group relative"
                                onMouseEnter={() => setIsZoomed(true)}
                                onMouseLeave={() => setIsZoomed(false)}
                                onMouseMove={handleMouseMove}
                            >
                                <img 
                                    src={mainImage} 
                                    alt={product.name} 
                                    className={`w-full h-full object-contain transition-transform duration-200 ${isZoomed ? 'opacity-0' : 'opacity-100'}`}
                                />
                                
                                {/* Zoom Window */}
                                {isZoomed && (
                                    <div 
                                        className="absolute inset-0 z-50 pointer-events-none bg-no-repeat bg-white"
                                        style={{
                                            backgroundImage: `url(${mainImage})`,
                                            backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                                            backgroundSize: '200%'
                                        }}
                                    />
                                )}

                                {/* Hover Prompt */}
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white text-[10px] font-bold px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                    Roll over image to zoom in
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* COLUMN 2: INFO AREA */}
                    <div className="w-full lg:w-[35%] space-y-4">
                        <div className="border-b border-gray-100 pb-4">
                            <Link to="#" className="text-[#007185] hover:text-[#c45500] hover:underline text-sm font-medium">Visit the KLYRO Premier Store</Link>
                            <h1 className="text-2xl font-medium text-[#111] leading-tight mt-1">{product.name}</h1>
                        </div>

                        {/* Price Area */}
                        <div className="space-y-1">
                             <div className="flex items-start gap-1">
                                <span className="text-red-600 text-2xl font-light">-33%</span>
                                <div className="flex flex-col">
                                    <div className="flex items-start">
                                        <span className="text-xs font-medium mt-2">₹</span>
                                        <span className="text-3xl font-medium tracking-tight">{Math.floor(product.price).toLocaleString()}</span>
                                    </div>
                                    <span className="text-gray-500 text-xs mt-1">M.R.P.: <span className="line-through">₹{(product.price * 1.5).toLocaleString()}</span></span>
                                </div>
                             </div>
                             <p className="text-sm text-gray-700">Inclusive of all taxes</p>
                             <div className="mt-4 flex flex-wrap gap-2">
                                 <span className="bg-[#f0f2f2] text-[#555] px-2 py-1 rounded text-[11px] font-medium border border-gray-200">Pay on Delivery</span>
                                 <span className="bg-[#f0f2f2] text-[#555] px-2 py-1 rounded text-[11px] font-medium border border-gray-200">7 Days Replacement</span>
                                 <span className="bg-[#f0f2f2] text-[#555] px-2 py-1 rounded text-[11px] font-medium border border-gray-200">KLYRO Delivered</span>
                             </div>
                        </div>

                         {/* About this item */}
                        <div className="pt-6 border-t border-gray-100">
                             <h3 className="text-base font-bold text-[#111] mb-2 uppercase text-[15px]">About this item</h3>
                             <ul className="space-y-2 list-disc pl-5">
                                 {descriptionBullets.map((bullet, i) => (
                                     <li key={i} className="text-sm text-[#111] leading-relaxed">{bullet}</li>
                                 ))}
                             </ul>
                             <button className="text-[#007185] hover:text-[#c45500] hover:underline text-sm font-bold mt-4 flex items-center gap-1 uppercase tracking-tighter">
                                See more product details <ChevronDown size={14}/>
                             </button>
                        </div>

                        {/* AI PRODUCT EXPERT INTEGRATION */}
                        <ProductExpertAI product={product} />
                    </div>

                    {/* COLUMN 3: BUY BOX (STICKY) */}
                    <div className="w-full lg:w-[20%]">
                        <div className="lg:sticky lg:top-32 border border-gray-100 rounded-xl p-6 space-y-6 bg-white shadow-sm hover:shadow-md transition-shadow">
                             <div className="space-y-4">
                                <div className="flex items-start">
                                    <span className="text-xs font-medium mt-1">₹</span>
                                    <span className="text-3xl font-medium tracking-tight">{Math.floor(product.price).toLocaleString()}</span>
                                </div>
                                
                                <div className="space-y-3">
                                    <div className="flex gap-2">
                                        <MapPin size={18} className="text-gray-500 shrink-0 mt-0.5" />
                                        <span className="text-[#007185] text-xs font-medium hover:text-[#c45500] cursor-pointer">Deliver to Indrajit - Bangalore 560001</span>
                                    </div>
                                    <p className="text-[#007600] text-sm font-bold">In Stock</p>
                                    <div className="text-xs text-[#565959] space-y-1">
                                        <p>Ships from <span className="text-[#111]">KLYRO Warehouse</span></p>
                                        <p>Sold by <span className="text-[#007185] hover:text-[#c45500]">{product.seller_name || 'Verified Seller'}</span></p>
                                    </div>
                                </div>
                             </div>

                             {/* CTAs */}
                             <div className="space-y-3">
                                 <button 
                                    onClick={() => addToCart(product.id)}
                                    className="w-full bg-[#ffd814] hover:bg-[#f7ca00] text-[#111] py-2.5 rounded-full font-medium text-sm transition-colors border border-[#fcd200] shadow-sm flex items-center justify-center gap-2"
                                 >
                                     <ShoppingCart size={18} /> Add to Cart
                                 </button>
                                 <button 
                                    onClick={handleInstantCheckout}
                                    className="w-full bg-[#ffa41c] hover:bg-[#fa8900] text-[#111] py-2.5 rounded-full font-medium text-sm transition-colors border border-[#ff8f00] shadow-sm flex items-center justify-center gap-2"
                                 >
                                     <Zap size={18} /> Buy Now
                                 </button>
                             </div>

                             <div className="flex items-center gap-2 text-[#007185] text-xs font-medium hover:text-[#c45500] cursor-pointer">
                                 <Lock size={14} className="text-gray-400" />
                                 Secure transaction
                             </div>

                             <div className="pt-4 border-t border-gray-100">
                                 <button className="w-full py-1.5 border border-gray-300 rounded-lg text-xs font-medium hover:bg-gray-50 transition-colors shadow-sm">
                                     Add to Wish List
                                 </button>
                             </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* PRODUCT INFORMATION TABLE */}
            <section className="bg-white border-t border-gray-100 py-16 px-4 md:px-8">
                 <div className="max-w-[1200px] mx-auto">
                    <h3 className="text-lg font-bold text-[#111] mb-8 uppercase tracking-widest border-b-2 border-accent-color inline-block pb-1">Product Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                         <div className="space-y-4">
                            <h4 className="font-bold text-[#111] text-sm">Technical Details</h4>
                            <table className="w-full text-sm">
                                <tbody className="divide-y divide-gray-100">
                                    <tr><td className="py-3 px-4 bg-gray-50 font-bold w-1/3">Category</td><td className="py-3 px-4">{product.category_name || 'General'}</td></tr>
                                    <tr><td className="py-3 px-4 bg-gray-50 font-bold">Brand</td><td className="py-3 px-4">KLYRO Premier</td></tr>
                                    <tr><td className="py-3 px-4 bg-gray-50 font-bold">Manufacturer</td><td className="py-3 px-4">Certified Manufacturer</td></tr>
                                    <tr><td className="py-3 px-4 bg-gray-50 font-bold">Item Model Number</td><td className="py-3 px-4">KLY-PRO-{product.id}</td></tr>
                                </tbody>
                            </table>
                         </div>
                         <div className="space-y-4">
                            <h4 className="font-bold text-[#111] text-sm">Additional Information</h4>
                            <table className="w-full text-sm">
                                <tbody className="divide-y divide-gray-100">
                                    <tr><td className="py-3 px-4 bg-gray-50 font-bold w-1/3">ASIN (K-SIN)</td><td className="py-3 px-4">B0X{product.id}Y9Z</td></tr>
                                    <tr><td className="py-3 px-4 bg-gray-50 font-bold">Date First Available</td><td className="py-3 px-4">{new Date(product.created_at).toLocaleDateString()}</td></tr>
                                    <tr><td className="py-3 px-4 bg-gray-50 font-bold">Generic Name</td><td className="py-3 px-4">{product.name.split(' ')[0]}</td></tr>
                                </tbody>
                            </table>
                         </div>
                    </div>

                    <div className="mt-16 space-y-6">
                        <h3 className="text-lg font-bold text-[#111] border-b pb-4">Product Description</h3>
                        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap max-w-4xl">
                            {product.description || "The KLYRO Premier collection brings you top-tier quality products curated from verified sellers across the globe. This item has passed our 12-point quality check to ensure a premium experience."}
                        </p>
                    </div>
                 </div>
            </section>
        </div>
    );
};

export default ProductDetail;
