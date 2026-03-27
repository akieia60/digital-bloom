import { useState, lazy, Suspense, Component } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './components/tracker/Toast';
import Header from './components/Header';
import ShoppingCart from './components/ShoppingCart';

// Eagerly loaded — needed on first paint
import LandingPage from './pages/LandingPage';
import Shop from './pages/Shop';

// Lazily loaded — heavy or infrequently visited pages
const CategoryPage = lazy(() => import('./pages/CategoryPage'));
const ProductDetails = lazy(() => import('./components/ProductDetails'));
const ExperienceCredits = lazy(() => import('./pages/ExperienceCredits'));
const CreditBalance = lazy(() => import('./pages/CreditBalance'));
const Success = lazy(() => import('./pages/Success'));
const Admin = lazy(() => import('./pages/Admin'));
const PromptBrowser = lazy(() => import('./components/PromptBrowser'));
const Experience1 = lazy(() => import('./pages/Experience1'));
const FounderDashboard = lazy(() => import('./pages/FounderDashboard'));
const PromptVault = lazy(() => import('./pages/PromptVault'));
const ComingSoon = lazy(() => import('./pages/ComingSoon'));

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

function AppContent({ searchQuery, setSearchQuery }) {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  return (
    <>
      {!isLandingPage && <Header onSearchChange={setSearchQuery} searchQuery={searchQuery} />}
      <Suspense fallback={
        <div className="min-h-screen bg-obsidian flex items-center justify-center">
          <div className="w-10 h-10 border-2 border-pure-gold/20 border-t-pure-gold rounded-full animate-spin" />
        </div>
      }>
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
          <Route path="/vault" element={<PromptVault />} />
          <Route path="/balance" element={<CreditBalance />} />
          <Route path="/about" element={<ComingSoon />} />
          <Route path="/contact" element={<ComingSoon />} />
          <Route path="/checkout" element={<ComingSoon />} />
          <Route path="*" element={<ComingSoon />} />
        </Routes>
      </Suspense>
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
