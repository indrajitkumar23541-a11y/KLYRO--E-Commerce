import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import SellerRegister from './pages/SellerRegister';

// Seller Imports
import SellerRoute from './components/SellerRoute';
import SellerDashboard from './pages/seller/Dashboard';
import SellerProducts from './pages/seller/ProductManagement';
import SellerOrders from './pages/seller/OrderManagement';
import SellerAnalytics from './pages/seller/Analytics';
import SellerSettings from './pages/seller/Settings';
import CustomerManagement from './pages/seller/CustomerManagement';
import ReviewManagement from './pages/seller/ReviewManagement';
import MarketingManagement from './pages/seller/MarketingManagement';
import Payments from './pages/seller/Payments';

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
          This portal is reserved for registered KLYRO sellers. Please log in with a seller account.
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
          <Route path="/register" element={<SellerRegister />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Seller Dashboard Routes */}
          <Route path="/" element={<SellerRoute />}>
            <Route index element={<SellerDashboard />} />
            <Route path="products" element={<SellerProducts />} />
            <Route path="inventory" element={<SellerProducts />} />
            <Route path="orders" element={<SellerOrders />} />
            <Route path="analytics" element={<SellerAnalytics />} />
            <Route path="customers" element={<CustomerManagement />} />
            <Route path="reviews" element={<ReviewManagement />} />
            <Route path="marketing" element={<MarketingManagement />} />
            <Route path="payments" element={<Payments />} />
            <Route path="settings" element={<SellerSettings />} />
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
