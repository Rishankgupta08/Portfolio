// DOM Elements
const navbar = document.querySelector('.navbar');
const navLinks = document.querySelectorAll('.nav-link');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const backToTopBtn = document.getElementById('backToTop');
const contactForm = document.getElementById('contactForm');
const sections = document.querySelectorAll('section');

// Mobile Navigation Toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Navbar Background on Scroll
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(10, 10, 10, 0.95)';
    } else {
        navbar.style.background = 'rgba(10, 10, 10, 0.9)';
    }
});

// Active Navigation Link
function updateActiveNavLink() {
    const scrollPosition = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', updateActiveNavLink);

// Back to Top Button
window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        backToTopBtn.classList.add('show');
    } else {
        backToTopBtn.classList.remove('show');
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Smooth Scrolling for Navigation Links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 70;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('loaded');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.skill-category, .project-card, .about-content, .contact-content');
    animatedElements.forEach(el => {
        el.classList.add('loading');
        observer.observe(el);
    });
});

// Typing Animation for Hero Title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';

    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }

    type();
}

// Initialize typing animation when page loads
window.addEventListener('load', () => {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.innerHTML;
        typeWriter(heroTitle, originalText, 50);
    }
});

// Contact Form Handling
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;

    try {
        // 👇 Yaha EmailJS call aayega
        await emailjs.sendForm(
            "service_qazi1g2",     // apna service ID daalo
            "template_p2z8qyg",    // apna template ID daalo
            contactForm,           // ye form ka reference hai
            "TeTkBfazej3pN5vTw"      // apna public key daalo
        );

        // Show success message
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
        submitBtn.style.background = '#27ca3f';

        // Reset form
        contactForm.reset();

        // Show success notification
        showNotification("Message sent successfully! I'll get back to you soon.", "success");

        // Reset button after 3 seconds
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            submitBtn.style.background = '';
        }, 3000);

    } catch (error) {
        // Show error message
        submitBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Try Again';
        submitBtn.style.background = '#ff6b6b';

        showNotification("Something went wrong. Please try again.", "error");

        // Reset button after 3 seconds
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            submitBtn.style.background = '';
        }, 3000);

        console.error("EmailJS Error:", error);
    }
});
// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;

    document.body.appendChild(notification);

    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 100);

    // Remove notification after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Particle Animation Background
function createParticles() {
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles';
    document.body.appendChild(particlesContainer);

    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 20 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        particlesContainer.appendChild(particle);
    }
}

// Skills Animation
function animateSkills() {
    const skillItems = document.querySelectorAll('.skill-item');

    skillItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
        item.classList.add('skill-animate');
    });
}

// Project Cards Hover Effect
function initProjectCards() {
    const projectCards = document.querySelectorAll('.project-card');

    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) rotateX(5deg)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) rotateX(0)';
        });
    });
}

// Parallax Effect for Hero Section
function initParallax() {
    const heroVisual = document.querySelector('.hero-visual');

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;

        if (heroVisual) {
            heroVisual.style.transform = `translateY(${rate}px)`;
        }
    });
}

// Text Reveal Animation
function initTextReveal() {
    const textElements = document.querySelectorAll('.hero-title, .hero-subtitle, .hero-description');

    textElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';

        setTimeout(() => {
            element.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 200);
    });
}

// Initialize all animations and effects
document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    initProjectCards();
    initParallax();

    // Delay text reveal for better effect
    setTimeout(initTextReveal, 500);

    // Initialize skill animations when skills section is visible
    const skillsSection = document.querySelector('.skills');
    if (skillsSection) {
        observer.observe(skillsSection);
        skillsSection.addEventListener('animationstart', animateSkills);
    }
});

// Cursor Trail Effect
let mouseX = 0;
let mouseY = 0;
let trailElements = [];

function createCursorTrail() {
    for (let i = 0; i < 10; i++) {
        const trail = document.createElement('div');
        trail.className = 'cursor-trail';
        trail.style.position = 'fixed';
        trail.style.width = '4px';
        trail.style.height = '4px';
        trail.style.background = 'var(--accent-primary)';
        trail.style.borderRadius = '50%';
        trail.style.pointerEvents = 'none';
        trail.style.zIndex = '9999';
        trail.style.opacity = '0';
        document.body.appendChild(trail);
        trailElements.push(trail);
    }
}

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function updateCursorTrail() {
    trailElements.forEach((trail, index) => {
        setTimeout(() => {
            trail.style.left = mouseX + 'px';
            trail.style.top = mouseY + 'px';
            trail.style.opacity = (10 - index) / 10;
            trail.style.transform = `scale(${(10 - index) / 10})`;
        }, index * 20);
    });

    requestAnimationFrame(updateCursorTrail);
}

// Initialize cursor trail on desktop only
if (window.innerWidth > 768) {
    createCursorTrail();
    updateCursorTrail();
}

// Performance optimization: Throttle scroll events
function throttle(func, limit) {
    let inThrottle;
    return function () {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Apply throttling to scroll events
window.addEventListener('scroll', throttle(() => {
    updateActiveNavLink();
}, 100));

// Preload critical resources
function preloadResources() {
    const criticalResources = [
        'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap',
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
    ];

    criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'style';
        link.href = resource;
        document.head.appendChild(link);
    });
}

// Initialize preloading
preloadResources();

// Add custom CSS for additional animations
const additionalStyles = `
.particles {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: -1;
}

.particle {
    position: absolute;
    width: 2px;
    height: 2px;
    background: var(--accent-primary);
    border-radius: 50%;
    opacity: 0.3;
    animation: float-particle linear infinite;
}

@keyframes float-particle {
    0% {
        transform: translateY(100vh) translateX(0);
        opacity: 0;
    }
    10% {
        opacity: 0.3;
    }
    90% {
        opacity: 0.3;
    }
    100% {
        transform: translateY(-100px) translateX(100px);
        opacity: 0;
    }
}

.skill-animate {
    animation: skillPop 0.6s ease forwards;
}

@keyframes skillPop {
    0% {
        opacity: 0;
        transform: scale(0.8) translateY(20px);
    }
    100% {
        opacity: 1;
        transform: scale(1) translateY(0);
    }
}

.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    border-radius: 12px;
    padding: 16px 20px;
    backdrop-filter: blur(20px);
    box-shadow: var(--glass-shadow);
    display: flex;
    align-items: center;
    gap: 12px;
    transform: translateX(400px);
    transition: var(--transition);
    z-index: 10000;
    max-width: 300px;
}

.notification.show {
    transform: translateX(0);
}

.notification-success {
    border-left: 4px solid #27ca3f;
}

.notification-error {
    border-left: 4px solid #ff6b6b;
}

.notification i {
    font-size: 18px;
}

.notification-success i {
    color: #27ca3f;
}

.notification-error i {
    color: #ff6b6b;
}

.cursor-trail {
    transition: all 0.1s ease;
}

/* Enhanced Glassmorphism */
.glass-card {
    position: relative;
    overflow: hidden;
}

.glass-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%);
    transform: translateX(-100%);
    transition: transform 0.6s ease;
}

.glass-card:hover::before {
    transform: translateX(100%);
}

/* Enhanced Button Effects */
.btn {
    position: relative;
    overflow: hidden;
}

.btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s ease;
}

.btn:hover::before {
    left: 100%;
}

/* Code Snippet Animation */
.code-line {
    opacity: 0;
    animation: typeCode 0.8s ease forwards;
}

.code-line:nth-child(1) { animation-delay: 0.2s; }
.code-line:nth-child(2) { animation-delay: 0.4s; }
.code-line:nth-child(3) { animation-delay: 0.6s; }
.code-line:nth-child(4) { animation-delay: 0.8s; }
.code-line:nth-child(5) { animation-delay: 1.0s; }
.code-line:nth-child(6) { animation-delay: 1.2s; }
.code-line:nth-child(7) { animation-delay: 1.4s; }

@keyframes typeCode {
    0% {
        opacity: 0;
        transform: translateX(-20px);
    }
    100% {
        opacity: 1;
        transform: translateX(0);
    }
}

/* Loading States */
.loading-skeleton {
    background: linear-gradient(90deg, var(--bg-tertiary) 25%, var(--glass-bg) 50%, var(--bg-tertiary) 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
}

@keyframes loading {
    0% {
        background-position: 200% 0;
    }
    100% {
        background-position: -200% 0;
    }
}

/* Enhanced Hover Effects */
.project-card {
    transform-style: preserve-3d;
    perspective: 1000px;
}

.skill-category {
    transform-style: preserve-3d;
    perspective: 1000px;
}

/* Scroll Progress Indicator */
.scroll-progress {
    position: fixed;
    top: 0;
    left: 0;
    width: 0%;
    height: 3px;
    background: var(--accent-gradient);
    z-index: 10000;
    transition: width 0.1s ease;
}
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Scroll Progress Indicator
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
}

// Initialize scroll progress
initScrollProgress();

// Enhanced Form Validation
function initFormValidation() {
    const inputs = contactForm.querySelectorAll('input, textarea');

    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearValidation);
    });
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();

    // Remove existing validation
    clearValidation(e);

    let isValid = true;
    let message = '';

    if (!value) {
        isValid = false;
        message = 'This field is required';
    } else if (field.type === 'email' && !isValidEmail(value)) {
        isValid = false;
        message = 'Please enter a valid email address';
    } else if (field.name === 'name' && value.length < 2) {
        isValid = false;
        message = 'Name must be at least 2 characters';
    } else if (field.name === 'message' && value.length < 10) {
        isValid = false;
        message = 'Message must be at least 10 characters';
    }

    if (!isValid) {
        showFieldError(field, message);
    }

    return isValid;
}

function clearValidation(e) {
    const field = e.target;
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
    field.style.borderColor = '';
}

function showFieldError(field, message) {
    field.style.borderColor = '#ff6b6b';

    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.style.color = '#ff6b6b';
    errorElement.style.fontSize = '0.8rem';
    errorElement.style.marginTop = '5px';

    field.parentNode.appendChild(errorElement);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Initialize form validation
initFormValidation();

// Performance: Lazy load images when they come into view
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
initLazyLoading();

// Console Easter Egg
console.log(`
🚀 Welcome to Rishank Gupta's Portfolio!

👨‍💻 Interested in the code? Check out my GitHub:
https://github.com/Rishankgupta08

💼 Let's connect on LinkedIn:
https://linkedin.com/in/rishank-gupta-a54486323

🧩 See my problem-solving skills on LeetCode:
https://leetcode.com/u/rishankgupta567/

Built with ❤️ using vanilla HTML, CSS, and JavaScript
`);

// Service Worker Registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// =====================================================
// PROJECT SLIDER — active class toggle (most reliable)
// =====================================================
(function initProjectSlider() {
    const prevBtn = document.getElementById('sliderPrev');
    const nextBtn = document.getElementById('sliderNext');
    const dots = document.querySelectorAll('.dot');
    const currentEl = document.getElementById('currentSlide');
    const slides = document.querySelectorAll('.project-card.slide');
    const total = slides.length;

    if (total === 0) return;

    let current = 0;
    let autoTimer = null;

    function goTo(index) {
        if (index < 0) index = total - 1;
        if (index >= total) index = 0;

        // Remove active from current slide & dot
        slides[current].classList.remove('active');
        dots[current]?.classList.remove('active');

        current = index;

        // Add active to new slide & dot
        slides[current].classList.add('active');
        dots[current]?.classList.add('active');

        if (currentEl) currentEl.textContent = current + 1;
    }

    prevBtn?.addEventListener('click', () => { resetAuto(); goTo(current - 1); });
    nextBtn?.addEventListener('click', () => { resetAuto(); goTo(current + 1); });

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            resetAuto();
            goTo(parseInt(dot.dataset.index));
        });
    });

    // Keyboard support (when projects section is visible)
    document.addEventListener('keydown', (e) => {
        const section = document.getElementById('projects');
        if (!section) return;
        const rect = section.getBoundingClientRect();
        if (rect.top > window.innerHeight || rect.bottom < 0) return;
        if (e.key === 'ArrowLeft') { resetAuto(); goTo(current - 1); }
        if (e.key === 'ArrowRight') { resetAuto(); goTo(current + 1); }
    });

    // Auto-advance every 5 seconds
    function startAuto() { autoTimer = setInterval(() => goTo(current + 1), 5000); }
    function resetAuto() { clearInterval(autoTimer); startAuto(); }

    // Init: show first slide
    goTo(0);
    startAuto();
})();