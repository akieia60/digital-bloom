import { useState, useEffect, Component } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

/**
 * ErrorBoundary — catches any JavaScript error inside a child component tree,
 * logs it, and shows a friendly recovery screen instead of a full white page.
 * React requires this to be a class component.
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Log to console so you can see what broke in Vercel's function logs
    console.error('[Digital Bloom] Uncaught render error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh', background: '#FFFFFF', display: 'flex',
          flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          color: '#1D1D1F', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif', padding: '2rem', textAlign: 'center'
        }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Something went wrong</h1>
          <p style={{ color: '#6E6E73', maxWidth: '400px', marginBottom: '2rem' }}>
            We hit an unexpected error. Your cart and account are safe — just refresh to continue.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: '#1D1D1F', color: '#FFFFFF', border: 'none',
              padding: '0.75rem 2rem', borderRadius: '980px', fontSize: '1rem',
              cursor: 'pointer', fontWeight: '500'
            }}
          >
            Refresh Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import LandingPage from './pages/LandingPage';
import Shop from './pages/Shop';
import CategoryPage from './pages/CategoryPage';
import ProductDetails from './components/ProductDetails';
import ShoppingCart from './components/ShoppingCart';
import Success from './pages/Success';
import Admin from './pages/Admin';
import PromptBrowser from './components/PromptBrowser';
import ExperienceCredits from './pages/ExperienceCredits';
import CreditBalance from './pages/CreditBalance';
import Experience1 from './pages/Experience1';
import FounderDashboard from './pages/FounderDashboard';
// PromptVault removed from public routing (admin-only, kept in codebase)
import ComingSoon from './pages/ComingSoon';
import { ToastProvider } from './components/tracker/Toast';

function AppContent({ searchQuery, setSearchQuery }) {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  return (
    <>
      {!isLandingPage && <Header onSearchChange={setSearchQuery} searchQuery={searchQuery} />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/shop" element={<Shop searchQuery={searchQuery} setSearchQuery={setSearchQuery} />} />
        <Route path="/shop/:categorySlug" element={<CategoryPage />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/credits" element={<ExperienceCredits />} />
        <Route path="/credits/balance" element={<CreditBalance />} />
        <Route path="/success" element={<Success />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/prompts" element={<PromptBrowser />} />
        <Route path="/experience/1" element={<Experience1 />} />
        <Route path="/founder" element={<FounderDashboard />} />
        {/* Prompt Vault removed from public nav — admin only */}
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



  return (
    <ErrorBoundary>
    <ToastProvider>
    <CartProvider>
      <Router>
        <div className="min-h-screen bg-white relative overflow-x-hidden">
          {/* Content */}
          <div className="relative z-10">
            <ErrorBoundary>
              <AppContent searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            </ErrorBoundary>
          </div>
        </div>
      </Router>
    </CartProvider>
    </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
