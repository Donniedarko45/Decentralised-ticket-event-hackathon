// OnChain Events - Interactive functionality

document.addEventListener('DOMContentLoaded', function() {
    // Navigation functionality
    initNavigation();
    
    // FAQ accordion
    initFAQ();
    
    // Animated counters
    initAnimatedCounters();
    
    // Scroll animations
    initScrollAnimations();
    
    // Wallet connection
    initWalletConnection();
    
    // Smooth scrolling for navigation links
    initSmoothScrolling();
    
    // Navbar scroll effect
    initNavbarScrollEffect();
    
    // Initialize mobile responsive enhancements
    initMobileEnhancements();
});

// Navigation toggle for mobile
function initNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            navToggle.classList.toggle('active');
            
            // Animate hamburger menu
            const spans = navToggle.querySelectorAll('span');
            spans.forEach((span, index) => {
                if (navToggle.classList.contains('active')) {
                    if (index === 0) span.style.transform = 'rotate(45deg) translateY(6px)';
                    if (index === 1) span.style.opacity = '0';
                    if (index === 2) span.style.transform = 'rotate(-45deg) translateY(-6px)';
                } else {
                    span.style.transform = 'none';
                    span.style.opacity = '1';
                }
            });
        });
        
        // Close mobile menu when clicking on links
        const navLinkItems = navLinks.querySelectorAll('a');
        navLinkItems.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                navToggle.classList.remove('active');
                
                const spans = navToggle.querySelectorAll('span');
                spans.forEach(span => {
                    span.style.transform = 'none';
                    span.style.opacity = '1';
                });
            });
        });
    }
}

// FAQ accordion functionality
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');
            
            // Close all FAQ items
            faqItems.forEach(faq => {
                faq.classList.remove('active');
                const answer = faq.querySelector('.faq-answer');
                answer.style.maxHeight = '0';
            });
            
            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
                const answer = item.querySelector('.faq-answer');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });
}

// Animated counters for statistics
function initAnimatedCounters() {
    const observerOptions = {
        threshold: 0.7,
        rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    const statValues = document.querySelectorAll('.stat-value[data-target]');
    statValues.forEach(stat => observer.observe(stat));
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const suffix = element.textContent.replace(/[0-9]/g, '');
    let current = 0;
    const increment = target / 50;
    
    const updateCounter = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.ceil(current) + suffix;
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target + suffix;
        }
    };
    
    updateCounter();
}

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Elements to animate
    const animatedElements = document.querySelectorAll('.feature-card, .tech-card, .perk-card');
    
    animatedElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = `all 0.6s ease ${index * 0.1}s`;
        observer.observe(element);
    });
}

// Wallet connection functionality
function initWalletConnection() {
    // Find all buttons that should trigger wallet connection
    const allButtons = document.querySelectorAll('button, .btn');
    
    allButtons.forEach(button => {
        const text = button.textContent.trim();
        if (text.includes('Connect Wallet') || text.includes('Get Started') || text.includes('Create Event')) {
            button.addEventListener('click', handleWalletConnection);
        } else if (text.includes('Explore Events')) {
            button.addEventListener('click', handleExploreEvents);
        } else if (text.includes('Contact Us')) {
            button.addEventListener('click', handleContactUs);
        }
    });
}

function handleWalletConnection(e) {
    e.preventDefault();
    
    // Check if Web3 is available
    if (typeof window.ethereum !== 'undefined') {
        connectWallet();
    } else {
        showWalletModal();
    }
}

function handleExploreEvents(e) {
    e.preventDefault();
    showEventsModal();
}

function handleContactUs(e) {
    e.preventDefault();
    showContactModal();
}

async function connectWallet() {
    try {
        // Show loading state
        const button = event.target;
        const originalText = button.textContent;
        button.textContent = 'Connecting...';
        button.disabled = true;
        
        // Request account access
        const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts'
        });
        
        if (accounts.length > 0) {
            showSuccessMessage('Wallet connected successfully!');
            updateWalletButton(accounts[0]);
        }
        
        // Reset button
        button.textContent = originalText;
        button.disabled = false;
    } catch (error) {
        console.error('Error connecting wallet:', error);
        showErrorMessage('Failed to connect wallet. Please try again.');
        
        // Reset button
        const button = event.target;
        button.textContent = 'Connect Wallet';
        button.disabled = false;
    }
}

function showEventsModal() {
    const modal = createEventsModal();
    document.body.appendChild(modal);
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
    
    // Close modal with escape key
    const handleEscape = (e) => {
        if (e.key === 'Escape' && document.body.contains(modal)) {
            document.body.removeChild(modal);
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);
}

function createEventsModal() {
    const modal = document.createElement('div');
    modal.className = 'events-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Featured Events</h3>
                <button class="close-button">&times;</button>
            </div>
            <div class="modal-body">
                <div class="events-grid">
                    <div class="event-card">
                        <div class="event-image">🎵</div>
                        <h4>Summer Music Festival</h4>
                        <p>July 25-27, 2025</p>
                        <div class="event-price">From $89</div>
                        <button class="btn btn--primary btn--sm">View Tickets</button>
                    </div>
                    <div class="event-card">
                        <div class="event-image">🎨</div>
                        <h4>Digital Art Conference</h4>
                        <p>August 10, 2025</p>
                        <div class="event-price">From $125</div>
                        <button class="btn btn--primary btn--sm">View Tickets</button>
                    </div>
                    <div class="event-card">
                        <div class="event-image">🏀</div>
                        <h4>Basketball Championship</h4>
                        <p>September 5, 2025</p>
                        <div class="event-price">From $65</div>
                        <button class="btn btn--primary btn--sm">View Tickets</button>
                    </div>
                </div>
                <div class="modal-footer">
                    <p><em>Connect your wallet to purchase tickets and unlock exclusive perks!</em></p>
                </div>
            </div>
        </div>
    `;
    
    addModalStyles();
    
    // Add close button functionality
    const closeButton = modal.querySelector('.close-button');
    closeButton.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    // Add ticket button functionality
    const ticketButtons = modal.querySelectorAll('.event-card .btn');
    ticketButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            showSuccessMessage('Please connect your wallet first to purchase tickets!');
        });
    });
    
    return modal;
}

function showContactModal() {
    const modal = createContactModal();
    document.body.appendChild(modal);
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
    
    // Close modal with escape key
    const handleEscape = (e) => {
        if (e.key === 'Escape' && document.body.contains(modal)) {
            document.body.removeChild(modal);
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);
}

function createContactModal() {
    const modal = document.createElement('div');
    modal.className = 'contact-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Get in Touch</h3>
                <button class="close-button">&times;</button>
            </div>
            <div class="modal-body">
                <div class="contact-info">
                    <div class="contact-item">
                        <strong>🌐 Community</strong>
                        <p>Join our Discord server for support and updates</p>
                        <a href="#" class="btn btn--outline btn--sm">Join Discord</a>
                    </div>
                    <div class="contact-item">
                        <strong>📧 Email</strong>
                        <p>For business inquiries and partnerships</p>
                        <a href="mailto:hello@onchainevents.com" class="btn btn--outline btn--sm">Send Email</a>
                    </div>
                    <div class="contact-item">
                        <strong>🐦 Twitter</strong>
                        <p>Follow us for the latest updates</p>
                        <a href="#" class="btn btn--outline btn--sm" target="_blank">Follow Us</a>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    addModalStyles();
    
    // Add close button functionality
    const closeButton = modal.querySelector('.close-button');
    closeButton.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    return modal;
}

function showWalletModal() {
    const modal = createWalletModal();
    document.body.appendChild(modal);
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
    
    // Close modal with escape key
    const handleEscape = (e) => {
        if (e.key === 'Escape' && document.body.contains(modal)) {
            document.body.removeChild(modal);
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);
}

function createWalletModal() {
    const modal = document.createElement('div');
    modal.className = 'wallet-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Connect Your Wallet</h3>
                <button class="close-button">&times;</button>
            </div>
            <div class="modal-body">
                <p>To use OnChain Events, you need a Web3 wallet. Here are some popular options:</p>
                <div class="wallet-options">
                    <a href="https://metamask.io/" target="_blank" class="wallet-option">
                        <strong>MetaMask</strong>
                        <span>Most popular Web3 wallet</span>
                    </a>
                    <a href="https://www.coinbase.com/wallet" target="_blank" class="wallet-option">
                        <strong>Coinbase Wallet</strong>
                        <span>Easy-to-use mobile wallet</span>
                    </a>
                    <a href="https://walletconnect.com/" target="_blank" class="wallet-option">
                        <strong>WalletConnect</strong>
                        <span>Connect with various wallets</span>
                    </a>
                </div>
            </div>
        </div>
    `;
    
    addModalStyles();
    
    // Add close button functionality
    const closeButton = modal.querySelector('.close-button');
    closeButton.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    return modal;
}

function addModalStyles() {
    // Check if modal styles already exist
    if (document.querySelector('#modal-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'modal-styles';
    style.textContent = `
        .events-modal, .wallet-modal, .contact-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            animation: modalFadeIn 0.3s ease;
        }
        
        @keyframes modalFadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        .modal-content {
            background: var(--color-surface);
            border-radius: var(--radius-lg);
            max-width: 600px;
            width: 90%;
            margin: var(--space-20);
            border: 1px solid var(--color-card-border);
            animation: modalSlideIn 0.3s ease;
            max-height: 80vh;
            overflow-y: auto;
        }
        
        @keyframes modalSlideIn {
            from { transform: translateY(-50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: var(--space-20);
            border-bottom: 1px solid var(--color-card-border);
        }
        
        .modal-header h3 {
            margin: 0;
        }
        
        .close-button {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: var(--color-text-secondary);
            padding: 0;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: var(--radius-base);
            transition: all var(--duration-fast) var(--ease-standard);
        }
        
        .close-button:hover {
            background: var(--color-secondary);
            color: var(--color-text);
        }
        
        .modal-body {
            padding: var(--space-20);
        }
        
        .modal-footer {
            margin-top: var(--space-20);
            padding-top: var(--space-16);
            border-top: 1px solid var(--color-card-border);
            text-align: center;
        }
        
        .events-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: var(--space-16);
            margin: var(--space-16) 0;
        }
        
        .event-card {
            border: 1px solid var(--color-card-border);
            border-radius: var(--radius-base);
            padding: var(--space-16);
            text-align: center;
            transition: all var(--duration-fast) var(--ease-standard);
        }
        
        .event-card:hover {
            border-color: var(--color-primary);
            box-shadow: var(--shadow-sm);
        }
        
        .event-image {
            font-size: 48px;
            margin-bottom: var(--space-12);
        }
        
        .event-card h4 {
            margin: var(--space-8) 0;
        }
        
        .event-card p {
            color: var(--color-text-secondary);
            margin: var(--space-4) 0;
        }
        
        .event-price {
            font-weight: var(--font-weight-bold);
            color: var(--color-primary);
            margin: var(--space-8) 0;
        }
        
        .wallet-options {
            display: flex;
            flex-direction: column;
            gap: var(--space-12);
            margin-top: var(--space-16);
        }
        
        .wallet-option {
            display: flex;
            flex-direction: column;
            padding: var(--space-16);
            border: 1px solid var(--color-card-border);
            border-radius: var(--radius-base);
            text-decoration: none;
            color: var(--color-text);
            transition: all var(--duration-fast) var(--ease-standard);
        }
        
        .wallet-option:hover {
            border-color: var(--color-primary);
            background: rgba(var(--color-teal-500-rgb), 0.05);
        }
        
        .wallet-option strong {
            margin-bottom: var(--space-4);
        }
        
        .wallet-option span {
            color: var(--color-text-secondary);
            font-size: var(--font-size-sm);
        }
        
        .contact-info {
            display: flex;
            flex-direction: column;
            gap: var(--space-20);
        }
        
        .contact-item {
            border: 1px solid var(--color-card-border);
            border-radius: var(--radius-base);
            padding: var(--space-16);
        }
        
        .contact-item strong {
            display: block;
            margin-bottom: var(--space-8);
        }
        
        .contact-item p {
            margin: var(--space-8) 0;
            color: var(--color-text-secondary);
        }
    `;
    document.head.appendChild(style);
}

function updateWalletButton(address) {
    const allButtons = document.querySelectorAll('button, .btn');
    const shortAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;
    
    allButtons.forEach(button => {
        if (button.textContent.includes('Connect Wallet')) {
            button.textContent = shortAddress;
            button.classList.add('connected');
        }
    });
}

function showSuccessMessage(message) {
    showToast(message, 'success');
}

function showErrorMessage(message) {
    showToast(message, 'error');
}

function showToast(message, type) {
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.textContent = message;
    
    // Check if toast styles already exist
    if (!document.querySelector('#toast-styles')) {
        const style = document.createElement('style');
        style.id = 'toast-styles';
        style.textContent = `
            .toast {
                position: fixed;
                top: 100px;
                right: 20px;
                padding: var(--space-16) var(--space-20);
                border-radius: var(--radius-base);
                color: white;
                font-weight: var(--font-weight-medium);
                z-index: 10001;
                transform: translateX(100%);
                opacity: 0;
                transition: all var(--duration-normal) var(--ease-standard);
                max-width: 300px;
            }
            .toast--success {
                background: var(--color-success);
            }
            .toast--error {
                background: var(--color-error);
            }
            .toast.show {
                transform: translateX(0);
                opacity: 1;
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(toast);
    
    // Show toast
    setTimeout(() => toast.classList.add('show'), 100);
    
    // Hide toast
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (document.body.contains(toast)) {
                document.body.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Navbar scroll effect
function initNavbarScrollEffect() {
    const navbar = document.querySelector('.navbar');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Hide/show navbar on scroll
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
    });
}

// Enhanced button interactions
document.addEventListener('click', function(e) {
    if (e.target.matches('.btn') || e.target.matches('button')) {
        // Add ripple effect
        const button = e.target;
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        const existingRipple = button.querySelector('.ripple');
        if (existingRipple) {
            existingRipple.remove();
        }
        
        button.appendChild(ripple);
        
        // Add ripple styles if not already added
        if (!document.querySelector('#ripple-styles')) {
            const style = document.createElement('style');
            style.id = 'ripple-styles';
            style.textContent = `
                .btn, button {
                    position: relative;
                    overflow: hidden;
                }
                .ripple {
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.3);
                    transform: scale(0);
                    animation: ripple-animation 0.6s linear;
                    pointer-events: none;
                }
                @keyframes ripple-animation {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
});

// Initialize mobile responsive enhancements
function initMobileEnhancements() {
    // Touch-friendly hover effects on mobile
    if ('ontouchstart' in window) {
        const cards = document.querySelectorAll('.feature-card, .tech-card, .perk-card');
        cards.forEach(card => {
            card.addEventListener('touchstart', function() {
                this.classList.add('touched');
            });
            
            card.addEventListener('touchend', function() {
                setTimeout(() => this.classList.remove('touched'), 300);
            });
        });
        
        // Add touch styles
        if (!document.querySelector('#touch-styles')) {
            const style = document.createElement('style');
            style.id = 'touch-styles';
            style.textContent = `
                .feature-card.touched,
                .tech-card.touched,
                .perk-card.touched {
                    transform: translateY(-4px);
                    box-shadow: var(--shadow-lg);
                }
            `;
            document.head.appendChild(style);
        }
    }
}