import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Package, Calendar, ShoppingBag, Receipt } from 'lucide-react';
import toast from 'react-hot-toast';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/orders/my', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setOrders(response.data.data || []);
            } catch (err) {
                toast.error("Failed to load orders");
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [token]);

    // Helper to calculate order total
    const calculateTotal = (items) => {
        return items ? items.reduce((sum, item) => sum + (item.price || 0), 0) : 0;
    };

    if (loading) return <div className="p-10 text-center font-bold text-gray-400 uppercase text-xs tracking-widest">Loading...</div>;

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <h1 className="text-xl font-black mb-6 text-gray-900 uppercase tracking-tight flex items-center gap-2">
                <ShoppingBag size={20} className="text-blue-600" /> Purchase History
            </h1>
            
            <div className="space-y-6">
                {orders.length > 0 ? orders.map((order) => (
                    <div key={order.orderId} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        
                        {/* --- HEADER --- */}
                        <div className="p-4 flex justify-between items-center bg-gray-50/50 border-b border-gray-100">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1.5 text-blue-600">
                                    <Package size={14} strokeWidth={3} />
                                    <span className="font-bold text-xs uppercase">#ORDER ID-{order.orderId}</span>
                                </div>
                                <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
                                    <Calendar size={12}/> {order.orderDate || 'Today'}
                                </span>
                            </div>
                            <span className="bg-white text-green-600 px-2 py-0.5 rounded border border-green-100 uppercase text-[9px] font-bold">
                                {order.orderStatus}
                            </span>
                        </div>

                        {/* --- SIMPLE ITEMS LIST --- */}
                        <div className="p-2">
                            <div className="space-y-1">
                                {order.items && order.items.map((item, index) => (
                                    <div key={index} className="flex items-center gap-4 p-2 hover:bg-gray-50 transition rounded-lg">
                                        <img 
                                            src={item.imageUrl} 
                                            alt={item.title} 
                                            className="w-8 h-10 object-cover rounded shadow-sm" 
                                        />
                                        <div className="flex-1">
                                            <h3 className="font-bold text-gray-800 text-sm">{item.title}</h3>
                                            <p className="text-gray-500 font-bold text-[10px]">₹{item.price?.toFixed(2)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* --- TOTAL FOOTER --- */}
                        <div className="px-4 py-3 bg-gray-50 flex justify-between items-center border-t border-gray-100">
                            <div className="flex items-center gap-2 text-gray-500">
                                <Receipt size={14} />
                                <span className="text-[10px] font-bold uppercase tracking-wider">Total Amount</span>
                            </div>
                            <div className="text-blue-600 font-black text-lg">
                                ₹{calculateTotal(order.items).toFixed(2)}
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="text-center py-20 border-2 border-dashed border-gray-100 rounded-2xl">
                        <p className="text-gray-400 font-bold text-sm">No items found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOrders;