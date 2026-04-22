import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
    Package, Lock, MapPin, CreditCard, 
    Zap, MessageSquare, Heart, 
    Gift, Box, User, ChevronRight, HelpCircle,
    ChevronDown
} from 'lucide-react';
import { Link } from 'react-router-dom';

import API from '../api/axios';
import { Camera, ShieldCheck as Verified } from 'lucide-react';

const ProfilePage = () => {
    const { user, logout, updateUser } = useAuth();
    const [uploading, setUploading] = React.useState(false);

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('avatar', file);

        setUploading(true);
        try {
            const { data } = await API.put('/users/avatar', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (data.success) {
                updateUser({ avatar: data.avatar });
            }
        } catch (error) {
            console.error('Avatar upload failed:', error);
            alert('Failed to update profile picture. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-24">
                <div className="text-center space-y-4">
                    <User size={60} className="mx-auto text-gray-300" />
                    <h2 className="text-2xl font-medium text-gray-800">Sign in to your account</h2>
                    <Link to="/login" className="inline-block px-12 py-3 bg-[#ffd814] hover:bg-[#f7ca00] text-[#111] rounded-lg font-medium shadow-sm border border-[#fcd200]">
                        Sign In
                    </Link>
                </div>
            </div>
        );
    }

    const accountTiles = [
        { 
            title: 'Your Orders', 
            desc: 'Track, return, or buy things again', 
            icon: <Box size={40} className="text-blue-400" strokeWidth={1} />, 
            path: '/orders' 
        },
        { 
            title: 'Login & security', 
            desc: 'Edit login, name, and mobile number', 
            icon: <Lock size={40} className="text-gray-400" strokeWidth={1} />, 
            path: '/profile' 
        },
        { 
            title: 'KLYRO Prime', 
            desc: 'View benefits and payment settings', 
            icon: <Zap size={40} className="text-blue-500" strokeWidth={1} />, 
            path: '#' 
        },
        { 
            title: 'Your Addresses', 
            desc: 'Edit addresses for orders and gifts', 
            icon: <MapPin size={40} className="text-gray-400" strokeWidth={1} />, 
            path: '#' 
        },
        { 
            title: 'Payment options', 
            desc: 'Edit or add payment methods', 
            icon: <CreditCard size={40} className="text-gray-400" strokeWidth={1} />, 
            path: '#' 
        },
        { 
            title: 'Your Favorites', 
            desc: 'View and manage your wishlist', 
            icon: <Heart size={40} className="text-rose-400" strokeWidth={1} />, 
            path: '/favorites' 
        },
        { 
            title: 'Your Profiles', 
            desc: 'Manage, add, or remove user profiles', 
            icon: <User size={40} className="text-gray-400" strokeWidth={1} />, 
            path: '#' 
        },
        { 
            title: 'Gift Cards', 
            desc: 'View balance or redeem a card', 
            icon: <Gift size={40} className="text-emerald-400" strokeWidth={1} />, 
            path: '#' 
        },
        { 
            title: 'Contact Us', 
            desc: 'Get help with your orders or account', 
            icon: <MessageSquare size={40} className="text-gray-400" strokeWidth={1} />, 
            path: '#' 
        }
    ];

    return (
        <div className="bg-white min-h-screen pt-24 pb-32 font-sans">
            <div className="max-w-[1000px] mx-auto px-6">
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-8 border-b border-gray-100 pb-10">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        {/* AVATAR UPLOAD SECTION */}
                        <div className="relative group">
                            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white shadow-xl bg-gray-50 flex items-center justify-center">
                                {user.avatar ? (
                                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                ) : (
                                    <User size={48} className="text-gray-300" strokeWidth={1} />
                                )}
                                {uploading && (
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                )}
                            </div>
                            <label className="absolute bottom-1 right-1 w-8 h-8 md:w-10 md:h-10 bg-gray-900 rounded-full flex items-center justify-center text-white cursor-pointer hover:bg-[#BC612C] transition-all shadow-lg group-hover:scale-110">
                                <Camera size={16} />
                                <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                            </label>
                        </div>

                        <div className="text-center md:text-left space-y-2">
                            <h1 className="text-3xl font-medium text-[#111]">Your Account</h1>
                            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-sm text-gray-500">
                                <span className="text-[#007185] font-bold uppercase tracking-widest text-[11px] flex items-center gap-1.5">
                                    {user.name} <Verified size={14} className="text-blue-500" />
                                </span>
                                <span className="hidden md:inline text-gray-300">•</span>
                                <span className="uppercase tracking-[0.2em] text-[10px] font-black text-gray-300">KLYRO Premier Member</span>
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={logout}
                        className="w-full md:w-auto px-10 py-3 border border-gray-300 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-gray-50 transition-all shadow-sm"
                    >
                        Sign Out
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {accountTiles.map((tile, i) => (
                        <Link 
                            key={i} 
                            to={tile.path}
                            className="flex items-center gap-4 p-5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all group"
                        >
                            <div className="shrink-0">
                                {tile.icon}
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-sm font-bold text-[#111] group-hover:text-[#007185] transition-colors">{tile.title}</h3>
                                <p className="text-xs text-gray-400 leading-snug">{tile.desc}</p>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Additional Links Section */}
                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-12 pt-12 border-t border-gray-100">
                    <div className="space-y-4">
                        <h4 className="font-bold text-[#111] border-b pb-2">Digital content and devices</h4>
                        <ul className="space-y-2 text-sm text-[#007185]">
                            <li><button className="hover:text-[#c45500] hover:underline">Apps and more</button></li>
                            <li><button className="hover:text-[#c45500] hover:underline">Content and devices</button></li>
                            <li><button className="hover:text-[#c45500] hover:underline">Cloud Drive</button></li>
                        </ul>
                    </div>
                    <div className="space-y-4">
                        <h4 className="font-bold text-[#111] border-b pb-2">Email alerts, messages, and ads</h4>
                        <ul className="space-y-2 text-sm text-[#007185]">
                            <li><button className="hover:text-[#c45500] hover:underline">Advertising preferences</button></li>
                            <li><button className="hover:text-[#c45500] hover:underline">Communication preferences</button></li>
                            <li><button className="hover:text-[#c45500] hover:underline">SMS alert settings</button></li>
                        </ul>
                    </div>
                    <div className="space-y-4">
                        <h4 className="font-bold text-[#111] border-b pb-2">More ways to pay</h4>
                        <ul className="space-y-2 text-sm text-[#007185]">
                            <li><button className="hover:text-[#c45500] hover:underline">KLYRO Pay Balance</button></li>
                            <li><button className="hover:text-[#c45500] hover:underline">Credit cards</button></li>
                            <li><button className="hover:text-[#c45500] hover:underline">Installment plans</button></li>
                        </ul>
                    </div>
                </div>

                {/* Seller Shortcut */}
                {user.role === 'user' && (
                    <div className="mt-12 bg-blue-50 border border-blue-100 p-8 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="space-y-1 text-center md:text-left">
                            <h3 className="font-bold text-blue-900">Want to sell on KLYRO?</h3>
                            <p className="text-sm text-blue-700">Open your shop today and reach millions of customers.</p>
                        </div>
                        <Link to="/register-seller" className="px-10 py-3 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20">
                            Get Started
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
