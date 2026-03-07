import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Login from './pages/auth/Login';
import BookCatalog from './pages/user/BookCatalog';
import Cart from './pages/user/Cart';
import MyOrders from './pages/user/MyOrders';
import { Toaster } from 'react-hot-toast';
import Register from './pages/auth/Register';
import InvoicePage from './pages/user/InvoicePage';

// --- 1. PROTECTED ROUTE GUARD ---
// For pages like Catalog, Cart, and Orders
const ProtectedRoute = ({ children, allowedRole }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && role !== allowedRole) {
    // If they are a CUSTOMER trying to see ADMIN pages
    return <Navigate to="/catalog" replace />;
  }

  return children;
};

// --- 2. PUBLIC ROUTE GUARD ---
// Prevents logged-in users from seeing the Login/Register pages
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (token) {
    // If already logged in, send them to their dashboard
    return role === 'ADMIN' ? <Navigate to="/admin-dashboard" replace /> : <Navigate to="/catalog" replace />;
  }
  return children;
};

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
          }
        }}
      />
      
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar /> 
        <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Routes>
            {/* Public Routes (Guarded: If logged in, skip these) */}
            <Route path="/login" element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } />
            <Route path="/register" element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            } />

            {/* Customer Only Routes (Protected) */}
            <Route path="/catalog" element={
              <ProtectedRoute allowedRole="CUSTOMER">
                <BookCatalog />
              </ProtectedRoute>
            } />
            <Route path="/cart" element={
              <ProtectedRoute allowedRole="CUSTOMER">
                <Cart />
              </ProtectedRoute>
            } /> 
            <Route path="/my-orders" element={
              <ProtectedRoute allowedRole="CUSTOMER">
                <MyOrders />
              </ProtectedRoute>
            } /> 
            <Route path="/invoice/:id" element={
              <ProtectedRoute allowedRole="CUSTOMER">
                <InvoicePage />
              </ProtectedRoute>
            } />

            {/* Admin Only Routes (Protected) */}
            <Route path="/admin-dashboard" element={
              <ProtectedRoute allowedRole="ADMIN">
                <div className="p-10 text-center font-bold bg-white rounded-3xl shadow-sm border border-gray-100">
                  <h1 className="text-2xl text-blue-600">Admin Panel Access Granted</h1>
                  <p className="text-gray-500 mt-2">Welcome back, Boss.</p>
                </div>
              </ProtectedRoute>
            } />
            
            {/* Catch-all Redirection */}
            <Route path="/" element={<Navigate to="/catalog" />} />
            <Route path="*" element={<Navigate to="/catalog" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;