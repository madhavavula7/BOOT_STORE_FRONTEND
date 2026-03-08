import React from 'react';
import { 
  Book, 
  Instagram, 
  Twitter, 
  Linkedin,
  ShieldCheck,
  Truck,
  CreditCard
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 pt-8 pb-4 mt-auto">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 pb-6 border-b border-gray-50">
            <div className="flex items-center gap-3">
                <Truck size={18} className="text-blue-600" />
                <h4 className="font-black text-[10px] uppercase tracking-wider text-gray-900">Pan-India Shipping</h4>
            </div>
            <div className="flex items-center gap-3">
                <ShieldCheck size={18} className="text-emerald-600" />
                <h4 className="font-black text-[10px] uppercase tracking-wider text-gray-900">100% Authentic</h4>
            </div>
            <div className="flex items-center gap-3">
                <CreditCard size={18} className="text-amber-600" />
                <h4 className="font-black text-[10px] uppercase tracking-wider text-gray-900">Secure Checkout</h4>
            </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-1 rounded-md">
                <Book className="text-white w-3.5 h-3.5" />
              </div>
              <span className="text-sm font-bold text-gray-900 tracking-tighter">
                IN.BOOK<span className="text-blue-600">STORE</span>
              </span>
            </div>
            
            <div className="hidden md:flex gap-3 border-l border-gray-200 pl-6">
              {[Instagram, Twitter, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
            <p className="text-[9px] font-black uppercase tracking-[0.15em] text-gray-400">
              © 2026 IN.BOOKSTORE PVT LTD
            </p>
            <span className="hidden md:block text-gray-200">|</span>
            <span className="text-[9px] font-black uppercase tracking-widest text-gray-300 italic">Made in India</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;