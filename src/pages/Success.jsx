import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { updatePurchaseStatus } from '../lib/supabase';

const Success = () => {
  const [searchParams] = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);
  const [purchase, setPurchase] = useState(null);
  const [error, setError] = useState(null);

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const processPurchase = async () => {
      if (!sessionId) {
        setError('Invalid payment session');
        setIsProcessing(false);
        return;
      }

      try {
        // Update purchase status in database
        const updatedPurchase = await updatePurchaseStatus(sessionId, 'completed', {
          stripe_session_id: sessionId
        });

        if (updatedPurchase) {
          setPurchase(updatedPurchase);
        }
      } catch (err) {
        console.error('Error processing purchase:', err);
        setError('Failed to process purchase');
      } finally {
        setIsProcessing(false);
      }
    };

    processPurchase();
  }, [sessionId]);

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-primary-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <h2 className="text-xl font-semibold text-gray-900">Processing your order...</h2>
          <p className="text-gray-600 mt-2">Please wait while we confirm your payment</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            to="/"
            className="inline-block bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Return to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-lg text-gray-600 mb-8">
            Thank you for your purchase. Your order has been confirmed.
          </p>

          {/* Order Details */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
            <h3 className="font-semibold text-gray-900 mb-4">Order Details</h3>
            {purchase && (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order ID:</span>
                  <span className="font-medium text-gray-900">{purchase.id.substring(0, 8).toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-medium text-gray-900">${purchase.total_price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                    Completed
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* What's Next / Downloads */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 text-left">
            <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {purchase?.download_url ? 'Your Download' : "What's Next?"}
            </h3>

            {purchase?.download_url ? (
              <div className="space-y-4">
                <p className="text-sm text-blue-800">Your luxury digital art is ready!</p>
                {new Date(purchase.download_expires_at) > new Date() ? (
                  <div>
                    <a
                      href={purchase.download_url}
                      download
                      className="inline-block bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors shadow-sm"
                    >
                      Download MP4 Now
                    </a>
                    <p className="text-[10px] text-blue-500 mt-2 italic">
                      Restricted Access: Valid for 48 hours / 1 download.
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-red-600 font-semibold italic">Link expired (48h limit reached).</p>
                )}
              </div>
            ) : (
              <ul className="text-sm text-blue-800 space-y-1 ml-7">
                <li>You'll receive a confirmation email shortly</li>
                <li>Your order will be processed within 24 hours</li>
                <li>Track your order status in your account</li>
              </ul>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Continue Shopping
            </Link>
            <button
              onClick={() => window.print()}
              className="bg-gray-100 hover:bg-gray-200 text-gray-900 px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Print Receipt
            </button>
          </div>

          {/* Support */}
          <p className="text-sm text-gray-500 mt-8">
            Need help? <a href="mailto:support@bloomandpetal.com" className="text-primary-600 hover:text-primary-700 underline">Contact Support</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Success;
