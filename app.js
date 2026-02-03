// ===================================
// Daly College Website - JavaScript
// Mobile-First, No Horizontal Scroll
// ===================================


document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initMobileMenu();
    initAnimations();
    initCarousels(); // Simple carousels only (no infinite scroll for affiliations)
    initFilters();
    initScrollEffects();
    initInteractivity();
    initAccessibility();
});


// ===================================
// Mobile Menu
// ===================================
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileLinks = document.querySelectorAll('.mobile-menu a');
   
    if (!menuToggle || !mobileNav) return;
   
    menuToggle.addEventListener('click', () => {
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', !isExpanded);
        menuToggle.classList.toggle('active');
        mobileNav.classList.toggle('active');
        document.body.style.overflow = !isExpanded ? 'hidden' : '';
    });
   
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            mobileNav.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });
   
    document.addEventListener('click', (e) => {
        if (!menuToggle.contains(e.target) && !mobileNav.contains(e.target)) {
            menuToggle.classList.remove('active');
            mobileNav.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    });
}


// ===================================
// Dark / Light Mode
// ===================================
function initTheme() {
    const html = document.documentElement;
    const btn = document.getElementById('themeToggle');
    const STORAGE_KEY = 'dc_theme';
   
    let saved = localStorage.getItem(STORAGE_KEY);
   
    if (!saved) {
        saved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
   
    applyTheme(saved);
   
    if (btn) {
        btn.addEventListener('click', () => {
            const current = html.getAttribute('data-theme') || 'light';
            const next = current === 'dark' ? 'light' : 'dark';
            applyTheme(next);
           
            if (typeof gsap !== 'undefined') {
                gsap.fromTo(btn,
                    { rotate: 0 },
                    { rotate: 360, duration: 0.5, ease: 'power2.out' }
                );
            }
        });
    }
   
    function applyTheme(theme) {
        html.setAttribute('data-theme', theme);
        localStorage.setItem(STORAGE_KEY, theme);
       
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
            document.body.classList.remove('light-mode');
        } else {
            document.body.classList.add('light-mode');
            document.body.classList.remove('dark-mode');
        }
    }
   
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem(STORAGE_KEY)) {
            applyTheme(e.matches ? 'dark' : 'light');
        }
    });
}


// ===================================
// GSAP Animations
// ===================================
function initAnimations() {
    if (typeof gsap === 'undefined') return;
   
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
   
    // Section reveals
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        gsap.from(section, {
            scrollTrigger: {
                trigger: section,
                start: 'top 85%',
                end: 'top 60%',
                toggleActions: 'play none none reverse',
                invalidateOnRefresh: true
            },
            y: 60,
            opacity: 0,
            duration: 0.8,
            ease: 'power2.out'
        });
    });
   
    // Affiliations - Grid animation (no carousel)
    gsap.from('.affiliation-item', {
        scrollTrigger: {
            trigger: '.affiliations-track',
            start: 'top 85%',
            toggleActions: 'play none none reverse',
            invalidateOnRefresh: true
        },
        y: 50,
        opacity: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power2.out'
    });
   
    animateCounters();
   
    // Publications
    gsap.from('.publication-card', {
        scrollTrigger: {
            trigger: '.publications-grid',
            start: 'top 85%',
            toggleActions: 'play none none reverse',
            invalidateOnRefresh: true
        },
        y: 100,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out'
    });
   
    // News
    gsap.from('.news-card', {
        scrollTrigger: {
            trigger: '.news-track',
            start: 'top 85%',
            toggleActions: 'play none none reverse',
            invalidateOnRefresh: true
        },
        x: 100,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power2.out'
    });
   
    // Moments
    gsap.from('.moment-item', {
        scrollTrigger: {
            trigger: '.moments-track',
            start: 'top 85%',
            toggleActions: 'play none none reverse',
            invalidateOnRefresh: true
        },
        scale: 0.8,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out'
    });
   
    ScrollTrigger.refresh(true);
}


// ===================================
// Counter Animation
// ===================================
function animateCounters() {
    if (typeof gsap === 'undefined') return;
   
    const counters = document.querySelectorAll('[data-count]');
   
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
       
        ScrollTrigger.create({
            trigger: counter,
            start: 'top 85%',
            invalidateOnRefresh: true,
            onEnter: () => {
                gsap.to(counter, {
                    innerText: target,
                    duration: 2,
                    ease: 'power1.out',
                    snap: { innerText: 1 },
                    onUpdate: function() {
                        counter.innerText = Math.ceil(counter.innerText);
                    }
                });
            },
            once: true
        });
    });
}


// ===================================
// Simple Carousels (No infinite scroll)
// ===================================
function initCarousels() {
    // Note: Affiliations is now a grid, not a carousel
   
    // Regular carousels for announcements, campus, news, moments
    setupCarousel('.announcements-carousel', '.announcements-track', '.announcement-item');
    setupCarousel('.campus-carousel', '.campus-track', '.campus-item');
    setupCarousel('.news-carousel', '.news-track', '.news-card');
    setupCarousel('.moments-carousel', '.moments-track', '.moment-item');
}


function setupCarousel(carouselSelector, trackSelector, itemSelector) {
    const carousel = document.querySelector(carouselSelector);
    if (!carousel) return;
   
    const track = carousel.querySelector(trackSelector);
    const items = carousel.querySelectorAll(itemSelector);
    const prevBtn = carousel.querySelector('.carousel-nav.prev');
    const nextBtn = carousel.querySelector('.carousel-nav.next');
   
    if (!track || items.length === 0) return;
   
    let currentScroll = 0;
    const scrollAmount = Math.min(400, window.innerWidth * 0.8);
   
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const maxScroll = track.scrollWidth - track.clientWidth;
            currentScroll = Math.min(currentScroll + scrollAmount, maxScroll);
            if (typeof gsap !== 'undefined') {
                gsap.to(track, { scrollLeft: currentScroll, duration: 0.6, ease: 'power2.inOut' });
            } else {
                track.scrollLeft = currentScroll;
            }
        });
    }
   
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentScroll = Math.max(currentScroll - scrollAmount, 0);
            if (typeof gsap !== 'undefined') {
                gsap.to(track, { scrollLeft: currentScroll, duration: 0.6, ease: 'power2.inOut' });
            } else {
                track.scrollLeft = currentScroll;
            }
        });
    }
   
    // Touch support
    let touchStartX = 0;
    let touchEndX = 0;
   
    track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
   
    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
   
    function handleSwipe() {
        const maxScroll = track.scrollWidth - track.clientWidth;
       
        if (touchStartX - touchEndX > 50 && currentScroll < maxScroll) {
            currentScroll = Math.min(currentScroll + scrollAmount, maxScroll);
            if (typeof gsap !== 'undefined') {
                gsap.to(track, { scrollLeft: currentScroll, duration: 0.6, ease: 'power2.inOut' });
            } else {
                track.scrollLeft = currentScroll;
            }
        }
       
        if (touchEndX - touchStartX > 50 && currentScroll > 0) {
            currentScroll = Math.max(currentScroll - scrollAmount, 0);
            if (typeof gsap !== 'undefined') {
                gsap.to(track, { scrollLeft: currentScroll, duration: 0.6, ease: 'power2.inOut' });
            } else {
                track.scrollLeft = currentScroll;
            }
        }
    }
   
    track.addEventListener('scroll', () => {
        currentScroll = track.scrollLeft;
    }, { passive: true });
}


// ===================================
// Filter Functionality
// ===================================
function initFilters() {
    // Announcements
    const announcementContainer = document.querySelector('.announcement-filters');
    if (announcementContainer) {
        const buttons = announcementContainer.querySelectorAll('.filter-btn');
       
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                buttons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                handleAnnouncementFilter(button);
            });
        });
       
        const params = new URLSearchParams(window.location.search);
        const saved = params.get('filter');
       
        if (saved) {
            const target = announcementContainer.querySelector(`.filter-btn[data-filter="${saved}"]`);
            if (target) {
                buttons.forEach(btn => btn.classList.remove('active'));
                target.classList.add('active');
               
                const filter = saved;
                const items = document.querySelectorAll('.announcement-item');
                items.forEach(item => {
                    const cat = item.getAttribute('data-category');
                    item.style.display = (filter === 'all' || cat === filter) ? '' : 'none';
                });
            }
        }
    }
   
    // Moments
    const momentsContainer = document.querySelector('.moments-filters');
    if (momentsContainer) {
        const buttons = momentsContainer.querySelectorAll('.filter-btn');
       
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                buttons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                handleGalleryFilter(button);
            });
        });
    }
}


function handleAnnouncementFilter(button) {
    const filter = button.getAttribute('data-filter');
    const items = document.querySelectorAll('.announcement-item');
   
    const visibleNow = Array.from(items).filter(item => item.style.display !== 'none');
   
    if (typeof gsap !== 'undefined') {
        gsap.to(visibleNow, {
            opacity: 0,
            y: 20,
            duration: 0.3,
            stagger: 0.04,
            ease: 'power2.in',
            onComplete: () => {
                const nextVisible = [];
               
                items.forEach(item => {
                    const cat = item.getAttribute('data-category');
                   
                    if (filter === 'all' || cat === filter) {
                        item.style.display = '';
                        gsap.set(item, { opacity: 0, y: 20 });
                        nextVisible.push(item);
                    } else {
                        item.style.display = 'none';
                    }
                });
               
                if (nextVisible.length > 0) {
                    gsap.to(nextVisible, {
                        opacity: 1,
                        y: 0,
                        duration: 0.35,
                        stagger: 0.06,
                        ease: 'power2.out'
                    });
                }
            }
        });
    } else {
        items.forEach(item => {
            const cat = item.getAttribute('data-category');
            item.style.display = (filter === 'all' || cat === filter) ? '' : 'none';
        });
    }
   
    syncFilterToURL(filter);
}


function syncFilterToURL(filterValue) {
    const url = new URL(window.location.href);
    const params = url.searchParams;
   
    if (filterValue === 'all') {
        params.delete('filter');
    } else {
        params.set('filter', filterValue);
    }
   
    history.replaceState(null, '', url.pathname + (params.toString() ? '?' + params.toString() : '') + url.hash);
}


function handleGalleryFilter(button) {
    const items = document.querySelectorAll('.moment-item');
   
    if (typeof gsap !== 'undefined') {
        gsap.to(items, {
            scale: 0.9,
            opacity: 0,
            duration: 0.3,
            stagger: 0.05,
            onComplete: () => {
                gsap.to(items, { scale: 1, opacity: 1, duration: 0.3, stagger: 0.05 });
            }
        });
    }
}


// ===================================
// Scroll Effects
// ===================================
function initScrollEffects() {
    const header = document.querySelector('.header');
   
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
       
        if (currentScroll > 100) {
            header.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
        }
    }, { passive: true });
   
    const scrollTopBtn = document.getElementById('scrollTopBtn');
   
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 500) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        }, { passive: true });
       
        scrollTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        });
    }
   
    if (typeof gsap !== 'undefined') {
        const heroVideo = document.querySelector('.hero-video');
        if (heroVideo) {
            gsap.to(heroVideo, {
                scrollTrigger: {
                    trigger: '.hero',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true,
                    invalidateOnRefresh: true
                },
                y: 150,
                ease: 'none'
            });
        }
    }
   
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
           
            if (href === '#') {
                e.preventDefault();
                return;
            }
           
            const target = document.querySelector(href);
           
            if (target) {
                e.preventDefault();
                if (typeof gsap !== 'undefined') {
                    gsap.to(window, {
                        duration: 1,
                        scrollTo: { y: target, offsetY: 100 },
                        ease: 'power2.inOut'
                    });
                } else {
                    const targetPos = target.getBoundingClientRect().top + window.pageYOffset - 100;
                    window.scrollTo({ top: targetPos, behavior: 'smooth' });
                }
            }
        });
    });
}


// ===================================
// Interactive Elements
// ===================================
function initInteractivity() {
    if (typeof gsap === 'undefined') return;
   
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            gsap.to(button, { scale: 1.05, duration: 0.3, ease: 'power2.out' });
        });
        button.addEventListener('mouseleave', () => {
            gsap.to(button, { scale: 1, duration: 0.3, ease: 'power2.out' });
        });
    });
   
    const publicationCards = document.querySelectorAll('.publication-card');
    publicationCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, { y: -15, duration: 0.4, ease: 'power2.out' });
        });
        card.addEventListener('mouseleave', () => {
            gsap.to(card, { y: 0, duration: 0.4, ease: 'power2.out' });
        });
    });
   
    const voiceBtn = document.querySelector('.voice-assist');
    if (voiceBtn) {
        voiceBtn.addEventListener('click', () => {
            gsap.fromTo(voiceBtn,
                { scale: 1 },
                { scale: 1.2, duration: 0.2, yoyo: true, repeat: 1, ease: 'power2.inOut' }
            );
            alert('Voice assistance feature coming soon!');
        });
    }
}


// ===================================
// Accessibility
// ===================================
function initAccessibility() {
    const announcementsTrack = document.querySelector('.announcements-track');
    if (announcementsTrack) {
        announcementsTrack.setAttribute('aria-live', 'polite');
    }
   
    const carouselItems = document.querySelectorAll('.announcement-item, .news-card, .moment-item');
    carouselItems.forEach(item => {
        item.setAttribute('tabindex', '0');
        item.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                item.click();
            }
        });
    });
   
    const interactiveElements = document.querySelectorAll('a, button, [tabindex]');
    interactiveElements.forEach(element => {
        element.addEventListener('focus', () => {
            element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
    });
   
    announcePageLoad();
}


function announcePageLoad() {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.style.cssText = 'position:absolute;left:-10000px;width:1px;height:1px;overflow:hidden;';
    announcement.textContent = 'Daly College website loaded. Navigate using tab key.';
    document.body.appendChild(announcement);
    setTimeout(() => announcement.remove(), 3000);
}


// ===================================
// Performance Optimizations
// ===================================
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            }
        });
    });
   
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => imageObserver.observe(img));
}


window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    if (typeof gsap !== 'undefined') {
        gsap.to('body', { opacity: 1, duration: 0.3 });
    }
});


window.addEventListener('error', (e) => {
    console.error('Error occurred:', e.error);
});


const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');


if (prefersReducedMotion.matches && typeof gsap !== 'undefined') {
    gsap.globalTimeline.timeScale(100);
    document.documentElement.style.setProperty('--transition-fast', '0s');
    document.documentElement.style.setProperty('--transition-normal', '0s');
    document.documentElement.style.setProperty('--transition-slow', '0s');
}


console.log('Daly College Website - JavaScript Loaded Successfully! 🎉');
