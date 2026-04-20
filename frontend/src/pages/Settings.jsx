import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Settings, Moon, Sun, Bell, Shield, Globe, HelpCircle, ChevronRight, Share2 } from 'lucide-react';

const SettingsPage = () => {
    const { isDarkMode, toggleTheme } = useTheme();

    const sections = [
        {
            title: "Appearance",
            items: [
                { 
                    label: "Dark Mode", 
                    desc: "Toggle between high-fidelity themes", 
                    icon: isDarkMode ? <Moon size={20} /> : <Sun size={20} />,
                    action: <button onClick={toggleTheme} className={`w-12 h-6 rounded-full relative p-1 transition-all duration-500 ${isDarkMode ? 'bg-[#717fe0]' : 'bg-gray-300'}`}>
                        <div className={`w-4 h-4 bg-white rounded-full shadow-md transition-all duration-500 ${isDarkMode ? 'translate-x-6' : 'translate-x-0'}`}></div>
                    </button>
                }
            ]
        },
        {
            title: "Security & Privacy",
            items: [
                { label: "Notification Settings", desc: "Manage your push alerts", icon: <Bell size={20} /> },
                { label: "Two-Factor Auth", desc: "Extra layer of security", icon: <Shield size={20} /> },
                { label: "Language", desc: "Select preferred language", icon: <Globe size={20} />, extra: "English" }
            ]
        },
        {
            title: "Support",
            items: [
                { label: "Help Center", desc: "Find answers and guides", icon: <HelpCircle size={20} /> },
                { label: "Share App", desc: "Invite friends to KLYRO", icon: <Share2 size={20} /> }
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0b] pt-24 pb-32 transition-colors duration-500">
            <div className="max-w-[1200px] mx-auto px-4 md:px-8">
                
                {/* Header */}
                <div className="mb-12 space-y-2">
                    <div className="flex items-center gap-3 text-[#717fe0]">
                        <Settings className="animate-spin-slow" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em]">System Config</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-gray-800 dark:text-white uppercase tracking-tighter">App Settings</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {sections.map((section, sidx) => (
                        <div key={sidx} className="space-y-6">
                            <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-400 dark:text-white/20 pl-4">{section.title}</h3>
                            <div className="bg-white dark:bg-white/5 rounded-[2rem] border border-gray-100 dark:border-white/5 overflow-hidden shadow-xl shadow-gray-200/50 dark:shadow-none">
                                {section.items.map((item, iidx) => (
                                    <div 
                                        key={iidx}
                                        className={`flex items-center justify-between p-6 hover:bg-gray-50 dark:hover:bg-white/5 transition-all cursor-pointer ${iidx !== section.items.length - 1 ? 'border-b border-gray-100 dark:border-white/5' : ''}`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-gray-100 dark:bg-white/10 rounded-xl flex items-center justify-center text-gray-600 dark:text-white/60">
                                                {item.icon}
                                            </div>
                                            <div>
                                                <p className="text-[15px] font-bold text-gray-800 dark:text-white">{item.label}</p>
                                                <p className="text-[12px] text-gray-500 dark:text-white/30 font-medium">{item.desc}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            {item.extra && <span className="text-xs font-black text-[#717fe0] uppercase">{item.extra}</span>}
                                            {item.action || <ChevronRight size={18} className="text-gray-300 dark:text-white/10" />}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center space-y-4">
                    <p className="text-[10px] font-bold text-gray-400 dark:text-white/10 uppercase tracking-[0.5em]">KLYRO PLATFORM v4.2.0 • BUILT FOR EXCELLENCE</p>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
