import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Heart, Search, ShoppingCart, Settings } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const BottomNav = () => {
    const location = useLocation();
    const { cartItems } = useCart();
    const { user } = useAuth();
    const cartCount = cartItems?.reduce((acc, item) => acc + item.quantity, 0) || 0;

    // Hide on certain routes
    const hiddenRoutes = ['/admin', '/seller', '/checkout', '/login', '/register'];
    if (hiddenRoutes.some(route => location.pathname.startsWith(route))) return null;

    const navItems = [
        { name: 'Home',     path: '/home',        icon: Home },
        { name: 'Wishlist', path: '/favorites',   icon: Heart },
        { name: 'Search',   path: '/search',      icon: Search },
        { name: 'Cart',     path: '/cart',        icon: ShoppingCart, badge: cartCount },
        { name: 'Settings', path: user ? '/profile' : '/login', icon: Settings },
    ];

    const isActive = (path) => {
        if (path === '/home' && (location.pathname === '/home' || location.pathname === '/')) return true;
        if (path !== '/home' && location.pathname.startsWith(path)) return true;
        return false;
    };

    return (
        <nav
            className="fixed bottom-0 left-0 w-full z-[150] md:hidden"
            style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        >
            <div className="bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
                <div className="flex justify-around items-center h-[62px] px-2">
                    {navItems.map((item) => {
                        const active = isActive(item.path);
                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                className="flex flex-col items-center justify-center gap-[3px] min-w-[52px] py-1 active:scale-90 transition-all duration-200"
                            >
                                <div className="relative">
                                    <item.icon
                                        size={22}
                                        strokeWidth={active ? 2.5 : 1.8}
                                        className={active ? 'text-[#1A56DB]' : 'text-gray-400'}
                                        fill={active && item.name === 'Home' ? 'currentColor' : 'none'}
                                    />
                                    {/* Cart badge */}
                                    {item.badge > 0 && (
                                        <span className="absolute -top-1.5 -right-2 bg-[#FF4B5C] text-white text-[7px] font-black min-w-[14px] h-[14px] px-0.5 rounded-full flex items-center justify-center shadow leading-none">
                                            {item.badge > 9 ? '9+' : item.badge}
                                        </span>
                                    )}
                                </div>
                                <span className={`text-[9px] font-bold leading-none transition-all ${active ? 'text-[#1A56DB] font-black' : 'text-gray-400'}`}>
                                    {item.name}
                                </span>
                                {/* Active indicator dot */}
                                {active && (
                                    <div className="w-1 h-1 rounded-full bg-[#1A56DB]" />
                                )}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
};

export default BottomNav;
