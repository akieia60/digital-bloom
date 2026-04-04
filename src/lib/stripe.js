import { loadStripe } from '@stripe/stripe-js';
import { getApiBase } from './apiBase';

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

if (!stripePublishableKey) {
  console.error('Missing Stripe publishable key!');
  console.error('Make sure VITE_STRIPE_PUBLISHABLE_KEY is set in your .env file');
}

// Initialize Stripe
export const stripePromise = loadStripe(stripePublishableKey || '');

/**
 * Create a Stripe Checkout session for a single product
 * @param {Object} product - Product object from database
 * @param {number} quantity - Quantity to purchase
 * @param {Object} customerInfo - Customer email and name (optional)
 * @returns {Promise<string|null>} Checkout session ID or null if error
 */
export const createCheckoutSession = async (product, quantity = 1, customerInfo = {}) => {
  const result = await createCartCheckoutSession([{ product, quantity }], null, customerInfo);
  return result?.sessionId || null;
};

/**
 * Create a Stripe Checkout session for multiple products (cart)
 * @param {Array} cartItems - Array of {product, quantity} objects
 * @param {Object} creditMetadata - Optional credit reservation metadata
 * @param {Object} customerInfo - Customer email and name (optional)
 * @returns {Promise<string|null>} Checkout session ID or null if error
 */
export const createCartCheckoutSession = async (cartItems, creditMetadata = null, customerInfo = {}) => {
  try {
    const successUrl = `${window.location.origin}/success`;
    const cancelUrl = window.location.href || window.location.origin;

    // Calculate total
    const totalPrice = cartItems.reduce((sum, item) =>
      sum + (item.product.price * item.quantity), 0
    );

    // Call backend API to create checkout session
    const apiUrl = getApiBase();
    const response = await fetch(`${apiUrl}/api/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cartItems,
        successUrl: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl,
        customerEmail: customerInfo.email,
        reservation_id: creditMetadata?.reservation_id,
        remaining_due_cents: creditMetadata?.remaining_due_cents,
        metadata: {
          total_items: cartItems.length,
          total_price: totalPrice,
          ...(creditMetadata?.reservation_id && { reservation_id: creditMetadata.reservation_id })
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create checkout session');
    }

    const { sessionId, url, free_checkout } = await response.json();
    return { sessionId, url, free_checkout };

  } catch (error) {
    console.error('Error creating cart checkout session:', error);
    throw error;
  }
};

/**
 * Redirect to Stripe Checkout
 * @param {string} checkoutUrl - Checkout session URL from Stripe
 */
export const redirectToCheckout = async (checkoutUrl) => {
  try {
    // Modern Stripe checkout redirect - use the checkout URL directly
    if (!checkoutUrl) {
      throw new Error('No checkout URL provided');
    }

    // Redirect directly to the Stripe Checkout page
    window.location.href = checkoutUrl;

  } catch (error) {
    console.error('Error in redirectToCheckout:', error);
    throw error;
  }
};

/**
 * Client-only checkout (simplified for development/testing)
 * Opens Stripe Payment Links directly
 * @param {Object} product - Product object
 * @param {number} quantity - Quantity to purchase
 */
export const checkoutWithPaymentLink = async (product, quantity = 1) => {
  try {
    // If you have Stripe Payment Links set up, you can use them directly
    if (product.stripe_payment_link) {
      window.location.href = `${product.stripe_payment_link}?quantity=${quantity}`;
      return true;
    }

    // Otherwise, show error
    throw new Error('Payment link not configured for this product');
  } catch (error) {
    console.error('Error with payment link:', error);
    return false;
  }
};
