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
                const res = await axios.get(`http://localhost:8080/api/orders/${id}`, {
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
        <div className="flex flex-col items-center justify-center h-screen bg-white font-sans">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-600 mb-4"></div>
            <p className="text-gray-400 font-bold text-[10px] tracking-widest uppercase">Fetching Secure Document...</p>
        </div>
    );

    if (error || !order) return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-50 p-6 text-center">
            <AlertCircle size={48} className="text-red-500 mb-4" />
            <h2 className="text-xl font-black text-gray-800 uppercase">Document Restricted</h2>
            <p className="text-gray-500 text-sm mb-6">This invoice is no longer available or you lack permissions.</p>
            <button onClick={() => navigate('/my-orders')} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold text-xs uppercase shadow-lg">Back to Orders</button>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#f8fafc] py-12 px-4 print:bg-white print:py-0 font-sans">
            {/* ACTION HEADER */}
            <div className="max-w-4xl mx-auto mb-6 flex justify-between items-center print:hidden">
                <button onClick={() => navigate('/my-orders')} className="flex items-center gap-2 text-gray-400 hover:text-black transition-all font-black text-[10px] uppercase tracking-widest">
                    <ArrowLeft size={14}/> Back to History
                </button>
                <div className="flex gap-3">
                    <button onClick={() => window.print()} className="bg-white border border-gray-200 text-gray-700 px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-50 transition shadow-sm flex items-center gap-2">
                        <Printer size={14}/> Print PDF
                    </button>
                </div>
            </div>

            <div className="max-w-4xl mx-auto bg-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-2xl overflow-hidden border border-gray-100 print:shadow-none print:border-none relative">
                
                {/* DECORATIVE ACCENT */}
                <div className="absolute top-0 right-0 p-12 opacity-[0.03] print:hidden">
                    <Receipt size={200} />
                </div>

                <div className="p-10 md:p-16">
                    {/* 1. TOP BRANDING SECTION */}
                    <div className="flex flex-col md:flex-row justify-between gap-10 border-b border-gray-100 pb-12 mb-12">
                        <div>
                            <div className="flex items-center gap-3 text-blue-600 mb-6">
                                <div className="bg-blue-600 p-2 rounded-lg text-white">
                                    <Receipt size={28} strokeWidth={2.5}/>
                                </div>
                                <h1 className="text-2xl font-black tracking-tighter uppercase italic">In.Bookstore</h1>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sold By</p>
                                <p className="text-sm font-bold text-gray-800">BOOKSTORE PVT LTD</p>
                                <p className="text-[11px] text-gray-500 font-medium max-w-[200px] leading-relaxed">
                                    123 Tech Park, Financial District, Gachibowli, Hyderabad, 500032
                                </p>
                                <p className="text-[11px] font-bold text-blue-600 uppercase mt-2">GSTIN: 27AAACV1234L1Z5</p>
                            </div>
                        </div>
                        
                        <div className="text-left md:text-right space-y-4">
                            <div>
                                <h2 className="text-4xl font-black text-gray-900 leading-none">INVOICE</h2>
                                <p className="text-blue-600 font-black text-sm tracking-tighter uppercase mt-1">
                                    {order.invoiceNumber || `ORD-00${order.orderId}`}
                                </p>
                            </div>
                            <div className="inline-flex flex-col md:items-end border-t md:border-t-0 md:border-r-4 border-blue-600 md:pr-4 pt-4 md:pt-0">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Date of Issue</p>
                                <p className="text-sm font-bold text-gray-800">
                                    {new Date(order.orderDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* 2. DUAL ADDRESS SECTION */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                            <div className="flex items-center gap-2 mb-4">
                                <MapPin size={14} className="text-blue-600" />
                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Shipping Details</h4>
                            </div>
                            <p className="text-sm font-black text-gray-900 mb-1 uppercase tracking-tight">{order.customer}</p>
                            <p className="text-xs text-gray-600 leading-relaxed font-medium">
                                {order.shippingAddress || null}
                            </p>
                            <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-gray-400">
                                <Truck size={12}/> Standard Delivery
                            </div>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                            <div className="flex items-center gap-2 mb-4">
                                <Verified size={14} className="text-blue-600" />
                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Billing Details</h4>
                            </div>
                            <p className="text-sm font-black text-gray-900 mb-1 uppercase tracking-tight">{order.customer}</p>
                            <p className="text-xs text-gray-600 leading-relaxed font-medium">
                                {order.billingAddress || order.shippingAddress || null}
                            </p>
                            <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-gray-400">
                                <Mail size={12}/> {order.email}
                            </div>
                        </div>
                    </div>

                    {/* 3. INVENTORY TABLE */}
                    <div className="mb-12 overflow-hidden border border-gray-100 rounded-xl">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="py-4 px-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Description</th>
                                    <th className="py-4 px-6 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">Qty</th>
                                    <th className="py-4 px-6 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Unit Price</th>
                                    <th className="py-4 px-6 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {order.items?.map((item, idx) => (
                                    <tr key={idx} className="group hover:bg-gray-50/50 transition-colors">
                                        <td className="py-6 px-6">
                                            <div className="flex items-center gap-5">
                                                <img src={item.imageUrl} alt="" className="w-12 h-16 object-cover rounded shadow-md border border-gray-200" />
                                                <div>
                                                    <p className="font-black text-gray-800 text-sm tracking-tight">{item.title}</p>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">ISBN: 978-00-00{item.bookId}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-6 px-6 text-center text-sm font-black text-gray-600">0{item.quantity}</td>
                                        <td className="py-6 px-6 text-right text-sm font-bold text-gray-500">₹{item.price?.toFixed(2)}</td>
                                        <td className="py-6 px-6 text-right text-sm font-black text-gray-900">₹{(item.quantity * item.price)?.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* 4. TOTALS SECTION */}
                    <div className="flex flex-col md:flex-row justify-between items-end gap-10">
                        <div className="w-full md:w-1/2">
                            <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl">
                                <h4 className="text-[10px] font-black text-blue-600 uppercase mb-3 tracking-widest flex items-center gap-2">
                                    <Verified size={12}/> Secure Payment Information
                                </h4>
                                <p className="text-[11px] text-blue-800 font-medium leading-relaxed">
                                    Payment processed via <span className="font-bold underline">{order.orderStatus}</span>. 
                                    Transaction ID: <span className="font-mono">TXN-{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
                                </p>
                            </div>
                        </div>

                        <div className="w-full md:w-80 space-y-3">
                            <div className="flex justify-between text-[11px] font-bold text-gray-400 uppercase tracking-widest px-2">
                                <span>Sub-Total</span>
                                <span className="text-gray-900 font-black">₹{order.netAmount?.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-[11px] font-bold text-gray-400 uppercase tracking-widest px-2">
                                <span>IGST (18%)</span>
                                <span className="text-gray-900 font-black">₹{order.taxAmount?.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-[11px] font-bold text-gray-400 uppercase tracking-widest px-2 border-b border-gray-100 pb-4">
                                <span>Shipping</span>
                                <span className="text-gray-900 font-black">₹{order.shippingCharges?.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center px-4 py-5 bg-gray-900 text-white rounded-2xl shadow-xl">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Grand Total</span>
                                <span className="text-2xl font-black">₹{order.totalPrice?.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {/* 5. FOOTER */}
                    <div className="mt-20 pt-10 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div>
                            <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest mb-2 italic">Declaration</p>
                            <p className="text-[10px] text-gray-400 leading-relaxed font-medium">
                                We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.
                                This is a digitally signed document authorized by BookStore Central.
                            </p>
                        </div>
                        <div className="flex flex-col items-center md:items-end justify-center">
                           <div className="text-center">
                                <div className="font-serif italic text-2xl text-gray-300 mb-1 select-none">Authorized Signatory</div>
                                <div className="h-px w-48 bg-gray-200 mb-2"></div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">In.Bookstore Ops Team</p>
                           </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* THANK YOU BOX */}
            <div className="max-w-4xl mx-auto mt-12 text-center print:hidden">
                <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Happy Reading!</p>
                <div className="flex justify-center gap-6 mt-4 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-not-allowed">
                    <Globe size={20}/>
                    <Verified size={20}/>
                    <Truck size={20}/>
                </div>
            </div>
        </div>
    );
};

export default InvoicePage;