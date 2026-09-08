import { toast } from "react-toastify";
import { useCart } from "./CartContext";
import { useNavigate } from "react-router-dom";
import "./cart.css";
function Cart() {
    const {
        cartItems,
        removeFromCart,
        updateQuantity,
    } = useCart();

    const navigate = useNavigate();

    const displayItems = cartItems || [];


    // ==========================================
    // CALCULATIONS
    // ==========================================

    const subtotal = displayItems.reduce((total, item) => {
        const price = Number(item?.price || 0);
        const quantity = Number(item?.quantity || 1);

        return total + price * quantity;
    }, 0);


    const discountRate = 0.20;

    const discount = subtotal * discountRate;

    const deliveryFee = subtotal > 0 ? 15 : 0;

    const total = subtotal - discount + deliveryFee;


    // ==========================================
    // REMOVE ITEM
    // ==========================================

    const handleRemove = async (productId) => {
        try {
            await removeFromCart(productId);

            toast.success("Product removed from cart");
        } catch (error) {
            console.error("Remove cart error:", error);

            toast.error(
                error?.message || "Failed to remove product"
            );
        }
    };


    // ==========================================
    // UPDATE QUANTITY
    // ==========================================

    const handleQuantityChange = async (
        productId,
        quantity
    ) => {
        if (quantity < 1) {
            return;
        }

        try {
            await updateQuantity(
                productId,
                quantity
            );
        } catch (error) {
            console.error(
                "Quantity update error:",
                error
            );

            toast.error(
                error?.message ||
                "Failed to update quantity"
            );
        }
    };


    // ==========================================
    // CHECKOUT / PLACE ORDER
    // ==========================================

    const handleCheckout = async () => {
        const token =
            localStorage.getItem("token");

        const isLoggedIn =
            localStorage.getItem("isLoggedIn");


        // ------------------------------------------
        // LOGIN CHECK
        // ------------------------------------------

        if (
            !token ||
            isLoggedIn !== "true"
        ) {
            toast.error(
                "Please login before placing your order"
            );

            navigate("/login");

            return;
        }


        // ------------------------------------------
        // EMPTY CART CHECK
        // ------------------------------------------

        if (displayItems.length === 0) {
            toast.error("Your cart is empty");

            return;
        }


        try {
            toast.info("Placing your order...");


            // ------------------------------------------
            // PLACE ORDER
            // ------------------------------------------

            const response = await fetch(
                "https://final-delta-ivory.vercel.app/orders",
                {
                    method: "POST",

                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type":
                            "application/json",
                        Accept: "application/json",
                    },
                }
            );


            // ------------------------------------------
            // READ RESPONSE
            // ------------------------------------------

            const data =
                await response.json().catch(
                    () => ({})
                );


            console.log(
                "Place Order Status:",
                response.status
            );

            console.log(
                "Place Order Response:",
                data
            );


            // ------------------------------------------
            // ERROR
            // ------------------------------------------

            if (!response.ok) {
                throw new Error(
                    data?.error ||
                    data?.message ||
                    "Failed to place order"
                );
            }


            // ------------------------------------------
            // SUCCESS
            // ------------------------------------------

            console.log(
                "Order Created:",
                data?.order
            );


            // Clear local cart
            localStorage.removeItem("cart");


            // Notify cart
            window.dispatchEvent(
                new Event("cartUpdated")
            );


            // Notify orders
            window.dispatchEvent(
                new Event("orderUpdated")
            );


            toast.success(
                "Order placed successfully!"
            );


            // ------------------------------------------
            // GO TO ORDERS
            // ------------------------------------------

            setTimeout(() => {
                navigate("/orders");
            }, 1000);

        } catch (error) {
            console.error(
                "Checkout Error:",
                error
            );

            toast.error(
                error?.message ||
                "Failed to place order"
            );
        }
    };


    // ==========================================
    // EMPTY CART
    // ==========================================

    if (displayItems.length === 0) {
        return (
            <div className="cart-page">

                <div className="empty-cart">

                    <div className="empty-cart-icon">
                        🛒
                    </div>

                    <h2>
                        Your Cart is Empty
                    </h2>

                    <p>
                        Add some products to your
                        cart before checkout.
                    </p>

                    <button
                        onClick={() =>
                            navigate("/productlist")
                        }
                    >
                        Continue Shopping
                    </button>

                </div>

            </div>
        );
    }


    // ==========================================
    // CART UI
    // ==========================================

    return (
        <div className="cart-page">

            <div className="cart-container">

                <div className="cart-header">

                    <h1>
                        Shopping Cart
                    </h1>

                    <p>
                        {displayItems.length}{" "}
                        {displayItems.length === 1
                            ? "item"
                            : "items"}{" "}
                        in your cart
                    </p>

                </div>


                <div className="cart-content">

                    {/* ==================================
                        CART ITEMS
                    ================================== */}

                    <div className="cart-items">

                        {displayItems.map(
                            (item, index) => {

                                const productId =
                                    item?.productId ||
                                    item?.product?._id ||
                                    item?._id ||
                                    item?.id;

                                const price =
                                    Number(
                                        item?.price ||
                                        item?.product?.price ||
                                        0
                                    );

                                const quantity =
                                    Number(
                                        item?.quantity || 1
                                    );

                                const image =
                                    item?.imageUrl ||
                                    item?.image ||
                                    item?.product?.imageUrl ||
                                    item?.product?.image ||
                                    "";

                                const title =
                                    item?.title ||
                                    item?.product?.title ||
                                    "Product";

                                return (
                                    <div
                                        className="cart-item"
                                        key={
                                            item?._id ||
                                            productId ||
                                            index
                                        }
                                    >

                                        {/* IMAGE */}

                                        <div className="cart-item-image">

                                            {image ? (
                                                <img
                                                    src={image}
                                                    alt={title}
                                                />
                                            ) : (
                                                <span>
                                                    🛍️
                                                </span>
                                            )}

                                        </div>


                                        {/* INFO */}

                                        <div className="cart-item-info">

                                            <h3>
                                                {title}
                                            </h3>

                                            <p>
                                                $
                                                {price.toFixed(2)}
                                            </p>

                                        </div>


                                        {/* QUANTITY */}

                                        <div className="quantity-controls">

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleQuantityChange(
                                                        productId,
                                                        quantity - 1
                                                    )
                                                }
                                                disabled={
                                                    quantity <= 1
                                                }
                                            >
                                                -
                                            </button>

                                            <span>
                                                {quantity}
                                            </span>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleQuantityChange(
                                                        productId,
                                                        quantity + 1
                                                    )
                                                }
                                            >
                                                +
                                            </button>

                                        </div>


                                        {/* ITEM TOTAL */}

                                        <strong className="cart-item-total">
                                            $
                                            {(
                                                price *
                                                quantity
                                            ).toFixed(2)}
                                        </strong>


                                        {/* REMOVE */}

                                        <button
                                            type="button"
                                            className="remove-item"
                                            onClick={() =>
                                                handleRemove(
                                                    productId
                                                )
                                            }
                                        >
                                            Remove
                                        </button>

                                    </div>
                                );
                            }
                        )}

                    </div>


                    {/* ==================================
                        SUMMARY
                    ================================== */}

                    <div className="cart-summary">

                        <h2>
                            Order Summary
                        </h2>


                        <div className="summary-row">

                            <span>
                                Subtotal
                            </span>

                            <strong>
                                $
                                {subtotal.toFixed(2)}
                            </strong>

                        </div>


                        <div className="summary-row">

                            <span>
                                Discount
                            </span>

                            <strong className="discount">
                                -$
                                {discount.toFixed(2)}
                            </strong>

                        </div>


                        <div className="summary-row">

                            <span>
                                Delivery
                            </span>

                            <strong>
                                $
                                {deliveryFee.toFixed(2)}
                            </strong>

                        </div>


                        <div className="summary-total">

                            <span>
                                Total
                            </span>

                            <strong>
                                $
                                {total.toFixed(2)}
                            </strong>

                        </div>


                        <button
                            type="button"
                            className="checkout-btn"
                            onClick={handleCheckout}
                        >
                            Place Order
                        </button>


                        <button
                            type="button"
                            className="continue-shopping"
                            onClick={() =>
                                navigate("/productlist")
                            }
                        >
                            Continue Shopping
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Cart;












// import React from 'react';
// // import './cart.css';
// import { toast } from 'react-toastify';
// import { useCart } from './CartContext';
// import { useNavigate } from 'react-router-dom';

// function Cart() {

//   const {
//     cartItems,
//     removeFromCart,
//     updateQuantity,
//   } = useCart();

//   const navigate = useNavigate();

//   // ==========================
//   // CART ITEMS
//   // ==========================

//   const displayItems = cartItems || [];


//   // ==========================
//   // REMOVE ITEM
//   // ==========================

//   const handleRemoveFromCart = async (item) => {

//     const productId =
//       item?.productId ??
//       item?.id ??
//       item?._id;

//     if (!productId) {

//       console.error(
//         'Product ID missing:',
//         item
//       );

//       toast.error(
//         'Item remove nahi ho saka.',
//         {
//           theme: 'dark',
//         }
//       );

//       return;
//     }

//     try {

//       await removeFromCart(productId);

//       toast.success(
//         'Item cart se remove ho gaya',
//         {
//           theme: 'dark',
//         }
//       );

//     } catch (error) {

//       console.error(
//         'Remove from cart error:',
//         error
//       );

//       toast.error(
//         error?.message ||
//         'Item remove nahi ho saka.',
//         {
//           theme: 'dark',
//         }
//       );
//     }
//   };


//   // ==========================
//   // QUANTITY UPDATE
//   // ==========================

//   const handleUpdateQuantity = async (
//     item,
//     delta
//   ) => {

//     const productId =
//       item?.productId ??
//       item?.id ??
//       item?._id;

//     if (!productId) {

//       console.error(
//         'Product ID missing:',
//         item
//       );

//       return;
//     }

//     const currentQuantity =
//       Number(item.quantity) || 1;

//     const newQuantity =
//       currentQuantity + delta;

//     if (newQuantity < 1) {
//       return;
//     }

//     try {

//       await updateQuantity(
//         productId,
//         newQuantity
//       );

//     } catch (error) {

//       console.error(
//         'Quantity update error:',
//         error
//       );

//       toast.error(
//         error?.message ||
//         'Quantity update nahi ho saki.',
//         {
//           theme: 'dark',
//         }
//       );
//     }
//   };


//   // ==========================
//   // PRICE CALCULATIONS
//   // ==========================

//   const subtotal = displayItems.reduce(
//     (acc, item) => {

//       const price =
//         Number(item.price) || 0;

//       const quantity =
//         Number(item.quantity) || 1;

//       return acc + price * quantity;
//     },

//     0
//   );


//   const discountRate = 0.20;

//   const discount =
//     subtotal * discountRate;

//   const deliveryFee =
//     subtotal > 0 ? 15 : 0;

//   const total =
//     subtotal -
//     discount +
//     deliveryFee;


//   // ==========================
//   // PLACE ORDER
//   // ==========================

//   const handleCheckout = async () => {

//     // --------------------------
//     // CHECK LOGIN
//     // --------------------------

//     const token =
//       localStorage.getItem('token');

//     const isLoggedIn =
//       localStorage.getItem('isLoggedIn') === 'true';


//     if (!token || !isLoggedIn) {

//       toast.error(
//         'Order place karne ke liye pehle login karein.',
//         {
//           theme: 'dark',
//         }
//       );

//       navigate('/login');

//       return;
//     }


//     // --------------------------
//     // CHECK CART
//     // --------------------------

//     if (
//       !displayItems ||
//       displayItems.length === 0
//     ) {

//       toast.error(
//         'Aapka cart empty hai.',
//         {
//           theme: 'dark',
//         }
//       );

//       return;
//     }


//     try {

//       // --------------------------
//       // SHOW LOADING TOAST
//       // --------------------------

//       toast.info(
//         'Order place ho raha hai...',
//         {
//           theme: 'dark',
//           autoClose: 1500,
//         }
//       );


//       // --------------------------
//       // API REQUEST
//       // --------------------------

//       const response = await fetch(
//         'https://final-delta-ivory.vercel.app/orders',
//         {
//           method: 'POST',

//           headers: {
//             'Content-Type':
//               'application/json',

//             Authorization:
//               `Bearer ${token}`,
//           },
//         }
//       );


//       // --------------------------
//       // RESPONSE
//       // --------------------------

//       const data =
//         await response.json();


//       // --------------------------
//       // ERROR
//       // --------------------------

//       if (!response.ok) {

//         throw new Error(
//           data?.message ||
//           'Order place nahi ho saka.'
//         );
//       }


//       // --------------------------
//       // ORDER SUCCESS
//       // --------------------------

//       console.log(
//         'Order Created:',
//         data.order
//       );


//       // --------------------------
//       // CLEAR LOCAL CART
//       // --------------------------

//       localStorage.removeItem(
//         'cart'
//       );


//       // --------------------------
//       // CART UPDATE EVENT
//       // --------------------------

//       window.dispatchEvent(
//         new Event('cartUpdated')
//       );


//       // --------------------------
//       // ORDER UPDATE EVENT
//       // --------------------------

//       window.dispatchEvent(
//         new Event('orderUpdated')
//       );


//       // --------------------------
//       // SUCCESS MESSAGE
//       // --------------------------

//       toast.success(
//         '🎉 Order successfully place ho gaya!',
//         {
//           theme: 'dark',
//           autoClose: 2000,
//         }
//       );


//       // --------------------------
//       // GO TO ORDERS
//       // --------------------------

//       setTimeout(() => {

//         navigate('/orders');

//       }, 1200);


//     } catch (error) {

//       console.error(
//         'Place Order Error:',
//         error
//       );


//       toast.error(
//         error?.message ||
//         'Order place nahi ho saka.',
//         {
//           theme: 'dark',
//           autoClose: 3000,
//         }
//       );
//     }
//   };


//   // ==========================
//   // UI
//   // ==========================

//   return (

//     <div className="cart-page-container">


//       {/* ==========================
//           BREADCRUMB
//       ========================== */}

//       <div className="cart-breadcrumb">

//         Home

//         <span>
//           &gt;
//         </span>

//         <strong>
//           Cart
//         </strong>

//       </div>


//       {/* ==========================
//           HEADING
//       ========================== */}

//       <h1 className="cart-main-heading">
//         YOUR CART
//       </h1>


//       {/* ==========================
//           EMPTY CART
//       ========================== */}

//       {displayItems.length === 0 ? (

//         <div className="empty-cart-msg">

//           <h2>
//             Aapka cart khali hai!
//           </h2>

//           <button
//             type="button"
//             onClick={() => navigate('/')}
//             className="checkout-btn"
//           >
//             Continue Shopping
//             <span>
//               →
//             </span>
//           </button>

//         </div>

//       ) : (


//         <div className="cart-content-grid">


//           {/* ==========================
//               CART ITEMS
//           ========================== */}

//           <div className="cart-items-list">


//             {displayItems.map(
//               (item, index) => {

//                 const itemId =
//                   item?.productId ??
//                   item?.id ??
//                   item?._id ??
//                   index;


//                 return (

//                   <React.Fragment
//                     key={String(itemId)}
//                   >


//                     <div className="cart-item-card">


//                       {/* ==========================
//                           IMAGE
//                       ========================== */}

//                       <div className="cart-item-img-box">

//                         <img
//                           src={
//                             item.imageUrl ||
//                             item.image ||
//                             'https://via.placeholder.com/300'
//                           }

//                           alt={
//                             item.title ||
//                             item.name ||
//                             'Product'
//                           }
//                         />

//                       </div>


//                       {/* ==========================
//                           DETAILS
//                       ========================== */}

//                       <div className="cart-item-details">


//                         <div className="cart-item-header">

//                           <h3 className="cart-item-title">

//                             {item.title ||
//                               item.name ||
//                               'Product'}

//                           </h3>


//                           <button
//                             className="delete-btn"

//                             onClick={() =>
//                               handleRemoveFromCart(
//                                 item
//                               )
//                             }

//                             title="Delete product"

//                             type="button"
//                           >
//                             🗑
//                           </button>

//                         </div>


//                         {/* SIZE */}

//                         <p className="cart-item-spec">

//                           Size:{' '}

//                           <span>
//                             {item.size ||
//                               'Large'}
//                           </span>

//                         </p>


//                         {/* COLOR */}

//                         <p className="cart-item-spec">

//                           Color:{' '}

//                           <span>
//                             {item.color ||
//                               'White'}
//                           </span>

//                         </p>


//                         {/* PRICE + QUANTITY */}

//                         <div className="cart-item-bottom">


//                           <span className="cart-item-price">

//                             $
//                             {Number(
//                               item.price || 0
//                             )}

//                           </span>


//                           <div className="cart-qty-picker">


//                             <button
//                               type="button"

//                               onClick={() =>
//                                 handleUpdateQuantity(
//                                   item,
//                                   -1
//                                 )
//                               }
//                             >
//                               −
//                             </button>


//                             <span>
//                               {item.quantity ||
//                                 1}
//                             </span>


//                             <button
//                               type="button"

//                               onClick={() =>
//                                 handleUpdateQuantity(
//                                   item,
//                                   1
//                                 )
//                               }
//                             >
//                               +
//                             </button>


//                           </div>


//                         </div>


//                       </div>


//                     </div>


//                     {/* DIVIDER */}

//                     {index <
//                       displayItems.length - 1 && (

//                       <hr
//                         className="cart-divider"
//                       />

//                     )}


//                   </React.Fragment>

//                 );

//               }
//             )}

//           </div>


//           {/* ==========================
//               ORDER SUMMARY
//           ========================== */}

//           <div className="order-summary-box">


//             <h2>
//               Order Summary
//             </h2>


//             {/* SUBTOTAL */}

//             <div className="summary-row">

//               <span className="summary-label">
//                 Subtotal
//               </span>

//               <span className="summary-value">

//                 $
//                 {subtotal.toFixed(0)}

//               </span>

//             </div>


//             {/* DISCOUNT */}

//             <div className="summary-row">

//               <span className="summary-label">
//                 Discount (-20%)
//               </span>

//               <span className="summary-value discount-text">

//                 -$
//                 {discount.toFixed(0)}

//               </span>

//             </div>


//             {/* DELIVERY */}

//             <div className="summary-row">

//               <span className="summary-label">
//                 Delivery Fee
//               </span>

//               <span className="summary-value">

//                 $
//                 {deliveryFee}

//               </span>

//             </div>


//             <hr className="summary-divider" />


//             {/* TOTAL */}

//             <div className="summary-row total-row">

//               <span>
//                 Total
//               </span>

//               <span className="total-amount">

//                 $
//                 {total.toFixed(0)}

//               </span>

//             </div>


//             {/* ==========================
//                 PROMO CODE
//             ========================== */}

//             <div className="promo-code-box">


//               <div className="promo-input-wrapper">

//                 <span className="promo-icon">
//                   🏷
//                 </span>


//                 <input
//                   type="text"
//                   placeholder="Add promo code"
//                 />

//               </div>


//               <button
//                 className="apply-promo-btn"
//                 type="button"
//               >
//                 Apply
//               </button>


//             </div>


//             {/* ==========================
//                 CHECKOUT BUTTON
//             ========================== */}

//             <button
//               className="checkout-btn"
//               type="button"
//               onClick={handleCheckout}
//             >

//               Go to Checkout

//               <span>
//                 →
//               </span>

//             </button>


//           </div>


//         </div>

//       )}

//     </div>
//   );
// }


// export default Cart;