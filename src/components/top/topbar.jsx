import './topBar.css';

function TopBar() {
  return (
    <div className="topbar">
      <p>
        Sign up and get <span>20% off</span> to your first order.
      </p>

      <button className="close-btn">×</button>
    </div>
  );
}

export default TopBar;