// UI helper functions

// Render the product grid and empty state
function renderProducts(items, total) {
  const grid = document.getElementById('productGrid');
  const empty = document.getElementById('emptyState');

  grid.innerHTML = '';
  document.getElementById('resultsCount').textContent = `Showing ${items.length} of ${total} products`;

  if (items.length === 0) {
    empty.classList.remove('d-none');
    return;
  }

  empty.classList.add('d-none');
  items.forEach(product => {
    grid.insertAdjacentHTML('beforeend', createProductCard(product));
  });
}

// Create a product card
function createProductCard(product) {
  const color = CATEGORY_COLORS[product.category] || '#8A8478';
  return `
    <div class="col-12 col-md-6 col-lg-4">
      <div class="product-card">
        <span class="cat-tag">
          <span class="cat-dot" style="background:${color}"></span>
          ${escapeHtml(product.category)}
        </span>
        <h3 class="title">${escapeHtml(product.title)}</h3>
        <p class="subtitle">by ${escapeHtml(product.brand)}</p>
        <p class="desc">${escapeHtml(product.description)}</p>
        <p class="price">€${Number(product.price).toFixed(2)}</p>
        <div class="card-actions">
          <button class="btn btn-buy" data-action="buy" data-id="${product.id}">
            <i class="bi bi-bag-check"></i> Buy
          </button>
          <button class="btn btn-fav" data-action="fav" data-id="${product.id}" aria-label="Favorite">
            <i class="bi bi-heart"></i>
          </button>
          <button class="btn btn-view" data-action="view" data-id="${product.id}" aria-label="View details">
            <i class="bi bi-eye"></i>
          </button>
        </div>
      </div>
    </div>
  `;
}

// Populate filter dropdowns
function populateFilterOptions(brands = [], categories = [], defatultMinPrice = DEFAULT_PRICE_MIN, defatultMaxPrice = DEFAULT_PRICE_MAX) {
  const brandSelect = document.getElementById('brandFilter');
  const catSelect = document.getElementById('categoryFilter');
  const minR = document.getElementById('minPriceRange');
  const maxR = document.getElementById('maxPriceRange');
  DEFAULT_PRICE_MIN = defatultMinPrice;
  DEFAULT_PRICE_MAX = defatultMaxPrice;

  minR.min = defatultMinPrice;
  minR.max = defatultMaxPrice;
  minR.value = defatultMinPrice;

  maxR.min = defatultMinPrice;
  maxR.max = defatultMaxPrice;
  maxR.value = defatultMaxPrice;

  updateSliderUI();

  // Remove old options (keep "All" placeholder)
  brandSelect.querySelectorAll('option:not([value=""])').forEach(o => o.remove());
  catSelect.querySelectorAll('option:not([value=""])').forEach(o => o.remove());

  // Add new options
  brands.forEach(brand => {
    brandSelect.insertAdjacentHTML('beforeend', `<option value="${escapeHtml(brand)}">${escapeHtml(brand)}</option>`);
  });
  categories.forEach(category => {
    catSelect.insertAdjacentHTML('beforeend', `<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`);
  });
}

// Show toast notification
function showToast(message, isError = false) {
  const toastEl = document.getElementById('actionToast');
  document.getElementById('actionToastBody').textContent = message;

  toastEl.classList.toggle('text-bg-dark', !isError);
  toastEl.classList.toggle('text-bg-danger', isError);

  const toast = bootstrap.Toast.getOrCreateInstance(toastEl, { delay: 2200 });
  toast.show();
}

// Render pagination controls
function renderPagination(total, currentPage, pageSize) {
  const paginationBlock = document.getElementById('paginationBlock');
  const paginationControls = document.getElementById('paginationControls');
  const paginationInfo = document.getElementById('paginationInfo');

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  if (total <= pageSize) {
    paginationBlock.classList.add('d-none');
    paginationControls.innerHTML = '';
    paginationInfo.textContent = '';
    return;
  }

  paginationBlock.classList.remove('d-none');
  paginationInfo.textContent = `Page ${currentPage} of ${totalPages} — ${total} total products`;
  paginationControls.innerHTML = createPaginationMarkup(totalPages, currentPage);
}

function createPaginationMarkup(totalPages, currentPage) {
  const pages = [];
  const pageWindow = 5;
  let start = Math.max(1, currentPage - 2);
  let end = Math.min(totalPages, start + pageWindow - 1);
  if (end - start + 1 < pageWindow) {
    start = Math.max(1, end - pageWindow + 1);
  }

  pages.push(createPageButton('Prev', currentPage - 1, currentPage === 1));

  for (let page = start; page <= end; page += 1) {
    pages.push(createPageButton(page, page, page === currentPage));
  }

  pages.push(createPageButton('Next', currentPage + 1, currentPage === totalPages));

  return pages.join('');
}

function createPageButton(label, page, disabled) {
  const isActive = Number(label) === page;
  return `
    <li class="page-item ${disabled ? 'disabled' : ''} ${isActive ? 'active' : ''}">
      <button class="page-link" type="button" data-page="${page}" ${disabled ? 'disabled tabindex="-1" aria-disabled="true"' : ''}>
        ${label}
      </button>
    </li>
  `;
}

// Open product details modal
function openViewModal(product, onBuy) {
  document.getElementById('viewModalTitle').textContent = product.title;
  document.getElementById('viewModalBody').innerHTML = `
    <p class="subtitle mb-2">by ${escapeHtml(product.brand)}</p>
    <span class="cat-tag mb-3">
      <span class="cat-dot" style="background:${CATEGORY_COLORS[product.category] || '#8A8478'}"></span>
      ${escapeHtml(product.category)}
    </span>
    <p class="mt-3">${escapeHtml(product.description)}</p>
    <p class="price mb-0">€${Number(product.price).toFixed(2)}</p>
  `;

  const buyBtn = document.getElementById('viewModalBuyBtn');
  buyBtn.onclick = () => onBuy(product, buyBtn);

  bootstrap.Modal.getOrCreateInstance(document.getElementById('viewProductModal')).show();
}

// Update the price slider UI
function updateSliderUI() {
  const minR = document.getElementById('minPriceRange');
  const maxR = document.getElementById('maxPriceRange');
  const fill = document.getElementById('sliderRangeFill');
  const range = Number(minR.max) - Number(minR.min);

  if (Number(minR.value) > Number(maxR.value)) {
    alert("Minimum price cannot be greater than maximum price");
    return;
  }

  const minPct = ((minR.value - minR.min) / range) * 100;
  const maxPct = ((maxR.value - minR.min) / range) * 100;

  fill.style.left = minPct + '%';
  fill.style.width = (maxPct - minPct) + '%';

  document.getElementById('minPriceLabel').textContent = `€${Number(minR.min).toFixed(2)}`;
  document.getElementById('maxPriceLabel').textContent = `€${Number(maxR.max).toFixed(2)}`;
}

// Escape HTML input
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str ?? '';
  return div.innerHTML;
}

// Set loading state for results count
function setResultsLoading() {
  document.getElementById('resultsCount').textContent = 'Loading products…';
}
