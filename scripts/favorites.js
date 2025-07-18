// Favorites Script - Handles favorite cars functionality

class FavoritesPage {
    constructor() {
        this.cars = [];
        this.favoriteCars = [];
        this.init();
    }

    async init() {
        await this.loadCars();
        this.loadFavorites();
        this.renderFavorites();
        this.updateStats();
        this.setupEventListeners();
    }

    async loadCars() {
        try {
            // Use hardcoded car data instead of JSON
            this.cars = carData;
        } catch (error) {
            console.error('Error loading cars:', error);
            this.showError('Failed to load cars');
        }
    }

    loadFavorites() {
        const favoriteIds = window.favoritesManager.getFavorites();
        this.favoriteCars = this.cars.filter(car => favoriteIds.includes(car.id));
    }

    renderFavorites() {
        const favoritesGrid = document.getElementById('favoritesGrid');
        const emptyState = document.getElementById('emptyState');

        if (!favoritesGrid) return;

        if (this.favoriteCars.length === 0) {
            favoritesGrid.style.display = 'none';
            if (emptyState) {
                emptyState.style.display = 'block';
            }
            return;
        }

        favoritesGrid.style.display = 'grid';
        if (emptyState) {
            emptyState.style.display = 'none';
        }

        favoritesGrid.innerHTML = this.favoriteCars.map(car => `
            <div class="car-card" data-car-id="${car.id}">
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
                        <span class="car-spec">
                            <i class="fas fa-calendar"></i>
                            ${car.year}
                        </span>
                    </div>
                    <div class="car-actions">
                        <button class="favorite-btn active" data-car-id="${car.id}">
                            <i class="fas fa-heart"></i>
                        </button>
                        <a href="car.html?id=${car.id}" class="view-details-btn">
                            View Details
                        </a>
                        <button class="compare-btn" onclick="addToCompare('${car.id}')">
                            <i class="fas fa-balance-scale"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        // Add event listeners for favorite buttons
        favoritesGrid.querySelectorAll('.favorite-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const carId = btn.getAttribute('data-car-id');
                this.removeFavorite(carId);
            });
        });

        // Add click handlers for car cards
        favoritesGrid.querySelectorAll('.car-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.favorite-btn') && !e.target.closest('.view-details-btn') && !e.target.closest('.compare-btn')) {
                    const carId = card.getAttribute('data-car-id');
                    window.location.href = `car.html?id=${carId}`;
                }
            });
        });
    }

    removeFavorite(carId) {
        window.favoritesManager.removeFavorite(carId);
        this.favoriteCars = this.favoriteCars.filter(car => car.id !== carId);
        this.renderFavorites();
        this.updateStats();
        
        // Remove the card with animation
        const card = document.querySelector(`[data-car-id="${carId}"]`);
        if (card && typeof gsap !== 'undefined') {
            gsap.to(card, {
                opacity: 0,
                y: -20,
                duration: 0.3,
                onComplete: () => {
                    card.remove();
                    this.renderFavorites();
                }
            });
        } else {
            this.renderFavorites();
        }

        window.carShowcaseUtils.showSuccess('Removed from favorites', document.body);
    }

    updateStats() {
        const favoritesCount = document.getElementById('favoritesCount');
        const totalHP = document.getElementById('totalHP');
        const totalValue = document.getElementById('totalValue');

        if (favoritesCount) {
            favoritesCount.textContent = this.favoriteCars.length;
        }

        if (totalHP) {
            const hp = this.favoriteCars.reduce((sum, car) => {
                const power = parseInt(car.specs.power.replace(/[^\d.]/g, ''));
                return sum + (isNaN(power) ? 0 : power);
            }, 0);
            totalHP.textContent = hp.toLocaleString();
        }

        if (totalValue) {
            const value = this.favoriteCars.reduce((sum, car) => {
                return sum + car.price;
            }, 0);
            totalValue.textContent = `$${value.toLocaleString()}`;
        }
    }

    setupEventListeners() {
        // Add any additional event listeners here
    }

    showError(message) {
        const favoritesGrid = document.getElementById('favoritesGrid');
        if (favoritesGrid) {
            favoritesGrid.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>Error</h3>
                    <p>${message}</p>
                </div>
            `;
        }
    }
}

// Global function to add car to compare
window.addToCompare = function(carId) {
    const compareCars = JSON.parse(localStorage.getItem('compareCars') || '[]');
    if (compareCars.length >= 2) {
        window.carShowcaseUtils.showError('You can only compare 2 cars at a time', document.body);
        return;
    }
    if (!compareCars.includes(carId)) {
        compareCars.push(carId);
        localStorage.setItem('compareCars', JSON.stringify(compareCars));
        window.carShowcaseUtils.showSuccess('Added to compare list', document.body);
    } else {
        window.carShowcaseUtils.showError('Car already in compare list', document.body);
    }
};

// Initialize favorites page
document.addEventListener('DOMContentLoaded', () => {
    new FavoritesPage();
}); 