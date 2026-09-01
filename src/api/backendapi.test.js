// import test from 'node:test';
// import assert from 'node:assert/strict';
// import { getProducts } from './backendapi.js';

// test('getProducts returns fallback product data when API call fails', async () => {
//   const originalFetch = global.fetch;
//   global.fetch = async () => {
//     throw new Error('Network down');
//   };

//   try {
//     const data = await getProducts();
//     assert.ok(data, 'Should return product data');
//     assert.ok(typeof data === 'object', 'Should return an object');
//     assert.ok(Array.isArray(data.newArrivals), 'Should include newArrivals array');
//     assert.ok(data.newArrivals.length > 0, 'Fallback products should not be empty');
//   } finally {
//     global.fetch = originalFetch;
//   }
// });
