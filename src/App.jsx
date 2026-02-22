import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import LandingPage from './pages/LandingPage';
import Shop from './pages/Shop';
import ProductDetails from './components/ProductDetails';
import ShoppingCart from './components/ShoppingCart';
import Success from './pages/Success';
import Admin from './pages/Admin';
import PromptBrowser from './components/PromptBrowser';
import ExperienceCredits from './pages/ExperienceCredits';
import CreditBalance from './pages/CreditBalance';
import Experience1 from './pages/Experience1';
import FounderDashboard from './pages/FounderDashboard';
import PromptVault from './pages/PromptVault';
import ComingSoon from './pages/ComingSoon';
import { ToastProvider } from './components/tracker/Toast';

function AppContent({ searchQuery, setSearchQuery }) {
  const location = useLocation();
  const isShopPage = location.pathname === '/shop';
  const isLandingPage = location.pathname === '/';

  return (
    <>
      {!isLandingPage && <Header onSearchChange={setSearchQuery} searchQuery={searchQuery} />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/shop" element={<Shop searchQuery={searchQuery} setSearchQuery={setSearchQuery} />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/credits" element={<ExperienceCredits />} />
        <Route path="/credits/balance" element={<CreditBalance />} />
        <Route path="/success" element={<Success />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/prompts" element={<PromptBrowser />} />
        <Route path="/experience/1" element={<Experience1 />} />
        <Route path="/founder" element={<FounderDashboard />} />
        <Route path="/vault" element={<PromptVault />} />
        <Route path="/balance" element={<CreditBalance />} />
        <Route path="/about" element={<ComingSoon />} />
        <Route path="/contact" element={<ComingSoon />} />
        <Route path="/checkout" element={<ComingSoon />} />
        {/* Catch-all for unknown routes */}
        <Route path="*" element={<ComingSoon />} />
      </Routes>
      {!isLandingPage && <ShoppingCart />}
    </>
  );
}

function App() {
  const [searchQuery, setSearchQuery] = useState('');

  // Create floating particles
  useEffect(() => {
    const container = document.getElementById('particles');
    if (!container) return;

    for (let i = 0; i < 30; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 15 + 's';
      particle.style.animationDuration = (10 + Math.random() * 10) + 's';
      container.appendChild(particle);
    }

    return () => {
      if (container) {
        container.innerHTML = '';
      }
    };
  }, []);

  return (
    <ToastProvider>
    <CartProvider>
      <Router>
        <div className="min-h-screen bg-obsidian relative overflow-x-hidden">
          {/* Subtle Atmosphere */}
          <div className="fixed inset-0 bg-[#050510] pointer-events-none"></div>
          <div className="particles opacity-30" id="particles"></div>

          {/* Content */}
          <div className="relative z-10">
            <AppContent searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          </div>
        </div>
      </Router>
    </CartProvider>
    </ToastProvider>
  );
}

export default App;
