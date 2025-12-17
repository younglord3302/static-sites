// Inline JavaScript - no modules to avoid CSP issues

// Storage Manager Class (from js/storage.js)
class StorageManager {
  constructor() {
    this.CART_KEY = 'learnhub_cart';
    this.ENROLLED_KEY = 'learnhub_enrolled';
    this.AUTH_KEY = 'learnhub_auth';
    this.PROGRESS_KEY = 'learnhub_progress';
    this.DARK_MODE_KEY = 'learnhub_dark_mode';
  }

  // Cart management
  getCart() {
    try {
      const cart = localStorage.getItem(this.CART_KEY);
      return cart ? JSON.parse(cart) : [];
    } catch (error) {
      console.error('Error getting cart:', error);
      return [];
    }
  }

  addToCart(courseId) {
    const cart = this.getCart();
    if (!cart.includes(courseId)) {
      cart.push(courseId);
      this.saveCart(cart);
      this.showToast('Course added to cart!', 'success');
      this.updateCartUI();
    } else {
      this.showToast('Course already in cart', 'info');
    }
  }

  removeFromCart(courseId) {
    const cart = this.getCart().filter(id => id !== courseId);
    this.saveCart(cart);
    this.updateCartUI();
    this.showToast('Course removed from cart', 'info');
  }

  saveCart(cart) {
    localStorage.setItem(this.CART_KEY, JSON.stringify(cart));
  }

  clearCart() {
    localStorage.removeItem(this.CART_KEY);
    this.updateCartUI();
  }

  // Enrollment management
  getEnrolledCourses() {
    try {
      const enrolled = localStorage.getItem(this.ENROLLED_KEY);
      return enrolled ? JSON.parse(enrolled) : [];
    } catch (error) {
      console.error('Error getting enrolled courses:', error);
      return [];
    }
  }

  enrollInCourse(courseId) {
    const enrolled = this.getEnrolledCourses();
    if (!enrolled.includes(courseId)) {
      enrolled.push(courseId);
      this.saveEnrolledCourses(enrolled);
      this.initializeProgress(courseId);
      this.showToast('Successfully enrolled in course!', 'success');
      return true;
    }
    return false;
  }

  saveEnrolledCourses(enrolled) {
    localStorage.setItem(this.ENROLLED_KEY, JSON.stringify(enrolled));
  }

  isEnrolled(courseId) {
    return this.getEnrolledCourses().includes(courseId);
  }

  // Progress tracking
  initializeProgress(courseId) {
    const progress = this.getProgress();
    if (!progress[courseId]) {
      progress[courseId] = {
        completedLessons: [],
        totalLessons: 0,
        lastAccessedLesson: null,
        completionPercentage: 0
      };
      this.saveProgress(progress);
    }
  }

  getProgress() {
    try {
      const progress = localStorage.getItem(this.PROGRESS_KEY);
      return progress ? JSON.parse(progress) : {};
    } catch (error) {
      console.error('Error getting progress:', error);
      return {};
    }
  }

  markLessonComplete(courseId, lessonId) {
    const progress = this.getProgress();
    if (progress[courseId]) {
      if (!progress[courseId].completedLessons.includes(lessonId)) {
        progress[courseId].completedLessons.push(lessonId);
        progress[courseId].completionPercentage = Math.round(
          (progress[courseId].completedLessons.length / progress[courseId].totalLessons) * 100
        );
        this.saveProgress(progress);
      }
    }
  }

  saveProgress(progress) {
    localStorage.setItem(this.PROGRESS_KEY, JSON.stringify(progress));
  }

  // Authentication (mock)
  getAuthStatus() {
    try {
      const auth = localStorage.getItem(this.AUTH_KEY);
      return auth ? JSON.parse(auth) : { isLoggedIn: false, user: null };
    } catch (error) {
      console.error('Error getting auth status:', error);
      return { isLoggedIn: false, user: null };
    }
  }

  login(userData) {
    const auth = { isLoggedIn: true, user: userData };
    localStorage.setItem(this.AUTH_KEY, JSON.stringify(auth));
  }

  logout() {
    localStorage.removeItem(this.AUTH_KEY);
  }

  // Dark mode
  getDarkMode() {
    return localStorage.getItem(this.DARK_MODE_KEY) === 'true';
  }

  setDarkMode(enabled) {
    localStorage.setItem(this.DARK_MODE_KEY, enabled.toString());
    document.documentElement.classList.toggle('dark', enabled);
  }

  // UI helpers
  updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
      const cart = this.getCart();
      cartCount.textContent = cart.length;
    }
  }

  showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `bg-white border-l-4 p-4 rounded-lg shadow-lg mb-4 fade-in ${
      type === 'success' ? 'border-green-500' :
      type === 'error' ? 'border-red-500' :
      type === 'warning' ? 'border-yellow-500' :
      'border-blue-500'
    }`;

    toast.innerHTML = `
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <div class="text-sm">
            ${type === 'success' ? '✓' : type === 'error' ? '✕' : type === 'warning' ? '⚠' : 'ℹ'}
          </div>
        </div>
        <div class="ml-3">
          <p class="text-sm text-gray-800">${message}</p>
        </div>
        <button class="ml-auto text-gray-400 hover:text-gray-600" onclick="this.parentElement.parentElement.remove()">
          ×
        </button>
      </div>
    `;

    toastContainer.appendChild(toast);

    // Auto remove after 5 seconds
    setTimeout(() => {
      if (toast.parentElement) {
        toast.remove();
      }
    }, 5000);
  }

  // Utility methods
  clearAllData() {
    localStorage.removeItem(this.CART_KEY);
    localStorage.removeItem(this.ENROLLED_KEY);
    localStorage.removeItem(this.AUTH_KEY);
    localStorage.removeItem(this.PROGRESS_KEY);
    localStorage.removeItem(this.DARK_MODE_KEY);
    this.showToast('All data cleared', 'info');
  }
}

// Catalog Manager Class (from js/catalog.js)
class CatalogManager {
  constructor() {
    this.courses = [];
    this.filteredCourses = [];
    this.currentPage = 1;
    this.coursesPerPage = 12;
    this.searchTerm = '';
    this.filters = {
      category: '',
      level: '',
      price: ''
    };
    this.sortBy = 'relevance';
  }

  // Load courses from JSON
  async loadCourses() {
    try {
      console.log('Loading courses...');
      const response = await fetch('/data/courses.json');
      console.log('Response status:', response.status);
      this.courses = await response.json();
      console.log('Loaded', this.courses.length, 'courses');
      this.filteredCourses = [...this.courses];

      // Initialize progress data for each course
      this.courses.forEach(course => {
        const progress = storage.getProgress();
        if (!progress[course.id]) {
          storage.initializeProgress(course.id);
          // Update total lessons count after initialization
          const updatedProgress = storage.getProgress();
          const totalLessons = course.curriculum.reduce((total, section) => total + section.lessons.length, 0);
          updatedProgress[course.id].totalLessons = totalLessons;
          storage.saveProgress(updatedProgress);
        }
      });

      return true;
    } catch (error) {
      console.error('Error loading courses:', error);
      return false;
    }
  }

  // Search courses
  searchCourses(term) {
    this.searchTerm = term.toLowerCase();
    this.applyFilters();
  }

  // Apply filters
  applyFilters() {
    this.filteredCourses = this.courses.filter(course => {
      // Search filter
      const matchesSearch = !this.searchTerm ||
        course.title.toLowerCase().includes(this.searchTerm) ||
        course.description.toLowerCase().includes(this.searchTerm) ||
        course.instructor.name.toLowerCase().includes(this.searchTerm) ||
        course.tags.some(tag => tag.toLowerCase().includes(this.searchTerm)) ||
        course.category.toLowerCase().includes(this.searchTerm);

      // Category filter
      const matchesCategory = !this.filters.category || course.category === this.filters.category;

      // Level filter
      const matchesLevel = !this.filters.level || course.level === this.filters.level;

      // Price filter
      const matchesPrice = !this.filters.price ||
        (this.filters.price === 'free' && course.isFree) ||
        (this.filters.price === 'paid' && !course.isFree);

      return matchesSearch && matchesCategory && matchesLevel && matchesPrice;
    });

    this.applySorting();
    this.currentPage = 1;
  }

  // Apply sorting
  applySorting() {
    this.filteredCourses.sort((a, b) => {
      switch (this.sortBy) {
        case 'newest':
          return new Date(b.publishedAt) - new Date(a.publishedAt);
        case 'rating':
          return b.rating - a.rating;
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'relevance':
        default:
          // For relevance, keep original order but prioritize exact matches
          if (this.searchTerm) {
            const aTitle = a.title.toLowerCase().includes(this.searchTerm) ? 1 : 0;
            const bTitle = b.title.toLowerCase().includes(this.searchTerm) ? 1 : 0;
            if (aTitle !== bTitle) return bTitle - aTitle;
            return b.rating - a.rating; // Then by rating
          }
          return 0;
      }
    });
  }

  // Set filter
  setFilter(type, value) {
    this.filters[type] = value;
    this.applyFilters();
  }

  // Set sorting
  setSorting(sortBy) {
    this.sortBy = sortBy;
    this.applySorting();
  }

  // Clear all filters
  clearFilters() {
    this.searchTerm = '';
    this.filters = { category: '', level: '', price: '' };
    this.sortBy = 'relevance';
    this.applyFilters();

    // Reset UI elements
    const searchInput = document.getElementById('search-input');
    const categoryFilter = document.getElementById('category-filter');
    const levelFilter = document.getElementById('level-filter');
    const priceFilter = document.getElementById('price-filter');
    const sortSelect = document.getElementById('sort-select');

    if (searchInput) searchInput.value = '';
    if (categoryFilter) categoryFilter.value = '';
    if (levelFilter) levelFilter.value = '';
    if (priceFilter) priceFilter.value = '';
    if (sortSelect) sortSelect.value = 'relevance';
  }

  // Get paginated courses
  getPaginatedCourses() {
    const start = (this.currentPage - 1) * this.coursesPerPage;
    const end = start + this.coursesPerPage;
    return this.filteredCourses.slice(start, end);
  }

  // Load next page
  loadNextPage() {
    if (this.hasMorePages()) {
      this.currentPage++;
      this.renderCourses();
    }
  }

  // Check if more pages available
  hasMorePages() {
    return this.currentPage * this.coursesPerPage < this.filteredCourses.length;
  }

  // Render courses to DOM
  renderCourses() {
    console.log('Rendering courses...');
    console.log('All elements:', document.querySelectorAll('[id]'));
    const container = document.getElementById('courses-container');
    const skeleton = document.getElementById('loading-skeleton');

    console.log('Container found:', !!container);
    console.log('Container element:', container);

    if (!container) {
      console.error('Courses container not found!');
      // Try to create it
      const courseGrid = document.getElementById('course-grid');
      if (courseGrid) {
        console.log('Creating container manually...');
        const newContainer = document.createElement('div');
        newContainer.id = 'courses-container';
        newContainer.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6';
        courseGrid.appendChild(newContainer);
        return this.renderCourses(); // Retry
      }
      return;
    }

    console.log('Found container, hiding skeleton...');
    // Hide skeleton, show courses
    if (skeleton) skeleton.style.display = 'none';
    if (container) container.style.display = ''; // Restore container visibility

    const courses = this.getPaginatedCourses();
    console.log('Got', courses.length, 'courses to render');

    if (courses.length === 0) {
      container.innerHTML = `
        <div class="col-span-full text-center py-12">
          <div class="text-gray-400 mb-4">
            <svg class="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
          <p class="text-gray-600 mb-4">Try adjusting your search or clearing the filters.</p>
          <button id="clear-filters-empty" class="bg-primary hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
            Clear Filters
          </button>
        </div>
      `;

      const clearBtn = document.getElementById('clear-filters-empty');
      if (clearBtn) {
        clearBtn.addEventListener('click', () => this.clearFilters());
      }

      return;
    }

    const html = courses.map(course => this.createCourseCard(course)).join('');
    console.log('Generated HTML length:', html.length);
    container.innerHTML = html;
    console.log('Courses HTML inserted into container, container children:', container.children.length);

    // Add event listeners
    this.attachCardEventListeners();
    console.log('Event listeners attached, rendering complete');

    // Add click listeners for course navigation
    const courseLinks = document.querySelectorAll('[href^="/course/"]');
    courseLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const href = link.getAttribute('href');
        const courseSlug = href.replace('/course/', '');
        const course = this.courses.find(c => c.slug === courseSlug);
        if (course) {
          window.location.href = `/course.html?id=${course.id}`;
        }
      });
    });
  }

  // Create course card HTML
  createCourseCard(course) {
    const progress = storage.getProgress()[course.id] || {};
    const isEnrolled = storage.isEnrolled(course.id);
    const isInCart = storage.getCart().includes(course.id);

    return `
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
        <div class="relative">
          <img src="${course.thumbnail}" alt="${course.title}" class="w-full h-48 object-cover" loading="lazy">
          ${course.isFree ? '<span class="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">FREE</span>' : ''}
          ${isEnrolled ? '<span class="absolute top-2 right-2 bg-accent text-white px-2 py-1 rounded text-xs font-medium">ENROLLED</span>' : ''}
        </div>
        <div class="p-4">
          <div class="flex items-start justify-between mb-2">
            <h3 class="text-lg font-semibold text-gray-900 line-clamp-2 flex-1 mr-2">
              <a href="/course/${course.slug}" class="hover:text-primary transition-colors">${course.title}</a>
            </h3>
          </div>

          <p class="text-sm text-gray-600 mb-3 line-clamp-2">${course.description}</p>

          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center">
              <img src="${course.instructor.avatar}" alt="${course.instructor.name}" class="w-8 h-8 rounded-full mr-2" loading="lazy">
              <span class="text-sm text-gray-700">${course.instructor.name}</span>
            </div>
            <div class="flex items-center">
              <svg class="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
              <span class="text-sm text-gray-600">${course.rating} (${course.reviewsCount})</span>
            </div>
          </div>

          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center space-x-4 text-sm text-gray-600">
              <span>${course.duration}</span>
              <span>•</span>
              <span>${course.level}</span>
            </div>
          </div>

          ${isEnrolled && progress.completionPercentage > 0 ? `
            <div class="mb-4">
              <div class="flex justify-between text-sm text-gray-600 mb-1">
                <span>Progress</span>
                <span>${progress.completionPercentage}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-accent h-2 rounded-full transition-all duration-300" style="width: ${progress.completionPercentage}%"></div>
              </div>
            </div>
          ` : ''}

          <div class="flex items-center justify-between">
            <div class="text-2xl font-bold text-gray-900">
              ${course.isFree ? 'Free' : `$${course.price}`}
            </div>
            <button
              class="course-action-btn px-4 py-2 rounded-lg font-medium transition-colors ${
                isEnrolled
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : isInCart
                  ? 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  : 'bg-primary hover:bg-blue-700 text-white'
              }"
              data-course-id="${course.id}"
              data-action="${isEnrolled ? 'resume' : isInCart ? 'remove-cart' : 'add-cart'}"
            >
              ${isEnrolled ? 'Resume' : isInCart ? 'Remove' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // Attach event listeners to course cards
  attachCardEventListeners() {
    const actionButtons = document.querySelectorAll('.course-action-btn');

    actionButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const courseId = button.dataset.courseId;
        const action = button.dataset.action;

        switch (action) {
          case 'add-cart':
            storage.addToCart(courseId);
            this.renderCourses(); // Re-render to update button states
            break;
          case 'remove-cart':
            storage.removeFromCart(courseId);
            this.renderCourses();
            break;
          case 'resume':
            const course = this.courses.find(c => c.id === courseId);
            if (course) {
              window.location.href = `/course/${course.slug}`;
            }
            break;
        }
      });
    });
  }

  // Show loading skeleton
  showSkeleton() {
    const container = document.getElementById('courses-container');
    const skeleton = document.getElementById('loading-skeleton');

    if (container) container.style.display = 'none';
    if (skeleton) {
      skeleton.style.display = 'grid';
      skeleton.innerHTML = Array(8).fill().map(() => `
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse">
          <div class="h-48 bg-gray-200"></div>
          <div class="p-4">
            <div class="h-4 bg-gray-200 rounded mb-2"></div>
            <div class="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
            <div class="flex items-center mb-3">
              <div class="w-8 h-8 bg-gray-200 rounded-full mr-2"></div>
              <div class="h-4 bg-gray-200 rounded w-24"></div>
            </div>
            <div class="flex justify-between">
              <div class="h-6 bg-gray-200 rounded w-16"></div>
              <div class="h-8 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
        </div>
      `).join('');
    }
  }

  // Initialize event listeners
  initEventListeners() {
    // Search input
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchCourses(e.target.value);
        this.renderCourses();
      });
    }

    // Filter selects
    const categoryFilter = document.getElementById('category-filter');
    const levelFilter = document.getElementById('level-filter');
    const priceFilter = document.getElementById('price-filter');

    if (categoryFilter) {
      categoryFilter.addEventListener('change', (e) => {
        this.setFilter('category', e.target.value);
        this.renderCourses();
      });
    }

    if (levelFilter) {
      levelFilter.addEventListener('change', (e) => {
        this.setFilter('level', e.target.value);
        this.renderCourses();
      });
    }

    if (priceFilter) {
      priceFilter.addEventListener('change', (e) => {
        this.setFilter('price', e.target.value);
        this.renderCourses();
      });
    }

    // Sort select
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        this.setSorting(e.target.value);
        this.renderCourses();
      });
    }

    // Clear filters button
    const clearFiltersBtn = document.getElementById('clear-filters');
    if (clearFiltersBtn) {
      clearFiltersBtn.addEventListener('click', () => this.clearFilters());
    }

    // Load more button
    const loadMoreBtn = document.getElementById('load-more');
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener('click', () => {
        this.loadNextPage();
        if (!this.hasMorePages()) {
          loadMoreBtn.style.display = 'none';
        }
      });
    }
  }

  // Initialize catalog
  async init() {
    console.log('Initializing catalog...');
    this.showSkeleton();
    const loaded = await this.loadCourses();
    console.log('Courses loaded:', loaded);
    if (loaded) {
      console.log('Setting up event listeners...');
      this.initEventListeners();
      console.log('Rendering courses...');
      this.renderCourses();
      storage.updateCartUI(); // Update cart count on load
      console.log('Catalog initialization complete');
    } else {
      console.error('Failed to load courses');
    }
  }
}

// Global instances
const storage = new StorageManager();
const catalog = new CatalogManager();

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
function removeFromCart(courseId) {
  storage.removeFromCart(courseId);
  showCartModal(); // Refresh modal
}

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
}

// Debug: Check if JavaScript works
console.log('app.js loaded successfully');
