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
            // Using the service function that points to Render
            const response = await register(formData);
            
            // Check if response contains success keywords from your Spring Boot Service
            if (response.data) {
                toast.success("Account created successfully! Please login. 📚");
                navigate('/login');
            }
        } catch (err) {
            // Production-ready error handling
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
        <div className="min-h-[80vh] flex items-center justify-center p-6">
            <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md border border-gray-50">
                <div className="flex flex-col items-center mb-8">
                    <div className="bg-blue-600 p-3 rounded-2xl mb-4 shadow-lg shadow-blue-200">
                        <UserPlus className="text-white" size={28} />
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight text-center">Join Book Store</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <User className="absolute left-4 top-4 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            name="name"
                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="relative">
                        <Mail className="absolute left-4 top-4 text-gray-400" size={18} />
                        <input 
                            type="email" 
                            name="email"
                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Email address"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-4 top-4 text-gray-400" size={18} />
                        <input 
                            type="password" 
                            name="password"
                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button 
                        disabled={loading}
                        className={`w-full bg-blue-600 text-white py-4 rounded-2xl font-black mt-4 hover:bg-blue-700 transition shadow-lg shadow-blue-100 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
                    </button>
                </form>

                <p className="text-center mt-6 text-gray-500 font-medium">
                    Already have an account? <Link to="/login" className="text-blue-600 font-bold hover:underline">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;