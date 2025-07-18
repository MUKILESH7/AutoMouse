// Main Script - Common functionality across all pages

// Theme Toggle Logic
const themeToggle = document.getElementById('themeToggle');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const userTheme = localStorage.getItem('theme');
const root = document.documentElement;

function setTheme(theme) {
    if (theme === 'dark') {
        root.setAttribute('data-theme', 'dark');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        root.setAttribute('data-theme', 'light');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
    localStorage.setItem('theme', theme);
}

function toggleTheme() {
    const current = root.getAttribute('data-theme');
    setTheme(current === 'dark' ? 'light' : 'dark');
}

// Initialize theme on load
if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
    
    if (userTheme) {
        setTheme(userTheme);
    } else {
        setTheme(prefersDark ? 'dark' : 'light');
    }
}

// Navigation active state
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
}

// Initialize navigation
setActiveNavLink();

// Utility functions
function formatPrice(price) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(price);
}

function formatNumber(num) {
    return new Intl.NumberFormat('en-US').format(num);
}

// Favorites management
class FavoritesManager {
    constructor() {
        this.storageKey = 'carShowcaseFavorites';
    }

    getFavorites() {
        const favorites = localStorage.getItem(this.storageKey);
        return favorites ? JSON.parse(favorites) : [];
    }

    addFavorite(carId) {
        const favorites = this.getFavorites();
        if (!favorites.includes(carId)) {
            favorites.push(carId);
            localStorage.setItem(this.storageKey, JSON.stringify(favorites));
            this.updateFavoritesCount();
        }
    }

    removeFavorite(carId) {
        const favorites = this.getFavorites();
        const updatedFavorites = favorites.filter(id => id !== carId);
        localStorage.setItem(this.storageKey, JSON.stringify(updatedFavorites));
        this.updateFavoritesCount();
    }

    isFavorite(carId) {
        const favorites = this.getFavorites();
        return favorites.includes(carId);
    }

    updateFavoritesCount() {
        const favorites = this.getFavorites();
        const countElements = document.querySelectorAll('[data-favorites-count]');
        countElements.forEach(element => {
            element.textContent = favorites.length;
        });
    }

    getFavoritesCount() {
        return this.getFavorites().length;
    }
}

// Global favorites manager
window.favoritesManager = new FavoritesManager();

// Initialize favorites count on page load
document.addEventListener('DOMContentLoaded', () => {
    window.favoritesManager.updateFavoritesCount();
    
    // Load featured cars on homepage
    if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
        loadFeaturedCars();
    }
});

// Load featured cars for homepage
function loadFeaturedCars() {
    try {
        // Use hardcoded car data instead of JSON
        const featuredCars = carData.slice(0, 3); // Show first 3 cars as featured
        
        const featuredGrid = document.getElementById('featuredGrid');
        if (featuredGrid) {
            featuredGrid.innerHTML = featuredCars.map(car => `
                <div class="car-card" onclick="window.location.href='car.html?id=${car.id}'">
                    <img src="${car.image}" alt="${car.name}" class="car-image" loading="lazy">
                    <div class="car-content">
                        <h3 class="car-name">${car.name}</h3>
                        <div class="car-specs">
                            <span class="car-spec">
                                <i class="fas fa-tachometer-alt"></i>
                                ${car.specs.power}
                            </span>
                            <span class="car-spec">
                                <i class="fas fa-dollar-sign"></i>
                                $${car.price.toLocaleString()}
                            </span>
                        </div>
                        <div class="car-actions">
                            <button class="favorite-btn ${window.favoritesManager.isFavorite(car.id) ? 'active' : ''}" 
                                    onclick="event.stopPropagation(); toggleFavorite('${car.id}', this)">
                                <i class="${window.favoritesManager.isFavorite(car.id) ? 'fas' : 'far'} fa-heart"></i>
                            </button>
                            <a href="car.html?id=${car.id}" class="view-details-btn">
                                View Details
                            </a>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading featured cars:', error);
    }
}

// Global function to toggle favorite
window.toggleFavorite = function(carId, button) {
    const icon = button.querySelector('i');
    
    if (window.favoritesManager.isFavorite(carId)) {
        window.favoritesManager.removeFavorite(carId);
        button.classList.remove('active');
        icon.className = 'far fa-heart';
        window.carShowcaseUtils.showSuccess('Removed from favorites', document.body);
    } else {
        window.favoritesManager.addFavorite(carId);
        button.classList.add('active');
        icon.className = 'fas fa-heart';
        window.carShowcaseUtils.showSuccess('Added to favorites', document.body);
    }
};

// GSAP Animations
if (typeof gsap !== 'undefined') {
    // Animate elements on page load
    gsap.from('.hero-content', {
        duration: 1,
        y: 50,
        opacity: 0,
        ease: 'power3.out'
    });

    gsap.from('.section-header', {
        duration: 0.8,
        y: 30,
        opacity: 0,
        ease: 'power2.out',
        stagger: 0.2
    });

    gsap.from('.car-card', {
        duration: 0.6,
        y: 30,
        opacity: 0,
        ease: 'power2.out',
        stagger: 0.1
    });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Loading state management
function showLoading(element) {
    element.classList.add('loading');
}

function hideLoading(element) {
    element.classList.remove('loading');
}

// Error handling
function showError(message, container) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `
        <i class="fas fa-exclamation-triangle"></i>
        <p>${message}</p>
    `;
    container.appendChild(errorDiv);
}

// Success message
function showSuccess(message, container) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <p>${message}</p>
    `;
    container.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.remove();
    }, 3000);
}

// Debounce function for search
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

// Export common functions for other scripts
window.carShowcaseUtils = {
    formatPrice,
    formatNumber,
    showLoading,
    hideLoading,
    showError,
    showSuccess,
    debounce
}; 