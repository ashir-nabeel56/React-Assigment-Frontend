import './topBar.css';
import { Link } from 'react-router-dom';

function TopBar() {
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