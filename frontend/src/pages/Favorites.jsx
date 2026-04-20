import React from 'react';
import { Heart, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

const Favorites = () => {
    return (
        <div className="bg-[#0a0a0b] min-h-screen pt-24 pb-32 px-6 flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 bg-[#717fe0]/10 rounded-full flex items-center justify-center mb-8 animate-pulse shadow-[0_0_50px_rgba(113,127,224,0.2)]">
                <Heart size={40} className="text-[#717fe0]" />
            </div>
            
            <h1 className="text-3xl font-black uppercase tracking-[0.2em] text-white italic">Your Favorites</h1>
            <p className="text-xs font-bold text-white/40 tracking-[0.3em] uppercase mt-4 max-w-[250px] leading-relaxed">
                Items you heart will appear here for quick access
            </p>

            <div className="mt-12 w-full space-y-4">
                <div className="p-8 border-2 border-dashed border-white/5 rounded-[3rem] opacity-20">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#717fe0]">Wishlist is currently empty</p>
                </div>
                
                <Link 
                    to="/products"
                    className="block w-full bg-[#717fe0] hover:bg-[#5b6bc0] text-white h-16 rounded-[2rem] font-black uppercase text-xs tracking-widest leading-[64px] transition-all shadow-xl shadow-[#717fe0]/20 active:scale-95"
                >
                    Start Curating <ShoppingBag size={18} className="inline ml-2 -mt-1" />
                </Link>
            </div>
        </div>
    );
};

export default Favorites;
