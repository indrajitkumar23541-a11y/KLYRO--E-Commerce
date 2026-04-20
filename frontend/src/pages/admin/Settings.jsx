import React, { useState } from 'react';
import { Save, Loader2 } from 'lucide-react';

const Settings = () => {
    const [config, setConfig] = useState({
        platformName: "KLYRO E-Commerce",
        supportEmail: "support@klyro.com",
        maintenanceMode: false,
        autoApproveSellers: true, // Defaulting true for visual
        enablePayments: true
    });
    
    const [isSaving, setIsSaving] = useState(false);

    const handleToggle = (key) => {
        setConfig({...config, [key]: !config[key]});
    };

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            // mock save API call
        }, 800);
    };

    return (
        <div className="space-y-6 animate-reveal max-w-4xl mx-auto">
            <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-normal text-[#383a48] mb-1">Platform Settings</h1>
                <p className="text-[#84879b] text-xs md:text-sm">Configure global marketplace variables and maintenance parameters.</p>
            </div>

            <div className="bg-white rounded-[20px] shadow-sm border border-slate-100/60 p-5 md:p-8 space-y-6 md:space-y-8">
                {/* General Settings */}
                <div>
                    <h3 className="text-base md:text-lg font-bold text-[#383a48] border-b border-slate-100 pb-2 mb-4">General Configuration</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        <div>
                            <label className="block text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 md:mb-2">Platform Name</label>
                            <input 
                                type="text" 
                                value={config.platformName} 
                                onChange={(e) => setConfig({...config, platformName: e.target.value})}
                                className="w-full border-2 border-slate-100 rounded-lg px-3 md:px-4 py-2 font-bold text-sm md:text-base text-slate-800 focus:border-[#5b7296] outline-none transition-colors bg-slate-50" 
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 md:mb-2">Support Email</label>
                            <input 
                                type="email" 
                                value={config.supportEmail} 
                                onChange={(e) => setConfig({...config, supportEmail: e.target.value})}
                                className="w-full border-2 border-slate-100 rounded-lg px-3 md:px-4 py-2 font-bold text-sm md:text-base text-slate-800 focus:border-[#5b7296] outline-none transition-colors bg-slate-50" 
                            />
                        </div>
                    </div>
                </div>

                {/* Toggles */}
                <div>
                    <h3 className="text-base md:text-lg font-bold text-[#383a48] border-b border-slate-100 pb-2 mb-4">System Parameters</h3>
                    <div className="space-y-4">
                        {[
                            { title: "Maintenance Mode", desc: "Disable frontend access for all non-admin users.", key: "maintenanceMode" },
                            { title: "Auto-approve Sellers", desc: "Skip manual verification for new merchant applications.", key: "autoApproveSellers" },
                            { title: "Enable Stripe/Razorpay", desc: "Allow live payments on checkout.", key: "enablePayments" }
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
                        onClick={handleSave}
                        disabled={isSaving}
                        className={`w-full sm:w-auto bg-[#5b7296] hover:bg-[#485c7d] text-white px-8 py-3 rounded-lg font-bold text-sm tracking-wide transition-colors flex items-center justify-center gap-2 shadow-sm ${isSaving ? 'opacity-80 cursor-wait' : ''}`}
                    >
                        {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} 
                        {isSaving ? 'Saving...' : 'Save Settings'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Settings;
