import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductGrid from './components/ProductGrid';
import ProductDetails from './components/ProductDetails';
import ShoppingCart from './components/ShoppingCart';
import Success from './pages/Success';
import Admin from './pages/Admin';
import PromptBrowser from './components/PromptBrowser';

function AppContent({ searchQuery, setSearchQuery }) {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <>
      <Header onSearchChange={setSearchQuery} searchQuery={searchQuery} />
      {isHomePage && <Hero />}
      <Routes>
        <Route path="/" element={<ProductGrid searchQuery={searchQuery} />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/success" element={<Success />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/prompts" element={<PromptBrowser />} />
      </Routes>
      <ShoppingCart />
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
    <CartProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-dark-bg to-dark-secondary relative">
          {/* Floating particles background */}
          <div className="particles" id="particles"></div>

          {/* Content */}
          <div className="relative z-10">
            <AppContent searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          </div>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
