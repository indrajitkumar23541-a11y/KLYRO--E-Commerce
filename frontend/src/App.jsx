import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import Footer from './components/Footer';
import ProductExpert from './components/ProductExpert';
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
import SellerRegister from './pages/SellerRegister';
import WriteReview from './pages/WriteReview';
import TrackOrder from './pages/TrackOrder';
import ReturnOrder from './pages/ReturnOrder';
import SearchPage from './pages/SearchPage';
import GetStarted from './pages/GetStarted';
import Onboarding from './pages/Onboarding';
import ForgotPassword from './pages/ForgotPassword';

import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';

import Profile from './pages/Profile';
import SettingsPage from './pages/Settings'; 
import ErrorBoundary from './components/ErrorBoundary';

const AppContent = () => {
  return (
    <Routes>
      {/* ── STANDALONE SPLASH (no navbar/footer) ── */}
      <Route path="/" element={<Onboarding />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/get-started" element={<GetStarted />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* ── MAIN APP (with navbar/footer) ── */}
      <Route path="/*" element={
        <div className="flex flex-col min-h-screen bg-gray-50">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/home" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-success/:id" element={<OrderSuccess />} />
              <Route path="/order-success" element={<OrderSuccess />} />
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
              <Route path="/register-seller" element={<SellerRegister />} />
              <Route path="/product/:id/review" element={<WriteReview />} />
              <Route path="/order/:id/track" element={<TrackOrder />} />
              <Route path="/order/:id/return" element={<ReturnOrder />} />
              <Route path="/search" element={<SearchPage />} />
            </Routes>
          </main>
          <ProductExpert />
          <BottomNav />
          <Footer />
        </div>
      } />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <ThemeProvider>
            <ErrorBoundary>
              <AppContent />
            </ErrorBoundary>
          </ThemeProvider>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
