// Language Switcher
const langButtons = document.querySelectorAll('.lang-btn');
let currentLang = 'en';

function switchLanguage(lang) {
    currentLang = lang;

    // Update active button
    langButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    // Update all translatable elements
    document.querySelectorAll('[data-en]').forEach(element => {
        const translation = element.getAttribute(`data-${lang}`);
        if (translation) {
            element.textContent = translation;
        }
    });

    // Update form placeholders
    document.querySelectorAll('[data-placeholder-en]').forEach(element => {
        const translation = element.getAttribute(`data-placeholder-${lang}`);
        if (translation) {
            element.placeholder = translation;
        }
    });

    document.querySelectorAll("[data-href-en]").forEach(el => { el.href = el.getAttribute(`data-href-${lang}`); });

    // Update HTML lang attribute
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-aria-en]').forEach(element => {
        element.setAttribute('aria-label', element.getAttribute(`data-aria-${lang}`));
    });
}

langButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        switchLanguage(btn.dataset.lang);
    });
});

// Product carousel: manual controls, keyboard navigation and native touch swipe.
const productTrack = document.querySelector('.product-track');
const productSlides = [...productTrack.querySelectorAll('.product-feature')];
const productTabs = [...document.querySelectorAll('[data-slide]')];
const productStatus = document.querySelector('.slider-status');
let activeProduct = 0;

function updateProduct(index) {
    activeProduct = index;
    productTabs.forEach((tab, i) => {
        if (i === index) tab.setAttribute('aria-current', 'true');
        else tab.removeAttribute('aria-current');
    });
    productSlides.forEach((slide, i) => { slide.inert = i !== index; });
    productStatus.textContent = `${index + 1} / ${productSlides.length} · ${productSlides[index].getAttribute('aria-label')}`;
}

function showProduct(index) {
    const next = (index + productSlides.length) % productSlides.length;
    productTrack.scrollTo({
        left: productSlides[next].offsetLeft - productSlides[0].offsetLeft,
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'
    });
    updateProduct(next);
}

productTabs.forEach(tab => tab.addEventListener('click', () => showProduct(Number(tab.dataset.slide))));
document.querySelectorAll('[data-slide-step]').forEach(button => {
    button.addEventListener('click', () => showProduct(activeProduct + Number(button.dataset.slideStep)));
});
productTrack.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        event.preventDefault();
        showProduct(activeProduct + (event.key === 'ArrowRight' ? 1 : -1));
    }
});
let productScrollTimer;
productTrack.addEventListener('scroll', () => {
    clearTimeout(productScrollTimer);
    productScrollTimer = setTimeout(() => {
        const index = Math.max(0, Math.min(productSlides.length - 1, Math.round(productTrack.scrollLeft / productTrack.clientWidth)));
        updateProduct(index);
    }, 120);
}, { passive: true });
window.addEventListener('resize', () => {
    productTrack.scrollTo({ left: activeProduct * productTrack.clientWidth, behavior: 'instant' });
});
updateProduct(0);

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar Scroll Effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.style.background = 'rgba(10, 14, 39, 0.95)';
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.background = 'rgba(10, 14, 39, 0.8)';
        navbar.style.boxShadow = 'none';
    }

    lastScroll = currentScroll;
});

// Mobile Menu Toggle
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav-menu');

mobileMenuToggle.addEventListener('click', () => {
    const isActive = navMenu.classList.toggle('active');
    mobileMenuToggle.classList.toggle('active');
    mobileMenuToggle.setAttribute('aria-expanded', String(isActive));
    document.body.style.overflow = isActive ? 'hidden' : '';
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    });
});

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards and sections
document.querySelectorAll('.expertise-card, .portfolio-card, .service-card, .partnership-content, .contact-content').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Parallax Effect for Hero Background
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroBackground = document.querySelector('.hero-background');
    if (heroBackground && scrolled < window.innerHeight) {
        heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Add hover effect to portfolio cards
document.querySelectorAll('.portfolio-card').forEach(card => {
    card.addEventListener('mouseenter', function () {
        this.style.borderColor = 'rgba(102, 126, 234, 0.5)';
    });

    card.addEventListener('mouseleave', function () {
        this.style.borderColor = 'rgba(255, 255, 255, 0.1)';
    });
});

// Add active state to navigation based on scroll position
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.style.color = 'var(--text-secondary)';
            });
            if (navLink) {
                navLink.style.color = 'var(--text-primary)';
            }
        }
    });
});
