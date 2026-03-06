import React, { useEffect, useState } from 'react'; 
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, LogOut, Book, Package, Menu, X, User } from 'lucide-react'; 
import { useCart } from '../../context/CartContext';
import { jwtDecode } from 'jwt-decode';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Mobile menu state
  
  let username = "";
  if (token) {
    try {
      const decoded = jwtDecode(token);
      username = decoded.sub || decoded.username || "User"; 
    } catch (error) {
      console.error("Token decode failed", error);
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsMenuOpen(false);
    navigate('/login');
  };

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const expiryTime = decoded.exp * 1000;
        const currentTime = Date.now();
        const timeLeft = expiryTime - currentTime;

        if (timeLeft <= 0) {
          handleLogout();
        } else {
          const timer = setTimeout(() => {
            handleLogout();
            toast.error("Session expired. Please login again.", { icon: '⏰' });
          }, timeLeft);
          return () => clearTimeout(timer);
        }
      } catch (error) { handleLogout(); }
    }
  }, [token, navigate]);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      {/* Container: Changed px-[100px] to responsive px-4, sm:px-8, lg:px-[100px] */}
      <div className="w-full mx-auto px-4 sm:px-8 lg:px-[100px] h-16 flex items-center justify-between">
        
        {/* Logo Section */}
        <Link to="/catalog" className="flex items-center gap-2 group shrink-0">
          <div className="bg-blue-600 p-1.5 rounded-lg transition-transform group-hover:scale-110">
            <Book className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-bold text-gray-900">
            Book<span className="text-blue-600">Store</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {token && (
            <Link to="/my-orders" className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-blue-600 transition">
              <Package size={18} />
              <span>My Orders</span>
            </Link>
          )}

          {token ? (
            <div className="flex items-center gap-4 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
              <span className="text-sm font-semibold text-gray-700">
                Hi, <span className="text-blue-600">{username.split('@')[0]}</span>
              </span>
              <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition-colors">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="text-sm font-bold text-gray-600 hover:text-blue-600">Login</Link>
          )}

          <Link to="/cart" className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition">
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">
                {cartCount}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile Toggle & Cart */}
        <div className="flex md:hidden items-center gap-2">
          <Link to="/cart" className="relative p-2 text-gray-600">
            <ShoppingCart className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 animate-in slide-in-from-top duration-300">
          <div className="px-4 py-4 space-y-3">
            {token ? (
              <>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <User size={20} className="text-blue-600" />
                  <span className="font-bold text-gray-700">{username.split('@')[0]}</span>
                </div>
                <Link 
                  to="/my-orders" 
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 p-3 text-gray-600 font-bold hover:bg-gray-50 rounded-xl"
                >
                  <Package size={20} /> My Orders
                </Link>
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 p-3 text-red-500 font-bold hover:bg-red-50 rounded-xl"
                >
                  <LogOut size={20} /> Logout
                </button>
              </>
            ) : (
              <Link 
                to="/login" 
                onClick={() => setIsMenuOpen(false)}
                className="block p-3 text-center bg-blue-600 text-white font-bold rounded-xl"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;