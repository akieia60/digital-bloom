import { useState } from 'react';
import { useCart } from '../context/CartContext';
import CartItem from './CartItem';
import { createCartCheckoutSession, redirectToCheckout } from '../lib/stripe';

const ShoppingCart = () => {
  const { cartItems, isCartOpen, toggleCart, getCartTotal, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const total = getCartTotal();

  const handleCheckout = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      // Format cart items for Stripe
      const formattedItems = cartItems.map(item => ({
        product: item,
        quantity: item.quantity
      }));

      // Create checkout session
      const result = await createCartCheckoutSession(formattedItems);

      if (!result || !result.url) {
        throw new Error('Failed to create checkout session');
      }

      // Redirect to Stripe Checkout using the URL
      await redirectToCheckout(result.url);

    } catch (err) {
      console.error('Checkout error:', err);
      setError(err.message || 'Failed to proceed to checkout. Please try again.');
      setIsProcessing(false);
    }
  };

  if (!isCartOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={toggleCart}
      />

      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Shopping Cart</h2>
          <button
            onClick={toggleCart}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close cart"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6">
            <svg className="w-24 h-24 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h3>
            <p className="text-gray-500 text-center mb-6">
              Add some beautiful flowers to get started!
            </p>
            <button
              onClick={toggleCart}
              className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-6">
              {cartItems.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>

            <div className="border-t border-gray-200 p-6 space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="flex items-center justify-between text-lg">
                <span className="font-medium text-gray-900">Subtotal</span>
                <span className="font-bold text-gray-900">${total.toFixed(2)}</span>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isProcessing || cartItems.length === 0}
                className="w-full bg-rose-500 hover:bg-rose-600 text-white py-4 rounded-lg font-bold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
              >
                {isProcessing ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>Proceed to Checkout</span>
                    <span>→</span>
                  </>
                )}
              </button>

              <button
                onClick={toggleCart}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 py-3 rounded-lg font-semibold transition-colors duration-200"
              >
                Continue Shopping
              </button>

              {cartItems.length > 0 && (
                <button
                  onClick={clearCart}
                  className="w-full text-red-500 hover:text-red-700 py-2 text-sm font-medium transition-colors"
                >
                  Clear Cart
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ShoppingCart;
