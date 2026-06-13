import React, { useState, useEffect } from 'react';
import { Package, MoreVertical, Edit2 } from 'lucide-react';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const OrderList = () => {
    const { token } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const res = await API.get('/orders', config);
            if (res.data.success) {
                setOrders(res.data.orders);
            }
        } catch (error) {
            console.error('Failed to fetch orders', error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, newStatus) => {
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await API.put(`/orders/${id}/status`, { status: newStatus }, config);
            setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
        } catch (error) {
            console.error('Failed to update status', error);
            alert('Failed to update status');
        }
    };

    const getStatusStyle = (status) => {
        switch(status) {
            case 'delivered': return 'bg-emerald-100 text-emerald-700';
            case 'shipped': return 'bg-blue-100 text-blue-700';
            case 'processing': return 'bg-orange-100 text-orange-700';
            case 'cancelled': return 'bg-red-100 text-red-700';
            default: return 'bg-slate-100 text-slate-700'; // pending
        }
    };

    return (
        <div className="space-y-8 animate-reveal">
            <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-normal text-[#383a48] mb-1">Orders Management</h1>
                <p className="text-[#84879b] text-xs md:text-sm">Track shipments and update statuses.</p>
            </div>

            <div className="bg-white rounded-[20px] shadow-sm border border-slate-100/60 overflow-hidden">
                <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[700px] md:min-w-0">
                        <thead className="bg-slate-50/50">
                            <tr className="border-b border-slate-100 uppercase text-[10px] font-black text-slate-400">
                                <th className="p-4 pl-6 w-24">Order ID</th>
                                <th className="p-4">Customer</th>
                                <th className="p-4">Date</th>
                                <th className="p-4">Total</th>
                                <th className="p-4">Method</th>
                                <th className="p-4 pr-6 w-40 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-slate-400 font-bold animate-pulse">Loading Orders...</td>
                                </tr>
                            ) : orders.map(order => (
                                <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="p-4 pl-6 text-slate-400 font-bold text-xs">#{order.id}</td>
                                    <td className="p-4 text-xs md:text-sm">
                                        <p className="font-bold text-slate-800">{order.user_name}</p>
                                    </td>
                                    <td className="p-4 text-[10px] md:text-xs font-bold text-slate-500">
                                        {new Date(order.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="p-4 font-black text-xs md:text-sm text-[#bc612c]">₹{order.total_price}</td>
                                    <td className="p-4 text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest">
                                        {order.payment_method}
                                    </td>
                                    <td className="p-4 pr-6 text-center">
                                        <select 
                                            value={order.status} 
                                            onChange={(e) => updateStatus(order.id, e.target.value)}
                                            className={`text-[9px] md:text-xs font-black uppercase tracking-widest px-2 py-1 rounded outline-none border border-slate-200 cursor-pointer ${getStatusStyle(order.status)}`}
                                        >
                                            <option value="pending">PENDING</option>
                                            <option value="processing">PROCESSING</option>
                                            <option value="shipped">SHIPPED</option>
                                            <option value="delivered">DELIVERED</option>
                                            <option value="cancelled">CANCELLED</option>
                                        </select>
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

export default OrderList;
