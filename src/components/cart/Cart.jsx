import React, { useState, useEffect } from 'react';
import './cart.css';
import { useCart } from './CartContext';

function Cart() {
  let cartItems = [];
  let removeFromCart = null;
  let updateQuantity = null;

  try {
    const context = useCart();
    cartItems = context?.cartItems || [];
    removeFromCart = context?.removeFromCart || null;
    updateQuantity = context?.updateQuantity || null;
  } catch (error) {
    console.error(error);
  }

  // LocalStorage State
  const [localCart, setLocalCart] = useState(() => {
    return JSON.parse(localStorage.getItem('cart')) || [];
  });

  // Direct sync check
  const displayItems = cartItems.length > 0 ? cartItems : localCart;

  const syncCartData = () => {
    const saved = JSON.parse(localStorage.getItem('cart')) || [];
    setLocalCart(saved);
  };

  useEffect(() => {
    window.addEventListener('cartUpdated', syncCartData);
    return () => window.removeEventListener('cartUpdated', syncCartData);
  }, []);

  // 1. Quantity Counter Handler (+ / -)
  const handleUpdateQuantity = (index, delta) => {
    const currentItem = displayItems[index];
    const newQty = (currentItem.quantity || 1) + delta;

    if (newQty < 1) return; // Quantity 1 se neeche nahi jayegi

    // Context sync
    if (updateQuantity && currentItem?.id) {
      updateQuantity(currentItem.id, newQty);
    }

    // LocalStorage sync
    const savedCart = JSON.parse(localStorage.getItem('cart')) || displayItems;
    const updatedCart = savedCart.map((item, idx) => {
      if (idx === index) {
        return { ...item, quantity: newQty };
      }
      return item;
    });

    setLocalCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  // 2. Remove / Delete Handler
  const handleRemoveFromCart = (index) => {
    const currentItem = displayItems[index];

    if (removeFromCart && currentItem?.id) {
      removeFromCart(currentItem.id);
    }

    const savedCart = JSON.parse(localStorage.getItem('cart')) || displayItems;
    const updatedCart = savedCart.filter((_, idx) => idx !== index);

    setLocalCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  // Price Calculations
  const subtotal = displayItems.reduce(
    (acc, item) => acc + (Number(item.price) || 0) * (item.quantity || 1),
    0
  );
  const discountRate = 0.20;
  const discount = subtotal * discountRate;
  const deliveryFee = subtotal > 0 ? 15 : 0;
  const total = subtotal - discount + deliveryFee;

  return (
    <div className="cart-page-container">
      <div className="cart-breadcrumb">
        Home <span>&gt;</span> <strong>Cart</strong>
      </div>

      <h1 className="cart-main-heading">YOUR CART</h1>

      {displayItems.length === 0 ? (
        <div className="empty-cart-msg">
          <h2>Aapka cart khali hai!</h2>
        </div>
      ) : (
        <div className="cart-content-grid">
          <div className="cart-items-list">
            {displayItems.map((item, index) => {
              const itemId = item.id || item._id || index;
              return (
                <React.Fragment key={`${itemId}-${index}`}>
                  <div className="cart-item-card">
                    <div className="cart-item-img-box">
                      <img
                        src={item.imageUrl || item.image}
                        alt={item.title || item.name}
                      />
                    </div>

                    <div className="cart-item-details">
                      <div className="cart-item-header">
                        <h3 className="cart-item-title">{item.title || item.name}</h3>
                        <button
                          className="delete-btn"
                          onClick={() => handleRemoveFromCart(index)}
                          title="Delete product"
                        >
                          🗑
                        </button>
                      </div>

                      <p className="cart-item-spec">
                        Size: <span>{item.size || 'Large'}</span>
                      </p>
                      <p className="cart-item-spec">
                        Color: <span>{item.color || 'White'}</span>
                      </p>

                      <div className="cart-item-bottom">
                        <span className="cart-item-price">${item.price}</span>

                        {/* Updated Quantity Controls */}
                        <div className="cart-qty-picker">
                          <button onClick={() => handleUpdateQuantity(index, -1)}>−</button>
                          <span>{item.quantity || 1}</span>
                          <button onClick={() => handleUpdateQuantity(index, 1)}>+</button>
                        </div>
                      </div>
                    </div>
                  </div>
                  {index < displayItems.length - 1 && <hr className="cart-divider" />}
                </React.Fragment>
              );
            })}
          </div>

          <div className="order-summary-box">
            <h2>Order Summary</h2>

            <div className="summary-row">
              <span className="summary-label">Subtotal</span>
              <span className="summary-value">${subtotal.toFixed(0)}</span>
            </div>

            <div className="summary-row">
              <span className="summary-label">Discount (-20%)</span>
              <span className="summary-value discount-text">
                -${discount.toFixed(0)}
              </span>
            </div>

            <div className="summary-row">
              <span className="summary-label">Delivery Fee</span>
              <span className="summary-value">${deliveryFee}</span>
            </div>

            <hr className="summary-divider" />

            <div className="summary-row total-row">
              <span>Total</span>
              <span className="total-amount">${total.toFixed(0)}</span>
            </div>

            <div className="promo-code-box">
              <div className="promo-input-wrapper">
                <span className="promo-icon">🏷</span>
                <input type="text" placeholder="Add promo code" />
              </div>
              <button className="apply-promo-btn">Apply</button>
            </div>

            <button className="checkout-btn">
              Go to Checkout <span>→</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;