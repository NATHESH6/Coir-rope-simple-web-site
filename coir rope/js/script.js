// COKO ROPE - Main JavaScript File (Optimized for iOS)

class CokoRopeWebsite {
    constructor() {
        this.isIOS = this.detectIOS();
        this.isMobile = this.detectMobile();
        this.currentTheme = localStorage.getItem('theme') || 'light';
        
        // Initialize on DOM ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    detectIOS() {
        return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    }

    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    init() {
        this.setupIOSStyles();
        this.initThemeToggle();
        this.initMobileMenu();
        this.initSmoothScroll();
        this.initScrollTop();
        this.initAnimations();
        this.initCounters();
        this.initProgressBars();
        this.initMobilePreview();
        this.addEventListeners();
        this.setupAccessibility();
    }

    setupIOSStyles() {
        if (!this.isIOS) return;
        
        const iosStyles = document.createElement('style');
        iosStyles.textContent = `
            /* iOS-specific fixes */
            .nav-menu {
                -webkit-overflow-scrolling: touch !important;
                padding-top: env(safe-area-inset-top) !important;
                padding-bottom: env(safe-area-inset-bottom) !important;
            }
            
            .device-ios .device-screen {
                border-radius: 39px !important;
            }
            
            input, textarea, select, button {
                -webkit-appearance: none;
                border-radius: 0;
            }
            
            /* Fix for 100vh on iOS */
            .hero {
                min-height: -webkit-fill-available;
            }
            
            /* Prevent text size adjustment on orientation change */
            html {
                -webkit-text-size-adjust: 100%;
            }
        `;
        document.head.appendChild(iosStyles);
    }

    // Theme Toggle
    initThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        
        // Set initial theme
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        
        themeToggle?.addEventListener('click', () => {
            const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
            this.switchTheme(newTheme);
        });
        
        // Listen for system theme changes
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
        prefersDark.addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                this.switchTheme(e.matches ? 'dark' : 'light');
            }
        });
    }

    switchTheme(newTheme) {
        this.currentTheme = newTheme;
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Add transition effect
        document.body.classList.add('theme-transition');
        setTimeout(() => {
            document.body.classList.remove('theme-transition');
        }, 300);
    }

    // Mobile Menu
    initMobileMenu() {
        const menuToggle = document.getElementById('menuToggle');
        const navMenu = document.getElementById('navMenu');
        
        if (!menuToggle || !navMenu) return;
        
        // Setup click handler
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleMobileMenu();
        });
        
        // Setup menu item click handlers
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
                this.closeMobileMenu();
            }
        });
        
        // iOS specific: handle touch events
        if (this.isIOS) {
            this.setupIOSTouchMenu(navMenu);
        }
    }

    toggleMobileMenu() {
        const menuToggle = document.getElementById('menuToggle');
        const navMenu = document.getElementById('navMenu');
        
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        if (navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
            this.animateMenuItems();
        } else {
            document.body.style.overflow = '';
        }
    }

    closeMobileMenu() {
        const menuToggle = document.getElementById('menuToggle');
        const navMenu = document.getElementById('navMenu');
        
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }

    animateMenuItems() {
        const menuItems = document.querySelectorAll('.nav-menu li');
        menuItems.forEach((item, index) => {
            item.style.setProperty('--item-index', index);
            item.classList.add('menu-item-animate');
            
            setTimeout(() => {
                item.classList.remove('menu-item-animate');
            }, 1000);
        });
    }

    // Smooth Scroll
    initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (href === '#' || href === '#!') return;
                
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    this.scrollToSection(target);
                    
                    // Update active nav link
                    this.updateActiveNavLink(href);
                }
            });
        });
    }

    scrollToSection(element) {
        const offset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }

    updateActiveNavLink(targetId) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === targetId) {
                link.classList.add('active');
            }
        });
    }

    // Scroll to Top
    initScrollTop() {
        const scrollTop = document.getElementById('scrollTop');
        if (!scrollTop) return;
        
        // Show/hide on scroll
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                scrollTop.classList.add('visible');
            } else {
                scrollTop.classList.remove('visible');
            }
            
            this.updateActiveNavOnScroll();
        });
        
        // Click handler
        scrollTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    updateActiveNavOnScroll() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                this.updateActiveNavLink(`#${sectionId}`);
            }
        });
    }

    // Animations
    initAnimations() {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    
                    // Trigger specific animations
                    if (entry.target.querySelector('.stat-number')) {
                        this.animateCounters(entry.target);
                    }
                    
                    if (entry.target.querySelector('.progress-fill')) {
                        this.animateProgressBars(entry.target);
                    }
                }
            });
        }, observerOptions);

        // Observe sections
        document.querySelectorAll('.section').forEach(section => {
            observer.observe(section);
        });
    }

    // Counters
    initCounters() {
        this.animateCounters();
    }

    animateCounters(parent = document) {
        const counters = parent.querySelectorAll('.stat-number');
        
        counters.forEach(counter => {
            if (counter.classList.contains('animated')) return;
            
            const target = parseInt(counter.getAttribute('data-count')) || 0;
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;
            
            const updateCounter = () => {
                current += step;
                if (current < target) {
                    counter.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                    counter.classList.add('animated');
                }
            };
            
            updateCounter();
        });
    }

    // Progress Bars
    initProgressBars() {
        this.animateProgressBars();
    }

    animateProgressBars(parent = document) {
        const progressBars = parent.querySelectorAll('.progress-fill');
        
        progressBars.forEach(bar => {
            if (bar.classList.contains('animated')) return;
            
            const width = bar.getAttribute('data-width') || '0';
            bar.classList.add('animated');
            
            // Use requestAnimationFrame for smooth animation
            const animate = () => {
                bar.style.width = `${width}%`;
            };
            
            requestAnimationFrame(animate);
        });
    }

    // Mobile Preview
    initMobilePreview() {
        this.previewManager = new MobilePreviewManager(this.isIOS);
    }

    // Event Listeners
    addEventListeners() {
        // Window resize
        window.addEventListener('resize', this.handleResize.bind(this));
        
        // Keyboard navigation
        document.addEventListener('keydown', this.handleKeyboard.bind(this));
        
        // Product card hover
        this.setupProductCardHover();
        
        // Button ripple effects
        this.setupRippleEffects();
        
        // iOS specific
        if (this.isIOS) {
            this.setupIOSEvents();
        }
    }

    handleResize() {
        // Close mobile menu on resize to desktop
        if (window.innerWidth > 768) {
            this.closeMobileMenu();
        }
    }

    handleKeyboard(e) {
        // ESC to close menu
        if (e.key === 'Escape') {
            this.closeMobileMenu();
            this.previewManager?.closePreviewOverlay();
        }
        
        // Tab navigation
        if (e.key === 'Tab') {
            this.handleTabNavigation(e);
        }
    }

    handleTabNavigation(e) {
        const focusable = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
        const focusableElements = document.querySelectorAll(focusable);
        
        if (focusableElements.length === 0) return;
        
        const first = focusableElements[0];
        const last = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    }

    setupProductCardHover() {
        document.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                if (!this.isMobile) { // Disable hover on touch devices
                    card.style.transform = 'translateY(-10px) scale(1.02)';
                }
            });
            
            card.addEventListener('mouseleave', () => {
                if (!this.isMobile) {
                    card.style.transform = '';
                }
            });
            
            // Touch devices: add active state
            if (this.isMobile) {
                card.addEventListener('touchstart', () => {
                    card.classList.add('active');
                });
                
                card.addEventListener('touchend', () => {
                    setTimeout(() => {
                        card.classList.remove('active');
                    }, 300);
                });
            }
        });
    }

    setupRippleEffects() {
        document.querySelectorAll('.btn').forEach(button => {
            button.addEventListener('click', (e) => {
                this.createRipple(e, button);
            });
        });
    }

    createRipple(event, element) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple 0.6s linear;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            pointer-events: none;
            z-index: 1;
        `;
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    }

    setupIOSEvents() {
        // Prevent elastic scrolling on non-scrollable areas
        document.addEventListener('touchmove', (e) => {
            const target = e.target;
            if (target.closest('.nav-menu') || target.closest('.device-preview-overlay')) {
                e.preventDefault();
            }
        }, { passive: false });
        
        // Fix for iOS click delays
        document.addEventListener('touchstart', () => {}, { passive: true });
    }

    setupAccessibility() {
        // Add ARIA attributes
        const menuToggle = document.getElementById('menuToggle');
        if (menuToggle) {
            menuToggle.setAttribute('aria-expanded', 'false');
            menuToggle.setAttribute('aria-label', 'Toggle navigation menu');
            
            menuToggle.addEventListener('click', () => {
                const expanded = menuToggle.classList.contains('active');
                menuToggle.setAttribute('aria-expanded', expanded);
            });
        }
        
        // Add skip to content link
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.className = 'skip-to-content';
        skipLink.textContent = 'Skip to main content';
        document.body.insertBefore(skipLink, document.body.firstChild);
        
        // Focus management
        document.addEventListener('focusin', (e) => {
            if (e.target.closest('.nav-menu.active')) {
                e.target.scrollIntoView({ block: 'nearest' });
            }
        });
    }

    // iOS-specific menu handling
    setupIOSTouchMenu(navMenu) {
        let startY = 0;
        let currentY = 0;
        
        navMenu.addEventListener('touchstart', (e) => {
            startY = e.touches[0].clientY;
            currentY = startY;
        }, { passive: true });
        
        navMenu.addEventListener('touchmove', (e) => {
            currentY = e.touches[0].clientY;
            const diff = currentY - startY;
            
            // Prevent overscroll
            if (navMenu.scrollTop === 0 && diff > 0) {
                e.preventDefault();
            }
            
            if (navMenu.scrollHeight <= navMenu.clientHeight + navMenu.scrollTop && diff < 0) {
                e.preventDefault();
            }
        }, { passive: false });
    }
}

// Mobile Preview Manager
class MobilePreviewManager {
    constructor(isIOS = false) {
        this.isIOS = isIOS;
        this.currentDevice = 'mobile';
        this.currentZoom = 100;
        this.currentRotation = 0;
        this.isRotated = false;
        this.isActive = false;
        
        this.elements = {
            previewToggle: document.getElementById('mobilePreviewToggle'),
            previewOverlay: document.getElementById('devicePreviewOverlay'),
            closePreview: document.getElementById('closePreview'),
            deviceOptions: document.querySelectorAll('.device-option'),
            previewFrame: document.getElementById('previewFrame'),
            zoomLevel: document.querySelector('.zoom-level'),
            zoomButtons: document.querySelectorAll('.zoom-btn'),
            themeButtons: document.querySelectorAll('.theme-btn'),
            rotateButton: document.querySelector('.rotate-btn')
        };
        
        this.init();
    }

    init() {
        if (!this.elements.previewOverlay) return;
        
        this.setupEventListeners();
        this.setupTouchGestures();
        this.setupKeyboardNavigation();
        this.setupIOSFeatures();
    }

    setupEventListeners() {
        // Toggle preview
        this.elements.previewToggle?.addEventListener('click', () => this.togglePreview());
        
        // Close preview
        this.elements.closePreview?.addEventListener('click', () => this.closePreviewOverlay());
        
        // Close on ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isActive) {
                this.closePreviewOverlay();
            }
        });
        
        // Close on overlay click
        this.elements.previewOverlay?.addEventListener('click', (e) => {
            if (e.target === this.elements.previewOverlay) {
                this.closePreviewOverlay();
            }
        });
        
        // Device selection
        this.elements.deviceOptions?.forEach(option => {
            option.addEventListener('click', () => {
                this.selectDevice(option.dataset.device);
            });
        });
        
        // Zoom controls
        this.elements.zoomButtons?.forEach(button => {
            button.addEventListener('click', () => {
                this.handleZoom(button.dataset.action);
            });
        });
        
        // Theme controls
        this.elements.themeButtons?.forEach(button => {
            button.addEventListener('click', () => {
                this.changePreviewTheme(button.dataset.theme);
            });
        });
        
        // Rotate device
        this.elements.rotateButton?.addEventListener('click', () => this.rotateDevice());
        
        // Navigation sync
        this.setupNavigationSync();
    }

    togglePreview() {
        if (this.isActive) {
            this.closePreviewOverlay();
        } else {
            this.openPreviewOverlay();
        }
    }

    openPreviewOverlay() {
        this.elements.previewOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        this.isActive = true;
        
        this.updatePreviewFrame();
        this.animatePreviewOpen();
        
        // Focus management for accessibility
        setTimeout(() => {
            this.elements.closePreview?.focus();
        }, 100);
    }

    closePreviewOverlay() {
        this.elements.previewOverlay.classList.remove('active');
        document.body.style.overflow = '';
        this.isActive = false;
        this.resetPreviewTransformations();
    }

    selectDevice(device) {
        this.currentDevice = device;
        
        // Update active state
        this.elements.deviceOptions?.forEach(option => {
            option.classList.toggle('active', option.dataset.device === device);
        });
        
        // Update device frame
        this.updateDeviceFrame();
        
        // Announce for screen readers
        this.announceDeviceChange(device);
    }

    updateDeviceFrame() {
        const frame = this.elements.previewFrame?.querySelector('.device-frame');
        if (!frame) return;
        
        frame.className = `device-frame device-${this.currentDevice}`;
        
        // Adjust zoom based on device
        switch(this.currentDevice) {
            case 'mobile':
            case 'ios':
                this.currentZoom = 100;
                break;
            case 'tablet':
                this.currentZoom = 80;
                break;
            case 'desktop':
                this.currentZoom = 60;
                break;
        }
        
        this.updateZoomDisplay();
        this.applyDeviceTransformations();
    }

    handleZoom(action) {
        switch(action) {
            case 'zoom-in':
                this.currentZoom = Math.min(this.currentZoom + 10, 200);
                break;
            case 'zoom-out':
                this.currentZoom = Math.max(this.currentZoom - 10, 50);
                break;
        }
        
        this.updateZoomDisplay();
        this.applyDeviceTransformations();
    }

    updateZoomDisplay() {
        if (this.elements.zoomLevel) {
            this.elements.zoomLevel.textContent = `${this.currentZoom}%`;
        }
    }

    rotateDevice() {
        this.isRotated = !this.isRotated;
        this.currentRotation = this.isRotated ? 90 : 0;
        
        this.applyDeviceTransformations();
        
        // Update button icon
        const icon = this.elements.rotateButton?.querySelector('i');
        if (icon) {
            icon.className = this.isRotated ? 'fas fa-redo' : 'fas fa-undo';
        }
    }

    applyDeviceTransformations() {
        const frame = this.elements.previewFrame?.querySelector('.device-frame');
        if (!frame) return;
        
        frame.style.transform = `
            scale(${this.currentZoom / 100})
            rotate(${this.currentRotation}deg)
        `;
        
        // Adjust frame for rotation
        if (this.isRotated) {
            this.elements.previewFrame.style.width = '568px';
            this.elements.previewFrame.style.height = '320px';
        } else {
            this.elements.previewFrame.style.width = 'auto';
            this.elements.previewFrame.style.height = 'auto';
        }
    }

    resetPreviewTransformations() {
        this.currentZoom = 100;
        this.currentRotation = 0;
        this.isRotated = false;
        this.updateZoomDisplay();
        this.applyDeviceTransformations();
    }

    changePreviewTheme(theme) {
        // Update active button
        this.elements.themeButtons?.forEach(button => {
            button.classList.toggle('active', button.dataset.theme === theme);
        });
        
        // Update iframe theme via postMessage
        const iframe = document.querySelector('.device-screen iframe');
        if (iframe?.contentWindow) {
            try {
                iframe.contentWindow.postMessage({
                    type: 'CHANGE_THEME',
                    theme: theme
                }, '*');
            } catch (e) {
                console.warn('Cannot change iframe theme:', e);
            }
        }
    }

    updatePreviewFrame() {
        const iframe = document.querySelector('.device-screen iframe');
        if (iframe) {
            const currentSection = this.getCurrentSection();
            iframe.src = `index.html${currentSection}`;
        }
    }

    getCurrentSection() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 100;
        
        for (const section of sections) {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                return `#${section.id}`;
            }
        }
        
        return '#home';
    }

    setupNavigationSync() {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                if (!this.isActive) return;
                
                const href = link.getAttribute('href');
                const iframe = document.querySelector('.device-screen iframe');
                
                if (iframe && href && href.startsWith('#')) {
                    setTimeout(() => {
                        iframe.src = `index.html${href}`;
                    }, 300);
                }
            });
        });
    }

    setupTouchGestures() {
        if (!this.elements.previewOverlay) return;
        
        let startY = 0;
        
        // Swipe down to close
        this.elements.previewOverlay.addEventListener('touchstart', (e) => {
            startY = e.touches[0].clientY;
        }, { passive: true });
        
        this.elements.previewOverlay.addEventListener('touchmove', (e) => {
            if (!startY) return;
            
            const diffY = startY - e.touches[0].clientY;
            
            // Swipe down to close
            if (diffY < -100) {
                this.closePreviewOverlay();
                startY = 0;
            }
        }, { passive: true });
        
        // Pinch zoom
        let initialDistance = null;
        
        this.elements.previewFrame?.addEventListener('touchstart', (e) => {
            if (e.touches.length === 2) {
                initialDistance = this.getTouchDistance(e.touches);
            }
        }, { passive: true });
        
        this.elements.previewFrame?.addEventListener('touchmove', (e) => {
            if (e.touches.length === 2 && initialDistance) {
                e.preventDefault();
                const currentDistance = this.getTouchDistance(e.touches);
                const scale = currentDistance / initialDistance;
                
                this.currentZoom = Math.min(Math.max(this.currentZoom * scale, 50), 200);
                this.updateZoomDisplay();
                this.applyDeviceTransformations();
            }
        }, { passive: false });
        
        this.elements.previewFrame?.addEventListener('touchend', () => {
            initialDistance = null;
        });
    }

    getTouchDistance(touches) {
        const dx = touches[0].clientX - touches[1].clientX;
        const dy = touches[0].clientY - touches[1].clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (!this.isActive) return;
            
            switch(e.key) {
                case 'ArrowLeft':
                case 'ArrowRight':
                    this.handleDeviceNavigation(e.key);
                    break;
                case '+':
                    if (e.shiftKey) this.handleZoom('zoom-in');
                    break;
                case '-':
                    this.handleZoom('zoom-out');
                    break;
                case 'r':
                case 'R':
                    this.rotateDevice();
                    break;
                case '1':
                case '2':
                case '3':
                case '4':
                    this.selectDeviceByNumber(e.key);
                    break;
            }
        });
    }

    handleDeviceNavigation(key) {
        const devices = ['mobile', 'tablet', 'desktop', 'ios'];
        let index = devices.indexOf(this.currentDevice);
        
        if (key === 'ArrowRight') {
            index = (index + 1) % devices.length;
        } else if (key === 'ArrowLeft') {
            index = (index - 1 + devices.length) % devices.length;
        }
        
        this.selectDevice(devices[index]);
    }

    selectDeviceByNumber(key) {
        const map = { '1': 'mobile', '2': 'tablet', '3': 'desktop', '4': 'ios' };
        if (map[key]) {
            this.selectDevice(map[key]);
        }
    }

    setupIOSFeatures() {
        if (!this.isIOS) return;
        
        // Add iOS-specific device frame
        const iosFrameStyle = document.createElement('style');
        iosFrameStyle.textContent = `
            .device-ios {
                position: relative;
                overflow: hidden;
            }
            
            .device-ios::before {
                content: '';
                position: absolute;
                top: 0;
                left: 50%;
                transform: translateX(-50%);
                width: 150px;
                height: 25px;
                background: #000;
                border-bottom-left-radius: 20px;
                border-bottom-right-radius: 20px;
                z-index: 10;
            }
            
            .device-ios .device-home-button {
                width: 60px;
                height: 6px;
                border-radius: 3px;
                background: #666;
                border: none;
                bottom: 15px;
            }
        `;
        document.head.appendChild(iosFrameStyle);
    }

    announceDeviceChange(device) {
        // For screen readers
        const announcement = document.createElement('div');
        announcement.className = 'sr-only';
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.textContent = `Switched to ${device} preview`;
        
        document.body.appendChild(announcement);
        setTimeout(() => announcement.remove(), 1000);
    }

    animatePreviewOpen() {
        const content = this.elements.previewOverlay.querySelector('.preview-content');
        if (content) {
            content.style.animation = 'slideInUp 0.4s ease';
            setTimeout(() => content.style.animation = '', 400);
        }
    }
}

// Add global styles
const globalStyles = document.createElement('style');
globalStyles.textContent = `
    /* Ripple animation */
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    /* Slide in animation */
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translate(-50%, -40%);
        }
        to {
            opacity: 1;
            transform: translate(-50%, -50%);
        }
    }
    
    /* Menu item animation */
    @keyframes menuItemSlide {
        from {
            opacity: 0;
            transform: translateX(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    .menu-item-animate {
        animation: menuItemSlide 0.5s ease forwards;
        animation-delay: calc(var(--item-index) * 0.1s);
    }
    
    /* Skip to content link */
    .skip-to-content {
        position: absolute;
        top: -40px;
        left: 0;
        background: var(--primary-color);
        color: white;
        padding: 8px;
        text-decoration: none;
        z-index: 9999;
    }
    
    .skip-to-content:focus {
        top: 0;
    }
    
    /* Screen reader only */
    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
    }
    
    /* Theme transition */
    .theme-transition * {
        transition: background-color 0.3s ease, 
                   color 0.3s ease, 
                   border-color 0.3s ease !important;
    }
    
    /* iOS fix for hover effects */
    @media (hover: none) and (pointer: coarse) {
        .product-card:hover {
            transform: none !important;
        }
        
        .btn:hover, .nav-link:hover {
            transform: none !important;
        }
    }
    
    /* Reduced motion */
    @media (prefers-reduced-motion: reduce) {
        *,
        *::before,
        *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
    }
`;
document.head.appendChild(globalStyles);

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const website = new CokoRopeWebsite();
    window.CokoRopeWebsite = website; // For debugging
});

// Handle messages from iframe (for theme switching)
window.addEventListener('message', (event) => {
    if (event.data.type === 'CHANGE_THEME') {
        document.documentElement.setAttribute('data-theme', event.data.theme);
        localStorage.setItem('theme', event.data.theme);
    }
});