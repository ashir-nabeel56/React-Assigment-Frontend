import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./productDetail.css";

import YouMight from "../you/youMight";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProducts } from "../../api/backendapi";
import { useCart } from "../cart/CartContext";

function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const [product, setProduct] = useState(null);
    const [selectedImg, setSelectedImg] = useState("");
    const [selectedColor, setSelectedColor] =
        useState("#4F533E");
    const [selectedSize, setSelectedSize] =
        useState("Large");
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);

    const [activeTab, setActiveTab] =
        useState("reviews");

    const [reviews, setReviews] = useState([
        {
            id: 1,
            name: "Samantha D.",
            rating: 5,
            comment:
                "I absolutely love this t-shirt! The design is unique and the fabric feels so comfortable.",
            date: "August 14, 2023",
        },
        {
            id: 2,
            name: "Alex M.",
            rating: 4,
            comment:
                "The t-shirt exceeded my expectations! The colors are vibrant and top-notch quality.",
            date: "August 15, 2023",
        },
        {
            id: 3,
            name: "Ethan R.",
            rating: 5,
            comment:
                "The t-shirt exceeded my expectations! The colors are vibrant and top-notch quality.",
            date: "August 16, 2023",
        },
        {
            id: 4,
            name: "Olivia P.",
            rating: 5,
            comment:
                "Simple and functional design. Feels great to wear everywhere.",
            date: "August 17, 2023",
        },
    ]);

    const [showReviewModal, setShowReviewModal] =
        useState(false);

    const [newReview, setNewReview] = useState({
        name: "",
        rating: 5,
        comment: "",
    });

    const [sortBy, setSortBy] =
        useState("latest");

    const [visibleReviewsCount, setVisibleReviewsCount] =
        useState(6);

    const [openFaqIndex, setOpenFaqIndex] =
        useState(null);

    // ==========================================
    // FETCH PRODUCT
    // ==========================================

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);

                const data = await getProducts();

                const allProducts = Array.isArray(
                    data?.products
                )
                    ? data.products
                    : [];

                const foundProduct =
                    allProducts.find(
                        (p) =>
                            String(p.productId) ===
                                String(id) ||
                            String(p._id) ===
                                String(id)
                    );

                if (!foundProduct) {
                    setProduct(null);
                    return;
                }

                setProduct(foundProduct);

                const mainImg =
                    foundProduct.imageUrl ||
                    foundProduct.image ||
                    (Array.isArray(
                        foundProduct.images
                    )
                        ? foundProduct.images[0]
                        : "");

                setSelectedImg(mainImg || "");
            } catch (error) {
                console.error(
                    "Error fetching product details:",
                    error
                );

                setProduct(null);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    // ==========================================
    // ADD TO CART
    // ==========================================

    const handleAddToCart = async () => {
        const token =
            localStorage.getItem("token");

        const user =
            localStorage.getItem("user");

        const isLoggedIn =
            localStorage.getItem(
                "isLoggedIn"
            ) === "true";

        // ------------------------------------------
        // LOGIN CHECK
        // ------------------------------------------

        if (
            !isLoggedIn ||
            (!token && !user)
        ) {
            toast.error(
                "Please create an account first to add items to cart!",
                {
                    position: "top-right",
                    autoClose: 3000,
                    theme: "dark",
                }
            );

            return;
        }

        if (!product) return;

        const productId =
            product.productId ||
            product._id;

        try {
            // ------------------------------------------
            // PRODUCT TO ADD
            // ------------------------------------------

            const productToAdd = {
                ...product,
                productId,
                size: selectedSize,
                color: selectedColor,
                quantity,
            };

            // ------------------------------------------
            // ADD TO CART API
            // ------------------------------------------

            await addToCart(
                productToAdd,
                quantity
            );

            // ------------------------------------------
            // LOCAL CART
            // ------------------------------------------

            const existingCart =
                JSON.parse(
                    localStorage.getItem(
                        "cart"
                    )
                ) || [];

            const existingIndex =
                existingCart.findIndex(
                    (item) =>
                        item.productId ===
                        productId
                );

            if (existingIndex !== -1) {
                existingCart[
                    existingIndex
                ].quantity += quantity;
            } else {
                existingCart.push(
                    productToAdd
                );
            }

            localStorage.setItem(
                "cart",
                JSON.stringify(existingCart)
            );

            // ------------------------------------------
            // CART UPDATE EVENT
            // ------------------------------------------

            window.dispatchEvent(
                new Event("cartUpdated")
            );

            // ------------------------------------------
            // SUCCESS TOASTIFY
            // ------------------------------------------

            toast.success(
                `${
                    product.title ||
                    product.name
                } added to cart successfully!`,
                {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "dark",
                }
            );
        } catch (error) {
            console.error(
                "Add to cart error:",
                error
            );

            // ------------------------------------------
            // ERROR TOASTIFY
            // ------------------------------------------

            toast.error(
                error?.message ||
                    "Failed to add product to cart",
                {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "dark",
                }
            );
        }
    };

    // ==========================================
    // REVIEW SUBMIT
    // ==========================================

    const handleReviewSubmit = (e) => {
        e.preventDefault();

        if (
            !newReview.name.trim() ||
            !newReview.comment.trim()
        ) {
            return;
        }

        const createdReview = {
            id: Date.now(),
            name: newReview.name,
            rating: Number(
                newReview.rating
            ),
            comment: newReview.comment,
            date: new Date().toLocaleDateString(
                "en-US",
                {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                }
            ),
        };

        setReviews([
            createdReview,
            ...reviews,
        ]);

        setShowReviewModal(false);

        setNewReview({
            name: "",
            rating: 5,
            comment: "",
        });

        toast.success(
            "Review added successfully!",
            {
                position: "top-right",
                autoClose: 3000,
                theme: "dark",
            }
        );
    };

    // ==========================================
    // SORT REVIEWS
    // ==========================================

    const sortedReviews = [
        ...reviews,
    ].sort((a, b) => {
        if (sortBy === "latest")
            return b.id - a.id;

        if (sortBy === "oldest")
            return a.id - b.id;

        if (sortBy === "highest")
            return b.rating - a.rating;

        if (sortBy === "lowest")
            return a.rating - b.rating;

        return 0;
    });

    // ==========================================
    // FAQS
    // ==========================================

    const faqs = [
        {
            question:
                "How long does shipping take?",
            answer:
                "Standard shipping takes 3-5 business days. Express delivery arrives within 24-48 hours.",
        },
        {
            question:
                "What is the return policy?",
            answer:
                "We offer a 30-day hassle-free return policy. Items must be unworn with original tags attached.",
        },
        {
            question:
                "How do I care for and wash this product?",
            answer:
                "Machine wash cold with similar colors. Tumble dry low or line dry to preserve fabric softness.",
        },
        {
            question:
                "Are the colors accurate to the photos?",
            answer:
                "Yes, studio lighting accurately displays true product colors, though slight variations can occur on different screens.",
        },
    ];

    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {
        return (
            <>
                <div className="loader-box">
                    Loading Product Details...
                </div>

                <ToastContainer
                    position="top-right"
                    style={{ top: "80px" }}
                />
            </>
        );
    }

    // ==========================================
    // PRODUCT NOT FOUND
    // ==========================================

    if (!product) {
        return (
            <>
                <div className="not-found-box">
                    <h2>
                        Product Not Found
                    </h2>

                    <button
                        onClick={() =>
                            navigate("/")
                        }
                    >
                        Go Back Home
                    </button>
                </div>

                <ToastContainer
                    position="top-right"
                    style={{ top: "80px" }}
                />
            </>
        );
    }

    // ==========================================
    // PRODUCT IMAGES
    // ==========================================

    const productImages =
        Array.isArray(product.images) &&
        product.images.length > 0
            ? product.images
            : [
                  product.imageUrl ||
                      product.image,
              ];

    // ==========================================
    // UI
    // ==========================================

    return (
        <div className="product-detail-container">

            {/* ==================================
                TOASTIFY
            ================================== */}

            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={true}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                style={{
                    top: "80px",
                }}
            />

            {/* ==================================
                BREADCRUMB
            ================================== */}

            <div className="breadcrumb">
                Home
                <span>&gt;</span>
                Shop
                <span>&gt;</span>

                <strong>
                    {product.title ||
                        product.name}
                </strong>
            </div>

            {/* ==================================
                PRODUCT MAIN SECTION
            ================================== */}

            <div className="product-main-section">

                {/* PRODUCT GALLERY */}

                <div className="product-gallery">

                    <div className="thumbnail-list">

                        {productImages
                            .slice(0, 3)
                            .map(
                                (
                                    img,
                                    idx
                                ) => (
                                    <img
                                        key={
                                            idx
                                        }
                                        src={
                                            img
                                        }
                                        alt={`Thumb ${idx}`}
                                        className={`thumbnail-img ${
                                            selectedImg ===
                                            img
                                                ? "active"
                                                : ""
                                        }`}
                                        onClick={() =>
                                            setSelectedImg(
                                                img
                                            )
                                        }
                                    />
                                )
                            )}

                    </div>

                    <div className="main-image-box">

                        <img
                            src={selectedImg}
                            alt={
                                product.title ||
                                product.name
                            }
                            className="main-image"
                        />

                    </div>

                </div>

                {/* PRODUCT INFO */}

                <div className="product-info-box">

                    <h1 className="product-title-heading">
                        {product.title ||
                            product.name}
                    </h1>

                    <div className="rating-row">

                        <span className="stars-gold">
                            ★★★★☆
                        </span>

                        <span className="score-text">
                            {product.rating ||
                                4.5}
                            /5
                        </span>

                    </div>

                    <div className="price-row">

                        <span className="current-price-tag">
                            $
                            {
                                product.price
                            }
                        </span>

                        {product.oldPrice && (
                            <span className="old-price-tag">
                                $
                                {
                                    product.oldPrice
                                }
                            </span>
                        )}

                    </div>

                    <p className="product-desc">
                        {
                            product.description
                        }
                    </p>

                    {/* COLORS */}

                    <div>

                        <div className="section-label">
                            Select Colors
                        </div>

                        <div className="color-options">

                            {[
                                "#4F533E",
                                "#1F4E44",
                                "#1E2340",
                            ].map(
                                (color) => (
                                    <div
                                        key={
                                            color
                                        }
                                        className={`color-circle ${
                                            selectedColor ===
                                            color
                                                ? "selected"
                                                : ""
                                        }`}
                                        style={{
                                            backgroundColor:
                                                color,
                                        }}
                                        onClick={() =>
                                            setSelectedColor(
                                                color
                                            )
                                        }
                                    />
                                )
                            )}

                        </div>

                    </div>

                    {/* SIZE */}

                    <div>

                        <div className="section-label">
                            Choose Size
                        </div>

                        <div className="size-options">

                            {[
                                "Small",
                                "Medium",
                                "Large",
                                "X-Large",
                            ].map(
                                (size) => (
                                    <button
                                        key={
                                            size
                                        }
                                        className={`size-btn ${
                                            selectedSize ===
                                            size
                                                ? "active"
                                                : ""
                                        }`}
                                        onClick={() =>
                                            setSelectedSize(
                                                size
                                            )
                                        }
                                    >
                                        {size}
                                    </button>
                                )
                            )}

                        </div>

                    </div>

                    {/* ACTIONS */}

                    <div className="action-row">

                        <div className="quantity-picker">

                            <button
                                onClick={() =>
                                    setQuantity(
                                        (
                                            prev
                                        ) =>
                                            Math.max(
                                                1,
                                                prev -
                                                    1
                                            )
                                    )
                                }
                            >
                                −
                            </button>

                            <span>
                                {quantity}
                            </span>

                            <button
                                onClick={() =>
                                    setQuantity(
                                        (
                                            prev
                                        ) =>
                                            prev +
                                            1
                                    )
                                }
                            >
                                +
                            </button>

                        </div>

                        <button
                            className="add-cart-btn"
                            onClick={
                                handleAddToCart
                            }
                        >
                            Add to Cart
                        </button>

                    </div>

                </div>

            </div>

            {/* ==================================
                TABS
            ================================== */}

            <div className="tabs-header">

                <button
                    className={`tab-item ${
                        activeTab ===
                        "details"
                            ? "active-tab"
                            : ""
                    }`}
                    onClick={() =>
                        setActiveTab(
                            "details"
                        )
                    }
                >
                    Product Details
                </button>

                <button
                    className={`tab-item ${
                        activeTab ===
                        "reviews"
                            ? "active-tab"
                            : ""
                    }`}
                    onClick={() =>
                        setActiveTab(
                            "reviews"
                        )
                    }
                >
                    Rating & Reviews
                </button>

                <button
                    className={`tab-item ${
                        activeTab ===
                        "faqs"
                            ? "active-tab"
                            : ""
                    }`}
                    onClick={() =>
                        setActiveTab(
                            "faqs"
                        )
                    }
                >
                    FAQs
                </button>

            </div>

            {/* ==================================
                PRODUCT DETAILS
            ================================== */}

            {activeTab === "details" && (
                <div className="tab-pane details-pane">

                    <div className="details-hero-card">

                        <h3>
                            Product Overview
                        </h3>

                        <p className="details-description">
                            {product.description ||
                                "Designed for daily comfort and long-lasting durability. Crafted with high-grade breathable fabric, tailored fit, and attention to detail."}
                        </p>

                    </div>

                    <div className="specs-section">

                        <h4 className="specs-title">
                            Key Specifications
                        </h4>

                        <div className="specs-grid">

                            <div className="spec-card">
                                <span className="spec-icon">
                                    🧵
                                </span>

                                <div className="spec-info">
                                    <span className="spec-label">
                                        Material
                                    </span>

                                    <span className="spec-value">
                                        100% Premium Cotton
                                    </span>
                                </div>
                            </div>

                            <div className="spec-card">
                                <span className="spec-icon">
                                    📐
                                </span>

                                <div className="spec-info">
                                    <span className="spec-label">
                                        Fit Type
                                    </span>

                                    <span className="spec-value">
                                        Regular / Modern Fit
                                    </span>
                                </div>
                            </div>

                            <div className="spec-card">
                                <span className="spec-icon">
                                    🧼
                                </span>

                                <div className="spec-info">
                                    <span className="spec-label">
                                        Care Instructions
                                    </span>

                                    <span className="spec-value">
                                        Cold Machine Wash
                                    </span>
                                </div>
                            </div>

                            <div className="spec-card">
                                <span className="spec-icon">
                                    🏷️
                                </span>

                                <div className="spec-info">
                                    <span className="spec-label">
                                        Category
                                    </span>

                                    <span className="spec-value">
                                        {
                                            product.category ||
                                            "Apparel"
                                        }
                                    </span>
                                </div>
                            </div>

                        </div>

                    </div>

                </div>
            )}

            {/* ==================================
                REVIEWS
            ================================== */}

            {activeTab === "reviews" && (
                <div className="tab-pane reviews-pane">

                    <div className="reviews-head-bar">

                        <h3>
                            All Reviews{" "}
                            <span>
                                (
                                {
                                    reviews.length
                                }
                                )
                            </span>
                        </h3>

                        <div className="reviews-actions">

                            <select
                                className="sort-select"
                                value={sortBy}
                                onChange={(
                                    e
                                ) =>
                                    setSortBy(
                                        e
                                            .target
                                            .value
                                    )
                                }
                            >
                                <option value="latest">
                                    Latest
                                </option>

                                <option value="oldest">
                                    Oldest
                                </option>

                                <option value="highest">
                                    Highest Rating
                                </option>

                                <option value="lowest">
                                    Lowest Rating
                                </option>
                            </select>

                            <button
                                className="write-review-btn"
                                onClick={() =>
                                    setShowReviewModal(
                                        true
                                    )
                                }
                            >
                                Write a Review
                            </button>

                        </div>

                    </div>

                    <div className="reviews-grid">

                        {sortedReviews
                            .slice(
                                0,
                                visibleReviewsCount
                            )
                            .map(
                                (rev) => (
                                    <div
                                        key={
                                            rev.id
                                        }
                                        className="review-card"
                                    >

                                        <div className="review-stars">
                                            {"★".repeat(
                                                rev.rating
                                            )}
                                            {"☆".repeat(
                                                5 -
                                                    rev.rating
                                            )}
                                        </div>

                                        <div className="review-user">
                                            {
                                                rev.name
                                            }{" "}
                                            <span className="verified-badge">
                                                ✓
                                            </span>
                                        </div>

                                        <p className="review-text">
                                            "
                                            {
                                                rev.comment
                                            }
                                            "
                                        </p>

                                        <div className="review-date">
                                            Posted on{" "}
                                            {
                                                rev.date
                                            }
                                        </div>

                                    </div>
                                )
                            )}

                    </div>

                    {visibleReviewsCount <
                        reviews.length && (
                        <div className="load-more-container">

                            <button
                                className="load-more-btn"
                                onClick={() =>
                                    setVisibleReviewsCount(
                                        (
                                            prev
                                        ) =>
                                            prev +
                                            6
                                    )
                                }
                            >
                                Load More Reviews
                            </button>

                        </div>
                    )}

                </div>
            )}

            {/* ==================================
                FAQS
            ================================== */}

            {activeTab === "faqs" && (
                <div className="tab-pane faqs-pane">

                    <div className="faq-header">

                        <h3>
                            Frequently Asked Questions
                        </h3>

                        <p>
                            Find quick answers to common questions about shipping, returns, and product care.
                        </p>

                    </div>

                    <div className="faq-container">

                        {faqs.map(
                            (
                                faq,
                                idx
                            ) => {
                                const isOpen =
                                    openFaqIndex ===
                                    idx;

                                return (
                                    <div
                                        key={
                                            idx
                                        }
                                        className={`faq-card ${
                                            isOpen
                                                ? "active"
                                                : ""
                                        }`}
                                        onClick={() =>
                                            setOpenFaqIndex(
                                                isOpen
                                                    ? null
                                                    : idx
                                            )
                                        }
                                    >

                                        <div className="faq-question-bar">

                                            <span className="faq-question-text">
                                                {
                                                    faq.question
                                                }
                                            </span>

                                            <span className="faq-toggle-icon">
                                                {isOpen
                                                    ? "−"
                                                    : "+"}
                                            </span>

                                        </div>

                                        {isOpen && (
                                            <div className="faq-answer-body">

                                                <p>
                                                    {
                                                        faq.answer
                                                    }
                                                </p>

                                            </div>
                                        )}

                                    </div>
                                );
                            }
                        )}

                    </div>

                </div>
            )}

            {/* ==================================
                WRITE REVIEW MODAL
            ================================== */}

            {showReviewModal && (
                <div className="modal-backdrop">

                    <div className="modal-content">

                        <h3>
                            Write a Review
                        </h3>

                        <form
                            onSubmit={
                                handleReviewSubmit
                            }
                        >

                            <input
                                type="text"
                                placeholder="Your Name"
                                value={
                                    newReview.name
                                }
                                onChange={(e) =>
                                    setNewReview(
                                        {
                                            ...newReview,
                                            name: e
                                                .target
                                                .value,
                                        }
                                    )
                                }
                                required
                            />

                            <select
                                value={
                                    newReview.rating
                                }
                                onChange={(e) =>
                                    setNewReview(
                                        {
                                            ...newReview,
                                            rating: e
                                                .target
                                                .value,
                                        }
                                    )
                                }
                            >
                                <option value="5">
                                    5 Stars ★★★★★
                                </option>

                                <option value="4">
                                    4 Stars ★★★★☆
                                </option>

                                <option value="3">
                                    3 Stars ★★★☆☆
                                </option>

                                <option value="2">
                                    2 Stars ★★☆☆☆
                                </option>

                                <option value="1">
                                    1 Star ★☆☆☆☆
                                </option>
                            </select>

                            <textarea
                                placeholder="Share your experience with this product..."
                                rows="4"
                                value={
                                    newReview.comment
                                }
                                onChange={(e) =>
                                    setNewReview(
                                        {
                                            ...newReview,
                                            comment: e
                                                .target
                                                .value,
                                        }
                                    )
                                }
                                required
                            />

                            <div className="modal-actions">

                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={() =>
                                        setShowReviewModal(
                                            false
                                        )
                                    }
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="submit-btn"
                                >
                                    Submit Review
                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            )}

            {/* ==================================
                YOU MIGHT ALSO LIKE
            ================================== */}

            <YouMight />

        </div>
    );
}

export default ProductDetail;