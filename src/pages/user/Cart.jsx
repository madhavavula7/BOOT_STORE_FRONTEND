import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { Trash2, Lock, ShoppingBag, MapPin, Plus, Minus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

// Array of all Indian States and Union Territories
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
    const { cart, removeFromCart, addToCart, clearCart } = useCart();
    const navigate = useNavigate();
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const token = localStorage.getItem('token');

    const [address, setAddress] = useState({
        shippingAddress: '',
        state: '',
        pincode: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        // Custom logic for Pincode: Only numbers and max 6 digits
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

        // Validation for Pincode length
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
                toast.success("Order Placed Successfully! 🚀");
                clearCart();
                navigate('/my-orders');
            }
        } catch (err) {
            console.error("Order Error:", err.response?.data);
            toast.error(err.response?.data?.message || "Checkout failed. Please try again.");
        }
    };

    if (cart.length === 0) return (
        <div className="flex flex-col items-center justify-center h-96">
            <h2 className="text-xl text-gray-600 font-medium">Your cart is empty</h2>
            <button onClick={() => navigate('/catalog')} className="mt-4 text-blue-600 font-bold hover:underline">
                Go to Catalog
            </button>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto p-10">
            <h1 className="text-3xl font-black mb-6 text-gray-900 flex items-center gap-2">
                <ShoppingBag /> Your Cart
            </h1>
            
            <div className="space-y-4">
                {cart.map((item) => (
                    <div key={item.id} className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-4">
                            <img src={item.imageUrl} alt={item.title} className="w-16 h-16 object-cover rounded-xl" />
                            <div>
                                <h3 className="font-bold text-gray-800">{item.title}</h3>
                                <p className="text-blue-600 text-sm font-bold">₹{item.price}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-xl">
                            <button 
                                onClick={() => removeFromCart(item.id)}
                                className="p-1 hover:bg-gray-200 rounded-md transition"
                            >
                                <Minus size={16} />
                            </button>
                            <span className="font-bold w-6 text-center">{item.quantity}</span>
                            <button 
                                onClick={() => addToCart(item)}
                                className="p-1 hover:bg-gray-200 rounded-md transition"
                            >
                                <Plus size={16} />
                            </button>
                        </div>

                        <div className="hidden md:block">
                            <p className="text-sm text-gray-400">Subtotal</p>
                            <p className="font-bold">₹{(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-10 bg-gray-50 p-6 rounded-2xl border border-gray-200">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <MapPin size={20} className="text-blue-600" /> Delivery Address
                </h2>
                <div className="space-y-4">
                    <textarea
                        name="shippingAddress"
                        placeholder="Full Address (House No, Street, Landmark)"
                        className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition"
                        rows="3"
                        onChange={handleInputChange}
                        value={address.shippingAddress}
                    />
                    <div className="flex gap-4">
                        <select
                            name="state"
                            className="w-1/2 p-3 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            onChange={handleInputChange}
                            value={address.state}
                        >
                            <option value="">Select State</option>
                            {INDIAN_STATES.map(state => (
                                <option key={state} value={state}>{state}</option>
                            ))}
                        </select>
                        <input
                            type="text"
                            name="pincode"
                            placeholder="6-digit Pincode"
                            className="w-1/2 p-3 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={handleInputChange}
                            value={address.pincode}
                        />
                    </div>
                </div>
            </div>

            <div className="mt-8 border-t pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <p className="text-xs text-gray-400 uppercase font-black tracking-widest">Grand Total</p>
                    <span className="text-3xl font-black text-gray-900">₹{total.toFixed(2)}</span>
                </div>

                {token ? (
                    <button 
                        onClick={handleCheckout} 
                        className="w-full md:w-auto bg-blue-600 text-white px-12 py-4 rounded-2xl font-black hover:bg-blue-700 transition"
                    >
                        PLACE ORDER NOW
                    </button>
                ) : (
                    <button onClick={() => navigate('/login')} className="w-full md:w-auto bg-gray-100 text-gray-600 px-10 py-4 rounded-2xl font-bold">
                        <Lock size={18} /> Login to Checkout
                    </button>
                )}
            </div>
        </div>
    );
};

export default Cart;