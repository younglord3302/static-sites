// Utility functions
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

function showProductModal(productId) {
    const product = productManager.getProductById(productId);
    if (!product) return;

    // Create modal HTML
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4';
    modal.innerHTML = `
        <div class="bg-surface rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div class="flex">
                <!-- Product Images -->
                <div class="w-1/2 p-6">
                    <div class="aspect-square rounded-lg overflow-hidden mb-4">
                        <img src="${product.images[0]}" alt="${product.title}" class="w-full h-full object-cover">
                    </div>
                    ${product.images.length > 1 ? `
                        <div class="grid grid-cols-4 gap-2">
                            ${product.images.map((image, index) => `
                                <img src="${image}" alt="${product.title} ${index + 1}" class="aspect-square object-cover rounded cursor-pointer hover:opacity-75 transition-opacity">
                            `).join('')}
                        </div>
                    ` : ''}
                </div>

                <!-- Product Details -->
                <div class="w-1/2 p-6">
                    <div class="flex justify-between items-start mb-4">
                        <h2 class="text-2xl font-bold">${product.title}</h2>
                        <button onclick="closeModal()" class="text-gray-500 hover:text-gray-700">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>

                    <!-- Rating -->
                    <div class="flex items-center mb-4">
                        ${generateStars(product.rating)}
                        <span class="ml-2 text-gray-600">(${product.reviewCount} reviews)</span>
                    </div>

                    <!-- Price -->
                    <div class="mb-4">
                        <span class="text-3xl font-bold text-primary">$${product.price.toFixed(2)}</span>
                        ${product.originalPrice ? `<span class="text-lg text-gray-500 line-through ml-2">$${product.originalPrice.toFixed(2)}</span>` : ''}
                    </div>

                    <!-- Badges -->
                    <div class="flex gap-2 mb-4">
                        ${product.badges.map(badge => `<span class="bg-primary text-white px-3 py-1 rounded-full text-sm">${badge}</span>`).join('')}
                    </div>

                    <!-- Variants -->
                    ${product.variants && product.variants.length > 0 ? `
                        <div class="mb-4">
                            <label class="block text-sm font-medium mb-2">Variant</label>
                            <select class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary">
                                ${product.variants.map(variant => `<option value="${variant}">${variant}</option>`).join('')}
                            </select>
                        </div>
                    ` : ''}

                    <!-- Description -->
                    <div class="mb-6">
                        <h3 class="font-semibold mb-2">Description</h3>
                        <p class="text-gray-600">${product.description}</p>
                    </div>

                    <!-- Add to Cart -->
                    <div class="flex gap-4">
                        <button onclick="addToCart(${product.id})"
                                class="flex-1 bg-primary text-white py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors font-semibold">
                            Add to Cart - $${product.price.toFixed(2)}
                        </button>
                        <button class="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                            <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
}

function closeModal() {
    const modal = document.querySelector('.fixed.inset-0.bg-black.bg-opacity-50');
    if (modal) {
        modal.remove();
    }
}

function addToCart(productId) {
    const product = productManager.getProductById(productId);
    if (product) {
        cartManager.addItem(product);
    }
}

// Initialize the application
async function initApp() {
    try {
        // Load products
        await productManager.loadProducts();

        // Load featured products on homepage
        const featuredContainer = document.getElementById('featured-products');
        if (featuredContainer) {
            const featuredProducts = productManager.getFeaturedProducts(8);
            featuredContainer.innerHTML = featuredProducts.map(product => createProductCard(product)).join('');
        }

        // Initialize cart UI
        cartManager.updateCartUI();

        // Set up event listeners
        setupEventListeners();

    } catch (error) {
        console.error('Error initializing app:', error);
    }
}

function setupEventListeners() {
    // Cart button
    const cartButton = document.getElementById('cart-button');
    if (cartButton) {
        cartButton.addEventListener('click', () => cartManager.toggleCartDrawer());
    }

    // Close cart drawer
    const closeCart = document.getElementById('close-cart');
    if (closeCart) {
        closeCart.addEventListener('click', () => cartManager.toggleCartDrawer());
    }

    // Close modal when clicking outside
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('fixed') && e.target.classList.contains('inset-0') && e.target.classList.contains('bg-black')) {
            closeModal();
        }
    });

    // Escape key to close modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);
