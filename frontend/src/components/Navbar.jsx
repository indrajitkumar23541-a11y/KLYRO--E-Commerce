import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, User, Menu, X, ChevronDown, Heart, ArrowRight, Car, Sparkles, Book, Smartphone, Leaf, Armchair, Dumbbell, Tag, Moon, Settings, ChevronRight, Zap, Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import API from '../api/axios';
import { buildCategoryTree } from '../utils/categoryUtils';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { cartItems } = useCart();
    const { isDarkMode, toggleTheme } = useTheme();
    const cartCount = cartItems?.reduce((acc, item) => acc + item.quantity, 0) || 0;
    const [categoryTree, setCategoryTree] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await API.get('/categories');
                const rawCategories = response.data.categories || [];
                const tree = buildCategoryTree(rawCategories);
                setCategoryTree(tree.sort((a, b) => (a.name || '').localeCompare(b.name || '')));
            } catch (error) {
                console.error('Navbar category fetch error:', error);
            }
        };
        fetchCategories();
    }, []);

    const closeMenu = () => {
        setActiveDropdown(null);
        setIsMenuOpen(false);
        setIsSearchOpen(false);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
            closeMenu();
        }
    };

    return (
        <>
            <header className="fixed top-0 left-0 w-full z-[100] shadow-2xl animate-reveal">
                {/* TOP ROW: Logo, Search, User Icons */}
                <div className="header-top h-[64px] md:h-[76px] flex items-center px-4 md:px-10 lg:px-16 gap-4 md:gap-10 bg-black/80 backdrop-blur-2xl border-b border-white/10 relative overflow-hidden">
                    {/* Background Glow Effect */}
                    <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none animate-pulse"></div>
                    <div className="absolute top-0 right-0 w-96 h-full bg-gradient-to-l from-[#717fe0]/5 to-transparent pointer-events-none"></div>

                    {/* Mobile Menu Toggle (Left) */}
                    <button onClick={() => setIsMenuOpen(true)} className="lg:hidden w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 hover:bg-white/10 transition-all active:scale-90 border border-white/10 z-20">
                        <Menu size={22} className="text-white" />
                    </button>

                    {/* Logo (Centered on Mobile, Left on Desktop) */}
                    <div className="absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0 z-10">
                        <Link to="/" onClick={closeMenu} className="flex items-center gap-2 group">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#717fe0] to-[#9fa8da] flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:rotate-6 transition-transform">
                                <ShoppingBag size={20} className="text-white" />
                            </div>
                            <span className="text-2xl font-black uppercase tracking-[0.25em] text-white whitespace-nowrap font-serif-premium hidden sm:block">
                                KLYRO
                            </span>
                        </Link>
                    </div>

                    {/* Search Bar (Desktop) */}
                    <div className="flex-grow hidden lg:flex justify-center max-w-5xl mx-auto">
                        <form onSubmit={handleSearch} className="w-full relative flex group scale-100 focus-within:scale-[1.02] transition-transform duration-500">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                            <div className="relative w-full flex bg-white/5 h-12 rounded-2xl border border-white/10 focus-within:border-[#717fe0]/60 focus-within:bg-white/10 transition-all overflow-hidden backdrop-blur-xl">
                                <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-[#717fe0] transition-colors" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-transparent pl-14 pr-32 text-sm font-bold outline-none text-white placeholder:text-white/30 placeholder:font-semibold"
                                    placeholder="Seek the extraordinary..."
                                />
                                <button type="submit" className="absolute right-2 top-2 bottom-2 bg-[#717fe0] hover:bg-[#5b6bc0] px-6 flex items-center justify-center text-white transition-all rounded-xl font-black uppercase text-[10px] tracking-[0.2em] shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40">
                                    Discover
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Icons (Right) */}
                    <div className="ml-auto flex items-center gap-1 sm:gap-6 lg:gap-7 text-white z-20">
                        <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="md:hidden w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors">
                            {isSearchOpen ? <X size={20} /> : <Search size={22} strokeWidth={2.5} />}
                        </button>

                        <button className="w-10 h-10 items-center justify-center rounded-full hover:bg-white/10 transition-all hidden sm:flex"><Heart size={20} strokeWidth={2} /></button>

                        {user ? (
                            <div className="relative group/user py-2 cursor-pointer hidden md:block">
                                <div className="flex items-center gap-3 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full border border-white/5 transition-all">
                                    {user.avatar ? (
                                        <div className="w-6 h-6 rounded-full overflow-hidden border border-white/20">
                                            <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                                        </div>
                                    ) : (
                                        <div className="w-6 h-6 bg-gradient-to-tr from-[#717fe0] to-[#5b6bc0] rounded-full flex items-center justify-center text-[10px] font-black underline-none">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <div className="hidden lg:block text-left">
                                        <p className="text-[12px] font-black uppercase tracking-tight">Account</p>
                                    </div>
                                </div>
                                <div className="absolute top-full right-0 pt-3 opacity-0 invisible group-hover/user:opacity-100 group-hover/user:visible transition-all duration-300">
                                    <div className="bg-[#121214] text-white shadow-3xl min-w-[220px] py-4 rounded-2xl border border-white/10 backdrop-blur-xl">
                                        {user.role === 'admin' && (
                                            <>
                                                <Link to="/admin" onClick={closeMenu} className="px-6 py-3 text-[11px] font-bold text-[#717fe0] hover:bg-white/5 flex items-center justify-between group">
                                                    ADMIN PANEL <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                                </Link>
                                                <div className="border-t my-2 border-white/5"></div>
                                            </>
                                        )}
                                        {user.role === 'seller' && (
                                            <>
                                                <Link to="/seller" onClick={closeMenu} className="px-6 py-3 text-[11px] font-bold text-blue-400 hover:bg-white/5 flex items-center justify-between group">
                                                    SELLER DASHBOARD <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                                </Link>
                                                <div className="border-t my-2 border-white/5"></div>
                                            </>
                                        )}
                                        <Link to="/orders" onClick={closeMenu} className="block px-6 py-3 text-[11px] font-bold hover:bg-white/5 uppercase tracking-widest">Order History</Link>
                                        <div className="border-t my-2 border-white/5"></div>
                                        {user.role === 'user' && (
                                            <>
                                                <Link to="/register-seller" onClick={closeMenu} className="px-6 py-3 text-[11px] font-black text-[#e5a975] hover:bg-white/5 flex items-center justify-between group uppercase">
                                                    Become a Seller <Zap size={14} className="group-hover:scale-125 transition-transform" />
                                                </Link>
                                                <div className="border-t my-2 border-white/5"></div>
                                            </>
                                        )}
                                        <button onClick={() => { logout(); closeMenu(); }} className="w-full text-left px-6 py-3 text-[11px] font-bold text-red-400 hover:bg-red-500/10 uppercase tracking-widest">Sign Out</button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <Link to="/login" onClick={closeMenu} className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full border border-white/5 transition-all">
                                <User size={18} strokeWidth={2} />
                                <span className="hidden lg:block text-[11px] font-black uppercase tracking-widest">Member Portal</span>
                            </Link>
                        )}

                        <Link to="/cart" onClick={closeMenu} className="relative w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white transition-all border border-white/5">
                            <ShoppingBag size={20} strokeWidth={2.5} />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-[#F37021] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-lg ring-1 ring-[#F37021]/30 animate-pulse">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {/* Guest "Sell" Link */}
                        {!user && (
                            <Link to="/register-seller" onClick={closeMenu} className="hidden xl:flex items-center gap-2 bg-[#717fe0]/10 hover:bg-[#717fe0]/20 px-4 py-2 rounded-full border border-[#717fe0]/20 transition-all group">
                                <Zap size={14} className="text-[#717fe0] group-hover:scale-125 transition-transform" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-[#717fe0]">Sell on KLYRO</span>
                            </Link>
                        )}
                    </div>
                </div>

                {/* Mobile Search Bar (Expandable) */}
                {isSearchOpen && (
                    <div className="md:hidden bg-[#0a0a0b]/98 backdrop-blur-xl px-4 py-4 border-b border-white/5 animate-reveal-down">
                        <form onSubmit={handleSearch} className="relative flex">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white/5 h-12 px-6 rounded-xl text-sm outline-none text-white border border-white/10 focus:border-[#717fe0]/50 transition-all"
                                placeholder="Type to find something special..."
                                autoFocus
                            />
                            <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-[#717fe0]">
                                <Search size={18} strokeWidth={3} />
                            </button>
                        </form>
                    </div>
                )}


                {/* BOTTOM ROW: Categories */}
                <nav className="header-bottom h-13 hidden lg:flex items-center relative shadow-inner overflow-x-auto no-scrollbar w-full bg-white/5 backdrop-blur-3xl border-b border-white/5">
                    <div className="flex h-full min-w-max mx-auto px-4 xl:px-12">
                        {categoryTree.map((parent) => (
                            <div
                                key={parent.id}
                                onMouseEnter={() => setActiveDropdown(parent.id)}
                                onMouseLeave={() => setActiveDropdown(null)}
                                className="relative h-full flex items-center"
                            >
                                <Link
                                    to={
                                        parent.name.toLowerCase().includes('beauty') ? '/beauty-health' :
                                            parent.name.toLowerCase().includes('books') ? '/books-education' :
                                                parent.name.toLowerCase().includes('electronic') ? '/electronics' :
                                                    parent.name.toLowerCase().includes('automotive') ? '/automotive' :
                                                        parent.name.toLowerCase().includes('fashion') ? '/fashion' :
                                                            parent.name.toLowerCase().includes('grocery') ? '/grocery' :
                                                                parent.name.toLowerCase().includes('home & living') ? '/home-living' :
                                                                    parent.name.toLowerCase().includes('kids & baby') ? '/kids-baby' :
                                                                        parent.name.toLowerCase().includes('sports') ? '/sports-fitness' :
                                                                            parent.name.toLowerCase().includes('others') ? '/others' :
                                                                                `/products?category_id=${parent.id}`
                                    }
                                    onClick={closeMenu}
                                    className={`h-full flex items-center gap-1.5 xl:gap-2 px-3 lg:px-4 xl:px-6 text-[11px] xl:text-[12px] font-black uppercase tracking-widest transition-all whitespace-nowrap relative group ${activeDropdown === parent.id ? 'text-white bg-white/5' : 'text-white/70 hover:text-white'}`}
                                >
                                    {parent.name}
                                    <span className={`absolute bottom-0 left-0 w-full h-[2px] bg-[#717fe0] transition-all duration-300 ${activeDropdown === parent.id ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0 group-hover:opacity-50 group-hover:scale-x-50'}`} />
                                    {parent.children.length > 0 && <ChevronDown size={14} className={`opacity-40 transition-transform ${activeDropdown === parent.id ? 'rotate-180' : ''}`} />}
                                </Link>

                                {/* MEGA MENU: Active Dropdown Logic */}
                                {parent.children.length > 0 && activeDropdown === parent.id && (
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-0 w-[1000px] max-w-[95vw] animate-reveal opacity-100 visible z-[150]">
                                        <div className="mega-menu-triangle"></div>
                                        <div className="bg-white shadow-2xl rounded-b-xl p-12 flex border-t-2 border-accent-color cursor-default" onMouseEnter={(e) => e.stopPropagation()}>
                                            <div className="grid grid-cols-3 gap-12 w-full">
                                                {/* Col 1: Subcategories */}
                                                <div className="space-y-6">
                                                    <h3 className="text-[14px] font-black uppercase text-primary-color border-b pb-3 mb-6 tracking-widest">Selections</h3>
                                                    <ul className="space-y-3">
                                                        {parent.children.slice(0, Math.ceil(parent.children.length / 2)).map(child => (
                                                            <li key={child.id}>
                                                                <Link to={`/products?category_id=${child.id}`} onClick={closeMenu} className="flex items-center text-[13px] text-gray-500 hover:text-accent-color font-bold hover:translate-x-1 transition-all">
                                                                    <span className="bullet-diamond">◆</span> {child.name}
                                                                </Link>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                                {/* Col 2: Subcategories */}
                                                <div className="space-y-6">
                                                    <h3 className="text-[14px] font-black uppercase text-primary-color border-b pb-3 mb-6 tracking-widest">Essentials</h3>
                                                    <ul className="space-y-3">
                                                        {parent.children.slice(Math.ceil(parent.children.length / 2)).map(child => (
                                                            <li key={child.id}>
                                                                <Link to={`/products?category_id=${child.id}`} onClick={closeMenu} className="flex items-center text-[13px] text-gray-500 hover:text-accent-color font-bold hover:translate-x-1 transition-all">
                                                                    <span className="bullet-diamond">◆</span> {child.name}
                                                                </Link>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                                {/* Col 3: Visual Highlight */}
                                                <div className="space-y-6 flex flex-col items-center">
                                                    <h3 className="text-[14px] font-black uppercase text-primary-color border-b pb-3 mb-6 tracking-widest w-full">Highlights</h3>
                                                    <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-lg group/img">
                                                        <img src="/assets/electronics.webp" alt="Picks" className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-700" />
                                                        <div className="absolute inset-0 bg-black/10 group-hover/img:bg-black/30 transition-all"></div>
                                                        <div className="absolute bottom-4 left-4 text-white">
                                                            <p className="text-[10px] font-black uppercase tracking-widest">Trending Now</p>
                                                            <p className="text-sm font-black uppercase">Pure Excellence</p>
                                                        </div>
                                                    </div>
                                                    <img src="/assets/fashion.webp" alt="Banner" className="w-full h-24 object-cover rounded-lg shadow-md border border-gray-100" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </nav>

            </header>

            {/* Premium Mobile Menu (Drawer) Overlay */}
            {isMenuOpen && (
                <div className="fixed inset-0 bg-black/80 z-[200] lg:hidden backdrop-blur-md transition-all animate-fade-in" onClick={() => setIsMenuOpen(false)}>
                    <div className="absolute left-0 top-0 w-[85%] max-w-[380px] h-full bg-[#1a1a1c] animate-reveal-left flex flex-col shadow-[20px_0_60px_rgba(0,0,0,0.9)] overflow-hidden" onClick={e => e.stopPropagation()}>

                        {/* Drawer Background Aesthetic Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-b from-[#717fe0]/5 via-transparent to-black pointer-events-none"></div>

                        {/* Drawer Header: User Profile */}
                        <div className="relative p-8 pb-6 z-10">
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-16 h-16 rounded-full border-2 border-[#717fe0]/40 overflow-hidden shadow-2xl bg-white/5 flex items-center justify-center">
                                    {user?.avatar ? (
                                        <img
                                            src={user.avatar}
                                            alt="User"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <User size={32} className="text-white/20" />
                                    )}
                                </div>
                                <button onClick={() => setIsMenuOpen(false)} className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-full text-white/50 transition-all">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="space-y-1">
                                <h2 className="text-2xl font-black text-white leading-none">
                                    Welcome, <span className="text-[#717fe0]">{user ? user.name.split(' ')[0] : 'Guest'}!</span>
                                </h2>
                                <p className="text-[11px] font-bold text-white/40 tracking-tight">
                                    {user?.email || "Explore the KLYRO hub"}
                                </p>
                            </div>

                            <button
                                onClick={() => { navigate(user ? '/profile' : '/login'); setIsMenuOpen(false); }}
                                className="mt-5 px-6 py-2 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/80 hover:bg-white/5 transition-all flex items-center gap-2"
                            >
                                View Profile <ChevronRight size={12} />
                            </button>
                        </div>

                        {/* Search Section */}
                        <div className="px-8 mb-8 relative z-10">
                            <form onSubmit={handleSearch} className="relative group">
                                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-[#717fe0] transition-colors" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-white/5 h-12 pl-12 pr-6 rounded-full text-[13px] outline-none text-white border border-white/10 focus:border-[#717fe0]/40 focus:bg-white/10 transition-all placeholder:text-white/20"
                                    placeholder="Search KLYRO..."
                                />
                            </form>
                        </div>

                        {/* Navigation Scroll Area */}
                        <nav className="flex-grow overflow-y-auto px-8 pb-10 space-y-10 z-10 custom-scrollbar-hidden">

                            {/* CATEGORIES SECTION */}
                            <div className="space-y-6 relative">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#717fe0]/60">Categories</h3>

                                {/* Floating Tech Graphic Aesthetic */}
                                <div className="absolute top-10 -right-4 w-40 h-40 opacity-20 pointer-events-none grayscale brightness-150 rotate-12 transition-all group-hover:rotate-0">
                                    <img src="/assets/electronics.webp" alt="depth" className="w-full h-full object-contain" />
                                </div>

                                <div className="space-y-4">
                                    {[
                                        { name: "Automotive", icon: <Car size={20} />, path: '/automotive' },
                                        { name: "Beauty & Health", icon: <Sparkles size={20} />, path: '/beauty-health' },
                                        { name: "Books & Education", icon: <Book size={20} />, path: '/books-education' },
                                        { name: "Electronics", icon: <Smartphone size={20} />, path: '/electronics' },
                                        { name: "Fashion", icon: <ShoppingBag size={20} />, path: '/fashion' },
                                        { name: "Grocery", icon: <Leaf size={20} />, path: '/grocery' },
                                        { name: "Home & Living", icon: <Armchair size={20} />, path: '/home-living' },
                                        { name: "Sports & Fitness", icon: <Dumbbell size={20} />, path: '/sports-fitness' }
                                    ].map((cat, idx) => (
                                        <Link
                                            key={idx}
                                            to={cat.path}
                                            onClick={() => setIsMenuOpen(false)}
                                            className="flex items-center justify-between group/cat py-1"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-white group-hover/cat:bg-[#717fe0] group-hover/cat:rotate-6 transition-all duration-300">
                                                    {cat.icon}
                                                </div>
                                                <span className="text-[15px] font-bold text-white/80 group-hover/cat:text-white transition-colors">
                                                    {cat.name}
                                                </span>
                                            </div>
                                            <ChevronRight size={18} className="text-white/20 group-hover/cat:text-[#717fe0] group-hover/cat:translate-x-1 transition-all" />
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* FEATURES SECTION */}
                            <div className="space-y-6 pt-4">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#717fe0]/60">Features</h3>
                                <Link
                                    to="/orders"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center justify-between group/feat py-1"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-white group-hover/feat:bg-orange-500 transition-all">
                                            <Package size={20} />
                                        </div>
                                        <span className="text-[15px] font-bold text-white/80 group-hover/feat:text-white transition-colors">
                                            My Orders
                                        </span>
                                    </div>
                                    <ChevronRight size={18} className="text-white/20 group-hover/feat:text-orange-500 group-hover/feat:translate-x-1 transition-all" />
                                </Link>

                                {user?.role === 'seller' && (
                                    <Link
                                        to="/seller"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="flex items-center justify-between group/feat py-1"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500 group-hover/feat:bg-blue-500 group-hover/feat:text-white transition-all">
                                                <Briefcase size={20} />
                                            </div>
                                            <span className="text-[15px] font-bold text-white/80 group-hover/feat:text-white transition-colors">
                                                Seller Dashboard
                                            </span>
                                        </div>
                                        <ChevronRight size={18} className="text-white/20 group-hover/feat:text-blue-500 group-hover/feat:translate-x-1 transition-all" />
                                    </Link>
                                )}

                                {user?.role === 'user' && (
                                    <Link
                                        to="/register-seller"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="flex items-center justify-between group/feat py-1"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500 group-hover/feat:bg-amber-500 group-hover/feat:text-white transition-all">
                                                <Zap size={20} />
                                            </div>
                                            <span className="text-[15px] font-bold text-white/80 group-hover/feat:text-white transition-colors">
                                                Become a Seller
                                            </span>
                                        </div>
                                        <ChevronRight size={18} className="text-white/20 group-hover/feat:text-amber-500 group-hover/feat:translate-x-1 transition-all" />
                                    </Link>
                                )}

                                <Link
                                    to="/products?search=deal"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center justify-between group/feat py-1"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-white group-hover/feat:bg-blue-500 transition-all">
                                            <Tag size={20} />
                                        </div>
                                        <span className="text-[15px] font-bold text-white/80 group-hover/feat:text-white transition-colors">
                                            Deals & Offers
                                        </span>
                                    </div>
                                    <ChevronRight size={18} className="text-white/20 group-hover/feat:text-blue-500 group-hover/feat:translate-x-1 transition-all" />
                                </Link>
                            </div>

                            {/* SETTINGS FOOTER SECTION */}
                            <div className="pt-6 border-t border-white/5 space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-white">
                                            <Moon size={18} />
                                        </div>
                                        <span className="text-[14px] font-bold text-white/60">Dark Theme</span>
                                    </div>
                                    <div
                                        onClick={toggleTheme}
                                        className={`w-10 h-5 rounded-full relative p-1 shadow-inner cursor-pointer transition-all duration-300 ${isDarkMode ? 'bg-[#717fe0]' : 'bg-white/10'}`}
                                    >
                                        <div className={`w-3 h-3 bg-white rounded-full shadow-lg transition-all duration-300 ${isDarkMode ? 'translate-x-5' : 'translate-x-0'}`}></div>
                                    </div>
                                </div>

                                <Link
                                    to="/settings"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center gap-4 group/set"
                                >
                                    <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-white group-hover/set:rotate-45 transition-all">
                                        <Settings size={18} />
                                    </div>
                                    <span className="text-[14px] font-bold text-white/60 group-hover/set:text-white transition-colors">
                                        App Settings
                                    </span>
                                </Link>
                            </div>
                        </nav>

                        {/* Session Sign-out (Optional persistent at bottom) */}
                        {user && (
                            <div className="p-8 pb-10 bg-gradient-to-t from-black to-transparent z-20">
                                <button
                                    onClick={() => { logout(); setIsMenuOpen(false); }}
                                    className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-500 h-12 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] transition-all border border-red-500/20"
                                >
                                    End Session
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;
