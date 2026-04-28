import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import API from '../api/axios';
import { Search, Filter, SlidersHorizontal, ChevronRight, LayoutGrid, List } from 'lucide-react';

const SearchPage = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const q = queryParams.get('q') || '';
    
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ total: 0 });
    const [filters, setFilters] = useState({
        minPrice: '',
        maxPrice: '',
        sort: 'popular'
    });

    useEffect(() => {
        const fetchResults = async () => {
            setLoading(true);
            try {
                const response = await API.get('/search', {
                    params: {
                        q,
                        ...filters
                    }
                });
                setProducts(response.data.products || []);
                setStats({ total: response.data.total || 0 });
            } catch (error) {
                console.error('Search fetch error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [q, filters]);

    return (
        <div className="min-h-screen bg-[#0a0a0c] text-white pt-24 pb-20 px-6 md:px-12 lg:px-20 font-serif-premium">
            {/* Header / Stats */}
            <div className="max-w-[1440px] mx-auto mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">
                        Results for <span className="text-[#717fe0]">"{q}"</span>
                    </h1>
                    <p className="text-white/40 text-sm font-bold uppercase tracking-[0.2em]">
                        Showing {products.length} of {stats.total} extraordinary finds
                    </p>
                </div>
                
                {/* Simple Filters */}
                <div className="flex items-center gap-4">
                    <select 
                        value={filters.sort}
                        onChange={(e) => setFilters({...filters, sort: e.target.value})}
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-widest outline-none focus:border-[#717fe0]/50"
                    >
                        <option value="popular">Popularity</option>
                        <option value="price_low">Price: Low to High</option>
                        <option value="price_high">Price: High to Low</option>
                        <option value="rating">Top Rated</option>
                    </select>
                </div>
            </div>

            <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-4 gap-12">
                {/* Sidebar Filters */}
                <div className="lg:col-span-1 space-y-10">
                    <div className="bg-white/5 p-8 rounded-3xl border border-white/10 backdrop-blur-xl">
                        <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
                            <Filter size={16} className="text-[#717fe0]" /> Refine Search
                        </h3>
                        
                        <div className="space-y-8">
                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 block mb-4">Price Range</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <input 
                                        type="number" 
                                        placeholder="Min" 
                                        value={filters.minPrice}
                                        onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                                        className="bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#717fe0]/50"
                                    />
                                    <input 
                                        type="number" 
                                        placeholder="Max" 
                                        value={filters.maxPrice}
                                        onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                                        className="bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#717fe0]/50"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-3">
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                            {[1,2,3,4,6].map(i => (
                                <div key={i} className="h-[450px] bg-white/5 rounded-3xl animate-pulse border border-white/5"></div>
                            ))}
                        </div>
                    ) : products.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                            {products.map((product) => (
                                <Link to={`/product/${product.id}`} key={product.id} className="group flex flex-col h-full bg-white/5 rounded-3xl border border-white/5 overflow-hidden hover:border-[#717fe0]/40 transition-all duration-500 shadow-2xl hover:shadow-[#717fe0]/10">
                                    <div className="relative h-[320px] overflow-hidden">
                                        <img 
                                            src={product.image} 
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                        />
                                        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10">
                                            {product.category_name}
                                        </div>
                                    </div>
                                    <div className="p-8 flex flex-col flex-grow bg-gradient-to-b from-transparent to-black/40">
                                        <h3 className="text-xl font-black leading-tight mb-3 group-hover:text-[#717fe0] transition-colors line-clamp-2">
                                            {product.name}
                                        </h3>
                                        <div className="mt-auto flex items-center justify-between">
                                            <span className="text-2xl font-black text-white/90">₹{parseFloat(product.price).toLocaleString()}</span>
                                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#717fe0] transition-all">
                                                <ChevronRight size={18} />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="h-[400px] flex flex-col items-center justify-center bg-white/5 rounded-3xl border border-dashed border-white/10 p-12 text-center">
                            <Search size={48} className="text-white/10 mb-6" />
                            <h2 className="text-2xl font-black uppercase mb-4">No Matches Found</h2>
                            <p className="text-white/40 max-w-sm mb-8 text-sm leading-relaxed">Our seekers couldn't find any extraordinary items matching your request. Try refining your keywords or filters.</p>
                            <Link to="/products" className="bg-[#717fe0] px-8 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-[#5b6bc0] transition-all">Explore All Collections</Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchPage;
