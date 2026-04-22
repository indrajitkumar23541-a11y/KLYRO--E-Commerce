import React, { useState } from 'react';
import { Sparkles, MessageSquare, ShieldCheck, ChevronRight, Zap, Info } from 'lucide-react';
import API from '../api/axios';

const ProductExpertAI = ({ product }) => {
    const [query, setQuery] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    const handleAskExpert = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        try {
            const { data } = await API.post('/support/expert', { 
                productId: product.id, 
                query 
            });
            setResponse(data.response);
            setIsExpanded(true);
        } catch (err) {
            setResponse("I am currently analyzing the structural integrity and aesthetic value of this consignment. Please try again in a moment.");
        } finally {
            setLoading(false);
        }
    };

    const suggestedQueries = [
        "What's the material quality?",
        "How should I style this?",
        "Is this suitable for formal events?"
    ];

    return (
        <div className="mt-12 space-y-6">
            <div className="bg-gray-50 border border-gray-100 p-8 rounded-sm space-y-8 transition-all hover:bg-white hover:shadow-2xl hover:shadow-black/5 group">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#BC612C] rounded-full flex items-center justify-center text-white shadow-lg shadow-[#BC612C]/20 group-hover:scale-110 transition-transform">
                            <Sparkles size={14} />
                        </div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-800">KLYRO Intelligence Suite</h4>
                    </div>
                    <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest px-3 py-1 border border-gray-100 rounded-full">AI Expert Analysis</span>
                </div>

                <div className="space-y-4">
                    <p className="text-xl font-light text-gray-800 tracking-tight leading-relaxed">
                        Request a <span className="font-semibold italic">boutique inspection</span> of this consignment's aesthetic and technical details.
                    </p>
                    
                    <form onSubmit={handleAskExpert} className="relative mt-10">
                        <input 
                            type="text" 
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Ask the Expert... (e.g. material, styling)"
                            className="w-full bg-transparent border-b border-gray-200 py-4 pr-12 text-sm font-medium focus:border-gray-900 outline-none transition-all placeholder:text-gray-300"
                        />
                        <button 
                            type="submit"
                            disabled={loading}
                            className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-gray-300 hover:text-gray-900 transition-colors disabled:opacity-50"
                        >
                            <Zap size={20} className={loading ? 'animate-pulse text-[#BC612C]' : ''} />
                        </button>
                    </form>

                    <div className="flex flex-wrap gap-4 mt-6">
                        {suggestedQueries.map((q, i) => (
                            <button 
                                key={i}
                                onClick={() => { setQuery(q); }}
                                className="text-[9px] font-bold uppercase tracking-widest text-gray-400 hover:text-[#BC612C] hover:border-[#BC612C]/30 border border-transparent transition-all"
                            >
                                {q}
                            </button>
                        ))}
                    </div>
                </div>

                {isExpanded && (
                    <div className="pt-10 border-t border-gray-50 space-y-6 animate-reveal">
                        <div className="flex items-start gap-4">
                            <div className="w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center text-white flex-shrink-0 mt-1">
                                <Sparkles size={10} />
                            </div>
                            <div className="space-y-4">
                                <p className="text-[10px] font-black uppercase tracking-widest text-[#BC612C]">Expert Verdict</p>
                                <p className="text-[13px] font-medium text-gray-700 leading-relaxed italic">
                                    "{response}"
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 pt-4">
                            <ShieldCheck size={14} className="text-gray-200" />
                            <p className="text-[8px] font-bold text-gray-300 uppercase tracking-widest">Authenticated Boutique Insight</p>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex items-center gap-3 px-2">
                <Info size={14} className="text-gray-200" />
                <p className="text-[9px] font-semibold text-gray-300 uppercase tracking-widest leading-relaxed">
                    AI Analysis is based on curated product metadata and <br /> KLYRO's proprietary luxury aesthetic standards.
                </p>
            </div>
        </div>
    );
};

export default ProductExpertAI;
