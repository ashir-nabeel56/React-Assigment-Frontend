
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts } from "../../api/backendapi";
import "./productList.css";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [visibleCount, setVisibleCount] = useState(4);

  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getProducts();

        // Different API response formats handle karein
        const data = response?.data ?? response;

        const productList = Array.isArray(data)
          ? data
          : Array.isArray(data?.newArrivals)
          ? data.newArrivals
          : Array.isArray(data?.products)
          ? data.products
          : Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data?.data?.products)
          ? data.data.products
          : [];

        if (isMounted) {
          setProducts(productList);
        }
      } catch (err) {
        console.error("Error fetching products:", err);

        if (isMounted) {
          setProducts([]);
          setError(
            "Products load nahi ho sake. Backend server aur API check karein."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const toggleProducts = () => {
    setVisibleCount((previous) =>
      previous === 4 ? products.length : 4
    );
  };

  const handleCardClick = (product) => {
    const id = product.id || product._id;

    if (!id) {
      console.error("Product ID missing:", product);
      return;
    }

    navigate(`/product/${id}`);
  };

  const handleImageError = (event) => {
    event.currentTarget.onerror = null;
    event.currentTarget.src =
      "data:image/svg+xml;charset=UTF-8," +
      encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="400" height="400">
          <rect width="100%" height="100%" fill="#f0f0f0"/>
          <text x="50%" y="50%" font-size="20"
            text-anchor="middle" fill="#777"
            dominant-baseline="middle">Image unavailable</text>
        </svg>
      `);
  };

  if (loading) {
    return (
      <div className="product-message" role="status">
        <div className="product-loader" />
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-message">
        <p>{error}</p>
        <button
          className="view-all-btn"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <section className="product-container">
      <h1 className="product-heading">NEW ARRIVALS</h1>

      <div className="product-grid">
        {products.length > 0 ? (
          products.slice(0, visibleCount).map((product, index) => {
            const id = product.id || product._id || index;
            const rating = Number(product.rating) || 0;
            const price = Number(product.price);
            const image = product.imageUrl || product.image;
            const title = product.title || "Untitled Product";

            return (
              <article
                key={id}
                className="product-card"
                role="link"
                tabIndex={0}
                aria-label={`View ${title}`}
                onClick={() => handleCardClick(product)}
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter" ||
                    event.key === " "
                  ) {
                    event.preventDefault();
                    handleCardClick(product);
                  }
                }}
              >
                <div className="product-image-box">
                  <img
                    src={image || undefined}
                    alt={title}
                    className="product-image"
                    loading="lazy"
                    onError={handleImageError}
                  />
                </div>

                <h4 className="product-title">{title}</h4>

                <div className="product-rating">
                  <span className="stars" aria-label={`${rating} out of 5`}>
                    {"★".repeat(Math.max(0, Math.min(5, Math.round(rating))))}
                    {"☆".repeat(5 - Math.max(0, Math.min(5, Math.round(rating))))}
                  </span>

                  <span className="rating-score">
                    {rating > 0 ? `${rating}/5` : "No rating"}
                  </span>
                </div>

                <div className="product-price-box">
                  <span className="current-price">
                    {Number.isFinite(price)
                      ? `$${price.toFixed(2)}`
                      : "Price unavailable"}
                  </span>
                </div>
              </article>
            );
          })
        ) : (
          <p className="product-empty">
            Koi products nahi miley!
          </p>
        )}
      </div>

      {products.length > 4 && (
        <div className="view-all-container">
          <button
            type="button"
            className="view-all-btn"
            onClick={toggleProducts}
          >
            {visibleCount === 4 ? "View All" : "View Less"}
          </button>
        </div>
      )}
    </section>
  );
}

export default ProductList;
