import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Receipt, ArrowLeft, Printer, AlertCircle, MapPin, Mail, Truck, Globe, Verified } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const InvoicePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [order, setOrder] = useState(location.state?.orderData || null);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(!location.state?.orderData);

    useEffect(() => {
        const fetchInvoice = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error("Session expired. Please login.");
                navigate('/login');
                return;
            }
            try {
                if (order) return;
                setLoading(true);
                const res = await axios.get(`https://book-store-springboot.onrender.com/api/orders/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.data && res.data.success) {
                    setOrder(res.data.data);
                } else {
                    setError(true);
                }
            } catch (err) {
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        fetchInvoice();
    }, [id, navigate, order]);

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white font-sans px-4 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-600 mb-4"></div>
            <p className="text-gray-400 font-bold text-[10px] tracking-widest uppercase">Fetching Secure Document...</p>
        </div>
    );

    if (error || !order) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6 text-center">
            <AlertCircle size={48} className="text-red-500 mb-4" />
            <h2 className="text-xl font-black text-gray-800 uppercase">Document Restricted</h2>
            <p className="text-gray-500 text-sm mb-6">This invoice is no longer available or you lack permissions.</p>
            <button onClick={() => navigate('/my-orders')} className="w-full max-w-xs bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-xs uppercase shadow-lg active:scale-95 transition-transform">Back to Orders</button>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#f8fafc] py-4 sm:py-8 md:py-12 px-3 sm:px-6 print:bg-white print:py-0 print:px-0 font-sans">
            
            {/* ACTION HEADER */}
            <div className="max-w-5xl mx-auto mb-6 flex flex-col sm:flex-row justify-between items-center gap-4 print:hidden">
                <button onClick={() => navigate('/my-orders')} className="flex items-center gap-2 text-gray-400 hover:text-black transition-all font-black text-[10px] uppercase tracking-widest self-start">
                    <ArrowLeft size={14}/> Back to History
                </button>
                <button onClick={() => window.print()} className="w-full sm:w-auto bg-white border border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-50 transition shadow-sm flex items-center justify-center gap-2 active:scale-95">
                    <Printer size={14}/> Print PDF
                </button>
            </div>

            {/* MAIN INVOICE CARD */}
            <div className="max-w-5xl mx-auto bg-white shadow-xl sm:shadow-2xl rounded-2xl md:rounded-3xl overflow-hidden border border-gray-100 print:shadow-none print:border-none print:rounded-none relative">
                
                {/* Background Watermark */}
                <div className="absolute top-0 right-0 p-6 md:p-12 opacity-[0.03] pointer-events-none print:hidden">
                    <Receipt size={150} className="w-[120px] h-[120px] md:w-[200px] md:h-[200px]" />
                </div>

                <div className="p-5 sm:p-8 md:p-16">
                    {/* 1. TOP BRANDING SECTION */}
                    <div className="flex flex-col md:flex-row justify-between gap-8 border-b border-gray-100 pb-8 md:pb-12 mb-8 md:mb-12">
                        <div className="z-10">
                            <div className="flex items-center gap-3 text-blue-600 mb-6">
                                <div className="bg-blue-600 p-2 rounded-lg text-white">
                                    <Receipt size={24} strokeWidth={2.5}/>
                                </div>
                                <h1 className="text-xl md:text-2xl font-black tracking-tighter uppercase italic">In.Bookstore</h1>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Sold By</p>
                                <p className="text-sm font-bold text-gray-800 uppercase">Bookstore Pvt Ltd</p>
                                <p className="text-[11px] text-gray-500 font-medium max-w-[250px] leading-relaxed">
                                    123 Tech Park, Financial District, Gachibowli, Hyderabad, 500032
                                </p>
                                <p className="text-[11px] font-black text-blue-600 uppercase mt-2">GSTIN: 27AAACV1234L1Z5</p>
                            </div>
                        </div>
                        
                        <div className="md:text-right space-y-4">
                            <div>
                                <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-none">INVOICE</h2>
                                <p className="text-blue-600 font-black text-[10px] md:text-xs tracking-tighter uppercase mt-2 bg-blue-50 inline-block px-2 py-1 rounded md:bg-transparent md:p-0">
                                    {order.invoiceNumber || `ORD-${order.orderId}`}
                                </p>
                            </div>
                            <div className="flex flex-col md:items-end border-l-4 md:border-l-0 md:border-r-4 border-blue-600 pl-4 md:pl-0 md:pr-4 py-1">
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Date of Issue</p>
                                <p className="text-sm font-bold text-gray-800">
                                    {new Date(order.orderDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* 2. DUAL ADDRESS SECTION */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8 mb-10 md:mb-16">
                        <div className="bg-gray-50/50 p-5 md:p-6 rounded-2xl border border-gray-100">
                            <div className="flex items-center gap-2 mb-4">
                                <MapPin size={14} className="text-blue-600" />
                                <h4 className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Shipping Details</h4>
                            </div>
                            <p className="text-sm font-black text-gray-900 mb-1 uppercase">{order.customer || 'Valued Customer'}</p>
                            <p className="text-[11px] md:text-xs text-gray-600 leading-relaxed font-medium">
                                {order.shippingAddress || "N/A"}
                            </p>
                        </div>

                        <div className="bg-gray-50/50 p-5 md:p-6 rounded-2xl border border-gray-100">
                            <div className="flex items-center gap-2 mb-4">
                                <Verified size={14} className="text-blue-600" />
                                <h4 className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Billing Details</h4>
                            </div>
                            <p className="text-sm font-black text-gray-900 mb-1 uppercase">{order.customer || 'Valued Customer'}</p>
                            <p className="text-[11px] md:text-xs text-gray-600 leading-relaxed font-medium">
                                {order.billingAddress || order.shippingAddress || "N/A"}
                            </p>
                        </div>
                    </div>

                    {/* 3. INVENTORY TABLE */}
                    <div className="mb-10 md:mb-16">
                        <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
                            <table className="w-full min-w-[600px] text-left">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="py-4 px-6 text-[9px] font-black text-gray-400 uppercase tracking-widest">Item Description</th>
                                        <th className="py-4 px-6 text-center text-[9px] font-black text-gray-400 uppercase tracking-widest">Qty</th>
                                        <th className="py-4 px-6 text-right text-[9px] font-black text-gray-400 uppercase tracking-widest">Rate</th>
                                        <th className="py-4 px-6 text-right text-[9px] font-black text-gray-400 uppercase tracking-widest">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {order.items?.map((item, idx) => (
                                        <tr key={idx} className="group transition-colors">
                                            <td className="py-5 px-6">
                                                <div className="flex items-center gap-4">
                                                    <img src={item.imageUrl} alt="" className="w-10 h-14 object-cover rounded border border-gray-200 shadow-sm" />
                                                    <div>
                                                        <p className="font-black text-gray-800 text-sm leading-tight mb-1">{item.title}</p>
                                                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">SKU: BK-00{item.bookId}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-5 px-6 text-center text-sm font-black text-gray-600">x{item.quantity}</td>
                                            <td className="py-5 px-6 text-right text-sm font-bold text-gray-500">₹{item.price?.toLocaleString()}</td>
                                            <td className="py-5 px-6 text-right text-sm font-black text-gray-900">₹{(item.quantity * item.price)?.toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <p className="text-[8px] text-gray-400 mt-3 sm:hidden text-center uppercase font-bold italic tracking-widest">← Swipe to view more details →</p>
                    </div>

                    {/* 4. TOTALS SECTION */}
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
                        <div className="w-full lg:max-w-md order-2 lg:order-1">
                            <div className="bg-blue-50/50 border border-blue-100 p-5 rounded-2xl">
                                <h4 className="text-[9px] font-black text-blue-600 uppercase mb-2 tracking-widest flex items-center gap-2">
                                    <Verified size={12}/> Secure Transaction
                                </h4>
                                <p className="text-[10px] text-blue-800/70 font-medium leading-relaxed">
                                    Status: <span className="font-bold text-blue-700">{order.paymentStatus || 'Paid Online'}</span> • 
                                    Order ID: <span className="font-mono text-blue-700">{id}</span>
                                </p>
                            </div>
                        </div>

                        <div className="w-full lg:w-72 space-y-3 order-1 lg:order-2">
                            <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">
                                <span>Sub-Total</span>
                                <span className="text-gray-900">₹{(order.totalPrice - (order.taxAmount || 0)).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">
                                <span>Tax (GST)</span>
                                <span className="text-gray-900">₹{order.taxAmount?.toLocaleString() || "0"}</span>
                            </div>
                            <div className="flex justify-between items-center px-5 py-6 bg-gray-900 text-white rounded-2xl shadow-lg transform md:scale-105 origin-right">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Payable</span>
                                <span className="text-2xl font-black">₹{order.totalPrice?.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* 5. FOOTER */}
                    <div className="mt-16 md:mt-24 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
                        <div className="max-w-xs">
                            <p className="text-[9px] font-black text-gray-900 uppercase tracking-widest mb-2 italic">Declaration</p>
                            <p className="text-[9px] text-gray-400 leading-relaxed font-medium">
                                This is a computer-generated invoice and does not require a physical signature. Goods once sold are only returnable per our policy.
                            </p>
                        </div>
                        <div className="flex flex-col items-center md:items-end">
                            <div className="font-serif italic text-2xl text-gray-300 mb-1 select-none">Auth. Signatory</div>
                            <div className="h-px w-32 bg-gray-100 mb-2"></div>
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">In.Bookstore Team</p>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* MOBILE ONLY NAV HINT */}
            <div className="max-w-5xl mx-auto mt-8 flex justify-center gap-6 opacity-20 print:hidden pb-10">
                <Globe size={16}/>
                <Verified size={16}/>
                <Truck size={16}/>
            </div>
        </div>
    );
};

export default InvoicePage;