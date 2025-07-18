# Car Showcase Website

A modern, responsive car showcase website built with HTML, CSS, and JavaScript. Features a multi-page design with car gallery, individual car details, comparison tools, and favorites management.

## 🚗 Features

### Core Features
- **Multi-page Navigation**: Clean separation between Home, Gallery, Car Details, Compare, and Favorites
- **Dark/Light Theme Toggle**: Persistent theme preference with smooth transitions
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Car Gallery**: Browse cars with filtering and search functionality
- **Individual Car Pages**: Detailed specifications and information for each car
- **Car Comparison**: Side-by-side comparison of two selected cars
- **Favorites System**: Save and manage your favorite cars with LocalStorage

### Technical Features
- **Modern CSS**: CSS Grid, Flexbox, and CSS Variables for theming
- **JavaScript Classes**: Modular, object-oriented JavaScript architecture
- **LocalStorage**: Persistent favorites and theme preferences
- **GSAP Animations**: Smooth animations and transitions
- **Lazy Loading**: Optimized image loading for better performance

## 📁 Project Structure

```
car-showcase/
│
├── index.html                 # Homepage with hero section
├── gallery.html               # Car gallery with filters
├── car.html                   # Individual car detail page
├── compare.html               # Car comparison page
├── favorites.html             # My Garage (favorites) page
│
├── styles/
│   └── styles.css             # Main stylesheet with themes
│
├── scripts/
│   ├── script.js              # Main functionality (theme, navigation)
│   ├── gallery.js             # Gallery logic and filtering
│   ├── car.js                 # Individual car page logic
│   ├── compare.js             # Car comparison functionality
│   └── favorites.js           # Favorites management
│
├── data/
│   └── cars.json              # Car database with specifications
│
├── images/                    # Car images (add your own)
│   ├── tesla-model-s.jpg
│   ├── bmw-m4.jpg
│   ├── audi-r8.jpg
│   ├── porsche-911.jpg
│   └── ferrari-f8.jpg
│
└── README.md                  # This file
```

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- A local web server (for JSON loading)

### Installation

1. **Clone or Download** the project files to your local machine

2. **Add Car Images**: Place your car images in the `images/` folder
   - Recommended format: JPG or WebP
   - Recommended size: 800x600px or larger
   - Update image paths in `data/cars.json` to match your filenames

3. **Start a Local Server**: Due to CORS restrictions, you need a local server to load the JSON data
   
   **Option A: Using Python**
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   ```
   
   **Option B: Using Node.js**
   ```bash
   npx http-server
   ```
   
   **Option C: Using VS Code Live Server**
   - Install the "Live Server" extension
   - Right-click on `index.html` and select "Open with Live Server"

4. **Open the Website**: Navigate to `http://localhost:8000` in your browser

## 🎨 Customization

### Adding New Cars

1. **Add Car Image**: Place the car image in the `images/` folder
2. **Update JSON**: Add car data to `data/cars.json`:

```json
{
  "id": "your-car-id",
  "name": "Car Name",
  "brand": "Brand",
  "model": "Model",
  "year": 2024,
  "type": "Car Type",
  "price": 50000,
  "image": "images/your-car-image.jpg",
  "description": "Car description...",
  "specs": {
    "engine": "Engine Type",
    "power": "500 hp",
    "torque": "400 lb-ft",
    "acceleration": "3.5s",
    "topSpeed": "180 mph",
    "weight": "1500 kg",
    "length": "4500 mm",
    "width": "1800 mm",
    "height": "1300 mm",
    "seats": "4",
    "transmission": "8-speed",
    "drivetrain": "AWD",
    "fuelType": "Gasoline"
  },
  "features": ["Feature 1", "Feature 2"],
  "colors": ["Color 1", "Color 2"],
  "rating": 4.8,
  "reviews": 100,
  "featured": false
}
```

### Customizing Styles

The website uses CSS variables for easy theming. Edit `styles/styles.css` to customize:

```css
:root {
    --primary-color: #2563eb;    /* Main brand color */
    --accent-color: #f59e0b;     /* Accent color */
    --background: #ffffff;       /* Background color */
    --text-primary: #1e293b;     /* Primary text color */
}
```

### Adding New Features

The modular JavaScript structure makes it easy to add new features:

1. **New Page**: Create a new HTML file and add navigation links
2. **New Script**: Create a new JavaScript file in the `scripts/` folder
3. **New Data**: Add new properties to the car objects in `cars.json`

## 📱 Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 🛠️ Development

### File Structure Best Practices

- **HTML**: Semantic markup with proper accessibility
- **CSS**: BEM methodology with CSS variables for theming
- **JavaScript**: ES6+ classes with modular architecture
- **Data**: JSON format for easy maintenance

### Performance Optimizations

- Lazy loading for images
- Debounced search functionality
- Efficient DOM manipulation
- Minimal dependencies (only GSAP for animations)

## 🎯 Future Enhancements

### Phase 2 Features (Ready to Implement)
- **Image Lightbox**: Click to zoom car images
- **Advanced Filtering**: Price range, performance filters
- **Sorting Options**: Sort by price, power, year, etc.
- **Pagination**: Load more cars with infinite scroll

### Phase 3 Features
- **User Accounts**: Registration and login system
- **Reviews System**: User reviews and ratings
- **Advanced Search**: Fuzzy search with multiple criteria
- **Export Features**: Download car specifications as PDF

### Phase 4 Features
- **360° Viewers**: Interactive car rotations
- **Sound Effects**: Engine sounds and audio feedback
- **Video Integration**: Car videos and walkthroughs
- **Social Sharing**: Share cars on social media

## 🤝 Contributing

1. Fork the project
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

If you encounter any issues or have questions:

1. Check the browser console for JavaScript errors
2. Ensure you're running a local web server
3. Verify all image paths are correct
4. Check that the JSON file is valid

## 🎉 Credits

- **Icons**: Font Awesome
- **Fonts**: Inter (Google Fonts)
- **Animations**: GSAP
- **Design**: Modern, clean automotive design principles

---

**Happy Car Showcasing! 🚗✨** 