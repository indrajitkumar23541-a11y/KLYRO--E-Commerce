import React, { useState, useEffect } from 'react';
import { UserCheck, Trash2, ShieldBan, Verified } from 'lucide-react';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const SellerList = () => {
    const { token } = useAuth();
    const [sellers, setSellers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSellers = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const res = await API.get('/admin/users', config);
                if (res.data.success) {
                    setSellers(res.data.users.filter(u => u.role === 'seller'));
                }
            } catch (error) {
                console.error('Failed to fetch sellers', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSellers();
    }, [token]);

    const handleRevokeSeller = async (id) => {
        if(window.confirm('Are you sure you want to revoke this seller\'s privileges? They will become a normal user.')) {
            try {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                await API.put(`/admin/users/${id}`, { role: 'user' }, config);
                setSellers(sellers.filter(s => s.id !== id));
            } catch (error) {
                console.error('Failed to update role', error);
            }
        }
    };

    return (
        <div className="space-y-6 animate-reveal">
            <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-normal text-[#383a48] mb-1">Manage Sellers</h1>
                <p className="text-[#84879b] text-xs md:text-sm">Monitor merchant accounts and vendor privileges.</p>
            </div>

            <div className="bg-white rounded-[20px] shadow-sm border border-slate-100/60 overflow-hidden">
                <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full text-left min-w-[600px] md:min-w-0">
                        <thead className="bg-slate-50/50 uppercase text-[10px] font-black text-slate-400">
                            <tr>
                                <th className="px-4 md:px-6 py-4">Seller Details</th>
                                <th className="px-4 md:px-6 py-4">Join Date</th>
                                <th className="px-4 md:px-6 py-4">Status</th>
                                <th className="px-4 md:px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="p-8 text-center text-slate-400 font-bold animate-pulse">Loading Sellers...</td>
                                </tr>
                            ) : sellers.length > 0 ? sellers.map(s => (
                                <tr key={s.id} className="hover:bg-slate-50/50 transition-colors border-b border-slate-50">
                                    <td className="px-4 md:px-6 py-4">
                                        <div className="flex items-center gap-3 md:gap-4">
                                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full flex justify-center items-center bg-[#7ba987]/10 text-[#7ba987] flex-shrink-0">
                                                <UserCheck size={16} md={18} />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-bold text-xs md:text-sm text-[#383a48] leading-none mb-1 truncate">{s.name}</p>
                                                <span className="text-[10px] md:text-[11px] text-slate-400 font-medium truncate block">{s.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 md:px-6 py-4 text-[10px] md:text-xs font-bold text-slate-500 whitespace-nowrap">
                                        {new Date(s.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 md:px-6 py-4">
                                        <span className="bg-[#7ba987] text-white px-2 md:px-3 py-1 rounded-[4px] text-[9px] md:text-[10px] font-black uppercase tracking-wider flex items-center gap-1 w-fit">
                                            <Verified size={10} md={12} /> <span className="hidden sm:inline">Active</span>
                                        </span>
                                    </td>
                                    <td className="px-4 md:px-6 py-4 text-right">
                                        <button onClick={() => handleRevokeSeller(s.id)} className="bg-[#e5a975] hover:bg-orange-500 text-white px-2 md:px-3 py-1.5 rounded-[4px] text-[9px] md:text-[10px] font-black uppercase tracking-wider flex items-center gap-1 ml-auto transition-colors">
                                            <ShieldBan size={10} md={12} /> <span className="hidden sm:inline">Revoke</span>
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="4" className="p-8 text-center text-slate-400 font-bold">No sellers found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SellerList;
