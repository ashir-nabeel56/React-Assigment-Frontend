import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useCart } from "./CartContext";
import { useNavigate } from "react-router-dom";
import CheckoutModal from "./CheckoutModal";
import "react-toastify/dist/ReactToastify.css";
import "./cart.css";

function Cart() {
    const {
        cartItems,
        removeFromCart,
        updateQuantity,
    } = useCart();

    const navigate = useNavigate();

    const displayItems = cartItems || [];

    const [showCheckoutModal, setShowCheckoutModal] =
        useState(false);

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

        // ------------------------------------------
        // OPEN SHIPPING INFO MODAL
        // ------------------------------------------

        setShowCheckoutModal(true);
    };

    // ==========================================
    // SUBMIT ORDER
    // ==========================================

    const submitOrder = async (shippingInfo) => {
        const token =
            localStorage.getItem("token");

        try {
            // ------------------------------------------
            // PLACING ORDER TOAST
            // ------------------------------------------

            toast.info(
                "Placing your order..."
            );

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

                    body: JSON.stringify({
                        shippingInfo,
                        items: displayItems,
                        subtotal,
                        discount,
                        deliveryFee,
                        total,
                    }),
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

            // ------------------------------------------
            // CLEAR CART
            // ------------------------------------------

            localStorage.removeItem("cart");

            // Notify cart
            window.dispatchEvent(
                new Event("cartUpdated")
            );

            // Notify orders
            window.dispatchEvent(
                new Event("orderUpdated")
            );

            // ------------------------------------------
            // CLOSE MODAL
            // ------------------------------------------

            setShowCheckoutModal(false);

            // ------------------------------------------
            // SUCCESS TOASTIFY
            // ------------------------------------------

            toast.success(
                "🎉 Order placed successfully!",
                {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                }
            );

            // ------------------------------------------
            // GO TO ORDERS
            // ------------------------------------------

            setTimeout(() => {
                navigate("/orders");
            }, 1500);

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
            <>
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

                <ToastContainer />
            </>
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

            {/* ==================================
                SHIPPING INFO MODAL
            ================================== */}

            {showCheckoutModal && (
                <CheckoutModal
                    onClose={() =>
                        setShowCheckoutModal(false)
                    }
                    onSubmit={submitOrder}
                />
            )}

            {/* ==================================
                TOASTIFY
            ================================== */}

            <ToastContainer
    position="top-right"
    autoClose={3000}
    hideProgressBar={false}
    newestOnTop={true}
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
    theme="light"
    style={{
        top: "70px",
    }}
/>
        </div>
    );
}

export default Cart;