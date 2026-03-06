import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Login from './pages/auth/Login';
import BookCatalog from './pages/user/BookCatalog';
import Cart from './pages/user/Cart';
import MyOrders from './pages/user/MyOrders';
import { Toaster } from 'react-hot-toast';
import Register from './pages/auth/Register';
import InvoicePage from './pages/user/InvoicePage';

function App() {
  return (
    <Router>
      <Toaster 
        position="top-center" 
        reverseOrder={false} 
        toastOptions={{
          style: {
            fontSize: '16px', 
            fontWeight: '600',
            borderRadius: '12px',
            padding: '16px',
            width: '90%', // Mobile friendly width
            maxWidth: '450px', // Desktop constraint
          }
        }}
      />
      
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar /> 
        {/* Added responsive horizontal padding (px-4) and vertical spacing (py-6) */}
        <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/catalog" element={<BookCatalog />} />
            <Route path="/cart" element={<Cart />} /> 
            <Route path="/my-orders" element={<MyOrders />} /> 
            <Route path="/register" element={<Register />} />
            <Route path="/invoice/:id" element={<InvoicePage />} />
            
            <Route path="/" element={<Navigate to="/catalog" />} />
            <Route path="*" element={<Navigate to="/catalog" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;