import { useState, useEffect } from "react";
import "./navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../cart/CartContext";

function Navbar() {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // 1. Search text ke liye State
  const [showMobileSearch, setShowMobileSearch] = useState(false); // Mobile search toggle

  // =====================================
  // CART COUNT
  // =====================================
  const [localCartCount, setLocalCartCount] = useState(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    return savedCart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  });

  // =====================================
  // LOGIN STATUS
  // =====================================
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem("isLoggedIn") === "true"
  );

  const { cartItems = [] } = useCart();

  // =====================================
  // UPDATE CART COUNT
  // =====================================
  const updateCartCount = () => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalCount = savedCart.reduce(
      (sum, item) => sum + (item.quantity || 1),
      0
    );
    setLocalCartCount(totalCount);
  };

  // =====================================
  // AUTH STATUS & EVENT LISTENERS
  // =====================================
  useEffect(() => {
    const updateAuthStatus = () => {
      const loggedIn = localStorage.getItem("isLoggedIn") === "true";
      setIsLoggedIn(loggedIn);
    };

    updateAuthStatus();

    window.addEventListener("cartUpdated", updateCartCount);
    window.addEventListener("storage", updateCartCount);
    window.addEventListener("authChanged", updateAuthStatus);

    return () => {
      window.removeEventListener("cartUpdated", updateCartCount);
      window.removeEventListener("storage", updateCartCount);
      window.removeEventListener("authChanged", updateAuthStatus);
    };
  }, []);

  // =====================================
  // CART TOTAL
  // =====================================
  const contextCount = cartItems.reduce(
    (sum, item) => sum + (item.quantity || 1),
    0
  );

  const totalCartCount = contextCount > 0 ? contextCount : localCartCount;

  // =====================================
  // SEARCH HANDLER (NEW)
  // =====================================
  const handleSearchSubmit = (e) => {
    e.preventDefault(); // Form refresh hone se rokega
    if (searchQuery.trim() !== "") {
      // User ko search query ke sath navigate/redirect karega
      // App.js me is path ka route hona chahiye (e.g., /search?q=query)
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowMobileSearch(false);
    }
  };

  // =====================================
  // ORDERS PAGE
  // =====================================
  const handleOrdersClick = () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    navigate("/orders");
  };

  // =====================================
  // LOGOUT
  // =====================================
  const handleLogout = async () => {
    try {
      await fetch("https://final-delta-ivory.vercel.app/auth/logout", {
        method: "POST",
      });
    } catch (error) {
      console.error("Logout error:", error);
    }

    localStorage.removeItem("token");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");

    setIsLoggedIn(false);

    window.dispatchEvent(new Event("authChanged"));

    navigate("/login");
  };

  return (
    <>
      <nav className="navbar">
        {/* =====================================
            MOBILE MENU BUTTON
        ===================================== */}
        <button
          className="menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

        {/* =====================================
            LOGO
        ===================================== */}
        <div className="logo">
          <Link
            to="/"
            style={{
              textDecoration: "none",
              color: "inherit",
            }}
          >
            SHOP.CO
          </Link>
        </div>

        {/* =====================================
            NAV LINKS
        ===================================== */}
        <div className="nav-links">
          <Link to="/">Shop</Link>
          <Link to="/youmight">You Might</Link>
          <Link to="/productlist">New Arrivals</Link>
          <Link to="/category">Casual</Link>
        </div>

        {/* =====================================
            DESKTOP SEARCH FORM (UPDATED)
        ===================================== */}
        <form className="search-box" onSubmit={handleSearchSubmit}>
          <button type="submit" className="search-icon" style={{ background: "none", border: "none", cursor: "pointer" }}>
            ⌕
          </button>
          <input
            type="text"
            placeholder="Search for products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        {/* =====================================
            NAV ICONS
        ===================================== */}
        <div className="nav-icons">
          {/* CART */}
          <Link
            to="/cart"
            className="cart-icon-wrapper"
            style={{
              position: "relative",
              display: "inline-block",
            }}
          >
            <button className="cart-btn" type="button">
              🛒
            </button>
            {totalCartCount > 0 && (
              <span className="cart-badge">{totalCartCount}</span>
            )}
          </Link>

          {/* ORDERS */}
          {isLoggedIn && (
            <button
              className="orders-btn"
              type="button"
              onClick={handleOrdersClick}
              title="My Orders"
            >
              📦
            </button>
          )}

          {/* LOGIN / LOGOUT */}
          {isLoggedIn ? (
            <button type="button" onClick={handleLogout}>
              ↪ Logout
            </button>
          ) : (
            <Link
              to="/login"
              style={{
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <button type="button">👤 Login</button>
            </Link>
          )}
        </div>
      </nav>

      {/* =====================================
          MOBILE SEARCH BAR (NEW TOGGLE)
      ===================================== */}
      {showMobileSearch && (
        <div style={{ padding: "10px", backgroundColor: "#f1f1f1" }}>
          <form className="search-box" onSubmit={handleSearchSubmit}>
            <button type="submit" className="search-icon" style={{ background: "none", border: "none" }}>
              ⌕
            </button>
            <input
              type="text"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
          </form>
        </div>
      )}

      {/* =====================================
          MOBILE MENU
      ===================================== */}
      <div className={`mobile-menu ${menuOpen ? "active" : ""}`}>
        <Link to="/" onClick={() => setMenuOpen(false)}>
          Shop
        </Link>
        <a href="#" onClick={() => setMenuOpen(false)}>
          On Sale
        </a>
        <Link to="/productlist" onClick={() => setMenuOpen(false)}>
          New Arrivals
        </Link>
        <a href="#" onClick={() => setMenuOpen(false)}>
          Brands
        </a>

        {isLoggedIn && (
          <button
            className="mobile-orders-link"
            onClick={() => {
              setMenuOpen(false);
              navigate("/orders");
            }}
          >
            📦 My Orders
          </button>
        )}
      </div>
    </>
  );
}

export default Navbar;