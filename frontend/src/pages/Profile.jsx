import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Package, Heart, LogOut, ChevronRight, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const Profile = () => {
    const { user, logout } = useAuth();

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0a0a0b] pt-24">
                <div className="text-center space-y-4">
                    <div className="w-20 h-20 bg-gray-200 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto">
                        <User size={40} className="text-gray-400" />
                    </div>
                    <h2 className="text-2xl font-black text-gray-800 dark:text-white uppercase tracking-widest">Access Reserved</h2>
                    <p className="text-gray-500 max-w-xs mx-auto text-sm">Please sign in to view your high-fidelity profile and order history.</p>
                    <Link to="/login" className="inline-block px-8 py-3 bg-[#717fe0] text-white rounded-full font-black uppercase text-[11px] tracking-widest shadow-xl shadow-[#717fe0]/30 hover:scale-105 transition-all">Sign In to Hub</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0b] pt-24 pb-32 transition-colors duration-500">
            <div className="max-w-[1200px] mx-auto px-4 md:px-8">
                
                {/* Profile Header */}
                <div className="bg-white dark:bg-white/5 rounded-[2rem] p-8 md:p-12 shadow-2xl relative overflow-hidden border border-gray-100 dark:border-white/5 group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#717fe0]/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                    
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                        <div className="relative">
                            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-[#717fe0]/20 p-1">
                                <img 
                                    src={user.avatar || `https://i.pravatar.cc/150?u=${user.email}`} 
                                    alt="Avatar" 
                                    className="w-full h-full object-cover rounded-full shadow-2xl"
                                />
                            </div>
                            <div className="absolute bottom-2 right-2 w-10 h-10 bg-[#717fe0] rounded-full flex items-center justify-center text-white border-4 border-white dark:border-[#121214] shadow-lg">
                                <Settings size={18} />
                            </div>
                        </div>

                        <div className="text-center md:text-left space-y-2">
                            <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">
                                {user.name}
                            </h1>
                            <div className="flex flex-wrap justify-center md:justify-start gap-4">
                                <div className="flex items-center gap-2 text-gray-500 dark:text-white/40 text-sm font-bold">
                                    <Mail size={16} />
                                    {user.email}
                                </div>
                                <div className="px-3 py-1 bg-[#717fe0]/10 text-[#717fe0] text-[10px] font-black uppercase tracking-widest rounded-full">
                                    {user.role} Account
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                    {[
                        { title: 'Recent Orders', desc: 'Track your packages', icon: <Package />, path: '/orders', color: 'bg-blue-500' },
                        { title: 'My Favorites', desc: 'Curated wishlist', icon: <Heart />, path: '/favorites', color: 'bg-rose-500' },
                        { title: 'Settings', desc: 'Privacy & Preferences', icon: <Settings />, path: '/settings', color: 'bg-emerald-500' }
                    ].map((item, idx) => (
                        <Link 
                            key={idx} 
                            to={item.path}
                            className="bg-white dark:bg-white/5 p-8 rounded-[2rem] border border-gray-100 dark:border-white/5 hover:scale-[1.02] transition-all group/card shadow-xl hover:shadow-2xl"
                        >
                            <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center text-white mb-6 group-hover/card:rotate-6 transition-transform shadow-lg`}>
                                {item.icon}
                            </div>
                            <h3 className="text-xl font-black text-gray-800 dark:text-white uppercase tracking-tight">{item.title}</h3>
                            <p className="text-sm text-gray-500 dark:text-white/30 font-bold mb-6">{item.desc}</p>
                            <div className="flex items-center gap-2 text-[#717fe0] font-black uppercase text-[10px] tracking-widest">
                                Explore <ChevronRight size={14} />
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Logout Session */}
                <div className="mt-12 text-center">
                    <button 
                        onClick={logout}
                        className="px-10 py-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] transition-all border border-red-500/20 flex items-center gap-3 mx-auto"
                    >
                        <LogOut size={18} />
                        Terminate Session
                    </button>
                    <p className="mt-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">KLYRO SECURE ACCESS PROTOCOL</p>
                </div>
            </div>
        </div>
    );
};

export default Profile;
