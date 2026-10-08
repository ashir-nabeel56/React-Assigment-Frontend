import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getProducts } from "../../api/backendapi";
import "../pro/productList.css";
import "./searchResults.css";

function SearchResults() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q")?.trim() || "";
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getProducts();

        if (active) {
          setProducts(data.products);
        }
      } catch (fetchError) {
        console.error("Search products error:", fetchError);
        if (active) {
          setError("Products could not be loaded. Please try again.");
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchProducts();

    return () => {
      active = false;
    };
  }, []);

  const matchingProducts = useMemo(() => {
    const terms = query.toLocaleLowerCase().split(/\s+/).filter(Boolean);

    if (!terms.length) return [];

    return products.filter((product) => {
      const category = Array.isArray(product.category)
        ? product.category.join(" ")
        : product.category;
      const searchableText = [
        product.title,
        product.name,
        product.description,
        category,
        product.brand,
      ]
        .filter(Boolean)
        .join(" ")
        .toLocaleLowerCase();

      return terms.every((term) => searchableText.includes(term));
    });
  }, [products, query]);

  return (
    <main className="product-container search-results">
      <h1>Search Results</h1>
      {query && <p className="search-results-query">Results for “{query}”</p>}

      {loading ? (
        <p className="search-results-message" role="status">Loading products...</p>
      ) : error ? (
        <p className="search-results-message" role="alert">{error}</p>
      ) : !query ? (
        <p className="search-results-message">Enter a product name to search.</p>
      ) : matchingProducts.length === 0 ? (
        <p className="search-results-message">No products found for “{query}”.</p>
      ) : (
        <div className="product-grid">
          {matchingProducts.map((product, index) => {
            const productId = product.productId || product._id || product.id;
            const title = product.title || product.name || "Product";

            return (
              <button
                className="product-card search-result-card"
                key={productId || `${title}-${index}`}
                type="button"
                onClick={() => productId && navigate(`/product/${productId}`)}
                disabled={!productId}
              >
                <div className="product-image-box">
                  <img
                    src={product.imageUrl || product.image}
                    alt={title}
                    className="product-image"
                  />
                </div>
                <h4 className="product-title">{title}</h4>
                <div className="product-rating">
                  <span className="stars">★★★★★</span>
                  <span className="rating-score">{product.rating || 4.5}/5</span>
                </div>
                <div className="product-price-box">
                  <span className="current-price">${product.price}</span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </main>
  );
}

export default SearchResults;
