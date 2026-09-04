import { createContext, useContext, useEffect, useState } from 'react';
import {
  addToCartAPI,
  getCartAPI,
  updateCartAPI,
  removeFromCartAPI,
} from '../../api/backendapi';

export const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }

  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // ==========================
  // GET CART FROM MONGODB
  // ==========================
  const loadCart = async () => {
    try {
      const result = await getCartAPI();

      const items = result?.cart?.items || [];

      const formattedItems = items
        .filter((item) => item.product)
        .map((item) => ({
          ...item.product,

          // Backend ka custom productId
          productId: item.product.productId,

          // Mongo _id bhi preserve
          _id: item.product._id,

          quantity: item.quantity,
        }));

      setCartItems(formattedItems);
    } catch (error) {
      console.error('Load Cart Error:', error);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  // ==========================
  // ADD TO CART
  // ==========================
  const addToCart = async (product, quantity = 1) => {
    try {
      const productId = product.productId ?? product.id;

      if (!productId) {
        throw new Error('Product ID missing hai');
      }

      await addToCartAPI(productId, quantity);

      await loadCart();
    } catch (error) {
      console.error('Add to cart error:', error);
      throw error;
    }
  };

  // ==========================
  // REMOVE FROM CART
  // ==========================
  const removeFromCart = async (productId) => {
    try {
      if (!productId) {
        throw new Error('Product ID missing hai');
      }

      await removeFromCartAPI(productId);

      // MongoDB se successful remove ke baad
      // React state bhi update
      setCartItems((prevItems) =>
        prevItems.filter(
          (item) => String(item.productId) !== String(productId)
        )
      );

      // LocalStorage agar old cart save hai to usko bhi update
      const localCart =
        JSON.parse(localStorage.getItem('cart')) || [];

      const updatedLocalCart = localCart.filter(
        (item) =>
          String(item.productId ?? item.id ?? item._id) !==
          String(productId)
      );

      localStorage.setItem(
        'cart',
        JSON.stringify(updatedLocalCart)
      );

      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      console.error('Remove cart error:', error);
      throw error;
    }
  };

  // ==========================
  // UPDATE QUANTITY
  // ==========================
  const updateQuantity = async (productId, quantity) => {
    try {
      if (!productId) {
        throw new Error('Product ID missing hai');
      }

      const result = await updateCartAPI(productId, quantity);

      const items = result?.cart?.items || [];

      const formattedItems = items
        .filter((item) => item.product)
        .map((item) => ({
          ...item.product,
          productId: item.product.productId,
          _id: item.product._id,
          quantity: item.quantity,
        }));

      setCartItems(formattedItems);
    } catch (error) {
      console.error('Update quantity error:', error);
      throw error;
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        loadCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};