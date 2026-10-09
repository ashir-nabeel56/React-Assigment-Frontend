
import { useState, useEffect } from "react";
import "./navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../cart/CartContext";
import {
  Menu,
  X,
  Search,
  ShoppingCart,
  Package,
  LogOut,
  UserRound,
  ChevronDown,
} from "lucide-react";

function Navbar() {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const [localCartCount, setLocalCartCount] = useState(() => {
    try {
      const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
      return savedCart.reduce(
        (sum, item) => sum + (Number(item.quantity) || 1),
        0
      );
    } catch {
      return 0;
    }
  });

  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem("isLoggedIn") === "true"
  );

  const [loggingOut, setLoggingOut] = useState(false);

  const { cartItems = [] } = useCart();

  // Update cart count
  const updateCartCount = () => {
    try {
      const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
      const totalCount = savedCart.reduce(
        (sum, item) => sum + (Number(item.quantity) || 1),
        0
      );
      setLocalCartCount(totalCount);
    } catch {
      setLocalCartCount(0);
    }
  };

  // Authentication and cart listeners
  useEffect(() => {
    const updateAuthStatus = () => {
      setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
    };

    updateAuthStatus();
    updateCartCount();

    window.addEventListener("cartUpdated", updateCartCount);
    window.addEventListener("storage", updateCartCount);
    window.addEventListener("authChanged", updateAuthStatus);

    return () => {
      window.removeEventListener("cartUpdated", updateCartCount);
      window.removeEventListener("storage", updateCartCount);
      window.removeEventListener("authChanged", updateAuthStatus);
    };
  }, []);

  const contextCount = cartItems.reduce(
    (sum, item) => sum + (Number(item.quantity) || 1),
    0
  );

  const totalCartCount = contextCount > 0 ? contextCount : localCartCount;

  // Search
  const handleSearchSubmit = (e) => {
    e.preventDefault();

    const query = searchQuery.trim();

    if (query) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setShowMobileSearch(false);
      setMenuOpen(false);
    }
  };

  // Orders
  const handleOrdersClick = () => {
    setMenuOpen(false);

    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    navigate("/orders");
  };

  // Logout
  const handleLogout = async () => {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      await fetch("https://final-delta-ivory.vercel.app/auth/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("user");

      setIsLoggedIn(false);
      setMenuOpen(false);
      setLoggingOut(false);

      window.dispatchEvent(new Event("authChanged"));
      navigate("/login");
    }
  };

  return (
    <>
      <nav className="navbar">
        {/* Mobile menu toggle */}
        <button
          className="menu-btn"
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Logo */}
        <div className="logo">
          <Link to="/" onClick={() => setMenuOpen(false)}>
            SHOP.CO
          </Link>
        </div>

        {/* Desktop navigation */}
        <div className="nav-links">
          <Link to="/">Shop</Link>
          <Link to="/youmight">You Might</Link>
          <Link to="/productlist">New Arrivals</Link>
          <Link to="/category">Casual</Link>
        </div>

        {/* Desktop search */}
        <form className="search-box" onSubmit={handleSearchSubmit}>
          <button
            type="submit"
            className="search-icon"
            aria-label="Search products"
          >
            <Search size={20} />
          </button>

          <input
            type="search"
            placeholder="Search for products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        {/* Action icons */}
        <div className="nav-icons">
          {/* Mobile search toggle */}
          <button
            className="icon-btn mobile-search-toggle"
            type="button"
            aria-label="Toggle search"
            onClick={() => setShowMobileSearch((prev) => !prev)}
          >
            {showMobileSearch ? <X size={21} /> : <Search size={21} />}
          </button>

          {/* Cart */}
          <Link
            to="/cart"
            className="cart-icon-wrapper icon-btn"
            aria-label={`Shopping cart, ${totalCartCount} items`}
          >
            <ShoppingCart size={22} />

            {totalCartCount > 0 && (
              <span className="cart-badge">
                {totalCartCount > 99 ? "99+" : totalCartCount}
              </span>
            )}
          </Link>

          {/* Orders */}
          {isLoggedIn && (
            <button
              className="icon-btn orders-btn"
              type="button"
              onClick={handleOrdersClick}
              title="My Orders"
              aria-label="My Orders"
            >
              <Package size={22} />
            </button>
          )}

          {/* Login / Logout */}
          {isLoggedIn ? (
            <button
              className="logout-btn"
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
            >
              <LogOut size={17} />
              <span>{loggingOut ? "Logging out..." : "Logout"}</span>
            </button>
          ) : (
            <Link to="/login" className="login-btn">
              <UserRound size={19} />
              <span>Login</span>
            </Link>
          )}
        </div>
      </nav>

      {/* Mobile search */}
      {showMobileSearch && (
        <div className="mobile-search-panel">
          <form className="search-box" onSubmit={handleSearchSubmit}>
            <button
              type="submit"
              className="search-icon"
              aria-label="Search products"
            >
              <Search size={20} />
            </button>

            <input
              type="search"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
          </form>
        </div>
      )}

      {/* Mobile navigation */}
      <div className={`mobile-menu ${menuOpen ? "active" : ""}`}>
        <Link to="/" onClick={() => setMenuOpen(false)}>
          Shop
        </Link>

        <Link to="/youmight" onClick={() => setMenuOpen(false)}>
          You Might
        </Link>

        <Link to="/productlist" onClick={() => setMenuOpen(false)}>
          New Arrivals
        </Link>

        <Link to="/category" onClick={() => setMenuOpen(false)}>
          Casual
        </Link>

        {isLoggedIn && (
          <button
            className="mobile-orders-link"
            type="button"
            onClick={handleOrdersClick}
          >
            <Package size={19} />
            My Orders
          </button>
        )}

        {isLoggedIn ? (
          <button
            className="mobile-logout-btn"
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
          >
            <LogOut size={18} />
            {loggingOut ? "Logging out..." : "Logout"}
          </button>
        ) : (
          <Link
            to="/login"
            className="mobile-login-link"
            onClick={() => setMenuOpen(false)}
          >
            <UserRound size={19} />
            Login
          </Link>
        )}
      </div>
    </>
  );
}

export default Navbar;

