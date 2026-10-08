import { Link } from "react-router-dom";
import "./notFound.css";

function NotFound() {
  return (
    <main className="not-found-page">
      <div className="not-found-content">
        <p className="not-found-eyebrow">PAGE NOT FOUND</p>
        <h1>404</h1>
        <h2>We couldn't find that page</h2>
        <p className="not-found-description">
          The page may have moved, or the link might be incorrect.
        </p>
        <Link className="not-found-home-link" to="/">
          Back to home
        </Link>
      </div>
    </main>
  );
}

export default NotFound;
