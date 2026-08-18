import { useState, useEffect } from 'react';
import './navbar.css';
import { Link } from 'react-router-dom';
import { useCart } from '../cart/CartContext';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [localCartCount, setLocalCartCount] = useState(0);

  let cartItems = [];
  try {
    const context = useCart();
    cartItems = context?.cartItems || [];
  } catch (error) {
    cartItems = [];
  }

  const updateCartCount = () => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalCount = savedCart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    setLocalCartCount(totalCount);
  };

  useEffect(() => {
    updateCartCount();

    window.addEventListener('cartUpdated', updateCartCount);
    window.addEventListener('storage', updateCartCount);

    return () => {
      window.removeEventListener('cartUpdated', updateCartCount);
      window.removeEventListener('storage', updateCartCount);
    };
  }, []);

  const contextCount = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const totalCartCount = contextCount > 0 ? contextCount : localCartCount;

  return (
    <>
      <nav className="navbar">

        <button
          className="menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

        <div className="logo">
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            SHOP.CO
          </Link>
        </div>

        <div className="nav-links">
          <Link to="/">Shop</Link>
          <a href="#">On Sale</a>
          <Link to="/productlist">New Arrivals</Link>
          <a href="#">Brands</a>
        </div>

        <div className="search-box">
          <span className="search-icon">⌕</span>
          <input
            type="text"
            placeholder="Search for products..."
          />
        </div>

        <div className="nav-icons">
          <button className="mobile-search">⌕</button>

          <Link to="/cart" className="cart-icon-wrapper" style={{ position: 'relative', display: 'inline-block' }}>
            <button className="cart-btn">🛒</button>
            {totalCartCount > 0 && (
              <span className="cart-badge">{totalCartCount}</span>
            )}
          </Link>

          <button>◉</button>
        </div>
      </nav>

      <div className={`mobile-menu ${menuOpen ? 'active' : ''}`}>
        <Link to="/" onClick={() => setMenuOpen(false)}>Shop</Link>
        <a href="#" onClick={() => setMenuOpen(false)}>On Sale</a>
        <Link to="/productlist" onClick={() => setMenuOpen(false)}>New Arrivals</Link>
        <a href="#" onClick={() => setMenuOpen(false)}>Brands</a>
      </div>
    </>
  );
}

export default Navbar;