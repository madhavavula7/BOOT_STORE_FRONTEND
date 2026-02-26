import React, { useEffect } from 'react'; 
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, LogOut, Book, Package } from 'lucide-react'; // Changed Laptop to Book
import { useCart } from '../../context/CartContext';
import { jwtDecode } from 'jwt-decode';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  
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
            toast.error("Session expired. Please login again.", {
              icon: '⏰',
              style: { borderRadius: '10px', background: '#333', color: '#fff' }
            });
          }, timeLeft);

          return () => clearTimeout(timer);
        }
      } catch (error) {
        handleLogout();
      }
    }
  }, [token, navigate]);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="w-full mx-auto px-[100px] h-16 flex items-center justify-between">
        
        {/* Updated Logo Section */}
        <Link to="/catalog" className="flex items-center gap-2 group">
          <div className="bg-blue-600 p-1.5 rounded-lg transition-transform group-hover:scale-110">
            <Book className="text-white w-5 h-5" /> {/* Updated Icon */}
          </div>
          <span className="text-xl font-bold text-gray-900">
            Book <span className="text-blue-600">Store</span> {/* Updated Text */}
          </span>
        </Link>

        <div className="flex items-center gap-6">
          {token && (
            <Link 
              to="/my-orders" 
              className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-blue-600 transition"
            >
              <Package size={18} />
              <span>My Orders</span>
            </Link>
          )}

          {token ? (
            <div className="flex items-center gap-4 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
              <span className="text-sm font-semibold text-gray-700">
                Hi, <span className="text-blue-600">{username.split('@')[0]}</span>
              </span>
              <button 
                onClick={handleLogout} 
                className="text-gray-400 hover:text-red-500 transition-colors"
                title="Logout"
              >
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
      </div>
    </nav>
  );
};

export default Navbar;