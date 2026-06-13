import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import API from '../api/axios';

const ProductExpert = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'ai', text: "Hello! I'm KLYRO's Product Expert. Ask me about any product or category!" }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const chatEndRef = useRef(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMsg = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setLoading(true);

        try {
            const { data } = await API.post('/ai/chat', { message: userMsg });
            setMessages(prev => [...prev, {
                role: 'ai',
                text: data.response,
                products: data.products || []
            }]);
        } catch {
            setMessages(prev => [...prev, { role: 'ai', text: 'Connection lost. Please try again.' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-24 right-6 z-[200] w-14 h-14 bg-[#717fe0] rounded-full flex items-center justify-center shadow-lg shadow-[#717fe0]/30 hover:scale-110 transition-transform"
            >
                {isOpen ? <X size={22} className="text-white" /> : <MessageCircle size={22} className="text-white" />}
            </button>

            {/* Chat Panel */}
            {isOpen && (
                <div className="fixed bottom-44 right-6 z-[200] w-[380px] max-h-[520px] bg-[#111114] border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl">
                    {/* Header */}
                    <div className="p-5 border-b border-white/5 flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#717fe0] rounded-full flex items-center justify-center">
                            <Sparkles size={16} className="text-white" />
                        </div>
                        <div>
                            <p className="text-xs font-black text-white uppercase tracking-widest">Product Expert</p>
                            <p className="text-[9px] font-bold text-green-400 uppercase tracking-widest">Online</p>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-5 space-y-4 max-h-[320px]">
                        {messages.map((msg, i) => (
                            <div key={i}>
                                <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                                    msg.role === 'ai'
                                        ? 'bg-white/5 text-white/80 rounded-bl-sm'
                                        : 'bg-[#717fe0] text-white ml-auto rounded-br-sm'
                                }`}>
                                    {msg.text}
                                </div>
                                {msg.products?.length > 0 && (
                                    <div className="mt-3 space-y-2">
                                        {msg.products.slice(0, 2).map(p => (
                                            <Link to={`/product/${p.id}`} key={p.id} onClick={() => setIsOpen(false)}
                                                className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5 hover:border-[#717fe0]/30 transition-all">
                                                <img src={p.image} alt="" className="w-10 h-10 rounded-lg object-cover bg-white" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-[11px] font-bold text-white truncate">{p.name}</p>
                                                    <p className="text-[10px] font-black text-[#717fe0]">₹{parseFloat(p.price).toLocaleString()}</p>
                                                </div>
                                                <ChevronRight size={14} className="text-white/20" />
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                        {loading && (
                            <div className="flex gap-1.5 px-4 py-3 bg-white/5 rounded-2xl w-fit">
                                <span className="w-2 h-2 bg-[#717fe0] rounded-full animate-bounce" style={{animationDelay:'0ms'}}></span>
                                <span className="w-2 h-2 bg-[#717fe0] rounded-full animate-bounce" style={{animationDelay:'150ms'}}></span>
                                <span className="w-2 h-2 bg-[#717fe0] rounded-full animate-bounce" style={{animationDelay:'300ms'}}></span>
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    {/* Input */}
                    <form onSubmit={sendMessage} className="p-4 border-t border-white/5 flex gap-3">
                        <input
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            placeholder="Ask about any product..."
                            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-[#717fe0]/50 placeholder:text-white/20"
                        />
                        <button type="submit" className="w-10 h-10 bg-[#717fe0] rounded-xl flex items-center justify-center hover:bg-[#5b6bc0] transition-colors">
                            <Send size={16} className="text-white" />
                        </button>
                    </form>
                </div>
            )}
        </>
    );
};

export default ProductExpert;
