import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import "./order.css";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState(null);

  // =====================================
  // FETCH USER ORDERS
  // =====================================
  const fetchOrders = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setOrders([]);
      setLoading(false);
      setError("Please login to see your orders.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "https://final-delta-ivory.vercel.app/orders/my",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Orders fetch nahi ho sake."
        );
      }

      setOrders(data.orders || []);
    } catch (err) {
      console.error("Orders Error:", err);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // CANCEL ORDER
  // =====================================
  const handleCancelOrder = async (orderId) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmed) return;

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login first.");
      return;
    }

    try {
      setCancellingId(orderId);

      const response = await fetch(
        `https://final-delta-ivory.vercel.app/orders/${orderId}/cancel`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Order cancel nahi ho saka."
        );
      }

      // =====================================
      // REMOVE CANCELLED ORDER FROM UI
      // =====================================
      setOrders((prevOrders) =>
        prevOrders.filter(
          (order) => order._id !== orderId
        )
      );

      // =====================================
      // SUCCESS TOAST
      // =====================================
      toast.success("Order cancelled successfully!");

    } catch (err) {
      console.error("Cancel Order Error:", err);

      // =====================================
      // ERROR TOAST
      // =====================================
      toast.error(
        err.message || "Order cancel nahi ho saka."
      );

    } finally {
      setCancellingId(null);
    }
  };

  // =====================================
  // INITIAL LOAD
  // =====================================
  useEffect(() => {
    fetchOrders();

    const handleOrderUpdated = () => {
      fetchOrders();
    };

    window.addEventListener(
      "orderUpdated",
      handleOrderUpdated
    );

    return () => {
      window.removeEventListener(
        "orderUpdated",
        handleOrderUpdated
      );
    };
  }, []);

  // =====================================
  // STATUS CLASS
  // =====================================
  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "pending";

      case "processing":
        return "processing";

      case "shipped":
        return "shipped";

      case "delivered":
        return "delivered";

      case "cancelled":
        return "cancelled";

      default:
        return "";
    }
  };

  // =====================================
  // DATE FORMAT
  // =====================================
  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      }
    );
  };

  // =====================================
  // LOADING
  // =====================================
  if (loading) {
    return (
      <div className="orders-page">

        <ToastContainer
          position="top-right"
          autoClose={3000}
          newestOnTop
          closeOnClick
          pauseOnHover
          draggable
        />

        <div className="orders-container">

          <div className="orders-loading">
            <div className="orders-spinner"></div>

            <p>
              Loading your orders...
            </p>
          </div>

        </div>
      </div>
    );
  }

  // =====================================
  // ERROR
  // =====================================
  if (error) {
    return (
      <div className="orders-page">

        <ToastContainer
          position="top-right"
          autoClose={3000}
          newestOnTop
          closeOnClick
          pauseOnHover
          draggable
        />

        <div className="orders-container">

          <div className="orders-error">

            <h2>Orders</h2>

            <p>{error}</p>

            <Link
              to="/login"
              className="orders-login-btn"
            >
              Login
            </Link>

          </div>

        </div>
      </div>
    );
  }

  // =====================================
  // NO ORDERS
  // =====================================
  if (orders.length === 0) {
    return (
      <div className="orders-page">

        <ToastContainer
          position="top-right"
          autoClose={3000}
          newestOnTop
          closeOnClick
          pauseOnHover
          draggable
        />

        <div className="orders-container">

          <div className="orders-heading">

            <div>
              <h1>My Orders</h1>

              <p>
                Track and manage your orders
              </p>
            </div>

            <button
              className="refresh-btn"
              onClick={fetchOrders}
            >
              ↻ Refresh
            </button>

          </div>

          <div className="empty-orders">

            <div className="empty-orders-icon">
              📦
            </div>

            <h2>No Orders Yet</h2>

            <p>
              You haven't placed any orders yet.
            </p>

            <Link
              to="/productlist"
              className="shop-now-btn"
            >
              Start Shopping
            </Link>

          </div>

        </div>
      </div>
    );
  }

  // =====================================
  // ORDERS PAGE
  // =====================================
  return (
    <div className="orders-page">

      {/* =====================================
          TOAST CONTAINER
      ===================================== */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
      />

      <div className="orders-container">

        {/* =====================================
            HEADER
        ===================================== */}
        <div className="orders-heading">

          <div>

            <h1>My Orders</h1>

            <p>
              {orders.length}{" "}
              {orders.length === 1
                ? "order"
                : "orders"}{" "}
              found
            </p>

          </div>

          <button
            className="refresh-btn"
            onClick={fetchOrders}
          >
            ↻ Refresh
          </button>

        </div>

        {/* =====================================
            ORDERS
        ===================================== */}
        <div className="orders-grid">

          {orders.map((order) => {

            const status =
              order.status?.toLowerCase();

            // =====================================
            // CANCEL ONLY PENDING / PROCESSING
            // =====================================
            const canCancel =
              status === "pending" ||
              status === "processing";

            return (
              <div
                className="order-card"
                key={order._id}
              >

                {/* =====================================
                    ORDER HEADER
                ===================================== */}
                <div className="order-card-header">

                  <div>

                    <span className="order-label">
                      ORDER
                    </span>

                    <h3>
                      #
                      {order._id
                        ?.slice(-8)
                        .toUpperCase()}
                    </h3>

                  </div>

                  <span
                    className={`order-status ${getStatusClass(
                      order.status
                    )}`}
                  >
                    {order.status || "Pending"}
                  </span>

                </div>

                {/* =====================================
                    ORDER DATE
                ===================================== */}
                <div className="order-date">

                  <span>
                    Order Date
                  </span>

                  <strong>
                    {formatDate(
                      order.createdAt ||
                      order.updatedAt
                    )}
                  </strong>

                </div>

                {/* =====================================
                    PRODUCTS
                ===================================== */}
                <div className="order-card-products">

                  <h4>
                    Products
                  </h4>

                  {order.items?.map(
                    (item, index) => {

                      const product =
                        item.product || {};

                      return (
                        <div
                          className="order-product"
                          key={
                            item._id ||
                            index
                          }
                        >

                          {/* PRODUCT IMAGE */}
                          <div className="order-product-image">

                            {product.image ||
                            product.imageUrl ? (

                              <img
                                src={
                                  product.image ||
                                  product.imageUrl
                                }
                                alt={
                                  product.title ||
                                  product.name ||
                                  "Product"
                                }
                              />

                            ) : (

                              <span>
                                🛍️
                              </span>

                            )}

                          </div>

                          {/* PRODUCT INFO */}
                          <div className="order-product-info">

                            <h5>
                              {product.title ||
                                product.name ||
                                "Product"}
                            </h5>

                            <p>
                              Quantity:{" "}
                              {item.quantity ||
                                1}
                            </p>

                          </div>

                          {/* PRODUCT PRICE */}
                          <strong>
                            $
                            {Number(
                              item.price ||
                              product.price ||
                              0
                            ).toFixed(2)}
                          </strong>

                        </div>
                      );
                    }
                  )}

                </div>

                {/* =====================================
                    ORDER SUMMARY
                ===================================== */}
                <div className="order-summary">

                  <div>

                    <span>
                      Subtotal
                    </span>

                    <strong>
                      $
                      {Number(
                        order.subtotal ||
                        order.subTotal ||
                        0
                      ).toFixed(2)}
                    </strong>

                  </div>

                  <div>

                    <span>
                      Discount
                    </span>

                    <strong className="discount">
                      -$
                      {Number(
                        order.discount || 0
                      ).toFixed(2)}
                    </strong>

                  </div>

                  <div>

                    <span>
                      Delivery
                    </span>

                    <strong>
                      $
                      {Number(
                        order.deliveryFee ??
                        order.shippingFee ??
                        15
                      ).toFixed(2)}
                    </strong>

                  </div>

                  <div className="order-total">

                    <span>
                      Total
                    </span>

                    <strong>
                      $
                      {Number(
                        order.totalPrice || 0
                      ).toFixed(2)}
                    </strong>

                  </div>

                </div>

                {/* =====================================
                    CANCEL ORDER
                ===================================== */}
                {canCancel && (

                  <button
                    className="cancel-order-btn"
                    onClick={() =>
                      handleCancelOrder(
                        order._id
                      )
                    }
                    disabled={
                      cancellingId ===
                      order._id
                    }
                  >

                    {cancellingId ===
                    order._id
                      ? "Cancelling..."
                      : "Cancel Order"}

                  </button>

                )}

              </div>
            );
          })}

        </div>

      </div>

    </div>
  );
}

export default Orders;