import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { Trash2, Lock, ShoppingBag, MapPin, Plus, Minus, CheckCircle2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const INDIAN_STATES = [
    "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", 
    "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", 
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", 
    "Karnataka", "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", 
    "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", 
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", 
    "Uttarakhand", "West Bengal"
];

const Cart = () => {
    const { cart, removeFromCart, addToCart, clearCart, deleteItem } = useCart();
    const navigate = useNavigate();
    const [isOrdered, setIsOrdered] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const gstAmount = subtotal * 0.18;
    const total = subtotal + gstAmount;
    const token = localStorage.getItem('token');

    const [address, setAddress] = useState({
        shippingAddress: '',
        state: '',
        pincode: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'pincode') {
            const numericValue = value.replace(/\D/g, '').slice(0, 6);
            setAddress({ ...address, [name]: numericValue });
        } else {
            setAddress({ ...address, [name]: value });
        }
    };

    const handleCheckout = async () => {
        if (!address.shippingAddress || !address.state || !address.pincode) {
            toast.error("Please provide a complete delivery address!");
            return;
        }
        if (address.pincode.length !== 6) {
            toast.error("Pincode must be 6 digits!");
            return;
        }

        const orderRequest = {
            items: cart.map(book => ({
                bookId: book.id,
                quantity: book.quantity 
            })),
            shippingAddress: address.shippingAddress,
            billingAddress: address.shippingAddress,
            state: address.state,
            pincode: parseInt(address.pincode), // CONVERTED TO NUMBER
            totalPrice: total,
            taxAmount: gstAmount,
            netAmount: subtotal
        };
    
        try {
            setLoading(true);
            const response = await axios.post('https://book-store-springboot.onrender.com/api/orders', orderRequest, {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.success) {
                setIsOrdered(true);
                clearCart();
                toast.success("Order successful!");
            }
        } catch (err) {
            console.error("Order Error Details:", err.response?.data);
            const errorMsg = err.response?.data?.message || "Checkout failed. Check your connection.";
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    if (isOrdered) return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-10 text-center">
            <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                <CheckCircle2 size={100} className="text-green-500 mb-6" strokeWidth={1.5} />
            </motion.div>
            <h1 className="text-4xl font-black text-gray-900 mb-2">Order Confirmed!</h1>
            <p className="text-gray-500 mb-8">Your literary journey begins soon.</p>
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
                <button onClick={() => navigate('/my-orders')} className="flex-1 bg-black text-white px-6 py-4 rounded-2xl font-bold flex items-center justify-center gap-2">
                    Order History <ArrowRight size={18}/>
                </button>
            </div>
        </div>
    );

    if (cart.length === 0) return (
        <div className="flex flex-col items-center justify-center h-[60vh]">
            <ShoppingBag size={64} className="text-gray-100 mb-4" />
            <h2 className="text-xl text-gray-400 font-black uppercase tracking-widest">Your cart is empty</h2>
            <button onClick={() => navigate('/catalog')} className="mt-6 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold">Browse Books</button>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto p-4 sm:p-10">
            <h1 className="text-3xl font-black mb-10 text-gray-900 flex items-center gap-3">
                <ShoppingBag className="text-blue-600" size={32} /> Checkout
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-8">
                    {/* Cart Items */}
                    <div className="space-y-4">
                        {cart.map((item) => (
                            <div key={item.id} className="flex items-center justify-between bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
                                <div className="flex items-center gap-4">
                                    <img src={item.imageUrl} className="w-16 h-20 object-cover rounded-xl shadow-md" alt="" />
                                    <div>
                                        <h3 className="font-black text-gray-800 text-base">{item.title}</h3>
                                        <p className="text-blue-600 font-bold">₹{item.price}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-3 bg-gray-50 px-3 py-1.5 rounded-xl border">
                                        <button onClick={() => removeFromCart(item.id)} className="text-gray-400"><Minus size={14}/></button>
                                        <span className="font-black text-sm">{item.quantity}</span>
                                        <button onClick={() => addToCart(item)} className="text-gray-400"><Plus size={14}/></button>
                                    </div>
                                    <button onClick={() => deleteItem(item.id)} className="text-gray-200 hover:text-red-500 transition-colors"><Trash2 size={20}/></button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Address Form */}
                    <div className="bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100">
                        <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <MapPin size={18} className="text-blue-600" /> Delivery Information
                        </h2>
                        <div className="space-y-4">
                            <textarea
                                name="shippingAddress"
                                placeholder="Full Delivery Address"
                                className="w-full p-5 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-blue-50 outline-none transition"
                                rows="3"
                                value={address.shippingAddress}
                                onChange={handleInputChange}
                            />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <select
                                    name="state"
                                    className="p-5 rounded-2xl border border-gray-200 outline-none bg-white font-bold text-gray-700"
                                    value={address.state}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select State</option>
                                    {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                                <input
                                    type="text"
                                    name="pincode"
                                    placeholder="Pincode (6 digits)"
                                    className="p-5 rounded-2xl border border-gray-200 outline-none bg-white font-bold"
                                    value={address.pincode}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-gray-100 sticky top-10">
                        <h2 className="text-xl font-black mb-6">Order Summary</h2>
                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-xs font-black text-gray-400 uppercase tracking-widest">
                                <span>Items Total</span>
                                <span className="text-gray-900">₹{subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-xs font-black text-gray-400 uppercase tracking-widest">
                                <span>Tax (GST 18%)</span>
                                <span className="text-gray-900">₹{gstAmount.toFixed(2)}</span>
                            </div>
                            <div className="pt-6 border-t border-dashed">
                                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Grand Total</p>
                                <p className="text-4xl font-black text-gray-900">₹{total.toFixed(2)}</p>
                            </div>
                        </div>

                        <button 
                            disabled={loading}
                            onClick={handleCheckout} 
                            className={`w-full py-5 rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-xl ${
                                loading ? 'bg-gray-400' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-100'
                            }`}
                        >
                            {loading ? 'Processing...' : 'Complete Purchase'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;