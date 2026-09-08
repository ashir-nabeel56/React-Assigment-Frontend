import React from 'react';
import './cart.css';
import { toast } from 'react-toastify';
import { useCart } from './CartContext';
import { useNavigate } from 'react-router-dom';

function Cart() {

  const {
    cartItems,
    removeFromCart,
    updateQuantity,
  } = useCart();

  const navigate = useNavigate();

  // ==========================
  // CART ITEMS
  // ==========================

  const displayItems = cartItems || [];


  // ==========================
  // REMOVE ITEM
  // ==========================

  const handleRemoveFromCart = async (item) => {

    const productId =
      item?.productId ??
      item?.id ??
      item?._id;

    if (!productId) {

      console.error(
        'Product ID missing:',
        item
      );

      toast.error(
        'Item remove nahi ho saka.',
        {
          theme: 'dark',
        }
      );

      return;
    }

    try {

      await removeFromCart(productId);

      toast.success(
        'Item cart se remove ho gaya',
        {
          theme: 'dark',
        }
      );

    } catch (error) {

      console.error(
        'Remove from cart error:',
        error
      );

      toast.error(
        error?.message ||
        'Item remove nahi ho saka.',
        {
          theme: 'dark',
        }
      );
    }
  };


  // ==========================
  // QUANTITY UPDATE
  // ==========================

  const handleUpdateQuantity = async (
    item,
    delta
  ) => {

    const productId =
      item?.productId ??
      item?.id ??
      item?._id;

    if (!productId) {

      console.error(
        'Product ID missing:',
        item
      );

      return;
    }

    const currentQuantity =
      Number(item.quantity) || 1;

    const newQuantity =
      currentQuantity + delta;

    if (newQuantity < 1) {
      return;
    }

    try {

      await updateQuantity(
        productId,
        newQuantity
      );

    } catch (error) {

      console.error(
        'Quantity update error:',
        error
      );

      toast.error(
        error?.message ||
        'Quantity update nahi ho saki.',
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
    (acc, item) => {

      const price =
        Number(item.price) || 0;

      const quantity =
        Number(item.quantity) || 1;

      return acc + price * quantity;
    },

    0
  );


  const discountRate = 0.20;

  const discount =
    subtotal * discountRate;

  const deliveryFee =
    subtotal > 0 ? 15 : 0;

  const total =
    subtotal -
    discount +
    deliveryFee;


  // ==========================
  // PLACE ORDER
  // ==========================

  const handleCheckout = async () => {

    // --------------------------
    // CHECK LOGIN
    // --------------------------

    const token =
      localStorage.getItem('token');

    const isLoggedIn =
      localStorage.getItem('isLoggedIn') === 'true';


    if (!token || !isLoggedIn) {

      toast.error(
        'Order place karne ke liye pehle login karein.',
        {
          theme: 'dark',
        }
      );

      navigate('/login');

      return;
    }


    // --------------------------
    // CHECK CART
    // --------------------------

    if (
      !displayItems ||
      displayItems.length === 0
    ) {

      toast.error(
        'Aapka cart empty hai.',
        {
          theme: 'dark',
        }
      );

      return;
    }


    try {

      // --------------------------
      // SHOW LOADING TOAST
      // --------------------------

      toast.info(
        'Order place ho raha hai...',
        {
          theme: 'dark',
          autoClose: 1500,
        }
      );


      // --------------------------
      // API REQUEST
      // --------------------------

      const response = await fetch(
        'https://final-delta-ivory.vercel.app/orders',
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',

            Authorization:
              `Bearer ${token}`,
          },
        }
      );


      // --------------------------
      // RESPONSE
      // --------------------------

      const data =
        await response.json();


      // --------------------------
      // ERROR
      // --------------------------

      if (!response.ok) {

        throw new Error(
          data?.message ||
          'Order place nahi ho saka.'
        );
      }


      // --------------------------
      // ORDER SUCCESS
      // --------------------------

      console.log(
        'Order Created:',
        data.order
      );


      // --------------------------
      // CLEAR LOCAL CART
      // --------------------------

      localStorage.removeItem(
        'cart'
      );


      // --------------------------
      // CART UPDATE EVENT
      // --------------------------

      window.dispatchEvent(
        new Event('cartUpdated')
      );


      // --------------------------
      // ORDER UPDATE EVENT
      // --------------------------

      window.dispatchEvent(
        new Event('orderUpdated')
      );


      // --------------------------
      // SUCCESS MESSAGE
      // --------------------------

      toast.success(
        '🎉 Order successfully place ho gaya!',
        {
          theme: 'dark',
          autoClose: 2000,
        }
      );


      // --------------------------
      // GO TO ORDERS
      // --------------------------

      setTimeout(() => {

        navigate('/orders');

      }, 1200);


    } catch (error) {

      console.error(
        'Place Order Error:',
        error
      );


      toast.error(
        error?.message ||
        'Order place nahi ho saka.',
        {
          theme: 'dark',
          autoClose: 3000,
        }
      );
    }
  };


  // ==========================
  // UI
  // ==========================

  return (

    <div className="cart-page-container">


      {/* ==========================
          BREADCRUMB
      ========================== */}

      <div className="cart-breadcrumb">

        Home

        <span>
          &gt;
        </span>

        <strong>
          Cart
        </strong>

      </div>


      {/* ==========================
          HEADING
      ========================== */}

      <h1 className="cart-main-heading">
        YOUR CART
      </h1>


      {/* ==========================
          EMPTY CART
      ========================== */}

      {displayItems.length === 0 ? (

        <div className="empty-cart-msg">

          <h2>
            Aapka cart khali hai!
          </h2>

          <button
            type="button"
            onClick={() => navigate('/')}
            className="checkout-btn"
          >
            Continue Shopping
            <span>
              →
            </span>
          </button>

        </div>

      ) : (


        <div className="cart-content-grid">


          {/* ==========================
              CART ITEMS
          ========================== */}

          <div className="cart-items-list">


            {displayItems.map(
              (item, index) => {

                const itemId =
                  item?.productId ??
                  item?.id ??
                  item?._id ??
                  index;


                return (

                  <React.Fragment
                    key={String(itemId)}
                  >


                    <div className="cart-item-card">


                      {/* ==========================
                          IMAGE
                      ========================== */}

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


                      {/* ==========================
                          DETAILS
                      ========================== */}

                      <div className="cart-item-details">


                        <div className="cart-item-header">

                          <h3 className="cart-item-title">

                            {item.title ||
                              item.name ||
                              'Product'}

                          </h3>


                          <button
                            className="delete-btn"

                            onClick={() =>
                              handleRemoveFromCart(
                                item
                              )
                            }

                            title="Delete product"

                            type="button"
                          >
                            🗑
                          </button>

                        </div>


                        {/* SIZE */}

                        <p className="cart-item-spec">

                          Size:{' '}

                          <span>
                            {item.size ||
                              'Large'}
                          </span>

                        </p>


                        {/* COLOR */}

                        <p className="cart-item-spec">

                          Color:{' '}

                          <span>
                            {item.color ||
                              'White'}
                          </span>

                        </p>


                        {/* PRICE + QUANTITY */}

                        <div className="cart-item-bottom">


                          <span className="cart-item-price">

                            $
                            {Number(
                              item.price || 0
                            )}

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
                              {item.quantity ||
                                1}
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


                    {/* DIVIDER */}

                    {index <
                      displayItems.length - 1 && (

                      <hr
                        className="cart-divider"
                      />

                    )}


                  </React.Fragment>

                );

              }
            )}

          </div>


          {/* ==========================
              ORDER SUMMARY
          ========================== */}

          <div className="order-summary-box">


            <h2>
              Order Summary
            </h2>


            {/* SUBTOTAL */}

            <div className="summary-row">

              <span className="summary-label">
                Subtotal
              </span>

              <span className="summary-value">

                $
                {subtotal.toFixed(0)}

              </span>

            </div>


            {/* DISCOUNT */}

            <div className="summary-row">

              <span className="summary-label">
                Discount (-20%)
              </span>

              <span className="summary-value discount-text">

                -$
                {discount.toFixed(0)}

              </span>

            </div>


            {/* DELIVERY */}

            <div className="summary-row">

              <span className="summary-label">
                Delivery Fee
              </span>

              <span className="summary-value">

                $
                {deliveryFee}

              </span>

            </div>


            <hr className="summary-divider" />


            {/* TOTAL */}

            <div className="summary-row total-row">

              <span>
                Total
              </span>

              <span className="total-amount">

                $
                {total.toFixed(0)}

              </span>

            </div>


            {/* ==========================
                PROMO CODE
            ========================== */}

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


            {/* ==========================
                CHECKOUT BUTTON
            ========================== */}

            <button
              className="checkout-btn"
              type="button"
              onClick={handleCheckout}
            >

              Go to Checkout

              <span>
                →
              </span>

            </button>


          </div>


        </div>

      )}

    </div>
  );
}


export default Cart;