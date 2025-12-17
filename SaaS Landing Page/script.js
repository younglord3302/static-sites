// Advanced SaaS Landing Page JavaScript
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 TaskFlow Advanced Landing Page Loaded Successfully!');

    // Initialize all components
    initializeSmoothScrolling();
    initializeMobileMenu();
    initializeABTesting();
    initializeSwiper();
    initializePricingCalculator();
    initializeFAQAccordion();
    initializeAnimations();
    initializeScrollEffects();
    initializeButtonEffects();

    // Track page load for analytics
    trackPageLoad();
});

// Smooth scrolling for navigation links
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80; // Account for fixed header
                const elementPosition = target.offsetTop;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Mobile menu functionality
function initializeMobileMenu() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');

            // Toggle hamburger icon
            const icon = mobileMenuButton.querySelector('svg');
            if (icon) {
                icon.innerHTML = mobileMenu.classList.contains('hidden')
                    ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />'
                    : '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />';
            }
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenuButton.contains(e.target) && !mobileMenu.contains(e.target)) {
                mobileMenu.classList.add('hidden');
                const icon = mobileMenuButton.querySelector('svg');
                if (icon) {
                    icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />';
                }
            }
        });
    }
}

// A/B Testing functionality
function initializeABTesting() {
    const toggleButton = document.getElementById('toggleVariant');
    const heroA = document.getElementById('hero-a');
    const heroB = document.getElementById('hero-b');

    if (toggleButton && heroA && heroB) {
        toggleButton.addEventListener('click', () => {
            const isShowingA = heroA.classList.contains('hero-variant-a');

            if (isShowingA) {
                // Switch to B
                heroA.classList.remove('hero-variant-a');
                heroA.classList.add('hero-variant-b');
                heroB.classList.remove('hero-variant-b');
                heroB.classList.add('hero-variant-a');
                toggleButton.textContent = 'A/B Test (B)';
                trackABTestVariant('B');
            } else {
                // Switch to A
                heroB.classList.remove('hero-variant-a');
                heroB.classList.add('hero-variant-b');
                heroA.classList.remove('hero-variant-b');
                heroA.classList.add('hero-variant-a');
                toggleButton.textContent = 'A/B Test';
                trackABTestVariant('A');
            }
        });
    }

    // Set default variant based on user preferences or random
    const defaultVariant = getABTestVariant();
    if (defaultVariant === 'B' && heroA && heroB) {
        heroA.classList.remove('hero-variant-a');
        heroA.classList.add('hero-variant-b');
        heroB.classList.remove('hero-variant-b');
        heroB.classList.add('hero-variant-a');
        toggleButton.textContent = 'A/B Test (B)';
    }
}

// Get A/B test variant (could be based on user ID, random, etc.)
function getABTestVariant() {
    // For demo purposes, alternate based on time
    const isEvenMinute = new Date().getMinutes() % 2 === 0;
    return isEvenMinute ? 'B' : 'A';
}

// Track A/B test variant selection
function trackABTestVariant(variant) {
    console.log(`🎯 A/B Test: Showing variant ${variant}`);
    // In production, send to analytics service
    // Example: gtag('event', 'ab_test_variant', { variant: variant });
}

// Swiper initialization for testimonials
function initializeSwiper() {
    if (typeof Swiper !== 'undefined') {
        const testimonialsSwiper = new Swiper('.testimonialsSwiper', {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            breakpoints: {
                768: {
                    slidesPerView: 2,
                    spaceBetween: 40,
                },
                1024: {
                    slidesPerView: 3,
                    spaceBetween: 50,
                },
            },
            on: {
                slideChange: function () {
                    trackSwiperInteraction('testimonial', this.realIndex);
                }
            }
        });
    } else {
        console.warn('Swiper.js not loaded');
    }
}

// Track Swiper interactions
function trackSwiperInteraction(type, index) {
    console.log(`📱 Swiper ${type} slide changed to: ${index}`);
    // In production, send to analytics
}

// Pricing calculator functionality
function initializePricingCalculator() {
    const teamSizeSlider = document.getElementById('teamSize');
    const teamSizeValue = document.getElementById('teamSizeValue');
    const calculatedPrice = document.getElementById('calculatedPrice');
    const proPrice = document.getElementById('proPrice');
    const savingsText = document.getElementById('savingsText');

    if (teamSizeSlider && teamSizeValue && calculatedPrice) {
        const updatePricing = () => {
            const teamSize = parseInt(teamSizeSlider.value);
            teamSizeValue.textContent = `${teamSize} members`;

            // Calculate pricing based on team size
            let basePrice = 29;
            let discount = 0;

            if (teamSize >= 25) {
                discount = 0.2; // 20% discount for larger teams
            } else if (teamSize >= 15) {
                discount = 0.1; // 10% discount for medium teams
            }

            const finalPrice = Math.round(basePrice * (1 - discount));
            const monthlyTotal = finalPrice * teamSize;
            const competitorPrice = 49 * teamSize; // Assume competitor pricing
            const savings = competitorPrice - monthlyTotal;

            calculatedPrice.textContent = `$${monthlyTotal}`;
            proPrice.textContent = finalPrice;

            if (savings > 0) {
                savingsText.textContent = `Save $${savings}/month vs. competitors`;
                savingsText.style.color = '#10b981'; // Green
            } else {
                savingsText.textContent = 'Best value for your team size';
                savingsText.style.color = '#6b7280'; // Gray
            }

            trackPricingCalculation(teamSize, finalPrice);
        };

        teamSizeSlider.addEventListener('input', updatePricing);
        updatePricing(); // Initialize
    }
}

// Track pricing calculator usage
function trackPricingCalculation(teamSize, price) {
    console.log(`💰 Pricing calculated: ${teamSize} members at $${price}/month`);
    // In production, send to analytics
}

// FAQ accordion functionality
function initializeFAQAccordion() {
    document.querySelectorAll('.faq-toggle').forEach(button => {
        button.addEventListener('click', () => {
            const content = button.nextElementSibling;
            const icon = button.querySelector('svg');

            // Toggle content visibility
            content.classList.toggle('hidden');

            // Toggle icon rotation
            if (icon) {
                icon.style.transform = content.classList.contains('hidden')
                    ? 'rotate(0deg)'
                    : 'rotate(180deg)';
            }

            // Close other FAQs
            document.querySelectorAll('.faq-content').forEach(otherContent => {
                if (otherContent !== content && !otherContent.classList.contains('hidden')) {
                    otherContent.classList.add('hidden');
                    const otherButton = otherContent.previousElementSibling;
                    const otherIcon = otherButton.querySelector('svg');
                    if (otherIcon) {
                        otherIcon.style.transform = 'rotate(0deg)';
                    }
                }
            });

            trackFAQInteraction(button.textContent.trim());
        });
    });
}

// Track FAQ interactions
function trackFAQInteraction(question) {
    console.log(`❓ FAQ opened: ${question}`);
    // In production, send to analytics
}

// Scroll-triggered animations
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.animate-fade-in').forEach(element => {
        observer.observe(element);
    });
}

// Header scroll effects
function initializeScrollEffects() {
    const nav = document.querySelector('nav');
    let lastScrollTop = 0;

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Add/remove background blur on scroll
        if (scrollTop > 50) {
            nav.classList.add('backdrop-blur-md', 'bg-white/95');
        } else {
            nav.classList.remove('backdrop-blur-md', 'bg-white/95');
        }

        // Hide/show header on scroll (mobile optimization)
        if (window.innerWidth < 768) {
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                nav.style.transform = 'translateY(-100%)';
            } else {
                nav.style.transform = 'translateY(0)';
            }
        }

        lastScrollTop = scrollTop;
    });
}

// Button effects and interactions
function initializeButtonEffects() {
    // Enhanced button hover effects
    document.querySelectorAll('button, .btn').forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-2px) scale(1.02)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0) scale(1)';
        });

        button.addEventListener('mousedown', () => {
            button.style.transform = 'translateY(0) scale(0.98)';
        });

        button.addEventListener('mouseup', () => {
            button.style.transform = 'translateY(-2px) scale(1.02)';
        });
    });

    // CTA button click tracking
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', () => {
            if (button.textContent.includes('Start') || button.textContent.includes('Trial')) {
                trackConversion('trial_signup');
            } else if (button.textContent.includes('Demo')) {
                trackConversion('demo_request');
            } else if (button.textContent.includes('Contact')) {
                trackConversion('contact_request');
            }
        });
    });
}

// Track conversions
function trackConversion(type) {
    console.log(`🎯 Conversion: ${type}`);
    // In production, send to analytics
    // Example: gtag('event', 'conversion', { type: type });
}

// Track page load analytics
function trackPageLoad() {
    // Simulate page view tracking
    console.log('📊 Page loaded - TaskFlow Landing Page');

    // In production, initialize analytics
    // Example: gtag('config', 'GA_MEASUREMENT_ID');

    // Track initial A/B test variant
    const currentVariant = document.querySelector('.hero-variant-a:not(.hero-variant-b)') ? 'A' : 'B';
    trackABTestVariant(currentVariant);
}

// Performance monitoring
function initializePerformanceMonitoring() {
    // Monitor Core Web Vitals
    if ('web-vitals' in window) {
        import('https://unpkg.com/web-vitals@3.1.1/dist/web-vitals.es5.min.js').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
            getCLS(console.log);
            getFID(console.log);
            getFCP(console.log);
            getLCP(console.log);
            getTTFB(console.log);
        });
    }
}

// Error handling
window.addEventListener('error', (event) => {
    console.error('🚨 JavaScript Error:', event.error);
    // In production, send to error tracking service
});

// Service Worker registration (for PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Register service worker for offline functionality
        // navigator.serviceWorker.register('/sw.js');
    });
}

// Accessibility improvements
function initializeAccessibility() {
    // Add keyboard navigation support
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            // Close mobile menu if open
            const mobileMenu = document.getElementById('mobile-menu');
            if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
            }
        }
    });

    // Add focus indicators for keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });

    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-navigation');
    });
}

// Initialize accessibility features
initializeAccessibility();

// Performance monitoring
initializePerformanceMonitoring();

// Lazy loading for images (if any)
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Export functions for potential use in other scripts
window.TaskFlow = {
    trackConversion,
    trackABTestVariant,
    getABTestVariant
};
