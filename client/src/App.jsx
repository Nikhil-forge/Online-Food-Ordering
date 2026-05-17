import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import HomePage from './pages/HomePage';
import RestaurantsPage from './pages/RestaurantsPage';
import MenuPage from './pages/MenuPage';
import NutritionPage from './pages/NutritionPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import ProfilePage from './pages/ProfilePage';

// Admin Pages
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminManageRestaurants from './pages/admin/AdminManageRestaurants';
import AdminManageFoods from './pages/admin/AdminManageFoods';
import AdminManageOrders from './pages/admin/AdminManageOrders';
import AdminManageUsers from './pages/admin/AdminManageUsers';
import AdminReports from './pages/admin/AdminReports';

export default function App() {
  return (
    <AuthProvider>
        <div className="flex min-h-screen flex-col font-sans text-ink selection:bg-tomato/20">
          <Navbar />
          
          <div className="flex-1 flex flex-col">
            <Routes>
              {/* Core Unprotected Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/restaurants" element={<RestaurantsPage />} />
              <Route path="/restaurants/:id" element={<MenuPage />} />
              <Route path="/nutrition/:foodId" element={<NutritionPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/profile" element={<ProfilePage />} />

              {/* Admin Routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="restaurants" element={<AdminManageRestaurants />} />
                <Route path="foods" element={<AdminManageFoods />} />
                <Route path="orders" element={<AdminManageOrders />} />
                <Route path="users" element={<AdminManageUsers />} />
                <Route path="reports" element={<AdminReports />} />
              </Route>

              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>

          <Footer />
        </div>
    </AuthProvider>
  );
}
