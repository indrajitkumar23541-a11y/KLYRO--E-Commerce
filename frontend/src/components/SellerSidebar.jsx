import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard, ShoppingBag, ShoppingCart, BarChart2, Settings,
    Power, User, ChevronDown, Package, Inbox, IndianRupee, RotateCcw,
    Users, PieChart, Megaphone, Ticket, Store, HelpCircle,
    Zap, MessageSquare
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SellerSidebar = ({ isOpen, setIsOpen }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [expandedMenu, setExpandedMenu] = useState(null);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const toggleSubmenu = (menu) => {
        setExpandedMenu(expandedMenu === menu ? null : menu);
    };

    const navLinks = [
        { name: 'Dashboard', path: '/seller', icon: <LayoutDashboard size={18} /> },
        {
            name: 'Orders',
            path: '/seller/orders',
            icon: <ShoppingCart size={18} />,
            submenu: [
                { name: 'All Orders', path: '/seller/orders' },
                { name: 'Pending', path: '/seller/orders?status=pending' },
                { name: 'Shipped', path: '/seller/orders?status=shipped' },
                { name: 'Delivered', path: '/seller/orders?status=delivered' },
                { name: 'Returns & Refunds', path: '/seller/returns' },
            ]
        },
        {
            name: 'Products',
            path: '/seller/products',
            icon: <ShoppingBag size={18} />,
            submenu: [
                { name: 'All Products', path: '/seller/products' },
                { name: 'Add Product', path: '/seller/products/add' },
            ]
        },
        {
            name: 'Inventory',
            path: '/seller/inventory',
            icon: <Package size={18} />,
            submenu: [
                { name: 'Stock Level', path: '/seller/inventory' },
                { name: 'Low Stock', path: '/seller/inventory/low' },
            ]
        },
        { name: 'Pricing', path: '/seller/pricing', icon: <Zap size={18} />, badge: 'AI', badgeColor: 'bg-purple-500/20 text-purple-400' },
        { name: 'Payments', path: '/seller/payments', icon: <IndianRupee size={18} /> },
        { name: 'Returns', path: '/seller/returns', icon: <RotateCcw size={18} /> },
        { name: 'Customers', path: '/seller/customers', icon: <Users size={18} /> },
        { name: 'Reviews', path: '/seller/reviews', icon: <MessageSquare size={18} /> },
        { name: 'Analytics', path: '/seller/analytics', icon: <BarChart2 size={18} /> },
        {
            name: 'Marketing',
            path: '/seller/marketing',
            icon: <Megaphone size={18} />,
            badge: 'New',
            badgeColor: 'bg-emerald-500/20 text-emerald-400',
            submenu: [
                { name: 'Ads Manager', path: '/seller/marketing/ads' },
                { name: 'Coupons & Deals', path: '/seller/marketing/coupons' },
            ]
        },
        {
            name: 'Store',
            path: '/seller/store',
            icon: <Store size={18} />,
            submenu: [
                { name: 'Store Profile', path: '/seller/settings' },
                { name: 'Banners', path: '/seller/store/banners' },
            ]
        },
        { name: 'Settings', path: '/seller/settings', icon: <Settings size={18} /> },
        { name: 'Support', path: '/seller/support', icon: <HelpCircle size={18} /> },
    ];

    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={`fixed inset-0 bg-black/60 z-[60] transition-opacity duration-300 lg:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={() => setIsOpen(false)}
            />

            <aside
                className={`fixed lg:static inset-y-0 left-0 w-[240px] text-white flex flex-col h-full z-[70] shadow-2xl flex-shrink-0 transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    } bg-[#0f172a]`}
            >
                {/* Logo Section */}
                <div className="h-[64px] flex items-center px-6 border-b border-white/5">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <ShoppingBag size={18} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-black tracking-tighter text-white">KLYRO</h1>
                            <p className="text-[10px] font-black text-slate-500 tracking-widest mt-[-2px]">SELLER</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1 custom-scroll">
                    {navLinks.map((link) => {
                        const isExpanded = expandedMenu === link.name;
                        const isActive = location.pathname === link.path || link.submenu?.some(s => location.pathname === s.path);

                        return (
                            <div key={link.name} className="space-y-1">
                                {link.submenu ? (
                                    <button
                                        onClick={() => toggleSubmenu(link.name)}
                                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-[13px] font-semibold transition-all group ${isActive ? 'text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className={`transition-all duration-300 ${isActive ? 'text-blue-500' : 'text-slate-500 group-hover:text-white'}`}>
                                                {link.icon}
                                            </span>
                                            <span className="tracking-tight">{link.name}</span>
                                            {link.badge && (
                                                <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest ml-1 ${link.badgeColor}`}>
                                                    {link.badge}
                                                </span>
                                            )}
                                        </div>
                                        <ChevronDown size={14} className={`text-slate-600 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                    </button>
                                ) : (
                                    <NavLink
                                        to={link.path}
                                        end={link.path === '/seller'}
                                        className={({ isActive }) =>
                                            `flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-semibold tracking-tight transition-all group ${isActive
                                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                                                : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                            }`
                                        }
                                    >
                                        <span className="transition-all duration-300 group-hover:scale-110">
                                            {link.icon}
                                        </span>
                                        <span>{link.name}</span>
                                        {link.badge && (
                                            <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest ml-1 ${link.badgeColor}`}>
                                                {link.badge}
                                            </span>
                                        )}
                                    </NavLink>
                                )}

                                {/* Submenu */}
                                {link.submenu && isExpanded && (
                                    <div className="ml-9 space-y-1 py-1">
                                        {link.submenu.map((sub) => (
                                            <NavLink
                                                key={sub.name}
                                                to={sub.path}
                                                className={({ isActive }) =>
                                                    `block px-4 py-2 rounded-lg text-[12px] font-medium transition-all ${isActive ? 'text-white' : 'text-slate-500 hover:text-white'
                                                    }`
                                                }
                                            >
                                                {sub.name}
                                            </NavLink>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Logout */}
                <div className="p-4 border-t border-white/5">
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 px-4 py-3 text-[13px] font-semibold text-slate-400 hover:text-white transition-all group rounded-xl hover:bg-red-500/10"
                    >
                        <Power size={18} className="group-hover:text-red-400 transition-colors" />
                        <span className="tracking-tight">Sign Out</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default SellerSidebar;

