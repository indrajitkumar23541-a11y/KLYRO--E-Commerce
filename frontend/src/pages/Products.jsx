import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../api/axios';
import ProductCard from '../components/ProductCard';
import Sidebar from '../components/Sidebar';
import { SlidersHorizontal, LayoutGrid, List, Search, X, ChevronRight } from 'lucide-react';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();
    
    // Pagination & Filter States
    const searchQuery = searchParams.get('search') || '';
    const categoryId = searchParams.get('category_id') || 'all';
    const currentPage = parseInt(searchParams.get('page')) || 1;
    const [totalPages, setTotalPages] = useState(1);
    const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
    const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    // Fetch Categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await API.get('/categories');
                setCategories(response.data.categories || []);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, []);

    // Fetch Products with Pagination & Filters
    const fetchAll = useCallback(async () => {
        setLoading(true);
        try {
            const params = {
                page: currentPage,
                limit: 12 // Adjusted for 3 or 4 col grid
            };
            if (searchQuery) params.search = searchQuery;
            if (categoryId && categoryId !== 'all') params.category_id = categoryId;
            if (minPrice) params.minPrice = minPrice;
            if (maxPrice) params.maxPrice = maxPrice;
            
            const response = await API.get('/products', { params });
            setProducts(response.data.products || []);
            setTotalPages(response.data.totalPages || 1);
            
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            console.error('Error fetching products:', error);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    }, [searchQuery, categoryId, currentPage, minPrice, maxPrice]);

    useEffect(() => {
        fetchAll();
    }, [fetchAll]);

    const handleCategoryChange = (id) => {
        const newParams = new URLSearchParams(searchParams);
        if (id === 'all') newParams.delete('category_id');
        else newParams.set('category_id', id);
        newParams.set('page', '1');
        setSearchParams(newParams);
        setShowMobileFilters(false);
    };

    const handlePriceFilter = (min, max) => {
        const newParams = new URLSearchParams(searchParams);
        if (min) newParams.set('minPrice', min); else newParams.delete('minPrice');
        if (max) newParams.set('maxPrice', max); else newParams.delete('maxPrice');
        newParams.set('page', '1');
        setSearchParams(newParams);
        setMinPrice(min);
        setMaxPrice(max);
        setShowMobileFilters(false);
    };

    const handlePageChange = (page) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('page', page);
        setSearchParams(newParams);
    };

    const currentCategory = categories.find(c => c.id == categoryId);

    return (
        <div className="bg-white min-h-screen pt-32 pb-24">
            <div className="max-w-7xl mx-auto px-6">
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8 border-b border-[#e6e6e6] pb-12">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#888]">
                            <span className="hover:text-accent cursor-pointer" onClick={() => handleCategoryChange('all')}>Shop</span>
                            {currentCategory && (
                                <>
                                    <ChevronRight size={10} />
                                    <span className="text-accent">{currentCategory.name}</span>
                                </>
                            )}
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black uppercase text-[#333] tracking-tight leading-none">
                            {searchQuery ? `"${searchQuery}"` : currentCategory ? currentCategory.name : 'Our Collection'}
                        </h1>
                        <p className="text-[#888] text-sm max-w-xl">
                            Explore our meticulously curated selection of premium {currentCategory ? currentCategory.name.toLowerCase() : 'lifestyle'} essentials, designed for the modern connoisseur.
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                    <div className="hidden lg:flex items-center gap-6">
                             <div className="flex items-center gap-4 text-[#888] text-sm font-medium">
                                <button className="text-[#333]"><LayoutGrid size={20} /></button>
                                <button className="hover:text-[#333] transition-colors"><List size={20} /></button>
                             </div>
                             <div className="h-8 w-[1px] bg-[#e6e6e6]"></div>
                             <p className="text-[11px] font-bold text-[#888] uppercase tracking-widest">
                                 {products.length} Products Found
                             </p>
                         </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Product Grid - Full Width */}
                    <div className="flex-grow">
                        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 transition-opacity duration-500 ${loading ? 'opacity-30' : 'opacity-100'}`}>
                            {products.length > 0 ? (
                                products.map(p => <ProductCard key={p.id} product={p} />)
                            ) : (
                                <div className="col-span-full py-40 text-center border-2 border-dashed border-[#e6e6e6] rounded-xl bg-[#f9f9f9]">
                                    <h3 className="text-2xl font-black text-[#ccc] uppercase tracking-widest mb-4">
                                        No products available.
                                    </h3>
                                    <button 
                                        onClick={() => handleCategoryChange('all')}
                                        className="text-accent text-sm font-bold uppercase hover:underline"
                                    >
                                        Clear all filters
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Professional Pagination UI */}
                        {totalPages > 1 && (
                            <div className="mt-20 pt-12 border-t border-[#f2f2f2] flex flex-col items-center gap-8">
                                <div className="flex items-center gap-2">
                                    <button 
                                        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                                        disabled={currentPage === 1}
                                        className={`w-12 h-12 flex items-center justify-center rounded-full border border-[#e6e6e6] transition-all ${currentPage === 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-accent hover:text-white hover:border-accent shadow-sm'}`}
                                    >
                                        <ChevronRight size={18} className="rotate-180" />
                                    </button>
                                    
                                    <div className="flex items-center gap-2 px-4">
                                        {[...Array(totalPages)].map((_, i) => {
                                            const pageNum = i + 1;
                                            // Simple logic for brevity, can be expanded for many pages
                                            if (totalPages > 7 && Math.abs(pageNum - currentPage) > 2 && pageNum !== 1 && pageNum !== totalPages) {
                                                if (pageNum === 2 || pageNum === totalPages - 1) return <span key={pageNum} className="text-[#ccc]">...</span>;
                                                return null;
                                            }

                                            return (
                                                <button 
                                                    key={pageNum} 
                                                    onClick={() => handlePageChange(pageNum)}
                                                    className={`w-12 h-12 rounded-full font-bold text-[13px] transition-all duration-300 ${currentPage === pageNum ? 'bg-accent text-white shadow-xl scale-110' : 'text-[#888] hover:bg-[#f2f2f2]'}`}
                                                >
                                                    {pageNum}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    <button 
                                        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                                        disabled={currentPage === totalPages}
                                        className={`w-12 h-12 flex items-center justify-center rounded-full border border-[#e6e6e6] transition-all ${currentPage === totalPages ? 'opacity-30 cursor-not-allowed' : 'hover:bg-accent hover:text-white hover:border-accent shadow-sm'}`}
                                    >
                                        <ChevronRight size={18} />
                                    </button>
                                </div>
                                <p className="text-[10px] font-bold text-[#ccc] uppercase tracking-[0.3em]">
                                    Showing Page {currentPage} of {totalPages}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Products;
