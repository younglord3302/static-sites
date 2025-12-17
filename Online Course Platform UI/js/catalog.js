// Course catalog management - search, filter, sort, display

import { storage } from './storage.js';

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
    const container = document.getElementById('courses-container');
    const skeleton = document.getElementById('loading-skeleton');

    if (!container) return;

    // Hide skeleton, show courses
    if (skeleton) skeleton.style.display = 'none';

    const courses = this.getPaginatedCourses();

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

    container.innerHTML = courses.map(course => this.createCourseCard(course)).join('');

    // Add event listeners
    this.attachCardEventListeners();

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
    this.showSkeleton();
    const loaded = await this.loadCourses();
    if (loaded) {
      this.initEventListeners();
      this.renderCourses();
      storage.updateCartUI(); // Update cart count on load
    }
  }
}

// Export singleton instance
export const catalog = new CatalogManager();
