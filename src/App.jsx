import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Login from './pages/auth/Login';
import BookCatalog from './pages/user/BookCatalog';
import Cart from './pages/user/Cart';
import MyOrders from './pages/user/MyOrders';
import { Toaster } from 'react-hot-toast';
import Register from './pages/auth/Register';

function App() {
  return (
    <Router>
      {/* This enables the top-right notifications globally */}
<Toaster 
  position="top-center" // Changed from top-right to top-center
  reverseOrder={false} 
  toastOptions={{
    // Default styling for all toasts
    style: {
      fontSize: '18px', // Bigger font
      fontWeight: 'bold',
      borderRadius: '16px',
      padding: '20px',
      minWidth: '350px', // Bigger width
    }
  }}
/>
      
      <div className="min-h-screen bg-gray-50">
        <Navbar /> 
        <main className="w-full">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/catalog" element={<BookCatalog />} />
            <Route path="/cart" element={<Cart />} /> 
            <Route path="/my-orders" element={<MyOrders />} /> 
            
            <Route path="/" element={<Navigate to="/catalog" />} />
            {/* Catch-all for undefined routes */}
            <Route path="*" element={<Navigate to="/catalog" />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;