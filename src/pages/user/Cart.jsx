import React, { useState, useEffect } from 'react'; 
import { useCart } from '../../context/CartContext';
import { Trash2, Lock, ShoppingBag, MapPin, Plus, Minus, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
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
    
    const token = localStorage.getItem('token');
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const gstAmount = subtotal * 0.18;
    const total = subtotal + gstAmount;

    // This clears the "ghost items" if the user logs out
    useEffect(() => {
        if (!token && cart.length > 0) {
            clearCart();
        }
    }, [token, cart.length, clearCart]);

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
        
        const orderRequest = {
            items: cart.map(book => ({ bookId: book.id, quantity: book.quantity })),
            shippingAddress: address.shippingAddress,
            billingAddress: address.shippingAddress,
            state: address.state,
            pincode: parseInt(address.pincode),
            totalPrice: total,
            taxAmount: gstAmount,
            netAmount: subtotal
        };
    
        try {
            setLoading(true);
            const response = await axios.post('https://book-store-springboot.onrender.com/api/orders', orderRequest, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.data.success) {
                setIsOrdered(true);
                clearCart();
                toast.success("Order successful!");
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Checkout failed.");
        } finally {
            setLoading(false);
        }
    };

    if (isOrdered) return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
            <CheckCircle2 size={100} className="text-green-500 mb-6" />
            <h1 className="text-4xl font-black mb-2">Order Confirmed!</h1>
            <button onClick={() => navigate('/my-orders')} className="mt-4 bg-black text-white px-8 py-4 rounded-2xl font-bold">
                Order History
            </button>
        </div>
    );

    if (cart.length === 0) return (
        <div className="flex flex-col items-center justify-center h-[60vh]">
            <ShoppingBag size={64} className="text-gray-200 mb-4" />
            <h2 className="text-xl text-gray-400 font-black uppercase">Your cart is empty</h2>
            <button onClick={() => navigate('/catalog')} className="mt-6 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold">Browse Books</button>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto p-4 sm:p-10">
            <h1 className="text-3xl font-black mb-10 flex items-center gap-3">
                <ShoppingBag className="text-blue-600" size={32} /> Checkout
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-8">
                    {cart.map((item) => (
                        <div key={item.id} className="flex items-center justify-between bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
                            <div className="flex items-center gap-4">
                                <img src={item.imageUrl} className="w-16 h-20 object-cover rounded-xl shadow-md" alt="" />
                                <div>
                                    <h3 className="font-black text-gray-800">{item.title}</h3>
                                    <p className="text-blue-600 font-bold">₹{item.price}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-3 bg-gray-50 px-3 py-1.5 rounded-xl border">
                                    <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-black"><Minus size={14}/></button>
                                    <span className="font-black">{item.quantity}</span>
                                    <button onClick={() => addToCart(item)} className="text-gray-400 hover:text-black"><Plus size={14}/></button>
                                </div>
                                <button onClick={() => deleteItem(item.id)} className="text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={20}/></button>
                            </div>
                        </div>
                    ))}
                    
                    <div className="bg-gray-50 p-6 rounded-[2.5rem] border border-gray-100">
                        <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <MapPin size={18} className="text-blue-600" /> Delivery Information
                        </h2>
                        <textarea
                            name="shippingAddress"
                            placeholder="Full Delivery Address"
                            className="w-full p-5 rounded-2xl border border-gray-200 outline-none mb-4"
                            rows="3"
                            value={address.shippingAddress}
                            onChange={handleInputChange}
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <select name="state" className="p-5 rounded-2xl border border-gray-200 bg-white font-bold" value={address.state} onChange={handleInputChange}>
                                <option value="">Select State</option>
                                {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                            <input name="pincode" placeholder="Pincode" className="p-5 rounded-2xl border border-gray-200 font-bold" value={address.pincode} onChange={handleInputChange} />
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl sticky top-24">
                        <h2 className="text-xl font-black mb-6">Order Summary</h2>
                        <div className="flex justify-between mb-2 text-gray-500 text-xs font-black uppercase"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
                        <div className="flex justify-between mb-6 text-gray-500 text-xs font-black uppercase"><span>GST (18%)</span><span>₹{gstAmount.toFixed(2)}</span></div>
                        <div className="border-t border-dashed pt-4 mb-8">
                            <p className="text-4xl font-black">₹{total.toFixed(2)}</p>
                        </div>
                        <button 
                            disabled={loading || !token}
                            onClick={handleCheckout}
                            className={`w-full py-5 rounded-2xl font-black uppercase text-xs tracking-widest transition-all ${
                                loading || !token ? 'bg-gray-100 text-gray-400' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-xl'
                            }`}
                        >
                            {loading ? <Loader2 className="animate-spin mx-auto" /> : 'Complete Purchase'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;