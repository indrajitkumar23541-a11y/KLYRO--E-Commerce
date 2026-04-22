import React, { useState, useEffect, useRef } from 'react';
import { User, Store, Shield, Bell, Save, CheckCircle, Camera, Loader2, Key, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import API from '../../api/axios';

const Settings = () => {
    const { user, login } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [status, setStatus] = useState({ type: '', msg: '' });
    const fileInputRef = useRef(null);

    const [form, setForm] = useState({
        name: '',
        email: '',
        storeName: '',
        storeDescription: '',
        phone: '',
        address: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        email_notifications: true,
        order_notifications: true,
        marketing_notifications: false
    });

    const [avatarPreview, setAvatarPreview] = useState(null);
    const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });

    useEffect(() => {
        const fetchSettings = async () => {
            setIsLoading(true);
            try {
                const res = await API.get('/seller/profile');
                if (res.data.success) {
                    const profile = res.data.profile;
                    setForm(prev => ({
                        ...prev,
                        name: profile.name || '',
                        email: profile.email || '',
                        storeName: profile.store_name || '',
                        storeDescription: profile.store_description || '',
                        phone: profile.phone || '',
                        address: profile.address || '',
                        email_notifications: Boolean(profile.email_notifications),
                        order_notifications: Boolean(profile.order_notifications),
                        marketing_notifications: Boolean(profile.marketing_notifications)
                    }));
                    if (profile.avatar) {
                        setAvatarPreview(profile.avatar);
                    }
                }
            } catch (err) {
                console.error('Failed to fetch settings:', err);
                setStatus({ type: 'error', msg: 'Failed to load settings. Please try again.' });
            } finally {
                setIsLoading(false);
            }
        };

        fetchSettings();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleAvatarUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Preview
        const reader = new FileReader();
        reader.onloadend = () => setAvatarPreview(reader.result);
        reader.readAsDataURL(file);

        // Upload
        const formData = new FormData();
        formData.append('avatar', file);

        setIsSaving(true);
        setStatus({ type: '', msg: '' });
        try {
            const res = await API.put('/auth/avatar', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (res.data.success) {
                setStatus({ type: 'success', msg: 'Profile picture updated successfully!' });
                // Update local context if possible
                if (user) {
                    login({ ...user, avatar: res.data.avatar }, localStorage.getItem('token'));
                }
            }
        } catch (err) {
            setStatus({ type: 'error', msg: err.response?.data?.message || 'Failed to upload image.' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setStatus({ type: '', msg: '' });

        try {
            let endpoint = '/seller/profile';
            let payload = {
                name: form.name,
                storeName: form.storeName,
                storeDescription: form.storeDescription,
                phone: form.phone,
                address: form.address
            };

            if (activeTab === 'notifications') {
                endpoint = '/seller/notifications';
                payload = {
                    email_notifications: form.email_notifications,
                    order_notifications: form.order_notifications,
                    marketing_notifications: form.marketing_notifications
                };
            }

            const res = await API.put(endpoint, payload);
            if (res.data.success) {
                setStatus({ type: 'success', msg: 'Settings saved successfully!' });
                setTimeout(() => setStatus({ type: '', msg: '' }), 3000);
            }
        } catch (err) {
            setStatus({ type: 'error', msg: err.response?.data?.message || 'Failed to save settings.' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        if (form.newPassword !== form.confirmPassword) {
            return setStatus({ type: 'error', msg: 'New passwords do not match.' });
        }

        setIsSaving(true);
        setStatus({ type: '', msg: '' });

        try {
            const res = await API.put('/auth/password', {
                currentPassword: form.currentPassword,
                newPassword: form.newPassword
            });
            if (res.data.success) {
                setStatus({ type: 'success', msg: 'Password updated successfully!' });
                setForm(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
                setTimeout(() => setStatus({ type: '', msg: '' }), 3000);
            }
        } catch (err) {
            setStatus({ type: 'error', msg: err.response?.data?.message || 'Failed to update password.' });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <Loader2 className="animate-spin text-blue-600" size={40} />
                <p className="text-slate-400 font-bold animate-pulse">Loading identity...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl space-y-8 animate-reveal">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Store Settings</h1>
                <p className="text-slate-500 text-sm mt-1">Manage your account preferences and store configuration.</p>
            </div>

            {status.msg && (
                <div className={`${status.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-red-50 border-red-100 text-red-600'} border px-6 py-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2`}>
                    {status.type === 'success' ? <CheckCircle size={20} /> : <Shield size={20} />}
                    <span className="font-bold text-sm tracking-tight">{status.msg}</span>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Navigation Sidebar */}
                <div className="md:col-span-1 space-y-2">
                    {[
                        { id: 'profile', icon: <User size={18} />, label: 'Profile Information' },
                        { id: 'identity', icon: <Store size={18} />, label: 'Store Identity' },
                        { id: 'security', icon: <Shield size={18} />, label: 'Security & Access' },
                        { id: 'notifications', icon: <Bell size={18} />, label: 'Notifications' }
                    ].map((item) => (
                        <button 
                            key={item.id} 
                            onClick={() => { setActiveTab(item.id); setStatus({ type: '', msg: '' }); }}
                            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all ${activeTab === item.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-500 hover:bg-white hover:text-blue-600'}`}
                        >
                            {item.icon}
                            {item.label}
                        </button>
                    ))}
                </div>

                {/* Form Content Area */}
                <div className="md:col-span-2 bg-white dark:bg-white/5 p-6 md:p-8 rounded-[2rem] border border-slate-100 dark:border-white/5 shadow-2xl shadow-slate-100/50">
                    
                    {/* PROFILE TAB */}
                    {activeTab === 'profile' && (
                        <div className="space-y-8 animate-reveal">
                            <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-50 dark:border-white/5">
                                <div className="relative group">
                                    <div className="w-24 h-24 rounded-[2rem] bg-blue-100 dark:bg-blue-600/20 flex items-center justify-center overflow-hidden border-4 border-white dark:border-[#1a1a1b] shadow-xl">
                                        {avatarPreview ? (
                                            <img src={avatarPreview.startsWith('data:') ? avatarPreview : `${import.meta.env.VITE_API_URL || ''}${avatarPreview}`} alt="Avatar" className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-3xl font-black text-blue-600">{form.name?.[0] || 'U'}</span>
                                        )}
                                    </div>
                                    <button 
                                        onClick={() => fileInputRef.current?.click()}
                                        className="absolute -bottom-2 -right-2 p-2 bg-slate-900 text-white rounded-xl shadow-lg hover:bg-blue-600 transition-all active:scale-90"
                                    >
                                        <Camera size={16} />
                                    </button>
                                    <input 
                                        type="file" 
                                        ref={fileInputRef} 
                                        onChange={handleAvatarUpload} 
                                        className="hidden" 
                                        accept="image/*"
                                    />
                                </div>
                                <div className="text-center sm:text-left">
                                    <h3 className="font-black text-xl text-slate-800 dark:text-white leading-none mb-1">Avatar Identity</h3>
                                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Recommended: 400x400 JPG or PNG</p>
                                </div>
                            </div>

                            <form onSubmit={handleSaveProfile} className="space-y-6">
                                <div className="grid grid-cols-1 gap-6">
                                    <div className="space-y-2 group">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/30 ml-1">Legal Full Name</label>
                                        <input 
                                            type="text" 
                                            name="name"
                                            value={form.name}
                                            onChange={handleChange}
                                            className="w-full bg-slate-50 dark:bg-white/5 border-2 border-slate-50 dark:border-transparent rounded-2xl px-5 py-4 text-sm font-bold text-slate-700 dark:text-white focus:bg-white dark:focus:bg-white/10 focus:border-blue-500 transition-all outline-none" 
                                        />
                                    </div>
                                    <div className="space-y-2 opacity-60">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/30 ml-1">Email (Authenticated)</label>
                                        <input 
                                            disabled
                                            type="email" 
                                            value={form.email}
                                            className="w-full bg-slate-100 dark:bg-white/10 border-2 border-slate-100 dark:border-transparent rounded-2xl px-5 py-4 text-sm font-bold text-slate-400 dark:text-white/40 cursor-not-allowed" 
                                        />
                                    </div>
                                </div>
                                <div className="pt-4">
                                    <button 
                                        disabled={isSaving}
                                        type="submit" 
                                        className="w-full sm:w-auto flex items-center justify-center gap-3 bg-slate-900 dark:bg-white text-white dark:text-black px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl hover:-translate-y-1 active:scale-95 disabled:opacity-50"
                                    >
                                        {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} 
                                        Update Profile
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* STORE IDENTITY TAB */}
                    {activeTab === 'identity' && (
                        <form onSubmit={handleSaveProfile} className="space-y-6 animate-reveal">
                            <div className="space-y-2 group">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/30 ml-1">Marketplace Display Name</label>
                                <input 
                                    type="text" 
                                    name="storeName"
                                    value={form.storeName}
                                    onChange={handleChange}
                                    placeholder="Enter your store name"
                                    className="w-full bg-slate-50 dark:bg-white/5 border-2 border-slate-50 dark:border-transparent rounded-2xl px-5 py-4 text-sm font-bold text-slate-700 dark:text-white focus:bg-white focus:border-blue-500 transition-all outline-none" 
                                />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2 group">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/30 ml-1">Business Phone</label>
                                    <input 
                                        type="text" 
                                        name="phone"
                                        value={form.phone}
                                        onChange={handleChange}
                                        placeholder="+91 00000 00000"
                                        className="w-full bg-slate-50 dark:bg-white/5 border-2 border-slate-50 dark:border-transparent rounded-2xl px-5 py-4 text-sm font-bold text-slate-700 dark:text-white focus:bg-white focus:border-blue-500 transition-all outline-none" 
                                    />
                                </div>
                                <div className="space-y-2 group">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/30 ml-1">Warehouse / HQ Location</label>
                                    <input 
                                        type="text" 
                                        name="address"
                                        value={form.address}
                                        onChange={handleChange}
                                        placeholder="City, Region"
                                        className="w-full bg-slate-50 dark:bg-white/5 border-2 border-slate-50 dark:border-transparent rounded-2xl px-5 py-4 text-sm font-bold text-slate-700 dark:text-white focus:bg-white focus:border-blue-500 transition-all outline-none" 
                                    />
                                </div>
                            </div>
                            <div className="space-y-2 group">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/30 ml-1">Merchant Description</label>
                                <textarea 
                                    name="storeDescription"
                                    value={form.storeDescription}
                                    onChange={handleChange}
                                    rows="4"
                                    placeholder="Tell your customers about your brand story..."
                                    className="w-full bg-slate-50 dark:bg-white/5 border-2 border-slate-50 dark:border-transparent rounded-2xl px-5 py-4 text-sm font-bold text-slate-700 dark:text-white focus:bg-white focus:border-blue-500 transition-all outline-none resize-none" 
                                />
                            </div>
                            <div className="pt-4">
                                <button 
                                    disabled={isSaving}
                                    type="submit" 
                                    className="flex items-center gap-3 bg-slate-900 dark:bg-white text-white dark:text-black px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl hover:-translate-y-1 active:scale-95 disabled:opacity-50"
                                >
                                    {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Update Store
                                </button>
                            </div>
                        </form>
                    )}

                    {/* SECURITY TAB */}
                    {activeTab === 'security' && (
                        <form onSubmit={handleUpdatePassword} className="space-y-6 animate-reveal">
                            <div className="flex items-center gap-4 p-4 bg-amber-50 dark:bg-amber-500/10 rounded-2xl border border-amber-100 dark:border-amber-500/20 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/20">
                                    <Shield size={20} />
                                </div>
                                <div>
                                    <h4 className="text-sm font-black text-amber-900 dark:text-amber-200 uppercase tracking-tight">Security Protocol</h4>
                                    <p className="text-xs text-amber-600 dark:text-amber-400 font-bold">Regular password rotations maximize vault security.</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/30 ml-1">Current Password</label>
                                    <div className="relative">
                                        <input 
                                            type={showPasswords.current ? "text" : "password"}
                                            name="currentPassword"
                                            value={form.currentPassword}
                                            onChange={handleChange}
                                            className="w-full bg-slate-50 dark:bg-white/5 border-2 border-slate-50 dark:border-transparent rounded-2xl px-5 py-4 pr-12 text-sm font-bold text-slate-700 dark:text-white focus:bg-white focus:border-blue-500 transition-all outline-none" 
                                        />
                                        <button type="button" onClick={() => setShowPasswords(p => ({...p, current: !p.current}))} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors">
                                            {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/30 ml-1">New Password</label>
                                        <div className="relative">
                                            <input 
                                                type={showPasswords.new ? "text" : "password"}
                                                name="newPassword"
                                                value={form.newPassword}
                                                onChange={handleChange}
                                                className="w-full bg-slate-50 dark:bg-white/5 border-2 border-slate-50 dark:border-transparent rounded-2xl px-5 py-4 pr-12 text-sm font-bold text-slate-700 dark:text-white focus:bg-white focus:border-blue-500 transition-all outline-none" 
                                            />
                                            <button type="button" onClick={() => setShowPasswords(p => ({...p, new: !p.new}))} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors">
                                                {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/30 ml-1">Confirm Access</label>
                                        <div className="relative">
                                            <input 
                                                type={showPasswords.confirm ? "text" : "password"}
                                                name="confirmPassword"
                                                value={form.confirmPassword}
                                                onChange={handleChange}
                                                className="w-full bg-slate-50 dark:bg-white/5 border-2 border-slate-50 dark:border-transparent rounded-2xl px-5 py-4 pr-12 text-sm font-bold text-slate-700 dark:text-white focus:bg-white focus:border-blue-500 transition-all outline-none" 
                                            />
                                            <button type="button" onClick={() => setShowPasswords(p => ({...p, confirm: !p.confirm}))} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors">
                                                {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4">
                                <button 
                                    disabled={isSaving || !form.newPassword}
                                    type="submit" 
                                    className="flex items-center gap-3 bg-red-600 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-red-500/20 hover:-translate-y-1 active:scale-95 disabled:opacity-50"
                                >
                                    {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Key size={16} />} Update Encryption
                                </button>
                            </div>
                        </form>
                    )}

                    {/* NOTIFICATIONS TAB */}
                    {activeTab === 'notifications' && (
                        <form onSubmit={handleSaveProfile} className="space-y-6 animate-reveal">
                            <div className="space-y-4">
                                {[
                                    { id: 'email_notifications', label: 'Email Communication', desc: 'Receive critical account and performance reports via email.' },
                                    { id: 'order_notifications', label: 'Order Velocity Alerts', desc: 'Get instant feedback on new orders and inventory movements.' },
                                    { id: 'marketing_notifications', label: 'Merchant Growth Tips', desc: 'Unlock seasonal trends and high-fidelity marketing recommendations.' }
                                ].map((notif) => (
                                    <label key={notif.id} className="flex items-start gap-4 p-5 rounded-[1.5rem] bg-slate-50 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 border border-transparent hover:border-blue-500/20 transition-all cursor-pointer group">
                                        <div className="pt-1">
                                            <input 
                                                type="checkbox"
                                                name={notif.id}
                                                checked={form[notif.id]}
                                                onChange={handleChange}
                                                className="w-5 h-5 rounded-lg border-2 border-slate-200 dark:border-white/10 text-blue-600 focus:ring-0 transition-all"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight group-hover:text-blue-600 transition-colors">{notif.label}</h4>
                                            <p className="text-xs text-slate-400 font-bold leading-relaxed">{notif.desc}</p>
                                        </div>
                                    </label>
                                ))}
                            </div>
                            <div className="pt-4">
                                <button 
                                    disabled={isSaving}
                                    type="submit" 
                                    className="flex items-center gap-3 bg-slate-900 dark:bg-white text-white dark:text-black px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl hover:-translate-y-1 active:scale-95 disabled:opacity-50"
                                >
                                    {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Bell size={16} />} Save Preferences
                                </button>
                            </div>
                        </form>
                    )}

                </div>
            </div>
        </div>
    );
};

export default Settings;
