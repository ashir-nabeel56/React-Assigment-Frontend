import React from 'react';
import './cart.css';
import { toast } from 'react-toastify';
import { useCart } from './CartContext';

function Cart() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
  } = useCart();

  // ==========================
  // CART ITEMS
  // ==========================
  const displayItems = cartItems || [];

  // ==========================
  // REMOVE ITEM
  // ==========================
  const handleRemoveFromCart = async (item) => {
    const productId = item?.productId ?? item?.id;

    if (!productId) {
      console.error('Product ID missing:', item);

      toast.error('Item remove nahi ho saka.', {
        theme: 'dark',
      });

      return;
    }

    try {
      await removeFromCart(productId);

      toast.success('Item cart se remove ho gaya', {
        theme: 'dark',
      });
    } catch (error) {
      console.error('Remove from cart error:', error);

      toast.error(
        error?.message || 'Item remove nahi ho saka.',
        {
          theme: 'dark',
        }
      );
    }
  };

  // ==========================
  // QUANTITY UPDATE
  // ==========================
  const handleUpdateQuantity = async (item, delta) => {
    const productId = item?.productId ?? item?.id;

    if (!productId) {
      console.error('Product ID missing:', item);
      return;
    }

    const currentQuantity = Number(item.quantity) || 1;
    const newQuantity = currentQuantity + delta;

    if (newQuantity < 1) {
      return;
    }

    try {
      await updateQuantity(productId, newQuantity);
    } catch (error) {
      console.error('Quantity update error:', error);

      toast.error(
        error?.message || 'Quantity update nahi ho saki.',
        {
          theme: 'dark',
        }
      );
    }
  };

  // ==========================
  // PRICE CALCULATIONS
  // ==========================
  const subtotal = displayItems.reduce(
    (acc, item) =>
      acc +
      (Number(item.price) || 0) *
        (Number(item.quantity) || 1),
    0
  );

  const discountRate = 0.20;
  const discount = subtotal * discountRate;
  const deliveryFee = subtotal > 0 ? 15 : 0;
  const total = subtotal - discount + deliveryFee;

  // ==========================
  // UI
  // ==========================
  return (
    <div className="cart-page-container">

      <div className="cart-breadcrumb">
        Home <span>&gt;</span> <strong>Cart</strong>
      </div>

      <h1 className="cart-main-heading">
        YOUR CART
      </h1>

      {displayItems.length === 0 ? (
        <div className="empty-cart-msg">
          <h2>Aapka cart khali hai!</h2>
        </div>
      ) : (
        <div className="cart-content-grid">

          {/* ==========================
              CART ITEMS
          ========================== */}
          <div className="cart-items-list">

            {displayItems.map((item, index) => {

              const itemId =
                item?.productId ??
                item?.id ??
                item?._id ??
                index;

              return (
                <React.Fragment key={String(itemId)}>

                  <div className="cart-item-card">

                    {/* IMAGE */}
                    <div className="cart-item-img-box">
                      <img
                        src={
                          item.imageUrl ||
                          item.image ||
                          'https://via.placeholder.com/300'
                        }
                        alt={
                          item.title ||
                          item.name ||
                          'Product'
                        }
                      />
                    </div>

                    {/* DETAILS */}
                    <div className="cart-item-details">

                      <div className="cart-item-header">

                        <h3 className="cart-item-title">
                          {item.title || item.name}
                        </h3>

                        <button
                          className="delete-btn"
                          onClick={() =>
                            handleRemoveFromCart(item)
                          }
                          title="Delete product"
                          type="button"
                        >
                          🗑
                        </button>

                      </div>

                      <p className="cart-item-spec">
                        Size:{' '}
                        <span>
                          {item.size || 'Large'}
                        </span>
                      </p>

                      <p className="cart-item-spec">
                        Color:{' '}
                        <span>
                          {item.color || 'White'}
                        </span>
                      </p>

                      <div className="cart-item-bottom">

                        <span className="cart-item-price">
                          ${Number(item.price || 0)}
                        </span>

                        <div className="cart-qty-picker">

                          <button
                            type="button"
                            onClick={() =>
                              handleUpdateQuantity(
                                item,
                                -1
                              )
                            }
                          >
                            −
                          </button>

                          <span>
                            {item.quantity || 1}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              handleUpdateQuantity(
                                item,
                                1
                              )
                            }
                          >
                            +
                          </button>

                        </div>

                      </div>

                    </div>
                  </div>

                  {index < displayItems.length - 1 && (
                    <hr className="cart-divider" />
                  )}

                </React.Fragment>
              );
            })}

          </div>

          {/* ==========================
              ORDER SUMMARY
          ========================== */}
          <div className="order-summary-box">

            <h2>
              Order Summary
            </h2>

            <div className="summary-row">
              <span className="summary-label">
                Subtotal
              </span>

              <span className="summary-value">
                ${subtotal.toFixed(0)}
              </span>
            </div>

            <div className="summary-row">
              <span className="summary-label">
                Discount (-20%)
              </span>

              <span className="summary-value discount-text">
                -${discount.toFixed(0)}
              </span>
            </div>

            <div className="summary-row">
              <span className="summary-label">
                Delivery Fee
              </span>

              <span className="summary-value">
                ${deliveryFee}
              </span>
            </div>

            <hr className="summary-divider" />

            <div className="summary-row total-row">
              <span>
                Total
              </span>

              <span className="total-amount">
                ${total.toFixed(0)}
              </span>
            </div>

            {/* PROMO */}
            <div className="promo-code-box">

              <div className="promo-input-wrapper">
                <span className="promo-icon">
                  🏷
                </span>

                <input
                  type="text"
                  placeholder="Add promo code"
                />
              </div>

              <button
                className="apply-promo-btn"
                type="button"
              >
                Apply
              </button>

            </div>

            {/* CHECKOUT */}
            <button
              className="checkout-btn"
              type="button"
            >
              Go to Checkout
              <span>→</span>
            </button>

          </div>

        </div>
      )}
    </div>
  );
}

export default Cart;
