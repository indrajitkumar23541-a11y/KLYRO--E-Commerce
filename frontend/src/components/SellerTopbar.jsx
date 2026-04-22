import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, ChevronDown, Menu, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

const SellerTopbar = ({ setSidebarOpen }) => {
    const { user, logout, token, updateUser } = useAuth();
    const navigate = useNavigate();

    const [openDropdown, setOpenDropdown] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const wrapperRef = useRef(null);
    const fileInputRef = useRef(null);

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('avatar', file);

        setIsUploading(true);
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            };
            const res = await API.put('/users/avatar', formData, config);
            if (res.data.success) {
                updateUser({ avatar: res.data.avatar });
                setOpenDropdown(null);
            }
        } catch (err) {
            console.error("Avatar upload failed:", err);
        } finally {
            setIsUploading(false);
        }
    };

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                if (!token) return;
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const res = await API.get('/seller/orders', config);
                if (res.data.success) {
                    const recent = res.data.orders.slice(0, 5).map(o => ({
                        id: o.id,
                        text: `New order #${o.id} received`,
                        time: new Date(o.created_at).toLocaleDateString(),
                        read: false
                    }));
                    setNotifications(recent);
                }
            } catch (err) {
                console.error("Failed to load seller notifications");
            }
        };
        fetchNotifications();
    }, [token]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setOpenDropdown(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <header className="h-[80px] bg-white/70 backdrop-blur-xl border-b border-slate-200/50 flex items-center justify-between px-6 md:px-10 flex-shrink-0 z-[60] w-full shadow-sm sticky top-0">
            {/* Left: Mobile Menu Toggle */}
            <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-3 text-slate-600 hover:bg-slate-100/80 rounded-2xl transition-all active:scale-95"
            >
                <Menu size={24} />
            </button>

            {/* Middle: Pro-Grade Search Engine */}
            <div className="flex-1 max-w-3xl px-8 hidden lg:block">
                <div className="flex items-center gap-4">
                    <div className="flex-1 flex items-center bg-slate-100/50 border border-slate-200/60 rounded-2xl overflow-hidden group focus-within:bg-white focus-within:border-blue-500 focus-within:ring-4 ring-blue-500/10 transition-all duration-300">
                        <div className="pl-6 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                            <Search size={18} />
                        </div>
                        <input
                            type="text"
                            placeholder="Scan inventory, orders or customers..."
                            className="flex-1 bg-transparent px-4 py-3.5 text-[13px] font-bold outline-none text-slate-800 placeholder:text-slate-400 placeholder:font-semibold"
                        />
                        <div className="h-8 w-px bg-slate-200" />
                        <select className="bg-transparent border-none text-[11px] font-black text-slate-500 uppercase tracking-widest px-6 py-3.5 outline-none cursor-pointer hover:text-slate-900 transition-colors">
                            <option>Universe</option>
                            <option>Active Orders</option>
                            <option>SKU Catalog</option>
                            <option>Customers</option>
                        </select>
                    </div>
                    {/* System Pulse Indicator */}
                    <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100 select-none">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-glow shadow-emerald-500/50"></div>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Sys: Ready</span>
                    </div>
                </div>
            </div>

            {/* Right: Action Intelligence & Profile */}
            <div className="flex items-center gap-4 md:gap-8" ref={wrapperRef}>
                {/* Visual Actions */}
                <div className="flex items-center gap-2 md:gap-4">
                    <button className="flex items-center gap-2 px-4 py-2.5 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all group active:scale-95">
                        <HelpCircle size={20} className="group-hover:rotate-12 transition-transform" />
                        <span className="text-[11px] font-black uppercase tracking-widest hidden xl:block">Intelligence</span>
                    </button>

                    {/* Notifications Hub */}
                    <div className="relative group/notif">
                        <button
                            className={`p-3 rounded-2xl border border-slate-100 bg-slate-50/50 text-slate-500 hover:bg-white hover:text-blue-600 hover:border-blue-200/60 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 active:scale-90`}
                        >
                            <Bell size={20} className="group-hover/notif:rotate-[15deg] transition-transform duration-300" />
                            {unreadCount > 0 && (
                                <span className="absolute top-2.5 right-2.5 bg-red-500 text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white shadow-[0_0_10px_rgba(239,68,68,0.5)] animate-pulse">
                                    {unreadCount}
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                <div className="w-px h-10 bg-slate-100" />

                {/* Identity Module */}
                <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                        <div className="flex items-center justify-end gap-2">
                             <h3 className="text-[15px] font-black text-slate-800 tracking-tight">{user?.name || 'Indrajit Kumar'}</h3>
                             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                        </div>
                        <p className="text-[9px] font-black text-blue-500 uppercase tracking-[0.3em] mt-1 leading-none">Market Master</p>
                    </div>
                    
                    <div className="relative group/avatar">
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleFileChange} 
                            accept="image/*" 
                            className="hidden" 
                        />
                        <button
                            onClick={handleAvatarClick}
                            disabled={isUploading}
                            className={`w-12 h-12 rounded-2xl bg-white border-2 border-slate-100 shadow-sm overflow-hidden relative group transition-all active:scale-90 ${isUploading ? 'opacity-50 cursor-wait' : 'hover:border-blue-500'}`}
                        >
                            {isUploading ? (
                                <div className="w-full h-full flex items-center justify-center bg-slate-50">
                                    <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            ) : (
                                <>
                                    {user?.avatar ? (
                                        <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <img src={`https://ui-avatars.com/api/?name=${user?.name || 'Seller'}&background=717fe0&color=fff&bold=true`} alt="Profile" className="w-full h-full object-cover" />
                                    )}
                                    {/* Upload Overlay */}
                                    <div className="absolute inset-0 bg-blue-600/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="w-6 h-6 text-white">
                                            <ChevronDown size={20} className="-rotate-90" />
                                        </div>
                                    </div>
                                </>
                            )}
                        </button>

                        {/* Dropdown Menu Toggle */}
                        <button 
                            onClick={() => setOpenDropdown(openDropdown === 'profile' ? null : 'profile')}
                            className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full border border-slate-100 shadow-sm flex items-center justify-center text-slate-400 hover:text-blue-500 transition-colors"
                        >
                            <ChevronDown size={12} className={`transition-transform ${openDropdown === 'profile' ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Dropdown Menu */}
                        {openDropdown === 'profile' && (
                            <div className="absolute top-16 right-0 w-64 bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden z-[100] animate-reveal p-3">
                                <div className="p-4 border-b border-slate-50 mb-2 bg-slate-50/50 rounded-2xl">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Authenticated Account</p>
                                    <p className="text-sm font-black text-slate-900 truncate tracking-tight">{user?.email || 'master@klyro.com'}</p>
                                </div>
                                <div className="space-y-1">
                                    <button onClick={() => { setOpenDropdown(null); navigate('/seller/settings'); }} className="w-full flex items-center gap-3 px-5 py-3.5 text-[12px] font-black uppercase tracking-widest text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all group">
                                        <div className="p-2 bg-white rounded-lg group-hover:bg-blue-100 transition-colors shadow-sm">
                                            <ChevronDown size={14} className="-rotate-90" />
                                        </div>
                                        Console Settings
                                    </button>
                                    <button onClick={() => { setOpenDropdown(null); logout(); navigate('/login'); }} className="w-full flex items-center gap-3 px-5 py-3.5 text-[12px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 rounded-xl transition-all group">
                                        <div className="p-2 bg-white rounded-lg group-hover:bg-red-100 transition-colors shadow-sm text-red-400">
                                            <ChevronDown size={14} className="-rotate-90" />
                                        </div>
                                        Sign Out Core
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default SellerTopbar;

