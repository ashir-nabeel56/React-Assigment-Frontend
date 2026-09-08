import { toast } from 'react-toastify';
import './productDetail.css';
import YouMight from "../you/youMight";
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProducts, addToCartAPI } from '../../api/backendapi';
import { useCart } from '../cart/CartContext';

function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { addToCart } = useCart();

    const [product, setProduct] = useState(null);
    const [selectedImg, setSelectedImg] = useState('');
    const [selectedColor, setSelectedColor] = useState('#4F533E');
    const [selectedSize, setSelectedSize] = useState('Large');
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);

    const reviews = [
        {
            id: 1,
            name: "Samantha D.",
            rating: 5,
            comment: "I absolutely love this t-shirt! The design is unique and the fabric feels so comfortable.",
            date: "August 14, 2023"
        },
        {
            id: 2,
            name: "Alex M.",
            rating: 4,
            comment: "The t-shirt exceeded my expectations! The colors are vibrant and top-notch quality.",
            date: "August 15, 2023"
        },
        {
            id: 3,
            name: "Ethan R.",
            rating: 5,
            comment: "The t-shirt exceeded my expectations! The colors are vibrant and top-notch quality.",
            date: "August 16, 2023"
        },
        {
            id: 4,
            name: "Olivia P.",
            rating: 5,
            comment: "Simple and functional design. Feels great to wear everywhere.",
            date: "August 17, 2023"
        },
        {
            id: 5,
            name: "Liam K.",
            rating: 4,
            comment: "Fusion of comfort and creativity. Highly recommended!",
            date: "August 18, 2023"
        },
        {
            id: 6,
            name: "Ava H.",
            rating: 5,
            comment: "Great quality product. Intricate details and thoughtful layout.",
            date: "August 19, 2023"
        }
    ];

    // ==========================
    // FETCH PRODUCT
    // ==========================
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);

                const data = await getProducts();

                console.log(
                    "Product detail API data:",
                    data
                );

                // ==========================
                // GET PRODUCTS FROM API
                // ==========================
                const allProducts = Array.isArray(data?.products)
                    ? data.products
                    : [];

                // ==========================
                // FIND PRODUCT
                // ==========================
                const foundProduct = allProducts.find(
                    (p) =>
                        String(p.productId) === String(id) ||
                        String(p._id) === String(id)
                );

                console.log(
                    "Found product:",
                    foundProduct
                );

                if (!foundProduct) {
                    setProduct(null);
                    return;
                }

                setProduct(foundProduct);

                // ==========================
                // PRODUCT IMAGE FROM BACKEND
                // ==========================
                const mainImg =
                    foundProduct.imageUrl ||
                    foundProduct.image ||
                    (
                        Array.isArray(foundProduct.images)
                            ? foundProduct.images[0]
                            : ''
                    );

                setSelectedImg(mainImg || '');

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


    // ==========================
    // ADD TO CART
    // ==========================
    const handleAddToCart = async () => {

        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        const isLoggedIn =
            localStorage.getItem('isLoggedIn') === 'true';

        // ==========================
        // LOGIN CHECK
        // ==========================
        if (!isLoggedIn || (!token && !user)) {
            toast.error(
                'Please create an account first to add items to cart!',
                {
                    theme: "dark",
                    autoClose: 3000,
                }
            );
            return;
        }

        if (!product) {
            toast.error(
                'Product available nahi hai.',
                {
                    theme: "dark",
                }
            );
            return;
        }

        // ==========================
        // PRODUCT ID FROM MONGODB
        // ==========================
        const productId = product.productId;

        if (!productId) {
            console.error(
                "Product mein productId missing hai:",
                product
            );

            toast.error(
                'Product ID missing hai.',
                {
                    theme: "dark",
                }
            );

            return;
        }

        console.log(
            "Adding product to cart:",
            productId
        );

        try {

            // ==========================
            // BACKEND CART
            // ==========================
            await addToCartAPI(
                productId,
                quantity
            );

            // ==========================
            // CART CONTEXT
            // ==========================
            const productToAdd = {
                ...product,
                productId,
                size: selectedSize,
                color: selectedColor,
                quantity
            };

            if (addToCart) {
                addToCart(
                    productToAdd,
                    quantity
                );
            }

            // ==========================
            // LOCAL STORAGE
            // ==========================
            const existingCart =
                JSON.parse(
                    localStorage.getItem('cart')
                ) || [];

            const existingIndex =
                existingCart.findIndex(
                    (item) =>
                        item.productId === productId
                );

            if (existingIndex !== -1) {

                existingCart[existingIndex].quantity +=
                    quantity;

            } else {

                existingCart.push(productToAdd);

            }

            localStorage.setItem(
                'cart',
                JSON.stringify(existingCart)
            );

            // ==========================
            // CART UPDATE EVENT
            // ==========================
            window.dispatchEvent(
                new Event('cartUpdated')
            );

            toast.success(
                `${product.title || product.name} cart mein add ho gaya!`,
                {
                    theme: "dark",
                }
            );

        } catch (error) {

            console.error(
                'Add to cart error:',
                error
            );

            toast.error(
                error.message ||
                'Cart mein add nahi ho saka, dobara try karein.',
                {
                    theme: "dark",
                }
            );
        }
    };


    // ==========================
    // LOADING
    // ==========================
    if (loading) {
        return (
            <h2
                style={{
                    textAlign: 'center',
                    marginTop: '100px'
                }}
            >
                Loading Product Details...
            </h2>
        );
    }


    // ==========================
    // PRODUCT NOT FOUND
    // ==========================
    if (!product) {
        return (
            <div
                style={{
                    textAlign: 'center',
                    marginTop: '100px'
                }}
            >
                <h2>Product Nahi Mila!</h2>

                <button
                    onClick={() => navigate('/')}
                    style={{
                        padding: '10px 20px',
                        marginTop: '20px',
                        cursor: 'pointer'
                    }}
                >
                    Go Back to Home
                </button>
            </div>
        );
    }


    // ==========================
    // IMAGES FROM BACKEND
    // ==========================
    const productImages =
        Array.isArray(product.images) &&
        product.images.length > 0
            ? product.images
            : product.imageUrl
                ? [product.imageUrl]
                : product.image
                    ? [product.image]
                    : [];


    return (
        <div className="product-detail-container">

            {/* BREADCRUMB */}
            <div className="breadcrumb">
                Home
                <span>&gt;</span>
                Shop
                <span>&gt;</span>
                Products
                <span>&gt;</span>

                <strong>
                    {product.title || product.name}
                </strong>
            </div>


            {/* MAIN PRODUCT */}
            <div className="product-main-section">

                {/* GALLERY */}
                <div className="product-gallery">

                    <div className="thumbnail-list">

                        {productImages
                            .slice(0, 3)
                            .map((img, idx) => (
                                <img
                                    key={idx}
                                    src={img}
                                    alt={`${product.title || 'Product'} ${idx + 1}`}
                                    className={`thumbnail-img ${
                                        selectedImg === img
                                            ? 'active'
                                            : ''
                                    }`}
                                    onClick={() =>
                                        setSelectedImg(img)
                                    }
                                />
                            ))}

                    </div>


                    <div className="main-image-box">

                        {selectedImg && (
                            <img
                                src={selectedImg}
                                alt={
                                    product.title ||
                                    product.name
                                }
                                className="main-image"
                            />
                        )}

                    </div>

                </div>


                {/* PRODUCT INFO */}
                <div className="product-info-box">

                    <h1 className="product-title-heading">
                        {product.title || product.name}
                    </h1>


                    {/* RATING */}
                    <div className="rating-row">

                        <span className="stars-gold">
                            ★★★★☆
                        </span>

                        <span className="score-text">
                            {product.rating || 0}/5
                        </span>

                    </div>


                    {/* PRICE */}
                    <div className="price-row">

                        <span className="current-price-tag">
                            ${product.price}
                        </span>

                        {product.oldPrice && (
                            <span className="old-price-tag">
                                ${product.oldPrice}
                            </span>
                        )}

                        {product.discount && (
                            <span className="discount-badge">
                                {product.discount}
                            </span>
                        )}

                    </div>


                    {/* DESCRIPTION */}
                    <p className="product-desc">
                        {product.description}
                    </p>


                    {/* COLORS */}
                    <div>

                        <div className="section-label">
                            Select Colors
                        </div>

                        <div className="color-options">

                            {[
                                '#4F533E',
                                '#1F4E44',
                                '#1E2340'
                            ].map(
                                (color, i) => (
                                    <div
                                        key={i}
                                        className="color-circle"
                                        style={{
                                            backgroundColor:
                                                color
                                        }}
                                        onClick={() =>
                                            setSelectedColor(
                                                color
                                            )
                                        }
                                    >
                                        {selectedColor ===
                                            color &&
                                            '✓'}
                                    </div>
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
                                'Small',
                                'Medium',
                                'Large',
                                'X-Large'
                            ].map(
                                (size) => (
                                    <button
                                        key={size}
                                        className={`size-btn ${
                                            selectedSize === size
                                                ? 'active'
                                                : ''
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
                                        (prev) =>
                                            Math.max(
                                                1,
                                                prev - 1
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
                                        (prev) =>
                                            prev + 1
                                    )
                                }
                            >
                                +
                            </button>

                        </div>


                        <button
                            className="add-cart-btn"
                            onClick={handleAddToCart}
                        >
                            Add to Cart
                        </button>

                    </div>

                </div>

            </div>


            {/* TABS */}
            <div className="tabs-header">

                <div className="tab-item disabled-tab">
                    Product Details
                </div>

                <div className="tab-item active-tab">
                    Rating & Reviews
                </div>

                <div className="tab-item disabled-tab">
                    FAQs
                </div>

            </div>


            {/* REVIEWS */}
            <div className="reviews-section">

                <div className="reviews-head-bar">

                    <div className="reviews-title">

                        All Reviews
                        <span className="reviews-count">
                            (451)
                        </span>

                    </div>


                    <div className="reviews-actions">

                        <button className="filter-btn">
                            ⚙
                        </button>

                        <select className="sort-select">
                            <option>
                                Latest
                            </option>
                        </select>

                        <button className="write-review-btn">
                            Write a Review
                        </button>

                    </div>

                </div>


                <div className="reviews-grid">

                    {reviews.map(
                        (rev) => (
                            <div
                                key={rev.id}
                                className="review-card"
                            >

                                <div className="card-top-row">

                                    <div className="review-stars">
                                        {'★'.repeat(
                                            rev.rating
                                        )}

                                        {'☆'.repeat(
                                            5 -
                                            rev.rating
                                        )}
                                    </div>

                                    <div className="more-options">
                                        •••
                                    </div>

                                </div>


                                <div className="review-user">

                                    {rev.name}

                                    <span className="verified-badge">
                                        ✓
                                    </span>

                                </div>


                                <p className="review-text">
                                    "{rev.comment}"
                                </p>


                                <div className="review-date">
                                    Posted on {rev.date}
                                </div>

                            </div>
                        )
                    )}

                </div>


                <div className="load-more-container">

                    <button className="load-more-btn">
                        Load More Reviews
                    </button>

                </div>

            </div>


            {/* YOU MIGHT ALSO LIKE */}
            <YouMight />

        </div>
    );
}

export default ProductDetail;




// import { toast } from 'react-toastify';
// import './productDetail.css';
// import YouMight from "../you/youMight";
// import { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { getProducts, addToCartAPI } from '../../api/backendapi';
// import { useCart } from '../cart/CartContext';

// function ProductDetail() {
//     const { id } = useParams();
//     const navigate = useNavigate();

//     const { addToCart } = useCart();

//     const [product, setProduct] = useState(null);
//     const [selectedImg, setSelectedImg] = useState('');
//     const [selectedColor, setSelectedColor] = useState('#4F533E');
//     const [selectedSize, setSelectedSize] = useState('Large');
//     const [quantity, setQuantity] = useState(1);
//     const [loading, setLoading] = useState(true);

//     const reviews = [
//         {
//             id: 1,
//             name: "Samantha D.",
//             rating: 5,
//             comment: "I absolutely love this t-shirt! The design is unique and the fabric feels so comfortable.",
//             date: "August 14, 2023"
//         },
//         {
//             id: 2,
//             name: "Alex M.",
//             rating: 4,
//             comment: "The t-shirt exceeded my expectations! The colors are vibrant and top-notch quality.",
//             date: "August 15, 2023"
//         },
//         {
//             id: 3,
//             name: "Ethan R.",
//             rating: 5,
//             comment: "This t-shirt is a must-have for anyone who appreciates good design and perfect fit.",
//             date: "August 16, 2023"
//         },
//         {
//             id: 4,
//             name: "Olivia P.",
//             rating: 5,
//             comment: "Simple and functional design. Feels great to wear everywhere.",
//             date: "August 17, 2023"
//         },
//         {
//             id: 5,
//             name: "Liam K.",
//             rating: 4,
//             comment: "Fusion of comfort and creativity. Highly recommended!",
//             date: "August 18, 2023"
//         },
//         {
//             id: 6,
//             name: "Ava H.",
//             rating: 5,
//             comment: "Great quality product. Intricate details and thoughtful layout.",
//             date: "August 19, 2023"
//         }
//     ];


//     // ==========================
//     // FETCH PRODUCT
//     // ==========================
//     useEffect(() => {
//         const fetchProduct = async () => {
//             try {
//                 setLoading(true);

//                 const data = await getProducts();

//                 console.log("Product detail API data:", data);

//                 let allProducts = [];

//                 // --------------------------
//                 // API products array
//                 // --------------------------
//                 if (data?.products && Array.isArray(data.products)) {
//                     allProducts = data.products;
//                 }

//                 // --------------------------
//                 // Sections
//                 // --------------------------
//                 if (data?.newArrivals) {
//                     allProducts = [
//                         ...allProducts,
//                         ...data.newArrivals
//                     ];
//                 }

//                 if (data?.topSelling) {
//                     allProducts = [
//                         ...allProducts,
//                         ...data.topSelling
//                     ];
//                 }

//                 if (data?.youMightAlsoLike) {
//                     allProducts = [
//                         ...allProducts,
//                         ...data.youMightAlsoLike
//                     ];
//                 }

//                 // --------------------------
//                 // Remove duplicates
//                 // --------------------------
//                 const uniqueProducts = Array.from(
//                     new Map(
//                         allProducts.map((item) => [
//                             item.productId || item._id || item.id,
//                             item
//                         ])
//                     ).values()
//                 );

//                 console.log(
//                     "All unique products:",
//                     uniqueProducts
//                 );

//                 // ==========================
//                 // FIND PRODUCT
//                 // ==========================
//                 const foundProduct = uniqueProducts.find(
//                     (p) =>
//                         String(p.productId) === String(id) ||
//                         String(p._id) === String(id) ||
//                         String(p.id) === String(id)
//                 );

//                 console.log(
//                     "Found product:",
//                     foundProduct
//                 );

//                 if (!foundProduct) {
//                     setProduct(null);
//                     return;
//                 }

//                 setProduct(foundProduct);

//                 // ==========================
//                 // PRODUCT IMAGE
//                 // ==========================
//                 const mainImg =
//                     foundProduct.imageUrl ||
//                     foundProduct.image ||
//                     (
//                         Array.isArray(foundProduct.images)
//                             ? foundProduct.images[0]
//                             : ''
//                     );

//                 setSelectedImg(mainImg || '');

//             } catch (error) {
//                 console.error(
//                     "Error fetching product details:",
//                     error
//                 );

//                 setProduct(null);

//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchProduct();

//     }, [id]);


//     // ==========================
//     // ADD TO CART
//     // ==========================
//     const handleAddToCart = async () => {

//         const token = localStorage.getItem('token');
//         const user = localStorage.getItem('user');
//         const isLoggedIn =
//             localStorage.getItem('isLoggedIn') === 'true';

//         // --------------------------
//         // LOGIN CHECK
//         // --------------------------
//         if (!isLoggedIn || (!token && !user)) {
//             toast.error(
//                 'Please create an account first to add items to cart!',
//                 {
//                     theme: "dark",
//                     autoClose: 3000,
//                 }
//             );
//             return;
//         }

//         if (!product) {
//             toast.error('Product available nahi hai.', {
//                 theme: "dark",
//             });
//             return;
//         }

//         // ==========================
//         // IMPORTANT PRODUCT ID
//         // ==========================
//         const productId = product.productId;

//         if (!productId) {
//             console.error(
//                 "Product mein productId missing hai:",
//                 product
//             );

//             toast.error(
//                 'Product ID missing hai.',
//                 {
//                     theme: "dark",
//                 }
//             );

//             return;
//         }

//         console.log(
//             "Adding product to cart:",
//             productId
//         );

//         try {

//             // ==========================
//             // BACKEND CART
//             // ==========================
//             await addToCartAPI(
//                 productId,
//                 quantity
//             );

//             // ==========================
//             // CART CONTEXT
//             // ==========================
//             const productToAdd = {
//                 ...product,

//                 // Make sure productId remains available
//                 productId,

//                 size: selectedSize,
//                 color: selectedColor,
//                 quantity
//             };

//             if (addToCart) {
//                 addToCart(
//                     productToAdd,
//                     quantity
//                 );
//             }

//             // ==========================
//             // LOCAL STORAGE
//             // ==========================
//             const existingCart =
//                 JSON.parse(
//                     localStorage.getItem('cart')
//                 ) || [];

//             const existingIndex =
//                 existingCart.findIndex(
//                     (item) =>
//                         item.productId === productId
//                 );

//             if (existingIndex !== -1) {

//                 existingCart[existingIndex].quantity +=
//                     quantity;

//             } else {

//                 existingCart.push(productToAdd);

//             }

//             localStorage.setItem(
//                 'cart',
//                 JSON.stringify(existingCart)
//             );

//             // ==========================
//             // CART UPDATE EVENT
//             // ==========================
//             window.dispatchEvent(
//                 new Event('cartUpdated')
//             );

//             toast.success(
//                 `${product.title || product.name} cart mein add ho gaya!`,
//                 {
//                     theme: "dark",
//                 }
//             );

//         } catch (error) {

//             console.error(
//                 'Add to cart error:',
//                 error
//             );

//             toast.error(
//                 error.message ||
//                 'Cart mein add nahi ho saka, dobara try karein.',
//                 {
//                     theme: "dark",
//                 }
//             );
//         }
//     };


//     // ==========================
//     // LOADING
//     // ==========================
//     if (loading) {
//         return (
//             <h2
//                 style={{
//                     textAlign: 'center',
//                     marginTop: '100px'
//                 }}
//             >
//                 Loading Product Details...
//             </h2>
//         );
//     }


//     // ==========================
//     // PRODUCT NOT FOUND
//     // ==========================
//     if (!product) {
//         return (
//             <div
//                 style={{
//                     textAlign: 'center',
//                     marginTop: '100px'
//                 }}
//             >
//                 <h2>Product Nahi Mila!</h2>

//                 <button
//                     onClick={() => navigate('/')}
//                     style={{
//                         padding: '10px 20px',
//                         marginTop: '20px',
//                         cursor: 'pointer'
//                     }}
//                 >
//                     Go Back to Home
//                 </button>
//             </div>
//         );
//     }


//     // ==========================
//     // IMAGES
//     // ==========================
//     const mainImageFallback =
//         product.imageUrl ||
//         product.image ||
//         '';

//     const productImages =
//         Array.isArray(product.images) &&
//             product.images.length > 0
//             ? product.images
//             : [mainImageFallback];


//     return (
//         <div className="product-detail-container">

//             {/* ==========================
//                 BREADCRUMB
//             ========================== */}
//             <div className="breadcrumb">
//                 Home
//                 <span>&gt;</span>
//                 Shop
//                 <span>&gt;</span>
//                 Products
//                 <span>&gt;</span>

//                 <strong>
//                     {product.title || product.name}
//                 </strong>
//             </div>


//             {/* ==========================
//                 MAIN PRODUCT
//             ========================== */}
//             <div className="product-main-section">

//                 {/* GALLERY */}
//                 <div className="product-gallery">

//                     <div className="thumbnail-list">

//                         {productImages
//                             .slice(0, 3)
//                             .map((img, idx) => (
//                                 <img
//                                     key={idx}
//                                     src={img}
//                                     alt={`thumb-${idx}`}
//                                     className={`thumbnail-img ${selectedImg === img
//                                             ? 'active'
//                                             : ''
//                                         }`}
//                                     onClick={() =>
//                                         setSelectedImg(img)
//                                     }
//                                 />
//                             ))}

//                     </div>


//                     <div className="main-image-box">

//                         <img
//                             src={
//                                 selectedImg ||
//                                 mainImageFallback
//                             }
//                             alt={
//                                 product.title ||
//                                 product.name
//                             }
//                             className="main-image"
//                         />

//                     </div>

//                 </div>


//                 {/* PRODUCT INFO */}
//                 <div className="product-info-box">

//                     <h1 className="product-title-heading">
//                         {product.title || product.name}
//                     </h1>


//                     {/* RATING */}
//                     <div className="rating-row">

//                         <span className="stars-gold">
//                             ★★★★☆
//                         </span>

//                         <span className="score-text">
//                             {product.rating || 4.5}/5
//                         </span>

//                     </div>


//                     {/* PRICE */}
//                     <div className="price-row">

//                         <span className="current-price-tag">
//                             ${product.price}
//                         </span>

//                         {product.oldPrice && (
//                             <span className="old-price-tag">
//                                 ${product.oldPrice}
//                             </span>
//                         )}

//                         {product.discount && (
//                             <span className="discount-badge">
//                                 {product.discount}
//                             </span>
//                         )}

//                     </div>


//                     {/* DESCRIPTION */}
//                     <p className="product-desc">
//                         {product.description ||
//                             "This item is crafted from high-quality material, offering superior comfort, durability, and a clean modern style for daily wear."
//                         }
//                     </p>


//                     {/* COLORS */}
//                     <div>

//                         <div className="section-label">
//                             Select Colors
//                         </div>

//                         <div className="color-options">

//                             {[
//                                 '#4F533E',
//                                 '#1F4E44',
//                                 '#1E2340'
//                             ].map(
//                                 (color, i) => (
//                                     <div
//                                         key={i}
//                                         className="color-circle"
//                                         style={{
//                                             backgroundColor:
//                                                 color
//                                         }}
//                                         onClick={() =>
//                                             setSelectedColor(
//                                                 color
//                                             )
//                                         }
//                                     >
//                                         {selectedColor ===
//                                             color &&
//                                             '✓'}
//                                     </div>
//                                 )
//                             )}

//                         </div>

//                     </div>


//                     {/* SIZE */}
//                     <div>

//                         <div className="section-label">
//                             Choose Size
//                         </div>

//                         <div className="size-options">

//                             {[
//                                 'Small',
//                                 'Medium',
//                                 'Large',
//                                 'X-Large'
//                             ].map(
//                                 (size) => (
//                                     <button
//                                         key={size}
//                                         className={`size-btn ${selectedSize ===
//                                                 size
//                                                 ? 'active'
//                                                 : ''
//                                             }`}
//                                         onClick={() =>
//                                             setSelectedSize(
//                                                 size
//                                             )
//                                         }
//                                     >
//                                         {size}
//                                     </button>
//                                 )
//                             )}

//                         </div>

//                     </div>


//                     {/* ACTIONS */}
//                     <div className="action-row">

//                         <div className="quantity-picker">

//                             <button
//                                 onClick={() =>
//                                     setQuantity(
//                                         (prev) =>
//                                             Math.max(
//                                                 1,
//                                                 prev - 1
//                                             )
//                                     )
//                                 }
//                             >
//                                 −
//                             </button>

//                             <span>
//                                 {quantity}
//                             </span>

//                             <button
//                                 onClick={() =>
//                                     setQuantity(
//                                         (prev) =>
//                                             prev + 1
//                                     )
//                                 }
//                             >
//                                 +
//                             </button>

//                         </div>


//                         <button
//                             className="add-cart-btn"
//                             onClick={
//                                 handleAddToCart
//                             }
//                         >
//                             Add to Cart
//                         </button>

//                     </div>

//                 </div>

//             </div>


//             {/* ==========================
//                 TABS
//             ========================== */}
//             <div className="tabs-header">

//                 <div className="tab-item disabled-tab">
//                     Product Details
//                 </div>

//                 <div className="tab-item active-tab">
//                     Rating & Reviews
//                 </div>

//                 <div className="tab-item disabled-tab">
//                     FAQs
//                 </div>

//             </div>


//             {/* ==========================
//                 REVIEWS
//             ========================== */}
//             <div className="reviews-section">

//                 <div className="reviews-head-bar">

//                     <div className="reviews-title">

//                         All Reviews
//                         <span className="reviews-count">
//                             (451)
//                         </span>

//                     </div>


//                     <div className="reviews-actions">

//                         <button className="filter-btn">
//                             ⚙
//                         </button>

//                         <select className="sort-select">
//                             <option>
//                                 Latest
//                             </option>
//                         </select>

//                         <button className="write-review-btn">
//                             Write a Review
//                         </button>

//                     </div>

//                 </div>


//                 <div className="reviews-grid">

//                     {reviews.map(
//                         (rev) => (
//                             <div
//                                 key={rev.id}
//                                 className="review-card"
//                             >

//                                 <div className="card-top-row">

//                                     <div className="review-stars">
//                                         {'★'.repeat(
//                                             rev.rating
//                                         )}

//                                         {'☆'.repeat(
//                                             5 -
//                                             rev.rating
//                                         )}
//                                     </div>

//                                     <div className="more-options">
//                                         •••
//                                     </div>

//                                 </div>


//                                 <div className="review-user">

//                                     {rev.name}

//                                     <span className="verified-badge">
//                                         ✓
//                                     </span>

//                                 </div>


//                                 <p className="review-text">
//                                     "{rev.comment}"
//                                 </p>


//                                 <div className="review-date">
//                                     Posted on {rev.date}
//                                 </div>

//                             </div>
//                         )
//                     )}

//                 </div>


//                 <div className="load-more-container">

//                     <button className="load-more-btn">
//                         Load More Reviews
//                     </button>

//                 </div>

//             </div>


//             {/* YOU MIGHT ALSO LIKE */}
//             <YouMight />

//         </div>
//     );
// }

// export default ProductDetail;