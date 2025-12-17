# ShopHub - Modern E-Commerce Storefront

A modern, responsive e-commerce storefront built with vanilla JavaScript, Tailwind CSS, and featuring a complete product catalog with shopping cart functionality.

## 🚀 Features

- **Modern Design**: Clean, professional UI with Tailwind CSS
- **Responsive Layout**: Mobile-first design that works on all devices
- **Product Catalog**: 20+ sample products with categories, ratings, and pricing
- **Product Modal**: Detailed product view with image gallery and variants
- **Shopping Cart**: Full cart functionality with localStorage persistence
- **Search & Filters**: Real-time product filtering and sorting
- **Accessibility**: WCAG compliant with keyboard navigation and ARIA labels
- **Toast Notifications**: User feedback for cart actions
- **Lazy Loading**: Optimized image loading for better performance

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Styling**: Tailwind CSS (CDN)
- **Icons**: Heroicons (SVG)
- **Fonts**: Inter (Google Fonts)
- **Data**: JSON (local storage)
- **Deployment**: Static hosting (GitHub Pages, Netlify, Vercel)

## 📁 Project Structure

```
ecommerce-store/
├── index.html              # Homepage with hero and featured products
├── products.html           # Full product catalog (future enhancement)
├── product.html            # Individual product page (future enhancement)
├── data/
│   └── products.json       # Product data and inventory
├── js/
│   ├── main.js            # Application initialization and UI rendering
│   ├── products.js        # Product management and filtering logic
│   └── cart.js            # Shopping cart functionality
├── css/
│   └── styles.css         # Additional custom styles (if needed)
├── assets/
│   ├── images/            # Product images and media
│   └── icons/             # Custom icons and favicons
└── README.md              # Project documentation
```

## 🚀 Getting Started

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (built-in or http-server)

### Installation

1. **Clone or download** the project files
2. **Navigate** to the project directory
3. **Start a local server**:
   ```bash
   # Using npx (recommended)
   npx http-server . -p 3000

   # Or using Python
   python -m http.server 3000

   # Or using PHP
   php -S localhost:3000
   ```

4. **Open your browser** and visit `http://localhost:3000`

## 🎨 Customization

### Color Scheme

The design uses a custom color palette defined in the Tailwind config:

```javascript
colors: {
    primary: '#0f6fff',    // Bright blue
    accent: '#ff7a59',     // Warm orange
    muted: '#f6f7fb',      // Light gray background
    surface: '#ffffff',    // White cards/surfaces
    text: '#0f1724',       // Dark slate text
    success: '#10b981',    // Green
    danger: '#ef4444'      // Red
}
```

### Adding Products

Edit `data/products.json` to add new products. Each product object should include:

```json
{
    "id": 1,
    "title": "Product Name",
    "price": 29.99,
    "originalPrice": 39.99,
    "images": ["image1.jpg", "image2.jpg"],
    "category": "Category",
    "tags": ["tag1", "tag2"],
    "rating": 4.5,
    "reviewCount": 100,
    "badges": ["Sale", "New"],
    "description": "Product description...",
    "inventory": 25,
    "colors": ["Black", "White"],
    "variants": ["Small", "Medium", "Large"]
}
```

### Styling Customization

- Modify colors in the Tailwind config in `index.html`
- Add custom CSS in `css/styles.css`
- Adjust spacing and layout using Tailwind utility classes

## 🔧 Development Features

### Product Management

- **ProductManager Class**: Handles loading, filtering, and sorting products
- **Real-time Search**: Instant product filtering as you type
- **Category Filtering**: Filter by product categories
- **Price Range Filtering**: Slider-based price filtering
- **Sorting Options**: Sort by price, rating, popularity, newest

### Cart Functionality

- **Persistent Storage**: Cart items saved in localStorage
- **Real-time Updates**: Cart count and total update instantly
- **Item Management**: Add, remove, and update quantities
- **Toast Notifications**: User feedback for all cart actions

### UI Components

- **Product Cards**: Hover effects, badges, ratings display
- **Product Modal**: Full product details with image gallery
- **Cart Drawer**: Slide-out cart with item management
- **Responsive Grid**: Adapts from 1 to 4 columns based on screen size

## 🌐 Deployment

### GitHub Pages

1. Push your code to a GitHub repository
2. Go to Settings → Pages
3. Select "Deploy from a branch" and choose `main`
4. Your site will be live at `https://yourusername.github.io/repository-name`

### Netlify / Vercel

1. Connect your GitHub repository
2. Deploy automatically on every push
3. Get a custom domain if desired

## 📱 Mobile Optimization

- **Responsive Design**: Works perfectly on mobile devices
- **Touch-Friendly**: Large touch targets for mobile users
- **Optimized Images**: Lazy loading and proper sizing
- **Fast Loading**: Minimal dependencies and optimized assets

## ♿ Accessibility Features

- **Keyboard Navigation**: Full keyboard support
- **ARIA Labels**: Screen reader friendly
- **Focus Management**: Proper focus indicators
- **Semantic HTML**: Proper heading hierarchy and landmarks
- **Color Contrast**: WCAG AA compliant colors
- **Alt Text**: Descriptive image alt text

## 🔄 Future Enhancements

- [ ] User authentication and accounts
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Order checkout flow
- [ ] Payment integration
- [ ] Admin dashboard
- [ ] Search suggestions
- [ ] Product recommendations
- [ ] Multi-language support

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.

---

Built with ❤️ using modern web technologies
