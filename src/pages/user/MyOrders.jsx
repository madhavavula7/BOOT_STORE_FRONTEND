import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Package, Calendar, ShoppingBag, Receipt, ChevronRight, ArrowLeft, Layers, Hash, BookOpen, Check, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useCart } from '../../context/CartContext'; // Ensure this path is correct

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBook, setSelectedBook] = useState(null); // Local state for Detailed View
    const [addedId, setAddedId] = useState(null); 
    const { addToCart } = useCart();
    
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    // Fetch user orders
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

    // Smooth scroll to top when a book is selected
    useEffect(() => {
        if (selectedBook) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [selectedBook]);

    const handleAddToCart = (book) => {
        const catalogBook = {
            id: book.bookId,
            title: book.title,
            price: book.price,
            imageUrl: book.imageUrl,
            author: book.author || 'Lokesh'
        };
        addToCart(catalogBook);
        setAddedId(book.bookId);
        setTimeout(() => setAddedId(null), 1500);
    };

    if (loading) return (
        <div className="p-10 text-center font-bold text-gray-400 uppercase text-xs tracking-widest animate-pulse">
            Loading your orders...
        </div>
    );

    // --- DETAILED VIEW (Matches your design screenshots) ---
    if (selectedBook) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-10">
                <button 
                    onClick={() => setSelectedBook(null)}
                    className="flex items-center gap-2 text-gray-400 hover:text-black mb-8 font-bold text-xs uppercase transition tracking-widest"
                >
                    <ArrowLeft size={14} strokeWidth={3} /> Back to History
                </button>

                <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-[40px] shadow-2xl shadow-gray-200/50 overflow-hidden border border-gray-100 flex flex-col md:flex-row min-h-[600px]"
                >
                    {/* Left Side: Pinned Image */}
                    <div className="md:w-[45%] bg-[#fcfcfc] flex items-center justify-center p-8 border-r border-gray-50">
                        <img 
                            src={selectedBook.imageUrl} 
                            alt={selectedBook.title} 
                            className="w-full h-full max-h-[500px] object-contain rounded-2xl drop-shadow-2xl"
                        />
                    </div>

                    {/* Right Side: Content Details */}
                    <div className="md:w-[55%] p-10 md:p-16 flex flex-col">
                        <div className="mb-8">
                            <span className="text-blue-600 font-black text-[11px] uppercase tracking-[0.25em] mb-4 block">Book Details</span>
                            <h1 className="text-5xl font-black text-gray-900 mb-2 tracking-tight leading-tight">
                                {selectedBook.title}
                            </h1>
                            <p className="text-2xl text-gray-400 font-medium italic">by {selectedBook.author || 'Lokesh'}</p>
                        </div>

                        <div className="mb-10">
                            <h4 className="text-gray-900 font-black text-[12px] uppercase tracking-widest mb-3">Description</h4>
                            <p className="text-gray-500 leading-relaxed text-lg font-medium max-w-xl">
                                {selectedBook.description || "A placeholder book for testing your UI."}
                            </p>
                        </div>
                        
                        {/* Information Grid */}
                        <div className="grid grid-cols-2 gap-6 mb-12 p-8 bg-[#f8f9fa] rounded-[32px] border border-gray-100">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white rounded-xl shadow-sm text-blue-600 border border-gray-100"><Layers size={22}/></div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Genre</p>
                                    <p className="text-base font-black text-gray-800">Story</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white rounded-xl shadow-sm text-blue-600 border border-gray-100"><Hash size={22}/></div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">ISBN</p>
                                    <p className="text-base font-black text-gray-800">00001</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white rounded-xl shadow-sm text-blue-600 border border-gray-100"><BookOpen size={22}/></div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Stock</p>
                                    <p className="text-base font-black text-gray-800">Available</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Price</p>
                                <p className="text-4xl font-black text-blue-600">₹{selectedBook.price}</p>
                            </div>
                        </div>

                        {/* Large "Order Again" Button */}
                        <div className="mt-auto">
                            <motion.button 
                                whileTap={{ scale: 0.97 }}
                                onClick={() => handleAddToCart(selectedBook)}
                                className={`w-full py-6 rounded-2xl font-black uppercase tracking-[0.1em] flex items-center justify-center gap-4 transition-all duration-300 shadow-2xl ${
                                    addedId === selectedBook.bookId 
                                    ? 'bg-green-600 text-white shadow-green-200' 
                                    : 'bg-black text-white hover:bg-gray-900 shadow-gray-300'
                                }`}
                            >
                                <AnimatePresence mode="wait">
                                    {addedId === selectedBook.bookId ? (
                                        <motion.span key="added" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2">
                                            <Check size={24} strokeWidth={3} /> Added to Cart
                                        </motion.span>
                                    ) : (
                                        <motion.span key="add" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                                            <ShoppingCart size={24} strokeWidth={2.5} /> Order Again
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    }

    // --- MAIN ORDERS LIST ---
    return (
        <div className="max-w-[80%] mx-auto px-4 py-8">
            <h1 className="text-xl font-black mb-8 text-gray-900 uppercase tracking-tight flex items-center gap-2">
                <ShoppingBag size={20} className="text-blue-600" /> My Purchases
            </h1>
            
            <div className="space-y-6">
                {orders.length > 0 ? orders.map((order) => (
                    <div key={order.orderId} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all">
                        {/* Header */}
                        <div className="p-4 flex justify-between items-center bg-gray-50/50 border-b border-gray-100 text-[10px] font-black uppercase text-gray-400">
                           <div className="flex gap-4">
                                <span className="text-blue-600 flex items-center gap-1">
                                    <Package size={14}/> {order.invoiceNumber || `#${order.orderId}`}
                                </span>
                                <span className="flex items-center gap-1 text-gray-300">
                                    <Calendar size={12}/> {new Date(order.orderDate).toLocaleDateString()}
                                </span>
                           </div>
                           <button 
                                onClick={() => navigate(`/invoice/${order.orderId}`, { state: { orderData: order } })} 
                                className="text-blue-600 hover:underline"
                           >
                                Invoice
                           </button>
                        </div>

                        {/* Clickable Items */}
                        <div className="p-2">
                            {order.items?.map((item, idx) => (
                                <div 
                                    key={idx} 
                                    onClick={() => setSelectedBook(item)} 
                                    className="flex items-center gap-4 p-3 hover:bg-gray-50 transition rounded-xl cursor-pointer group"
                                >
                                    <img src={item.imageUrl} className="w-10 h-12 object-cover rounded shadow-sm group-hover:scale-105 transition-transform" alt=""/>
                                    <div className="flex-1">
                                        <h3 className="font-black text-gray-800 text-sm group-hover:text-blue-600 transition-colors">{item.title}</h3>
                                        <p className="text-[10px] font-bold text-gray-400">Qty: {item.quantity} • ₹{item.price}</p>
                                    </div>
                                    <ChevronRight size={14} className="text-gray-200 group-hover:text-blue-400 transition-colors" />
                                </div>
                            ))}
                        </div>

                        {/* Footer */}
                        <div className="px-5 py-4 flex justify-between items-center border-t border-gray-50 bg-white">
                            <span className="text-lg font-black text-blue-600">₹{order.totalPrice?.toFixed(2)}</span>
                            <span className="text-[9px] font-black text-green-600 uppercase tracking-widest bg-green-50 px-3 py-1 rounded-full border border-green-100">
                                {order.orderStatus}
                            </span>
                        </div>
                    </div>
                )) : (
                    <div className="text-center py-20 border-2 border-dashed border-gray-100 rounded-3xl bg-gray-50/30">
                        <ShoppingBag className="mx-auto text-gray-200 mb-4" size={48} />
                        <p className="text-gray-400 font-bold">No orders found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOrders;