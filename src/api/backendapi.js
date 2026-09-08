// ==========================
// API BASE URL
// ==========================
const API_BASE_URL = 'https://final-delta-ivory.vercel.app';


// ==========================
// PRODUCTS
// ==========================
export const getProducts = async () => {
    const controller = new AbortController();

    const timeoutId = setTimeout(() => {
        controller.abort();
    }, 10000);

    try {
        console.log(
            'Fetching products from:',
            `${API_BASE_URL}/products`
        );

        const response = await fetch(
            `${API_BASE_URL}/products`,
            {
                method: 'GET',
                signal: controller.signal,
                headers: {
                    Accept: 'application/json',
                },
            }
        );

        console.log(
            'Products API status:',
            response.status
        );

        if (!response.ok) {
            throw new Error(
                `Products API failed with status ${response.status}`
            );
        }

        const contentType =
            response.headers.get('content-type') || '';

        if (!contentType.includes('application/json')) {
            throw new Error(
                'Products API ne JSON response nahi diya'
            );
        }

        const data = await response.json();

        console.log(
            'Products API response:',
            data
        );

        if (
            !data ||
            typeof data !== 'object'
        ) {
            throw new Error(
                'Invalid products response'
            );
        }

        // ==========================
        // PRODUCTS ARRAY
        // ==========================
        const products = Array.isArray(data.products)
            ? data.products
            : Array.isArray(data.data)
                ? data.data
                : Array.isArray(data)
                    ? data
                    : [];

        if (!products.length) {
            throw new Error(
                'API response mein products nahi mile'
            );
        }

        // ==========================
        // SECTION WISE PRODUCTS
        // ==========================
        const newArrivals = products.filter(
            (product) =>
                product.section === 'newArrivals'
        );

        const topSelling = products.filter(
            (product) =>
                product.section === 'topSelling'
        );

        const youMightAlsoLike = products.filter(
            (product) =>
                product.section === 'youMightAlsoLike'
        );

        console.log(
            'Total products:',
            products.length
        );

        console.log(
            'New Arrivals:',
            newArrivals.length
        );

        console.log(
            'Top Selling:',
            topSelling.length
        );

        console.log(
            'You Might Also Like:',
            youMightAlsoLike.length
        );

        return {
            success: true,
            count: products.length,
            products,
            newArrivals,
            topSelling,
            youMightAlsoLike,
        };

    } catch (error) {

        if (error.name === 'AbortError') {
            console.error(
                'Products API timeout: 10 seconds ke baad request cancel ho gayi.'
            );
        } else {
            console.error(
                'Products API Error:',
                error
            );
        }

        // ==========================
        // NO FALLBACK
        // ==========================
        throw error;

    } finally {
        clearTimeout(timeoutId);
    }
};


// ==========================
// CART
// ==========================
export const addToCartAPI = async (
    productId,
    quantity = 1
) => {
    const token = localStorage.getItem('token');

    const response = await fetch(
        `${API_BASE_URL}/cart/add`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                productId,
                quantity,
            }),
        }
    );

    const result =
        await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(
            result.message ||
            'Cart mein add nahi ho saka'
        );
    }

    return result;
};


// ==========================
// GET CART
// ==========================
export const getCartAPI = async () => {
    const token = localStorage.getItem('token');

    const response = await fetch(
        `${API_BASE_URL}/cart`,
        {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    const result =
        await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(
            result.message ||
            'Cart fetch nahi ho saka'
        );
    }

    return result;
};


// ==========================
// UPDATE CART
// ==========================
export const updateCartAPI = async (
    productId,
    quantity
) => {
    const token = localStorage.getItem('token');

    const response = await fetch(
        `${API_BASE_URL}/cart/update`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                productId,
                quantity,
            }),
        }
    );

    const result =
        await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(
            result.message ||
            'Cart update nahi ho saka'
        );
    }

    return result;
};


// ==========================
// REMOVE FROM CART
// ==========================
export const removeFromCartAPI = async (
    productId
) => {
    const token = localStorage.getItem('token');

    const response = await fetch(
        `${API_BASE_URL}/cart/remove/${productId}`,
        {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    const result =
        await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(
            result.message ||
            'Item cart se remove nahi ho saka'
        );
    }

    return result;
};










// // ==========================
// // API BASE URL
// // ==========================
// const API_BASE_URL = 'https://final-delta-ivory.vercel.app';


// // ==========================
// // FALLBACK PRODUCTS
// // ==========================
// // Ye sirf tab use honge jab live API fail ho.
// const fallbackProducts = {
//     newArrivals: [
//         {
//             id: 'fallback-new-1',
//             title: 'Classic withCotton Tee',
//             price: 29,
//             rating: 4.8,
//             // imageUrl:
//             //     'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80'
//         },
//         {
//             id: 'fallback-new-2',
//             title: 'Urban Overshirt',
//             price: 49,
//             rating: 4.6,
//             // imageUrl:
//             //     'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=800&q=80'
//         },
//         {
//             id: 'fallback-new-3',
//             title: 'Summer Linen Shirt',
//             price: 59,
//             rating: 4.7,
//             // imageUrl:
//             //     'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80'
//         },
//         {
//             id: 'fallback-new-4',
//             title: 'Street Flex Hoodie',
//             price: 69,
//             rating: 4.9,
//             // imageUrl:
//             //     'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80'
//         },
//         {
//             id: 'fallback-new-5',
//             title: 'Slim Denim',
//             price: 75,
//             rating: 4.5,
//             // imageUrl:
//             //     'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80'
//         },
//         {
//             id: 'fallback-new-6',
//             title: 'Weekend Cargo',
//             price: 82,
//             rating: 4.4,
//             // imageUrl:
//             //     'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80'
//         }
//     ],

//     topSelling: [
//         {
//             id: 'fallback-top-1',
//             title: 'Signature Hoodie',
//             price: 89,
//             rating: 4.9,
//             // imageUrl:
//             //     'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80'
//         },
//         {
//             id: 'fallback-top-2',
//             title: 'Premium Joggers',
//             price: 64,
//             rating: 4.7,
//             // imageUrl:
//             //     'https://images.unsplash.com/photo-1506629905607-d9a4f2c4d5f6?auto=format&fit=crop&w=800&q=80'
//         },
//         {
//             id: 'fallback-top-3',
//             title: 'Everyday Polo',
//             price: 39,
//             rating: 4.6,
//             // imageUrl:
//             //     'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=800&q=80'
//         },
//         {
//             id: 'fallback-top-4',
//             title: 'Layered Bomber',
//             price: 94,
//             rating: 4.8,
//             // imageUrl:
//             //     'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=800&q=80'
//         },
//         {
//             id: 'fallback-top-5',
//             title: 'Commuter Knit',
//             price: 58,
//             rating: 4.5,
//             // imageUrl:
//             //     'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80'
//         },
//         {
//             id: 'fallback-top-6',
//             title: 'Urban Layer Tee',
//             price: 46,
//             rating: 4.6,
//             // imageUrl:
//             //     'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80'
//         }
//     ],

//     youMightAlsoLike: [
//         {
//             id: 'fallback-like-1',
//             title: 'Coastal Casual',
//             price: 54,
//             rating: 4.5,
//             imageUrl:
//                 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=80'
//         },
//         {
//             id: 'fallback-like-2',
//             title: 'Night Shift Tees',
//             price: 33,
//             rating: 4.4,
//             imageUrl:
//                 'https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=800&q=80'
//         },
//         {
//             id: 'fallback-like-3',
//             title: 'Fit Explorer',
//             price: 71,
//             rating: 4.7,
//             imageUrl:
//                 'https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=800&q=80'
//         },
//         {
//             id: 'fallback-like-4',
//             title: 'Minimal Knit',
//             price: 48,
//             rating: 4.6,
//             // imageUrl:
//             //     'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&q=80'
//         }
//     ]
// };


// // ==========================
// // PRODUCTS
// // ==========================
// export const getProducts = async () => {
//     const controller = new AbortController();

//     const timeoutId = setTimeout(() => {
//         controller.abort();
//     }, 10000);

//     try {
//         console.log('Fetching products from:', `${API_BASE_URL}/products`);

//         const response = await fetch(`${API_BASE_URL}/products`, {
//             method: 'GET',
//             signal: controller.signal,
//             headers: {
//                 Accept: 'application/json',
//             },
//         });

//         console.log('Products API status:', response.status);

//         if (!response.ok) {
//             throw new Error(
//                 `Products API failed with status ${response.status}`
//             );
//         }

//         const contentType =
//             response.headers.get('content-type') || '';

//         if (!contentType.includes('application/json')) {
//             throw new Error(
//                 'Products API ne JSON response nahi diya'
//             );
//         }

//         const data = await response.json();

//         console.log('Products API response:', data);

//         if (!data || typeof data !== 'object') {
//             throw new Error('Invalid products response');
//         }


//         // =====================================
//         // CASE 1:
//         // API directly array return kare
//         // =====================================
//         if (Array.isArray(data)) {
//             console.log(
//                 'API ne direct products array return kiya.'
//             );

//             return {
//                 newArrivals: data.slice(0, 6),
//                 topSelling: data.slice(0, 6),
//                 youMightAlsoLike: data.slice(0, 6),
//             };
//         }


//         // =====================================
//         // CASE 2:
//         // API products/data ke andar array bheje
//         // =====================================
//         const products = data.products || data.data;


//         if (Array.isArray(products)) {
//             console.log(
//                 'API ne products array return kiya.'
//             );

//             return {
//                 ...data,

//                 newArrivals:
//                     Array.isArray(data.newArrivals)
//                         ? data.newArrivals
//                         : products.slice(0, 6),

//                 topSelling:
//                     Array.isArray(data.topSelling)
//                         ? data.topSelling
//                         : products.slice(0, 6),

//                 youMightAlsoLike:
//                     Array.isArray(data.youMightAlsoLike)
//                         ? data.youMightAlsoLike
//                         : products.slice(0, 6),
//             };
//         }


//         // =====================================
//         // CASE 3:
//         // API already separate sections bhej rahi hai
//         // =====================================
//         if (
//             Array.isArray(data.newArrivals) ||
//             Array.isArray(data.topSelling) ||
//             Array.isArray(data.youMightAlsoLike)
//         ) {
//             return {
//                 newArrivals: data.newArrivals || [],
//                 topSelling: data.topSelling || [],
//                 youMightAlsoLike:
//                     data.youMightAlsoLike || [],
//             };
//         }


//         throw new Error(
//             'API response mein products nahi mile'
//         );

//     } catch (error) {

//         if (error.name === 'AbortError') {
//             console.error(
//                 'Products API timeout: 10 seconds ke baad request cancel ho gayi.'
//             );
//         } else {
//             console.error(
//                 'Products API Error:',
//                 error.message
//             );
//         }

//         console.warn(
//             'Live API fail hui — fallback products use ho rahe hain.'
//         );

//         return fallbackProducts;

//     } finally {
//         clearTimeout(timeoutId);
//     }
// };


// // ==========================
// // CART
// // ==========================
// export const addToCartAPI = async (
//     productId,
//     quantity = 1
// ) => {
//     const token = localStorage.getItem('token');

//     const response = await fetch(
//         `${API_BASE_URL}/cart/add`,
//         {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 Authorization: `Bearer ${token}`,
//             },
//             body: JSON.stringify({
//                 productId,
//                 quantity,
//             }),
//         }
//     );

//     const result =
//         await response.json().catch(() => ({}));

//     if (!response.ok) {
//         throw new Error(
//             result.message ||
//             'Cart mein add nahi ho saka'
//         );
//     }

//     return result;
// };


// // ==========================
// // GET CART
// // ==========================
// export const getCartAPI = async () => {
//     const token = localStorage.getItem('token');

//     const response = await fetch(
//         `${API_BASE_URL}/cart`,
//         {
//             method: 'GET',
//             headers: {
//                 Authorization: `Bearer ${token}`,
//             },
//         }
//     );

//     const result =
//         await response.json().catch(() => ({}));

//     if (!response.ok) {
//         throw new Error(
//             result.message ||
//             'Cart fetch nahi ho saka'
//         );
//     }

//     return result;
// };


// // ==========================
// // UPDATE CART
// // ==========================
// export const updateCartAPI = async (
//     productId,
//     quantity
// ) => {
//     const token = localStorage.getItem('token');

//     const response = await fetch(
//         `${API_BASE_URL}/cart/update`,
//         {
//             method: 'PUT',
//             headers: {
//                 'Content-Type': 'application/json',
//                 Authorization: `Bearer ${token}`,
//             },
//             body: JSON.stringify({
//                 productId,
//                 quantity,
//             }),
//         }
//     );

//     const result =
//         await response.json().catch(() => ({}));

//     if (!response.ok) {
//         throw new Error(
//             result.message ||
//             'Cart update nahi ho saka'
//         );
//     }

//     return result;
// };


// // ==========================
// // REMOVE FROM CART
// // ==========================
// export const removeFromCartAPI = async (
//     productId
// ) => {
//     const token = localStorage.getItem('token');

//     const response = await fetch(
//         `${API_BASE_URL}/cart/remove/${productId}`,
//         {
//             method: 'DELETE',
//             headers: {
//                 Authorization: `Bearer ${token}`,
//             },
//         }
//     );

//     const result =
//         await response.json().catch(() => ({}));

//     if (!response.ok) {
//         throw new Error(
//             result.message ||
//             'Item cart se remove nahi ho saka'
//         );
//     }

//     return result;
// };