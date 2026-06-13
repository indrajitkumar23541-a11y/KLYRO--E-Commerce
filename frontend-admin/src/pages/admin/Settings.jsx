import React, { useState, useEffect } from 'react';
import { Save, Loader2 } from 'lucide-react';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const Settings = () => {
    const { user, token, login } = useAuth();
    const [config, setConfig] = useState({
        platform_name: "KLYRO E-Commerce",
        support_email: "support@klyro.com",
        maintenance_mode: false,
        auto_approve_sellers: true,
        enable_payments: true
    });
    
    // Profile State
    const [profile, setProfile] = useState({
        name: user?.name || "",
        email: user?.email || ""
    });

    // Password State
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [isSaving, setIsSaving] = useState(false);
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [isSavingPassword, setIsSavingPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await API.get('/admin/settings');
                if (res.data.success) {
                    setConfig(res.data.settings);
                }
            } catch (error) {
                console.error('Failed to fetch settings', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSettings();
    }, [token]);

    const handleToggle = (key) => {
        setConfig({...config, [key]: !config[key]});
    };

    const handleSaveConfig = async () => {
        setIsSaving(true);
        try {
            const res = await API.put('/admin/settings', config);
            if (res.data.success) {
                alert('Platform settings saved successfully!');
            }
        } catch (error) {
            console.error('Failed to save settings', error);
            alert('Failed to save settings. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleSaveProfile = async () => {
        setIsSavingProfile(true);
        try {
            const res = await API.put('/auth/profile', profile);
            if (res.data.success) {
                // Update local auth context too
                login(res.data.user, token);
                alert('Profile updated successfully!');
            }
        } catch (error) {
            console.error('Failed to update profile', error);
            alert('Failed to update profile.');
        } finally {
            setIsSavingProfile(false);
        }
    };

    const handleSavePassword = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            return alert('New passwords do not match');
        }
        setIsSavingPassword(true);
        try {
            const res = await API.put('/auth/password', {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            if (res.data.success) {
                alert('Password updated successfully!');
                setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
            }
        } catch (error) {
            console.error('Failed to update password', error);
            alert(error.response?.data?.message || 'Failed to update password.');
        } finally {
            setIsSavingPassword(false);
        }
    };

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
            <Loader2 size={32} className="animate-spin text-slate-400 mb-4" />
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Loading Settings...</p>
        </div>
    );

    return (
        <div className="space-y-12 animate-reveal max-w-4xl mx-auto pb-20">
            {/* Platform Settings Section */}
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-normal text-[#383a48] mb-1">Platform Configuration</h1>
                    <p className="text-[#84879b] text-xs md:text-sm">Global marketplace variables and system parameters.</p>
                </div>

                <div className="bg-white rounded-[20px] shadow-sm border border-slate-100/60 p-5 md:p-8 space-y-8">
                    <div>
                        <h3 className="text-base md:text-lg font-bold text-[#383a48] border-b border-slate-100 pb-2 mb-4">General</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                            <div>
                                <label className="block text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 md:mb-2">Platform Name</label>
                                <input 
                                    type="text" 
                                    value={config.platform_name} 
                                    onChange={(e) => setConfig({...config, platform_name: e.target.value})}
                                    className="w-full border-2 border-slate-100 rounded-lg px-4 py-2 font-bold text-sm text-slate-800 focus:border-[#5b7296] outline-none transition-colors bg-slate-50" 
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 md:mb-2">Support Email</label>
                                <input 
                                    type="email" 
                                    value={config.support_email} 
                                    onChange={(e) => setConfig({...config, support_email: e.target.value})}
                                    className="w-full border-2 border-slate-100 rounded-lg px-4 py-2 font-bold text-sm text-slate-800 focus:border-[#5b7296] outline-none transition-colors bg-slate-50" 
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-base md:text-lg font-bold text-[#383a48] border-b border-slate-100 pb-2 mb-4">System Parameters</h3>
                        <div className="space-y-4">
                            {[
                                { title: "Maintenance Mode", desc: "Disable frontend access for all non-admin users.", key: "maintenance_mode" },
                                { title: "Auto-approve Sellers", desc: "Skip manual verification for new merchant applications.", key: "auto_approve_sellers" },
                                { title: "Enable Payments", desc: "Allow live payments on checkout.", key: "enable_payments" }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-4 border border-slate-100 rounded-xl bg-slate-50/50">
                                    <div>
                                        <h4 className="font-bold text-[#383a48] text-sm">{item.title}</h4>
                                        <p className="text-xs text-slate-500 font-medium">{item.desc}</p>
                                    </div>
                                    <div 
                                        onClick={() => handleToggle(item.key)}
                                        className={`w-12 h-6 rounded-full relative cursor-pointer outline-none transition-colors duration-200 ${config[item.key] ? 'bg-emerald-500' : 'bg-slate-300'}`}
                                    >
                                        <div className={`w-4 h-4 bg-white rounded-full absolute top-1 shadow-sm transition-transform duration-200 ${config[item.key] ? 'translate-x-7' : 'translate-x-1'}`}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button 
                            onClick={handleSaveConfig}
                            disabled={isSaving}
                            className={`w-full sm:w-auto bg-[#5b7296] hover:bg-[#485c7d] text-white px-8 py-3 rounded-lg font-bold text-sm tracking-wide transition-colors flex items-center justify-center gap-2 shadow-sm ${isSaving ? 'opacity-80 cursor-wait' : ''}`}
                        >
                            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} 
                            {isSaving ? 'Saving...' : 'Save Configuration'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Admin Profile Section */}
            <div className="space-y-6">
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-[#383a48]">Admin Profile</h2>
                    <p className="text-[#84879b] text-xs md:text-sm">Manage your personal account information.</p>
                </div>

                <div className="bg-white rounded-[20px] shadow-sm border border-slate-100/60 p-5 md:p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        <div>
                            <label className="block text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 md:mb-2">Full Name</label>
                            <input 
                                type="text" 
                                value={profile.name} 
                                onChange={(e) => setProfile({...profile, name: e.target.value})}
                                className="w-full border-2 border-slate-100 rounded-lg px-4 py-2 font-bold text-sm text-slate-800 focus:border-[#5b7296] outline-none transition-colors bg-slate-50" 
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 md:mb-2">Email Address</label>
                            <input 
                                type="email" 
                                value={profile.email} 
                                onChange={(e) => setProfile({...profile, email: e.target.value})}
                                className="w-full border-2 border-slate-100 rounded-lg px-4 py-2 font-bold text-sm text-slate-800 focus:border-[#5b7296] outline-none transition-colors bg-slate-50" 
                            />
                        </div>
                    </div>
                    <div className="pt-8 flex justify-end">
                        <button 
                            onClick={handleSaveProfile}
                            disabled={isSavingProfile}
                            className={`w-full sm:w-auto bg-[#383a48] hover:bg-[#202020] text-white px-8 py-3 rounded-lg font-bold text-sm tracking-wide transition-colors flex items-center justify-center gap-2 shadow-sm ${isSavingProfile ? 'opacity-80' : ''}`}
                        >
                            {isSavingProfile ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} 
                            {isSavingProfile ? 'Updating...' : 'Update Profile'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Security Section */}
            <div className="space-y-6">
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-[#383a48]">Security</h2>
                    <p className="text-[#84879b] text-xs md:text-sm">Ensure your administrative access is secure.</p>
                </div>

                <div className="bg-white rounded-[20px] shadow-sm border border-slate-100/60 p-5 md:p-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                        <div>
                            <label className="block text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 md:mb-2">Current Password</label>
                            <input 
                                type="password" 
                                placeholder="••••••••"
                                value={passwordData.currentPassword}
                                onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                                className="w-full border-2 border-slate-100 rounded-lg px-4 py-2 font-bold text-sm text-slate-800 focus:border-[#5b7296] outline-none transition-colors bg-slate-50" 
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 md:mb-2">New Password</label>
                            <input 
                                type="password" 
                                placeholder="••••••••"
                                value={passwordData.newPassword}
                                onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                                className="w-full border-2 border-slate-100 rounded-lg px-4 py-2 font-bold text-sm text-slate-800 focus:border-[#5b7296] outline-none transition-colors bg-slate-50" 
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 md:mb-2">Confirm New Password</label>
                            <input 
                                type="password" 
                                placeholder="••••••••"
                                value={passwordData.confirmPassword}
                                onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                                className="w-full border-2 border-slate-100 rounded-lg px-4 py-2 font-bold text-sm text-slate-800 focus:border-[#5b7296] outline-none transition-colors bg-slate-50" 
                            />
                        </div>
                    </div>
                    <div className="pt-8 flex justify-end">
                        <button 
                            onClick={handleSavePassword}
                            disabled={isSavingPassword}
                            className={`w-full sm:w-auto bg-[#e5a975] hover:bg-orange-500 text-white px-8 py-3 rounded-lg font-bold text-sm tracking-wide transition-all flex items-center justify-center gap-2 shadow-sm ${isSavingPassword ? 'opacity-80' : ''}`}
                        >
                            {isSavingPassword ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} 
                            {isSavingPassword ? 'Changing...' : 'Change Password'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
