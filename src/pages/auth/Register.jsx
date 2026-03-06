import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { register } from '../../api/authService';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '', 
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await register(formData);
            if (response.data) {
                toast.success("Account created successfully! Please login. 📚");
                navigate('/login');
            }
        } catch (err) {
            const backendMsg = err.response?.data?.message || err.response?.data || "Registration failed";
            toast.error(backendMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        // Adjusted padding for mobile/tablet/desktop
        <div className="min-h-[90vh] flex items-center justify-center p-4 sm:p-6 lg:p-8">
            {/* Fluid width with a max-cap to keep it looking clean on desktop */}
            <div className="bg-white p-6 sm:p-10 rounded-[2.5rem] shadow-2xl shadow-gray-200/50 w-full max-w-[440px] border border-gray-100">
                
                <div className="flex flex-col items-center mb-8">
                    {/* Responsive icon container */}
                    <div className="bg-blue-600 p-3 sm:p-4 rounded-2xl mb-4 shadow-lg shadow-blue-200 transform transition-transform hover:-rotate-6">
                        <UserPlus className="text-white" size={24} />
                    </div>
                    {/* Scaling text sizes */}
                    <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight text-center">
                        Join Book Store
                    </h2>
                    <p className="text-gray-400 text-xs sm:text-sm font-medium mt-1">Create your account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                    {/* Full Name Field */}
                    <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                            <User size={18} />
                        </div>
                        <input 
                            type="text" 
                            name="name"
                            className="w-full pl-12 pr-4 py-3.5 sm:py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none text-sm sm:text-base"
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Email Field */}
                    <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                            <Mail size={18} />
                        </div>
                        <input 
                            type="email" 
                            name="email"
                            className="w-full pl-12 pr-4 py-3.5 sm:py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none text-sm sm:text-base"
                            placeholder="Email address"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Password Field */}
                    <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                            <Lock size={18} />
                        </div>
                        <input 
                            type="password" 
                            name="password"
                            className="w-full pl-12 pr-4 py-3.5 sm:py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none text-sm sm:text-base"
                            placeholder="Create Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button 
                        disabled={loading}
                        className={`w-full bg-blue-600 text-white py-4 rounded-2xl font-black mt-2 hover:bg-blue-700 active:scale-[0.98] transition-all shadow-xl shadow-blue-100 tracking-widest text-sm ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
                    </button>
                </form>

                {/* Footer scaling */}
                <div className="text-center mt-8 pt-6 border-t border-gray-50">
                    <p className="text-sm text-gray-500 font-medium">
                        Already have an account? <Link to="/login" className="text-blue-600 font-black hover:text-blue-700 ml-1 transition">Login</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;