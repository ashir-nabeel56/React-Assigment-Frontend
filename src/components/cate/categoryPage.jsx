import { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { getProducts } from "../../api/backendapi";
import "./categoryPage.css";

function CategoryPage() {
    const { categoryName } = useParams();

    // =========================================
    // PRODUCTS
    // =========================================

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // =========================================
    // TEMPORARY FILTERS
    // These change only inside the filter panel
    // =========================================

    const [priceRange, setPriceRange] = useState(500);
    const [selectedColor, setSelectedColor] = useState("");
    const [selectedSize, setSelectedSize] = useState("");
    const [selectedStyle, setSelectedStyle] = useState("");

    // =========================================
    // APPLIED FILTERS
    // Products use ONLY these values
    // =========================================

    const [appliedFilters, setAppliedFilters] =
        useState({
            priceRange: 500,
            color: "",
            size: "",
            style: "",
        });

    // =========================================
    // SORT
    // =========================================

    const [sortBy, setSortBy] =
        useState("popular");

    // =========================================
    // MOBILE FILTER
    // =========================================

    const [showFilters, setShowFilters] =
        useState(false);

    // =========================================
    // PAGINATION
    // =========================================

    const [currentPage, setCurrentPage] =
        useState(1);

    const productsPerPage = 4;

    // =========================================
    // FILTER DATA
    // =========================================

    const categoriesList = [
        "T-shirts",
        "Shorts",
        "Shirts",
        "Hoodie",
        "Jeans",
    ];

    const colorsList = [
        "#00C12B",
        "#F52525",
        "#FFC700",
        "#FF7A00",
        "#06CAF0",
        "#1877F2",
        "#7D06F0",
        "#F506A4",
        "#FFFFFF",
        "#000000",
    ];

    const sizesList = [
        "XX-Small",
        "X-Small",
        "Small",
        "Medium",
        "Large",
        "X-Large",
        "XX-Large",
        "3X-Large",
        "4X-Large",
    ];

    const dressStyles = [
        "Casual",
        "Formal",
        "Party",
        "Gym",
    ];

    // =========================================
    // NORMALIZE
    // =========================================

    const normalize = (value) => {
        if (
            value === undefined ||
            value === null
        ) {
            return "";
        }

        return String(value)
            .trim()
            .toLowerCase();
    };

    // =========================================
    // ARRAY HELPER
    // =========================================

    const getValues = (value) => {
        if (Array.isArray(value)) {
            return value;
        }

        if (typeof value === "string") {
            return value
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean);
        }

        return [];
    };

    // =========================================
    // LOAD PRODUCTS
    // =========================================

    useEffect(() => {
        const loadProducts = async () => {
            try {
                setLoading(true);

                const data = await getProducts();

                console.log(
                    "PRODUCT API RESPONSE:",
                    data
                );

                let allProducts = [];

                // Array response
                if (Array.isArray(data)) {
                    allProducts = data;
                }

                // { products: [] }
                else if (
                    data &&
                    Array.isArray(data.products)
                ) {
                    allProducts = data.products;
                }

                // { data: [] }
                else if (
                    data &&
                    Array.isArray(data.data)
                ) {
                    allProducts = data.data;
                }

                // Nested object
                else if (
                    data &&
                    typeof data === "object"
                ) {
                    Object.values(data).forEach(
                        (value) => {
                            if (Array.isArray(value)) {
                                allProducts = [
                                    ...allProducts,
                                    ...value,
                                ];
                            }

                            if (
                                value &&
                                typeof value ===
                                    "object" &&
                                Array.isArray(
                                    value.products
                                )
                            ) {
                                allProducts = [
                                    ...allProducts,
                                    ...value.products,
                                ];
                            }
                        }
                    );
                }

                // Remove duplicates
                const uniqueProducts =
                    allProducts.filter(
                        (product, index, array) => {
                            const id =
                                product._id ||
                                product.id;

                            if (!id) {
                                return true;
                            }

                            return (
                                index ===
                                array.findIndex(
                                    (item) =>
                                        (
                                            item._id ||
                                            item.id
                                        ) === id
                                )
                            );
                        }
                    );

                console.log(
                    "FINAL PRODUCTS:",
                    uniqueProducts
                );

                setProducts(uniqueProducts);
            } catch (error) {
                console.error(
                    "PRODUCT LOAD ERROR:",
                    error
                );

                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, []);

    // =========================================
    // CATEGORY FILTER
    // =========================================

    const categoryProducts = useMemo(() => {
        if (!categoryName) {
            return products;
        }

        const requestedCategory =
            normalize(categoryName);

        // First check actual category fields
        const exactMatches = products.filter(
            (product) => {
                const categoryValues = [
                    ...getValues(
                        product.category
                    ),
                    ...getValues(
                        product.categories
                    ),
                    ...getValues(
                        product.categoryName
                    ),
                    ...getValues(product.type),
                    ...getValues(
                        product.productCategory
                    ),
                ].map(normalize);

                return categoryValues.some(
                    (category) =>
                        category ===
                            requestedCategory ||
                        category.includes(
                            requestedCategory
                        ) ||
                        requestedCategory.includes(
                            category
                        )
                );
            }
        );

        if (exactMatches.length > 0) {
            return exactMatches;
        }

        // Title fallback
        const titleMatches = products.filter(
            (product) => {
                const title = normalize(
                    product.title ||
                        product.name ||
                        ""
                );

                return title.includes(
                    requestedCategory
                );
            }
        );

        if (titleMatches.length > 0) {
            return titleMatches;
        }

        // Don't hide products if category
        // information is unavailable
        return products;
    }, [products, categoryName]);

    // =========================================
    // APPLY FILTERS
    // IMPORTANT:
    // This uses appliedFilters, NOT temporary
    // filter states.
    // =========================================

    const filteredProducts = useMemo(() => {
        let result = [...categoryProducts];

        // =====================================
        // PRICE
        // =====================================

        result = result.filter((product) => {
            const price = Number(product.price);

            if (Number.isNaN(price)) {
                return true;
            }

            return (
                price <=
                Number(
                    appliedFilters.priceRange
                )
            );
        });

        // =====================================
        // COLOR
        // =====================================

        if (appliedFilters.color) {
            const selected =
                normalize(
                    appliedFilters.color
                );

            result = result.filter((product) => {
                const productColors = [
                    ...getValues(product.color),
                    ...getValues(product.colors),
                    ...getValues(
                        product.availableColors
                    ),
                ].map(normalize);

                // If product has no color
                // information, don't hide it
                if (productColors.length === 0) {
                    return true;
                }

                return productColors.some(
                    (color) =>
                        color === selected ||
                        color.includes(selected) ||
                        selected.includes(color)
                );
            });
        }

        // =====================================
        // SIZE
        // =====================================

        if (appliedFilters.size) {
            const selected =
                normalize(
                    appliedFilters.size
                );

            result = result.filter((product) => {
                const productSizes = [
                    ...getValues(product.size),
                    ...getValues(product.sizes),
                    ...getValues(
                        product.availableSizes
                    ),
                ].map(normalize);

                if (productSizes.length === 0) {
                    return true;
                }

                return productSizes.includes(
                    selected
                );
            });
        }

        // =====================================
        // DRESS STYLE
        // =====================================

        if (appliedFilters.style) {
            const selected =
                normalize(
                    appliedFilters.style
                );

            result = result.filter((product) => {
                const productStyles = [
                    ...getValues(product.style),
                    ...getValues(
                        product.dressStyle
                    ),
                    ...getValues(
                        product.dressStyles
                    ),
                ].map(normalize);

                if (productStyles.length === 0) {
                    return true;
                }

                return productStyles.includes(
                    selected
                );
            });
        }

        // =====================================
        // SORT
        // =====================================

        if (sortBy === "popular") {
            result.sort(
                (a, b) =>
                    Number(b.rating || 0) -
                    Number(a.rating || 0)
            );
        }

        if (sortBy === "newest") {
            result.sort((a, b) => {
                const dateA = new Date(
                    a.createdAt ||
                        a.created_at ||
                        0
                );

                const dateB = new Date(
                    b.createdAt ||
                        b.created_at ||
                        0
                );

                return dateB - dateA;
            });
        }

        if (sortBy === "price-low") {
            result.sort(
                (a, b) =>
                    Number(a.price || 0) -
                    Number(b.price || 0)
            );
        }

        if (sortBy === "price-high") {
            result.sort(
                (a, b) =>
                    Number(b.price || 0) -
                    Number(a.price || 0)
            );
        }

        return result;
    }, [
        categoryProducts,
        appliedFilters,
        sortBy,
    ]);

    // =========================================
    // PAGINATION
    // =========================================

    const totalPages = Math.ceil(
        filteredProducts.length /
            productsPerPage
    );

    const startIndex =
        (currentPage - 1) *
        productsPerPage;

    const visibleProducts =
        filteredProducts.slice(
            startIndex,
            startIndex + productsPerPage
        );

    // =========================================
    // APPLY FILTER BUTTON
    // =========================================

    const handleApplyFilter = () => {
        setAppliedFilters({
            priceRange: priceRange,
            color: selectedColor,
            size: selectedSize,
            style: selectedStyle,
        });

        setCurrentPage(1);
        setShowFilters(false);
    };

    // =========================================
    // RESET FILTERS
    // =========================================

    const handleResetFilters = () => {
        // Temporary values
        setPriceRange(500);
        setSelectedColor("");
        setSelectedSize("");
        setSelectedStyle("");

        // Applied values
        setAppliedFilters({
            priceRange: 500,
            color: "",
            size: "",
            style: "",
        });

        setCurrentPage(1);
    };

    // =========================================
    // PAGE CHANGE
    // =========================================

    const goToPage = (page) => {
        if (
            page < 1 ||
            page > totalPages
        ) {
            return;
        }

        setCurrentPage(page);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    // =========================================
    // CATEGORY URL
    // =========================================

    const getCategoryUrl = (category) =>
        `/category/${encodeURIComponent(
            category
        )}`;

    // =========================================
    // RENDER
    // =========================================

    return (
        <div className="category-container">

            {/* =================================
                BREADCRUMB
            ================================= */}

            <div className="category-breadcrumb">

                <Link to="/">
                    Home
                </Link>

                <span>
                    &gt;
                </span>

                <strong>
                    {categoryName ||
                        "All Products"}
                </strong>

            </div>


            {/* =================================
                MOBILE FILTER BUTTON
            ================================= */}

            <button
                className="mobile-filter-btn"
                onClick={() =>
                    setShowFilters(
                        !showFilters
                    )
                }
            >
                <span>
                    ☰
                </span>

                {showFilters
                    ? "Hide Filters"
                    : "Filter"}
            </button>


            <div className="category-layout">

                {/* =================================
                    FILTER SIDEBAR
                ================================= */}

                <aside
                    className={`filters-sidebar ${
                        showFilters
                            ? "show-filters"
                            : ""
                    }`}
                >

                    <div className="filter-header">

                        <h3>
                            Filters
                        </h3>

                        <span className="filter-icon">
                            ⚙
                        </span>

                        <button
                            className="filter-close"
                            onClick={() =>
                                setShowFilters(
                                    false
                                )
                            }
                        >
                            ✕
                        </button>

                    </div>

                    <hr />


                    {/* CATEGORIES */}

                    <div className="filter-group">

                        {categoriesList.map(
                            (category) => (
                                <Link
                                    key={category}
                                    to={getCategoryUrl(
                                        category
                                    )}
                                    className={`filter-item-row ${
                                        normalize(
                                            categoryName
                                        ) ===
                                        normalize(
                                            category
                                        )
                                            ? "active"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        setShowFilters(
                                            false
                                        )
                                    }
                                >
                                    <span>
                                        {category}
                                    </span>

                                    <span>
                                        &gt;
                                    </span>
                                </Link>
                            )
                        )}

                    </div>

                    <hr />


                    {/* PRICE */}

                    <div className="filter-group">

                        <div className="filter-title">

                            <span>
                                Price
                            </span>

                            <span>
                                ▲
                            </span>

                        </div>

                        <input
                            type="range"
                            min="50"
                            max="500"
                            value={priceRange}
                            onChange={(e) =>
                                setPriceRange(
                                    Number(
                                        e.target.value
                                    )
                                )
                            }
                            className="price-slider"
                        />

                        <div className="price-labels">

                            <span>
                                $50
                            </span>

                            <span>
                                ${priceRange}
                            </span>

                        </div>

                    </div>

                    <hr />


                    {/* COLORS */}

                    <div className="filter-group">

                        <div className="filter-title">

                            <span>
                                Colors
                            </span>

                            <span>
                                ▲
                            </span>

                        </div>

                        <div className="color-grid">

                            {colorsList.map(
                                (color) => (
                                    <button
                                        key={color}
                                        type="button"
                                        className={`color-box ${
                                            selectedColor ===
                                            color
                                                ? "active"
                                                : ""
                                        }`}
                                        style={{
                                            backgroundColor:
                                                color,
                                        }}
                                        onClick={() =>
                                            setSelectedColor(
                                                selectedColor ===
                                                    color
                                                    ? ""
                                                    : color
                                            )
                                        }
                                    />
                                )
                            )}

                        </div>

                    </div>

                    <hr />


                    {/* SIZE */}

                    <div className="filter-group">

                        <div className="filter-title">

                            <span>
                                Size
                            </span>

                            <span>
                                ▲
                            </span>

                        </div>

                        <div className="size-grid">

                            {sizesList.map(
                                (size) => (
                                    <button
                                        key={size}
                                        type="button"
                                        className={`size-chip ${
                                            selectedSize ===
                                            size
                                                ? "active"
                                                : ""
                                        }`}
                                        onClick={() =>
                                            setSelectedSize(
                                                selectedSize ===
                                                    size
                                                    ? ""
                                                    : size
                                            )
                                        }
                                    >
                                        {size}
                                    </button>
                                )
                            )}

                        </div>

                    </div>

                    <hr />


                    {/* DRESS STYLE */}

                    <div className="filter-group">

                        <div className="filter-title">

                            <span>
                                Dress Style
                            </span>

                            <span>
                                ▲
                            </span>

                        </div>

                        {dressStyles.map(
                            (style) => (
                                <button
                                    key={style}
                                    type="button"
                                    className={`filter-item-row ${
                                        selectedStyle ===
                                        style
                                            ? "active"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        setSelectedStyle(
                                            selectedStyle ===
                                                style
                                                ? ""
                                                : style
                                        )
                                    }
                                >
                                    <span>
                                        {style}
                                    </span>

                                    <span>
                                        {selectedStyle ===
                                        style
                                            ? "✓"
                                            : ">"}
                                    </span>

                                </button>
                            )
                        )}

                    </div>


                    {/* =================================
                        APPLY FILTER
                    ================================= */}

                    <button
                        className="apply-filter-btn"
                        onClick={
                            handleApplyFilter
                        }
                    >
                        Apply Filter
                    </button>


                    {/* =================================
                        RESET FILTER
                    ================================= */}

                    <button
                        className="reset-filter-btn"
                        onClick={
                            handleResetFilters
                        }
                    >
                        Reset Filters
                    </button>

                </aside>


                {/* =================================
                    PRODUCTS
                ================================= */}

                <main className="products-main">

                    <div className="products-top-bar">

                        <h2>
                            {categoryName ||
                                "All Products"}
                        </h2>

                        <div className="products-sort-info">

                            <span>
                                {filteredProducts.length >
                                0
                                    ? `Showing ${
                                          startIndex +
                                          1
                                      }-${
                                          Math.min(
                                              startIndex +
                                                  productsPerPage,
                                              filteredProducts.length
                                          )
                                      } of ${
                                          filteredProducts.length
                                      } Products`
                                    : "No Products"}
                            </span>

                            <label>
                                Sort by:

                                <select
                                    className="sort-select"
                                    value={sortBy}
                                    onChange={(e) =>
                                        setSortBy(
                                            e.target.value
                                        )
                                    }
                                >
                                    <option value="popular">
                                        Most Popular
                                    </option>

                                    <option value="newest">
                                        Newest
                                    </option>

                                    <option value="price-low">
                                        Price: Low to High
                                    </option>

                                    <option value="price-high">
                                        Price: High to Low
                                    </option>
                                </select>

                            </label>

                        </div>

                    </div>


                    {/* =================================
                        LOADING
                    ================================= */}

                    {loading ? (

                        <div className="products-loading">

                            <div className="loading-spinner"></div>

                            <p>
                                Loading products...
                            </p>

                        </div>

                    ) : filteredProducts.length ===
                      0 ? (

                        /* =================================
                            NO PRODUCTS
                        ================================= */

                        <div className="no-products">

                            <h3>
                                No products found
                            </h3>

                            <p>
                                Try changing your
                                filters.
                            </p>

                            <button
                                onClick={
                                    handleResetFilters
                                }
                            >
                                Reset Filters
                            </button>

                        </div>

                    ) : (

                        /* =================================
                            PRODUCT GRID
                        ================================= */

                        <div className="category-product-grid">

                            {visibleProducts.map(
                                (product) => {

                                    const productId =
                                        product._id ||
                                        product.id;

                                    const title =
                                        product.title ||
                                        product.name ||
                                        "Product";

                                    const image =
                                        product.imageUrl ||
                                        product.image;

                                    const rating =
                                        Number(
                                            product.rating ||
                                                4.5
                                        );

                                    return (
                                        <Link
                                            key={
                                                productId
                                            }
                                            to={`/product/${productId}`}
                                            className="cat-product-card"
                                        >

                                            <div className="cat-img-wrapper">

                                                <img
                                                    src={
                                                        image
                                                    }
                                                    alt={
                                                        title
                                                    }
                                                    loading="lazy"
                                                />

                                            </div>


                                            <h4 className="cat-product-title">
                                                {title}
                                            </h4>


                                            <div className="cat-rating">

                                                <span className="stars">
                                                    ★★★★★
                                                </span>

                                                <span className="score">
                                                    {rating.toFixed(
                                                        1
                                                    )}
                                                    /5
                                                </span>

                                            </div>


                                            <div className="cat-price-row">

                                                <span className="current-price">
                                                    $
                                                    {
                                                        product.price
                                                    }
                                                </span>


                                                {(product.oldPrice ||
                                                    product.originalPrice) && (

                                                    <span className="old-price">
                                                        $
                                                        {product.oldPrice ||
                                                            product.originalPrice}
                                                    </span>

                                                )}


                                                {product.discount && (

                                                    <span className="discount-badge">
                                                        {
                                                            product.discount
                                                        }
                                                    </span>

                                                )}

                                            </div>

                                        </Link>
                                    );
                                }
                            )}

                        </div>
                    )}


                    {/* =================================
                        PAGINATION
                    ================================= */}

                    {!loading &&
                        totalPages > 1 && (

                            <div className="pagination-bar">

                                <button
                                    className="page-btn"
                                    disabled={
                                        currentPage ===
                                        1
                                    }
                                    onClick={() =>
                                        goToPage(
                                            currentPage -
                                                1
                                        )
                                    }
                                >
                                    ← Previous
                                </button>


                                <div className="page-numbers">

                                    {Array.from(
                                        {
                                            length: totalPages,
                                        },
                                        (_, index) =>
                                            index + 1
                                    ).map(
                                        (page) => (

                                            <button
                                                key={
                                                    page
                                                }
                                                className={
                                                    currentPage ===
                                                    page
                                                        ? "active"
                                                        : ""
                                                }
                                                onClick={() =>
                                                    goToPage(
                                                        page
                                                    )
                                                }
                                            >
                                                {page}
                                            </button>

                                        )
                                    )}

                                </div>


                                <button
                                    className="page-btn"
                                    disabled={
                                        currentPage ===
                                        totalPages
                                    }
                                    onClick={() =>
                                        goToPage(
                                            currentPage +
                                                1
                                        )
                                    }
                                >
                                    Next →
                                </button>

                            </div>
                        )}

                </main>

            </div>
        </div>
    );
}

export default CategoryPage;