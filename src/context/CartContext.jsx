import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

const createLineItemId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `line_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
};

const withLineItemIds = (items = []) =>
  items.map((item) => ({
    ...item,
    lineItemId: item.lineItemId || createLineItemId(),
  }));

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('flowerShopCart');
    return savedCart ? withLineItemIds(JSON.parse(savedCart)) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('flowerShopCart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1, customization = null) => {
    setCartItems(prevItems => {
      // For luxury bespoke items, we check if the EXACT same customization exists
      const existingItem = prevItems.find(item => 
        item.id === product.id && 
        JSON.stringify(item.customization) === JSON.stringify(customization)
      );

      if (existingItem) {
        return prevItems.map(item =>
          (item.id === product.id && JSON.stringify(item.customization) === JSON.stringify(customization))
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [...prevItems, { ...product, lineItemId: createLineItemId(), quantity, customization }];
    });
  };

  const removeFromCart = (targetId) => {
    setCartItems(prevItems =>
      prevItems.filter(item => (item.lineItemId || item.id) !== targetId)
    );
  };

  const updateQuantity = (targetId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(targetId);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        (item.lineItemId || item.id) === targetId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const toggleCart = () => {
    setIsCartOpen(prev => !prev);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
    isCartOpen,
    toggleCart,
    setIsCartOpen
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
