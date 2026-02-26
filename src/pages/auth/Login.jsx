import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../../api/authService';
import { LogIn, Mail, Lock } from 'lucide-react'; // Added icons for consistent look
import toast from 'react-hot-toast';

const Login = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await login(credentials);
            
            // IMPORTANT: Since your backend service returns a plain String (JWT),
            // response.data IS the token itself.
            const token = response.data;
            
            if (token) {
                localStorage.setItem('token', token);
                toast.success("Welcome back! 📚");
                navigate('/catalog');
            }
        } catch (err) {
            console.error("Login error:", err);
            toast.error(err.response?.data?.message || "Invalid email or password");
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-6">
            <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md border border-gray-50">
                <div className="flex flex-col items-center mb-8">
                    <div className="bg-blue-600 p-3 rounded-2xl mb-4 shadow-lg shadow-blue-200">
                        <LogIn className="text-white" size={28} />
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">User Login</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-400 uppercase ml-1">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-4 text-gray-400" size={18} />
                            <input 
                                type="email" 
                                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition outline-none"
                                placeholder="Enter your email"
                                onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-400 uppercase ml-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-4 text-gray-400" size={18} />
                            <input 
                                type="password" 
                                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition outline-none"
                                placeholder="••••••••"
                                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black mt-4 hover:bg-blue-700 transition shadow-lg shadow-blue-100">
                        LOGIN
                    </button>
                </form>

                <p className="text-center mt-6 text-gray-500 font-medium">
                    New here? <Link to="/register" className="text-blue-600 font-bold hover:underline">Create Account</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;