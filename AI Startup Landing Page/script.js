// Mobile Menu Toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mobileMenu = document.querySelector('.mobile-menu');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');

    // Change icon
    const icon = mobileMenuBtn.querySelector('i');
    if (mobileMenu.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
});

// Close mobile menu when clicking a link
const mobileLinks = document.querySelectorAll('.mobile-menu a');
mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        const icon = mobileMenuBtn.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Form submission for CTA
const ctaForm = document.querySelector('.cta-form');
if (ctaForm) {
    const emailInput = document.getElementById('cta-email');
    const submitBtn = ctaForm.querySelector('.btn-primary');

    ctaForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const email = emailInput.value.trim();

        if (!email) {
            alert('Please enter your email address');
            return;
        }

        if (!isValidEmail(email)) {
            alert('Please enter a valid email address');
            return;
        }

        // Show loading state
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        submitBtn.disabled = true;

        // Simulate form submission
        setTimeout(() => {
            alert(`Thank you! A demo link has been sent to ${email}`);
            emailInput.value = '';

            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 1500);
    });
}

// Email validation helper
function isValidEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

// Animate chart bars on scroll
const chartBars = document.querySelectorAll('.chart-bar');
const observerOptions = {
    threshold: 0.5
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Animate each bar with a slight delay
            chartBars.forEach((bar, index) => {
                setTimeout(() => {
                    bar.style.height = bar.style.height; // Trigger reflow
                }, index * 200);
            });
        }
    });
}, observerOptions);

const chartContainer = document.querySelector('.chart-container');
if (chartContainer) {
    observer.observe(chartContainer);
}

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
    } else {
        navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.05)';
    }
});

// Testimonial carousel functionality (optional enhancement)
let testimonialIndex = 0;
const testimonialCards = document.querySelectorAll('.testimonial-card');

function showNextTestimonial() {
    testimonialCards[testimonialIndex].classList.remove('active');
    testimonialIndex = (testimonialIndex + 1) % testimonialCards.length;
    testimonialCards[testimonialIndex].classList.add('active');
}

// Uncomment below to enable auto-rotating testimonials
// setInterval(showNextTestimonial, 5000);
