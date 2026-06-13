import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';

// Admin Imports
import AdminRoute from './components/AdminRoute';
import Dashboard from './pages/admin/Dashboard';
import ProductList from './pages/admin/ProductList';
import OrderList from './pages/admin/OrderList';
import UserList from './pages/admin/UserList';
import CategoryList from './pages/admin/CategoryList';
import SellerList from './pages/admin/SellerList';
import PaymentList from './pages/admin/PaymentList';
import Analytics from './pages/admin/Analytics';
import Settings from './pages/admin/Settings';

import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary';

const Unauthorized = () => {
  const { logout } = useAuth();
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-center text-white">
      <div className="max-w-md bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
        <h1 className="text-3xl font-black text-rose-500 uppercase tracking-tight mb-4">Access Denied</h1>
        <p className="text-slate-400 text-sm mb-6 font-medium leading-relaxed">
          This portal is reserved for platform administrators only. Please sign in with an administrator account.
        </p>
        <button 
          onClick={() => { logout(); window.location.href = '/login'; }}
          className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black uppercase tracking-wider"
        >
          Return to Login
        </button>
      </div>
    </div>
  );
};

const AppContent = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="h-screen w-full">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Admin Dashboard Routes */}
          <Route path="/" element={<AdminRoute />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<ProductList />} />
            <Route path="categories" element={<CategoryList />} />
            <Route path="orders" element={<OrderList />} />
            <Route path="users" element={<UserList />} />
            <Route path="sellers" element={<SellerList />} />
            <Route path="payments" element={<PaymentList />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Catch-all redirect to dashboard */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <ThemeProvider>
          <ErrorBoundary>
            <AppContent />
          </ErrorBoundary>
        </ThemeProvider>
      </Router>
    </AuthProvider>
  );
}

export default App;
