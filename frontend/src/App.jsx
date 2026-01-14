import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './components/layout/MainLayout';
import AdminLayout from './components/layout/AdminLayout';
import { Toaster } from 'react-hot-toast';

// Public Pages
import Home from './pages/Home/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ProductList from './pages/Product/ProductList';
import ProductDetail from './pages/Product/ProductDetail';
import Categories from './pages/Product/Categories';
import Watchlist from './pages/User/Watchlist';
import Cart from './pages/Cart/Cart';
import Profile from './pages/User/Profile';
import About from './pages/Home/About';

// Checkout Pages
import Shipping from './pages/Order/Shipping';
import Payment from './pages/Order/Payment';
import OrderSuccess from './pages/Order/OrderSuccess';
import OrderDetail from './pages/Order/OrderDetail';

// Admin Pages
import Dashboard from './pages/Admin/Dashboard';
import ProductListAdmin from './pages/Admin/ProductListAdmin';
import OrderListAdmin from './pages/Admin/OrderListAdmin';
import UserListAdmin from './pages/Admin/UserListAdmin';
import ReviewListAdmin from './pages/Admin/ReviewListAdmin';
import ProductForm from './pages/Admin/ProductForm';

const NotFound = () => <div className="p-8 text-center text-3xl font-bold text-red-400">404 - Page Not Found</div>;

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Main User Layout */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<About />} />

            <Route path="/products" element={<ProductList />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/watchlist" element={<Watchlist />} />

            <Route path="/cart" element={<Cart />} />
            <Route path="/profile" element={<Profile />} />

            {/* Checkout Routes */}
            <Route path="/shipping" element={<Shipping />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/success" element={<OrderSuccess />} />
            <Route path="/order/:id" element={<OrderDetail />} />
          </Route>

          {/* Admin Layout */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="products" element={<ProductListAdmin />} />
            <Route path="orders" element={<OrderListAdmin />} />
            <Route path="users" element={<UserListAdmin />} />
            <Route path="reviews" element={<ReviewListAdmin />} />
            {/* Add New/Edit Product routes here later */}
            <Route path="product/new" element={<ProductForm />} />
            <Route path="product/:id/edit" element={<ProductForm />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster position="top-right" reverseOrder={false} />
      </AuthProvider>
    </Router>
  );
}

export default App;
