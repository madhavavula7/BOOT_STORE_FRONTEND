import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Package, Calendar, ShoppingBag, Receipt, ChevronRight, ArrowLeft, Layers, Hash, BookOpen, Check, ShoppingCart, RefreshCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useCart } from '../../context/CartContext';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBook, setSelectedBook] = useState(null); 
    const [addedId, setAddedId] = useState(null); 
    const { addToCart } = useCart();
    const navigate = useNavigate();

    const fetchOrders = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const response = await axios.get('https://book-store-springboot.onrender.com/api/orders/my', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.data && response.data.success) {
                setOrders(response.data.data);
            }
        } catch (err) {
            console.error("Fetch error:", err);
            toast.error("Unable to reach the server. It might be waking up.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const handleAddToCart = (book) => {
        const catalogBook = {
            id: book.bookId, 
            title: book.title,
            price: book.price,
            imageUrl: book.imageUrl,
            author: book.author
        };
        addToCart(catalogBook);
        setAddedId(book.bookId);
        setTimeout(() => setAddedId(null), 1500);
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 gap-4 text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Loading Your Library...</p>
        </div>
    );

    if (selectedBook) {
        return (
            <div className="w-full max-w-7xl mx-auto px-4 py-6 md:py-10">
                <button 
                    onClick={() => setSelectedBook(null)} 
                    className="flex items-center gap-2 text-gray-400 hover:text-black mb-6 font-black text-[10px] uppercase tracking-widest outline-none"
                >
                    <ArrowLeft size={14} strokeWidth={3} /> Back to History
                </button>
                <motion.div 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] shadow-2xl border border-gray-100 flex flex-col md:flex-row overflow-hidden"
                >
                    <div className="w-full md:w-5/12 lg:w-1/2 bg-[#fcfcfc] p-6 md:p-8 flex justify-center items-center border-b md:border-b-0 md:border-r border-gray-100">
                        <img 
                            src={selectedBook.imageUrl} 
                            className="w-full max-w-[180px] sm:max-w-[250px] md:max-w-[400px] h-auto object-contain drop-shadow-2xl" 
                            alt={selectedBook.title}
                        />
                    </div>
                    <div className="w-full md:w-7/12 lg:w-1/2 p-6 sm:p-8 md:p-12 lg:p-16 flex flex-col">
                    <p className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase">Title</p>
                        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-2 leading-tight">
                            {selectedBook.title}
                        </h1>
                        <p className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase">author</p>
                        <p className="text-lg sm:text-xl text-gray-400 mb-6 md:mb-8 italic">by {selectedBook.author}</p>
                        <p className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase">description</p>
                        <p className="text-gray-500 mb-6 md:mb-8 leading-relaxed text-sm sm:text-base">
                            {selectedBook.description}
                        </p>
                        <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-8 md:mb-10">
                            <div className="p-3 sm:p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <p className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase">Price</p>
                                <p className="text-xl sm:text-2xl font-black text-blue-600">₹{selectedBook.price}</p>
                            </div>
                            <div className="p-3 sm:p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <p className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase">Genre</p>
                                <p className="text-xs sm:text-sm font-black text-gray-800 uppercase truncate">{selectedBook.genre}</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => handleAddToCart(selectedBook)} 
                            className={`w-full py-4 sm:py-5 rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-lg active:scale-95 ${addedId === selectedBook.bookId ? 'bg-green-600 text-white' : 'bg-black text-white hover:bg-gray-800'}`}
                        >
                            {addedId === selectedBook.bookId ? 'Added to Cart' : 'Order Again'}
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl mx-auto px-4 py-8 md:py-12">
            <div className="flex justify-between items-center mb-8 md:mb-10">
                <h1 className="text-xl sm:text-2xl font-black text-gray-900 uppercase tracking-tighter flex items-center gap-3">
                    <ShoppingBag size={24} className="text-blue-600 hidden sm:block" /> My Purchases
                </h1>
                <button 
                    onClick={fetchOrders} 
                    className="p-2.5 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors"
                    title="Refresh Orders"
                >
                    <RefreshCcw size={18} className="text-gray-500"/>
                </button>
            </div>
            
            {orders.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-[2rem] border border-dashed border-gray-200">
                    <p className="text-sm font-black text-gray-400 uppercase tracking-widest">No orders found yet</p>
                </div>
            ) : (
                <div className="flex flex-col gap-6 md:gap-8">
                    {orders.map((order) => (
                        <div key={order.orderId} className="bg-white rounded-[1.5rem] md:rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                            <div className="p-4 sm:p-5 bg-gray-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 border-b border-gray-100">
                                <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-[9px] sm:text-[10px] font-black uppercase text-gray-400">
                                    <span className="text-blue-600 bg-blue-50 px-2 py-1 rounded-md flex items-center gap-1">
                                        <Package size={12}/> {order.invoiceNumber}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Calendar size={12}/> {new Date(order.orderDate).toLocaleDateString()}
                                    </span>
                                </div>
                                <button 
                                    onClick={() => navigate(`/invoice/${order.orderId}`, { state: { orderData: order } })} 
                                    className="text-[10px] font-black uppercase text-blue-600 hover:bg-blue-50 px-3 py-1 rounded-md transition-colors"
                                >
                                    Invoice
                                </button>
                            </div>
                            
                            <div className="p-2 sm:p-3">
                                {order.items.map((item, idx) => (
                                    <div 
                                        key={idx} 
                                        onClick={() => setSelectedBook(item)} 
                                        className="flex items-center gap-4 sm:gap-5 p-3 sm:p-4 hover:bg-gray-50 rounded-[1rem] sm:rounded-[1.5rem] cursor-pointer group transition-all"
                                    >
                                        <img 
                                            src={item.imageUrl} 
                                            className="w-10 h-14 sm:w-12 sm:h-16 object-cover rounded-lg shadow-md flex-shrink-0" 
                                            alt=""
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-black text-gray-800 text-xs sm:text-base truncate group-hover:text-blue-600 transition-colors">
                                                {item.title}
                                            </h3>
                                            <p className="text-[9px] sm:text-[10px] text-gray-400 font-bold uppercase mt-0.5 sm:mt-1">
                                                Qty: {item.quantity} • Unit: ₹{item.price}
                                            </p>
                                        </div>
                                        <ChevronRight size={16} className="text-gray-200 group-hover:text-blue-400 transform group-hover:translate-x-1 transition-all" />
                                    </div>
                                ))}
                            </div>
                            
                            <div className="px-5 sm:px-8 py-4 sm:py-5 border-t border-gray-50 flex justify-between items-center">
                                <div className="flex flex-col">
                                    <span className="text-[7px] sm:text-[8px] font-black text-gray-400 uppercase tracking-widest">Total Amount Paid</span>
                                    <span className="text-lg sm:text-xl font-black text-gray-900">₹{order.totalPrice.toFixed(2)}</span>
                                </div>
                                <span className={`text-[8px] sm:text-[9px] font-black uppercase px-3 sm:px-4 py-1.5 rounded-full border ${
                                    order.orderStatus === 'DELIVERED' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                                }`}>
                                    {order.orderStatus}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyOrders;