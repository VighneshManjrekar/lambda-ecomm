// API endpoint constants
const API_BASE = 'http://localhost:8000/api';

const ENDPOINTS = {
  products: (id) => `${API_BASE}/products/${id}`,
  products: `${API_BASE}/products`,
  filterOptions: `${API_BASE}/products/filter-options`,
  orders: (id) => `${API_BASE}/events/${id}/buy`,
  favorite: (id) => `${API_BASE}/events/${id}/favorite`,
  productView: (id) => `${API_BASE}/events/${id}/view`,
  seedProducts: `${API_BASE}/seed/products`,
  seedEvents: `${API_BASE}/seed/events`,
};

// Category-to-color mapping for UI
const CATEGORY_COLORS = {
  'Electronics': '#2D5FA3',
  'Apparel': '#C1446E',
  'Home & Kitchen': '#1F6F5C',
  'Sports': '#B5752D',
  'Books': '#6B5B3E'
};

// Default price range limits
let DEFAULT_PRICE_MIN = 0;
let DEFAULT_PRICE_MAX = 500;
let DEFAULT_PAGE_SIZE = 6;
