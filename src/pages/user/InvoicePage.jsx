import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
    Receipt, ArrowLeft, Printer, AlertCircle, MapPin, 
    ShieldCheck, Globe, Hash, Calendar, CheckCircle2, 
    QrCode, Download, CreditCard, Box, Info, ShieldAlert,
    FileText, ExternalLink, Scale, Landmark
} from 'lucide-react';
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
                toast.error("Authentication Required");
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
        <div className="flex flex-col items-center justify-center min-h-screen bg-white font-sans">
            <div className="w-12 h-12 border-[3px] border-gray-100 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="mt-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">Establishing Secure Connection</p>
        </div>
    );

    if (error || !order) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#FAFAFA] p-6 text-center">
            <div className="max-w-md bg-white p-12 rounded-[2rem] shadow-2xl border border-gray-100">
                <ShieldAlert size={48} className="text-red-500 mx-auto mb-6" />
                <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Access Restricted</h2>
                <p className="text-gray-500 text-sm mb-10 leading-relaxed font-medium">This document is protected by corporate security protocols. Your session lacks the necessary clearance level.</p>
                <button onClick={() => navigate('/my-orders')} className="w-full bg-black text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95 transition-all">Return to Dashboard</button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F4F7F9] py-10 px-4 sm:px-10 print:bg-white print:p-0 font-sans antialiased text-slate-900">
            
            {/* UTILITY ACTION BAR */}
            <div className="max-w-5xl mx-auto mb-8 flex justify-between items-center print:hidden">
                <button onClick={() => navigate('/my-orders')} className="flex items-center gap-3 text-gray-400 hover:text-black transition-all">
                    <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center border border-gray-100">
                        <ArrowLeft size={16}/>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Purchase History</span>
                </button>
                <div className="flex gap-4">
                    <button onClick={() => window.print()} className="bg-white text-gray-900 px-6 py-3 rounded-xl border border-gray-200 font-black text-[10px] uppercase tracking-widest hover:bg-gray-50 transition flex items-center gap-2 active:scale-95 shadow-sm">
                        <Printer size={14}/> Print
                    </button>
                    <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 transition flex items-center gap-2 active:scale-95 shadow-lg shadow-blue-100">
                        <Download size={14}/> PDF Archive
                    </button>
                </div>
            </div>

            {/* INSTITUTIONAL INVOICE CARD */}
            <div className="max-w-5xl mx-auto bg-white rounded-[1.5rem] md:rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.06)] overflow-hidden print:shadow-none border border-white">
                
                {/* 1. DOCUMENT STRATEGY: TOP HEADER */}
                <div className="bg-slate-900 p-10 md:p-16 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-blue-600/20 to-transparent pointer-events-none"></div>
                    
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 relative z-10">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-2xl">
                                <Landmark size={32} strokeWidth={1.5} />
                            </div>
                            <div>
                                <h1 className="text-2xl font-black tracking-tighter uppercase leading-none">In.Bookstore</h1>
                                <p className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.4em] mt-2">Enterprise Solutions</p>
                            </div>
                        </div>
                        <div className="text-left md:text-right">
                            <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-none mb-2">INVOICE</h2>
                            <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">{order.invoiceNumber || `ORD-REF-${id.slice(0,8).toUpperCase()}`}</p>
                        </div>
                    </div>
                </div>

                {/* 2. CORE METADATA GRID */}
                <div className="grid grid-cols-1 md:grid-cols-3 border-b border-gray-100 bg-gray-50/30">
                    <div className="p-10 border-r border-gray-100">
                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-4">Issuer Information</p>
                        <p className="text-sm font-black text-slate-800 uppercase mb-1">Bookstore Pvt Ltd</p>
                        <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                            Financial District, Gachibowli<br/>
                            Hyderabad, TG 500032<br/>
                            GSTIN: 27AAACV1234
                        </p>
                    </div>
                    <div className="p-10 border-r border-gray-100">
                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-4">Consignee Detail</p>
                        <p className="text-sm font-black text-slate-800 uppercase mb-1">{order.customer || 'Authenticated Client'}</p>
                        <p className="text-[11px] text-slate-500 font-medium leading-relaxed italic">
                            {order.shippingAddress || "Electronic Delivery - No Physical Address Provided"}
                        </p>
                    </div>
                    <div className="p-10 flex flex-col justify-between">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-[9px] font-black text-gray-300 uppercase">Issue Date</span>
                                <span className="text-[11px] font-black text-slate-900">{new Date(order.orderDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[9px] font-black text-gray-300 uppercase">Status</span>
                                <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded uppercase tracking-tighter border border-emerald-100">Fully Settled</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 mt-6">
                            <QrCode size={32} className="text-slate-200" strokeWidth={1}/>
                            <p className="text-[8px] font-black text-gray-300 uppercase leading-tight tracking-widest">Digital Auth Verified</p>
                        </div>
                    </div>
                </div>

                {/* 3. INVENTORY & VALUATION TABLE */}
                <div className="p-10 md:p-16">
                    <table className="w-full text-left mb-16">
                        <thead>
                            <tr className="border-b border-slate-900/10">
                                <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Line Item Description</th>
                                <th className="pb-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Qty</th>
                                <th className="pb-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Rate</th>
                                <th className="pb-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {order.items?.map((item, idx) => (
                                <tr key={idx} className="group">
                                    <td className="py-8">
                                        <div className="flex items-center gap-6">
                                            <div className="w-12 h-16 bg-gray-50 rounded-lg overflow-hidden border border-gray-100 shadow-sm flex-shrink-0">
                                                <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <p className="font-black text-slate-900 text-sm leading-tight uppercase tracking-tight mb-1">{item.title}</p>
                                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                                                    <Hash size={10} className="text-blue-500" /> BK-{item.bookId}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-8 text-center text-xs font-black text-slate-600 font-mono italic">
                                        {item.quantity < 10 ? `0${item.quantity}` : item.quantity}
                                    </td>
                                    <td className="py-8 text-right text-xs font-bold text-slate-400">₹{item.price.toLocaleString()}</td>
                                    <td className="py-8 text-right text-sm font-black text-slate-900">₹{(item.quantity * item.price).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* 4. FINANCIAL SETTLEMENT SUMMARY */}
                    <div className="flex flex-col lg:flex-row justify-between items-start gap-12">
                        {/* Legal Section */}
                        <div className="flex-1 space-y-8">
                            <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-5">
                                <ShieldCheck size={20} className="text-blue-600 mt-0.5" />
                                <div className="space-y-2">
                                    <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Transaction Security</h4>
                                    <p className="text-[10px] text-slate-500 font-medium leading-relaxed uppercase tracking-tight">
                                        This document confirms the settlement of funds via the <span className="text-slate-900 font-black">{order.paymentStatus || 'Verified Clearing House'}</span> protocol. 
                                        Internal Order ID: <span className="font-mono text-blue-600">{id}</span>.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-8 opacity-25 grayscale">
                                <Globe size={18}/>
                                <CreditCard size={18}/>
                                <Scale size={18}/>
                            </div>
                        </div>

                        {/* Totals Section */}
                        <div className="w-full lg:w-96 space-y-3">
                            <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">
                                <span>Sub-Total Amount</span>
                                <span className="text-slate-900">₹{(order.totalPrice - (order.taxAmount || 0)).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 pb-3 border-b border-gray-50">
                                <span>Tax (Integrated GST 18%)</span>
                                <span className="text-slate-900">₹{order.taxAmount?.toLocaleString() || "0"}</span>
                            </div>
                            <div className="pt-4 flex justify-between items-center px-8 py-8 bg-blue-600 text-white rounded-3xl shadow-2xl shadow-blue-100 transform scale-[1.02] origin-right">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-100">Net Payable</span>
                                    <span className="text-[8px] font-bold text-blue-200 uppercase mt-1 italic">Verified & Closed</span>
                                </div>
                                <span className="text-4xl font-black tracking-tighter font-mono">₹{order.totalPrice.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* 5. CORPORATE FOOTER */}
                    <div className="mt-32 pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-end gap-10">
                        <div className="max-w-xs">
                            <h5 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] mb-3">Declaration</h5>
                            <p className="text-[9px] text-slate-400 font-medium leading-relaxed uppercase tracking-tighter opacity-70">
                                This is a computer-generated tax invoice. No signature is required. All digital goods are subject to fulfillment terms. 
                                Discrepancies should be reported to the audit department.
                            </p>
                        </div>
                        <div className="text-right">
                            <div className="h-[2px] w-48 bg-slate-900 mb-4 inline-block"></div>
                            <p className="text-[11px] font-black text-slate-900 uppercase tracking-[0.5em]">Auth. Signatory</p>
                            <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest mt-1">Bookstore Node - 500032</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* EXTERNAL NAV HINT */}
            <div className="max-w-5xl mx-auto mt-12 flex justify-center gap-10 opacity-30 print:hidden text-[10px] font-black uppercase tracking-widest text-slate-400">
                <span className="flex items-center gap-2"><CheckCircle2 size={14}/> Secure</span>
                <span className="flex items-center gap-2"><Box size={14}/> Quality Check</span>
                <span className="flex items-center gap-2"><Info size={14}/> Support Hub</span>
            </div>
        </div>
    );
};

export default InvoicePage;