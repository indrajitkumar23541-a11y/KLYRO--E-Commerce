import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, X, ChevronDown, MessageSquare } from 'lucide-react';
import API from '../api/axios';

const ConciergeChat = () => {
    const [messages, setMessages] = useState([
        { role: 'bot', content: 'Greetings. I am the KLYRO Concierge. I have been briefed on your acquisitions. How may I assist you with your logistics or collection today?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, loading]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const { data } = await API.post('/support/chat', { message: input });
            setMessages(prev => [...prev, { role: 'bot', content: data.response }]);
        } catch (err) {
            setMessages(prev => [...prev, { role: 'bot', content: "I apologize, but my connection to the global concierge network has been briefly interrupted. Please try again." }]);
        } finally {
            setLoading(false);
        }
    };

    if (!isExpanded) {
        return (
            <div className="w-full bg-white border border-gray-100 p-12 rounded-lg flex flex-col md:flex-row gap-12 justify-between items-center transition-all hover:shadow-xl hover:shadow-[#BC612C]/5 group cursor-pointer" onClick={() => setIsExpanded(true)}>
                <div className="space-y-4 text-center md:text-left">
                    <div className="flex items-center gap-3 justify-center md:justify-start">
                        <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center text-white">
                            <Bot size={16} strokeWidth={1.5} />
                        </div>
                        <h4 className="text-xl font-light text-gray-800">Speak with our <span className="font-semibold">AI Concierge</span></h4>
                    </div>
                    <p className="text-[11px] font-medium text-gray-300 uppercase tracking-[0.2em] transition-colors group-hover:text-[#BC612C]">Real-time intelligence on your acquisitions, logistics, and styling</p>
                </div>
                <button className="px-12 py-5 bg-gray-900 text-white text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-[#BC612C] transition-all flex items-center gap-3 shadow-lg shadow-black/10">Initialize Intelligence <Sparkles size={14} /></button>
            </div>
        );
    }

    return (
        <div className="w-full bg-white border border-gray-900/5 rounded-2xl overflow-hidden shadow-2xl transition-all animate-reveal h-[600px] flex flex-col flex-grow">
            {/* HEADER */}
            <div className="bg-gray-900 p-8 flex justify-between items-center text-white">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                        <Bot size={20} strokeWidth={1} />
                    </div>
                    <div className="space-y-0.5">
                        <h3 className="text-xs font-bold uppercase tracking-[0.3em]">AI Concierge</h3>
                        <p className="text-[9px] font-medium text-white/40 uppercase tracking-widest">Active Intelligence Node</p>
                    </div>
                </div>
                <button onClick={() => setIsExpanded(false)} className="hover:bg-white/10 p-2 rounded-full transition-colors text-white/40 hover:text-white">
                    <X size={20} />
                </button>
            </div>

            {/* MESSAGES */}
            <div ref={scrollRef} className="flex-grow overflow-y-auto p-10 space-y-8 no-scrollbar bg-[#fcfcfc]">
                {messages.map((msg, i) => (
                    <div key={i} className={`flex gap-6 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border ${msg.role === 'user' ? 'bg-white border-gray-100 text-gray-400' : 'bg-gray-900 border-gray-900 text-white'}`}>
                            {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                        </div>
                        <div className={`max-w-[70%] p-6 ${msg.role === 'user' ? 'bg-white border border-gray-100 rounded-2xl rounded-tr-none shadow-sm' : 'bg-white border border-gray-100 rounded-2xl rounded-tl-none shadow-sm'} space-y-2`}>
                            <p className="text-[11px] font-medium text-gray-400 uppercase tracking-widest">{msg.role === 'user' ? 'Member' : 'KLYRO Concierge'}</p>
                            <p className="text-sm font-medium text-gray-800 leading-relaxed">{msg.content}</p>
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex gap-6">
                        <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center text-white border border-gray-900">
                            <Bot size={14} />
                        </div>
                        <div className="bg-white border border-gray-100 p-6 rounded-2xl rounded-tl-none flex gap-2">
                            <div className="w-1.5 h-1.5 bg-[#BC612C] rounded-full animate-bounce"></div>
                            <div className="w-1.5 h-1.5 bg-[#BC612C] rounded-full animate-bounce [animation-delay:0.2s]"></div>
                            <div className="w-1.5 h-1.5 bg-[#BC612C] rounded-full animate-bounce [animation-delay:0.4s]"></div>
                        </div>
                    </div>
                )}
            </div>

            {/* INPUT */}
            <form onSubmit={handleSend} className="p-8 bg-white border-t border-gray-50 flex gap-4">
                <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter your inquiry..."
                    className="flex-grow bg-transparent border-b border-gray-100 py-2 text-sm font-medium focus:border-gray-900 outline-none transition-all placeholder:text-gray-200"
                />
                <button type="submit" disabled={loading} className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center text-white hover:bg-[#BC612C] transition-all shadow-xl shadow-black/10 disabled:opacity-50">
                    <Send size={18} />
                </button>
            </form>
        </div>
    );
};

export default ConciergeChat;
