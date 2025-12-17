// Dashboard functionality

import { storage } from '../js/storage.js';

class Dashboard {
  constructor() {
    this.courses = [];
    this.enrolledCourses = [];
  }

  // Initialize the dashboard
  async init() {
    // Load courses data
    await this.loadCourses();

    // Get enrolled courses
    this.enrolledCourses = this.getEnrolledCourses();

    // Render dashboard content
    this.renderDashboard();

    // Initialize chart
    this.initChart();

    // Initialize event listeners
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
    }
  }

  // Get enrolled courses with progress
  getEnrolledCourses() {
    const enrolledIds = storage.getEnrolledCourses();
    return enrolledIds.map(courseId => {
      const course = this.courses.find(c => c.id === courseId);
      if (course) {
        const progress = storage.getProgress()[courseId] || { completedLessons: [], completionPercentage: 0 };
        return { ...course, progress };
      }
      return null;
    }).filter(Boolean);
  }

  // Render dashboard content
  renderDashboard() {
    const skeleton = document.getElementById('loading-skeleton');
    const content = document.getElementById('dashboard-content');

    // Hide skeleton and show content
    if (skeleton) skeleton.style.display = 'none';
    if (content) content.classList.remove('hidden');

    // Update user name
    this.updateUserName();

    // Update statistics
    this.updateStats();

    // Render continue learning section
    this.renderContinueLearning();

    // Render recent activity
    this.renderRecentActivity();

    // Render certificates
    this.renderCertificates();

    // Update achievements
    this.updateAchievements();
  }

  // Update user name
  updateUserName() {
    const userName = document.getElementById('user-name');
    const auth = storage.getAuthStatus();
    if (userName) {
      userName.textContent = auth.isLoggedIn ? auth.user.name : 'Learner';
    }
  }

  // Update statistics
  updateStats() {
    const enrolledCount = this.enrolledCourses.length;
    const completedCount = this.enrolledCourses.filter(course => course.progress.completionPercentage === 100).length;
    const totalHours = this.calculateTotalHours();

    document.getElementById('stats-courses').textContent = enrolledCount;
    document.getElementById('stats-completed').textContent = completedCount;
    document.getElementById('stats-hours').textContent = `${totalHours}h`;
    document.getElementById('stats-streak').textContent = '7 days'; // Mock data
  }

  // Calculate total learning hours
  calculateTotalHours() {
    let totalMinutes = 0;

    this.enrolledCourses.forEach(course => {
      // Parse course duration (e.g., "8h 30m" -> 510 minutes)
      const durationMatch = course.duration.match(/(\d+)h\s*(\d+)m/);
      if (durationMatch) {
        const hours = parseInt(durationMatch[1]);
        const minutes = parseInt(durationMatch[2]);
        totalMinutes += (hours * 60) + minutes;
      }

      // Calculate based on completed lessons
      const completedLessons = course.progress.completedLessons || [];
      const totalLessons = course.curriculum.reduce((total, section) => total + section.lessons.length, 0);
      const completionRatio = completedLessons.length / totalLessons;
      totalMinutes += (course.durationMinutes || 0) * completionRatio; // Assume we store duration in minutes
    });

    return Math.round(totalMinutes / 60);
  }

  // Render continue learning section
  renderContinueLearning() {
    const container = document.getElementById('continue-learning');
    const emptyState = document.getElementById('continue-empty');

    if (this.enrolledCourses.length === 0) {
      if (container) container.style.display = 'none';
      if (emptyState) emptyState.classList.remove('hidden');
      return;
    }

    if (emptyState) emptyState.classList.add('hidden');
    if (container) container.style.display = 'grid';

    // Sort by progress (incomplete first)
    const sortedCourses = [...this.enrolledCourses].sort((a, b) => {
      if (a.progress.completionPercentage === 100 && b.progress.completionPercentage < 100) return 1;
      if (a.progress.completionPercentage < 100 && b.progress.completionPercentage === 100) return -1;
      return b.progress.completionPercentage - a.progress.completionPercentage;
    });

    container.innerHTML = sortedCourses.slice(0, 6).map(course => `
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
        <div class="relative">
          <img src="${course.thumbnail}" alt="${course.title}" class="w-full h-32 object-cover">
          <div class="absolute top-2 left-2">
            <span class="px-2 py-1 bg-primary/90 text-white text-xs rounded">${course.category}</span>
          </div>
          ${course.progress.completionPercentage === 100 ? `
            <div class="absolute top-2 right-2">
              <span class="px-2 py-1 bg-green-500 text-white text-xs rounded">Completed</span>
            </div>
          ` : ''}
        </div>
        <div class="p-4">
          <h3 class="font-semibold text-gray-900 mb-2 line-clamp-2">${course.title}</h3>
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center">
              <img src="${course.instructor.avatar}" alt="${course.instructor.name}" class="w-6 h-6 rounded-full mr-2">
              <span class="text-sm text-gray-600">${course.instructor.name}</span>
            </div>
            <div class="flex items-center">
              <svg class="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20"></svg>
              <span class="text-sm text-gray-600">${course.rating}</span>
            </div>
          </div>

          ${course.progress.completionPercentage < 100 ? `
            <div class="mb-4">
              <div class="flex justify-between text-sm text-gray-600 mb-1">
                <span>Progress</span>
                <span>${course.progress.completionPercentage}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-accent h-2 rounded-full transition-all duration-300" style="width: ${course.progress.completionPercentage}%"></div>
              </div>
            </div>
          ` : ''}

          <a href="/course.html?id=${course.id}" class="w-full bg-primary hover:bg-blue-700 text-white text-center py-2 px-4 rounded-lg font-medium transition-colors block">
            ${course.progress.completionPercentage === 100 ? 'Review Course' : 'Continue Learning'}
          </a>
        </div>
      </div>
    `).join('');
  }

  // Initialize progress chart
  initChart() {
    const canvas = document.getElementById('progress-chart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const enrolledCount = this.enrolledCourses.length;
    const completedCount = this.enrolledCourses.filter(course => course.progress.completionPercentage === 100).length;
    const inProgressCount = enrolledCount - completedCount;

    // Calculate overall completion percentage
    let totalCompletion = 0;
    this.enrolledCourses.forEach(course => {
      totalCompletion += course.progress.completionPercentage;
    });
    const overallPercentage = enrolledCount > 0 ? Math.round(totalCompletion / enrolledCount) : 0;

    // Update percentage display
    document.getElementById('progress-percentage').textContent = `${overallPercentage}%`;
    document.getElementById('progress-in-progress').textContent = inProgressCount;
    document.getElementById('progress-completed').textContent = completedCount;
    document.getElementById('progress-total').textContent = enrolledCount;

    // Simple donut chart using canvas
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 80;
    const lineWidth = 20;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (enrolledCount === 0) {
      // Draw empty circle
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = '#e5e7eb';
      ctx.stroke();
      return;
    }

    // Draw background circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = '#e5e7eb';
    ctx.stroke();

    // Draw progress arc
    if (overallPercentage > 0) {
      const endAngle = (overallPercentage / 100) * 2 * Math.PI - Math.PI / 2;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, -Math.PI / 2, endAngle);
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = '#ff7a59'; // accent color
      ctx.lineCap = 'round';
      ctx.stroke();
    }
  }

  // Render recent activity
  renderRecentActivity() {
    const container = document.getElementById('recent-activity');
    const emptyState = document.getElementById('activity-empty');

    // Mock recent activities
    const activities = [
      {
        type: 'lesson_completed',
        course: 'Modern JavaScript: From Zero to Production',
        lesson: 'Arrow Functions',
        time: '2 hours ago'
      },
      {
        type: 'course_enrolled',
        course: 'React 18: Complete Guide with TypeScript',
        time: '1 day ago'
      },
      {
        type: 'lesson_completed',
        course: 'Modern JavaScript: From Zero to Production',
        lesson: 'ES6 Modules',
        time: '2 days ago'
      }
    ];

    if (activities.length === 0) {
      if (container) container.style.display = 'none';
      if (emptyState) emptyState.classList.remove('hidden');
      return;
    }

    if (emptyState) emptyState.classList.add('hidden');
    if (container) container.style.display = 'block';

    container.innerHTML = activities.map(activity => {
      let icon, color, text;
      switch (activity.type) {
        case 'lesson_completed':
          icon = 'check-circle';
          color = 'green';
          text = `Completed "${activity.lesson}" in ${activity.course}`;
          break;
        case 'course_enrolled':
          icon = 'book-open';
          color = 'blue';
          text = `Enrolled in ${activity.course}`;
          break;
        default:
          icon = 'clock';
          color = 'gray';
          text = activity.description;
      }

      return `
        <div class="flex items-start space-x-3">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-${color}-100 rounded-full flex items-center justify-center">
              <svg class="w-4 h-4 text-${color}-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${
                  icon === 'check-circle' ? 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' :
                  icon === 'book-open' ? 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' :
                  'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
                }"></path>
              </svg>
            </div>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm text-gray-900">${text}</p>
            <p class="text-xs text-gray-500">${activity.time}</p>
          </div>
        </div>
      `;
    }).join('');
  }

  // Render certificates
  renderCertificates() {
    const container = document.getElementById('certificates');
    const emptyState = document.getElementById('certificates-empty');

    // Get completed courses
    const completedCourses = this.enrolledCourses.filter(course => course.progress.completionPercentage === 100);

    if (completedCourses.length === 0) {
      if (container) container.style.display = 'none';
      if (emptyState) emptyState.classList.remove('hidden');
      return;
    }

    if (emptyState) emptyState.classList.add('hidden');
    if (container) container.style.display = 'grid';

    container.innerHTML = completedCourses.map(course => `
      <div class="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-6 border border-blue-200">
        <div class="flex items-center mb-4">
          <div class="flex-shrink-0">
            <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-lg font-semibold text-gray-900">Certificate of Completion</h3>
            <p class="text-sm text-gray-600">Earned on ${new Date().toLocaleDateString()}</p>
          </div>
        </div>
        <div class="mb-4">
          <h4 class="font-medium text-gray-900 mb-1">${course.title}</h4>
          <p class="text-sm text-gray-600">by ${course.instructor.name}</p>
        </div>
        <div class="flex items-center justify-between">
          <div class="flex items-center text-sm text-gray-600">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            ${course.duration}
          </div>
          <button class="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg font-medium transition-colors">
            Download PDF
          </button>
        </div>
      </div>
    `).join('');
  }

  // Update achievements
  updateAchievements() {
    const achievements = document.getElementById('achievements');
    if (!achievements) return;

    const enrolledCount = this.enrolledCourses.length;
    const completedCount = this.enrolledCourses.filter(course => course.progress.completionPercentage === 100).length;
    const totalLessonsCompleted = this.enrolledCourses.reduce((total, course) =>
      total + (course.progress.completedLessons?.length || 0), 0);

    // Update first achievement (completed first lesson)
    const firstSteps = achievements.children[0];
    if (totalLessonsCompleted > 0) {
      firstSteps.classList.remove('opacity-50');
      const icon = firstSteps.querySelector('.bg-blue-100');
      if (icon) icon.classList.remove('bg-blue-100');
      if (icon) icon.classList.add('bg-blue-500');
      const svg = firstSteps.querySelector('svg');
      if (svg) svg.classList.remove('text-primary');
      if (svg) svg.classList.add('text-white');
    }

    // Update course master achievement (5+ completed courses)
    const courseMaster = achievements.children[1];
    if (completedCount >= 5) {
      courseMaster.classList.remove('opacity-50');
      const icon = courseMaster.querySelector('.bg-gray-100');
      if (icon) icon.classList.remove('bg-gray-100');
      if (icon) icon.classList.add('bg-purple-500');
      const svg = courseMaster.querySelector('svg');
      if (svg) svg.classList.remove('text-gray-400');
      if (svg) svg.classList.add('text-white');
    }

    // Update time master achievement (50+ hours)
    const timeMaster = achievements.children[2];
    const totalHours = this.calculateTotalHours();
    if (totalHours >= 50) {
      timeMaster.classList.remove('opacity-50');
      const icon = timeMaster.querySelector('.bg-gray-100');
      if (icon) icon.classList.remove('bg-gray-100');
      if (icon) icon.classList.add('bg-orange-500');
      const svg = timeMaster.querySelector('svg');
      if (svg) svg.classList.remove('text-gray-400');
      if (svg) svg.classList.add('text-white');
    }

    // Update perfectionist achievement (all 5-star ratings - mock)
    const perfectionist = achievements.children[3];
    const avgRating = this.enrolledCourses.length > 0 ?
      this.enrolledCourses.reduce((sum, course) => sum + course.rating, 0) / this.enrolledCourses.length : 0;
    if (avgRating >= 4.8) {
      perfectionist.classList.remove('opacity-50');
      const icon = perfectionist.querySelector('.bg-gray-100');
      if (icon) icon.classList.remove('bg-gray-100');
      if (icon) icon.classList.add('bg-yellow-500');
      const svg = perfectionist.querySelector('svg');
      if (svg) svg.classList.remove('text-gray-400');
      if (svg) svg.classList.add('text-white');
    }
  }

  // Initialize event listeners
  initEventListeners() {
    // Profile button
    const profileButton = document.getElementById('profile-button');
    if (profileButton) {
      profileButton.addEventListener('click', () => {
        // Could navigate to profile page or show profile modal
        storage.showToast('Profile page coming soon!', 'info');
      });
    }

    // Certificate download buttons
    const downloadButtons = document.querySelectorAll('#certificates button');
    downloadButtons.forEach(button => {
      button.addEventListener('click', () => {
        storage.showToast('Certificate download feature coming soon!', 'info');
      });
    });
  }
}

// Initialize the dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const dashboard = new Dashboard();
  dashboard.init();
});
