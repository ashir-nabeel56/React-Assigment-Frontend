import { createContext, useContext, useState } from 'react';

// 1. Context create karein
export const CartContext = createContext();

// 2. Custom Hook export karein (Taaki import { useCart } kaam kare)
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// 3. Provider Component
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Add to Cart (Duplicate item check ke sath)
  const addToCart = (product, quantity = 1) => {
    setCartItems((prevItems) => {
      const productId = product.id || product._id;
      const existingItemIndex = prevItems.findIndex(
        (item) => (item.id || item._id) === productId && item.size === product.size && item.color === product.color
      );

      if (existingItemIndex > -1) {
        // Agar same ID, Size, aur Color wala item pehle se majood hai
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantity;
        return updatedItems;
      } else {
        // Naya product add karein
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