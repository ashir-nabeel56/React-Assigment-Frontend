import { API_BASE_URL, getAuthHeaders } from '../config.js';

const jsonHeaders = () =>
  getAuthHeaders({
    'Content-Type': 'application/json',
    Accept: 'application/json',
  });

export const getProducts = async () => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Products API failed with status ${response.status}`);
    }

    const contentType = response.headers.get('content-type') || '';

    if (!contentType.includes('application/json')) {
      throw new Error('Products API ne JSON response nahi diya');
    }

    const data = await response.json();

    if (!data || typeof data !== 'object') {
      throw new Error('Invalid products response');
    }

    const products = Array.isArray(data.products)
      ? data.products
      : Array.isArray(data.data)
        ? data.data
        : Array.isArray(data)
          ? data
          : [];

    if (!products.length) {
      throw new Error('API response mein products nahi mile');
    }

    const newArrivals = products.filter((product) => product.section === 'newArrivals');
    const topSelling = products.filter((product) => product.section === 'topSelling');
    const youMightAlsoLike = products.filter((product) => product.section === 'youMightAlsoLike');

    return {
      success: true,
      count: products.length,
      products,
      newArrivals,
      topSelling,
      youMightAlsoLike,
    };
  } catch (error) {
    console.error('Products API Error:', error);
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
};

export const addToCartAPI = async (productId, quantity = 1) => {
  const response = await fetch(`${API_BASE_URL}/cart/add`, {
    method: 'POST',
    headers: jsonHeaders(),
    body: JSON.stringify({ productId, quantity }),
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.message || 'Cart mein add nahi ho saka');
  }

  return result;
};

export const getCartAPI = async () => {
  const response = await fetch(`${API_BASE_URL}/cart`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.message || 'Cart fetch nahi ho saka');
  }

  return result;
};

export const updateCartAPI = async (productId, quantity) => {
  const response = await fetch(`${API_BASE_URL}/cart/update`, {
    method: 'PUT',
    headers: jsonHeaders(),
    body: JSON.stringify({ productId, quantity }),
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.message || 'Cart update nahi ho saka');
  }

  return result;
};

export const removeFromCartAPI = async (productId) => {
  const response = await fetch(`${API_BASE_URL}/cart/remove/${productId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.message || 'Item cart se remove nahi ho saka');
  }

  return result;
};


// addcomment