class CartManager {
    constructor() {
        this.items = [];
        this.loadFromStorage();
    }

    loadFromStorage() {
        try {
            const stored = localStorage.getItem('shophub_cart');
            this.items = stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error loading cart from storage:', error);
            this.items = [];
        }
    }

    saveToStorage() {
        try {
            localStorage.setItem('shophub_cart', JSON.stringify(this.items));
        } catch (error) {
            console.error('Error saving cart to storage:', error);
        }
    }

    addItem(product, quantity = 1, variant = null) {
        const existingItem = this.items.find(item =>
            item.id === product.id &&
            item.variant === variant
        );

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({
                id: product.id,
                title: product.title,
                price: product.price,
                image: product.images[0],
                quantity: quantity,
                variant: variant
            });
        }

        this.saveToStorage();
        this.updateCartUI();
        this.showToast(`${product.title} added to cart!`);
    }

    removeItem(productId, variant = null) {
        this.items = this.items.filter(item =>
            !(item.id === productId && item.variant === variant)
        );
        this.saveToStorage();
        this.updateCartUI();
    }

    updateQuantity(productId, quantity, variant = null) {
        const item = this.items.find(item =>
            item.id === productId && item.variant === variant
        );

        if (item) {
            if (quantity <= 0) {
                this.removeItem(productId, variant);
            } else {
                item.quantity = quantity;
                this.saveToStorage();
                this.updateCartUI();
            }
        }
    }

    getTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    getItemCount() {
        return this.items.reduce((count, item) => count + item.quantity, 0);
    }

    clearCart() {
        this.items = [];
        this.saveToStorage();
        this.updateCartUI();
    }

    updateCartUI() {
        // Update cart count badge
        const cartCount = document.getElementById('cart-count');
        const itemCount = this.getItemCount();
        if (cartCount) {
            cartCount.textContent = itemCount;
            cartCount.classList.toggle('hidden', itemCount === 0);
        }

        // Update cart drawer
        this.updateCartDrawer();
    }

    updateCartDrawer() {
        const cartItems = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');

        if (!cartItems || !cartTotal) return;

        if (this.items.length === 0) {
            cartItems.innerHTML = '<div class="text-center text-gray-500 py-8">Your cart is empty</div>';
            cartTotal.textContent = '$0.00';
            return;
        }

        cartItems.innerHTML = this.items.map(item => `
            <div class="flex items-center space-x-4 p-4 border-b border-gray-200">
                <img src="${item.image}" alt="${item.title}" class="w-16 h-16 object-cover rounded-lg">
                <div class="flex-1">
                    <h4 class="font-semibold text-sm">${item.title}</h4>
                    ${item.variant ? `<p class="text-xs text-gray-500">${item.variant}</p>` : ''}
                    <div class="flex items-center justify-between mt-2">
                        <div class="flex items-center space-x-2">
                            <button onclick="cartManager.updateQuantity(${item.id}, ${item.quantity - 1}, '${item.variant}')"
                                    class="w-6 h-6 bg-gray-200 rounded text-xs hover:bg-gray-300">-</button>
                            <span class="text-sm">${item.quantity}</span>
                            <button onclick="cartManager.updateQuantity(${item.id}, ${item.quantity + 1}, '${item.variant}')"
                                    class="w-6 h-6 bg-gray-200 rounded text-xs hover:bg-gray-300">+</button>
                        </div>
                        <span class="font-semibold">$${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                </div>
                <button onclick="cartManager.removeItem(${item.id}, '${item.variant}')"
                        class="text-red-500 hover:text-red-700">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                </button>
            </div>
        `).join('');

        cartTotal.textContent = `$${this.getTotal().toFixed(2)}`;
    }

    showToast(message) {
        // Create toast notification
        const toast = document.createElement('div');
        toast.className = 'fixed top-4 right-4 bg-success text-white px-4 py-2 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300';
        toast.textContent = message;

        document.body.appendChild(toast);

        // Animate in
        setTimeout(() => {
            toast.classList.remove('translate-x-full');
        }, 100);

        // Remove after 3 seconds
        setTimeout(() => {
            toast.classList.add('translate-x-full');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }

    toggleCartDrawer() {
        const drawer = document.getElementById('cart-drawer');
        if (drawer) {
            const isOpen = !drawer.classList.contains('translate-x-full');
            if (isOpen) {
                drawer.classList.add('translate-x-full');
            } else {
                this.updateCartDrawer();
                drawer.classList.remove('translate-x-full');
            }
        }
    }
}

// Global instance
const cartManager = new CartManager();
