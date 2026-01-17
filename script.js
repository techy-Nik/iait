// ===================================
// MODERN iAI TECH - INTERACTIVE FEATURES
// ===================================

(function() {
    'use strict';

    // ===================================
    // STATE MANAGEMENT
    // ===================================
    const state = {
        // currentProjectSlide: 0,
        currentGalleryImage: 0,
        mobileMenuOpen: false,
        headerScrolled: false
    };

    // ===================================
    // DOM ELEMENTS
    // ===================================
    const elements = {
        header: document.querySelector('.header'),
        mobileMenuToggle: document.querySelector('.mobile-menu-toggle'),
        nav: document.querySelector('.nav'),
        navLinks: document.querySelectorAll('.nav-link'),
        
        // Project Carousel - COMMENTED OUT
        // projectSlides: document.querySelectorAll('.project-slide'),
        // projectIndicators: document.querySelectorAll('.carousel-indicators .indicator'),
        // carouselPrev: document.querySelector('.carousel-prev'),
        // carouselNext: document.querySelector('.carousel-next'),
        
        // Gallery
        galleryImages: document.querySelectorAll('.gallery-image'),
        thumbnails: document.querySelectorAll('.thumbnail'),
        
        // Stats - COMMENTED OUT
        // statNumbers: document.querySelectorAll('.stat-number')
    };

    // ===================================
    // HEADER SCROLL EFFECT
    // ===================================
    function handleScroll() {
        const scrolled = window.scrollY > 50;
        
        if (scrolled !== state.headerScrolled) {
            state.headerScrolled = scrolled;
            elements.header.classList.toggle('scrolled', scrolled);
        }
    }

    // ===================================
    // MOBILE MENU
    // ===================================
    function toggleMobileMenu() {
        state.mobileMenuOpen = !state.mobileMenuOpen;
        elements.mobileMenuToggle.setAttribute('aria-expanded', state.mobileMenuOpen);
        elements.nav.classList.toggle('active', state.mobileMenuOpen);
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = state.mobileMenuOpen ? 'hidden' : '';
    }

    function closeMobileMenu() {
        if (state.mobileMenuOpen) {
            state.mobileMenuOpen = false;
            elements.mobileMenuToggle.setAttribute('aria-expanded', 'false');
            elements.nav.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // ===================================
    // SMOOTH SCROLL
    // ===================================
    function smoothScrollTo(target) {
        const element = document.querySelector(target);
        if (!element) return;

        const headerHeight = elements.header.offsetHeight;
        const targetPosition = element.offsetTop - headerHeight;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }

    // ===================================
    // PROJECT CAROUSEL - COMMENTED OUT
    // ===================================
    /*
    function showProjectSlide(index) {
        // Wrap around
        if (index >= elements.projectSlides.length) {
            index = 0;
        } else if (index < 0) {
            index = elements.projectSlides.length - 1;
        }

        // Update state
        state.currentProjectSlide = index;

        // Update slides
        elements.projectSlides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });

        // Update indicators
        elements.projectIndicators.forEach((indicator, i) => {
            indicator.classList.toggle('active', i === index);
        });
    }

    function nextProjectSlide() {
        showProjectSlide(state.currentProjectSlide + 1);
    }

    function prevProjectSlide() {
        showProjectSlide(state.currentProjectSlide - 1);
    }

    function startProjectCarousel() {
        return setInterval(nextProjectSlide, 5000);
    }
    */

    // ===================================
    // GALLERY
    // ===================================
    function showGalleryImage(index) {
        if (index < 0 || index >= elements.galleryImages.length) return;

        state.currentGalleryImage = index;

        // Update images with fade effect
        elements.galleryImages.forEach((img, i) => {
            img.classList.toggle('active', i === index);
        });

        // Update thumbnails
        elements.thumbnails.forEach((thumb, i) => {
            thumb.classList.toggle('active', i === index);
        });
    }

    function nextGalleryImage() {
        const nextIndex = (state.currentGalleryImage + 1) % elements.galleryImages.length;
        showGalleryImage(nextIndex);
    }

    function prevGalleryImage() {
        const prevIndex = state.currentGalleryImage - 1 < 0 
            ? elements.galleryImages.length - 1 
            : state.currentGalleryImage - 1;
        showGalleryImage(prevIndex);
    }

    function startGalleryAutoplay() {
        if (elements.galleryImages.length === 0) return null;
        return setInterval(nextGalleryImage, 4000); // Auto-rotate every 4 seconds
    }

    // ===================================
    // ANIMATED COUNTERS - COMMENTED OUT
    // ===================================
    /*
    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                element.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        };

        updateCounter();
    }
    */

    function handleIntersection(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                // Stats animation - COMMENTED OUT
                /*
                if (element.classList.contains('stat-number')) {
                    animateCounter(element);
                    observer.unobserve(element);
                }
                */
            }
        });
    }

    // ===================================
    // SCROLL REVEAL ANIMATIONS
    // ===================================
    function initScrollReveal() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver(handleIntersection, observerOptions);

        // Observe stats - COMMENTED OUT
        // elements.statNumbers.forEach(stat => observer.observe(stat));

        // Observe cards
        const cards = document.querySelectorAll('.card-animate');
        cards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            observer.observe(card);
        });
    }

    // ===================================
    // ERROR HANDLING FOR IMAGES
    // ===================================
    function handleImageError(img) {
        // Hide broken images gracefully
        img.style.display = 'none';
        
        // If it's in a team card, show fallback
        const fallback = img.nextElementSibling;
        if (fallback && fallback.classList.contains('team-image-fallback')) {
            fallback.style.display = 'flex';
        }
    }

    // ===================================
    // COPY EMAIL FUNCTIONALITY
    // ===================================
    async function copyEmailToClipboard(email, button) {
        try {
            await navigator.clipboard.writeText(email);
            
            // Visual feedback
            button.classList.add('copied');
            const originalHTML = button.innerHTML;
            
            // Change to checkmark
            if (button.classList.contains('copy-email-btn--large')) {
                button.innerHTML = '<svg width="20" height="20" viewBox="0 0 16 16" fill="none"><path d="M13 4L6 11L3 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
            } else {
                button.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M13 4L6 11L3 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
            }
            
            setTimeout(() => {
                button.classList.remove('copied');
                button.innerHTML = originalHTML;
            }, 2000);
        } catch (err) {
            console.error('Failed to copy email:', err);
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = email;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                button.classList.add('copied');
                setTimeout(() => button.classList.remove('copied'), 2000);
            } catch (err2) {
                console.error('Fallback copy failed:', err2);
            }
            document.body.removeChild(textArea);
        }
    }

    // ===================================
    // INITIALIZATION
    // ===================================
    function init() {
        // Scroll events
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (!scrollTimeout) {
                scrollTimeout = setTimeout(() => {
                    handleScroll();
                    scrollTimeout = null;
                }, 10);
            }
        });

        // Mobile menu
        if (elements.mobileMenuToggle) {
            elements.mobileMenuToggle.addEventListener('click', toggleMobileMenu);
        }

        // Navigation links
        elements.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                if (href.startsWith('#')) {
                    e.preventDefault();
                    smoothScrollTo(href);
                    closeMobileMenu();
                }
            });
        });

        // Project carousel controls - COMMENTED OUT
        /*
        if (elements.carouselPrev) {
            elements.carouselPrev.addEventListener('click', prevProjectSlide);
        }
        
        if (elements.carouselNext) {
            elements.carouselNext.addEventListener('click', nextProjectSlide);
        }

        // Project carousel indicators
        elements.projectIndicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                showProjectSlide(index);
            });
        });

        // Start auto-play carousel
        const carouselInterval = startProjectCarousel();

        // Pause carousel on hover
        const carouselContainer = document.querySelector('.projects-carousel');
        if (carouselContainer) {
            carouselContainer.addEventListener('mouseenter', () => {
                clearInterval(carouselInterval);
            });
            
            carouselContainer.addEventListener('mouseleave', () => {
                startProjectCarousel();
            });
        }
        */

        // Gallery thumbnails
        elements.thumbnails.forEach((thumbnail, index) => {
            thumbnail.addEventListener('click', () => {
                showGalleryImage(index);
            });
        });

        // Start gallery auto-rotation only if gallery exists
        let galleryInterval = null;
        if (elements.galleryImages.length > 0) {
            galleryInterval = startGalleryAutoplay();

            // Pause gallery auto-rotation on hover
            const galleryContainer = document.querySelector('.frvp-gallery');
            if (galleryContainer) {
                galleryContainer.addEventListener('mouseenter', () => {
                    if (galleryInterval) clearInterval(galleryInterval);
                });
                
                galleryContainer.addEventListener('mouseleave', () => {
                    galleryInterval = startGalleryAutoplay();
                });
            }
        }

        // Initialize scroll reveal
        initScrollReveal();

        // Handle image errors
        document.querySelectorAll('img').forEach(img => {
            img.addEventListener('error', () => handleImageError(img));
        });

        // Copy email buttons
        document.querySelectorAll('.copy-email-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const email = btn.getAttribute('data-email');
                copyEmailToClipboard(email, btn);
            });
        });

        // Close mobile menu on resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                if (window.innerWidth > 768) {
                    closeMobileMenu();
                }
            }, 250);
        });

        // Close mobile menu on ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && state.mobileMenuOpen) {
                closeMobileMenu();
            }
        });

        // Initial scroll check
        handleScroll();
    }

    // ===================================
    // PERFORMANCE OPTIMIZATION
    // ===================================
    
    // Debounce function
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Throttle function
    function throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // ===================================
    // ACCESSIBILITY HELPERS
    // ===================================
    function setupAccessibility() {
        // Add keyboard navigation for carousel - COMMENTED OUT
        /*
        document.addEventListener('keydown', (e) => {
            const carouselFocused = document.activeElement.closest('.projects-carousel');
            
            if (carouselFocused) {
                if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    prevProjectSlide();
                } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    nextProjectSlide();
                }
            }
        });

        // Announce slide changes to screen readers
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('role', 'status');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        document.body.appendChild(liveRegion);

        // Update live region when slide changes
        const originalShowProjectSlide = showProjectSlide;
        showProjectSlide = function(index) {
            originalShowProjectSlide(index);
            const slideTitle = elements.projectSlides[index]?.querySelector('.project-name')?.textContent;
            if (slideTitle) {
                liveRegion.textContent = `Showing project ${index + 1} of ${elements.projectSlides.length}: ${slideTitle}`;
            }
        };
        */
    }

    // ===================================
    // LAZY LOADING
    // ===================================
    function setupLazyLoading() {
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src || img.src;
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                });
            });

            lazyImages.forEach(img => imageObserver.observe(img));
        }
    }

    // ===================================
    // ANALYTICS (Optional)
    // ===================================
    function trackEvent(category, action, label) {
        // Placeholder for analytics tracking
        console.log('Track Event:', { category, action, label });
        
        // Example: Google Analytics
        // if (window.gtag) {
        //     gtag('event', action, {
        //         'event_category': category,
        //         'event_label': label
        //     });
        // }
    }

    // Track important interactions
    function setupAnalytics() {
        // Track CTA button clicks
        document.querySelectorAll('.btn-primary').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const text = e.target.textContent.trim();
                trackEvent('CTA', 'click', text);
            });
        });

        // Track publication views - only if publications exist
        const publications = document.querySelectorAll('.publication-item');
        if (publications.length > 0) {
            publications.forEach((pub, index) => {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            trackEvent('Publication', 'view', `Publication ${index + 1}`);
                            observer.unobserve(entry.target);
                        }
                    });
                }, { threshold: 0.5 });
                
                observer.observe(pub);
            });
        }
    }

    // ===================================
    // START APPLICATION
    // ===================================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            init();
            setupAccessibility();
            setupLazyLoading();
            setupAnalytics();
        });
    } else {
        init();
        setupAccessibility();
        setupLazyLoading();
        setupAnalytics();
    }

    // ===================================
    // EXPOSE PUBLIC API
    // ===================================
    window.iAITech = {
        // showProjectSlide, // COMMENTED OUT
        showGalleryImage,
        closeMobileMenu
    };

})();