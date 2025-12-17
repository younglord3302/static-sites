// Local storage helpers for cart, enrolled courses, auth, and progress

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
          ${type === 'success' ? '✓' : type === 'error' ? '✕' : type === 'warning' ? '⚠' : 'ℹ'}
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

// Export singleton instance
export const storage = new StorageManager();
