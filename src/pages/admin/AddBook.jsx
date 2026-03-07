import React, { useState } from 'react';
import { Save, ArrowLeft, Loader2, Image as ImageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const AddBook = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem('token');

    // These keys match your JSON exactly
    const [bookData, setBookData] = useState({
        title: '',
        author: '',
        genre: '',
        isbn: '',
        price: '',
        description: '',
        stockQuantity: '',
        imageUrl: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        // Convert numbers correctly for the backend
        const formattedValue = (name === 'price' || name === 'stockQuantity') ? Number(value) : value;
        setBookData(prev => ({ ...prev, [name]: formattedValue }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Path from your BookController: /api/books
            await axios.post('https://book-store-springboot.onrender.com/api/books', bookData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Book successfully added!");
            navigate('/admin-dashboard');
        } catch (err) {
            toast.error("Failed to add book. Check console for details.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-8">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 mb-8 font-black text-gray-400 hover:text-black uppercase text-[10px] tracking-widest">
                <ArrowLeft size={14} /> Back to Dashboard
            </button>

            <h1 className="text-4xl font-black mb-10 italic">ADD NEW BOOK</h1>

            <form onSubmit={handleSubmit} className="bg-white p-10 rounded-[2.5rem] border shadow-xl grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase">Image URL</label>
                    <input name="imageUrl" onChange={handleChange} className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-100" placeholder="https://..." />
                </div>

                <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase">Title</label>
                    <input required name="title" onChange={handleChange} className="w-full p-4 bg-gray-50 rounded-2xl outline-none" />
                </div>

                <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase">Author</label>
                    <input required name="author" onChange={handleChange} className="w-full p-4 bg-gray-50 rounded-2xl outline-none" />
                </div>

                <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase">Genre</label>
                    <input required name="genre" onChange={handleChange} className="w-full p-4 bg-gray-50 rounded-2xl outline-none" />
                </div>

                <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase">ISBN</label>
                    <input required name="isbn" onChange={handleChange} className="w-full p-4 bg-gray-50 rounded-2xl outline-none" />
                </div>

                <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase">Price (₹)</label>
                    <input required type="number" name="price" onChange={handleChange} className="w-full p-4 bg-gray-50 rounded-2xl outline-none" />
                </div>

                <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase">Stock Quantity</label>
                    <input required type="number" name="stockQuantity" onChange={handleChange} className="w-full p-4 bg-gray-50 rounded-2xl outline-none" />
                </div>

                <div className="md:col-span-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase">Description</label>
                    <textarea name="description" rows="3" onChange={handleChange} className="w-full p-4 bg-gray-50 rounded-2xl outline-none resize-none" />
                </div>

                <button disabled={loading} type="submit" className="md:col-span-2 bg-slate-900 text-white py-5 rounded-3xl font-black text-lg hover:bg-emerald-600 transition-all flex items-center justify-center gap-3">
                    {loading ? <Loader2 className="animate-spin" /> : <Save />}
                    SAVE TO CATALOG
                </button>
            </form>
        </div>
    );
};

export default AddBook;