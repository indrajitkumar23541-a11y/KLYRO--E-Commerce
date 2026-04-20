import React, { useState, useEffect } from 'react';
import { Shield, User as UserIcon, Trash2 } from 'lucide-react';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const UserList = () => {
    const { token } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const res = await API.get('/users', config);
                if (res.data.success) {
                    setUsers(res.data.users);
                }
            } catch (error) {
                console.error('Failed to fetch users', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [token]);

    const handleDeleteUser = async (id) => {
        if(window.confirm('Are you sure you want to delete this user?')) {
            try {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                await API.delete(`/admin/users/${id}`, config);
                setUsers(users.filter(u => u.id !== id));
            } catch (error) {
                console.error('Failed to delete user', error);
                alert('Failed to delete user');
            }
        }
    };

    const handleRoleChange = async (id, newRole) => {
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await API.put(`/admin/users/${id}`, { role: newRole }, config);
            setUsers(users.map(u => u.id === id ? { ...u, role: newRole } : u));
        } catch (error) {
            console.error('Failed to update role', error);
            alert('Failed to update user role');
        }
    };

    return (
        <div className="space-y-8 animate-reveal">
            <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-normal text-[#383a48] mb-1">User Management</h1>
                <p className="text-[#84879b] text-xs md:text-sm">Manage registered customers and core roles.</p>
            </div>

            <div className="bg-white rounded-[20px] shadow-sm border border-slate-100/60 overflow-hidden">
                <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[600px] md:min-w-0">
                        <thead className="bg-slate-50/50">
                            <tr className="border-b border-slate-100 uppercase text-[10px] font-black text-slate-400">
                                <th className="p-4 pl-6 w-20">ID</th>
                                <th className="p-4">Name</th>
                                <th className="p-4">Email</th>
                                <th className="p-4">Joined</th>
                                <th className="p-4 w-32 text-center">Role</th>
                                <th className="p-4 pr-6 w-24 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-slate-400 font-bold animate-pulse">Loading Users...</td>
                                </tr>
                            ) : users.map(u => (
                                <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="p-4 pl-6 text-slate-400 font-bold text-xs">#{u.id}</td>
                                    <td className="p-4 font-bold text-xs md:text-sm text-slate-800 flex items-center gap-2 md:gap-3">
                                        <div className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex-shrink-0 flex items-center justify-center ${u.role === 'admin' ? 'bg-purple-100 text-purple-600' : 'bg-slate-100 text-slate-500'}`}>
                                            {u.role === 'admin' ? <Shield size={12} md={14} /> : <UserIcon size={12} md={14} />}
                                        </div>
                                        <span className="line-clamp-1">{u.name}</span>
                                    </td>
                                    <td className="p-4 text-xs md:text-sm text-slate-600 font-medium">{u.email}</td>
                                    <td className="p-4 text-[10px] md:text-xs font-bold text-slate-500 whitespace-nowrap">
                                        {new Date(u.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="p-4 text-center">
                                        <select 
                                            value={u.role} 
                                            onChange={(e) => handleRoleChange(u.id, e.target.value)}
                                            className={`text-[9px] md:text-xs font-black uppercase tracking-widest px-2 py-1 rounded outline-none border border-slate-200 cursor-pointer ${u.role === 'admin' ? 'bg-purple-50 text-purple-700' : u.role === 'seller' ? 'bg-amber-50 text-amber-700' : 'bg-slate-50 text-slate-700'}`}
                                        >
                                            <option value="user">USER</option>
                                            <option value="seller">SELLER</option>
                                            <option value="admin">ADMIN</option>
                                        </select>
                                    </td>
                                    <td className="p-4 pr-6 text-right">
                                        <button onClick={() => handleDeleteUser(u.id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors" title="Delete User">
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UserList;
