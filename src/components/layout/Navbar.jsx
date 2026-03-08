import React, { useEffect, useState } from 'react'; 
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, LogOut, Book, Package, Menu, X, User, LayoutDashboard, PlusCircle, ShieldCheck, ChevronDown } from 'lucide-react'; 
import { useCart } from '../../context/CartContext';
import { jwtDecode } from 'jwt-decode';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role'); 
  const [isMenuOpen, setIsMenuOpen] = useState(false); 
  
  const isAdmin = token && role === 'ADMIN';

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
    localStorage.removeItem('role');

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
    <nav className={`sticky top-0 z-50 transition-all duration-300 backdrop-blur-md border-b ${
      isAdmin ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white/80 border-gray-100 text-gray-900'
    }`}>
      <div className="w-full mx-auto px-4 sm:px-8 lg:px-[100px] h-16 flex items-center justify-between">
        
        {/* Logo Section */}
        <Link to={isAdmin ? "/admin-dashboard" : "/catalog"} className="flex items-center gap-2 group shrink-0">
          <div className={`${isAdmin ? 'bg-amber-500' : 'bg-blue-600'} p-1.5 rounded-lg transition-transform group-hover:scale-110`}>
            <Book className="text-white w-5 h-5" />
          </div>
          <span className={`text-xl font-bold ${isAdmin ? 'text-white' : 'text-gray-900'}`}>
            Book<span className={isAdmin ? 'text-amber-500' : 'text-blue-600'}>{isAdmin ? 'Panel' : 'Store'}</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {/* Admin Links */}
          {isAdmin && (
            <>
              <Link to="/admin-dashboard" className="flex items-center gap-2 text-sm font-bold hover:text-amber-500 transition-colors">
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </Link>
              <Link to="/add-book" className="flex items-center gap-2 text-sm font-bold hover:text-amber-500 transition-colors">
                <PlusCircle size={18} />
                <span>Add Book</span>
              </Link>
            </>
          )}

          {/* Customer Links */}
          {token && role === 'CUSTOMER' && (
            <Link to="/my-orders" className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-blue-600 transition">
              <Package size={18} />
              <span>My Orders</span>
            </Link>
          )}

          {token ? (
            <div className={`flex items-center gap-4 px-4 py-2 rounded-xl border transition-colors ${
              isAdmin ? 'bg-slate-800 border-slate-700' : 'bg-gray-50 border-gray-100'
            }`}>
              <span className={`text-sm font-semibold ${isAdmin ? 'text-slate-200' : 'text-gray-700'}`}>
                Hi, <span className={isAdmin ? 'text-amber-500 font-bold' : 'text-blue-600'}>{username.split('@')[0]}</span>
              </span>
              <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition-colors">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-sm font-bold text-gray-600 hover:text-blue-600">Login</Link>
              
              <div className="relative group">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-blue-700 transition flex items-center gap-1">
                  Register <ChevronDown size={14} />
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 text-gray-900">
                  <div className="p-2 flex flex-col gap-1">
                    <Link to="/register" className="flex items-center gap-2 p-3 text-sm font-bold text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition">
                      <User size={16} /> User Signup
                    </Link>
                    <Link to="/admin-register" className="flex items-center gap-2 p-3 text-sm font-bold text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition">
                      <ShieldCheck size={16} className="text-red-500" /> Admin Signup
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Cart: Only visible for non-admins */}
          {!isAdmin && (
            <Link to="/cart" className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">
                  {cartCount}
                </span>
              )}
            </Link>
          )}
        </div>

        {/* Mobile Toggle & Cart */}
        <div className="flex md:hidden items-center gap-2">
          {!isAdmin && (
            <Link to="/cart" className={`relative p-2 ${isAdmin ? 'text-white' : 'text-gray-600'}`}>
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
          )}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`p-2 rounded-lg transition-colors ${isAdmin ? 'hover:bg-slate-800' : 'hover:bg-gray-100'}`}
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className={`md:hidden border-b animate-in slide-in-from-top duration-300 ${
          isAdmin ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-gray-100 text-gray-900'
        }`}>
          <div className="px-4 py-4 space-y-3">
            {token ? (
              <>
                <div className={`flex items-center gap-3 p-3 rounded-xl ${isAdmin ? 'bg-slate-800' : 'bg-gray-50'}`}>
                  <User size={20} className={isAdmin ? 'text-amber-500' : 'text-blue-600'} />
                  <span className="font-bold">{username.split('@')[0]} {isAdmin && '(Admin Mode)'}</span>
                </div>
                {isAdmin ? (
                  <>
                    <Link to="/admin-dashboard" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 p-3 font-bold hover:bg-slate-800 rounded-xl transition-colors">
                      <LayoutDashboard size={20} className="text-amber-500" /> Dashboard
                    </Link>
                    <Link to="/add-book" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 p-3 font-bold hover:bg-slate-800 rounded-xl transition-colors">
                      <PlusCircle size={20} className="text-amber-500" /> Add Book
                    </Link>
                  </>
                ) : (
                  <Link to="/my-orders" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 p-3 font-bold hover:bg-gray-50 rounded-xl transition-colors">
                    <Package size={20} className="text-blue-600" /> My Orders
                  </Link>
                )}
                <button onClick={handleLogout} className="w-full flex items-center gap-3 p-3 text-red-500 font-bold hover:bg-red-50 rounded-xl transition-colors">
                  <LogOut size={20} /> Logout
                </button>
              </>
            ) : (
              <div className="space-y-2">
                <Link to="/login" onClick={() => setIsMenuOpen(false)} className="block p-3 text-center text-gray-600 font-bold hover:bg-gray-50 rounded-xl">
                  Login
                </Link>
                <div className="grid grid-cols-2 gap-2">
                  <Link to="/register" onClick={() => setIsMenuOpen(false)} className="p-3 text-center bg-blue-600 text-white text-xs font-bold rounded-xl">
                    User Signup
                  </Link>
                  <Link to="/admin-register" onClick={() => setIsMenuOpen(false)} className="p-3 text-center bg-slate-800 text-white text-xs font-bold rounded-xl border border-slate-700">
                    Admin Signup
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;