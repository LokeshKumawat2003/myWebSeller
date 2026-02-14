import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { SellerProvider, useSeller } from './Seller/SellerContext';
import { AdminProvider, useAdmin } from './Admin/AdminContext';
import SellerLogin from './Seller/SellerLogin';
import SellerDashboard from './Seller/SellerDashboard';
import AdminLogin from './Admin/AdminLogin';
import AdminDashboard from './Admin/AdminDashboard';
import CartPage from './MainWeb/pages/CartPage';
import CheckoutPage from './MainWeb/pages/CheckoutPage';
import CheckoutSuccessPage from './MainWeb/pages/CheckoutSuccessPage';
import OrderHistory from './MainWeb/pages/OrderHistory';
import WishlistPage from './MainWeb/pages/WishlistPage';
import PrintInvoice from './pages/PrintInvoice';
import Home from './MainWeb/pages/Home';
import CategoryPage from './MainWeb/pages/CategoryPage';
import Search from './MainWeb/pages/Search';
import ProductDetail from './MainWeb/pages/ProductDetail';
import LoginPage from './MainWeb/pages/LoginPage';
import AuthSuccess from './MainWeb/pages/AuthSuccess';

function AppContent() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/:slug" element={<CategoryPage />} />
      <Route path="/search" element={<Search />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/print-invoice" element={<PrintInvoice />} />
      <Route path="/shopping-cart" element={<CartPage />} />
      <Route path="/wishlist" element={<WishlistPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/checkout/success" element={<CheckoutSuccessPage />} />
      <Route path="/orders" element={<OrderHistory />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/auth/success" element={<AuthSuccess />} />
      <Route path="/seller-login" element={<SellerLogin />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/seller-dashboard" element={<SellerDashboard />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
    </Routes>
  );
}

export default function App() {
  return (
    <SellerProvider>
      <AdminProvider>
        <AppContent />
      </AdminProvider>
    </SellerProvider>
  );
}
