export const API_BASE_URL =
  (typeof import.meta !== 'undefined' &&
    import.meta.env &&
    (import.meta.env.VITE_API_URL || import.meta.env.API_URL)) ||
  'https://final-delta-ivory.vercel.app';

export const getAuthHeaders = (extraHeaders = {}) => {
  const token = localStorage.getItem('token');

  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extraHeaders,
  };
};