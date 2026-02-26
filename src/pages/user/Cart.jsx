import React from 'react';
import { useCart } from '../../context/CartContext';
import { Trash2, Lock, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const Cart = () => {
    const { cart, removeFromCart, clearCart } = useCart();
    const navigate = useNavigate();
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    const token = localStorage.getItem('token');

    const handleCheckout = async () => {
        // Constructing the nested items array your DTO expects
        const orderRequest = {
            items: cart.map(book => ({
                bookId: book.id,
                quantity: 1 
            }))
        };
    
        try {
            const response = await axios.post('http://localhost:8080/api/orders', orderRequest, {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.data.success) {
                toast.success("Order Placed Successfully! 🚀");
                clearCart();
                // Redirecting to history so they see their purchase
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
                {cart.map((item, index) => (
                    <div key={index} className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
                        <div className="flex items-center gap-4">
                            <img src={item.imageUrl} alt={item.title} className="w-16 h-16 object-cover rounded-xl" />
                            <div>
                                <h3 className="font-bold text-gray-800">{item.title}</h3>
                                <p className="text-blue-600 text-sm font-bold">₹{item.price}</p>
                            </div>
                        </div>
                        <button onClick={() => removeFromCart(index)} className="text-red-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition">
                            <Trash2 size={20} />
                        </button>
                    </div>
                ))}
            </div>

            <div className="mt-8 border-t pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <p className="text-xs text-gray-400 uppercase font-black tracking-widest">Grand Total</p>
                    <span className="text-3xl font-black text-gray-900">₹{total.toFixed(2)}</span>
                </div>

                {token ? (
                    <button onClick={handleCheckout} className="w-full md:w-auto bg-blue-600 text-white px-12 py-4 rounded-2xl font-black hover:bg-blue-700 transition shadow-lg shadow-blue-200">
                        PLACE ORDER NOW
                    </button>
                ) : (
                    <button onClick={() => navigate('/login')} className="w-full md:w-auto bg-gray-100 text-gray-600 px-10 py-4 rounded-2xl font-bold hover:bg-gray-200 flex items-center gap-2">
                        <Lock size={18} /> Login to Checkout
                    </button>
                )}
            </div>
        </div>
    );
};

export default Cart;