import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { getProducts } from '../../api/backendapi'; 
import './productList.css';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(4); 

  const navigate = useNavigate(); 

  useEffect(() => {
    getProducts()
      .then((data) => {
        if (data && data.newArrivals) {
          setProducts(data.newArrivals);
        } else {
          setProducts([]);
        }
      })
      .catch((err) => console.error("Error fetching products:", err))
      .finally(() => setLoading(false));
  }, []);

  const toggleProducts = () => {
    if (visibleCount === 4) {
      setVisibleCount(8);
    } else {
      setVisibleCount(4);
    }
  };

  const handleCardClick = (id) => {
    navigate(`/product/${id}`);
  };

  if (loading) return <h1 style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</h1>;

  return (
    <div className="product-container">
      
      <h1 style={{ display: "flex", justifyContent: "center", padding: "50px" }}>NEW ARRIVALS</h1>
      
      <div className="product-grid">
        {products.length > 0 ? (
          products.slice(0, visibleCount).map((product) => (
            <div 
              key={product.id || product._id} 
              className="product-card"
              onClick={() => handleCardClick(product.id || product._id)} 
              style={{ cursor: 'pointer' }}
            >
              <div className="product-image-box">
                <img 
                  src={product.imageUrl || product.image} 
                  alt={product.title} 
                  className="product-image" 
                />
              </div>

              <h4 className="product-title">{product.title}</h4>

              <div className="product-rating">
                <span className="stars">★★★★★</span>
                <span className="rating-score">{product.rating || 4.5}/5</span>
              </div>

              <div className="product-price-box">
                <span className="current-price">${product.price}</span>
              </div>
            </div>
          ))
        ) : (
          <p style={{ textAlign: 'center', gridColumn: '1/-1' }}>Koi products nahi miley!</p>
        )}
      </div>

      {products.length > 4 && (
        <div className="view-all-container">
          <button
            className="view-all-btn"
            onClick={toggleProducts}
          >
            {visibleCount === 4 ? "View All" : "View Less"}
          </button>
        </div>
      )}
    </div>
  );
}

export default ProductList; 