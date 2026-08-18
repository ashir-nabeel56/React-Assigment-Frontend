import { createContext, useContext, useState } from 'react';

// Create the CartContext
export const CartContext = createContext();

// Custom Hook for using cart
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// CartProvider Component
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Add to Cart
  const addToCart = (product, quantity = 1) => {
    setCartItems((prevItems) => {
      const productId = product.id || product._id;
      const existingItemIndex = prevItems.findIndex(
        (item) => (item.id || item._id) === productId && item.size === product.size && item.color === product.color
      );

      if (existingItemIndex > -1) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantity;
        return updatedItems;
      } else {
        return [...prevItems, { ...product, quantity }];
      }
    });
  };

  // Remove from Cart
  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => (item.id || item._id) !== id));
  };

  // Update Quantity
  const updateQuantity = (id, delta) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if ((item.id || item._id) === id) {
          const newQty = (item.quantity || 1) + delta;
          return { ...item, quantity: Math.max(1, newQty) };
        }
        return item;
      })
    );
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity }}>
      {children}
    </CartContext.Provider>
  );
};
