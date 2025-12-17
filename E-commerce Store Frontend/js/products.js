class ProductManager {
    constructor() {
        this.products = [];
        this.filteredProducts = [];
        this.currentSort = 'featured';
        this.currentFilters = {
            category: 'all',
            priceRange: { min: 0, max: 500 },
            searchTerm: '',
            tags: []
        };
    }

    async loadProducts() {
        try {
            const response = await fetch('data/products.json');
            this.products = await response.json();
            this.filteredProducts = [...this.products];
            return this.products;
        } catch (error) {
            console.error('Error loading products:', error);
            return [];
        }
    }

    filterProducts() {
        this.filteredProducts = this.products.filter(product => {
            // Category filter
            if (this.currentFilters.category !== 'all' && product.category.toLowerCase() !== this.currentFilters.category.toLowerCase()) {
                return false;
            }

            // Price range filter
            if (product.price < this.currentFilters.priceRange.min || product.price > this.currentFilters.priceRange.max) {
                return false;
            }

            // Search term filter
            if (this.currentFilters.searchTerm) {
                const searchLower = this.currentFilters.searchTerm.toLowerCase();
                const titleMatch = product.title.toLowerCase().includes(searchLower);
                const categoryMatch = product.category.toLowerCase().includes(searchLower);
                const tagMatch = product.tags.some(tag => tag.toLowerCase().includes(searchLower));

                if (!titleMatch && !categoryMatch && !tagMatch) {
                    return false;
                }
            }

            // Tags filter
            if (this.currentFilters.tags.length > 0) {
                const hasMatchingTag = this.currentFilters.tags.some(filterTag =>
                    product.tags.some(productTag =>
                        productTag.toLowerCase().includes(filterTag.toLowerCase())
                    )
                );
                if (!hasMatchingTag) {
                    return false;
                }
            }

            return true;
        });
    }

    sortProducts() {
        this.filteredProducts.sort((a, b) => {
            switch (this.currentSort) {
                case 'price-low':
                    return a.price - b.price;
                case 'price-high':
                    return b.price - a.price;
                case 'rating':
                    return b.rating - a.rating;
                case 'newest':
                    return b.id - a.id; // Assuming higher ID = newer
                case 'popularity':
                    return b.reviewCount - a.reviewCount;
                default: // 'featured'
                    return b.rating * b.reviewCount - a.rating * a.reviewCount;
            }
        });
    }

    getCategories() {
        const categories = [...new Set(this.products.map(product => product.category))];
        return categories;
    }

    getTags() {
        const allTags = this.products.flatMap(product => product.tags);
        const uniqueTags = [...new Set(allTags)];
        return uniqueTags;
    }

    getPriceRange() {
        const prices = this.products.map(product => product.price);
        return {
            min: Math.min(...prices),
            max: Math.max(...prices)
        };
    }

    updateFilters(newFilters) {
        this.currentFilters = { ...this.currentFilters, ...newFilters };
        this.filterProducts();
        this.sortProducts();
    }

    updateSort(sortType) {
        this.currentSort = sortType;
        this.sortProducts();
    }

    searchProducts(searchTerm) {
        this.updateFilters({ searchTerm });
    }

    getFeaturedProducts(limit = 8) {
        // Return highest rated products with most reviews
        return this.products
            .sort((a, b) => (b.rating * b.reviewCount) - (a.rating * a.reviewCount))
            .slice(0, limit);
    }

    getProductById(id) {
        return this.products.find(product => product.id === id);
    }
}

// Global instance
const productManager = new ProductManager();
