import React from 'react';
import { Link } from 'react-router-dom';
import { 
    Car, 
    Sparkles, 
    BookOpen, 
    ShoppingBasket, 
    Home as HomeIcon, 
    Dumbbell, 
    Tv, 
    Shirt, 
    Baby, 
    LayoutGrid 
} from 'lucide-react';

const Categories = () => {
    const categories = [
        { name: 'Electronics', img: '/assets/electronics.webp', id: 1, path: '/electronics' },
        { name: 'Fashion', img: '/assets/fashion.webp', id: 8, path: '/fashion' },
        { name: 'Home & Living', img: '/assets/home_living.webp', id: 16, path: '/home-living' },
        { name: 'Beauty & Health', img: '/assets/beauty_hero_v2.png', id: 21, path: '/beauty-health' },
        { name: 'Sports & Fitness', img: '/assets/sports.webp', id: 34, path: '/sports-fitness' },
        { name: 'Books & Education', img: '/assets/books_hero_v2.png', id: 49, path: '/books-education' },
        { name: 'Automotive', img: '/assets/auto_hero_v2.png', id: 46, path: '/automotive' },
        { name: 'Grocery', img: '/assets/grocery_hero_v2.png', id: 38, path: '/grocery' },
        { name: 'Kids & Baby', img: '/assets/cat_kids.png', id: 42, path: '/kids-baby' },
        { name: 'Others', img: '/assets/others_hero.webp', id: 53, path: '/others' }
    ];

    return (
        <div className="bg-[#0a0a0b] min-h-screen pt-24 pb-32 px-6">
            <div className="mb-10 text-center">
                <h1 className="text-3xl font-black uppercase tracking-[0.2em] text-white italic">Categories</h1>
                <p className="text-[10px] font-bold text-[#717fe0]/50 tracking-[0.3em] uppercase mt-2">Explore the Klyro Universe</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {categories.map((cat) => {
                    return (
                        <Link 
                            key={cat.id} 
                            to={cat.path}
                            className="bg-white/5 border border-white/10 p-4 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 transition-all hover:bg-white/10 active:scale-95 group"
                        >
                            <div className="w-full aspect-square rounded-[2rem] shadow-lg shadow-black/40 overflow-hidden group-hover:scale-105 transition-transform duration-500">
                                <img 
                                    src={cat.img} 
                                    alt={cat.name} 
                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" 
                                />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/70 group-hover:text-white transition-colors text-center px-1">
                                {cat.name}
                            </span>
                        </Link>
                    )
                })}
            </div>

            <div className="mt-12 p-8 bg-gradient-to-br from-[#717fe0]/20 to-transparent border border-white/5 rounded-[3rem] text-center">
                <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4">Can't find what you're looking for?</p>
                <Link to="/products" className="inline-block bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all">
                    View All Products
                </Link>
            </div>
        </div>
    );
};

export default Categories;
