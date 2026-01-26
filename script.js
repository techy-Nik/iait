// ===================================
// MODERN iAI TECH - INTERACTIVE FEATURES
// PAUSE BUTTON LOGIC DISABLED
// =================================== */

(function() {
    'use strict';

    // ===================================
    // STATE MANAGEMENT
    // ===================================
    const state = {
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
        
        // Gallery
        galleryImages: document.querySelectorAll('.gallery-image'),
        thumbnails: document.querySelectorAll('.thumbnail'),
    };

    // ===================================
    // HEADER SCROLL EFFECT & AUTO-HIDE
    // ===================================
    function handleScroll() {
        const scrollY = window.scrollY;
        const heroHeight = document.querySelector('.hero')?.offsetHeight || window.innerHeight;
        const scrolled = scrollY > 50;
        const pastHero = scrollY > heroHeight - 100;
        
        // Auto-hide on hero, show when scrolled past hero
        if (pastHero) {
            elements.header.classList.add('visible');
            elements.header.classList.add('scrolled');
        } else {
            elements.header.classList.remove('visible');
            elements.header.classList.remove('scrolled');
        }
        
        // Back to top button
        const backToTop = document.querySelector('.back-to-top');
        if (backToTop) {
            if (scrollY > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }
        
        state.headerScrolled = scrolled;
    }

    // ===================================
    // MOBILE MENU
    // ===================================
    function toggleMobileMenu() {
        state.mobileMenuOpen = !state.mobileMenuOpen;
        elements.mobileMenuToggle.setAttribute('aria-expanded', state.mobileMenuOpen);
        elements.nav.classList.toggle('active', state.mobileMenuOpen);
        
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
    // GALLERY
    // ===================================
    function showGalleryImage(index) {
        if (index < 0 || index >= elements.galleryImages.length) return;

        state.currentGalleryImage = index;

        elements.galleryImages.forEach((img, i) => {
            img.classList.toggle('active', i === index);
        });

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
        return setInterval(nextGalleryImage, 4000);
    }

    function handleIntersection(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
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
        img.style.display = 'none';
        
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
            
            button.classList.add('copied');
            const originalHTML = button.innerHTML;
            
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
    // IMPROVED HERO SLIDER - SMOOTH & PAUSABLE
    // PAUSE BUTTON DISABLED
    // ===================================
    const heroSlider = {
        currentSlide: 0,
        slides: null,
        dots: null,
        interval: null,
        isPaused: false,
        autoplayDuration: 8000,
        progressInterval: null,
        progressValue: 0,
        
        init() {
            this.slides = document.querySelectorAll('.hero-slide');
            this.dots = document.querySelectorAll('.slider-dot');
            this.progressBar = document.querySelector('.slider-progress-bar');
            this.heroSection = document.querySelector('.hero');
            // PAUSE BUTTON DISABLED - Uncomment below to re-enable
            // this.pauseBtn = document.querySelector('.slider-pause-btn');
            this.manuallyPaused = false;
            
            if (this.slides.length === 0) return;
            
            this.preloadImages();
            
            // Dot click handlers - auto-resume after 5 seconds
            this.dots.forEach((dot, index) => {
                dot.addEventListener('click', () => {
                    this.pauseAutoplay();
                    this.goToSlide(index);
                    // Auto-resume after 5 seconds
                    setTimeout(() => {
                        if (this.isPaused) {
                            this.resumeAutoplay();
                            this.manuallyPaused = false;
                        }
                    }, 5000);
                });
            });
            
            // Arrow click handlers - auto-resume after 5 seconds
            const prevBtn = document.querySelector('.slider-arrow-prev');
            const nextBtn = document.querySelector('.slider-arrow-next');
            
            if (prevBtn) {
                prevBtn.addEventListener('click', () => {
                    this.pauseAutoplay();
                    this.prevSlide();
                    // Auto-resume after 5 seconds
                    setTimeout(() => {
                        if (this.isPaused) {
                            this.resumeAutoplay();
                            this.manuallyPaused = false;
                        }
                    }, 5000);
                });
            }
            
            if (nextBtn) {
                nextBtn.addEventListener('click', () => {
                    this.pauseAutoplay();
                    this.nextSlide();
                    // Auto-resume after 5 seconds
                    setTimeout(() => {
                        if (this.isPaused) {
                            this.resumeAutoplay();
                            this.manuallyPaused = false;
                        }
                    }, 5000);
                });
            }
            
            // PAUSE BUTTON EVENT LISTENER DISABLED
            // Uncomment below to re-enable pause button
            /*
            if (this.pauseBtn) {
                this.pauseBtn.addEventListener('click', () => {
                    this.togglePause();
                });
            }
            */
            
            // Keyboard navigation - auto-resume after 5 seconds
            document.addEventListener('keydown', (e) => {
                const heroRect = this.heroSection.getBoundingClientRect();
                const isVisible = heroRect.top < window.innerHeight && heroRect.bottom >= 0;
                
                if (isVisible) {
                    if (e.key === 'ArrowLeft') {
                        e.preventDefault();
                        this.pauseAutoplay();
                        this.prevSlide();
                        // Auto-resume after 5 seconds
                        setTimeout(() => {
                            if (this.isPaused) {
                                this.resumeAutoplay();
                                this.manuallyPaused = false;
                            }
                        }, 5000);
                    } else if (e.key === 'ArrowRight') {
                        e.preventDefault();
                        this.pauseAutoplay();
                        this.nextSlide();
                        // Auto-resume after 5 seconds
                        setTimeout(() => {
                            if (this.isPaused) {
                                this.resumeAutoplay();
                                this.manuallyPaused = false;
                            }
                        }, 5000);
                    } else if (e.key === ' ') {
                        e.preventDefault();
                        this.togglePause();
                    }
                }
            });
            
            this.startAutoplay();
            
            // HOVER PAUSE DISABLED - don't stop on hover
            /*
            if (this.heroSection) {
                this.heroSection.addEventListener('mouseenter', () => {
                    if (!this.manuallyPaused) {
                        this.pauseAutoplay();
                    }
                });
                this.heroSection.addEventListener('mouseleave', () => {
                    if (!this.manuallyPaused && this.isPaused) {
                        this.resumeAutoplay();
                    }
                });
            }
            */
            
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    this.pauseAutoplay();
                } else if (!this.manuallyPaused) {
                    this.resumeAutoplay();
                }
            });
            
            this.initTouchSwipe();
        },
        
        preloadImages() {
            this.slides.forEach(slide => {
                const bgImage = slide.style.backgroundImage;
                const imageUrl = bgImage.slice(5, -2);
                const img = new Image();
                img.src = imageUrl;
            });
        },
        
        goToSlide(index, direction = 'next') {
            this.slides[this.currentSlide].classList.add('prev-active');
            this.slides[this.currentSlide].classList.remove('active');
            this.dots[this.currentSlide].classList.remove('active');
            
            this.currentSlide = index;
            
            this.slides[this.currentSlide].classList.add('active');
            this.slides[this.currentSlide].classList.remove('prev-active');
            this.dots[this.currentSlide].classList.add('active');
            
            setTimeout(() => {
                document.querySelectorAll('.hero-slide.prev-active').forEach(slide => {
                    slide.classList.remove('prev-active');
                });
            }, 1500);
            
            this.progressValue = 0;
            if (this.progressBar) {
                this.progressBar.style.width = '0%';
            }
        },
        
        nextSlide() {
            const next = (this.currentSlide + 1) % this.slides.length;
            this.goToSlide(next, 'next');
        },
        
        prevSlide() {
            const prev = this.currentSlide - 1 < 0 ? this.slides.length - 1 : this.currentSlide - 1;
            this.goToSlide(prev, 'prev');
        },
        
        startAutoplay() {
            if (this.interval) return;
            
            this.isPaused = false;
            this.heroSection?.classList.remove('paused');
            
            this.interval = setInterval(() => {
                if (!this.isPaused) {
                    this.nextSlide();
                }
            }, this.autoplayDuration);
            
            this.startProgress();
        },
        
        startProgress() {
            this.progressValue = 0;
            const incrementTime = 50;
            const incrementValue = (100 / (this.autoplayDuration / incrementTime));
            
            this.progressInterval = setInterval(() => {
                if (!this.isPaused) {
                    this.progressValue += incrementValue;
                    if (this.progressBar) {
                        this.progressBar.style.width = Math.min(this.progressValue, 100) + '%';
                    }
                    
                    if (this.progressValue >= 100) {
                        this.progressValue = 0;
                    }
                }
            }, incrementTime);
        },
        
        stopAutoplay() {
            if (this.interval) {
                clearInterval(this.interval);
                this.interval = null;
            }
            if (this.progressInterval) {
                clearInterval(this.progressInterval);
                this.progressInterval = null;
            }
        },
        
        pauseAutoplay() {
            this.isPaused = true;
            this.heroSection?.classList.add('paused');
        },
        
        resumeAutoplay() {
            this.isPaused = false;
            this.heroSection?.classList.remove('paused');
            
            if (!this.interval) {
                this.startAutoplay();
            }
        },
        
        togglePause() {
            if (this.isPaused || this.manuallyPaused) {
                this.manuallyPaused = false;
                this.resumeAutoplay();
            } else {
                this.manuallyPaused = true;
                this.pauseAutoplay();
            }
        },
        
        initTouchSwipe() {
            let touchStartX = 0;
            let touchEndX = 0;
            const minSwipeDistance = 50;
            
            this.heroSection.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });
            
            this.heroSection.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                this.handleSwipe(touchStartX, touchEndX, minSwipeDistance);
            }, { passive: true });
        },
        
        handleSwipe(startX, endX, minDistance) {
            const diff = startX - endX;
            
            if (Math.abs(diff) > minDistance) {
                this.pauseAutoplay();
                
                if (diff > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
                
                // Auto-resume after 5 seconds
                setTimeout(() => {
                    if (this.isPaused) {
                        this.resumeAutoplay();
                        this.manuallyPaused = false;
                    }
                }, 5000);
            }
        }
    };

    // ===================================
    // INITIALIZATION
    // ===================================
    function init() {
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (!scrollTimeout) {
                scrollTimeout = setTimeout(() => {
                    handleScroll();
                    scrollTimeout = null;
                }, 10);
            }
        });

        if (elements.mobileMenuToggle) {
            elements.mobileMenuToggle.addEventListener('click', toggleMobileMenu);
        }

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

        elements.thumbnails.forEach((thumbnail, index) => {
            thumbnail.addEventListener('click', () => {
                showGalleryImage(index);
            });
        });

        let galleryInterval = null;
        if (elements.galleryImages.length > 0) {
            galleryInterval = startGalleryAutoplay();

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

        initScrollReveal();
        
        heroSlider.init();

        document.querySelectorAll('img').forEach(img => {
            img.addEventListener('error', () => handleImageError(img));
        });

        document.querySelectorAll('.copy-email-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const email = btn.getAttribute('data-email');
                copyEmailToClipboard(email, btn);
            });
        });

        // Back to top button
        const backToTop = document.querySelector('.back-to-top');
        if (backToTop) {
            backToTop.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }

        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                if (window.innerWidth > 768) {
                    closeMobileMenu();
                }
            }, 250);
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && state.mobileMenuOpen) {
                closeMobileMenu();
            }
        });

        handleScroll();
    }

    // ===================================
    // PERFORMANCE OPTIMIZATION
    // ===================================
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
        // Accessibility helpers
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
    // ANALYTICS
    // ===================================
    function trackEvent(category, action, label) {
        console.log('Track Event:', { category, action, label });
    }

    function setupAnalytics() {
        document.querySelectorAll('.btn-primary').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const text = e.target.textContent.trim();
                trackEvent('CTA', 'click', text);
            });
        });

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
        showGalleryImage,
        closeMobileMenu,
        heroSlider
    };

})();