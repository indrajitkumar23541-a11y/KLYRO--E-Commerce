import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, Plus, X } from 'lucide-react';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const ProductList = () => {
    const { token } = useAuth();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
    const [currentProduct, setCurrentProduct] = useState({ id: null, name: '', price: '', category_id: '', image: '', description: '' });

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await API.get('/products?limit=100'); // Fetch a larger limit for admin easily
            if (res.data.success) {
                setProducts(res.data.products);
            }
        } catch (error) {
            console.error('Failed to fetch products', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await API.get('/categories');
            if (res.data.success) {
                setCategories(res.data.categories);
            }
        } catch (error) {
            console.error('Failed to fetch categories', error);
        }
    };

    const handleDelete = async (id) => {
        if(window.confirm('Are you sure you want to delete this product?')) {
            try {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                await API.delete(`/products/${id}`, config);
                setProducts(products.filter(p => p.id !== id));
            } catch (error) {
                console.error('Failed to delete product', error);
                alert('Failed to delete product');
            }
        }
    };

    const openAddModal = () => {
        setModalMode('add');
        setCurrentProduct({ id: null, name: '', price: '', category_id: '', image: '', description: '' });
        setIsModalOpen(true);
    };

    const openEditModal = (product) => {
        setModalMode('edit');
        setCurrentProduct({
            id: product.id,
            name: product.name,
            price: product.price,
            category_id: product.category_id || '',
            image: product.image || '',
            description: product.description || ''
        });
        setIsModalOpen(true);
    };

    const handleSaveProduct = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const payload = { ...currentProduct, price: parseFloat(currentProduct.price) };
            if (!payload.category_id) delete payload.category_id; // prevent empty string

            if (modalMode === 'add') {
                const res = await API.post('/products', payload, config);
                if (res.data.success) {
                    fetchProducts(); // Refresh list to get joined category names
                }
            } else {
                const res = await API.put(`/products/${payload.id}`, payload, config);
                if (res.data.success) {
                    fetchProducts(); // Refresh list
                }
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error('Failed to save product', error);
            alert('Failed to save product. Please check the network payload.');
        }
    };

    return (
        <div className="space-y-8 animate-reveal">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 md:p-6 rounded-[20px] shadow-sm border border-slate-100/60 gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-normal text-[#383a48] mb-1">Products Management</h1>
                    <p className="text-[#84879b] text-xs md:text-sm">View, edit, and orchestrate inventory.</p>
                </div>
                <button onClick={openAddModal} className="w-full sm:w-auto bg-[#5b7296] hover:bg-[#485c7d] text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md text-sm md:text-base">
                    <Plus size={20} /> Add Product
                </button>
            </div>

            <div className="bg-white rounded-[20px] shadow-sm border border-slate-100/60 overflow-hidden">
                <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[800px] md:min-w-0">
                        <thead className="bg-slate-50/50">
                            <tr className="border-b border-slate-100 uppercase text-[10px] font-black text-slate-400">
                                <th className="p-4 pl-6 w-20">ID</th>
                                <th className="p-4 w-20">Image</th>
                                <th className="p-4">Name</th>
                                <th className="p-4">Price</th>
                                <th className="p-4">Category</th>
                                <th className="p-4 pr-6 text-right w-24">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-slate-400 font-bold animate-pulse">Loading Products...</td>
                                </tr>
                            ) : products.map(product => (
                                <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="p-4 pl-6 text-slate-400 font-bold text-xs">#{product.id}</td>
                                    <td className="p-4">
                                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-slate-100 flex items-center justify-center p-1 overflow-hidden">
                                            <img src={product.image || 'https://via.placeholder.com/150'} alt={product.name} className="max-w-full max-h-full object-contain mix-blend-multiply" />
                                        </div>
                                    </td>
                                    <td className="p-4 font-bold text-sm md:text-base text-slate-800">{product.name}</td>
                                    <td className="p-4 font-black text-sm md:text-base text-[#bc612c]">₹{product.price}</td>
                                    <td className="p-4">
                                        <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{product.category_name || 'Uncategorized'}</span>
                                    </td>
                                    <td className="p-4 pr-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => openEditModal(product)} className="p-2 text-slate-400 hover:text-blue-600 bg-white hover:bg-blue-50 border border-slate-200 rounded-lg transition-all shadow-sm">
                                                <Pencil size={14} md={16} />
                                            </button>
                                            <button onClick={() => handleDelete(product.id)} className="p-2 text-slate-400 hover:text-red-600 bg-white hover:bg-red-50 border border-slate-200 rounded-lg transition-all shadow-sm">
                                                <Trash2 size={14} md={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Dialog */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 z-[300] flex items-center justify-center backdrop-blur-sm animate-reveal px-4">
                    <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl p-6 md:p-8 relative max-h-[90vh] overflow-y-auto no-scrollbar">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-red-500 bg-slate-50 hover:bg-red-50 p-2 rounded-full transition-colors">
                            <X size={24} />
                        </button>
                        <h2 className="text-2xl font-black text-slate-800 mb-6 uppercase tracking-tighter">
                            {modalMode === 'add' ? 'Add New Product' : 'Edit Product'}
                        </h2>
                        
                        <form onSubmit={handleSaveProduct} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-500">Product Name *</label>
                                    <input required type="text" value={currentProduct.name} onChange={e => setCurrentProduct({...currentProduct, name: e.target.value})} className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 font-bold text-slate-800 focus:border-accent-color focus:ring-0 transition-colors bg-slate-50 focus:bg-white outline-none" placeholder="Enter product name" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-500">Price (₹) *</label>
                                    <input required type="number" step="0.01" value={currentProduct.price} onChange={e => setCurrentProduct({...currentProduct, price: e.target.value})} className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 font-bold text-slate-800 focus:border-accent-color focus:ring-0 transition-colors bg-slate-50 focus:bg-white outline-none" placeholder="0.00" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-500">Category</label>
                                    <select value={currentProduct.category_id} onChange={e => setCurrentProduct({...currentProduct, category_id: e.target.value})} className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 font-bold text-slate-800 focus:border-accent-color focus:ring-0 transition-colors bg-slate-50 focus:bg-white outline-none">
                                        <option value="">Select a category</option>
                                        {categories.map(c => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-500">Image URL</label>
                                    <input type="text" value={currentProduct.image} onChange={e => setCurrentProduct({...currentProduct, image: e.target.value})} className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 font-bold text-slate-800 focus:border-accent-color focus:ring-0 transition-colors bg-slate-50 focus:bg-white outline-none" placeholder="https://..." />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-500">Description</label>
                                <textarea rows="4" value={currentProduct.description} onChange={e => setCurrentProduct({...currentProduct, description: e.target.value})} className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 font-medium text-slate-600 focus:border-accent-color focus:ring-0 transition-colors bg-slate-50 focus:bg-white outline-none resize-none" placeholder="Write a compelling description..."></textarea>
                            </div>
                            
                            <div className="pt-4 border-t border-slate-100 flex justify-end gap-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 font-bold text-slate-500 hover:text-slate-800 transition-colors">Cancel</button>
                                <button type="submit" className="bg-primary-color hover:bg-secondary-color text-white px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-sm transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                                    {modalMode === 'add' ? 'Create Product' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductList;
