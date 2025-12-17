class ProductsPage {
    constructor() {
        this.currentPage = 1;
        this.itemsPerPage = 12;
        this.isLoading = false;
        this.viewMode = 'grid'; // 'grid' or 'list'

        this.init();
    }

    async init() {
        try {
            // Show loading skeleton first
            this.showLoadingSkeleton();

            // Load products
            await productManager.loadProducts();
            console.log('Products loaded:', productManager.products.length);
            console.log('Filtered products:', productManager.filteredProducts.length);

            // Initialize UI
            this.setupFilters();
            this.setupSorting();
            this.setupSearch();
            this.setupViewToggle();
            this.setupLoadMore();
            this.setupCart();

            // Initial render
            this.renderProducts();
            this.updateProductCount();

            // Hide skeleton after rendering
            setTimeout(() => {
                this.hideLoadingSkeleton();
            }, 500);

        } catch (error) {
            console.error('Error initializing products page:', error);
            this.hideLoadingSkeleton();
        }
    }

    setupFilters() {
        // Category filters
        this.renderCategoryFilters();

        // Price filter
        const applyPriceBtn = document.getElementById('apply-price-filter');
        if (applyPriceBtn) {
            applyPriceBtn.addEventListener('click', () => {
                const minPrice = parseFloat(document.getElementById('min-price').value) || 0;
                const maxPrice = parseFloat(document.getElementById('max-price').value) || 500;
                productManager.updateFilters({ priceRange: { min: minPrice, max: maxPrice } });
                this.currentPage = 1;
                this.renderProducts();
            });
        }

        // Tag filters
        this.renderTagFilters();

        // Clear filters
        const clearBtn = document.getElementById('clear-filters');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                this.clearAllFilters();
            });
        }

        // Reset search
        const resetBtn = document.getElementById('reset-search');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.clearAllFilters();
            });
        }
    }

    setupSorting() {
        const sortSelect = document.getElementById('sort-select');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                productManager.updateSort(e.target.value);
                this.currentPage = 1;
                this.renderProducts();
            });
        }
    }

    setupSearch() {
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            let searchTimeout;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    productManager.searchProducts(e.target.value);
                    this.currentPage = 1;
                    this.renderProducts();
                }, 300);
            });
        }
    }

    setupViewToggle() {
        const gridBtn = document.getElementById('grid-view');
        const listBtn = document.getElementById('list-view');

        if (gridBtn && listBtn) {
            gridBtn.addEventListener('click', () => {
                this.setViewMode('grid');
            });

            listBtn.addEventListener('click', () => {
                this.setViewMode('list');
            });
        }
    }

    setupLoadMore() {
        const loadMoreBtn = document.getElementById('load-more');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                this.loadMoreProducts();
            });
        }
    }

    setupCart() {
        // Cart functionality is handled by cart.js and main.js
        // Just ensure cart count is updated
        cartManager.updateCartUI();
    }

    renderCategoryFilters() {
        const categories = productManager.getCategories();
        const container = document.getElementById('category-filters');

        if (!container) return;

        container.innerHTML = `
            <label class="flex items-center">
                <input type="radio" name="category" value="all" class="mr-2" checked>
                <span class="text-sm">All Categories</span>
            </label>
            ${categories.map(category => `
                <label class="flex items-center">
                    <input type="radio" name="category" value="${category}" class="mr-2">
                    <span class="text-sm">${category}</span>
                </label>
            `).join('')}
        `;

        // Add event listeners
        container.querySelectorAll('input[type="radio"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                productManager.updateFilters({ category: e.target.value });
                this.currentPage = 1;
                this.renderProducts();
            });
        });
    }

    renderTagFilters() {
        const tags = productManager.getTags();
        const container = document.getElementById('tag-filters');

        if (!container) return;

        container.innerHTML = tags.slice(0, 10).map(tag => `
            <button class="tag-filter px-3 py-1 text-xs bg-gray-100 hover:bg-primary hover:text-white rounded-full transition-colors"
                    data-tag="${tag}">
                ${tag}
            </button>
        `).join('');

        // Add event listeners
        container.querySelectorAll('.tag-filter').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tag = e.target.dataset.tag;
                e.target.classList.toggle('bg-primary');
                e.target.classList.toggle('text-white');
                e.target.classList.toggle('bg-gray-100');

                const activeTags = Array.from(container.querySelectorAll('.tag-filter.bg-primary'))
                    .map(btn => btn.dataset.tag);

                productManager.updateFilters({ tags: activeTags });
                this.currentPage = 1;
                this.renderProducts();
            });
        });
    }

    renderProducts() {
        const productsGrid = document.getElementById('products-grid');
        const emptyState = document.getElementById('empty-state');
        const loadMoreBtn = document.getElementById('load-more');

        if (!productsGrid) return;

        const products = this.getCurrentPageProducts();

        if (products.length === 0) {
            productsGrid.innerHTML = '';
            emptyState.classList.remove('hidden');
            if (loadMoreBtn) loadMoreBtn.classList.add('hidden');
            return;
        }

        emptyState.classList.add('hidden');

        // Render products based on view mode
        if (this.viewMode === 'grid') {
            productsGrid.innerHTML = products.map(product => createProductCard(product)).join('');
        } else {
            productsGrid.innerHTML = products.map(product => this.createProductListItem(product)).join('');
        }

        // Update grid classes for view mode
        productsGrid.className = this.viewMode === 'grid'
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8'
            : 'space-y-4 mb-8';

        // Show/hide load more button
        const totalProducts = productManager.filteredProducts.length;
        const hasMore = (this.currentPage * this.itemsPerPage) < totalProducts;
        if (loadMoreBtn) {
            loadMoreBtn.classList.toggle('hidden', !hasMore);
        }

        this.updateProductCount();
    }

    createProductListItem(product) {
        const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

        return `
            <div class="bg-surface rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden flex">
                <!-- Product Image -->
                <div class="w-48 flex-shrink-0">
                    <img src="${product.images[0]}" alt="${product.title}" class="w-full h-48 object-cover" loading="lazy">
                </div>

                <!-- Product Info -->
                <div class="flex-1 p-6">
                    <div class="flex justify-between items-start">
                        <div class="flex-1">
                            <h3 class="font-semibold text-lg mb-2 hover:text-primary transition-colors cursor-pointer"
                                onclick="showProductModal(${product.id})">
                                ${product.title}
                            </h3>

                            <!-- Rating -->
                            <div class="flex items-center mb-2">
                                <div class="flex items-center">
                                    ${generateStars(product.rating)}
                                </div>
                                <span class="text-sm text-gray-500 ml-2">(${product.reviewCount})</span>
                            </div>

                            <!-- Price -->
                            <div class="flex items-center mb-3">
                                <span class="text-xl font-bold text-primary">$${product.price.toFixed(2)}</span>
                                ${product.originalPrice ? `<span class="text-sm text-gray-500 line-through ml-2">$${product.originalPrice.toFixed(2)}</span>` : ''}
                            </div>

                            <!-- Category and Tags -->
                            <p class="text-sm text-gray-500 mb-2">${product.category}</p>
                            <div class="flex flex-wrap gap-1 mb-3">
                                ${product.tags.slice(0, 3).map(tag => `<span class="text-xs bg-gray-100 px-2 py-1 rounded">${tag}</span>`).join('')}
                            </div>
                        </div>

                        <!-- Actions -->
                        <div class="ml-4 flex flex-col gap-2">
                            <button onclick="showProductModal(${product.id})"
                                    class="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition-colors text-sm">
                                View Details
                            </button>
                            <button onclick="addToCart(${product.id})"
                                    class="bg-accent text-white px-4 py-2 rounded hover:bg-accent/90 transition-colors text-sm">
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getCurrentPageProducts() {
        const start = 0;
        const end = this.currentPage * this.itemsPerPage;
        return productManager.filteredProducts.slice(start, end);
    }

    loadMoreProducts() {
        if (this.isLoading) return;

        this.isLoading = true;
        this.currentPage++;

        // Add loading indicator
        const loadMoreBtn = document.getElementById('load-more');
        if (loadMoreBtn) {
            loadMoreBtn.textContent = 'Loading...';
            loadMoreBtn.disabled = true;
        }

        // Simulate loading delay
        setTimeout(() => {
            const productsGrid = document.getElementById('products-grid');
            const newProducts = this.getCurrentPageProducts().slice((this.currentPage - 1) * this.itemsPerPage);

            if (this.viewMode === 'grid') {
                productsGrid.innerHTML += newProducts.map(product => createProductCard(product)).join('');
            } else {
                productsGrid.innerHTML += newProducts.map(product => this.createProductListItem(product)).join('');
            }

            // Reset button
            if (loadMoreBtn) {
                loadMoreBtn.textContent = 'Load More Products';
                loadMoreBtn.disabled = false;
            }

            // Hide button if no more products
            const totalProducts = productManager.filteredProducts.length;
            const hasMore = (this.currentPage * this.itemsPerPage) < totalProducts;
            if (loadMoreBtn) {
                loadMoreBtn.classList.toggle('hidden', !hasMore);
            }

            this.isLoading = false;
        }, 500);
    }

    setViewMode(mode) {
        this.viewMode = mode;
        this.currentPage = 1;

        const gridBtn = document.getElementById('grid-view');
        const listBtn = document.getElementById('list-view');

        if (mode === 'grid') {
            gridBtn.classList.add('text-primary', 'bg-primary/10');
            gridBtn.classList.remove('text-gray-400');
            listBtn.classList.remove('text-primary', 'bg-primary/10');
            listBtn.classList.add('text-gray-400');
        } else {
            listBtn.classList.add('text-primary', 'bg-primary/10');
            listBtn.classList.remove('text-gray-400');
            gridBtn.classList.remove('text-primary', 'bg-primary/10');
            gridBtn.classList.add('text-gray-400');
        }

        this.renderProducts();
    }

    updateProductCount() {
        const countElement = document.getElementById('product-count');
        if (countElement) {
            countElement.textContent = productManager.filteredProducts.length;
        }
    }

    clearAllFilters() {
        // Reset category
        const categoryRadios = document.querySelectorAll('input[name="category"]');
        categoryRadios.forEach(radio => {
            radio.checked = radio.value === 'all';
        });

        // Reset price
        document.getElementById('min-price').value = '';
        document.getElementById('max-price').value = '';

        // Reset tags
        const tagButtons = document.querySelectorAll('.tag-filter');
        tagButtons.forEach(btn => {
            btn.classList.remove('bg-primary', 'text-white');
            btn.classList.add('bg-gray-100');
        });

        // Reset search
        const searchInput = document.getElementById('search-input');
        if (searchInput) searchInput.value = '';

        // Reset sort
        const sortSelect = document.getElementById('sort-select');
        if (sortSelect) sortSelect.value = 'featured';

        // Reset product manager filters
        productManager.updateFilters({
            category: 'all',
            priceRange: { min: 0, max: 500 },
            searchTerm: '',
            tags: []
        });
        productManager.updateSort('featured');

        this.currentPage = 1;
        this.renderProducts();
    }

    showLoadingSkeleton() {
        const skeleton = document.getElementById('loading-skeleton');
        if (!skeleton) return;

        skeleton.innerHTML = Array(8).fill().map(() => `
            <div class="bg-surface rounded-lg shadow-sm overflow-hidden animate-pulse">
                <div class="h-48 bg-gray-200"></div>
                <div class="p-4">
                    <div class="h-4 bg-gray-200 rounded mb-2"></div>
                    <div class="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                    <div class="flex justify-between items-center">
                        <div class="h-6 bg-gray-200 rounded w-16"></div>
                        <div class="h-8 bg-gray-200 rounded w-20"></div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    hideLoadingSkeleton() {
        const skeleton = document.getElementById('loading-skeleton');
        if (skeleton) {
            skeleton.innerHTML = '';
        }
    }
}

// Utility functions for product rendering
function createProductCard(product) {
    const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

    return `
        <div class="bg-surface rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden group">
            <!-- Product Image -->
            <div class="relative overflow-hidden">
                <img src="${product.images[0]}" alt="${product.title}" class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy">
                <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>

                <!-- Badges -->
                <div class="absolute top-2 left-2 flex flex-col gap-1">
                    ${product.badges.map(badge => {
                        if (badge === 'Sale' && discount > 0) {
                            return `<span class="bg-danger text-white text-xs px-2 py-1 rounded font-semibold">${discount}% OFF</span>`;
                        }
                        return `<span class="bg-primary text-white text-xs px-2 py-1 rounded font-semibold">${badge}</span>`;
                    }).join('')}
                </div>

                <!-- Quick actions -->
                <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button onclick="addToCart(${product.id})" class="bg-primary text-white p-2 rounded-full hover:bg-primary/90 transition-colors">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5H19M7 13l-1.1 5M7 13h10m0 0v5a2 2 0 01-2 2H9a2 2 0 01-2-2v-5"></path>
                        </svg>
                    </button>
                </div>
            </div>

            <!-- Product Info -->
            <div class="p-4">
                <h3 class="font-semibold text-lg mb-2 line-clamp-2 hover:text-primary transition-colors cursor-pointer"
                    onclick="showProductModal(${product.id})">
                    ${product.title}
                </h3>

                <!-- Rating -->
                <div class="flex items-center mb-2">
                    <div class="flex items-center">
                        ${generateStars(product.rating)}
                    </div>
                    <span class="text-sm text-gray-500 ml-2">(${product.reviewCount})</span>
                </div>

                <!-- Price -->
                <div class="flex items-center mb-3">
                    <span class="text-xl font-bold text-primary">$${product.price.toFixed(2)}</span>
                    ${product.originalPrice ? `<span class="text-sm text-gray-500 line-through ml-2">$${product.originalPrice.toFixed(2)}</span>` : ''}
                </div>

                <!-- Category -->
                <p class="text-sm text-gray-500 mb-3">${product.category}</p>

                <!-- Add to Cart Button -->
                <button onclick="addToCart(${product.id})"
                        class="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors font-semibold">
                    Add to Cart
                </button>
            </div>
        </div>
    `;
}

function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    let stars = '';

    // Full stars
    for (let i = 0; i < fullStars; i++) {
        stars += '<svg class="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>';
    }

    // Half star
    if (hasHalfStar) {
        stars += '<svg class="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" clip-path="polygon(0 0, 50% 0, 50% 100%, 0% 100%)"/></svg>';
    }

    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
        stars += '<svg class="w-4 h-4 text-gray-300 fill-current" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>';
    }

    return stars;
}

// Make functions globally available
window.createProductCard = createProductCard;
window.generateStars = generateStars;

// Initialize the products page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ProductsPage();
});
