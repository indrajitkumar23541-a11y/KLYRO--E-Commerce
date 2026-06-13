import React, { useState, useEffect } from 'react';
import { BarChart, TrendingUp, Users, Activity, ShoppingCart, Tag, Package } from 'lucide-react';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const Analytics = () => {
    const { token } = useAuth();
    const [metrics, setMetrics] = useState({
        avgOrderValue: 0,
        totalCategories: 0,
        completedOrders: 0,
        totalProducts: 0
    });

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const resStats = await API.get('/admin/stats', config);
                const resCats = await API.get('/categories');
                const resOrders = await API.get('/orders', config);

                const stats = resStats.data.success ? resStats.data.stats : {};
                const cats = resCats.data.success ? resCats.data.categories.length : 0;
                
                let completed = 0;
                let revenue = 0;
                let orders = 0;
                if (resOrders.data.success) {
                    const allOrders = resOrders.data.orders;
                    orders = allOrders.length;
                    allOrders.forEach(o => {
                        if(o.status === 'delivered' || o.status === 'completed') {
                            completed++;
                        }
                        if(o.status !== 'cancelled') {
                           revenue += parseFloat(o.total_price);
                        }
                    });
                }
                
                const avgVal = orders > 0 ? (revenue / orders) : 0;

                setMetrics({
                    avgOrderValue: avgVal,
                    totalCategories: cats,
                    completedOrders: completed,
                    totalProducts: stats.totalProducts || 0
                });

            } catch (error) {
                console.error("Failed to fetch analytics", error);
            }
        };
        fetchMetrics();
    }, [token]);

    const displayMetrics = [
        {label: "Average Order Value", val: `₹${metrics.avgOrderValue.toFixed(2)}`, icon: <TrendingUp/>},
        {label: "Registered Categories", val: metrics.totalCategories.toLocaleString(), icon: <Tag/>},
        {label: "Completed Deliveries", val: metrics.completedOrders.toLocaleString(), icon: <Activity/>},
        {label: "Product Catalog Size", val: metrics.totalProducts.toLocaleString(), icon: <Package/>}
    ];

    return (
        <div className="space-y-6 animate-reveal">
            <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-normal text-[#383a48] mb-1">Analytics Overview</h1>
                <p className="text-[#84879b] text-xs md:text-sm">Deep dive into platform conversion funnels and user acquisition.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {displayMetrics.map((item, i) => (
                    <div key={i} className="bg-white rounded-[20px] shadow-sm border border-slate-100/60 p-4 md:p-5 flex items-center justify-between">
                        <div>
                            <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5 md:mb-1">{item.label}</p>
                            <h2 className="text-xl md:text-2xl font-black text-[#383a48]">{item.val}</h2>
                        </div>
                        <div className="text-[#829ebd]/50 scale-75 md:scale-100">{item.icon}</div>
                    </div>
                ))}
            </div>

            {/* Chart for Analytics */}
            <div className="bg-white rounded-[20px] shadow-sm border border-slate-100/60 p-6 md:p-8 h-[300px] md:h-[400px] flex flex-col relative overflow-hidden">
                <h3 className="text-base md:text-lg font-bold text-[#383a48] mb-4 md:mb-6">Traffic Matrix (YTD)</h3>
                <div className="flex-1 w-full bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] relative">
                    <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                        {/* Organic */}
                        <path d="M0,90 Q10,80 20,95 T40,70 T60,85 T80,50 T100,55 L100,100 L0,100 Z" fill="rgba(123, 169, 135, 0.2)" />
                        <path d="M0,90 Q10,80 20,95 T40,70 T60,85 T80,50 T100,55" fill="none" stroke="#7ba987" strokeWidth="2" />
                        
                        {/* Paid */}
                        <path d="M0,60 Q15,40 25,60 T45,30 T65,55 T85,10 T100,20" fill="none" stroke="#5b7296" strokeWidth="2" />
                        
                        {/* Direct */}
                        <path d="M0,70 Q10,75 30,55 T50,60 T70,40 T90,30 T100,45" fill="none" stroke="#e5a975" strokeWidth="2" />
                    </svg>
                    <div className="absolute top-0 right-0 md:right-4 flex flex-row md:flex-col gap-3 md:gap-2 font-black md:font-bold text-[9px] md:text-xs text-slate-500 bg-white/50 md:bg-transparent p-1 md:p-0 rounded">
                        <div className="flex items-center gap-1.5 md:gap-2"><div className="w-2 h-2 md:w-3 md:h-3 bg-[#7ba987] rounded-full"></div> Organic</div>
                        <div className="flex items-center gap-1.5 md:gap-2"><div className="w-2 h-2 md:w-3 md:h-3 bg-[#5b7296] rounded-full"></div> Paid</div>
                        <div className="flex items-center gap-1.5 md:gap-2"><div className="w-2 h-2 md:w-3 md:h-3 bg-[#e5a975] rounded-full"></div> Direct</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
