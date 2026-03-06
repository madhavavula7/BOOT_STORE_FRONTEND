import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../../api/authService';
import { LogIn, Mail, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            await login(credentials);
            sessionStorage.removeItem('shuffled_collection');
            toast.success("Welcome back! 📚");
            navigate('/catalog');
        } catch (err) {
            console.error("Login error:", err);
            const errorMsg = err.response?.data?.message || err.response?.data || "Invalid email or password";
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        // Changed min-h to screen and adjusted padding for mobile
        <div className="min-h-[90vh] flex items-center justify-center p-4 sm:p-6 lg:p-8">
            {/* Card width is fluid with a max-limit */}
            <div className="bg-white p-6 sm:p-10 rounded-[2.5rem] shadow-2xl shadow-gray-200/50 w-full max-w-[440px] border border-gray-100">
                
                <div className="flex flex-col items-center mb-8">
                    {/* Icon container scales slightly */}
                    <div className="bg-blue-600 p-3 sm:p-4 rounded-2xl mb-4 shadow-lg shadow-blue-200 transform transition-transform hover:rotate-6">
                        <LogIn className="text-white" size={24} />
                    </div>
                    {/* Heading size adjusted for mobile */}
                    <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight text-center">
                        User Login
                    </h2>
                    <p className="text-gray-400 text-xs sm:text-sm font-medium mt-1">Access your bookstore account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                    <div className="space-y-1.5">
                        <label className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase ml-1 tracking-widest">
                            Email Address
                        </label>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                                <Mail size={18} />
                            </div>
                            <input 
                                type="email" 
                                className="w-full pl-12 pr-4 py-3.5 sm:py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none text-sm sm:text-base"
                                placeholder="name@example.com"
                                value={credentials.email}
                                onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase ml-1 tracking-widest">
                            Password
                        </label>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                                <Lock size={18} />
                            </div>
                            <input 
                                type="password" 
                                className="w-full pl-12 pr-4 py-3.5 sm:py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none text-sm sm:text-base"
                                placeholder="••••••••"
                                value={credentials.password}
                                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                                required
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-1">
                        <button type="button" className="text-[11px] font-bold text-blue-600 hover:text-blue-700 transition uppercase tracking-wider">
                            Forgot Password?
                        </button>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className={`w-full bg-blue-600 text-white py-4 rounded-2xl font-black mt-2 hover:bg-blue-700 active:scale-[0.98] transition-all shadow-xl shadow-blue-100 tracking-widest text-sm ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'VERIFYING...' : 'SIGN IN'}
                    </button>
                </form>

                {/* Footer adjusted for smaller screens */}
                <div className="text-center mt-8 pt-6 border-t border-gray-50">
                    <p className="text-sm text-gray-500 font-medium">
                        New here? <Link to="/register" className="text-blue-600 font-black hover:text-blue-700 ml-1 transition">Create Account</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;