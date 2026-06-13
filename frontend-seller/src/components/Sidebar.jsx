import React, { useState, useEffect } from 'react';
import { Filter, ChevronDown, ChevronRight, IndianRupee } from 'lucide-react';

const Sidebar = ({ categories, activeCategoryId, onCategoryChange, onPriceFilter, initialMin, initialMax }) => {
    const [min, setMin] = useState(initialMin || '');
    const [max, setMax] = useState(initialMax || '');
    const [expandedParents, setExpandedParents] = useState({});

    useEffect(() => {
        setMin(initialMin);
        setMax(initialMax);
    }, [initialMin, initialMax]);

    const mainCategories = categories.filter(c => !c.parent_id);
    const getSubcategories = (parentId) => categories.filter(c => c.parent_id === parentId);

    const toggleExpand = (id) => {
        setExpandedParents(prev => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <aside className="w-full flex flex-col gap-8 shrink-0 pb-10 lg:pb-0">
            {/* Filter Group: Categories */}
            <div className="space-y-8">
                <div className="flex items-center gap-3 border-b border-[#f2f2f2] pb-4">
                    <Filter className="w-5 h-5 text-accent" />
                    <h3 className="font-black text-lg uppercase tracking-tight text-[#333]">Refine By</h3>
                </div>

                <div className="space-y-6">
                    <p className="text-[10px] font-black text-[#ccc] uppercase tracking-[0.3em] pl-1">Categories</p>
                    <div className="space-y-4">
                        <button 
                            onClick={() => onCategoryChange('all')}
                            className={`flex items-center gap-3 w-full text-left transition-all ${activeCategoryId === 'all' ? 'text-accent font-bold scale-105' : 'text-[#888] hover:text-[#333]'}`}
                        >
                            <div className={`w-2 h-2 rounded-full ${activeCategoryId === 'all' ? 'bg-accent shadow-[0_0_10px_rgba(113,127,224,0.5)]' : 'bg-[#e6e6e6]'}`}></div>
                            <span className="text-[13px] uppercase tracking-wider">All Products</span>
                        </button>

                        {mainCategories.map((cat) => {
                            const subs = getSubcategories(cat.id);
                            const isExpanded = expandedParents[cat.id] || activeCategoryId == cat.id || subs.some(s => s.id == activeCategoryId);
                            const isActive = activeCategoryId == cat.id;

                            return (
                                <div key={cat.id} className="space-y-3">
                                    <div className="flex items-center justify-between group">
                                        <button 
                                            onClick={() => onCategoryChange(cat.id)}
                                            className={`flex items-center gap-3 flex-grow text-left transition-all ${isActive ? 'text-accent font-bold scale-105' : 'text-[#888] hover:text-[#333]'}`}
                                        >
                                            <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-accent shadow-[0_0_10px_rgba(113,127,224,0.5)]' : 'bg-[#e6e6e6]'}`}></div>
                                            <span className="text-[13px] uppercase tracking-wider">{cat.name}</span>
                                        </button>
                                        {subs.length > 0 && (
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); toggleExpand(cat.id); }}
                                                className="p-1 hover:text-accent transition-colors"
                                            >
                                                <ChevronDown size={14} className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                                            </button>
                                        )}
                                    </div>

                                    {subs.length > 0 && isExpanded && (
                                        <div className="pl-6 space-y-3 border-l border-[#f2f2f2] ml-1 animate-fade-in">
                                            {subs.map(sub => (
                                                <button 
                                                    key={sub.id}
                                                    onClick={() => onCategoryChange(sub.id)}
                                                    className={`block w-full text-left text-[12px] transition-all ${activeCategoryId == sub.id ? 'text-accent font-bold' : 'text-[#aaa] hover:text-[#333]'}`}
                                                >
                                                    {sub.name}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="h-px bg-[#f2f2f2]"></div>

                {/* Filter Group: Price Range */}
                <div className="space-y-6">
                    <p className="text-[10px] font-black text-[#ccc] uppercase tracking-[0.3em] pl-1">Price Range (₹)</p>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="relative w-full">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#ccc] text-[10px]">₹</span>
                                <input 
                                    type="number" 
                                    placeholder="Min" 
                                    value={min}
                                    onChange={(e) => setMin(e.target.value)}
                                    className="w-full bg-[#f9f9f9] border border-[#eee] pl-7 pr-3 py-3 rounded-sm text-xs outline-none focus:border-accent transition-colors" 
                                />
                            </div>
                            <span className="text-[#ccc]">-</span>
                            <div className="relative w-full">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#ccc] text-[10px]">₹</span>
                                <input 
                                    type="number" 
                                    placeholder="Max" 
                                    value={max}
                                    onChange={(e) => setMax(e.target.value)}
                                    className="w-full bg-[#f9f9f9] border border-[#eee] pl-7 pr-3 py-3 rounded-sm text-xs outline-none focus:border-accent transition-colors" 
                                />
                            </div>
                        </div>
                        <button 
                            onClick={() => onPriceFilter(min, max)}
                            className="w-full bg-[#333] text-white py-3 rounded-full text-[10px] font-black transition-all uppercase tracking-[0.2em] hover:bg-accent shadow-md hover:shadow-accent/20"
                        >
                            Apply Filter
                        </button>
                    </div>
                </div>

                <div className="h-px bg-[#f2f2f2]"></div>

                {/* Promotions */}
                <div className="bg-[#717fe0]/5 p-8 rounded-sm space-y-4 border border-dashed border-accent/20">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#888]">Member Exclusive</p>
                    <h4 className="text-lg font-black uppercase text-[#333] leading-tight italic">Free Delivery<br />on all orders</h4>
                    <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-[10px] font-black uppercase tracking-widest text-accent border-b-2 border-accent pb-1 hover:text-[#333] hover:border-[#333] transition-all">Join Club Klyro</button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
