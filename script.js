// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function () {
    initializeApp();
});

// Initialize Application
function initializeApp() {
    initializeTheme();
    initializeNavigation();
    initializeScrollAnimations();
    initializeContactForm();
    initializeBackToTop();
    initializeSkillProgress();
    createParticleBackground();
}

// Theme Management
function initializeTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;

    // Get saved theme or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';

    // Apply saved theme
    if (savedTheme === 'dark') {
        html.classList.add('dark');
    }

    // Theme toggle event listener
    themeToggle.addEventListener('click', function () {
        html.classList.toggle('dark');

        // Save theme preference
        const currentTheme = html.classList.contains('dark') ? 'dark' : 'light';
        localStorage.setItem('theme', currentTheme);

        // Animate theme toggle button
        this.style.transform = 'scale(0.9)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 150);
    });
}

// Navigation Management
function initializeNavigation() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    const navbar = document.querySelector('nav');

    // Mobile menu toggle
    mobileMenuButton.addEventListener('click', function () {
        const isHidden = mobileMenu.classList.contains('hidden');

        if (isHidden) {
            mobileMenu.classList.remove('hidden');
            setTimeout(() => mobileMenu.classList.add('show'), 10);
            this.innerHTML = '<i class="fas fa-times text-xl"></i>';
        } else {
            mobileMenu.classList.remove('show');
            setTimeout(() => mobileMenu.classList.add('hidden'), 300);
            this.innerHTML = '<i class="fas fa-bars text-xl"></i>';
        }
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                const headerOffset = 80;
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                if (!mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.remove('show');
                    setTimeout(() => mobileMenu.classList.add('hidden'), 300);
                    mobileMenuButton.innerHTML = '<i class="fas fa-bars text-xl"></i>';
                }

                // Update active navigation link
                updateActiveNavLink(targetId);
            }
        });
    });

    // Update navigation on scroll
    window.addEventListener('scroll', function () {
        const scrollPosition = window.scrollY + 100;
        const sections = document.querySelectorAll('section[id]');

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                updateActiveNavLink(sectionId);
            }
        });

        // Navbar background on scroll
        if (window.scrollY > 50) {
            navbar.classList.add('bg-white/90', 'dark:bg-gray-900/90');
        } else {
            navbar.classList.remove('bg-white/90', 'dark:bg-gray-900/90');
        }
    });
}

// Update active navigation link
function updateActiveNavLink(activeId) {
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

    navLinks.forEach(link => {
        const href = link.getAttribute('href').substring(1);
        if (href === activeId) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Scroll Animations
function initializeScrollAnimations() {
    const animateElements = document.querySelectorAll('.animate-on-scroll');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');

                // Trigger skill progress animation if it's a skill card
                if (entry.target.classList.contains('skill-card')) {
                    animateSkillProgress(entry.target);
                }
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animateElements.forEach(element => {
        observer.observe(element);
    });
}

// Animate skill progress bars
function initializeSkillProgress() {
    const skillProgressBars = document.querySelectorAll('.skill-progress');

    skillProgressBars.forEach(bar => {
        const targetWidth = bar.getAttribute('data-width');
        bar.style.setProperty('--target-width', targetWidth);
    });
}

function animateSkillProgress(skillCard) {
    const progressBar = skillCard.querySelector('.skill-progress');
    if (progressBar && !progressBar.classList.contains('animate')) {
        setTimeout(() => {
            progressBar.classList.add('animate');
            const targetWidth = progressBar.getAttribute('data-width');
            progressBar.style.width = targetWidth;
        }, 300);
    }
}

// Contact Form Management
function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');

    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Clear previous errors
        clearFormErrors();

        // Get form data
        const formData = new FormData(this);
        const name = formData.get('name').trim();
        const email = formData.get('email').trim();
        const subject = formData.get('subject').trim();
        const message = formData.get('message').trim();

        // Validate form
        let isValid = true;

        if (!name) {
            showFieldError('name', 'Name is required');
            isValid = false;
        }

        if (!email) {
            showFieldError('email', 'Email is required');
            isValid = false;
        } else if (!isValidEmail(email)) {
            showFieldError('email', 'Please enter a valid email address');
            isValid = false;
        }

        if (!isValid) return;

        // Show loading state
        showFormLoading();

        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            hideFormLoading();
            showFormMessage('Thank you for your message! I\'ll get back to you soon.', 'success');
            this.reset();
        }, 2000);
    });
}

// Form validation helpers
function clearFormErrors() {
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(msg => msg.textContent = '');
}

function showFieldError(fieldName, message) {
    const field = document.getElementById(fieldName);
    const errorDiv = field.parentNode.querySelector('.error-message');
    errorDiv.textContent = message;
    field.classList.add('border-red-500');
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showFormLoading() {
    const submitButton = document.querySelector('#contact-form button[type="submit"]');
    const buttonText = submitButton.querySelector('.button-text');
    const loadingSpinner = submitButton.querySelector('.loading-spinner');

    buttonText.textContent = 'Sending...';
    loadingSpinner.classList.remove('hidden');
    submitButton.disabled = true;
}

function hideFormLoading() {
    const submitButton = document.querySelector('#contact-form button[type="submit"]');
    const buttonText = submitButton.querySelector('.button-text');
    const loadingSpinner = submitButton.querySelector('.loading-spinner');

    buttonText.textContent = 'Send Message';
    loadingSpinner.classList.add('hidden');
    submitButton.disabled = false;
}

function showFormMessage(message, type) {
    const formMessage = document.getElementById('form-message');
    formMessage.textContent = message;
    formMessage.className = `mt-4 text-center ${type === 'success' ? 'text-green-600' : 'text-red-600'}`;
    formMessage.classList.remove('hidden');

    setTimeout(() => {
        formMessage.classList.add('hidden');
    }, 5000);
}

// Back to Top Button
function initializeBackToTop() {
    const backToTopButton = document.getElementById('back-to-top');

    window.addEventListener('scroll', function () {
        if (window.scrollY > 300) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    });

    backToTopButton.addEventListener('click', function () {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Particle Background Effect
function createParticleBackground() {
    const heroSection = document.getElementById('home');
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles-bg';
    heroSection.appendChild(particlesContainer);

    // Create particles
    for (let i = 0; i < 50; i++) {
        createParticle(particlesContainer);
    }

    // Continuously create new particles
    setInterval(() => {
        if (particlesContainer.children.length < 50) {
            createParticle(particlesContainer);
        }
    }, 2000);
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';

    // Random size and position
    const size = Math.random() * 4 + 2;
    const startX = Math.random() * window.innerWidth;
    const duration = Math.random() * 10 + 15;

    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    particle.style.left = startX + 'px';
    particle.style.animationDuration = duration + 's';

    container.appendChild(particle);

    // Remove particle after animation
    setTimeout(() => {
        if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
        }
    }, duration * 1000);
}

// Add glow effects to interactive elements
function addGlowEffects() {
    const interactiveElements = document.querySelectorAll('button, .btn-primary, .btn-secondary, .social-link');

    interactiveElements.forEach(element => {
        element.classList.add('glow-on-hover');
    });
}

// Keyboard navigation support
document.addEventListener('keydown', function (e) {
    // Escape key closes mobile menu
    if (e.key === 'Escape') {
        const mobileMenu = document.getElementById('mobile-menu');
        const mobileMenuButton = document.getElementById('mobile-menu-button');

        if (!mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.remove('show');
            setTimeout(() => mobileMenu.classList.add('hidden'), 300);
            mobileMenuButton.innerHTML = '<i class="fas fa-bars text-xl"></i>';
        }
    }
});

// Performance optimization: lazy load images if any are added
function lazyLoadImages() {
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

// Add smooth reveal animations for cards
function addCardAnimations() {
    const cards = document.querySelectorAll('.skill-card, .project-card');

    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
}

// Initialize additional effects after DOM is loaded
window.addEventListener('load', function () {
    addGlowEffects();
    addCardAnimations();
    lazyLoadImages();
});

// Handle window resize
window.addEventListener('resize', function () {
    // Close mobile menu on resize to desktop
    if (window.innerWidth >= 768) {
        const mobileMenu = document.getElementById('mobile-menu');
        const mobileMenuButton = document.getElementById('mobile-menu-button');

        if (!mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
            mobileMenu.classList.remove('show');
            mobileMenuButton.innerHTML = '<i class="fas fa-bars text-xl"></i>';
        }
    }
});