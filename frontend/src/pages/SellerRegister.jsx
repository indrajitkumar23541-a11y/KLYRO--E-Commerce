import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Store, Building2, Phone, MapPin, ArrowRight, CheckCircle2, ShieldCheck, Zap, Globe2, Briefcase } from 'lucide-react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const SellerRegister = () => {
    const { user, login } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [autoApproved, setAutoApproved] = useState(false);

    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        password: '',
        storeName: '',
        storeDescription: '',
        phone: '',
        address: ''
    });

    const isStep1Valid = formData.name && formData.email && (user ? true : formData.password);
    const isStep2Valid = formData.storeName && formData.phone && formData.address;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const res = await API.post('/auth/register-seller', formData);
            if (res.data.success) {
                setIsSuccess(true);
                setAutoApproved(res.data.autoApproved);
                if (res.data.autoApproved) {
                    // Update auth context with new role
                    login(res.data.user, res.data.user.token);
                }
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit application. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0a0a0b] px-4 pt-20">
                <div className="max-w-md w-full bg-white dark:bg-white/5 p-10 rounded-[2.5rem] shadow-2xl text-center border border-gray-100 dark:border-white/5 animate-reveal">
                    <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 size={40} className="text-emerald-500" />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-4">
                        {autoApproved ? "Welcome to the Inner Circle!" : "Application Received"}
                    </h2>
                    <p className="text-gray-500 dark:text-white/40 text-sm mb-10 leading-relaxed font-bold">
                        {autoApproved 
                            ? "Your high-fidelity store is now live. Start listing your premium products and scale your brand today."
                            : "Our curation team is reviewing your application. You'll receive an email notification once your merchant status is approved."}
                    </p>
                    <button 
                        onClick={() => navigate(autoApproved ? '/seller' : '/')}
                        className="w-full py-4 bg-[#717fe0] text-white rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] shadow-xl shadow-[#717fe0]/20 hover:scale-105 transition-all"
                    >
                        {autoApproved ? "Go to Dashboard" : "Return to Marketplace"}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-[#0a0a0b] pt-28 pb-20 px-4 transition-colors duration-500 overflow-x-hidden">
            <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                
                {/* Left Side: Marketing Content */}
                <div className="relative space-y-10 animate-reveal-left">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#717fe0]/10 text-[#717fe0] rounded-full text-[10px] font-black uppercase tracking-widest border border-[#717fe0]/20">
                        <Zap size={14} fill="currentColor" /> Marketplace Expansion Program
                    </div>
                    
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 dark:text-white uppercase tracking-tighter italic leading-none">
                        Scale your <br/> <span className="text-[#717fe0]">Empire</span> with us.
                    </h1>
                    
                    <p className="text-gray-500 dark:text-white/40 text-base md:text-lg max-w-lg font-bold leading-relaxed">
                        Join an elite collection of merchants. Leverage our high-fidelity infrastructure to reach millions of collectors worldwide.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
                        {[
                            { icon: <ShieldCheck />, title: "Secure Escrow", desc: "Enterprise-grade payment protection" },
                            { icon: <Globe2 />, title: "Global Reach", desc: "Instant access to 50+ regions" },
                            { icon: <Zap />, title: "Rapid Scale", desc: "List and launch in under 5 minutes" },
                            { icon: <Briefcase />, title: "Admin Support", desc: "24/7 dedicated merchant success" }
                        ].map((item, i) => (
                            <div key={i} className="flex gap-4 group">
                                <div className="w-12 h-12 bg-gray-100 dark:bg-white/5 rounded-2xl flex items-center justify-center text-[#717fe0] group-hover:bg-[#717fe0] group-hover:text-white transition-all shadow-sm">
                                    {item.icon}
                                </div>
                                <div>
                                    <h4 className="font-black text-gray-800 dark:text-white text-sm uppercase tracking-tight">{item.title}</h4>
                                    <p className="text-xs text-gray-400 dark:text-white/20 font-bold">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Side: Form */}
                <div className="relative animate-reveal-right">
                    <div className="absolute -top-10 -right-10 w-64 h-64 bg-[#717fe0]/10 rounded-full blur-3xl opacity-50"></div>
                    
                    <div className="relative bg-white dark:bg-white/5 p-8 md:p-12 rounded-[3rem] shadow-2xl border border-gray-100 dark:border-white/5 backdrop-blur-xl">
                        
                        {/* Step Indicators */}
                        <div className="flex items-center gap-4 mb-12">
                            {[1, 2].map(s => (
                                <div key={s} className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-xs transition-all ${step >= s ? 'bg-[#717fe0] text-white shadow-lg shadow-[#717fe0]/30' : 'bg-gray-100 dark:bg-white/10 text-gray-400'}`}>
                                        {s}
                                    </div>
                                    {s === 1 && <div className={`w-8 h-1 rounded-full transition-all ${step === 2 ? 'bg-[#717fe0]' : 'bg-gray-100 dark:bg-white/10'}`}></div>}
                                </div>
                            ))}
                            <div className="ml-auto text-[10px] font-black uppercase tracking-widest text-[#717fe0] bg-[#717fe0]/10 px-3 py-1 rounded-full">
                                {step === 1 ? "Personal Profile" : "Merchant Details"}
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-500/10 text-red-500 p-4 rounded-2xl mb-8 text-[11px] font-black uppercase tracking-widest border border-red-500/20 flex items-center gap-3">
                                <Zap size={14} /> {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {step === 1 ? (
                                <div className="space-y-6 animate-reveal">
                                    <div className="space-y-2 group">
                                        <label className="text-[10px] font-black text-gray-400 dark:text-white/30 uppercase tracking-[0.2em] pl-1">Legal Name</label>
                                        <div className="relative">
                                            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 dark:text-white/10 group-focus-within:text-[#717fe0] transition-colors" size={18} />
                                            <input 
                                                type="text" 
                                                value={formData.name}
                                                disabled={!!user}
                                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                                placeholder="John Doe"
                                                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 py-4 pl-12 pr-6 rounded-2xl text-sm font-bold text-gray-800 dark:text-white focus:border-[#717fe0] outline-none transition-all placeholder:text-gray-300 dark:placeholder:text-white/10"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2 group">
                                        <label className="text-[10px] font-black text-gray-400 dark:text-white/30 uppercase tracking-[0.2em] pl-1">Professional Email</label>
                                        <div className="relative">
                                            <Globe2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 dark:text-white/10 group-focus-within:text-[#717fe0] transition-colors" size={18} />
                                            <input 
                                                type="email" 
                                                value={formData.email}
                                                disabled={!!user}
                                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                                placeholder="merchant@klyro.com"
                                                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 py-4 pl-12 pr-6 rounded-2xl text-sm font-bold text-gray-800 dark:text-white focus:border-[#717fe0] outline-none transition-all placeholder:text-gray-300 dark:placeholder:text-white/10"
                                            />
                                        </div>
                                    </div>
                                    {!user && (
                                        <div className="space-y-2 group">
                                            <label className="text-[10px] font-black text-gray-400 dark:text-white/30 uppercase tracking-[0.2em] pl-1">Secure Password</label>
                                            <div className="relative">
                                                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 dark:text-white/10 group-focus-within:text-[#717fe0] transition-colors" size={18} />
                                                <input 
                                                    type="password" 
                                                    value={formData.password}
                                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                                    placeholder="••••••••••••"
                                                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 py-4 pl-12 pr-6 rounded-2xl text-sm font-bold text-gray-800 dark:text-white focus:border-[#717fe0] outline-none transition-all placeholder:text-gray-300 dark:placeholder:text-white/10"
                                                />
                                            </div>
                                        </div>
                                    )}
                                    <button 
                                        type="button"
                                        disabled={!isStep1Valid}
                                        onClick={() => setStep(2)}
                                        className="w-full bg-gray-900 dark:bg-white text-white dark:text-black py-5 rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] hover:bg-[#717fe0] dark:hover:bg-[#717fe0] hover:text-white transition-all shadow-xl flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Next Step <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-6 animate-reveal">
                                    <div className="space-y-2 group">
                                        <label className="text-[10px] font-black text-gray-400 dark:text-white/30 uppercase tracking-[0.2em] pl-1">Store Name</label>
                                        <div className="relative">
                                            <Store className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 dark:text-white/10 group-focus-within:text-[#717fe0] transition-colors" size={18} />
                                            <input 
                                                type="text" 
                                                value={formData.storeName}
                                                onChange={(e) => setFormData({...formData, storeName: e.target.value})}
                                                placeholder="Boutique Name"
                                                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 py-4 pl-12 pr-6 rounded-2xl text-sm font-bold text-gray-800 dark:text-white focus:border-[#717fe0] outline-none transition-all placeholder:text-gray-300 dark:placeholder:text-white/10"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2 group">
                                            <label className="text-[10px] font-black text-gray-400 dark:text-white/30 uppercase tracking-[0.2em] pl-1">Business Phone</label>
                                            <div className="relative">
                                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 dark:text-white/10 group-focus-within:text-[#717fe0] transition-colors" size={18} />
                                                <input 
                                                    type="tel" 
                                                    value={formData.phone}
                                                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                                    placeholder="+1 (555) 000-0000"
                                                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 py-4 pl-12 pr-6 rounded-2xl text-sm font-bold text-gray-800 dark:text-white focus:border-[#717fe0] outline-none transition-all placeholder:text-gray-300 dark:placeholder:text-white/10"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2 group">
                                            <label className="text-[10px] font-black text-gray-400 dark:text-white/30 uppercase tracking-[0.2em] pl-1">HQ Location</label>
                                            <div className="relative">
                                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 dark:text-white/10 group-focus-within:text-[#717fe0] transition-colors" size={18} />
                                                <input 
                                                    type="text" 
                                                    value={formData.address}
                                                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                                                    placeholder="City, Country"
                                                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 py-4 pl-12 pr-6 rounded-2xl text-sm font-bold text-gray-800 dark:text-white focus:border-[#717fe0] outline-none transition-all placeholder:text-gray-300 dark:placeholder:text-white/10"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-2 group">
                                        <label className="text-[10px] font-black text-gray-400 dark:text-white/30 uppercase tracking-[0.2em] pl-1">Store Description</label>
                                        <textarea 
                                            value={formData.storeDescription}
                                            onChange={(e) => setFormData({...formData, storeDescription: e.target.value})}
                                            placeholder="Tell us about your brand's vision..."
                                            rows="3"
                                            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 py-4 px-6 rounded-2xl text-sm font-bold text-gray-800 dark:text-white focus:border-[#717fe0] outline-none transition-all placeholder:text-gray-300 dark:placeholder:text-white/10 resize-none"
                                        />
                                    </div>

                                    <div className="flex gap-4">
                                        <button 
                                            type="button"
                                            onClick={() => setStep(1)}
                                            className="w-1/3 py-5 rounded-2xl border border-gray-100 dark:border-white/10 text-[11px] font-black uppercase tracking-widest text-gray-400 dark:text-white/40 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
                                        >
                                            Back
                                        </button>
                                        <button 
                                            type="submit"
                                            disabled={!isStep2Valid || isLoading}
                                            className="w-2/3 bg-[#717fe0] text-white py-5 rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] hover:bg-[#5b6bc0] transition-all shadow-xl shadow-[#717fe0]/30 flex items-center justify-center gap-3 group disabled:opacity-50"
                                        >
                                            {isLoading ? "Processing..." : "Launch Empire"} 
                                            {!isLoading && <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SellerRegister;
