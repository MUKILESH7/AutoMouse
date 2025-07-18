// CSV Parser for Car Data
class CSVParser {
    constructor() {
        this.cars = [];
    }

    // Parse CSV string to array of objects
    parseCSV(csvString) {
        const lines = csvString.trim().split('\n');
        const headers = lines[0].split(',');
        
        this.cars = lines.slice(1).map(line => {
            const values = this.parseCSVLine(line);
            const car = {};
            
            headers.forEach((header, index) => {
                car[header.trim()] = values[index] ? values[index].trim() : '';
            });
            
            // Convert numeric values
            if (car.id) car.id = parseInt(car.id);
            if (car.year) car.year = parseInt(car.year);
            if (car.horsepower) car.horsepower = parseInt(car.horsepower);
            
            return car;
        });
        
        return this.cars;
    }

    // Parse CSV line handling commas in quoted strings
    parseCSVLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                result.push(current);
                current = '';
            } else {
                current += char;
            }
        }
        
        result.push(current);
        return result;
    }

    // Load CSV from file
    async loadFromFile(filePath) {
        try {
            const response = await fetch(filePath);
            const csvText = await response.text();
            return this.parseCSV(csvText);
        } catch (error) {
            console.error('Error loading CSV file:', error);
            return [];
        }
    }

    // Get all cars
    getAllCars() {
        return this.cars;
    }

    // Get car by ID
    getCarById(id) {
        return this.cars.find(car => car.id === id);
    }

    // Search cars
    searchCars(query) {
        const lowerQuery = query.toLowerCase();
        return this.cars.filter(car => 
            car.name.toLowerCase().includes(lowerQuery) ||
            car.brand.toLowerCase().includes(lowerQuery) ||
            car.description.toLowerCase().includes(lowerQuery)
        );
    }

    // Filter by brand
    filterByBrand(brand) {
        return this.cars.filter(car => car.brand === brand);
    }

    // Get unique brands
    getBrands() {
        return [...new Set(this.cars.map(car => car.brand))];
    }
}

// Create global instance
const csvParser = new CSVParser(); 