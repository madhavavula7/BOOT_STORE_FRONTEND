import React, { useEffect, useState } from 'react';
import { getAllBooks } from '../../api/bookService';
import { useCart } from '../../context/CartContext';
import { ArrowLeft, ShoppingCart, BookOpen, Layers, Check, Search, X } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const BookCatalog = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBook, setSelectedBook] = useState(null);
    const [addedId, setAddedId] = useState(null); 
    const [searchTerm, setSearchTerm] = useState(""); 
    const { addToCart, cart } = useCart();

    const shuffleArray = (array) => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        getAllBooks()
            .then(res => {
                let finalBooks = res.data;
                if (token) {
                    const sessionBooks = sessionStorage.getItem('shuffled_collection');
                    if (sessionBooks) {
                        finalBooks = JSON.parse(sessionBooks);
                    } else {
                        finalBooks = shuffleArray(res.data);
                        sessionStorage.setItem('shuffled_collection', JSON.stringify(finalBooks));
                    }
                }
                setBooks(finalBooks);
                setLoading(false);
            })
            .catch(err => {
                console.error("API Error:", err);
                setLoading(false); 
            });
    }, []);
    

    const handleAddToCart = (book) => {
        const cartItem = cart.find(item => item.id === book.id);
        const currentQtyInCart = cartItem ? cartItem.quantity : 0;

        if (currentQtyInCart >= book.stockQuantity) {
            toast.error("Cannot add more! Stock limit reached.");
            return;
        }

        addToCart(book);
        setAddedId(book.id);
        setTimeout(() => setAddedId(null), 1500);
    };

    const filteredBooks = books.filter(book => 
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.genre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="flex justify-center items-center min-h-[60vh] text-gray-400 font-bold tracking-widest uppercase">Loading Books...</div>;

    if (selectedBook) {
        const cartItem = cart.find(item => item.id === selectedBook.id);
        const isOutOfStock = selectedBook.stockQuantity <= 0;
        const isLimitReached = cartItem && cartItem.quantity >= selectedBook.stockQuantity;

        return (
            <div className="max-w-6xl mx-auto px-4 md:px-6 py-4 md:py-10">
                <button 
                    onClick={() => setSelectedBook(null)}
                    className="flex items-center gap-2 text-gray-500 hover:text-black mb-6 font-bold text-[10px] md:text-xs uppercase tracking-widest transition"
                >
                    <ArrowLeft size={14} strokeWidth={3} /> Back to Collection
                </button>

                <div className="bg-white rounded-[24px] md:rounded-[32px] shadow-2xl overflow-hidden border border-gray-100 flex flex-col md:flex-row">
                    <div className="w-full md:w-1/2 bg-gray-50 flex items-center justify-center p-6 md:p-12">
                        <img 
                            src={selectedBook.imageUrl || 'https://via.placeholder.com/150'} 
                            alt={selectedBook.title} 
                            className="w-full max-h-[350px] md:max-h-[600px] object-contain rounded-xl shadow-lg"
                        />
                    </div>
                    <div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col">
                        <div className="mb-6">
                            <span className="text-blue-600 font-black text-[10px] uppercase tracking-[0.2em] mb-2 block">Book Details</span>
                            <h1 className="text-2xl md:text-4xl font-black text-gray-900 mb-2 leading-tight">{selectedBook.title}</h1>
                            <p className="text-lg md:text-xl text-gray-400 font-medium italic">by {selectedBook.author}</p>
                        </div>
                        <div className="mb-6">
                            <h4 className="text-gray-900 font-bold text-xs uppercase mb-2">Description</h4>
                            <p className="text-gray-600 leading-relaxed text-sm md:text-base">{selectedBook.description}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3 md:gap-6 mb-8 p-4 md:p-6 bg-gray-50 rounded-2xl border border-gray-100">
                            <div className="flex items-center gap-2">
                                <Layers size={16} className="text-blue-600" />
                                <div><p className="text-[9px] font-bold text-gray-400">Genre</p><p className="text-xs font-bold text-gray-800">{selectedBook.genre}</p></div>
                            </div>
                            <div className="flex items-center gap-2">
                                <BookOpen size={16} className="text-blue-600" />
                                <div><p className="text-[9px] font-bold text-gray-400">Stock</p><p className="text-xs font-bold text-gray-800">{selectedBook.stockQuantity}</p></div>
                            </div>
                            <div className="col-span-2 pt-2 border-t border-gray-200 mt-1">
                                <p className="text-[10px] font-bold text-gray-400 uppercase">Price</p>
                                <p className="text-2xl font-black text-blue-600">₹{selectedBook.price}</p>
                            </div>
                        </div>
                        
                        <motion.button 
                            whileTap={!(isOutOfStock || isLimitReached) ? { scale: 0.97 } : {}}
                            onClick={() => !(isOutOfStock || isLimitReached) && handleAddToCart(selectedBook)}
                            disabled={isOutOfStock || isLimitReached}
                            className={`w-full py-4 rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-lg transition-all duration-300 ${
                                (isOutOfStock || isLimitReached) ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none' : 
                                addedId === selectedBook.id ? 'bg-green-600 text-white' : 'bg-black text-white'
                            }`}
                        >
                            {isOutOfStock ? "Out of Stock" : isLimitReached ? "Limit Reached" : addedId === selectedBook.id ? <><Check size={18}/> Added</> : <><ShoppingCart size={18}/> Add to Cart</>}
                        </motion.button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-[1400px] mx-auto px-3 md:px-10 py-6 md:py-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <h1 className="text-xl md:text-3xl font-black text-gray-900 uppercase tracking-tight">Our Collection</h1>
                <div className="relative w-full md:w-80">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search size={18} className="text-gray-400" />
                    </div>
                    <input 
                        type="text"
                        placeholder="Search by title, author, or genre..."
                        className="w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                        <button onClick={() => setSearchTerm("")} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600">
                            <X size={16} />
                        </button>
                    )}
                </div>
            </div>

            {filteredBooks.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-6">
                    {filteredBooks.map(book => {
                        const cartItem = cart.find(item => item.id === book.id);
                        const isOutOfStock = book.stockQuantity <= 0;
                        const isLimitReached = cartItem && cartItem.quantity >= book.stockQuantity;

                        return (
                            <div 
                                key={book.id} 
                                onClick={() => setSelectedBook(book)}
                                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all cursor-pointer flex flex-col group"
                            >
                                <div className="relative h-40 sm:h-56 overflow-hidden bg-gray-50">
                                    <img src={book.imageUrl} alt={book.title} className={`w-full h-full object-cover transition-transform duration-500 ${isOutOfStock ? 'grayscale opacity-50' : 'group-hover:scale-105'}`} />
                                    {isOutOfStock && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="bg-white/90 text-black text-[10px] font-black px-3 py-1 rounded-full uppercase">Sold Out</span>
                                        </div>
                                    )}
                                </div>
                                <div className="p-3 flex flex-col flex-1">
                                    <div className="mb-2">
                                        <h3 className="font-bold text-gray-900 text-[11px] sm:text-sm leading-tight line-clamp-1">{book.title}</h3>
                                        <p className="text-gray-400 text-[9px] sm:text-[10px] font-medium mt-1 uppercase tracking-tighter">{book.author}</p>
                                    </div>
                                    <div className="flex flex-col gap-2 mt-auto">
                                        <span className="text-sm sm:text-base font-black text-blue-600">₹{book.price}</span>
                                        <motion.button 
                                            whileTap={!(isOutOfStock || isLimitReached) ? { scale: 0.9 } : {}}
                                            onClick={(e) => { 
                                                e.stopPropagation(); 
                                                if(!(isOutOfStock || isLimitReached)) handleAddToCart(book); 
                                            }}
                                            disabled={isOutOfStock || isLimitReached}
                                            className={`w-full py-2 rounded-lg text-[9px] sm:text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${
                                                (isOutOfStock || isLimitReached) ? 'bg-gray-200 text-gray-400 cursor-not-allowed' :
                                                addedId === book.id ? 'bg-green-600 text-white' : 'bg-gray-900 text-white'
                                            }`}
                                        >
                                            {isOutOfStock ? "Out of Stock" : isLimitReached ? "Limit Reached" : addedId === book.id ? "Added!" : "Add to Cart"}
                                        </motion.button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-20">
                    <p className="text-gray-400 font-bold uppercase tracking-widest">No books found matching "{searchTerm}"</p>
                    <button onClick={() => setSearchTerm("")} className="mt-4 text-blue-600 font-bold text-sm underline">Clear search</button>
                </div>
            )}
        </div>
    );
};

export default BookCatalog;