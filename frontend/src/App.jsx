import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import Contact from './pages/Contact';
import Orders from './pages/Orders';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import BeautyHealth from './pages/BeautyHealth';
import BooksEducation from './pages/BooksEducation';
import Electronics from './pages/Electronics';
import Automotive from './pages/Automotive';
import Fashion from './pages/Fashion';
import Grocery from './pages/Grocery';
import HomeLiving from './pages/HomeLiving';
import KidsBaby from './pages/KidsBaby';
import SportsFitness from './pages/SportsFitness';
import Others from './pages/Others';
import Categories from './pages/Categories';
import Favorites from './pages/Favorites';

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

import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';

import Profile from './pages/Profile';
import SettingsPage from './pages/Settings'; // Renamed to avoid name clash with admin settings

const AppContent = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className={`flex flex-col min-h-screen ${isAdminRoute ? '' : 'bg-gray-50'}`}>
      {!isAdminRoute && <Navbar />}
      <main className={!isAdminRoute ? "flex-grow" : "h-screen w-full"}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success/:id" element={<OrderSuccess />} />
          <Route path="/beauty-health" element={<BeautyHealth />} />
          <Route path="/books-education" element={<BooksEducation />} />
          <Route path="/electronics" element={<Electronics />} />
          <Route path="/automotive" element={<Automotive />} />
          <Route path="/fashion" element={<Fashion />} />
          <Route path="/grocery" element={<Grocery />} />
          <Route path="/home-living" element={<HomeLiving />} />
          <Route path="/kids-baby" element={<KidsBaby />} />
          <Route path="/sports-fitness" element={<SportsFitness />} />
          <Route path="/others" element={<Others />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<SettingsPage />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminRoute />}>
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
        </Routes>
      </main>
      {!isAdminRoute && <BottomNav />}
      {!isAdminRoute && <Footer />}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <ThemeProvider>
            <AppContent />
          </ThemeProvider>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
