// Car Detail Script - Handles individual car page functionality

class CarDetail {
    constructor() {
        this.car = null;
        this.carId = this.getCarIdFromUrl();
        this.init();
    }

    getCarIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id');
    }

    async init() {
        if (!this.carId) {
            this.showError('No car ID provided');
            return;
        }

        await this.loadCar();
        this.renderCarDetails();
        this.loadRelatedCars();
        this.setupEventListeners();
    }

    async loadCar() {
        try {
            const response = await fetch('./data/cars.json');
            const data = await response.json();
            this.car = data.cars.find(car => car.id === this.carId);
            
            if (!this.car) {
                this.showError('Car not found');
                return;
            }

            // Update page title
            document.title = `${this.car.name} - Car Showcase`;
        } catch (error) {
            console.error('Error loading car:', error);
            this.showError('Failed to load car details');
        }
    }

    renderCarDetails() {
        const content = document.getElementById('carDetailsContent');
        if (!content || !this.car) return;

        const isFavorite = window.favoritesManager.isFavorite(this.car.id);
        const favoriteIcon = isFavorite ? 'fas fa-heart' : 'far fa-heart';
        const favoriteClass = isFavorite ? 'active' : '';

        content.innerHTML = `
            <div class="car-image-section">
                <img src="${this.car.image}" alt="${this.car.name}" class="car-image-large">
            </div>
            <div class="car-info">
                <div class="car-header">
                    <h1 class="car-title">${this.car.name}</h1>
                    <button class="favorite-btn ${favoriteClass}" data-car-id="${this.car.id}">
                        <i class="${favoriteIcon}"></i>
                    </button>
                </div>
                
                <div class="car-meta">
                    <span class="car-brand">${this.car.brand}</span>
                    <span class="car-year">${this.car.year}</span>
                    <span class="car-type">${this.car.type}</span>
                    <span class="car-price">${window.carShowcaseUtils.formatPrice(this.car.price)}</span>
                </div>

                <p class="car-description">${this.car.description}</p>

                <div class="car-specs-detailed">
                    <div class="spec-item">
                        <span class="spec-label">Engine</span>
                        <span class="spec-value">${this.car.specs.engine}</span>
                    </div>
                    <div class="spec-item">
                        <span class="spec-label">Power</span>
                        <span class="spec-value">${this.car.specs.power}</span>
                    </div>
                    <div class="spec-item">
                        <span class="spec-label">Torque</span>
                        <span class="spec-value">${this.car.specs.torque}</span>
                    </div>
                    <div class="spec-item">
                        <span class="spec-label">0-60 mph</span>
                        <span class="spec-value">${this.car.specs.acceleration}</span>
                    </div>
                    <div class="spec-item">
                        <span class="spec-label">Top Speed</span>
                        <span class="spec-value">${this.car.specs.topSpeed}</span>
                    </div>
                    <div class="spec-item">
                        <span class="spec-label">Weight</span>
                        <span class="spec-value">${window.carShowcaseUtils.formatNumber(this.car.specs.weight)} kg</span>
                    </div>
                    <div class="spec-item">
                        <span class="spec-label">Length</span>
                        <span class="spec-value">${this.car.specs.length} mm</span>
                    </div>
                    <div class="spec-item">
                        <span class="spec-label">Width</span>
                        <span class="spec-value">${this.car.specs.width} mm</span>
                    </div>
                    <div class="spec-item">
                        <span class="spec-label">Height</span>
                        <span class="spec-value">${this.car.specs.height} mm</span>
                    </div>
                    <div class="spec-item">
                        <span class="spec-label">Seats</span>
                        <span class="spec-value">${this.car.specs.seats}</span>
                    </div>
                    <div class="spec-item">
                        <span class="spec-label">Transmission</span>
                        <span class="spec-value">${this.car.specs.transmission}</span>
                    </div>
                    <div class="spec-item">
                        <span class="spec-label">Drivetrain</span>
                        <span class="spec-value">${this.car.specs.drivetrain}</span>
                    </div>
                </div>

                <div class="car-features">
                    <h3>Key Features</h3>
                    <ul class="features-list">
                        ${this.car.features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                </div>

                <div class="car-colors">
                    <h3>Available Colors</h3>
                    <div class="colors-grid">
                        ${this.car.colors.map(color => `
                            <span class="color-chip">${color}</span>
                        `).join('')}
                    </div>
                </div>

                <div class="car-actions-detailed">
                    <button class="btn btn-primary" onclick="addToCompare('${this.car.id}')">
                        <i class="fas fa-balance-scale"></i>
                        Add to Compare
                    </button>
                    <button class="btn btn-secondary" onclick="downloadSpecs('${this.car.id}')">
                        <i class="fas fa-download"></i>
                        Download Specs
                    </button>
                </div>
            </div>
        `;

        // Add event listener for favorite button
        const favoriteBtn = content.querySelector('.favorite-btn');
        if (favoriteBtn) {
            favoriteBtn.addEventListener('click', () => {
                this.toggleFavorite();
            });
        }
    }

    toggleFavorite() {
        const favoriteBtn = document.querySelector('.favorite-btn');
        const icon = favoriteBtn.querySelector('i');
        
        if (window.favoritesManager.isFavorite(this.car.id)) {
            window.favoritesManager.removeFavorite(this.car.id);
            favoriteBtn.classList.remove('active');
            icon.className = 'far fa-heart';
            window.carShowcaseUtils.showSuccess('Removed from favorites', document.body);
        } else {
            window.favoritesManager.addFavorite(this.car.id);
            favoriteBtn.classList.add('active');
            icon.className = 'fas fa-heart';
            window.carShowcaseUtils.showSuccess('Added to favorites', document.body);
        }
    }

    async loadRelatedCars() {
        try {
            const response = await fetch('./data/cars.json');
            const data = await response.json();
            
            // Get cars from same brand or similar type
            const relatedCars = data.cars
                .filter(car => car.id !== this.car.id && 
                    (car.brand === this.car.brand || car.type === this.car.type))
                .slice(0, 4);

            this.renderRelatedCars(relatedCars);
        } catch (error) {
            console.error('Error loading related cars:', error);
        }
    }

    renderRelatedCars(cars) {
        const relatedGrid = document.getElementById('relatedGrid');
        if (!relatedGrid) return;

        if (cars.length === 0) {
            relatedGrid.innerHTML = '<p>No related cars found</p>';
            return;
        }

        relatedGrid.innerHTML = cars.map(car => `
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
                            ${window.carShowcaseUtils.formatPrice(car.price)}
                        </span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    setupEventListeners() {
        // Add any additional event listeners here
    }

    showError(message) {
        const content = document.getElementById('carDetailsContent');
        if (content) {
            content.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>Error</h3>
                    <p>${message}</p>
                    <a href="gallery.html" class="btn btn-primary">Back to Gallery</a>
                </div>
            `;
        }
    }
}

// Global functions for car actions
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

window.downloadSpecs = function(carId) {
    // This would typically generate a PDF
    window.carShowcaseUtils.showSuccess('Specifications download started', document.body);
};

// Initialize car detail page
document.addEventListener('DOMContentLoaded', () => {
    new CarDetail();
}); 