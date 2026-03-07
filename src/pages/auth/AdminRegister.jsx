import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, User, Key } from 'lucide-react';
import toast from 'react-hot-toast';
import { registerAdmin } from '../../api/authService'; // Make sure this is in your authService

const AdminRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    secretKey: '' // The extra field your backend requires
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await registerAdmin(formData);
      toast.success(response.data || "Admin registered successfully!");
      navigate('/login');
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.response?.data || "Invalid Secret Key or Registration Failed";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-[2rem] shadow-2xl border border-gray-100 p-8 sm:p-10">
        <div className="text-center mb-8">
          <div className="inline-flex p-4 rounded-2xl bg-red-50 text-red-600 mb-4">
            <ShieldCheck size={40} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Admin Portal</h2>
          <p className="text-gray-500 mt-2">Create an administrative account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input name="name" type="text" required onChange={handleChange}
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none transition"
                placeholder="Admin Name" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Official Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input name="email" type="email" required onChange={handleChange}
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none transition"
                placeholder="admin@bookstore.com" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input name="password" type="password" required onChange={handleChange}
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none transition"
                placeholder="••••••••" />
            </div>
          </div>

          {/* EXTRA FIELD: SECRET KEY */}
          <div className="pt-2">
            <label className="block text-sm font-bold text-red-600 mb-2">Master Secret Key</label>
            <div className="relative">
              <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-red-400" size={18} />
              <input name="secretKey" type="password" required onChange={handleChange}
                className="w-full pl-12 pr-4 py-3.5 bg-red-50 border border-red-100 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none transition text-red-700 font-mono"
                placeholder="Enter Staff Code" />
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-gray-900 hover:bg-black text-white font-bold py-4 rounded-2xl shadow-lg transition transform active:scale-95 disabled:opacity-50 mt-4">
            {loading ? "Verifying..." : "Register Admin"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminRegister;