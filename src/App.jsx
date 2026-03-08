import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Login from './pages/auth/Login';
import BookCatalog from './pages/user/BookCatalog';
import Cart from './pages/user/Cart';
import MyOrders from './pages/user/MyOrders';
import { Toaster } from 'react-hot-toast';
import Register from './pages/auth/Register';
import AdminRegister from './pages/auth/AdminRegister';
import InvoicePage from './pages/user/InvoicePage';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageInventory from './pages/admin/ManageInventory';
import AdminOrders from './pages/admin/AdminOrders';
import AddBook from './pages/admin/AddBook';
import Footer from './components/layout/Footer';

const ProtectedRoute = ({ children, allowedRole }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && role !== allowedRole) {
    return <Navigate to="/catalog" replace />;
  }

  return children;
};

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (token) {
    return role === 'ADMIN' ? <Navigate to="/admin-dashboard" replace /> : <Navigate to="/catalog" replace />;
  }
  return children;
};

// function App() {
//   return (
//     <Router>
//       <Toaster 
//         position="top-center"
//         reverseOrder={false}
//         toastOptions={{
//           style: {
//             fontSize: '16px', 
//             fontWeight: '600',
//             borderRadius: '12px',
//           }
//         }}
//       />
      
//       <div className="min-h-screen bg-gray-50 flex flex-col">
//         <Navbar /> 
//         <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//           <Routes>
//             {/* Public Routes */}
//             <Route path="/login" element={
//               <PublicRoute>
//                 <Login />
//               </PublicRoute>
//             } />
//             <Route path="/register" element={
//               <PublicRoute>
//                 <Register />
//               </PublicRoute>
//             } />
//             {/* Added Admin Register as a Public Route */}
//             <Route path="/admin-register" element={
//               <PublicRoute> 
//                 <AdminRegister />
//               </PublicRoute>
//             } />

//             {/* Admin Only Routes */}
//             <Route path="/admin-dashboard" element={
//               <ProtectedRoute allowedRole="ADMIN">
//                 <AdminDashboard />
//               </ProtectedRoute>
//             } />

//             <Route path="/manage-inventory" element={
//               <ProtectedRoute allowedRole="ADMIN">
//                 <ManageInventory />
//               </ProtectedRoute>
//             } />
//             <Route 
//               path="/add-book" 
//               element={
//                 <ProtectedRoute allowedRole="ADMIN">
//                   <AddBook />
//                 </ProtectedRoute>
//               } 
//             />

//               <Route 
//                 path="/admin-orders" 
//                 element={
//                   <ProtectedRoute allowedRole="ADMIN">
//                     <AdminOrders />
//                   </ProtectedRoute>
//                 } 
//               />

//             {/* Customer Only Routes */}
//             <Route path="/catalog" element={
//               <ProtectedRoute allowedRole="CUSTOMER">
//                 <BookCatalog />
//               </ProtectedRoute>
//             } />
//             <Route path="/cart" element={
//               <ProtectedRoute allowedRole="CUSTOMER">
//                 <Cart />
//               </ProtectedRoute>
//             } /> 
//             <Route path="/my-orders" element={
//               <ProtectedRoute allowedRole="CUSTOMER">
//                 <MyOrders />
//               </ProtectedRoute>
//             } /> 
//             <Route path="/invoice/:id" element={
//               <ProtectedRoute allowedRole="CUSTOMER">
//                 <InvoicePage />
//               </ProtectedRoute>
//             } />
            
//             {/* Catch-all Redirection */}
//             <Route path="/" element={
//               <Navigate to={localStorage.getItem('role') === 'ADMIN' ? "/admin-dashboard" : "/catalog"} replace />
//             } />
//             <Route path="*" element={
//               <Navigate to={localStorage.getItem('role') === 'ADMIN' ? "/admin-dashboard" : "/catalog"} replace />
//             } />
//           </Routes>
//         </main>
//       </div>
//     </Router>
//   );
// }

// export default App;
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
        
        {/* Main takes available space */}
        <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
            <Route path="/admin-register" element={<PublicRoute><AdminRegister /></PublicRoute>} />

            {/* Admin Routes */}
            <Route path="/admin-dashboard" element={<ProtectedRoute allowedRole="ADMIN"><AdminDashboard /></ProtectedRoute>} />
            <Route path="/manage-inventory" element={<ProtectedRoute allowedRole="ADMIN"><ManageInventory /></ProtectedRoute>} />
            <Route path="/add-book" element={<ProtectedRoute allowedRole="ADMIN"><AddBook /></ProtectedRoute>} />
            <Route path="/admin-orders" element={<ProtectedRoute allowedRole="ADMIN"><AdminOrders /></ProtectedRoute>} />

            {/* Customer Routes */}
            <Route path="/catalog" element={<ProtectedRoute allowedRole="CUSTOMER"><BookCatalog /></ProtectedRoute>} />
            <Route path="/cart" element={<ProtectedRoute allowedRole="CUSTOMER"><Cart /></ProtectedRoute>} /> 
            <Route path="/my-orders" element={<ProtectedRoute allowedRole="CUSTOMER"><MyOrders /></ProtectedRoute>} /> 
            <Route path="/invoice/:id" element={<ProtectedRoute allowedRole="CUSTOMER"><InvoicePage /></ProtectedRoute>} />
      
            {/* Catch-all Redirection */}
             <Route path="/" element={
              <Navigate to={localStorage.getItem('role') === 'ADMIN' ? "/admin-dashboard" : "/catalog"} replace />
            } />
            <Route path="*" element={
              <Navigate to={localStorage.getItem('role') === 'ADMIN' ? "/admin-dashboard" : "/catalog"} replace />
            } />
          </Routes>
        </main>

        {/* 2. PLACE THE FOOTER HERE */}
        <Footer /> 
      </div>
    </Router>
  );
}

export default App;