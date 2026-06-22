// API methods for backend calls

const api = {
  // GET /api/products with optional filters
  async fetchProducts(params = {}) {
    const query = buildQueryString(params);
    const url = ENDPOINTS.products + query;
    console.log('Fetching products with URL:', url);
    // const res = await fetch(url);
    // if (!res.ok) throw new Error(`fetchProducts failed: ${res.status}`);
    // return res.json();

    // Temporary dummy response replacement for testing without backend.
    console.log('fetchProducts called with params:', params);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          ...dummyFetchProducts
        });
      }, 500);
    });
  },

  // GET /api/products/filter-options
  async fetchFilterOptions() {
    const res = await fetch(ENDPOINTS.filterOptions);
    if (!res.ok) throw new Error(`fetchFilterOptions failed: ${res.status}`);
    return res.json();
  },

  // POST /api/orders to create an order
  async placeOrder(productId, quantity = 1) {
    const res = await fetch(ENDPOINTS.orders, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, quantity })
    });
    if (!res.ok) throw new Error(`placeOrder failed: ${res.status}`);
    return res.json();
  },

  // POST /api/favorites/:id to add favorite
  async addFavorite(productId) {
    const res = await fetch(ENDPOINTS.favorite(productId), { method: 'POST' });
    if (!res.ok) throw new Error(`addFavorite failed: ${res.status}`);
    return res.json().catch(() => ({}));
  },

  // POST /api/products/:id/view to log view and fetch product
  async trackProductView(productId) {
    const res = await fetch(ENDPOINTS.productView(productId), { method: 'POST' });
    if (!res.ok) throw new Error(`trackProductView failed: ${res.status}`);
    return res.json();
  },

  // GET /api/seed/products to seed product data
  async seedProducts() {
    const res = await fetch(ENDPOINTS.seedProducts, { method: 'GET' });
    if (!res.ok) throw new Error(`seedProducts failed: ${res.status}`);
    return res.json();
  },

  // GET /api/seed/events to seed event data
  async seedEvents() {
    const res = await fetch(ENDPOINTS.seedEvents, { method: 'GET' });
    if (!res.ok) throw new Error(`seedEvents failed: ${res.status}`);
    return res.json();
  }
};

// Build query string from params, dropping empty values
function buildQueryString(params) {
  const usable = Object.entries(params).filter(
    ([, v]) => v !== '' && v !== null && v !== undefined
  );
  if (usable.length === 0) return '';
  return '?' + new URLSearchParams(usable).toString();
}
