import React, { useEffect, useState } from 'react';
import { Package, Truck, CheckCircle, Clock, ExternalLink, Loader2, ArrowLeft, Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const res = await axios.get('https://book-store-springboot.onrender.com/api/admin/all-orders', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrders(res.data);
        } catch (err) {
            toast.error("Failed to load orders");
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (orderId, newStatus) => {
        try {
            await axios.put(`https://book-store-springboot.onrender.com/api/admin/order/${orderId}/status`, 
            { status: newStatus },
            { headers: { Authorization: `Bearer ${token}` } });
            
            toast.success(`Order marked as ${newStatus}`);
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        } catch (err) {
            toast.error("Status update failed");
        }
    };

    useEffect(() => { fetchOrders(); }, []);

    const filteredOrders = orders.filter(order => 
        order.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toString().includes(searchTerm)
    );

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-[80vh] gap-4">
            <Loader2 className="animate-spin text-blue-600" size={48} />
            <p className="font-black text-gray-400 text-xs tracking-widest uppercase">Fetching Order History...</p>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 mb-20">
            {/* Header Area */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 mb-10">
                <div>
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 font-black text-gray-400 hover:text-black mb-2 uppercase text-[10px] tracking-widest">
                        <ArrowLeft size={14} /> Back to Dashboard
                    </button>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tighter italic">ORDER LOGISTICS</h1>
                </div>

                <div className="relative w-full xl:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search by Email or Order ID..." 
                        className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-100 shadow-sm focus:ring-4 focus:ring-blue-50 outline-none font-bold"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Orders List */}
            <div className="grid gap-6">
                {filteredOrders.length > 0 ? filteredOrders.map(order => (
                    <div key={order.id} className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm hover:shadow-md transition-all group">
                        <div className="flex flex-col lg:flex-row justify-between gap-8">
                            {/* Left Side: Order Info */}
                            <div className="flex items-start gap-6">
                                <div className={`p-5 rounded-[1.5rem] ${
                                    order.status === 'DELIVERED' ? 'bg-emerald-100 text-emerald-600' : 
                                    order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-600' : 'bg-amber-100 text-amber-600'
                                }`}>
                                    <Package size={28} />
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <p className="font-black text-xl tracking-tight">Order #ORD-{order.id}</p>
                                        <span className="text-[10px] font-black bg-gray-100 text-gray-500 px-3 py-1 rounded-full uppercase">
                                            {new Date(order.orderDate).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-sm font-bold text-gray-400">{order.userEmail}</p>
                                    <p className="mt-3 text-sm font-medium text-gray-600">Items: {order.orderItems?.length || 0} books purchased</p>
                                </div>
                            </div>

                            {/* Right Side: Status Control */}
                            <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-center gap-4">
                                <div className="text-right flex-grow">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Current Status</p>
                                    <select 
                                        className={`w-full sm:w-40 p-3 rounded-xl text-xs font-black uppercase tracking-widest outline-none border-2 transition-all ${
                                            order.status === 'DELIVERED' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 
                                            order.status === 'SHIPPED' ? 'border-blue-200 bg-blue-50 text-blue-700' : 'border-amber-200 bg-amber-50 text-amber-700'
                                        }`}
                                        value={order.status}
                                        onChange={(e) => updateStatus(order.id, e.target.value)}
                                    >
                                        <option value="PENDING">Pending</option>
                                        <option value="SHIPPED">Shipped</option>
                                        <option value="DELIVERED">Delivered</option>
                                        <option value="CANCELLED">Cancelled</option>
                                    </select>
                                </div>

                                <div className="bg-gray-50 px-8 py-4 rounded-2xl text-center min-w-[140px]">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Amount</p>
                                    <p className="text-xl font-black text-gray-900 font-mono">₹{order.totalPrice || order.totalAmount}</p>
                                </div>
                            </div>
                        </div>

                        {/* Order Progress Line */}
                        <div className="mt-8 pt-8 border-t border-gray-50 flex items-center justify-between text-[10px] font-black text-gray-300 uppercase tracking-widest">
                            <div className="flex items-center gap-2 text-amber-500"><Clock size={14}/> Placed</div>
                            <div className={`h-[2px] flex-grow mx-4 ${order.status === 'SHIPPED' || order.status === 'DELIVERED' ? 'bg-blue-500' : 'bg-gray-100'}`}></div>
                            <div className={`flex items-center gap-2 ${order.status === 'SHIPPED' || order.status === 'DELIVERED' ? 'text-blue-500' : ''}`}><Truck size={14}/> Shipped</div>
                            <div className={`h-[2px] flex-grow mx-4 ${order.status === 'DELIVERED' ? 'bg-emerald-500' : 'bg-gray-100'}`}></div>
                            <div className={`flex items-center gap-2 ${order.status === 'DELIVERED' ? 'text-emerald-500' : ''}`}><CheckCircle size={14}/> Delivered</div>
                        </div>
                    </div>
                )) : (
                    <div className="text-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
                        <p className="font-black text-gray-400 italic">No matching orders found in the database.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminOrders;