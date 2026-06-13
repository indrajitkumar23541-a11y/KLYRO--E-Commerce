import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, UserCheck, ShoppingBag, ShoppingCart, Layers, CreditCard, BarChart2, Settings, Power } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminSidebar = ({ isOpen, setIsOpen }) => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navLinks = [
        { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={18} strokeWidth={2.5} /> },
        { name: 'Users', path: '/admin/users', icon: <Users size={18} strokeWidth={2.5} /> },
        { name: 'Sellers', path: '/admin/sellers', icon: <UserCheck size={18} strokeWidth={2.5} /> },
        { name: 'Products', path: '/admin/products', icon: <ShoppingBag size={18} strokeWidth={2.5} /> },
        { name: 'Orders', path: '/admin/orders', icon: <ShoppingCart size={18} strokeWidth={2.5} /> },
        { name: 'Categories', path: '/admin/categories', icon: <Layers size={18} strokeWidth={2.5} /> },
        { name: 'Payments', path: '/admin/payments', icon: <CreditCard size={18} strokeWidth={2.5} /> },
        { name: 'Analytics', path: '/admin/analytics', icon: <BarChart2 size={18} strokeWidth={2.5} /> },
        { name: 'Settings', path: '/admin/settings', icon: <Settings size={18} strokeWidth={2.5} /> },
    ];

    return (
        <>
        {/* Mobile Overlay */}
        <div 
            className={`fixed inset-0 bg-black/60 z-[60] transition-opacity duration-300 lg:hidden ${
                isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            onClick={() => setIsOpen(false)}
        />

        <aside 
            className={`fixed lg:static inset-y-0 left-0 w-[260px] text-white flex flex-col h-full z-[70] shadow-2xl flex-shrink-0 transition-transform duration-300 lg:translate-x-0 ${
                isOpen ? 'translate-x-0' : '-translate-x-full'
            }`} 
            style={{ 
                background: 'linear-gradient(180deg, #37465f 0%, #29384e 50%, #202d41 100%)',
                boxShadow: '4px 0 24px rgba(0,0,0,0.1)'
            }}
        >
            {/* Logo */}
            <div className="h-[72px] flex items-center justify-center">
                <h1 className="text-2xl font-bold tracking-widest text-white">KLYRO</h1>
            </div>
            
            {/* Profile Snippet */}
            <div className="flex flex-col items-center py-6">
                <div className="w-[84px] h-[84px] rounded-full border-[3px] border-white/20 p-1 mb-3">
                    <img src="https://ui-avatars.com/api/?name=Admin&background=random" alt="Admin" className="w-full h-full rounded-full object-cover" />
                </div>
                <h2 className="text-lg font-medium tracking-wide">Admin</h2>
                <p className="text-[11px] text-slate-400 font-medium tracking-wide">admin@klyro.com</p>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto py-2 px-4 space-y-[2px] custom-scroll">
                {navLinks.map((link) => (
                    <NavLink
                        key={link.name}
                        to={link.path}
                        end={link.path === '/admin'}
                        onClick={() => {
                            if (window.innerWidth < 1024) setIsOpen(false);
                        }}
                        className={({ isActive }) =>
                            `flex items-center gap-4 px-4 py-[14px] rounded-md text-[13px] font-medium transition-all ${
                                isActive 
                                ? 'bg-white/10 text-white shadow-inner font-bold' 
                                : 'text-slate-300 hover:bg-white/5 hover:text-white'
                            }`
                        }
                    >
                        {link.icon}
                        <span className="tracking-wide">{link.name}</span>
                    </NavLink>
                ))}
            </div>

            {/* Bottom Section */}
            <div className="p-4 mb-2">
                <button
                    onClick={() => {
                        handleLogout();
                        if (window.innerWidth < 1024) setIsOpen(false);
                    }}
                    className="flex w-full items-center gap-4 px-4 py-3 text-[13px] font-medium text-slate-300 hover:text-white transition-all group rounded-md hover:bg-white/5"
                >
                    <Power size={18} strokeWidth={2.5} className="group-hover:text-red-400 transition-colors" />
                    <span className="tracking-wide">Sign Out</span>
                </button>
            </div>
        </aside>
        </>
    );
};

export default AdminSidebar;
