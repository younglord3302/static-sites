// Lesson player functionality

import { storage } from '../js/storage.js';

class LessonPlayer {
  constructor() {
    this.courseId = null;
    this.lessonId = null;
    this.course = null;
    this.currentLesson = null;
    this.allLessons = [];
    this.currentLessonIndex = -1;
    this.courses = [];
  }

  // Initialize the lesson player
  async init() {
    // Get course and lesson IDs from URL
    const urlParams = new URLSearchParams(window.location.search);
    this.courseId = urlParams.get('course');
    this.lessonId = urlParams.get('lesson');

    if (!this.courseId || !this.lessonId) {
      this.showError('Lesson not found');
      return;
    }

    // Load courses data
    await this.loadCourses();

    // Find the course and lesson
    this.course = this.courses.find(c => c.id === this.courseId);
    if (!this.course) {
      this.showError('Course not found');
      return;
    }

    // Build flat array of all lessons
    this.buildLessonArray();

    // Find current lesson
    this.currentLessonIndex = this.allLessons.findIndex(l => l.id === this.lessonId);
    if (this.currentLessonIndex === -1) {
      this.showError('Lesson not found');
      return;
    }

    this.currentLesson = this.allLessons[this.currentLessonIndex];

    // Render lesson content
    this.renderLesson();
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

  // Build flat array of all lessons with section info
  buildLessonArray() {
    this.allLessons = [];
    this.course.curriculum.forEach(section => {
      section.lessons.forEach(lesson => {
        this.allLessons.push({
          ...lesson,
          sectionTitle: section.section,
          sectionIndex: this.course.curriculum.indexOf(section)
        });
      });
    });
  }

  // Show error message
  showError(message) {
    const content = document.getElementById('lesson-content');
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

  // Render lesson content
  renderLesson() {
    const skeleton = document.getElementById('loading-skeleton');
    const content = document.getElementById('lesson-content');

    // Hide skeleton and show content
    if (skeleton) skeleton.style.display = 'none';
    if (content) content.classList.remove('hidden');

    // Update page title
    document.title = `${this.currentLesson.title} - LearnHub`;
    const pageTitle = document.getElementById('page-title');
    if (pageTitle) pageTitle.textContent = `${this.currentLesson.title} - LearnHub`;

    // Update breadcrumb
    this.updateBreadcrumb();

    // Update header
    this.updateLessonHeader();

    // Update progress
    this.updateProgress();

    // Update sidebar
    this.updateSidebar();

    // Render lesson navigation
    this.renderLessonNavigation();

    // Render transcript
    this.renderTranscript();

    // Render resources
    this.renderResources();

    // Load saved notes
    this.loadSavedNotes();
  }

  // Update breadcrumb navigation
  updateBreadcrumb() {
    const courseLink = document.getElementById('course-link');
    const lessonTitle = document.getElementById('lesson-title');

    if (courseLink) {
      courseLink.textContent = this.course.title;
      courseLink.href = `/course.html?id=${this.course.id}`;
    }

    if (lessonTitle) {
      lessonTitle.textContent = this.currentLesson.title;
    }
  }

  // Update lesson header
  updateLessonHeader() {
    const title = document.getElementById('lesson-header-title');
    const description = document.getElementById('lesson-header-description');
    const duration = document.getElementById('lesson-duration');

    if (title) title.textContent = this.currentLesson.title;
    if (description) description.textContent = `Learn about ${this.currentLesson.title.toLowerCase()} in this comprehensive lesson.`;
    if (duration) duration.textContent = this.currentLesson.duration;

    // Update header progress
    const currentLessonNum = document.getElementById('current-lesson');
    const totalLessonsNum = document.getElementById('total-lessons');
    const lessonProgressBar = document.getElementById('lesson-progress-bar');

    if (currentLessonNum) currentLessonNum.textContent = this.currentLessonIndex + 1;
    if (totalLessonsNum) totalLessonsNum.textContent = this.allLessons.length;
    if (lessonProgressBar) {
      const progress = ((this.currentLessonIndex + 1) / this.allLessons.length) * 100;
      lessonProgressBar.style.width = `${progress}%`;
    }
  }

  // Update course progress
  updateProgress() {
    const progress = storage.getProgress()[this.course.id] || {};
    const completedLessons = progress.completedLessons || [];
    const totalLessons = this.allLessons.length;
    const completedCount = completedLessons.length;
    const percentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

    const progressText = document.getElementById('course-progress-text');
    const progressBar = document.getElementById('course-progress-bar');
    const lessonsCompleted = document.getElementById('lessons-completed');
    const totalCourseLessons = document.getElementById('total-course-lessons');

    if (progressText) progressText.textContent = `${percentage}% Complete`;
    if (progressBar) progressBar.style.width = `${percentage}%`;
    if (lessonsCompleted) lessonsCompleted.textContent = `${completedCount} lessons completed`;
    if (totalCourseLessons) totalCourseLessons.textContent = `${totalLessons} total lessons`;
  }

  // Update sidebar information
  updateSidebar() {
    const instructor = document.getElementById('sidebar-instructor');
    const duration = document.getElementById('sidebar-duration');
    const level = document.getElementById('sidebar-level');
    const rating = document.getElementById('sidebar-rating');

    if (instructor) instructor.textContent = this.course.instructor.name;
    if (duration) duration.textContent = this.course.duration;
    if (level) level.textContent = this.course.level;
    if (rating) rating.textContent = `${this.course.rating} ★`;

    // Update back to course button
    const backBtn = document.getElementById('back-to-course-btn');
    if (backBtn) {
      backBtn.href = `/course.html?id=${this.course.id}`;
    }
  }

  // Render lesson navigation sidebar
  renderLessonNavigation() {
    const navigation = document.getElementById('lesson-navigation');
    if (!navigation) return;

    let currentSection = '';
    let html = '';

    this.allLessons.forEach((lesson, index) => {
      // Add section header if new section
      if (lesson.sectionTitle !== currentSection) {
        if (currentSection !== '') {
          html += '</div>'; // Close previous section
        }
        html += `
          <div class="px-4 py-2 bg-gray-50 border-b border-gray-200">
            <h4 class="text-sm font-medium text-gray-900">${lesson.sectionTitle}</h4>
          </div>
          <div class="divide-y divide-gray-100">
        `;
        currentSection = lesson.sectionTitle;
      }

      const progress = storage.getProgress()[this.course.id] || {};
      const isCompleted = progress.completedLessons?.includes(lesson.id);
      const isCurrent = index === this.currentLessonIndex;
      const isLocked = lesson.locked;

      html += `
        <button class="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
          isCurrent ? 'bg-blue-50 border-l-4 border-primary' : ''
        } ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}" 
                onclick="${isLocked ? '' : `navigateToLesson('${lesson.id}')`}"
                ${isLocked ? 'disabled' : ''}>
          <div class="flex items-center space-x-3">
            <div class="lesson-status w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
              isCompleted ? 'bg-green-500 border-green-500' :
              isLocked ? 'border-gray-300' : 'border-primary'
            }">
              ${isCompleted ? '✓' : isLocked ? '🔒' : '○'}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 truncate ${
                isCurrent ? 'text-primary' : ''
              }">${lesson.title}</p>
              <p class="text-xs text-gray-600">${lesson.duration}</p>
            </div>
          </div>
        </button>
      `;
    });

    if (currentSection !== '') {
      html += '</div>'; // Close last section
    }

    navigation.innerHTML = html;
  }

  // Render transcript
  renderTranscript() {
    const transcriptContent = document.getElementById('transcript-content');
    if (!transcriptContent) return;

    // Mock transcript data
    const transcript = [
      { time: '00:00', speaker: 'Instructor', text: 'Welcome to this lesson on modern JavaScript fundamentals.' },
      { time: '00:15', speaker: 'Instructor', text: 'In this lesson, we\'ll cover the core concepts that form the foundation of modern JavaScript development.' },
      { time: '00:32', speaker: 'Instructor', text: 'Let\'s start by understanding what ES6 brought to the JavaScript language.' },
      { time: '00:48', speaker: 'Instructor', text: 'One of the most important features is the let and const keywords for variable declaration.' },
      { time: '01:05', speaker: 'Instructor', text: 'Unlike var, let and const provide block scope, which helps prevent many common JavaScript bugs.' },
      { time: '01:22', speaker: 'Instructor', text: 'Let me show you an example of how block scope works in practice.' },
      { time: '01:45', speaker: 'Instructor', text: 'Arrow functions are another major feature introduced in ES6.' },
      { time: '02:02', speaker: 'Instructor', text: 'They provide a more concise syntax for writing function expressions.' },
      { time: '02:18', speaker: 'Instructor', text: 'Arrow functions also have different behavior with the this keyword.' },
      { time: '02:35', speaker: 'Instructor', text: 'Template literals make string interpolation much easier and more readable.' },
      { time: '02:52', speaker: 'Instructor', text: 'You can embed expressions directly in strings using backticks and ${} syntax.' }
    ];

    transcriptContent.innerHTML = transcript.map(item => `
      <div class="flex space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer transcript-item" data-time="${item.time}">
        <div class="text-sm text-gray-500 font-mono flex-shrink-0 w-12">${item.time}</div>
        <div class="flex-1">
          <div class="text-sm font-medium text-gray-900 mb-1">${item.speaker}</div>
          <div class="text-gray-700 leading-relaxed">${item.text}</div>
        </div>
      </div>
    `).join('');

    // Add click handlers for transcript navigation
    this.initTranscriptEventListeners();
  }

  // Render resources
  renderResources() {
    const resourcesContent = document.getElementById('resources-content');
    if (!resourcesContent) return;

    // Mock resources
    const resources = [
      {
        type: 'pdf',
        title: 'JavaScript Cheat Sheet',
        description: 'Comprehensive reference guide for JavaScript syntax and methods',
        url: '#',
        size: '2.3 MB'
      },
      {
        type: 'link',
        title: 'MDN JavaScript Documentation',
        description: 'Official Mozilla Developer Network JavaScript reference',
        url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
        external: true
      },
      {
        type: 'code',
        title: 'Lesson Source Code',
        description: 'Downloadable code examples from this lesson',
        url: '#',
        size: '156 KB'
      }
    ];

    resourcesContent.innerHTML = resources.map(resource => `
      <div class="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
        <div class="flex items-start space-x-4">
          <div class="flex-shrink-0">
            ${resource.type === 'pdf' ? `
              <svg class="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.5 2H15.5L19 5.5V22H5V2H8.5ZM15 3.5V7H18.5L15 3.5ZM7 4V20H17V9H13V4H7ZM9 12H11V18H9V12ZM13 10H15V18H13V10Z"/>
              </svg>
            ` : resource.type === 'link' ? `
              <svg class="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
              </svg>
            ` : `
              <svg class="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
              </svg>
            `}
          </div>
          <div class="flex-1 min-w-0">
            <h4 class="text-lg font-medium text-gray-900 mb-1">${resource.title}</h4>
            <p class="text-gray-600 mb-3">${resource.description}</p>
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4 text-sm text-gray-500">
                ${resource.size ? `<span>${resource.size}</span>` : ''}
                ${resource.external ? `<span class="flex items-center"><svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>External Link</span>` : ''}
              </div>
              <a href="${resource.url}"
                 ${resource.external ? 'target="_blank" rel="noopener noreferrer"' : ''}
                 class="inline-flex items-center px-4 py-2 bg-primary hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
                ${resource.type === 'link' ? 'Visit' : 'Download'}
                ${resource.external ? '<svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>' : ''}
              </a>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  }

  // Initialize event listeners
  initEventListeners() {
    // Tab switching
    const tabs = document.querySelectorAll('.lesson-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        this.switchTab(tab.dataset.tab);
      });
    });

    // Mark complete button
    const markCompleteBtn = document.getElementById('mark-complete-btn');
    if (markCompleteBtn) {
      markCompleteBtn.addEventListener('click', () => {
        this.markLessonComplete();
      });
    }

    // Navigation buttons
    const prevBtn = document.getElementById('prev-lesson-btn');
    const nextBtn = document.getElementById('next-lesson-btn');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        this.navigateToPreviousLesson();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        this.navigateToNextLesson();
      });
    }

    // Save notes button
    const saveNotesBtn = document.getElementById('save-notes-btn');
    if (saveNotesBtn) {
      saveNotesBtn.addEventListener('click', () => {
        this.saveNotes();
      });
    }

    // Video play button
    const playBtn = document.getElementById('play-video-btn');
    if (playBtn) {
      playBtn.addEventListener('click', () => {
        this.playVideo();
      });
    }

    // Update navigation buttons
    this.updateNavigationButtons();
  }

  // Initialize transcript event listeners
  initTranscriptEventListeners() {
    const transcriptItems = document.querySelectorAll('.transcript-item');
    transcriptItems.forEach(item => {
      item.addEventListener('click', () => {
        const time = item.dataset.time;
        this.seekToTime(time);
      });
    });
  }

  // Switch between tabs
  switchTab(tabName) {
    // Update tab buttons
    const tabs = document.querySelectorAll('.lesson-tab');
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
    const contents = document.querySelectorAll('.lesson-tab-content');
    contents.forEach(content => {
      if (content.id === `${tabName}-tab`) {
        content.classList.remove('hidden');
      } else {
        content.classList.add('hidden');
      }
    });
  }

  // Update navigation buttons
  updateNavigationButtons() {
    const prevBtn = document.getElementById('prev-lesson-btn');
    const nextBtn = document.getElementById('next-lesson-btn');
    const prevTitle = document.getElementById('prev-lesson-title');
    const nextTitle = document.getElementById('next-lesson-title');

    const hasPrev = this.currentLessonIndex > 0;
    const hasNext = this.currentLessonIndex < this.allLessons.length - 1;

    if (prevBtn) {
      prevBtn.disabled = !hasPrev;
      prevBtn.classList.toggle('opacity-50', !hasPrev);
      prevBtn.classList.toggle('cursor-not-allowed', !hasPrev);
    }

    if (nextBtn) {
      nextBtn.disabled = !hasNext;
      if (!hasNext) {
        nextBtn.textContent = 'Complete Course';
        nextBtn.className = 'w-full text-left px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors';
      }
    }

    if (prevTitle && hasPrev) {
      prevTitle.textContent = this.allLessons[this.currentLessonIndex - 1].title;
    }

    if (nextTitle && hasNext) {
      nextTitle.textContent = this.allLessons[this.currentLessonIndex + 1].title;
    }
  }

  // Mark lesson as complete
  markLessonComplete() {
    const progress = storage.getProgress();
    if (!progress[this.course.id]) {
      progress[this.course.id] = { completedLessons: [], completionPercentage: 0 };
    }

    const courseProgress = progress[this.course.id];
    if (!courseProgress.completedLessons.includes(this.currentLesson.id)) {
      courseProgress.completedLessons.push(this.currentLesson.id);

      // Recalculate completion percentage
      const totalLessons = this.allLessons.length;
      const completedCount = courseProgress.completedLessons.length;
      courseProgress.completionPercentage = Math.round((completedCount / totalLessons) * 100);

      storage.saveProgress(progress);

      // Update UI
      this.updateProgress();
      this.renderLessonNavigation();

      const markCompleteBtn = document.getElementById('mark-complete-btn');
      if (markCompleteBtn) {
        markCompleteBtn.textContent = 'Completed ✓';
        markCompleteBtn.className = 'bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium transition-colors';
        markCompleteBtn.disabled = true;
      }

      storage.showToast('Lesson marked as complete!', 'success');
    }
  }

  // Navigate to lesson
  navigateToLesson(lessonId) {
    const lessonIndex = this.allLessons.findIndex(l => l.id === lessonId);
    if (lessonIndex !== -1) {
      this.currentLessonIndex = lessonIndex;
      this.currentLesson = this.allLessons[lessonIndex];
      this.lessonId = lessonId;

      // Update URL
      const url = new URL(window.location);
      url.searchParams.set('lesson', lessonId);
      window.history.pushState({}, '', url);

      // Re-render
      this.renderLesson();
    }
  }

  // Navigate to previous lesson
  navigateToPreviousLesson() {
    if (this.currentLessonIndex > 0) {
      this.navigateToLesson(this.allLessons[this.currentLessonIndex - 1].id);
    }
  }

  // Navigate to next lesson
  navigateToNextLesson() {
    if (this.currentLessonIndex < this.allLessons.length - 1) {
      this.navigateToLesson(this.allLessons[this.currentLessonIndex + 1].id);
    } else {
      // Course completed
      storage.showToast('Congratulations! You\'ve completed the course!', 'success');
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 2000);
    }
  }

  // Play video (mock)
  playVideo() {
    const placeholder = document.getElementById('video-placeholder');
    const video = document.getElementById('lesson-video');

    if (placeholder && video) {
      placeholder.classList.add('hidden');
      video.classList.remove('hidden');

      // Mock video content - in a real app, this would load actual video
      storage.showToast('Video player would start here', 'info');
    }
  }

  // Seek to time in video (mock)
  seekToTime(time) {
    // In a real app, this would seek the video to the specified time
    storage.showToast(`Seeking to ${time}`, 'info');
  }

  // Load saved notes
  loadSavedNotes() {
    const notesTextarea = document.getElementById('lesson-notes');
    if (notesTextarea) {
      const savedNotes = storage.getNotes(`${this.course.id}-${this.lessonId}`);
      if (savedNotes) {
        notesTextarea.value = savedNotes;
      }
    }
  }

  // Save notes
  saveNotes() {
    const notesTextarea = document.getElementById('lesson-notes');
    if (notesTextarea) {
      const notes = notesTextarea.value.trim();
      if (notes) {
        storage.saveNotes(`${this.course.id}-${this.lessonId}`, notes);
        storage.showToast('Notes saved successfully!', 'success');
      } else {
        storage.showToast('Please write some notes first', 'warning');
      }
    }
  }
}

// Global navigation function
window.navigateToLesson = function(lessonId) {
  // This will be called from the lesson navigation HTML
  // The lesson player instance will handle this
};

// Initialize the lesson player when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const lessonPlayer = new LessonPlayer();
  lessonPlayer.init();
});
