import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Grid, Heart, User } from 'lucide-react';

const BottomNav = () => {
    const location = useLocation();
    
    const navItems = [
        { name: 'Home', path: '/', icon: Home },
        { name: 'Categories', path: '/categories', icon: Grid },
        { name: 'Favorites', path: '/favorites', icon: Heart },
        { name: 'Account', path: '/login', icon: User }
    ];

    const isActive = (path) => {
        if (path === '/' && location.pathname === '/') return true;
        if (path !== '/' && location.pathname.startsWith(path)) return true;
        return false;
    };

    return (
        <nav className="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-2xl border-t border-gray-100 z-[150] md:hidden px-4 py-2 flex justify-around items-center shadow-[0_-10px_40px_rgba(0,0,0,0.05)] h-20">
            {navItems.map((item) => {
                const ActiveIcon = item.icon;
                const active = isActive(item.path);
                
                return (
                    <Link 
                        key={item.name} 
                        to={item.path}
                        className="flex flex-col items-center gap-1 min-w-[70px] transition-all duration-300 active:scale-95"
                    >
                        <div className={`relative p-2.5 rounded-2xl transition-all duration-500 ${active ? 'text-[#0a0a0b] scale-110' : 'text-gray-400 hover:text-gray-600'}`}>
                            <ActiveIcon size={24} strokeWidth={active ? 2.5 : 2} fill={active && item.name === 'Home' ? 'currentColor' : 'none'} />
                            {active && (
                                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#0a0a0b] rounded-full"></div>
                            )}
                        </div>
                        <span className={`text-[9px] font-black uppercase tracking-widest transition-all duration-500 ${active ? 'text-[#0a0a0b] opacity-100' : 'text-gray-400 opacity-60'}`}>
                            {item.name}
                        </span>
                    </Link>
                );
            })}
        </nav>
    );
};

export default BottomNav;
