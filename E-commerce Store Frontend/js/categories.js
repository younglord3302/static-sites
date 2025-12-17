class CategoriesPage {
    constructor() {
        this.categories = [];
        this.init();
    }

    async init() {
        try {
            // Load products to get categories
            await productManager.loadProducts();

            // Get unique categories
            this.categories = productManager.getCategories();

            // Render categories
            this.renderCategories();
            this.renderFeaturedCategories();

            // Setup cart functionality
            cartManager.updateCartUI();
            this.setupCart();
            this.setupSearch();

        } catch (error) {
            console.error('Error initializing categories page:', error);
        }
    }

    renderCategories() {
        const container = document.getElementById('categories-grid');
        if (!container) return;

        // Group products by category
        const categoryProducts = {};
        productManager.products.forEach(product => {
            if (!categoryProducts[product.category]) {
                categoryProducts[product.category] = [];
            }
            categoryProducts[product.category].push(product);
        });

        container.innerHTML = this.categories.map(category => {
            const products = categoryProducts[category] || [];
            const categoryImage = this.getCategoryImage(category);
            const productCount = products.length;

            return `
                <div class="bg-surface rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 group cursor-pointer"
                     onclick="window.location.href='/products.html?category=${encodeURIComponent(category)}'">
                    <div class="relative h-48 overflow-hidden">
                        <img src="${categoryImage}" alt="${category}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
                        <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
                        <div class="absolute top-4 left-4">
                            <span class="bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
                                ${productCount} items
                            </span>
                        </div>
                    </div>
                    <div class="p-6">
                        <h3 class="text-xl font-bold mb-2 text-text group-hover:text-primary transition-colors">
                            ${category}
                        </h3>
                        <p class="text-gray-600 mb-4">
                            ${this.getCategoryDescription(category)}
                        </p>
                        <div class="flex items-center justify-between">
                            <span class="text-primary font-semibold hover:underline">
                                Shop ${category} →
                            </span>
                            <div class="flex -space-x-2">
                                ${products.slice(0, 3).map(product => `
                                    <img src="${product.images[0]}" alt="${product.title}"
                                         class="w-8 h-8 rounded-full border-2 border-white object-cover">
                                `).join('')}
                                ${productCount > 3 ? `<span class="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-semibold text-gray-600">+${productCount - 3}</span>` : ''}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    renderFeaturedCategories() {
        const container = document.getElementById('featured-categories');
        if (!container) return;

        // Get top categories by product count
        const categoryCounts = {};
        productManager.products.forEach(product => {
            categoryCounts[product.category] = (categoryCounts[product.category] || 0) + 1;
        });

        const sortedCategories = Object.entries(categoryCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 6);

        container.innerHTML = sortedCategories.map(([category, count]) => `
            <a href="/products.html?category=${encodeURIComponent(category)}"
               class="bg-surface rounded-lg p-4 hover:shadow-md transition-shadow duration-300 text-center group">
                <div class="w-12 h-12 mx-auto mb-3 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    ${this.getCategoryIcon(category)}
                </div>
                <h4 class="font-semibold text-sm mb-1 text-text group-hover:text-primary transition-colors">
                    ${category}
                </h4>
                <p class="text-xs text-gray-500">${count} products</p>
            </a>
        `).join('');
    }

    getCategoryImage(category) {
        const images = {
            'Electronics': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400',
            'Clothing': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400',
            'Home & Kitchen': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
            'Sports & Fitness': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
            'Fashion': 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400',
            'Home & Office': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
            'Sports & Outdoors': 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5e?w=400',
            'Home & Garden': 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400',
            'Home & Decor': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400'
        };
        return images[category] || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400';
    }

    getCategoryDescription(category) {
        const descriptions = {
            'Electronics': 'Discover the latest gadgets, devices, and tech accessories for your digital lifestyle.',
            'Clothing': 'Explore our collection of comfortable, stylish clothing for every occasion.',
            'Home & Kitchen': 'Essential items for your home and kitchen to make everyday life easier.',
            'Sports & Fitness': 'Gear up for your fitness journey with our premium sports equipment.',
            'Fashion': 'Express your style with our curated fashion collection.',
            'Home & Office': 'Create the perfect workspace with our office and home essentials.',
            'Sports & Outdoors': 'Outdoor gear and equipment for your adventures.',
            'Home & Garden': 'Transform your outdoor space with our gardening essentials.',
            'Home & Decor': 'Beautiful decor items to personalize your living space.'
        };
        return descriptions[category] || 'Explore our amazing collection of products in this category.';
    }

    getCategoryIcon(category) {
        const icons = {
            'Electronics': '<svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>',
            'Clothing': '<svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>',
            'Home & Kitchen': '<svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>',
            'Sports & Fitness': '<svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>',
            'Fashion': '<svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"></path></svg>',
            'Home & Office': '<svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>',
            'Sports & Outdoors': '<svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064"></path></svg>',
            'Home & Garden': '<svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>',
            'Home & Decor': '<svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"></path></svg>'
        };
        return icons[category] || '<svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>';
    }

    setupCart() {
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
    }

    setupSearch() {
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const query = searchInput.value.trim();
                    if (query) {
                        window.location.href = `/products.html?search=${encodeURIComponent(query)}`;
                    }
                }
            });
        }
    }
}

// Initialize the categories page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CategoriesPage();
});
