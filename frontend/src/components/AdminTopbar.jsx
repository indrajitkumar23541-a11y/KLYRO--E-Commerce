import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, Mail, ChevronDown, User, Settings, LogOut, Check, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

const AdminTopbar = ({ setSidebarOpen }) => {
    const { logout, token } = useAuth();
    const navigate = useNavigate();

    const [openDropdown, setOpenDropdown] = useState(null); // 'bell', 'mail', 'profile', 'lang'
    const [lang, setLang] = useState('in');
    const [notifications, setNotifications] = useState([]);
    const [messages, setMessages] = useState([
        { id: 1, from: 'Support', text: 'Ticket #492 resolved.', time: '10:30 AM' }
    ]);

    const wrapperRef = useRef(null);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                if(!token) return;
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const res = await API.get('/orders', config);
                if (res.data.success) {
                    const recent = res.data.orders.slice(0, 5).map(o => ({
                        id: o.id,
                        text: `Order #${o.id} placed by ${o.user_name || 'Customer'}`,
                        time: new Date(o.created_at).toLocaleDateString(),
                        read: false
                    }));
                    setNotifications(recent);
                }
            } catch (err) {
                console.error("Failed to load notifications");
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

    const toggleDropdown = (name) => {
        setOpenDropdown(openDropdown === name ? null : name);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const markAllRead = () => {
        setNotifications(notifications.map(n => ({...n, read: true})));
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <header className="h-[64px] md:h-[72px] bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 flex-shrink-0 z-50 w-full shadow-sm relative">
            {/* Left Box (Menu Toggle & Search) */}
            <div className="flex items-center gap-4 flex-1 max-w-xl">
                <button 
                    onClick={() => setSidebarOpen(true)}
                    className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-md transition-colors"
                >
                    <Menu size={24} />
                </button>
                <div className="flex-1 flex items-center bg-[#f4f6fa] rounded-md overflow-hidden border border-slate-200/60 focus-within:border-blue-300 focus-within:ring-2 ring-blue-50 transition-all">
                    <input 
                        type="text" 
                        placeholder="Search..." 
                        className="w-full bg-transparent px-3 md:px-4 py-2 md:py-2.5 text-xs md:text-sm outline-none text-slate-700 font-medium placeholder:text-slate-400"
                    />
                    <button className="bg-[#4d6b8b] hover:bg-[#3f5873] text-white px-3 md:px-5 py-2 md:py-2.5 transition-colors">
                        <Search size={16} md={18} />
                    </button>
                </div>
            </div>

            {/* Right Box (Icons & Profile) */}
            <div className="flex items-center gap-3 md:gap-6 ml-4" ref={wrapperRef}>
                {/* Icons */}
                <div className="flex items-center gap-3 md:gap-5 relative">
                    {/* Bell Dropdown */}
                    <div className="relative">
                        <button onClick={() => toggleDropdown('bell')} className="relative text-slate-400 hover:text-slate-600 transition-colors">
                            <Bell size={20} strokeWidth={2.5} />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                                    {unreadCount}
                                </span>
                            )}
                        </button>

                        {openDropdown === 'bell' && (
                            <div className="absolute top-10 -right-2 w-72 bg-white rounded-lg shadow-xl border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                                <div className="p-3 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                                    <span className="font-bold text-sm text-[#383a48]">Notifications</span>
                                    <button onClick={markAllRead} className="text-[10px] font-bold text-blue-500 hover:underline">Mark all read</button>
                                </div>
                                <div className="max-h-[300px] overflow-y-auto">
                                    {notifications.length > 0 ? notifications.map(n => (
                                        <div key={n.id} className={`p-3 border-b border-slate-50 hover:bg-slate-50 cursor-pointer ${!n.read ? 'bg-blue-50/50' : ''}`}>
                                            <p className="text-xs font-bold text-slate-700 mb-1">{n.text}</p>
                                            <p className="text-[10px] text-slate-400 font-semibold">{n.time}</p>
                                        </div>
                                    )) : (
                                        <div className="p-4 text-center text-xs text-slate-400 font-bold">No notifications</div>
                                    )}
                                </div>
                                <div className="p-2 border-t border-slate-100 text-center">
                                    <button onClick={() => setOpenDropdown(null)} className="text-xs font-bold text-slate-500 hover:text-slate-700">Close</button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Mail Dropdown */}
                    <div className="relative">
                        <button onClick={() => toggleDropdown('mail')} className="relative text-slate-400 hover:text-slate-600 transition-colors">
                            <Mail size={20} strokeWidth={2.5} />
                             <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                                {messages.length}
                            </span>
                        </button>
                        
                        {openDropdown === 'mail' && (
                            <div className="absolute top-10 -right-2 w-72 bg-white rounded-lg shadow-xl border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                                <div className="p-3 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                                    <span className="font-bold text-sm text-[#383a48]">Messages</span>
                                </div>
                                <div className="max-h-[300px] overflow-y-auto">
                                    {messages.map(m => (
                                        <div key={m.id} className="p-3 border-b border-slate-50 hover:bg-slate-50 cursor-pointer flex gap-3">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">{m.from[0]}</div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-700">{m.from}</p>
                                                <p className="text-[11px] text-slate-500 line-clamp-1">{m.text}</p>
                                                <p className="text-[9px] text-slate-400 mt-1">{m.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="hidden sm:block w-px h-8 bg-slate-200 mx-1 md:mx-2" />

                {/* Profile Dropdown */}
                <div className="relative">
                    <div onClick={() => toggleDropdown('profile')} className="flex items-center gap-2 md:gap-4 cursor-pointer group hover:opacity-80 transition-opacity">
                        <div className="flex flex-col items-center">
                            <img 
                                src="https://ui-avatars.com/api/?name=Admin&background=random" 
                                alt="Admin" 
                                className="w-8 h-8 md:w-9 md:h-9 rounded-full border border-slate-200 object-cover" 
                            />
                            <span className="hidden sm:flex text-[10px] md:text-[11px] font-black text-slate-600 mt-0.5 items-center gap-1">Admin <ChevronDown size={10} /></span>
                        </div>
                    </div>
                    {openDropdown === 'profile' && (
                        <div className="absolute top-14 right-0 w-48 bg-white rounded-lg shadow-xl border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                            <div className="p-3 border-b border-slate-100 flex flex-col items-center bg-slate-50 relative">
                               <img src="https://ui-avatars.com/api/?name=Admin&background=random" alt="Admin" className="w-12 h-12 rounded-full border-2 border-white shadow-sm mb-2" />
                               <span className="font-bold text-sm text-[#383a48]">Super Admin</span>
                               <span className="text-[10px] font-bold text-slate-400">admin@klyro.com</span>
                            </div>
                            <div className="p-1">
                                <button onClick={() => { setOpenDropdown(null); navigate('/admin/settings'); }} className="w-full text-left px-3 py-2 text-xs font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-700 rounded flex items-center gap-2">
                                    <Settings size={14} /> Settings
                                </button>
                                <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-xs font-bold text-red-500 hover:bg-red-50 rounded flex items-center gap-2">
                                    <LogOut size={14} /> Log out
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Region Flag */}
                <div className="hidden md:block relative">
                    <div onClick={() => toggleDropdown('lang')} className="flex items-center gap-1 cursor-pointer bg-slate-50 px-2 py-1 rounded border border-slate-200 hover:bg-slate-100 transition-colors">
                        <img src={`https://flagcdn.com/w20/${lang === 'in' ? 'in' : 'us'}.png`} alt="Country" className="w-5" />
                        <ChevronDown size={14} className="text-slate-400" />
                    </div>
                    {openDropdown === 'lang' && (
                        <div className="absolute top-10 right-0 w-36 bg-white rounded-md shadow-xl border border-slate-100 overflow-hidden z-50 p-1 animate-in fade-in slide-in-from-top-2">
                            <button onClick={() => { setLang('in'); setOpenDropdown(null); }} className={`w-full text-left px-3 py-1.5 text-xs font-bold rounded flex items-center justify-between ${lang === 'in' ? 'text-slate-600 bg-blue-50' : 'text-slate-500 hover:bg-slate-50'}`}>
                                <span className="flex items-center gap-2"><img src="https://flagcdn.com/w20/in.png" alt="India" className="w-4 shadow-sm" /> English (IN)</span>
                                {lang === 'in' && <Check size={12} className="text-blue-500" />}
                            </button>
                            <button onClick={() => { setLang('us'); setOpenDropdown(null); }} className={`w-full text-left px-3 py-1.5 text-xs font-bold rounded flex items-center justify-between ${lang === 'us' ? 'text-slate-600 bg-blue-50' : 'text-slate-500 hover:bg-slate-50'}`}>
                                <span className="flex items-center gap-2"><img src="https://flagcdn.com/w20/us.png" alt="USA" className="w-4 shadow-sm" /> English (US)</span>
                                {lang === 'us' && <Check size={12} className="text-blue-500" />}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default AdminTopbar;
