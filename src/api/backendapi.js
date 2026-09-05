


// ==========================
// API BASE URL
// ==========================
const API_BASE_URL = 'https://final-delta-ivory.vercel.app';
// Production deploy karte waqt is line ko comment kar ke neeche wali use karein:
// const API_BASE_URL = 'https://final-git-main-ashir-nabeel-s-projects.vercel.app';

const fallbackProducts = {
    newArrivals: [
        {
            id: 1,
            title: 'Classic Cotton Tee',
            price: 29,
            rating: 4.8,
            imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80'
        },
        {
            id: 2,
            title: 'Urban Overshirt',
            price: 49,
            rating: 4.6,
            imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80'
        },
        {
            id: 3,
            title: 'Summer Linen Shirt',
            price: 59,
            rating: 4.7,
            imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80'
        },
        {
            id: 4,
            title: 'Street Flex Hoodie',
            price: 69,
            rating: 4.9,
            imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80'
        },
        {
            id: 5,
            title: 'Slim Denim',
            price: 75,
            rating: 4.5,
            imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80'
        },
        {
            id: 6,
            title: 'Weekend Cargo',
            price: 82,
            rating: 4.4,
            imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80'
        }
    ],
    topSelling: [
        {
            id: 7,
            title: 'Signature Hoodie',
            price: 89,
            rating: 4.9,
            imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80'
        },
        {
            id: 8,
            title: 'Premium Joggers',
            price: 64,
            rating: 4.7,
            imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80'
        },
        {
            id: 9,
            title: 'Everyday Polo',
            price: 39,
            rating: 4.6,
            imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80'
        },
        {
            id: 10,
            title: 'Layered Bomber',
            price: 94,
            rating: 4.8,
            imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80'
        },
        {
            id: 15,
            title: 'Commuter Knit',
            price: 58,
            rating: 4.5,
            imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80'
        },
        {
            id: 16,
            title: 'Urban Layer Tee',
            price: 46,
            rating: 4.6,
            imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80'
        }
    ],
    youMightAlsoLike: [
        {
            id: 11,
            title: 'Coastal Casual',
            price: 54,
            rating: 4.5,
            imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80'
        },
        {
            id: 12,
            title: 'Night Shift Tees',
            price: 33,
            rating: 4.4,
            imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80'
        },
        {
            id: 13,
            title: 'Fit Explorer',
            price: 71,
            rating: 4.7,
            imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80'
        },
        {
            id: 14,
            title: 'Minimal Knit',
            price: 48,
            rating: 4.6,
            imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80'
        }
    ]
};

// ==========================
// PRODUCTS
// ==========================
export const getProducts = async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
        const response = await fetch(`${API_BASE_URL}/products`, {
            signal: controller.signal,
            headers: {
                Accept: 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Data fetch nahi hua');
        }

        const contentType = response.headers.get('content-type') || '';
        if (!contentType.includes('application/json')) {
            throw new Error('API ne JSON response nahi diya');
        }

        const data = await response.json();

        if (!data || typeof data !== 'object') {
            throw new Error('Invalid products response');
        }

        if (Array.isArray(data)) {
            return {
                newArrivals: data,
                topSelling: data,
                youMightAlsoLike: data,
            };
        }

        const products = data.products || data.data;
        if (Array.isArray(products)) {
            return {
                ...data,
                newArrivals: data.newArrivals || products,
                topSelling: data.topSelling || products,
                youMightAlsoLike: data.youMightAlsoLike || products,
            };
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        console.warn('Live API fail hui — fallback products use ho rahe hain.');
        return fallbackProducts;
    } finally {
        clearTimeout(timeoutId);
    }
};

// ==========================
// CART
// ==========================
export const addToCartAPI = async (productId, quantity = 1) => {
    const token = localStorage.getItem('token');

    const response = await fetch(`${API_BASE_URL}/cart/add`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity }),
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(result.message || 'Cart mein add nahi ho saka');
    }

    return result;
};

export const getCartAPI = async () => {
    const token = localStorage.getItem('token');

    const response = await fetch(`${API_BASE_URL}/cart`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(result.message || 'Cart fetch nahi ho saka');
    }

    return result;
};

export const updateCartAPI = async (productId, quantity) => {
    const token = localStorage.getItem('token');

    const response = await fetch(`${API_BASE_URL}/cart/update`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity }),
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(result.message || 'Cart update nahi ho saka');
    }

    return result;
};

export const removeFromCartAPI = async (productId) => {
    const token = localStorage.getItem('token');

    const response = await fetch(`${API_BASE_URL}/cart/remove/${productId}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(result.message || 'Item cart se remove nahi ho saka');
    }

    return result;
};