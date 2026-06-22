// Button handlers and event logic

// Global state: cache of current favorites, pagination, and last product list
let favorites = new Set();
let currentProducts = [];
let currentPage = 1;
let currentPageSize = DEFAULT_PAGE_SIZE;
let lastQueryParams = {};
let totalProducts = 0;

// Collect active filter values
function getActiveQueryParams() {
  return {
    q: document.getElementById('searchInput').value.trim(),
    brand: document.getElementById('brandFilter').value,
    category: document.getElementById('categoryFilter').value,
    minPrice: document.getElementById('minPriceRange').value,
    maxPrice: document.getElementById('maxPriceRange').value
  };
}

// Load products from backend with params
async function loadProducts(params = {}) {
  setResultsLoading();

  currentPage = Number(params.page) || currentPage;
  currentPageSize = Number(params.pageSize) || currentPageSize;
  lastQueryParams = {
    ...lastQueryParams,
    ...params,
    page: currentPage,
    pageSize: currentPageSize
  };

  try {
    const data = await api.fetchProducts(lastQueryParams);
    console.log('Products loaded:', data);
    // data = { items: [...], total: number }
    currentProducts = data.items;
    totalProducts = Number(data.total) || 0;
    renderProducts(data.items, totalProducts, favorites);
    renderPagination(totalProducts, currentPage, currentPageSize);
  } catch (err) {
    console.error('loadProducts failed:', err);
    showToast('Could not load products. Please try again.', true);
    currentProducts = [];
    totalProducts = 0;
    renderProducts([], 0, favorites);
    renderPagination(0, currentPage, currentPageSize);
  }
}

// Search button handler
function handleSearch() {
  currentPage = 1;
  loadProducts({ ...getActiveQueryParams(), page: currentPage, pageSize: currentPageSize });
}

// Apply filters handler
function applyFilters() {
  currentPage = 1;
  loadProducts({ ...getActiveQueryParams(), page: currentPage, pageSize: currentPageSize });
}

// Reset filters and reload products
function resetFilters() {
  document.getElementById('searchInput').value = '';
  document.getElementById('brandFilter').value = '';
  document.getElementById('categoryFilter').value = '';
  document.getElementById('minPriceRange').value = DEFAULT_PRICE_MIN;
  document.getElementById('maxPriceRange').value = DEFAULT_PRICE_MAX;
  updateSliderUI();
  currentPage = 1;
  loadProducts({ page: currentPage, pageSize: currentPageSize });
}

// Handle pagination clicks
function handlePaginationClick(e) {
  const btn = e.target.closest('button[data-page]');
  if (!btn) return;

  const nextPage = Number(btn.dataset.page);
  if (nextPage === currentPage) return;

  currentPage = nextPage;
  loadProducts({ ...lastQueryParams, page: currentPage, pageSize: currentPageSize });
}

// Route product card button clicks
function handleGridClick(e) {
  const btn = e.target.closest('button[data-action]');
  if (!btn) return;

  const productId = Number(btn.dataset.id);
  const action = btn.dataset.action;
  const product = currentProducts.find(p => p.id === productId) || { id: productId };

  if (action === 'buy') handleBuy(product, btn);
  if (action === 'fav') handleFav(product, btn);
  if (action === 'view') handleView(productId);
}

// Buy button handler
async function handleBuy(product, btn) {
  btn.disabled = true;
  try {
    await api.placeOrder(product.id, 1);
    showToast(`Added "${product.title || 'item'}" to your order.`);
  } catch (err) {
    console.error('handleBuy failed:', err);
    showToast('Could not complete purchase. Please try again.', true);
  } finally {
    btn.disabled = false;
  }
}

// Favorite button handler
async function handleFav(product, btn) {
  if (favorites.has(product.id)) {
    showToast(`"${product.title || 'Item'}" is already in favorites.`);
    return;
  }

  try {
    await api.addFavorite(product.id);
    favorites.add(product.id);
    btn.classList.add('is-fav');
    btn.querySelector('i').className = 'bi bi-heart-fill';
    showToast(`Saved "${product.title || 'item'}" to favorites.`);
  } catch (err) {
    console.error('handleFav failed:', err);
    showToast('Could not add to favorites.', true);
  }
}

// View button handler
async function handleView(productId) {
  try {
    const fullDetails = await api.trackProductView(productId);
    openViewModal(fullDetails, handleBuy);
  } catch (err) {
    console.error('handleView failed:', err);
    showToast('Could not load product details.', true);
  }
}

// Price slider change handling
function handlePriceSliderChange() {
  const minR = document.getElementById('minPriceRange');
  const maxR = document.getElementById('maxPriceRange');
  const gap = 5;

  minR.addEventListener('input', () => {
    if (Number(minR.value) > Number(maxR.value) - gap) {
      minR.value = Number(maxR.value) - gap;
    }
    updateSliderUI();
  });

  maxR.addEventListener('input', () => {
    if (Number(maxR.value) < Number(minR.value) + gap) {
      maxR.value = Number(minR.value) + gap;
    }
    updateSliderUI();
  });

  updateSliderUI();
}

// Seed products button handler
function handleSeedProductsButton() {
  document.getElementById('seedProductsBtn').addEventListener('click', async () => {
    try {
      console.log('Seeding products...');
      await api.seedProducts();
      showToast('Products seeded successfully.');
      loadProducts();
    } catch (err) {
      console.error('Seeding products failed:', err);
      showToast('Failed to seed products.', true);
    }
  });
}
function handleSeedEventButton() {
  document.getElementById('seedEventsBtn').addEventListener('click', async () => {
    try {
      console.log('Seeding events...');
      await api.seedEvents();
      showToast('Events seeded successfully.');
    }
    catch (err) {
      console.error('Seeding events failed:', err);
      showToast('Failed to seed events.', true);
    }
  }
  );
}
