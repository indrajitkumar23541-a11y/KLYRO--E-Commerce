import React, { useState, useEffect } from 'react';
import { Trash2, Plus, Grip } from 'lucide-react';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { buildCategoryTree } from '../../utils/categoryUtils';

const CategoryList = () => {
    const { token } = useAuth();
    const [categories, setCategories] = useState([]);
    const [flatCategories, setFlatCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const [newCategoryName, setNewCategoryName] = useState('');
    const [newCategoryParent, setNewCategoryParent] = useState('');

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await API.get('/categories');
            if (res.data.success) {
                setFlatCategories(res.data.categories);
                setCategories(buildCategoryTree(res.data.categories));
            }
        } catch (error) {
            console.error('Failed to fetch categories', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddCategory = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const payload = { name: newCategoryName };
            if (newCategoryParent) payload.parent_id = newCategoryParent;

            const res = await API.post('/categories', payload, config);
            if (res.data.success) {
                setNewCategoryName('');
                setNewCategoryParent('');
                fetchCategories();
            }
        } catch (error) {
            console.error('Failed to add category', error);
            alert('Failed to add category');
        }
    };

    const handleDelete = async (id) => {
        if(window.confirm('WARNING: Deleting a parent category will delete all subcategories, and detach products. Proceed?')) {
            try {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                await API.delete(`/categories/${id}`, config);
                fetchCategories();
            } catch (error) {
                console.error('Failed to delete category', error);
                alert('Failed to delete category');
            }
        }
    };

    return (
        <div className="space-y-8 animate-reveal">
            <div className="bg-white p-8 rounded-[20px] shadow-sm border border-slate-100/60 grid md:grid-cols-2 gap-8">
                <div className="p-0 md:p-0">
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-normal text-[#383a48] mb-1">Category Management</h1>
                    <p className="text-[#84879b] text-xs md:text-sm mb-6 md:mb-8">Organize product hierarchy and structures.</p>
                    
                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                        <h2 className="text-sm font-black uppercase text-slate-600 mb-4 tracking-widest flex items-center gap-2">
                            <Plus size={16} /> Add New Category
                        </h2>
                        <form onSubmit={handleAddCategory} className="space-y-4">
                            <div>
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Category Name *</label>
                                <input required type="text" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} className="w-full mt-1 border-2 border-white rounded-xl px-4 py-3 font-bold text-slate-800 focus:border-accent-color focus:ring-0 transition-colors outline-none" placeholder="e.g. Shoes" />
                            </div>
                            <div>
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Parent Category</label>
                                <select value={newCategoryParent} onChange={(e) => setNewCategoryParent(e.target.value)} className="w-full mt-1 border-2 border-white rounded-xl px-4 py-3 font-bold text-slate-800 focus:border-accent-color focus:ring-0 transition-colors outline-none">
                                    <option value="">None (Top Level)</option>
                                    {flatCategories.filter(c => !c.parent_id).map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                            <button type="submit" className="w-full bg-[#5b7296] hover:bg-[#485c7d] text-white px-6 py-3 rounded-xl font-bold text-sm tracking-wide transition-colors">
                                Create Category
                            </button>
                        </form>
                    </div>
                </div>

                <div className="bg-white border text-sm rounded-xl overflow-y-auto max-h-[500px] md:max-h-[600px] custom-scroll">
                     {loading ? (
                         <div className="p-8 text-center text-slate-400 font-bold animate-pulse">Loading Categories...</div>
                     ) : (
                         <ul className="divide-y divide-slate-100">
                            {categories.map((cat) => (
                                <li key={cat.id}>
                                    <div className="flex items-center justify-between p-3 md:p-4 bg-slate-50 border-l-4 border-slate-800 hover:bg-slate-100 transition-colors">
                                        <div className="flex items-center gap-2 md:gap-3">
                                            <Grip size={14} md={16} className="text-slate-400" />
                                            <span className="font-black text-slate-800 text-xs md:text-sm">{cat.name}</span>
                                        </div>
                                        <button onClick={() => handleDelete(cat.id)} className="text-slate-400 hover:text-red-500 p-1">
                                            <Trash2 size={14} md={16} />
                                        </button>
                                    </div>
                                    {cat.children && cat.children.length > 0 && (
                                        <ul className="pl-6 md:pl-12 divide-y divide-slate-100 bg-white">
                                            {cat.children.map(child => (
                                                <li key={child.id} className="flex items-center justify-between p-2 md:p-3 hover:bg-slate-50 transition-colors">
                                                    <div className="flex items-center gap-2 md:gap-3">
                                                        <span className="text-slate-300 font-black text-xs">-</span>
                                                        <span className="font-bold text-slate-600 text-[11px] md:text-sm">{child.name}</span>
                                                    </div>
                                                    <button onClick={() => handleDelete(child.id)} className="text-slate-400 hover:text-red-500 p-1 opacity-100 lg:opacity-0 lg:hover:opacity-100 group-hover:opacity-100 transition-opacity">
                                                        <Trash2 size={12} md={14} />
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </li>
                            ))}
                         </ul>
                     )}
                </div>
            </div>
        </div>
    );
};

export default CategoryList;
