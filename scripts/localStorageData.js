// Local Storage Data Management
class CarDataManager {
    constructor() {
        this.storageKey = 'carShowcaseData';
        this.initializeData();
    }

    // Initialize with default data if none exists
    initializeData() {
        if (!localStorage.getItem(this.storageKey)) {
            const defaultData = [
                {
                    id: 1,
                    name: "BMW M3",
                    brand: "BMW",
                    year: 2023,
                    price: "$85,000",
                    horsepower: 473,
                    engine: "3.0L Twin-Turbo I6",
                    transmission: "8-Speed Automatic",
                    drivetrain: "RWD",
                    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400",
                    description: "The ultimate driving machine with exceptional performance and luxury."
                },
                {
                    id: 2,
                    name: "Mercedes-AMG GT",
                    brand: "Mercedes-Benz",
                    year: 2023,
                    price: "$125,000",
                    horsepower: 523,
                    engine: "4.0L Biturbo V8",
                    transmission: "9-Speed Automatic",
                    drivetrain: "RWD",
                    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400",
                    description: "Pure performance with stunning design and cutting-edge technology."
                }
            ];
            this.saveData(defaultData);
        }
    }

    // Get all cars
    getAllCars() {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : [];
    }

    // Get car by ID
    getCarById(id) {
        const cars = this.getAllCars();
        return cars.find(car => car.id === id);
    }

    // Add new car
    addCar(car) {
        const cars = this.getAllCars();
        car.id = Date.now(); // Simple ID generation
        cars.push(car);
        this.saveData(cars);
        return car;
    }

    // Update car
    updateCar(id, updatedCar) {
        const cars = this.getAllCars();
        const index = cars.findIndex(car => car.id === id);
        if (index !== -1) {
            cars[index] = { ...cars[index], ...updatedCar };
            this.saveData(cars);
            return cars[index];
        }
        return null;
    }

    // Delete car
    deleteCar(id) {
        const cars = this.getAllCars();
        const filteredCars = cars.filter(car => car.id !== id);
        this.saveData(filteredCars);
    }

    // Save data to localStorage
    saveData(data) {
        localStorage.setItem(this.storageKey, JSON.stringify(data));
    }

    // Clear all data
    clearData() {
        localStorage.removeItem(this.storageKey);
    }

    // Search cars
    searchCars(query) {
        const cars = this.getAllCars();
        const lowerQuery = query.toLowerCase();
        return cars.filter(car => 
            car.name.toLowerCase().includes(lowerQuery) ||
            car.brand.toLowerCase().includes(lowerQuery) ||
            car.description.toLowerCase().includes(lowerQuery)
        );
    }

    // Filter cars by brand
    filterByBrand(brand) {
        const cars = this.getAllCars();
        return cars.filter(car => car.brand === brand);
    }

    // Get unique brands
    getBrands() {
        const cars = this.getAllCars();
        return [...new Set(cars.map(car => car.brand))];
    }
}

// Create global instance
const carDataManager = new CarDataManager(); 