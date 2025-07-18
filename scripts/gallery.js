// Gallery Script - Handles car gallery display, filtering, and search

class CarGallery {
    constructor() {
        this.cars = [];
        this.filteredCars = [];
        this.currentPage = 1;
        this.carsPerPage = 12;
        this.filters = {
            brand: '',
            type: '',
            year: '',
            search: ''
        };
        
        this.init();
    }

    async init() {
        await this.loadCars();
        this.setupEventListeners();
        this.populateFilters();
        this.renderCars();
    }

    async loadCars() {
        try {
            // Use hardcoded car data instead of JSON
            this.cars = carData;
            this.filteredCars = [...this.cars];
        } catch (error) {
            console.error('Error loading cars:', error);
            this.showError('Failed to load cars. Please try again later.');
        }
    }

    setupEventListeners() {
        const brandFilter = document.getElementById('brandFilter');
        const typeFilter = document.getElementById('typeFilter');
        const yearFilter = document.getElementById('yearFilter');
        const searchInput = document.getElementById('searchInput');
        const loadMoreBtn = document.getElementById('loadMoreBtn');

        if (brandFilter) {
            brandFilter.addEventListener('change', (e) => {
                this.filters.brand = e.target.value;
                this.applyFilters();
            });
        }



        if (yearFilter) {
            yearFilter.addEventListener('change', (e) => {
                this.filters.year = e.target.value;
                this.applyFilters();
            });
        }

        if (searchInput) {
            const debouncedSearch = window.carShowcaseUtils.debounce((e) => {
                this.filters.search = e.target.value.toLowerCase();
                this.applyFilters();
            }, 300);

            searchInput.addEventListener('input', debouncedSearch);
        }

        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                this.loadMoreCars();
            });
        }
    }

    populateFilters() {
        const brands = [...new Set(this.cars.map(car => car.brand))].sort();
        const years = [...new Set(this.cars.map(car => car.year))].sort((a, b) => b - a);

        this.populateSelect('brandFilter', brands);
        this.populateSelect('yearFilter', years);
    }

    populateSelect(selectId, options) {
        const select = document.getElementById(selectId);
        if (!select) return;

        const allOption = select.querySelector('option[value=""]');
        select.innerHTML = '';
        if (allOption) {
            select.appendChild(allOption);
        }

        options.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option;
            optionElement.textContent = option;
            select.appendChild(optionElement);
        });
    }

    applyFilters() {
        this.filteredCars = this.cars.filter(car => {
            const matchesBrand = !this.filters.brand || car.brand === this.filters.brand;
            const matchesYear = !this.filters.year || car.year.toString() === this.filters.year;
            const matchesSearch = !this.filters.search || 
                car.name.toLowerCase().includes(this.filters.search) ||
                car.brand.toLowerCase().includes(this.filters.search) ||
                car.description.toLowerCase().includes(this.filters.search);

            return matchesBrand && matchesYear && matchesSearch;
        });

        this.currentPage = 1;
        this.renderCars();
        this.updateLoadMoreButton();
    }

    renderCars() {
        const carGrid = document.getElementById('carGrid');
        if (!carGrid) return;

        const startIndex = 0;
        const endIndex = this.currentPage * this.carsPerPage;
        const carsToShow = this.filteredCars.slice(startIndex, endIndex);

        if (this.currentPage === 1) {
            carGrid.innerHTML = '';
        }

        if (carsToShow.length === 0) {
            carGrid.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <h3>No cars found</h3>
                    <p>Try adjusting your filters or search terms</p>
                </div>
            `;
            return;
        }

        carsToShow.forEach(car => {
            const carCard = this.createCarCard(car);
            carGrid.appendChild(carCard);
        });
    }

    createCarCard(car) {
        const card = document.createElement('div');
        card.className = 'car-card';
        card.setAttribute('data-car-id', car.id);

        const isFavorite = window.favoritesManager.isFavorite(car.id);
        const favoriteIcon = isFavorite ? 'fas fa-heart' : 'far fa-heart';
        const favoriteClass = isFavorite ? 'active' : '';

        card.innerHTML = `
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
                    <button class="favorite-btn ${favoriteClass}" data-car-id="${car.id}">
                        <i class="${favoriteIcon}"></i>
                    </button>
                    <a href="car.html?id=${car.id}" class="view-details-btn">
                        View Details
                    </a>
                </div>
            </div>
        `;

        const favoriteBtn = card.querySelector('.favorite-btn');
        favoriteBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleFavorite(car.id, favoriteBtn);
        });

        card.addEventListener('click', (e) => {
            if (!e.target.closest('.favorite-btn') && !e.target.closest('.view-details-btn')) {
                window.location.href = `car.html?id=${car.id}`;
            }
        });

        return card;
    }

    toggleFavorite(carId, button) {
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
    }

    loadMoreCars() {
        this.currentPage++;
        this.renderCars();
        this.updateLoadMoreButton();
    }

    updateLoadMoreButton() {
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (!loadMoreBtn) return;

        const totalPages = Math.ceil(this.filteredCars.length / this.carsPerPage);
        const hasMore = this.currentPage < totalPages;

        if (hasMore) {
            loadMoreBtn.style.display = 'block';
            loadMoreBtn.textContent = `Load More (${this.filteredCars.length - (this.currentPage * this.carsPerPage)} remaining)`;
        } else {
            loadMoreBtn.style.display = 'none';
        }
    }

    showError(message) {
        const carGrid = document.getElementById('carGrid');
        if (carGrid) {
            carGrid.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>Error</h3>
                    <p>${message}</p>
                </div>
            `;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new CarGallery();
});