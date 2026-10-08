import { useEffect, useState } from "react";
import './topBar.css';
import { Link } from 'react-router-dom';

function TopBar() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem("isLoggedIn") === "true"
  );

  useEffect(() => {
    const updateAuthStatus = () => {
      setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
    };

    window.addEventListener("authChanged", updateAuthStatus);
    window.addEventListener("storage", updateAuthStatus);

    return () => {
      window.removeEventListener("authChanged", updateAuthStatus);
      window.removeEventListener("storage", updateAuthStatus);
    };
  }, []);

  if (isLoggedIn) return null;

  return (
    <div className="topbar">
      <p>
        <Link to="/signup">Sign up</Link> and get <span>20% off</span> to your first order.
      </p>

      <button className="close-btn">×</button>
    </div>
  );
}

export default TopBar;