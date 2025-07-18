// Compare Script - Handles car comparison functionality

class CarCompare {
    constructor() {
        this.cars = [];
        this.selectedCars = [];
        this.init();
    }

    async init() {
        await this.loadCars();
        this.populateCarSelects();
        this.setupEventListeners();
        this.loadStoredComparison();
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

    populateCarSelects() {
        const car1Select = document.getElementById('car1Select');
        const car2Select = document.getElementById('car2Select');

        if (car1Select && car2Select) {
            this.cars.forEach(car => {
                const option1 = document.createElement('option');
                option1.value = car.id;
                option1.textContent = car.name;
                car1Select.appendChild(option1);

                const option2 = document.createElement('option');
                option2.value = car.id;
                option2.textContent = car.name;
                car2Select.appendChild(option2);
            });
        }
    }

    setupEventListeners() {
        const car1Select = document.getElementById('car1Select');
        const car2Select = document.getElementById('car2Select');

        if (car1Select) {
            car1Select.addEventListener('change', (e) => {
                this.updateComparison();
            });
        }

        if (car2Select) {
            car2Select.addEventListener('change', (e) => {
                this.updateComparison();
            });
        }
    }

    loadStoredComparison() {
        const storedCars = JSON.parse(localStorage.getItem('compareCars') || '[]');
        if (storedCars.length > 0) {
            const car1Select = document.getElementById('car1Select');
            const car2Select = document.getElementById('car2Select');

            if (car1Select && storedCars[0]) {
                car1Select.value = storedCars[0];
            }
            if (car2Select && storedCars[1]) {
                car2Select.value = storedCars[1];
            }

            this.updateComparison();
        }
    }

    updateComparison() {
        const car1Id = document.getElementById('car1Select')?.value;
        const car2Id = document.getElementById('car2Select')?.value;

        if (!car1Id || !car2Id) {
            this.showPlaceholder();
            return;
        }

        const car1 = this.cars.find(car => car.id === car1Id);
        const car2 = this.cars.find(car => car.id === car2Id);

        if (car1 && car2) {
            this.renderSideBySideComparison(car1, car2);
            this.saveComparison([car1Id, car2Id]);
        }
    }

    renderComparison(car1, car2) {
        const resultsContainer = document.getElementById('comparisonResults');
        if (!resultsContainer) return;

        resultsContainer.innerHTML = `
            <div class="comparison-table">
                <div class="comparison-header">
                    <div class="car-column">
                        <img src="${car1.image}" alt="${car1.name}" class="comparison-image">
                        <h3>${car1.name}</h3>
                        <p class="car-price">${car1.price}</p>
                    </div>
                    <div class="vs-column">
                        <span class="vs-text">VS</span>
                    </div>
                    <div class="car-column">
                        <img src="${car2.image}" alt="${car2.name}" class="comparison-image">
                        <h3>${car2.name}</h3>
                        <p class="car-price">${car2.price}</p>
                    </div>
                </div>

                <div class="comparison-specs">
                    ${this.renderSpecComparison(car1, car2)}
                </div>

                <div class="comparison-features">
                    <h3>Description Comparison</h3>
                    <div class="features-comparison">
                        <div class="features-column">
                            <h4>${car1.name}</h4>
                            <p>${car1.description}</p>
                        </div>
                        <div class="features-column">
                            <h4>${car2.name}</h4>
                            <p>${car2.description}</p>
                        </div>
                    </div>
                </div>

                <div class="comparison-actions">
                    <button class="btn btn-primary" onclick="window.location.href='car.html?id=${car1.id}'">
                        View ${car1.name}
                    </button>
                    <button class="btn btn-primary" onclick="window.location.href='car.html?id=${car2.id}'">
                        View ${car2.name}
                    </button>
                    <button class="btn btn-secondary" onclick="clearComparison()">
                        Clear Comparison
                    </button>
                </div>
            </div>
        `;
    }

    renderSpecComparison(car1, car2) {
        const specs = [
            { key: 'power', label: 'Power', unit: '', path: 'specs.power' },
            { key: 'engine', label: 'Engine', unit: '', path: 'specs.engine' },
            { key: 'transmission', label: 'Transmission', unit: '', path: 'specs.transmission' },
            { key: 'drivetrain', label: 'Drivetrain', unit: '', path: 'specs.drivetrain' },
            { key: 'year', label: 'Year', unit: '', path: 'year' },
            { key: 'price', label: 'Price', unit: '', path: 'price' }
        ];

        return specs.map(spec => {
            const value1 = this.getNestedValue(car1, spec.path);
            const value2 = this.getNestedValue(car2, spec.path);
            const winner = this.determineWinner(value1, value2, spec.key);

            // Format price values
            const displayValue1 = spec.key === 'price' ? `$${value1.toLocaleString()}` : value1;
            const displayValue2 = spec.key === 'price' ? `$${value2.toLocaleString()}` : value2;

            return `
                <div class="spec-row">
                    <div class="spec-label">${spec.label}</div>
                    <div class="spec-value ${winner === 'car1' ? 'winner' : ''}">
                        ${displayValue1}${spec.unit}
                    </div>
                    <div class="spec-value ${winner === 'car2' ? 'winner' : ''}">
                        ${displayValue2}${spec.unit}
                    </div>
                </div>
            `;
        }).join('');
    }

    getNestedValue(obj, path) {
        return path.split('.').reduce((current, key) => current && current[key], obj);
    }

    determineWinner(value1, value2, specKey) {
        if (!value1 || !value2) return null;

        // For non-numeric comparisons, don't determine winner
        if (specKey === 'engine' || specKey === 'transmission' || specKey === 'drivetrain') {
            return null;
        }

        // Convert to numbers for comparison
        let num1, num2;
        
        if (specKey === 'power') {
            // Extract numeric value from power string (e.g., "630 hp" -> 630)
            num1 = parseFloat(value1.toString().replace(/[^\d.]/g, ''));
            num2 = parseFloat(value2.toString().replace(/[^\d.]/g, ''));
        } else {
            num1 = parseFloat(value1);
            num2 = parseFloat(value2);
        }

        if (isNaN(num1) || isNaN(num2)) return null;

        // For some specs, higher is better, for others lower is better
        const higherIsBetter = ['power', 'torque', 'topSpeed', 'seats'];
        const lowerIsBetter = ['acceleration', 'weight', 'price'];

        if (higherIsBetter.includes(specKey)) {
            return num1 > num2 ? 'car1' : num2 > num1 ? 'car2' : null;
        } else if (lowerIsBetter.includes(specKey)) {
            return num1 < num2 ? 'car1' : num2 < num1 ? 'car2' : null;
        }

        return null;
    }

    renderSideBySideComparison(car1, car2) {
        // Hide placeholder and show side-by-side comparison
        const resultsContainer = document.getElementById('comparisonResults');
        const sideBySideContainer = document.getElementById('sideBySideComparison');
        
        if (resultsContainer) {
            resultsContainer.style.display = 'none';
        }
        if (sideBySideContainer) {
            sideBySideContainer.style.display = 'block';
        }

        // Update left car (car1)
        document.getElementById('leftCarImage').src = car1.image;
        document.getElementById('leftCarImage').alt = car1.name;
        document.getElementById('leftCarName').textContent = car1.name;
        document.getElementById('leftCarPrice').textContent = `$${car1.price.toLocaleString()}`;
        document.getElementById('leftCarHP').textContent = car1.specs.power;
        document.getElementById('leftCarEngine').textContent = car1.specs.engine;
        document.getElementById('leftCarTransmission').textContent = car1.specs.transmission;
        document.getElementById('leftCarDrivetrain').textContent = car1.specs.drivetrain;
        document.getElementById('leftCarYear').textContent = car1.year;
        document.getElementById('leftCarDescription').textContent = car1.description;
        document.getElementById('leftCarDetails').href = `car.html?id=${car1.id}`;
        document.getElementById('leftCarFavorite').onclick = () => this.addToFavorites(car1.id);
        document.getElementById('leftCarFavorite').setAttribute('data-car-id', car1.id);

        // Update right car (car2)
        document.getElementById('rightCarImage').src = car2.image;
        document.getElementById('rightCarImage').alt = car2.name;
        document.getElementById('rightCarName').textContent = car2.name;
        document.getElementById('rightCarPrice').textContent = `$${car2.price.toLocaleString()}`;
        document.getElementById('rightCarHP').textContent = car2.specs.power;
        document.getElementById('rightCarEngine').textContent = car2.specs.engine;
        document.getElementById('rightCarTransmission').textContent = car2.specs.transmission;
        document.getElementById('rightCarDrivetrain').textContent = car2.specs.drivetrain;
        document.getElementById('rightCarYear').textContent = car2.year;
        document.getElementById('rightCarDescription').textContent = car2.description;
        document.getElementById('rightCarDetails').href = `car.html?id=${car2.id}`;
        document.getElementById('rightCarFavorite').onclick = () => this.addToFavorites(car2.id);
        document.getElementById('rightCarFavorite').setAttribute('data-car-id', car2.id);

        // Update favorite button states
        this.updateFavoriteButtonState('leftCarFavorite', car1.id);
        this.updateFavoriteButtonState('rightCarFavorite', car2.id);
    }

    updateFavoriteButtonState(buttonId, carId) {
        const button = document.getElementById(buttonId);
        const isFavorite = window.favoritesManager.isFavorite(carId);
        
        if (isFavorite) {
            button.innerHTML = '<i class="fas fa-heart"></i> Remove from Favorites';
            button.classList.add('active');
        } else {
            button.innerHTML = '<i class="far fa-heart"></i> Add to Favorites';
            button.classList.remove('active');
        }
    }

    addToFavorites(carId) {
        if (window.favoritesManager.isFavorite(carId)) {
            window.favoritesManager.removeFavorite(carId);
            window.carShowcaseUtils.showSuccess('Removed from favorites', document.body);
        } else {
            window.favoritesManager.addFavorite(carId);
            window.carShowcaseUtils.showSuccess('Added to favorites', document.body);
        }
        
        // Update both buttons
        this.updateFavoriteButtonState('leftCarFavorite', carId);
        this.updateFavoriteButtonState('rightCarFavorite', carId);
    }

    showPlaceholder() {
        const resultsContainer = document.getElementById('comparisonResults');
        const sideBySideContainer = document.getElementById('sideBySideComparison');
        
        if (resultsContainer) {
            resultsContainer.style.display = 'block';
        }
        if (sideBySideContainer) {
            sideBySideContainer.style.display = 'none';
        }
    }

    saveComparison(carIds) {
        localStorage.setItem('compareCars', JSON.stringify(carIds));
    }

    showError(message) {
        const resultsContainer = document.getElementById('comparisonResults');
        if (resultsContainer) {
            resultsContainer.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>Error</h3>
                    <p>${message}</p>
                </div>
            `;
        }
    }
}

// Global function to clear comparison
window.clearComparison = function() {
    localStorage.removeItem('compareCars');
    const car1Select = document.getElementById('car1Select');
    const car2Select = document.getElementById('car2Select');
    
    if (car1Select) car1Select.value = '';
    if (car2Select) car2Select.value = '';
    
    const compare = new CarCompare();
    compare.showPlaceholder();
    
    window.carShowcaseUtils.showSuccess('Comparison cleared', document.body);
};

// Initialize comparison page
document.addEventListener('DOMContentLoaded', () => {
    new CarCompare();
}); 