import React, { useState, useEffect, useRef } from 'react';
import {
    Pencil, Trash2, Plus, X, Search, Filter, Package, Camera,
    Loader2, Image as ImageIcon, Save, ArrowUpRight, Download,
    FileText, AlertCircle, CheckCircle2, ChevronDown, MoreHorizontal,
    LayoutGrid, List, BarChart3, UploadCloud
} from 'lucide-react';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const ProductManagement = () => {
    const { token } = useAuth();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
    const fileInputRef = useRef(null);
    const bulkInputRef = useRef(null);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [currentProduct, setCurrentProduct] = useState({
        id: null,
        name: '',
        price: '',
        discount_price: '',
        stock_quantity: '',
        sku: '',
        category_id: '',
        description: '',
        status: 'active',
        existingImages: []
    });

    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previews, setPreviews] = useState([]);

    useEffect(() => {
        fetchSellerProducts();
        fetchCategories();
    }, []);

    const fetchSellerProducts = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const res = await API.get('/seller/products', config);
            if (res.data.success) {
                setProducts(res.data.products);
            }
        } catch (error) {
            console.error('Failed to fetch seller products', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await API.get('/categories');
            if (res.data.success && Array.isArray(res.data.categories)) {
                const cats = res.data.categories;
                const catMap = {};
                cats.forEach(c => catMap[c.id] = c);

                const formattedCats = cats.map(c => {
                    let path = c.name;
                    let parent = catMap[c.parent_id];
                    let depth = 0;
                    while (parent && depth < 5) {
                        path = `${parent.name} > ${path}`;
                        parent = catMap[parent.parent_id];
                        depth++;
                    }
                    return { ...c, displayName: path };
                }).sort((a, b) => (a.displayName || '').localeCompare(b.displayName || ''));

                setCategories(formattedCats);
            }
        } catch (error) {
            console.error('Failed to fetch categories', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this product from your inventory?')) {
            try {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                await API.delete(`/seller/products/${id}`, config);
                setProducts(products.filter(p => p.id !== id));
            } catch (error) {
                console.error('Failed to delete product', error);
            }
        }
    };

    const openModal = async (mode, product = null) => {
        setModalMode(mode);
        setSelectedFiles([]);
        setPreviews([]);

        if (mode === 'edit' && product) {
            setCurrentProduct({
                ...product,
                price: product.price || '',
                discount_price: product.discount_price || '',
                stock_quantity: product.stock_quantity || '',
                sku: product.sku || '',
                category_id: product.category_id || '',
                description: product.description || '',
                existingImages: product.images?.map(img => img.image_url) || [product.image].filter(Boolean)
            });
        } else {
            setCurrentProduct({
                id: null, name: '', price: '', discount_price: '', stock_quantity: '',
                sku: '', category_id: '', description: '', status: 'active', existingImages: []
            });
        }
        setIsModalOpen(true);
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + selectedFiles.length + currentProduct.existingImages.length > 5) {
            alert('Maximum 5 images allowed.');
            return;
        }
        setSelectedFiles([...selectedFiles, ...files]);
        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => setPreviews(prev => [...prev, reader.result]);
            reader.readAsDataURL(file);
        });
    };

    const handleBulkUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Mock bulk upload logic
            alert(`Broadcasting bulk upload for: ${file.name}\n(In production, this would parse CSV and sync with backend)`);
        }
    };

    const handleSaveProduct = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const formData = new FormData();
            Object.keys(currentProduct).forEach(key => {
                if (key !== 'existingImages' && currentProduct[key] !== null) {
                    formData.append(key, currentProduct[key]);
                }
            });
            currentProduct.existingImages.forEach(img => formData.append('existingImages', img));
            selectedFiles.forEach(file => formData.append('images', file));

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            };

            if (modalMode === 'add') {
                await API.post('/seller/products', formData, config);
            } else {
                await API.put(`/seller/products/${currentProduct.id}`, formData, config);
            }

            fetchSellerProducts();
            setIsModalOpen(false);
        } catch (error) {
            console.error('Failed to save product', error);
        } finally {
            setIsSaving(false);
        }
    };

    const getStockBadge = (count) => {
        if (count === 0) return <span className="px-2 py-0.5 bg-red-50 text-red-600 rounded text-[9px] font-black uppercase ring-1 ring-red-200">Out of Stock</span>;
        if (count < 10) return <span className="px-2 py-0.5 bg-orange-50 text-orange-600 rounded text-[9px] font-black uppercase ring-1 ring-orange-200">Low Stock ({count})</span>;
        return <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded text-[9px] font-black uppercase ring-1 ring-emerald-200">In Stock ({count})</span>;
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-reveal">
            {/* Command Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight">Inventory Command Console</h1>
                    <p className="text-slate-400 text-xs font-bold mt-1 uppercase tracking-widest flex items-center gap-2">
                        <Package size={14} className="text-blue-500" />
                        Managing {products.length} active listings
                    </p>
                </div>
                <div className="flex items-center gap-3 w-full lg:w-auto">
                    <button
                        onClick={() => bulkInputRef.current?.click()}
                        className="flex-1 lg:flex-none border-2 border-slate-100 hover:border-slate-200 text-slate-600 px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95"
                    >
                        <UploadCloud size={18} /> Bulk Upload
                    </button>
                    <input type="file" ref={bulkInputRef} onChange={handleBulkUpload} className="hidden" accept=".csv,.xlsx" />
                    <button
                        onClick={() => openModal('add')}
                        className="flex-1 lg:flex-none bg-slate-900 hover:bg-black text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-xl shadow-slate-900/20 active:scale-95"
                    >
                        <Plus size={18} /> New Product
                    </button>
                </div>
            </div>

            {/* Filters & Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-8 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="relative flex-1">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by SKU, Name or Category..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-50 border-none rounded-xl pl-12 pr-4 py-2.5 text-sm font-bold outline-none ring-2 ring-transparent focus:ring-blue-500/20 transition-all"
                        />
                    </div>
                    <div className="flex bg-slate-100 p-1 rounded-xl h-[44px]">
                        <button onClick={() => setViewMode('list')} className={`px-4 rounded-lg flex items-center justify-center transition-all ${viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
                            <List size={18} />
                        </button>
                        <button onClick={() => setViewMode('grid')} className={`px-4 rounded-lg flex items-center justify-center transition-all ${viewMode === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
                            <LayoutGrid size={18} />
                        </button>
                    </div>
                </div>
                <div className="md:col-span-4 grid grid-cols-2 gap-4">
                    <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex flex-col justify-center">
                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Active</span>
                        <span className="text-xl font-black text-emerald-700">{products.filter(p => p.stock_quantity > 0).length}</span>
                    </div>
                    <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex flex-col justify-center">
                        <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">Out of Stock</span>
                        <span className="text-xl font-black text-red-700">{products.filter(p => p.stock_quantity === 0).length}</span>
                    </div>
                </div>
            </div>

            {/* Inventory List */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50 border-b border-slate-100">
                            <tr>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Product</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">SKU</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Price</th>
                                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr><td colSpan="5" className="p-20 text-center text-xs font-bold text-slate-400 animate-pulse">Scanning server nodes...</td></tr>
                            ) : filteredProducts.map(product => (
                                <tr key={product.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-8 py-4">
                                        <div className="flex items-center gap-5">
                                            <div className="w-16 h-16 rounded-2xl bg-white border border-slate-100 p-1 flex items-center justify-center overflow-hidden shadow-sm group-hover:scale-110 transition-transform">
                                                <img src={product.image} alt="" className="w-full h-full object-contain" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm text-slate-800 leading-tight mb-1">{product.name}</p>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">{product.category_name || 'General Inventory'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs font-black text-slate-600 bg-slate-100 px-2 py-1 rounded-lg uppercase tracking-tight">{product.sku || 'N/A'}</span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {getStockBadge(product.stock_quantity)}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-black text-slate-800">₹{parseFloat(product.price).toLocaleString()}</span>
                                            {product.discount_price && (
                                                <span className="text-[10px] text-emerald-500 font-bold">₹{parseFloat(product.discount_price).toLocaleString()} Sale</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => openModal('edit', product)} className="p-2.5 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"><Pencil size={18} /></button>
                                            <button onClick={() => handleDelete(product.id)} className="p-2.5 text-red-600 hover:bg-red-50 rounded-xl transition-colors"><Trash2 size={18} /></button>
                                            <button className="p-2.5 text-slate-400 hover:bg-slate-100 rounded-xl"><MoreHorizontal size={18} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Inventory Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 z-[500] flex items-center justify-center backdrop-blur-md px-4 animate-reveal">
                    <div className="bg-white w-full max-w-5xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[95vh] border border-white/20">
                        <div className="px-10 py-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <div>
                                <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter italic">{modalMode === 'add' ? 'Publish Listing' : 'Sync Inventory'}</h2>
                                <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mt-1">Advanced SKU Management v4.0</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-3 bg-white hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-full transition-all shadow-sm"><X size={24} /></button>
                        </div>

                        <form onSubmit={handleSaveProduct} className="p-10 space-y-10 overflow-y-auto no-scrollbar flex-1">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                                <div className="space-y-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Universal Product Identifier (Name)</label>
                                        <input required type="text" value={currentProduct.name} onChange={e => setCurrentProduct({ ...currentProduct, name: e.target.value })} className="w-full bg-slate-50 border-2 border-transparent rounded-[1.5rem] px-6 py-4.5 font-bold text-slate-800 focus:bg-white focus:border-blue-500 focus:ring-8 ring-blue-50 transition-all outline-none" placeholder="e.g. Sony WH-1000XM4 Headphones" />
                                    </div>

                                    <div className="grid grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Merchant SKU</label>
                                            <input type="text" value={currentProduct.sku} onChange={e => setCurrentProduct({ ...currentProduct, sku: e.target.value })} className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-6 py-4 font-bold focus:bg-white focus:border-blue-500 transition-all outline-none" placeholder="auto-generated" />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Stock Quantity</label>
                                            <input required type="number" value={currentProduct.stock_quantity} onChange={e => setCurrentProduct({ ...currentProduct, stock_quantity: e.target.value })} className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-6 py-4 font-bold focus:bg-white focus:border-blue-500 transition-all outline-none text-center" placeholder="0" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Retail Price (₹)</label>
                                            <input required type="number" value={currentProduct.price} onChange={e => setCurrentProduct({ ...currentProduct, price: e.target.value })} className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-6 py-4 font-bold focus:bg-white focus:border-blue-500 transition-all outline-none" placeholder="0.00" />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Discounted Price (₹)</label>
                                            <input type="number" value={currentProduct.discount_price} onChange={e => setCurrentProduct({ ...currentProduct, discount_price: e.target.value })} className="w-full bg-blue-50/30 border-2 border-transparent rounded-2xl px-6 py-4 font-bold focus:bg-white focus:border-emerald-500 transition-all outline-none" placeholder="Optional" />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Product Category</label>
                                        <select required value={currentProduct.category_id} onChange={e => setCurrentProduct({ ...currentProduct, category_id: e.target.value })} className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-6 py-4 font-bold focus:bg-white focus:border-blue-500 transition-all outline-none appearance-none">
                                            <option value="">Select Department</option>
                                            {categories.map(c => <option key={c.id} value={c.id}>{c.displayName}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <div className="flex justify-between items-center mb-2">
                                        <div>
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Product Gallery</label>
                                            <p className="text-[10px] text-slate-300 font-bold mt-1 uppercase tracking-wider">High-resolution recommended</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20"
                                        >
                                            <Camera size={16} /> Upload New
                                        </button>
                                        <input type="file" multiple ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 p-2 bg-slate-50/50 border-2 border-dashed border-slate-100 rounded-[2.5rem] min-h-[300px] content-start overflow-y-auto no-scrollbar">
                                        {/* Dynamic Image Slots */}
                                        {currentProduct.existingImages.map((src, idx) => (
                                            <div key={`exist-${idx}`} className="group relative aspect-square rounded-3xl bg-white border border-slate-100 overflow-hidden shadow-sm">
                                                <img src={src} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                    <button type="button" onClick={() => setCurrentProduct({ ...currentProduct, existingImages: currentProduct.existingImages.filter((_, i) => i !== idx) })} className="p-2 bg-red-500 text-white rounded-lg hover:scale-110 transition-transform"><Trash2 size={16} /></button>
                                                </div>
                                            </div>
                                        ))}
                                        {previews.map((src, idx) => (
                                            <div key={`new-${idx}`} className="group relative aspect-square rounded-3xl bg-blue-50 border-2 border-blue-200 overflow-hidden shadow-sm animate-reveal">
                                                <img src={src} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                                                <div className="absolute top-2 left-2 px-2 py-0.5 bg-emerald-500 text-[8px] font-black text-white rounded uppercase tracking-widest">New</div>
                                                <button type="button" onClick={() => { setPreviews(previews.filter((_, i) => i !== idx)); setSelectedFiles(selectedFiles.filter((_, i) => i !== idx)); }} className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"><X size={14} /></button>
                                            </div>
                                        ))}
                                        {(currentProduct.existingImages.length + previews.length === 0) && (
                                            <div className="col-span-full h-[250px] flex flex-col items-center justify-center text-slate-300">
                                                <ImageIcon size={64} strokeWidth={1} className="mb-4 opacity-50" />
                                                <p className="text-[10px] font-black uppercase tracking-widest">Awaiting Visual Assets</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Marketplace Description</label>
                                        <textarea rows="5" value={currentProduct.description} onChange={e => setCurrentProduct({ ...currentProduct, description: e.target.value })} className="w-full bg-slate-50 border-2 border-transparent rounded-[1.5rem] px-6 py-5 font-bold focus:bg-white focus:border-blue-500 transition-all outline-none resize-none" placeholder="Provide a compelling narrative for your product..." />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-10 border-t border-slate-50 flex justify-end items-center gap-8">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-slate-600 transition-colors">Discard Changes</button>
                                <button disabled={isSaving} type="submit" className="bg-slate-900 text-white px-16 py-5 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-xs transition-all shadow-2xl shadow-slate-900/40 hover:-translate-y-1 active:scale-95 flex items-center gap-3 disabled:bg-slate-400">
                                    {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                    {modalMode === 'add' ? 'Deploy Listing' : 'Sync Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductManagement;
