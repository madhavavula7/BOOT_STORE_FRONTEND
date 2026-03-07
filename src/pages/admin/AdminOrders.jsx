import React, { useEffect, useState } from 'react';
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  ExternalLink, 
  Loader2, 
  ArrowLeft, 
  Search, 
  Filter,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('ALL');
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
            toast.error("Logistics synchronization failed");
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            await axios.put(`https://book-store-springboot.onrender.com/api/admin/order/${orderId}/status`, 
            { status: newStatus },
            { headers: { Authorization: `Bearer ${token}` } });
            
            toast.success(`Fulfillment updated: ${newStatus}`);
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        } catch (err) {
            toast.error("Failed to update fulfillment status");
        }
    };

    useEffect(() => { fetchOrders(); }, []);

    // Metrics calculation
    const totalRevenue = orders
        .filter(o => o.status !== 'CANCELLED')
        .reduce((acc, o) => acc + (o.totalPrice || 0), 0);
    
    const pendingFulfillment = orders.filter(o => o.status === 'PENDING').length;

    const filteredOrders = orders.filter(order => {
        const matchesSearch = order.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) || order.id.toString().includes(searchTerm);
        const matchesStatus = filterStatus === 'ALL' || order.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-[80vh] gap-4">
            <Loader2 className="animate-spin text-blue-600" size={48} />
            <p className="font-black text-gray-400 animate-pulse uppercase tracking-widest text-xs">Synchronizing Global Logistics...</p>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 mb-20">
            {/* Header Area */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 mb-10">
                <div>
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 font-black text-gray-400 hover:text-black mb-2 uppercase text-[10px] tracking-widest transition-colors">
                        <ArrowLeft size={14} /> Return to Console
                    </button>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tighter italic uppercase">Order Logistics</h1>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
                    <div className="relative flex-grow sm:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search Order ID or Email..." 
                            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-100 shadow-sm focus:ring-4 focus:ring-blue-50 outline-none font-bold"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select 
                        className="p-4 rounded-2xl border border-gray-100 bg-white font-black text-xs uppercase tracking-widest outline-none focus:ring-4 focus:ring-blue-50"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="ALL">All Status</option>
                        <option value="PENDING">Pending</option>
                        <option value="SHIPPED">Shipped</option>
                        <option value="DELIVERED">Delivered</option>
                        <option value="CANCELLED">Cancelled</option>
                    </select>
                </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                <div className="bg-emerald-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-emerald-100 flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">Total Realized Revenue</p>
                        <p className="text-4xl font-black italic">₹{totalRevenue.toLocaleString()}</p>
                    </div>
                    <TrendingUp size={48} className="opacity-20" />
                </div>
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Active Fulfillments</p>
                        <p className="text-4xl font-black text-amber-500 italic">{pendingFulfillment}</p>
                    </div>
                    <AlertCircle size={48} className="text-amber-100" />
                </div>
            </div>

            {/* Orders Feed */}
            <div className="grid gap-6">
                {filteredOrders.length > 0 ? filteredOrders.map(order => (
                    <div key={order.id} className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
                        <div className="flex flex-col lg:flex-row justify-between gap-8 relative z-10">
                            {/* Order Identity */}
                            <div className="flex items-start gap-6">
                                <div className={`p-5 rounded-3xl ${
                                    order.status === 'DELIVERED' ? 'bg-emerald-50 text-emerald-600' : 
                                    order.status === 'SHIPPED' ? 'bg-blue-50 text-blue-600' : 
                                    order.status === 'CANCELLED' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
                                }`}>
                                    <Package size={28} />
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <p className="font-black text-xl tracking-tight uppercase">ID: ORD-{order.id}</p>
                                        <span className="text-[10px] font-black bg-gray-50 text-gray-500 px-3 py-1 rounded-full border border-gray-100">
                                            {new Date(order.orderDate).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-sm font-bold text-gray-400 mb-4">{order.userEmail}</p>
                                    
                                    {/* Item Preview */}
                                    <div className="flex flex-wrap gap-2">
                                        {order.orderItems?.map((item, idx) => (
                                            <span key={idx} className="text-[10px] font-black px-3 py-1 bg-slate-50 text-slate-500 rounded-lg border border-slate-100">
                                                {item.bookTitle} (x{item.quantity})
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Logistics Control */}
                            <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-center gap-4">
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Fulfillment Status</p>
                                    <select 
                                        className={`w-full sm:w-44 p-3 rounded-xl text-xs font-black uppercase tracking-widest outline-none border-2 transition-all cursor-pointer ${
                                            order.status === 'DELIVERED' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 
                                            order.status === 'SHIPPED' ? 'border-blue-200 bg-blue-50 text-blue-700' : 
                                            order.status === 'CANCELLED' ? 'border-rose-200 bg-rose-50 text-rose-700' : 'border-amber-200 bg-amber-50 text-amber-700'
                                        }`}
                                        value={order.status}
                                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                    >
                                        <option value="PENDING">Pending</option>
                                        <option value="SHIPPED">Shipped</option>
                                        <option value="DELIVERED">Delivered</option>
                                        <option value="CANCELLED">Cancelled</option>
                                    </select>
                                </div>

                                <div className="bg-slate-900 px-8 py-4 rounded-2xl text-center min-w-[150px] shadow-lg shadow-slate-200">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Captured Total</p>
                                    <p className="text-xl font-black text-white italic font-mono">₹{(order.totalPrice || 0).toLocaleString()}</p>
                                </div>
                            </div>
                        </div>

                        {/* Progress Timeline (Hidden for Cancelled) */}
                        {order.status !== 'CANCELLED' && (
                            <div className="mt-8 pt-8 border-t border-gray-50 flex items-center justify-between text-[10px] font-black text-gray-300 uppercase tracking-widest">
                                <div className="flex items-center gap-2 text-amber-500"><Clock size={14}/> Received</div>
                                <div className={`h-[2px] flex-grow mx-4 transition-all duration-500 ${order.status === 'SHIPPED' || order.status === 'DELIVERED' ? 'bg-blue-500' : 'bg-gray-100'}`}></div>
                                <div className={`flex items-center gap-2 transition-colors ${order.status === 'SHIPPED' || order.status === 'DELIVERED' ? 'text-blue-500' : ''}`}><Truck size={14}/> Dispatched</div>
                                <div className={`h-[2px] flex-grow mx-4 transition-all duration-500 ${order.status === 'DELIVERED' ? 'bg-emerald-500' : 'bg-gray-100'}`}></div>
                                <div className={`flex items-center gap-2 transition-colors ${order.status === 'DELIVERED' ? 'text-emerald-500' : ''}`}><CheckCircle size={14}/> Finalized</div>
                            </div>
                        )}
                        
                        <Package className="absolute right-[-20px] top-[-20px] text-gray-50/50 w-40 h-40 pointer-events-none" />
                    </div>
                )) : (
                    <div className="text-center py-24 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
                        <Package className="mx-auto text-gray-300 mb-4" size={48} />
                        <p className="font-black text-gray-400 italic uppercase text-xs tracking-widest">Zero entries found in database.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminOrders;