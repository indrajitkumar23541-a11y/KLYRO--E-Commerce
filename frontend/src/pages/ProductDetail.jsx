import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import {
    ChevronLeft, ShoppingBag, Heart, Share2,
    ChevronRight, Star, MapPin, Award, RefreshCw,
    ShoppingCart, Eye, GitCompare, SlidersHorizontal,
    ArrowUpDown, Clock, Zap, Check
} from 'lucide-react';
import { useCart } from '../context/CartContext';

/* ── Star Rating ─────────────────────────────────────── */
const Stars = ({ rating = 4, count }) => (
    <div className="flex items-center gap-1">
        <div className="flex gap-0.5">
            {[1,2,3,4,5].map(s => (
                <Star key={s} size={12}
                    fill={s <= rating ? '#FBBF24' : 'none'}
                    className={s <= rating ? 'text-yellow-400' : 'text-gray-200'}
                />
            ))}
        </div>
        {count && <span className="text-[11px] text-gray-400 font-medium">{count.toLocaleString()}</span>}
    </div>
);

/* ── Similar Product Card ────────────────────────────── */
const SimilarCard = ({ product }) => {
    const reviews = Math.floor(Math.random() * 300000) + 1000;
    const discount = Math.floor(Math.random() * 40 + 10);
    return (
        <Link to={`/product/${product.id}`}
            className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 active:scale-95 transition-all block">
            <div className="relative aspect-square bg-gray-50">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                <span className="absolute top-2 left-2 bg-[#FF4B5C] text-white text-[7px] font-black px-1.5 py-0.5 rounded-md">
                    -{discount}%
                </span>
            </div>
            <div className="p-2.5">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-0.5">Premium Item</p>
                <p className="text-[11px] font-bold text-gray-800 line-clamp-2 leading-tight">{product.name}</p>
                <Stars rating={4} />
                <div className="flex items-baseline gap-1.5 mt-1">
                    <span className="text-[13px] font-black text-gray-900">₹{product.price?.toLocaleString()}</span>
                </div>
                <p className="text-[8px] text-gray-400 mt-0.5">{reviews.toLocaleString()}</p>
            </div>
        </Link>
    );
};

/* ══════════════════════════════════════════════════════
   PRODUCT DETAIL PAGE
══════════════════════════════════════════════════════ */
const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState('7UK');
    const [hearted, setHearted] = useState(false);
    const [addingCart, setAddingCart] = useState(false);
    const [addedCart, setAddedCart] = useState(false);
    const [showMore, setShowMore] = useState(false);
    const [currentImg, setCurrentImg] = useState(0);
    const [similarProducts, setSimilarProducts] = useState([]);
    const { addToCart } = useCart();
    const navigate = useNavigate();

    const sizes = ['6UK', '7UK', '8UK', '9UK', '10UK'];
    const discount = 50;

    useEffect(() => {
        (async () => {
            try {
                const r = await API.get(`/products/${id}`);
                if (r.data.success) {
                    setProduct(r.data.product);
                    // Fetch similar
                    const catId = r.data.product.category_id;
                    const sr = await API.get('/products', { params: { limit: 4, category_id: catId } });
                    setSimilarProducts((sr.data.products || []).filter(p => p.id !== r.data.product.id).slice(0, 4));
                }
            } catch { }
            finally { setLoading(false); }
        })();
        window.scrollTo(0, 0);
    }, [id]);

    const handleAddToCart = async () => {
        setAddingCart(true);
        await addToCart(product.id, 1);
        setAddingCart(false);
        setAddedCart(true);
        setTimeout(() => setAddedCart(false), 2000);
    };

    const handleBuyNow = async () => {
        await addToCart(product.id, 1);
        navigate('/checkout');
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen bg-white">
            <div className="w-10 h-10 border-4 border-[#1A56DB] border-t-transparent rounded-full animate-spin" />
        </div>
    );

    if (!product) return (
        <div className="min-h-screen flex items-center justify-center text-center p-6">
            <div>
                <h2 className="text-xl font-black text-gray-800 mb-4">Product Not Found</h2>
                <button onClick={() => navigate('/products')}
                    className="bg-[#1A56DB] text-white px-8 py-3 rounded-full font-black">
                    Back to Shop
                </button>
            </div>
        </div>
    );

    const originalPrice = Math.floor(product.price * 2);
    const images = [product.image, product.image, product.image];
    const reviews = 56890;
    const descriptionLong = product.description
        ? product.description
        : 'This is a premium high-quality product from KLYRO. Carefully crafted to provide the best experience and durability.';
    const descShort = descriptionLong.length > 180 ? descriptionLong.slice(0, 180) + '...' : descriptionLong;

    return (
        <div className="bg-[#F5F6FA] min-h-screen pb-24 md:pb-0">

            {/* ═══════ MOBILE UI ═══════ */}
            <div className="md:hidden">

                {/* ── HEADER ───────────────────────────── */}
                <div className="bg-white px-4 pt-10 pb-3 sticky top-0 z-50 flex items-center justify-between shadow-sm">
                    <button onClick={() => navigate(-1)}
                        className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 active:scale-90 transition-all">
                        <ChevronLeft size={22} className="text-gray-700" />
                    </button>
                    <div className="flex items-center gap-3">
                        <button onClick={() => setHearted(h => !h)}
                            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100">
                            <Heart size={20} className={hearted ? 'text-red-500 fill-red-500' : 'text-gray-600'} />
                        </button>
                        <button onClick={() => navigate('/cart')}
                            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100">
                            <ShoppingCart size={20} className="text-gray-600" />
                        </button>
                    </div>
                </div>

                {/* ── PRODUCT IMAGE CAROUSEL ───────────── */}
                <div className="bg-white relative">
                    <div className="relative h-[320px] overflow-hidden">
                        {images.map((img, i) => (
                            <div key={i}
                                className={`absolute inset-0 transition-all duration-500 ${i === currentImg ? 'opacity-100' : 'opacity-0'}`}>
                                <img src={img} alt={product.name}
                                    className="w-full h-full object-contain bg-gray-50 p-6" />
                            </div>
                        ))}
                        {/* Right arrow */}
                        <button
                            onClick={() => setCurrentImg(i => (i + 1) % images.length)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center">
                            <ChevronRight size={16} className="text-gray-600" />
                        </button>
                    </div>
                    {/* Dot indicators */}
                    <div className="flex justify-center gap-1.5 pb-3">
                        {images.map((_, i) => (
                            <button key={i} onClick={() => setCurrentImg(i)}
                                className={`rounded-full transition-all ${i === currentImg ? 'w-4 h-1.5 bg-[#1A56DB]' : 'w-1.5 h-1.5 bg-gray-200'}`}
                            />
                        ))}
                    </div>
                </div>

                <div className="px-4 pt-3">

                    {/* ── SIZE SELECTOR ────────────────── */}
                    <div className="mb-4">
                        <p className="text-[11px] font-bold text-gray-500 mb-2">
                            Size: <span className="text-gray-900">{selectedSize}</span>
                        </p>
                        <div className="flex gap-2 flex-wrap">
                            {sizes.map(size => (
                                <button
                                    key={size}
                                    onClick={() => setSelectedSize(size)}
                                    className={`px-4 py-2 rounded-xl text-[11px] font-black border-2 transition-all active:scale-95 ${
                                        selectedSize === size
                                            ? 'bg-[#1A56DB] text-white border-[#1A56DB] shadow-md shadow-blue-200'
                                            : 'bg-white text-gray-600 border-gray-200'
                                    }`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* ── PRODUCT INFO ─────────────────── */}
                    <div className="bg-white rounded-2xl p-4 shadow-sm mb-3">
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-0.5">Premium Item</p>
                        <h1 className="text-[17px] font-black text-gray-900 leading-tight mb-1">
                            {product.name}
                        </h1>
                        <p className="text-[11px] text-gray-500 mb-2">Authentic KLYRO Selection</p>

                        {/* Stars */}
                        <div className="flex items-center gap-2 mb-3">
                            <Stars rating={4} count={reviews} />
                        </div>

                        {/* Price */}
                        <div className="flex items-center gap-3">
                            <span className="text-[11px] text-gray-400 line-through">₹{originalPrice.toLocaleString()}</span>
                            <span className="text-[22px] font-black text-gray-900">₹{product.price?.toLocaleString()}</span>
                            <span className="bg-green-50 text-green-600 text-[10px] font-black px-2 py-0.5 rounded-lg">
                                {discount}% Off
                            </span>
                        </div>
                    </div>

                    {/* ── PRODUCT DETAILS ──────────────── */}
                    <div className="bg-white rounded-2xl p-4 shadow-sm mb-3">
                        <h3 className="text-[13px] font-black text-gray-900 mb-2">Product Details</h3>
                        <p className="text-[12px] text-gray-500 leading-relaxed">
                            {showMore ? descriptionLong : descShort}
                            {descriptionLong.length > 180 && !showMore && (
                                <button onClick={() => setShowMore(true)} className="text-[#1A56DB] font-bold ml-1">
                                    ...More
                                </button>
                            )}
                        </p>
                    </div>

                    {/* ── STORE / VIP / RETURN BADGES ──── */}
                    <div className="flex gap-2 mb-3">
                        {[
                            { icon: MapPin, label: 'Nearest Store' },
                            { icon: Award, label: 'VIP' },
                            { icon: RefreshCw, label: 'Return policy' },
                        ].map(({ icon: Icon, label }) => (
                            <button key={label}
                                className="flex-1 flex flex-col items-center gap-1 bg-white rounded-2xl py-2.5 shadow-sm border border-gray-100 active:scale-95 transition-all">
                                <Icon size={14} className="text-[#1A56DB]" />
                                <span className="text-[8px] font-bold text-gray-500 text-center leading-tight">{label}</span>
                            </button>
                        ))}
                    </div>

                    {/* ── CTA BUTTONS ──────────────────── */}
                    <div className="flex gap-3 mb-3">
                        {/* Go to Cart */}
                        <button
                            onClick={handleAddToCart}
                            disabled={addingCart}
                            className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-[13px] uppercase tracking-wider transition-all active:scale-95 shadow-sm ${
                                addedCart
                                    ? 'bg-green-50 text-green-600'
                                    : 'bg-[#F2F7FF] text-[#4392F9] border border-[#4392F9]/20'
                            }`}
                        >
                            {addedCart ? (
                                <><Check size={16} /> Added!</>
                            ) : (
                                <><ShoppingCart size={16} /> Go to cart</>
                            )}
                        </button>

                        {/* Buy Now */}
                        <button
                            onClick={handleBuyNow}
                            className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-[13px] uppercase tracking-wider bg-[#34C759] text-white shadow-lg shadow-green-200 active:scale-95 transition-all"
                        >
                            <ShoppingBag size={16} /> Buy Now
                        </button>
                    </div>

                    {/* ── DELIVERY BANNER ──────────────── */}
                    <div className="bg-gradient-to-r from-[#FF4B5C] to-[#FF6B6B] rounded-2xl p-4 mb-3 flex items-center gap-3 shadow-md shadow-red-200">
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Clock size={20} className="text-white" />
                        </div>
                        <div>
                            <p className="text-white/80 text-[9px] font-bold uppercase tracking-widest">Delivery in</p>
                            <p className="text-white text-[18px] font-black leading-tight">1 within Hour</p>
                        </div>
                    </div>

                    {/* ── VIEW SIMILAR / ADD TO COMPARE ── */}
                    <div className="flex gap-3 mb-4">
                        <button className="flex-1 flex items-center justify-center gap-2 bg-white rounded-2xl py-3 border border-gray-100 shadow-sm text-[11px] font-bold text-gray-600 active:scale-95 transition-all">
                            <Eye size={14} className="text-[#1A56DB]" /> View Similar
                        </button>
                        <button className="flex-1 flex items-center justify-center gap-2 bg-white rounded-2xl py-3 border border-gray-100 shadow-sm text-[11px] font-bold text-gray-600 active:scale-95 transition-all">
                            <GitCompare size={14} className="text-[#1A56DB]" /> Add to Compare
                        </button>
                    </div>

                    {/* ── SIMILAR PRODUCTS ─────────────── */}
                    {similarProducts.length > 0 && (
                        <div className="mb-4">
                            {/* Section header */}
                            <div className="flex items-center justify-between mb-3">
                                <div>
                                    <h2 className="text-[14px] font-black text-gray-900">Similar To</h2>
                                    <p className="text-[10px] text-gray-400">282+ Items</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="flex items-center gap-1 bg-gray-100 rounded-xl px-3 py-1.5 text-[10px] font-bold text-gray-600">
                                        <ArrowUpDown size={10} /> Sort
                                    </button>
                                    <button className="flex items-center gap-1 bg-gray-100 rounded-xl px-3 py-1.5 text-[10px] font-bold text-gray-600">
                                        <SlidersHorizontal size={10} /> Filter
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                {similarProducts.map(p => <SimilarCard key={p.id} product={p} />)}
                            </div>
                        </div>
                    )}

                </div>
            </div>

            {/* ═══════ DESKTOP VIEW ═══════ */}
            <div className="hidden md:block pt-28 pb-24">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid grid-cols-2 gap-16">
                        {/* Left: Image */}
                        <div className="sticky top-28 self-start">
                            <div className="bg-white rounded-3xl p-10 shadow-sm aspect-square flex items-center justify-center">
                                <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
                            </div>
                        </div>
                        {/* Right: Info */}
                        <div className="space-y-6">
                            <div>
                                <h1 className="text-4xl font-black text-gray-900 mb-2">{product.name}</h1>
                                <Stars rating={4} count={reviews} />
                            </div>
                            <div className="flex items-baseline gap-4">
                                <span className="text-4xl font-black text-gray-900">₹{product.price?.toLocaleString()}</span>
                                <span className="text-xl text-gray-300 line-through">₹{originalPrice.toLocaleString()}</span>
                                <span className="bg-green-50 text-green-600 font-black px-3 py-1 rounded-xl text-sm">50% Off</span>
                            </div>
                            <div>
                                <p className="font-black text-gray-900 mb-3">Select Size</p>
                                <div className="flex gap-3 flex-wrap">
                                    {sizes.map(s => (
                                        <button key={s} onClick={() => setSelectedSize(s)}
                                            className={`px-5 py-2.5 rounded-xl font-black text-sm border-2 transition-all ${selectedSize === s ? 'bg-[#1A56DB] text-white border-[#1A56DB]' : 'text-gray-600 border-gray-200 hover:border-gray-400'}`}>
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <p className="text-gray-500 leading-relaxed">{descriptionLong}</p>
                            <div className="flex gap-4">
                                <button onClick={handleAddToCart}
                                    className="flex-1 bg-[#1A56DB] text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
                                    <ShoppingBag size={18} /> Add to Cart
                                </button>
                                <button onClick={handleBuyNow}
                                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 shadow-lg shadow-green-200">
                                    <Zap size={18} fill="white" /> Buy Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
