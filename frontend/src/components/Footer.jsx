import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook, ArrowUpRight } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-[#1e2d41] pt-16 md:pt-24 pb-12 px-6 md:px-12 border-t border-white/5 text-white">
            <div className="max-w-[1440px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-24">
                
                {/* Brand */}
                <div className="space-y-6">
                    <Link to="/" className="text-2xl font-black tracking-tighter text-white uppercase italic">
                        Klyro<span className="text-[#a5b4fc]">.</span>
                    </Link>
                    <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
                        Elevating your wardrobe with curated luxury pieces. Defining the future of digital fashion commerce.
                    </p>
                    <div className="flex gap-4">
                        <Instagram className="w-5 h-5 text-slate-400 hover:text-white cursor-pointer transition-all duration-300 hover:scale-110" />
                        <Twitter className="w-5 h-5 text-slate-400 hover:text-white cursor-pointer transition-all duration-300 hover:scale-110" />
                        <Facebook className="w-5 h-5 text-slate-400 hover:text-white cursor-pointer transition-all duration-300 hover:scale-110" />
                    </div>
                </div>

                {/* Links 1 */}
                <div className="space-y-6">
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white">Navigation</h4>
                    <ul className="space-y-4 text-sm text-slate-400">
                        <li><Link to="/products" className="hover:text-white transition">Shop All</Link></li>
                        <li><Link to="/products?sort=newest" className="hover:text-white transition">New Arrivals</Link></li>
                        <li><Link to="/products" className="hover:text-white transition">Collections</Link></li>
                        <li><Link to="/products?onSale=true" className="hover:text-white transition">Sales</Link></li>
                    </ul>
                </div>

                {/* Links 2 */}
                <div className="space-y-6">
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white">Support</h4>
                    <ul className="space-y-4 text-sm text-slate-400">
                        <li><Link to="/about" className="hover:text-white transition">Shipping Info</Link></li>
                        <li><Link to="/about" className="hover:text-white transition">Returns Policy</Link></li>
                        <li><Link to="/about" className="hover:text-white transition">Privacy Policy</Link></li>
                        <li><Link to="/contact" className="hover:text-white transition">Contact Us</Link></li>
                    </ul>
                </div>

                {/* Newsletter */}
                <div className="space-y-6">
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white">Newsletter</h4>
                    <p className="text-slate-400 text-xs leading-relaxed">Join our elite list for exclusive collection drops.</p>
                    <div className="relative group max-w-sm">
                        <input 
                            type="email" 
                            placeholder="Email Address" 
                            className="w-full bg-white/5 border-b border-white/20 py-3 text-sm outline-none focus:border-[#a5b4fc] transition-colors duration-500"
                        />
                        <button className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition">
                            <ArrowUpRight size={20} />
                        </button>
                    </div>
                </div>

            </div>

            <div className="max-w-[1440px] mx-auto mt-16 md:mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                <p>&copy; 2026 KLYRO BY INDRA. ALL RIGHTS RESERVED.</p>
                <div className="flex gap-8">
                    <span className="hover:text-white cursor-pointer transition underline decoration-slate-800 underline-offset-4">Terms</span>
                    <span className="hover:text-white cursor-pointer transition underline decoration-slate-800 underline-offset-4">Privacy</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
