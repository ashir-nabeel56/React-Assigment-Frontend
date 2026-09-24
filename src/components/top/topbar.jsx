import { useState } from 'react';
import './topBar.css';
import { Link } from 'react-router-dom';

function TopBar() {
  const [showTopBar, setShowTopBar] = useState(
    !localStorage.getItem('user')
  );

  if (!showTopBar) {
    return null;
  }

  return (
    <div className="topbar">
      <p>
        <Link to="/signup">Sign up</Link> and get <span>20% off</span> to your first order.
      </p>

      <button
        className="close-btn"
        onClick={() => setShowTopBar(false)}
      >
        ×
      </button>
    </div>
  );
}

export default TopBar;