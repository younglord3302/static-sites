// Debug: Check if main.js is loading
console.log('main.js loaded successfully');

// Import modules
import './style.css'
import { catalog } from '../js/catalog.js'
import { storage } from '../js/storage.js'

// Initialize the application
document.addEventListener('DOMContentLoaded', async () => {
  console.log('DOM loaded, initializing LearnHub...');

  // Initialize catalog
  await catalog.init();

  // Initialize cart modal functionality
  initCartModal();

  // Initialize other UI components
  initUI();

  console.log('LearnHub application initialized successfully!');
});

// Cart modal functionality
function initCartModal() {
  const cartButton = document.getElementById('cart-button');
  const cartModal = document.getElementById('cart-modal');
  const closeCart = document.getElementById('close-cart');
  const checkoutBtn = document.getElementById('checkout-btn');

  if (cartButton && cartModal) {
    cartButton.addEventListener('click', () => {
      showCartModal();
    });
  }

  if (closeCart && cartModal) {
    closeCart.addEventListener('click', () => {
      cartModal.classList.add('hidden');
    });
  }

  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      handleCheckout();
    });
  }

  // Close modal when clicking outside
  if (cartModal) {
    cartModal.addEventListener('click', (e) => {
      if (e.target === cartModal) {
        cartModal.classList.add('hidden');
      }
    });
  }

  // Close modal on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && cartModal && !cartModal.classList.contains('hidden')) {
      cartModal.classList.add('hidden');
    }
  });
}

// Show cart modal with current cart items
function showCartModal() {
  const cartModal = document.getElementById('cart-modal');
  const cartItems = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');

  if (!cartModal || !cartItems || !cartTotal) return;

  const cart = storage.getCart();
  let total = 0;

  if (cart.length === 0) {
    cartItems.innerHTML = `
      <div class="text-center py-8">
        <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5H19M7 13l-1.1 5M7 13h10m0 0v8a2 2 0 002 2h-8a2 2 0 01-2-2v-3"></path>
        </svg>
        <p class="text-gray-600">Your cart is empty</p>
        <p class="text-sm text-gray-500 mt-1">Add some courses to get started!</p>
      </div>
    `;
    cartTotal.textContent = '0';
  } else {
    cartItems.innerHTML = cart.map(courseId => {
      const course = catalog.courses.find(c => c.id === courseId);
      if (!course) return '';

      total += course.price;

      return `
        <div class="flex items-center justify-between py-4 border-b border-gray-200 last:border-b-0">
          <div class="flex items-center">
            <img src="${course.thumbnail}" alt="${course.title}" class="w-16 h-16 object-cover rounded mr-4">
            <div>
              <h4 class="font-medium text-gray-900 line-clamp-2">${course.title}</h4>
              <p class="text-sm text-gray-600">${course.instructor.name}</p>
              <p class="text-sm font-medium text-gray-900">$${course.price}</p>
            </div>
          </div>
          <button class="text-red-500 hover:text-red-700 p-2" onclick="removeFromCart('${courseId}')">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
          </button>
        </div>
      `;
    }).join('');

    cartTotal.textContent = total.toFixed(2);
  }

  cartModal.classList.remove('hidden');
}

// Handle checkout process (mock)
function handleCheckout() {
  const cart = storage.getCart();

  if (cart.length === 0) {
    storage.showToast('Your cart is empty', 'warning');
    return;
  }

  // Mock successful enrollment for all cart items
  cart.forEach(courseId => {
    storage.enrollInCourse(courseId);
  });

  // Clear cart
  storage.clearCart();

  // Show success message
  const cartModal = document.getElementById('cart-modal');
  if (cartModal) {
    cartModal.classList.add('hidden');
  }

  storage.showToast('Successfully enrolled in courses!', 'success');

  // Re-render catalog to update button states
  catalog.renderCourses();
}

// Remove item from cart (called from modal)
window.removeFromCart = function(courseId) {
  storage.removeFromCart(courseId);
  showCartModal(); // Refresh modal
};

// Initialize other UI components
function initUI() {
  // Profile button (mock functionality)
  const profileButton = document.getElementById('profile-button');
  if (profileButton) {
    profileButton.addEventListener('click', () => {
      const auth = storage.getAuthStatus();
      if (auth.isLoggedIn) {
        // Show profile menu or navigate to dashboard
        window.location.href = '/dashboard';
      } else {
        // Show login modal (simplified)
        storage.showToast('Please log in to access your profile', 'info');
      }
    });
  }

  // Initialize dark mode
  const darkMode = storage.getDarkMode();
  storage.setDarkMode(darkMode);

  // Add dark mode toggle (could be added to header later)
  // const darkModeToggle = document.createElement('button');
  // darkModeToggle.textContent = darkMode ? '☀️' : '🌙';
  // darkModeToggle.className = 'fixed bottom-4 left-4 bg-gray-800 text-white p-3 rounded-full shadow-lg';
  // darkModeToggle.addEventListener('click', () => {
  //   const newMode = !storage.getDarkMode();
  //   storage.setDarkMode(newMode);
  //   darkModeToggle.textContent = newMode ? '☀️' : '🌙';
  // });
  // document.body.appendChild(darkModeToggle);
}
