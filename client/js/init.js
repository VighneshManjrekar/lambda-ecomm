// Page init: load data and hooks

document.addEventListener('DOMContentLoaded', async () => {
  // Load filter options (brands, categories)

  loadFilterOptions();
  // Load initial product list
  loadProducts();

  // Set up event listeners
  setupEventListeners();
});

// Wire UI event listeners
function setupEventListeners() {
  // Search button
  document.getElementById('searchBtn').addEventListener('click', handleSearch);

  // Search input: also search on Enter key
  document.getElementById('searchInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearch();
  });

  // Filter buttons
  document.getElementById('applyFiltersBtn').addEventListener('click', applyFilters);
  document.getElementById('resetFiltersBtn').addEventListener('click', resetFilters);

  // Price slider
  handlePriceSliderChange();

  // Product grid clicks (buy, favorite, view)
  document.getElementById('productGrid').addEventListener('click', handleGridClick);

  // Pagination controls
  document.getElementById('paginationControls').addEventListener('click', handlePaginationClick);

  // Seed data buttons
  document.getElementById('seedProductsBtn').addEventListener('click', handleSeedProductsButton);
  document.getElementById('seedEventsBtn').addEventListener('click', handleSeedEventButton);
}
