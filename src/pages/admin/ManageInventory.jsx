import React, { useEffect, useState } from 'react';
import { Save, ArrowLeft, Loader2, Image as ImageIcon, Plus, Minus, Link as LinkIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const ManageInventory = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const fetchInventory = async () => {
        try {
            setLoading(true);
            const res = await axios.get('https://book-store-springboot.onrender.com/api/admin/inventory', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBooks(res.data);
        } catch (err) {
            toast.error("Failed to load inventory");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInventory();
    }, []);

    const handleInputChange = (id, field, value) => {
        setBooks(prev => prev.map(book => 
            book.id === id ? { ...book, [field]: value } : book
        ));
    };

    const adjustStock = (id, amount) => {
        setBooks(prev => prev.map(book => 
            book.id === id ? { ...book, stockQuantity: Math.max(0, (parseInt(book.stockQuantity) || 0) + amount) } : book
        ));
    };

    const handleBulkSave = async () => {
        try {
            setSaving(true);
            await axios.put(
                'https://book-store-springboot.onrender.com/api/admin/inventory/bulk-update',
                books,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("All changes synced to Database!");
            navigate('/admin-dashboard');
        } catch (err) {
            toast.error("Update failed. Check your API connection.");
        } finally {
            setSaving(false);
        }
    };

    const filteredBooks = books.filter(book => 
        book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.genre?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-[80vh] gap-4">
            <Loader2 className="animate-spin text-blue-600" size={48} />
            <p className="font-black text-gray-400 text-xs tracking-widest uppercase">Loading Full Metadata...</p>
        </div>
    );

    return (
        <div className="max-w-[1600px] mx-auto p-4 md:p-8 mb-20">
            {/* Header */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 mb-10">
                <div>
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 font-black text-gray-400 hover:text-blue-600 transition-colors mb-2 uppercase text-[10px] tracking-widest">
                        <ArrowLeft size={14} /> Back to Dashboard
                    </button>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tighter">Inventory Control</h1>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
                    <input 
                        type="text" 
                        placeholder="Search books..." 
                        className="w-full sm:w-80 p-4 rounded-2xl border border-gray-200 shadow-sm focus:ring-4 focus:ring-blue-50 outline-none font-bold"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button 
                        onClick={handleBulkSave} 
                        disabled={saving}
                        className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black flex items-center gap-2 hover:bg-blue-600 transition-all shadow-xl disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                        Save All Changes
                    </button>
                </div>
            </div>

            {/* Master Table */}
            <div className="bg-white rounded-[3rem] border border-gray-100 shadow-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[1400px]">
                        <thead className="bg-gray-50/50 border-b border-gray-100">
                            <tr className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                                <th className="p-8">Cover & URL Source</th>
                                <th className="p-8">Title & Author</th>
                                <th className="p-8">Genre</th>
                                <th className="p-8">Price (₹)</th>
                                <th className="p-8">Stock Level</th>
                                <th className="p-8">Description</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredBooks.map(book => (
                                <tr key={book.id} className="hover:bg-blue-50/20 transition-all group">
                                    {/* IMAGE URL EDITING SECTION */}
                                    <td className="p-6">
                                        <div className="flex flex-col items-center gap-4 w-64">
                                            <div className="relative w-20 h-28">
                                                <img 
                                                    src={book.imageUrl} 
                                                    className="w-full h-full object-cover rounded-xl shadow-lg border-2 border-white group-hover:scale-105 transition-transform" 
                                                    alt="Preview"
                                                    onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=Invalid+URL'; }}
                                                />
                                            </div>
                                            <div className="w-full relative">
                                                <span className="text-[9px] font-black text-gray-400 absolute -top-4 left-0">IMAGE URL</span>
                                                <textarea 
                                                    value={book.imageUrl || ''}
                                                    onChange={(e) => handleInputChange(book.id, 'imageUrl', e.target.value)}
                                                    className="w-full text-[10px] p-2 bg-gray-50 border border-transparent hover:border-gray-200 rounded-lg h-16 outline-none focus:bg-white focus:ring-2 focus:ring-blue-100 font-mono resize-none leading-tight"
                                                    placeholder="Paste new image link..."
                                                />
                                            </div>
                                        </div>
                                    </td>

                                    {/* TITLE & AUTHOR */}
                                    <td className="p-6">
                                        <div className="flex flex-col gap-2">
                                            <input 
                                                type="text" 
                                                value={book.title || ''}
                                                onChange={(e) => handleInputChange(book.id, 'title', e.target.value)}
                                                className="font-black text-gray-800 p-1 w-full outline-none focus:bg-blue-50 rounded text-lg tracking-tight"
                                            />
                                            <input 
                                                type="text" 
                                                value={book.author || ''}
                                                onChange={(e) => handleInputChange(book.id, 'author', e.target.value)}
                                                className="text-xs text-gray-400 font-bold p-1 w-full outline-none focus:bg-blue-50 rounded"
                                            />
                                        </div>
                                    </td>

                                    {/* GENRE */}
                                    <td className="p-6">
                                        <input 
                                            type="text" 
                                            value={book.genre || ''}
                                            onChange={(e) => handleInputChange(book.id, 'genre', e.target.value)}
                                            className="text-xs font-black uppercase text-blue-600 bg-blue-50/50 p-2 px-3 border border-transparent hover:border-blue-200 rounded-xl w-full outline-none text-center"
                                        />
                                    </td>

                                    {/* PRICE */}
                                    <td className="p-6">
                                        <input 
                                            type="number" 
                                            value={book.price || 0}
                                            onChange={(e) => handleInputChange(book.id, 'price', parseFloat(e.target.value))}
                                            className="font-black text-gray-900 p-3 bg-gray-50 border border-transparent rounded-xl w-24 text-center focus:bg-white"
                                        />
                                    </td>

                                    {/* STOCK QUANTITY */}
                                    <td className="p-6">
                                        <div className="flex items-center justify-center gap-2">
                                            <button onClick={() => adjustStock(book.id, -1)} className="p-1 text-gray-300 hover:text-red-500"><Minus size={16} /></button>
                                            <input 
                                                type="number" 
                                                value={book.stockQuantity || 0}
                                                onChange={(e) => handleInputChange(book.id, 'stockQuantity', parseInt(e.target.value))}
                                                className={`font-black p-3 border rounded-xl w-20 text-center ${book.stockQuantity < 10 ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-gray-50 border-transparent'}`}
                                            />
                                            <button onClick={() => adjustStock(book.id, 5)} className="p-1 text-gray-300 hover:text-emerald-500"><Plus size={16} /></button>
                                        </div>
                                    </td>

                                    {/* DESCRIPTION */}
                                    <td className="p-6">
                                        <textarea 
                                            value={book.description || ''}
                                            onChange={(e) => handleInputChange(book.id, 'description', e.target.value)}
                                            className="text-xs text-gray-500 p-3 bg-gray-50 rounded-xl w-72 h-24 outline-none resize-none font-medium leading-relaxed focus:bg-white transition-all shadow-inner border border-transparent focus:border-gray-100"
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManageInventory;