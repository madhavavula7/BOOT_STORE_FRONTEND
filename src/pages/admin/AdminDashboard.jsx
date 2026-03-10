import React, { useEffect, useState } from 'react';
import { LayoutDashboard, BookOpen, Users, DollarSign, PlusCircle, Trash2, Loader2, Edit3,  AlertTriangle,TrendingUp,Package} from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const token = localStorage.getItem('token');

  const fetchData = async () => {
    try {
      setLoading(true);
      const headers = { Authorization: `Bearer ${token}` };
      const [usersRes, inventoryRes] = await Promise.all([
        axios.get('https://book-store-springboot.onrender.com/api/admin/all-users', { headers }),
        axios.get('https://book-store-springboot.onrender.com/api/admin/inventory', { headers })
      ]);
      setUsers(usersRes.data);
      setInventory(inventoryRes.data);
    } catch (err) {
      toast.error("Failed to sync dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalStockValue = inventory.reduce((acc, book) => acc + (book.price * book.stockQuantity), 0);
  const lowStockCount = inventory.filter(b => b.stockQuantity < 10).length;

  const openDeleteModal = (user) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const executeDelete = async () => {
    try {
      await axios.delete(`https://book-store-springboot.onrender.com/api/admin/user/${userToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("User successfully removed");
      setUsers(users.filter(u => u.id !== userToDelete.id));
    } catch (err) {
      toast.error("Deletion request failed");
    } finally {
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[80vh] gap-4">
      <Loader2 className="animate-spin text-blue-600" size={48} />
      <p className="font-black text-gray-400 animate-pulse uppercase tracking-widest text-xs">Loading Administration Panel...</p>
    </div>
  );

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto text-gray-900 mb-20">
      {/* Header */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter italic">ADMINISTRATION PANEL</h1>
          <p className="text-gray-500 font-medium mt-1 uppercase text-[10px] tracking-[0.2em]">Operational Metrics & User Administration</p>
        </div>
        <div className="text-[10px] font-black bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full flex items-center gap-2 self-start md:self-center border border-emerald-200">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div> SYSTEM ACTIVE
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-5">
          <div className="bg-blue-600 p-4 rounded-2xl text-white shadow-lg shadow-blue-100"><BookOpen /></div>
          <div><p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Total Catalog</p><p className="text-3xl font-black">{inventory.length}</p></div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-5">
          <div className="bg-purple-600 p-4 rounded-2xl text-white shadow-lg shadow-purple-100"><Users /></div>
          <div><p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Registered Users</p><p className="text-3xl font-black">{users.length}</p></div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-5">
          <div className="bg-amber-500 p-4 rounded-2xl text-white shadow-lg shadow-amber-100"><AlertTriangle /></div>
          <div><p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Stock Alerts</p><p className="text-3xl font-black text-amber-600">{lowStockCount}</p></div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-5">
          <div className="bg-emerald-600 p-4 rounded-2xl text-white shadow-lg shadow-emerald-100"><TrendingUp /></div>
          <div><p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Inventory Value</p><p className="text-2xl font-black text-emerald-600">₹{totalStockValue.toLocaleString()}</p></div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-slate-900 rounded-[3rem] p-8 md:p-12 text-white shadow-2xl mb-12 relative overflow-hidden">
        <div className="relative z-10 flex flex-col xl:flex-row justify-between items-center gap-8 text-center xl:text-left">
          <div>
            <h2 className="text-3xl font-black mb-3">Management Console</h2>
            <p className="text-slate-400 max-w-sm">Oversee all store logistics, audit inventory levels, and manage fulfillments from a centralized interface.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link to="/admin-orders" className="flex items-center justify-center gap-3 px-8 py-5 bg-slate-800 text-white rounded-2xl font-black hover:bg-slate-700 transition-all border border-slate-700">
              <Package size={20} className="text-blue-400" /> User Orders
            </Link>
            <Link to="/manage-inventory" className="flex items-center justify-center gap-3 px-8 py-5 bg-slate-800 text-white rounded-2xl font-black hover:bg-slate-700 transition-all border border-slate-700">
              <Edit3 size={20} className="text-amber-500" /> Update Books
            </Link>
            <Link to="/add-book" className="flex items-center justify-center gap-3 px-10 py-5 bg-amber-500 text-slate-900 rounded-2xl font-black hover:scale-105 transition-all shadow-xl shadow-amber-500/20">
              <PlusCircle size={20} /> Add Book
            </Link>
          </div>
        </div>
        <LayoutDashboard className="absolute right-[-40px] bottom-[-40px] text-white/5 w-80 h-80 pointer-events-none" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* User Management */}
        <div className="lg:col-span-7 bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm">
          <h3 className="text-xl font-black mb-8 flex items-center gap-3">
            <Users size={24} className="text-purple-600" /> User Directory
          </h3>
          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-left min-w-[500px]">
              <thead>
                <tr className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-50">
                  <th className="pb-5 px-4">Account Information</th>
                  <th className="pb-5 px-4">Permission Level</th>
                  <th className="pb-5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map(user => (
                  <tr key={user.id} className="group hover:bg-gray-50/50 transition-colors">
                    <td className="py-5 px-4">
                      <p className="font-black text-gray-800 tracking-tight">{user.username}</p>
                      <p className="text-xs text-gray-400 font-medium">{user.email}</p>
                    </td>
                    <td className="py-5 px-4">
                      <span className={`text-[9px] px-3 py-1 rounded-xl font-black ${user.role === 'ADMIN' ? 'bg-rose-100 text-rose-600' : 'bg-blue-100 text-blue-600'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-5 px-4 text-right">
                      <button onClick={() => openDeleteModal(user)} className="p-2 text-gray-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stock Monitor */}
        <div className="lg:col-span-5 bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm">
          <h3 className="text-xl font-black mb-8 flex items-center gap-3">
            <BookOpen size={24} className="text-blue-600" /> Logistics Monitor
          </h3>
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-3 custom-scrollbar">
            {inventory.map(book => (
              <div key={book.id} className={`flex items-center justify-between p-4 rounded-3xl border transition-all ${book.stockQuantity < 10 ? 'bg-rose-50/50 border-rose-100 shadow-sm' : 'hover:bg-gray-50 border-transparent'}`}>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img src={book.imageUrl} className="w-12 h-16 object-cover rounded-xl shadow-sm bg-gray-100" alt="" />
                    {book.stockQuantity < 10 && <div className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full border-2 border-white animate-pulse"></div>}
                  </div>
                  <div>
                    <p className="font-black text-sm text-gray-800 line-clamp-1">{book.title}</p>
                    <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest">{book.genre}</p>
                  </div>
                </div>
                <div className="text-right">
                   <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Units</p>
                   <p className={`font-black text-lg ${book.stockQuantity < 10 ? 'text-rose-600' : 'text-gray-900'}`}>{book.stockQuantity}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl border border-gray-100 animate-in zoom-in duration-300">
            <div className="bg-rose-100 text-rose-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mx-auto">
              <AlertTriangle size={32} />
            </div>
            <h3 className="text-2xl font-black text-center text-gray-900 tracking-tight mb-2">Delete Account?</h3>
            <p className="text-center text-gray-500 text-sm font-medium mb-8">
              Confirm permanent removal of <span className="text-rose-600 font-bold">@{userToDelete?.username}</span> from the directory. This cannot be undone.
            </p>
            <div className="flex flex-col gap-3">
              <button onClick={executeDelete} className="w-full py-4 bg-rose-500 text-white rounded-2xl font-black hover:bg-rose-600 transition-all shadow-lg shadow-rose-200">
                AUTHORIZE DELETION
              </button>
              <button onClick={() => setIsDeleteModalOpen(false)} className="w-full py-4 bg-gray-50 text-gray-400 rounded-2xl font-black hover:bg-gray-100 transition-all">
                ABORT ACTION
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;