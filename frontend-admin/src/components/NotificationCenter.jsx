import React, { useState, useEffect } from 'react';
import { Bell, X, CheckCircle2, Info, Package, AlertCircle, ShoppingBag, Clock } from 'lucide-react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const NotificationCenter = ({ isOpen, onClose }) => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        if (isOpen && user) {
            fetchNotifications();
        }
    }, [isOpen, user]);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const response = await API.get('/notifications');
            if (response.data.success) {
                setNotifications(response.data.notifications);
            }
        } catch (error) {
            console.error('Fetch notifications error:', error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id) => {
        try {
            await API.put(`/notifications/${id}/read`);
            setNotifications(prev => 
                prev.map(n => n.id === id ? { ...n, status: 'read' } : n)
            );
        } catch (error) {
            console.error('Mark as read error:', error);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'order': return <Package className="text-blue-500" size={18} />;
            case 'success': return <CheckCircle2 className="text-emerald-500" size={18} />;
            case 'alert': return <AlertCircle className="text-rose-500" size={18} />;
            default: return <Info className="text-slate-400" size={18} />;
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex justify-end">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"
                onClick={onClose}
            />
            
            {/* Sidebar */}
            <div className="relative w-full max-w-[400px] h-full bg-white/80 backdrop-blur-xl shadow-2xl border-l border-white/20 flex flex-col animate-slide-left">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center text-white">
                            <Bell size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-slate-900 tracking-tight">Intelligence</h2>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Real-time alerts</p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-64 gap-4">
                            <div className="w-6 h-6 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Syncing Feed...</span>
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
                            <div className="w-16 h-16 rounded-3xl bg-slate-50 flex items-center justify-center text-slate-200">
                                <Bell size={32} strokeWidth={1} />
                            </div>
                            <div className="space-y-1">
                                <p className="font-black text-slate-800 text-sm uppercase">Clear Skies</p>
                                <p className="text-xs text-slate-400 font-medium">No new notifications for you right now.</p>
                            </div>
                        </div>
                    ) : (
                        notifications.map((n) => (
                            <div 
                                key={n.id}
                                onClick={() => n.status === 'unread' && markAsRead(n.id)}
                                className={`p-5 rounded-3xl transition-all cursor-pointer border group relative ${n.status === 'unread' ? 'bg-white border-blue-100 shadow-lg shadow-blue-500/5' : 'bg-slate-50/50 border-transparent opacity-60'}`}
                            >
                                <div className="flex gap-4">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${n.status === 'unread' ? 'bg-blue-50 shadow-sm' : 'bg-slate-100'}`}>
                                        {getIcon(n.type)}
                                    </div>
                                    <div className="space-y-1 pr-4">
                                        <div className="flex justify-between items-start gap-2">
                                            <h4 className="font-bold text-slate-900 text-sm leading-tight">{n.title}</h4>
                                            <span className="text-[9px] font-black text-slate-300 uppercase whitespace-nowrap mt-0.5">
                                                {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-500 leading-relaxed font-medium">
                                            {n.message}
                                        </p>
                                    </div>
                                </div>
                                {n.status === 'unread' && (
                                    <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                                )}
                            </div>
                        ))
                    )}
                </div>

                <div className="p-6 bg-slate-50/50 border-t border-slate-100">
                    <div className="flex items-center gap-4 p-4 bg-slate-900 rounded-2xl text-white">
                        <Zap size={20} className="text-amber-400" />
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">KLYRO Concierge</p>
                            <p className="text-xs font-bold">Your orders are being tracked in real-time.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotificationCenter;
