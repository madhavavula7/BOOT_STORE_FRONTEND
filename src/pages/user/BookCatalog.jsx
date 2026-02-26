import React, { useEffect, useState } from 'react';
import { getAllBooks } from '../../api/bookService';
import { useCart } from '../../context/CartContext';
import { ArrowLeft, ShoppingCart, BookOpen, Hash, Layers, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const BookCatalog = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBook, setSelectedBook] = useState(null);
    const [addedId, setAddedId] = useState(null); // Track click effect state
    const { addToCart } = useCart();

    useEffect(() => {
        getAllBooks()
            .then(res => {
                setBooks(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("API Error:", err);
                setLoading(false); 
            });
    }, []);

    // Function to handle the click animation logic
    const handleAddToCart = (book) => {
        addToCart(book);
        setAddedId(book.id);
        // Reset button state after 1.5 seconds
        setTimeout(() => setAddedId(null), 1500);
    };

    if (loading) return <div className="text-center mt-10 text-xl font-semibold text-gray-400 uppercase tracking-widest">Loading Books...</div>;

    // --- DETAILED VIEW ---
    if (selectedBook) {
        return (
            <div className="max-w-6xl mx-auto px-6 py-10">
                <button 
                    onClick={() => setSelectedBook(null)}
                    className="flex items-center gap-2 text-gray-500 hover:text-black mb-8 font-bold text-xs uppercase transition tracking-widest"
                >
                    <ArrowLeft size={14} strokeWidth={3} /> Back to Collection
                </button>

                <div className="bg-white rounded-[32px] shadow-2xl shadow-gray-200/50 overflow-hidden border border-gray-100 flex flex-col md:flex-row">
                    {/* Left Side: Image */}
                    <div className="md:w-1/2 bg-gray-50 flex items-center justify-center p-4">
                        <img 
                            src={selectedBook.imageUrl || 'https://via.placeholder.com/150'} 
                            alt={selectedBook.title} 
                            className="w-full max-h-[600px] object-contain rounded-xl shadow-lg"
                        />
                    </div>

                    {/* Right Side: Details */}
                    <div className="md:w-1/2 p-12 flex flex-col">
                        <div className="mb-6">
                            <span className="text-blue-600 font-black text-[10px] uppercase tracking-[0.2em] mb-3 block">Book Details</span>
                            <h1 className="text-4xl font-black text-gray-900 mb-2 leading-tight">{selectedBook.title}</h1>
                            <p className="text-xl text-gray-400 font-medium italic">by {selectedBook.author}</p>
                        </div>

                        {/* Description */}
                        <div className="mb-8">
                            <h4 className="text-gray-900 font-bold text-sm uppercase mb-2">Description</h4>
                            <p className="text-gray-600 leading-relaxed text-base">
                                {selectedBook.description || "No description available for this title."}
                            </p>
                        </div>
                        
                        {/* Specifications Grid */}
                        <div className="grid grid-cols-2 gap-6 mb-10 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white rounded-lg shadow-sm text-blue-600"><Layers size={18}/></div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase">Genre</p>
                                    <p className="text-sm font-bold text-gray-800">{selectedBook.genre || 'N/A'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white rounded-lg shadow-sm text-blue-600"><Hash size={18}/></div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase">ISBN</p>
                                    <p className="text-sm font-bold text-gray-800">{selectedBook.isbn || 'N/A'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white rounded-lg shadow-sm text-blue-600"><BookOpen size={18}/></div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase">Stock</p>
                                    <p className="text-sm font-bold text-gray-800">{selectedBook.stockQuantity} available</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase">Price</p>
                                <p className="text-2xl font-black text-blue-600">₹{selectedBook.price}</p>
                            </div>
                        </div>

                        {/* Click Effect Button (Detailed View) */}
                        <motion.button 
                            whileTap={{ scale: 0.97 }}
                            onClick={() => handleAddToCart(selectedBook)}
                            className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all duration-300 shadow-xl ${
                                addedId === selectedBook.id 
                                ? 'bg-green-600 text-white' 
                                : 'bg-black text-white hover:bg-gray-800'
                            }`}
                        >
                            <AnimatePresence mode="wait">
                                {addedId === selectedBook.id ? (
                                    <motion.span 
                                        key="added"
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -5 }}
                                        className="flex items-center gap-2"
                                    >
                                        <Check size={20} strokeWidth={3} /> Added to Cart
                                    </motion.span>
                                ) : (
                                    <motion.span 
                                        key="add"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="flex items-center gap-2"
                                    >
                                        <ShoppingCart size={20} /> Add to Cart
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </motion.button>
                    </div>
                </div>
            </div>
        );
    }

    // --- GRID VIEW ---
    return (
        <div className="max-w-[1400px] mx-auto px-4 py-10">
            <h1 className="text-2xl font-black mb-8 text-gray-900 uppercase tracking-tight">Our Collection</h1>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {books.map(book => (
                    <div 
                        key={book.id} 
                        onClick={() => setSelectedBook(book)}
                        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all cursor-pointer flex flex-col group"
                    >
                        <div className="relative h-48 overflow-hidden bg-gray-50">
                            <img 
                                src={book.imageUrl || 'https://via.placeholder.com/150'} 
                                alt={book.title} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                        </div>

                        <div className="p-3 flex flex-col flex-1">
                            <div className="mb-2">
                                <h3 className="font-bold text-gray-900 text-[11px] leading-tight line-clamp-1">{book.title}</h3>
                                <p className="text-gray-400 text-[10px] font-medium mt-1 uppercase tracking-tighter">{book.author}</p>
                            </div>

                            <div className="flex flex-col gap-2 mt-auto">
                                <span className="text-sm font-black text-blue-600">₹{book.price}</span>
                                
                                {/* Click Effect Button (Grid View) */}
                                <motion.button 
                                    whileTap={{ scale: 0.9 }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleAddToCart(book);
                                    }}
                                    className={`w-full py-1.5 rounded-md text-[10px] font-bold uppercase tracking-tighter transition-all duration-300 ${
                                        addedId === book.id 
                                        ? 'bg-green-600 text-white' 
                                        : 'bg-black text-white hover:bg-gray-800'
                                    }`}
                                >
                                    {addedId === book.id ? "Added!" : "Add to Cart"}
                                </motion.button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BookCatalog;