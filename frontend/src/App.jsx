import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';

// User Pages
import ProductList from './pages/ProductList';
import SingleProduct from './pages/SingleProduct';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Checkout from './pages/Checkout';
import UserProfile from './pages/UserProfile';
import OrderSuccess from './pages/OrderSuccess';

// Admin Pages
import AdminLogin from './pages/AdminLogin';
import AdminSignup from './pages/AdminSignup';
import AdminDashboard from './pages/AdminDashboard';
import AdminOrders from './pages/AdminOrders';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Navbar />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<ProductList />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/products/:id" element={<SingleProduct />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/signup" element={<AdminSignup />} />

            {/* User private routes */}
            <Route
              path="/cart"
              element={
                <PrivateRoute requiredRole="user">
                  <Cart />
                </PrivateRoute>
              }
            />

            <Route
              path="/checkout"
              element={
                <PrivateRoute requiredRole="user">
                  <Checkout />
                </PrivateRoute>
              }
            />

            <Route
              path="/order-success/:orderId"
              element={
                <PrivateRoute requiredRole="user">
                  <OrderSuccess />
                </PrivateRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <PrivateRoute requiredRole="user">
                  <UserProfile />
                </PrivateRoute>
              }
            />

            <Route
              path="/profile/orders"
              element={
                <PrivateRoute requiredRole="user">
                  <UserProfile />
                </PrivateRoute>
              }
            />

            {/* Admin private routes */}
            <Route
              path="/admin/dashboard"
              element={
                <PrivateRoute requiredRole="admin">
                  <AdminDashboard />
                </PrivateRoute>
              }
            />

            <Route
              path="/admin/products"
              element={
                <PrivateRoute requiredRole="admin">
                  <AdminDashboard />
                </PrivateRoute>
              }
            />

            <Route
              path="/admin/orders"
              element={
                <PrivateRoute requiredRole="admin">
                  <AdminOrders />
                </PrivateRoute>
              }
            />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
