import { useCart } from '../context/CartContext';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  const handleIncrement = () => {
    updateQuantity(item.id, item.quantity + 1);
  };

  const handleDecrement = () => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1);
    } else {
      removeFromCart(item.id);
    }
  };

  const handleRemove = () => {
    removeFromCart(item.id);
  };

  return (
    <div className="flex items-center space-x-4 py-4 border-b border-gray-200">
      <div className="w-20 h-20 flex-shrink-0 rounded-md overflow-hidden bg-gradient-to-br from-dark-bg to-dark-secondary">
        {item.video_url ? (
          <video
            src={item.video_url}
            className="w-full h-full object-cover"
            muted
            autoPlay
            loop
            playsInline
          />
        ) : (
          <img
            src={item.image_url || item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-gray-900 truncate">
          {item.name}
        </h3>
        <p className="text-sm text-gray-500">${item.price}</p>

        <div className="flex items-center space-x-2 mt-2">
          <button
            onClick={handleDecrement}
            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
            aria-label="Decrease quantity"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>

          <span className="text-sm font-medium w-8 text-center">
            {item.quantity}
          </span>

          <button
            onClick={handleIncrement}
            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
            aria-label="Increase quantity"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex flex-col items-end space-y-2">
        <p className="text-lg font-semibold text-gray-900">
          ${(item.price * item.quantity).toFixed(2)}
        </p>

        <button
          onClick={handleRemove}
          className="text-red-500 hover:text-red-700 transition-colors"
          aria-label="Remove item"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CartItem;
