// Course detail page functionality

import { storage } from '../js/storage.js';

class CourseDetailPage {
  constructor() {
    this.courseId = null;
    this.course = null;
    this.courses = [];
  }

  // Initialize the page
  async init() {
    // Get course ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    this.courseId = urlParams.get('id');

    if (!this.courseId) {
      this.showError('Course not found');
      return;
    }

    // Load courses data
    await this.loadCourses();

    // Find the course
    this.course = this.courses.find(c => c.id === this.courseId);
    if (!this.course) {
      this.showError('Course not found');
      return;
    }

    // Render course details
    this.renderCourseDetails();
    this.initEventListeners();

    // Update cart count
    storage.updateCartUI();
  }

  // Load courses data
  async loadCourses() {
    try {
      const response = await fetch('/data/courses.json');
      this.courses = await response.json();
    } catch (error) {
      console.error('Error loading courses:', error);
      this.showError('Failed to load course data');
    }
  }

  // Show error message
  showError(message) {
    const content = document.getElementById('course-content');
    const skeleton = document.getElementById('loading-skeleton');

    if (skeleton) skeleton.style.display = 'none';
    if (content) {
      content.innerHTML = `
        <div class="text-center py-12">
          <div class="text-gray-400 mb-4">
            <svg class="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
          </div>
          <h2 class="text-xl font-semibold text-gray-900 mb-2">Oops!</h2>
          <p class="text-gray-600">${message}</p>
          <a href="/" class="inline-block mt-4 bg-primary hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
            Back to Home
          </a>
        </div>
      `;
      content.classList.remove('hidden');
    }
  }

  // Render course details
  renderCourseDetails() {
    const skeleton = document.getElementById('loading-skeleton');
    const content = document.getElementById('course-content');

    // Hide skeleton and show content
    if (skeleton) skeleton.style.display = 'none';
    if (content) content.classList.remove('hidden');

    // Update page title
    document.title = `${this.course.title} - LearnHub`;
    const pageTitle = document.getElementById('page-title');
    if (pageTitle) pageTitle.textContent = `${this.course.title} - LearnHub`;

    // Render hero section
    this.renderHero();

    // Render overview tab
    this.renderOverview();

    // Render curriculum tab
    this.renderCurriculum();

    // Render instructor tab
    this.renderInstructor();

    // Render reviews tab
    this.renderReviews();
  }

  // Render hero section
  renderHero() {
    const isEnrolled = storage.isEnrolled(this.course.id);
    const isInCart = storage.getCart().includes(this.course.id);

    // Update category and level
    document.getElementById('course-category').textContent = this.course.category;
    document.getElementById('course-level').textContent = this.course.level;

    // Update title and description
    document.getElementById('course-title').textContent = this.course.title;
    document.getElementById('course-description').textContent = this.course.description;

    // Update instructor info
    document.getElementById('instructor-avatar').src = this.course.instructor.avatar;
    document.getElementById('instructor-avatar').alt = this.course.instructor.name;
    document.getElementById('instructor-name').textContent = this.course.instructor.name;
    document.getElementById('instructor-bio').textContent = this.course.instructor.bio;

    // Update ratings and stats
    document.getElementById('course-rating').textContent = this.course.rating;
    document.getElementById('course-reviews').textContent = `(${this.course.reviewsCount} reviews)`;
    document.getElementById('course-duration').textContent = this.course.duration;
    document.getElementById('course-students').textContent = '2,450 students'; // Mock data

    // Update thumbnail
    document.getElementById('course-thumbnail').src = this.course.thumbnail;
    document.getElementById('course-thumbnail').alt = this.course.title;

    // Update pricing
    document.getElementById('course-price').textContent = this.course.isFree ? 'Free' : `$${this.course.price}`;

    // Update enrollment buttons
    const enrollBtn = document.getElementById('enroll-btn');
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    const enrollText = document.getElementById('enroll-text');

    if (isEnrolled) {
      enrollBtn.textContent = 'Continue Learning';
      enrollText.textContent = 'Continue Learning';
      enrollBtn.className = 'bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors';
      addToCartBtn.style.display = 'none';
    } else if (isInCart) {
      enrollText.textContent = `Enroll Now - $${this.course.price}`;
      addToCartBtn.textContent = 'Remove from Cart';
      addToCartBtn.className = 'border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-4 rounded-lg font-semibold text-lg transition-colors';
    } else {
      enrollText.textContent = `Enroll Now - $${this.course.price}`;
      addToCartBtn.textContent = 'Add to Cart';
      addToCartBtn.className = 'border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors';
    }

    // Update course details
    document.getElementById('course-language').textContent = this.course.language;
    document.getElementById('course-updated').textContent = 'May 2024'; // Mock data
  }

  // Render overview tab
  renderOverview() {
    // Learning objectives
    const objectivesList = document.getElementById('learning-objectives');
    if (objectivesList) {
      objectivesList.innerHTML = `
        <li>Master modern JavaScript (ES6+)</li>
        <li>Build production-ready applications</li>
        <li>Understand async programming patterns</li>
        <li>Work with modules and tooling</li>
        <li>Implement best practices and testing</li>
      `;
    }

    // Requirements
    const requirementsList = document.getElementById('requirements');
    if (requirementsList) {
      requirementsList.innerHTML = `
        <li>Basic understanding of programming concepts</li>
        <li>HTML and CSS fundamentals</li>
        <li>Access to a computer with internet</li>
      `;
    }

    // Full description
    const fullDesc = document.getElementById('full-description');
    if (fullDesc) {
      fullDesc.innerHTML = `
        <p>${this.course.description}</p>
        <p>This comprehensive course takes you from JavaScript fundamentals to building production-ready applications. You'll learn modern ES6+ features, asynchronous programming, module systems, and industry best practices.</p>
        <p>Through hands-on projects and real-world examples, you'll gain the confidence to build scalable JavaScript applications that perform well and are maintainable.</p>
      `;
    }
  }

  // Render curriculum tab
  renderCurriculum() {
    const curriculumContent = document.getElementById('curriculum-content');
    if (!curriculumContent) return;

    curriculumContent.innerHTML = this.course.curriculum.map(section => `
      <div class="border border-gray-200 rounded-lg overflow-hidden">
        <button class="curriculum-section w-full px-6 py-4 bg-gray-50 hover:bg-gray-100 text-left font-medium transition-colors flex justify-between items-center" data-section="${section.section}">
          <span>${section.section}</span>
          <div class="flex items-center space-x-2">
            <span class="text-sm text-gray-600">${section.lessons.length} lessons</span>
            <svg class="w-5 h-5 text-gray-400 transform transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </button>
        <div class="curriculum-lessons hidden bg-white border-t border-gray-200">
          ${section.lessons.map(lesson => {
            const progress = storage.getProgress()[this.course.id] || {};
            const isCompleted = progress.completedLessons?.includes(lesson.id);
            const isLocked = lesson.locked;

            return `
              <div class="lesson-item px-6 py-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div class="lesson-status w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    isCompleted ? 'bg-green-500 border-green-500' :
                    isLocked ? 'border-gray-300' : 'border-primary'
                  }">
                    ${isCompleted ? '✓' : isLocked ? '🔒' : '○'}
                  </div>
                  <div>
                    <h4 class="font-medium text-gray-900">${lesson.title}</h4>
                    <p class="text-sm text-gray-600">${lesson.duration}</p>
                  </div>
                </div>
                <button class="lesson-play-btn text-primary hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50 transition-colors" data-lesson-id="${lesson.id}" ${isLocked ? 'disabled' : ''}>
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"></path>
                  </svg>
                </button>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `).join('');

    // Add event listeners for curriculum sections
    this.initCurriculumEventListeners();
  }

  // Render instructor tab
  renderInstructor() {
    document.getElementById('instructor-detail-avatar').src = this.course.instructor.avatar;
    document.getElementById('instructor-detail-name').textContent = this.course.instructor.name;
    document.getElementById('instructor-detail-title').textContent = 'Senior Front-end Engineer at Meta'; // Mock data
    document.getElementById('instructor-detail-bio').innerHTML = `
      <p>${this.course.instructor.bio}</p>
      <p>Asha is a senior front-end engineer with over 8 years of experience building scalable web applications. She specializes in modern JavaScript frameworks and has worked at top tech companies including Meta and Google.</p>
      <p>She has taught thousands of students through various online platforms and is passionate about making complex technical concepts accessible to everyone.</p>
    `;
  }

  // Render reviews tab
  renderReviews() {
    // Update rating stats
    document.getElementById('reviews-avg-rating').textContent = this.course.rating;
    document.getElementById('reviews-total').textContent = `(${this.course.reviewsCount} reviews)`;

    // Generate stars
    const starsContainer = document.querySelector('#reviews-tab .flex');
    if (starsContainer) {
      const starsHtml = Array(5).fill().map((_, i) =>
        `<svg class="w-5 h-5 ${i < Math.floor(this.course.rating) ? 'text-yellow-400' : 'text-gray-300'}" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
        </svg>`
      ).join('');
      starsContainer.innerHTML = starsHtml;
    }

    // Mock individual reviews
    const reviewsContainer = document.getElementById('individual-reviews');
    if (reviewsContainer) {
      const mockReviews = [
        {
          name: 'Sarah M.',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
          rating: 5,
          date: '2 weeks ago',
          review: 'Excellent course! Asha explains complex concepts in a very clear and understandable way. The projects are practical and helped me build real skills.',
          helpful: 12
        },
        {
          name: 'Mike R.',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
          rating: 5,
          date: '1 month ago',
          review: 'This course transformed my understanding of JavaScript. The async programming section was particularly well done. Highly recommend!',
          helpful: 8
        },
        {
          name: 'Jennifer L.',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
          rating: 4,
          date: '3 weeks ago',
          review: 'Great content and well-structured. Some sections could be a bit more detailed, but overall very satisfied with the learning experience.',
          helpful: 5
        }
      ];

      reviewsContainer.innerHTML = mockReviews.map(review => `
        <div class="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
          <div class="flex items-start space-x-4">
            <img src="${review.avatar}" alt="${review.name}" class="w-10 h-10 rounded-full">
            <div class="flex-1">
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center space-x-2">
                  <h4 class="font-medium text-gray-900">${review.name}</h4>
                  <div class="flex">
                    ${Array(5).fill().map((_, i) => `
                      <svg class="w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                    `).join('')}
                  </div>
                </div>
                <span class="text-sm text-gray-500">${review.date}</span>
              </div>
              <p class="text-gray-700 mb-2">${review.review}</p>
              <div class="flex items-center space-x-4 text-sm text-gray-500">
                <button class="hover:text-gray-700">Helpful (${review.helpful})</button>
                <span>•</span>
                <button class="hover:text-gray-700">Report</button>
              </div>
            </div>
          </div>
        </div>
      `).join('');
    }
  }

  // Initialize event listeners
  initEventListeners() {
    // Tab switching
    const tabs = document.querySelectorAll('.course-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        this.switchTab(tab.dataset.tab);
      });
    });

    // Enrollment button
    const enrollBtn = document.getElementById('enroll-btn');
    if (enrollBtn) {
      enrollBtn.addEventListener('click', () => {
        this.handleEnrollment();
      });
    }

    // Add to cart button
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    if (addToCartBtn) {
      addToCartBtn.addEventListener('click', (e) => {
        this.handleCartAction(e.target.textContent.includes('Remove'));
      });
    }

    // Share button
    const shareBtn = document.getElementById('share-btn');
    if (shareBtn) {
      shareBtn.addEventListener('click', () => {
        this.handleShare();
      });
    }

    // Cart modal
    this.initCartModal();

    // Auth modal
    this.initAuthModal();

    // Profile button
    const profileButton = document.getElementById('profile-button');
    if (profileButton) {
      profileButton.addEventListener('click', () => {
        window.location.href = '/dashboard';
      });
    }
  }

  // Initialize curriculum event listeners
  initCurriculumEventListeners() {
    const sectionButtons = document.querySelectorAll('.curriculum-section');
    sectionButtons.forEach(button => {
      button.addEventListener('click', () => {
        const section = button.dataset.section;
        this.toggleCurriculumSection(section);
      });
    });

    // Lesson play buttons
    const lessonButtons = document.querySelectorAll('.lesson-play-btn');
    lessonButtons.forEach(button => {
      button.addEventListener('click', () => {
        const lessonId = button.dataset.lessonId;
        this.playLesson(lessonId);
      });
    });
  }

  // Switch between tabs
  switchTab(tabName) {
    // Update tab buttons
    const tabs = document.querySelectorAll('.course-tab');
    tabs.forEach(tab => {
      if (tab.dataset.tab === tabName) {
        tab.classList.add('active', 'border-primary', 'text-primary');
        tab.classList.remove('text-gray-600');
      } else {
        tab.classList.remove('active', 'border-primary', 'text-primary');
        tab.classList.add('text-gray-600');
      }
    });

    // Update tab content
    const contents = document.querySelectorAll('.course-tab-content');
    contents.forEach(content => {
      if (content.id === `${tabName}-tab`) {
        content.classList.remove('hidden');
      } else {
        content.classList.add('hidden');
      }
    });
  }

  // Toggle curriculum section
  toggleCurriculumSection(sectionName) {
    const section = document.querySelector(`[data-section="${sectionName}"]`);
    const lessons = section.nextElementSibling;
    const icon = section.querySelector('svg');

    if (lessons.classList.contains('hidden')) {
      lessons.classList.remove('hidden');
      icon.style.transform = 'rotate(180deg)';
    } else {
      lessons.classList.add('hidden');
      icon.style.transform = 'rotate(0deg)';
    }
  }

  // Handle enrollment
  handleEnrollment() {
    const isEnrolled = storage.isEnrolled(this.course.id);

    if (isEnrolled) {
      // Navigate to first lesson
      const firstSection = this.course.curriculum[0];
      if (firstSection && firstSection.lessons.length > 0) {
        this.playLesson(firstSection.lessons[0].id);
      }
    } else {
      // Check if user is logged in (mock)
      const auth = storage.getAuthStatus();
      if (!auth.isLoggedIn) {
        this.showAuthModal();
        return;
      }

      // Enroll in course
      storage.enrollInCourse(this.course.id);
      this.renderHero(); // Update button states
      storage.showToast('Successfully enrolled in course!', 'success');
    }
  }

  // Handle cart actions
  handleCartAction(isRemoving) {
    if (isRemoving) {
      storage.removeFromCart(this.course.id);
      this.renderHero();
    } else {
      storage.addToCart(this.course.id);
      this.renderHero();
    }
  }

  // Handle sharing
  handleShare() {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: this.course.title,
        text: `Check out this course: ${this.course.title}`,
        url: url
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(url).then(() => {
        storage.showToast('Course link copied to clipboard!', 'success');
      });
    }
  }

  // Play lesson
  playLesson(lessonId) {
    // Navigate to lesson player
    window.location.href = `/lesson.html?course=${this.course.id}&lesson=${lessonId}`;
  }

  // Initialize cart modal
  initCartModal() {
    const cartButton = document.getElementById('cart-button');
    const cartModal = document.getElementById('cart-modal');
    const closeCart = document.getElementById('close-cart');
    const checkoutBtn = document.getElementById('checkout-btn');

    if (cartButton && cartModal) {
      cartButton.addEventListener('click', () => {
        this.showCartModal();
      });
    }

    if (closeCart && cartModal) {
      closeCart.addEventListener('click', () => {
        cartModal.classList.add('hidden');
      });
    }

    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        this.handleCheckout();
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

  // Show cart modal
  showCartModal() {
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
        const course = this.courses.find(c => c.id === courseId);
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

  // Handle checkout
  handleCheckout() {
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

    // Update UI
    this.renderHero();
  }

  // Initialize auth modal
  initAuthModal() {
    const authModal = document.getElementById('auth-modal');
    const closeAuth = document.getElementById('close-auth');
    const loginForm = document.getElementById('login-form');

    if (closeAuth && authModal) {
      closeAuth.addEventListener('click', () => {
        authModal.classList.add('hidden');
      });
    }

    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleLogin();
      });
    }

    // Close modal when clicking outside
    if (authModal) {
      authModal.addEventListener('click', (e) => {
        if (e.target === authModal) {
          authModal.classList.add('hidden');
        }
      });
    }

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && authModal && !authModal.classList.contains('hidden')) {
        authModal.classList.add('hidden');
      }
    });
  }

  // Show auth modal
  showAuthModal() {
    const authModal = document.getElementById('auth-modal');
    if (authModal) {
      authModal.classList.remove('hidden');
    }
  }

  // Handle login (mock)
  handleLogin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (email && password) {
      // Mock successful login
      storage.login({
        email: email,
        name: email.split('@')[0]
      });

      const authModal = document.getElementById('auth-modal');
      if (authModal) {
        authModal.classList.add('hidden');
      }

      storage.showToast('Successfully signed in!', 'success');

      // Now proceed with enrollment
      this.handleEnrollment();
    } else {
      storage.showToast('Please fill in all fields', 'error');
    }
  }
}

// Global function for cart modal
window.removeFromCart = function(courseId) {
  storage.removeFromCart(courseId);
  // Refresh cart modal if it's open
  const coursePage = new CourseDetailPage();
  coursePage.showCartModal();
};

// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const coursePage = new CourseDetailPage();
  coursePage.init();
});
