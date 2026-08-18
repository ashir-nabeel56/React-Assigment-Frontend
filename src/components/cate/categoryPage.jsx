import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProducts } from '../../api/backendapi';
import './categoryPage.css';

function CategoryPage() {
    const { categoryName } = useParams();

    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [priceRange, setPriceRange] = useState(500);
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedSize, setSelectedSize] = useState('');

    // Mobile filter state
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        getProducts()
            .then((data) => {
                let allProducts = [];

                if (Array.isArray(data)) {
                    allProducts = data;
                } else if (data && typeof data === 'object') {
                    Object.values(data).forEach((group) => {
                        if (Array.isArray(group)) {
                            allProducts = [...allProducts, ...group];
                        }
                    });
                }

                setProducts(allProducts);
                setFilteredProducts(allProducts);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error loading products:", err);
                setLoading(false);
            });
    }, [categoryName]);

    const handleApplyFilter = () => {
        let updated = [...products];

        if (priceRange) {
            updated = updated.filter(
                (item) => Number(item.price) <= Number(priceRange)
            );
        }

        setFilteredProducts(updated);

        // Mobile par Apply Filter ke baad filters close
        setShowFilters(false);
    };

    const categoriesList = [
        'T-shirts',
        'Shorts',
        'Shirts',
        'Hoodie',
        'Jeans'
    ];

    const colorsList = [
        '#00C12B',
        '#F52525',
        '#FFC700',
        '#FF7A00',
        '#06CAF0',
        '#1877F2',
        '#7D06F0',
        '#F506A4',
        '#FFFFFF',
        '#000000'
    ];

    const sizesList = [
        'XX-Small',
        'X-Small',
        'Small',
        'Medium',
        'Large',
        'X-Large',
        'XX-Large',
        '3X-Large',
        '4X-Large'
    ];

    const visibleProducts = filteredProducts.slice(0, 4);

    return (
        <div className="category-container">

            {/* Breadcrumb */}
            <div className="category-breadcrumb">
                <Link to="/">Home</Link>
                <span> &gt; </span>
                <strong>{categoryName || 'Casual'}</strong>
            </div>


            {/* =================================
                MOBILE FILTER BUTTON
            ================================= */}
            <button
                className="mobile-filter-btn"
                onClick={() => setShowFilters(!showFilters)}
            >
                <span>☰</span>

                {showFilters ? 'Hide Filters' : 'Filter'}
            </button>


            <div className="category-layout">

                {/* =================================
                    FILTER SIDEBAR
                ================================= */}
                <aside
                    className={`filters-sidebar ${
                        showFilters ? 'show-filters' : ''
                    }`}
                >

                    <div className="filter-header">
                        <h3>Filters</h3>

                        {/* Desktop icon */}
                        <span className="filter-icon">⚙</span>

                        {/* Mobile close */}
                        <button
                            className="filter-close"
                            onClick={() => setShowFilters(false)}
                        >
                            ✕
                        </button>
                    </div>

                    <hr />


                    {/* Categories */}
                    <div className="filter-group">
                        {categoriesList.map((cat, index) => (
                            <div
                                key={index}
                                className="filter-item-row"
                            >
                                <span>{cat}</span>
                                <span>&gt;</span>
                            </div>
                        ))}
                    </div>

                    <hr />


                    {/* Price */}
                    <div className="filter-group">

                        <div className="filter-title">
                            <span>Price</span>
                            <span>▲</span>
                        </div>

                        <input
                            type="range"
                            min="50"
                            max="500"
                            value={priceRange}
                            onChange={(e) =>
                                setPriceRange(e.target.value)
                            }
                            className="price-slider"
                        />

                        <div className="price-labels">
                            <span>$50</span>
                            <span>${priceRange}</span>
                        </div>

                    </div>

                    <hr />


                    {/* Colors */}
                    <div className="filter-group">

                        <div className="filter-title">
                            <span>Colors</span>
                            <span>▲</span>
                        </div>

                        <div className="color-grid">

                            {colorsList.map((color, index) => (
                                <div
                                    key={index}
                                    className={`color-box ${
                                        selectedColor === color
                                            ? 'active'
                                            : ''
                                    }`}
                                    style={{
                                        backgroundColor: color
                                    }}
                                    onClick={() =>
                                        setSelectedColor(color)
                                    }
                                />
                            ))}

                        </div>

                    </div>

                    <hr />


                    {/* Size */}
                    <div className="filter-group">

                        <div className="filter-title">
                            <span>Size</span>
                            <span>▲</span>
                        </div>

                        <div className="size-grid">

                            {sizesList.map((size, index) => (
                                <button
                                    key={index}
                                    className={`size-chip ${
                                        selectedSize === size
                                            ? 'active'
                                            : ''
                                    }`}
                                    onClick={() =>
                                        setSelectedSize(size)
                                    }
                                >
                                    {size}
                                </button>
                            ))}

                        </div>

                    </div>

                    <hr />


                    {/* Dress Style */}
                    <div className="filter-group">

                        <div className="filter-title">
                            <span>Dress Style</span>
                            <span>▲</span>
                        </div>

                        {[
                            'Casual',
                            'Formal',
                            'Party',
                            'Gym'
                        ].map((style, index) => (
                            <div
                                key={index}
                                className="filter-item-row"
                            >
                                <span>{style}</span>
                                <span>&gt;</span>
                            </div>
                        ))}

                    </div>


                    {/* Apply Filter */}
                    <button
                        className="apply-filter-btn"
                        onClick={handleApplyFilter}
                    >
                        Apply Filter
                    </button>

                </aside>


                {/* =================================
                    PRODUCTS
                ================================= */}
                <main className="products-main">

                    <div className="products-top-bar">

                        <h2>
                            {categoryName || 'Casual'}
                        </h2>

                        <div className="products-sort-info">

                            <span>
                                Showing 1-{visibleProducts.length} of{' '}
                                {visibleProducts.length} Products
                            </span>

                            <label>
                                Sort by:

                                <select className="sort-select">
                                    <option>
                                        Most Popular
                                    </option>

                                    <option>
                                        Newest
                                    </option>

                                    <option>
                                        Price: Low to High
                                    </option>

                                    <option>
                                        Price: High to Low
                                    </option>
                                </select>

                            </label>

                        </div>

                    </div>


                    {/* Products */}
                    {loading ? (
                        <h3>Loading products...</h3>
                    ) : (

                        <div className="category-product-grid">

                            {visibleProducts.map((product) => (

                                <Link
                                    to={`/product/${product.id || product._id}`}
                                    key={product.id || product._id}
                                    className="cat-product-card"
                                >

                                    <div className="cat-img-wrapper">

                                        <img
                                            src={
                                                product.imageUrl ||
                                                product.image
                                            }
                                            alt={
                                                product.title ||
                                                product.name
                                            }
                                        />

                                    </div>


                                    <h4 className="cat-product-title">
                                        {product.title ||
                                            product.name}
                                    </h4>


                                    <div className="cat-rating">

                                        <span className="stars">
                                            ★★★★☆
                                        </span>

                                        <span className="score">
                                            {product.rating || 4.5}/5
                                        </span>

                                    </div>


                                    <div className="cat-price-row">

                                        <span className="current-price">
                                            ${product.price}
                                        </span>

                                        {product.originalPrice && (
                                            <span className="old-price">
                                                ${product.originalPrice}
                                            </span>
                                        )}

                                        {product.discount && (
                                            <span className="discount-badge">
                                                {product.discount}
                                            </span>
                                        )}

                                    </div>

                                </Link>

                            ))}

                        </div>
                    )}


                    {/* Pagination */}
                    <div className="pagination-bar">

                        <button className="page-btn">
                            &larr; Previous
                        </button>

                        <div className="page-numbers">
                            <span className="active">
                                1
                            </span>
                        </div>

                        <button className="page-btn">
                            Next &rarr;
                        </button>

                    </div>

                </main>

            </div>
        </div>
    );
}

export default CategoryPage;