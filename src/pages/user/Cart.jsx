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
    const [isOrdered, setIsOrdered] = useState(false); // Success State
    
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
            pincode: address.pincode
        };
    
        try {
            const response = await axios.post('https://book-store-springboot.onrender.com/api/orders', orderRequest, {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (response.data.success) {
                setIsOrdered(true); // Trigger Green Screen
                clearCart();
            }
        } catch (err) {
            console.error("Order Error:", err.response?.data);
            toast.error(err.response?.data?.message || "Checkout failed. Please try again.");
        }
    };

    // 1. Success Screen View
    if (isOrdered) return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center animate-in fade-in zoom-in duration-500">
            <div className="relative mb-6">
                <div className="absolute inset-0 bg-green-100 rounded-full scale-150 animate-ping opacity-20"></div>
                <CheckCircle2 size={100} className="text-green-500 relative z-10" strokeWidth={1.5} />
            </div>
            <h1 className="text-4xl font-black text-gray-900 mb-2">Order Placed!</h1>
            <p className="text-gray-500 font-medium mb-8 max-w-xs">
                Your books are being prepared for shipment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
                <button 
                    onClick={() => navigate('/my-orders')}
                    className="flex-1 bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-black transition"
                >
                    View My Orders <ArrowRight size={18}/>
                </button>
                <button 
                    onClick={() => navigate('/catalog')}
                    className="flex-1 bg-white border border-gray-200 text-gray-600 px-8 py-4 rounded-2xl font-bold hover:bg-gray-50 transition"
                >
                    Keep Shopping
                </button>
            </div>
        </div>
    );

    // 2. Empty Cart View
    if (cart.length === 0) return (
        <div className="flex flex-col items-center justify-center h-96">
            <ShoppingBag size={48} className="text-gray-200 mb-4" />
            <h2 className="text-xl text-gray-600 font-medium">Your cart is empty</h2>
            <button onClick={() => navigate('/catalog')} className="mt-4 text-blue-600 font-bold hover:underline">
                Go to Catalog
            </button>
        </div>
    );

    // 3. Main Cart View
    return (
        <div className="max-w-6xl mx-auto p-6 md:p-10">
            <h1 className="text-3xl font-black mb-8 text-gray-900 flex items-center gap-3 tracking-tight">
                <ShoppingBag className="text-blue-600" /> Your Cart
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Items and Address */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="space-y-4">
                        {cart.map((item) => (
                            <div key={item.id} className="flex justify-between items-center bg-white p-5 rounded-3xl shadow-sm border border-gray-100 transition hover:border-blue-100">
                                <div className="flex items-center gap-5">
                                    <img src={item.imageUrl} alt={item.title} className="w-16 h-20 object-cover rounded-xl shadow-sm" />
                                    <div>
                                        <h3 className="font-bold text-gray-800 text-lg leading-tight">{item.title}</h3>
                                        <p className="text-blue-600 font-bold">₹{item.price}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-xl border border-gray-100">
                                        <button onClick={() => removeFromCart(item.id)} className="p-1 hover:bg-gray-200 rounded-lg transition"><Minus size={16}/></button>
                                        <span className="font-black w-6 text-center">{item.quantity}</span>
                                        <button onClick={() => item.quantity < item.stockQuantity && addToCart(item)} className="p-1 hover:bg-gray-200 rounded-lg transition"><Plus size={16}/></button>
                                    </div>
                                    <button onClick={() => deleteItem(item.id)} className="text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={20}/></button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100">
                        <h2 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                            <MapPin size={18} className="text-blue-600" /> Shipping Address
                        </h2>
                        <div className="space-y-4">
                            <textarea
                                name="shippingAddress"
                                placeholder="Full Address (House No, Street, Landmark)"
                                className="w-full p-4 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-blue-50 outline-none transition bg-white"
                                rows="3"
                                onChange={handleInputChange}
                                value={address.shippingAddress}
                            />
                            <div className="flex gap-4">
                                <select
                                    name="state"
                                    className="w-1/2 p-4 rounded-2xl border border-gray-200 outline-none focus:ring-4 focus:ring-blue-50 bg-white font-medium"
                                    onChange={handleInputChange}
                                    value={address.state}
                                >
                                    <option value="">Select State</option>
                                    {INDIAN_STATES.map(state => <option key={state} value={state}>{state}</option>)}
                                </select>
                                <input
                                    type="text"
                                    name="pincode"
                                    placeholder="6-digit Pincode"
                                    className="w-1/2 p-4 rounded-2xl border border-gray-200 outline-none focus:ring-4 focus:ring-blue-50 bg-white font-medium"
                                    onChange={handleInputChange}
                                    value={address.pincode}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Summary Section */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100 sticky top-10">
                        <h2 className="text-xl font-black text-gray-900 mb-6 tracking-tight">Summary</h2>
                        
                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-gray-500 font-bold text-sm uppercase tracking-widest">
                                <span>Subtotal</span>
                                <span className="text-gray-900">₹{subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-500 font-bold text-sm uppercase tracking-widest">
                                <span>GST (18%)</span>
                                <span className="text-gray-900">₹{gstAmount.toFixed(2)}</span>
                            </div>
                            <div className="border-t border-dashed pt-4 mt-4 flex justify-between items-end">
                                <div>
                                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Grand Total</p>
                                    <span className="text-3xl font-black text-gray-900">₹{total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        {token ? (
                            <button 
                                onClick={handleCheckout} 
                                className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-700 transition shadow-lg shadow-blue-200 transform active:scale-[0.98]"
                            >
                                Place Order Now
                            </button>
                        ) : (
                            <button onClick={() => navigate('/login')} className="w-full bg-gray-100 text-gray-500 py-5 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2">
                                <Lock size={18} /> Login to Checkout
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;