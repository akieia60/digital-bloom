import { useState, lazy, Suspense, Component } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { ToastProvider } from './components/tracker/Toast';

// Eagerly loaded — needed on first paint
import LandingPage from './pages/LandingPage';

// Lazily loaded — heavy or infrequently visited pages
const Header = lazy(() => import('./components/Header'));
const Shop = lazy(() => import('./pages/Shop'));
const CategoryPage = lazy(() => import('./pages/CategoryPage'));
const ProductDetails = lazy(() => import('./components/ProductDetails'));
const ExperienceCredits = lazy(() => import('./pages/ExperienceCredits'));
const CreditBalance = lazy(() => import('./pages/CreditBalance'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Success = lazy(() => import('./pages/Success'));
const Admin = lazy(() => import('./pages/Admin'));
const PromptBrowser = lazy(() => import('./components/PromptBrowser'));
const Experience1 = lazy(() => import('./pages/Experience1'));
const FounderDashboard = lazy(() => import('./pages/FounderDashboard'));
const BloomDelivery = lazy(() => import('./pages/BloomDelivery'));
const BloomManage = lazy(() => import('./pages/BloomManage'));
const ComingSoon = lazy(() => import('./pages/ComingSoon'));
const ShoppingCart = lazy(() => import('./components/ShoppingCart'));
const FAQ = lazy(() => import('./components/landing/FAQ'));
const FloatingCartButton = lazy(() => import('./components/FloatingCartButton'));

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
  const [isFaqOpen, setIsFaqOpen] = useState(false);

  const openFaq = () => setIsFaqOpen(true);
  const closeFaq = () => setIsFaqOpen(false);

  return (
    <>
      {!isLandingPage && (
        <Suspense fallback={null}>
          <Header onSearchChange={setSearchQuery} searchQuery={searchQuery} onOpenFaq={openFaq} />
        </Suspense>
      )}
      <Suspense fallback={
        <div className="min-h-screen bg-obsidian flex items-center justify-center">
          <div className="w-10 h-10 border-2 border-pure-gold/20 border-t-pure-gold rounded-full animate-spin" />
        </div>
      }>
        <Routes>
          <Route path="/" element={<LandingPage onOpenFaq={openFaq} />} />
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
          <Route path="/balance" element={<CreditBalance />} />
          <Route path="/about" element={<ComingSoon />} />
          <Route path="/contact" element={<ComingSoon />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/bloom/:id/manage" element={<BloomManage />} />
          <Route path="/bloom/:id" element={<BloomDelivery />} />
          <Route path="/gift/:id" element={<BloomDelivery />} />
          {/* /c/:slug creator portal removed 2026-05-07 — Bre uses
              /admin/archive.html → "Bre Pull" button now */}
          <Route path="*" element={
            <div style={{
              minHeight: '100vh', background: '#0D1B36', display: 'flex',
              flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              color: '#FFFFFF', fontFamily: "'Outfit', -apple-system, sans-serif",
              padding: '2rem', textAlign: 'center',
            }}>
              <p style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>404</p>
              <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.6rem', fontStyle: 'italic', color: '#D4AF37', marginBottom: '1rem' }}>
                Page Not Found
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.95rem', maxWidth: '360px', marginBottom: '2rem', lineHeight: 1.6 }}>
                The page you're looking for doesn't exist or may have moved.
              </p>
              <a href="/" style={{
                padding: '12px 32px', background: 'rgba(212,175,55,0.12)',
                border: '1px solid rgba(212,175,55,0.3)', borderRadius: '980px',
                color: '#D4AF37', fontSize: '0.85rem', fontWeight: 500,
                letterSpacing: '0.1em', textDecoration: 'none',
              }}>
                Return Home
              </a>
            </div>
          } />
        </Routes>
      </Suspense>
      <Suspense fallback={null}>
        <ShoppingCart />
      </Suspense>

      <Suspense fallback={null}>
        <FloatingCartButton />
      </Suspense>

      {/* Global FAQ modal */}
      <Suspense fallback={null}>
        <FAQ isOpen={isFaqOpen} onClose={closeFaq} />
      </Suspense>
    </>
  );
}

function App() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <ErrorBoundary>
      <ToastProvider>
        <LanguageProvider>
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
        </LanguageProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
