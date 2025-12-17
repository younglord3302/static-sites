# TaskFlow - Advanced SaaS Landing Page

![TaskFlow](https://img.shields.io/badge/TaskFlow-Advanced_Landing_Page-blue?style=for-the-badge)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)
![Swiper](https://img.shields.io/badge/Swiper-6332F6?style=flat&logo=swiper&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat&logo=vercel&logoColor=white)

A production-quality SaaS landing page built with modern web technologies, featuring A/B testing, interactive components, and optimized for performance.

## 🚀 Features

### Core Features
- **A/B Hero Variants**: Two different hero section designs for testing conversion rates
- **Interactive Pricing Calculator**: Dynamic pricing based on team size with competitor comparisons
- **Swiper Testimonials Carousel**: Smooth, responsive testimonial slider with autoplay
- **FAQ Accordion**: Expandable FAQ section with smooth animations
- **Mobile-First Design**: Fully responsive across all devices
- **Performance Optimized**: Fast loading with optimized assets

### Advanced Features
- **Analytics Ready**: Built-in tracking for conversions, A/B tests, and user interactions
- **Accessibility Compliant**: WCAG 2.1 AA compliant with keyboard navigation
- **SEO Optimized**: Meta tags, semantic HTML, and performance best practices
- **Security Headers**: Production-ready security configurations
- **Progressive Web App**: Service worker ready for offline functionality

### Technical Stack
- **HTML5** with semantic structure
- **TailwindCSS** via CDN with custom configuration
- **Swiper.js** for interactive carousels
- **Vanilla JavaScript** for all interactions
- **Vercel** for deployment and hosting

## 📁 Project Structure

```
├── index.html          # Main landing page
├── styles.css          # Custom CSS (if needed)
├── script.js          # Interactive functionality
├── package.json       # Project dependencies
├── vercel.json        # Vercel deployment config
└── README.md          # This file
```

## 🛠️ Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd taskflow-landing-page
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

## 🎯 A/B Testing

The landing page includes two hero variants:

- **Variant A (Headline Focus)**: Emphasizes the main value proposition with AI-powered insights
- **Variant B (Feature Focus)**: Showcases key features in a grid layout

### Testing the Variants
- Click the **"A/B Test"** button in the top-right corner to switch between variants
- The page automatically selects a variant based on the current minute (even/odd)
- Analytics track which variant performs better

## 💰 Pricing Calculator

The interactive pricing calculator features:

- **Team Size Slider**: Adjust from 1-100 team members
- **Dynamic Pricing**: Volume discounts for larger teams
- **Competitor Comparison**: Shows savings vs. competitors
- **Real-time Updates**: Instant price calculations

## 🎠 Testimonials Carousel

Built with Swiper.js featuring:

- **Auto-play**: 5-second intervals with pause on interaction
- **Responsive**: 1 slide on mobile, 2 on tablet, 3 on desktop
- **Navigation**: Previous/next buttons and pagination dots
- **Touch Support**: Swipe gestures on mobile devices

## 📱 Mobile Optimization

- **Responsive Design**: Adapts to all screen sizes
- **Touch Interactions**: Optimized for mobile gestures
- **Performance**: Fast loading on mobile networks
- **Accessibility**: Screen reader support and keyboard navigation

## 🚀 Deployment to Vercel

### Method 1: Vercel CLI (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   npm run deploy
   ```

3. **Follow the prompts** to create/configure your project

### Method 2: GitHub Integration

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Deploy automatically

### Method 3: Manual Upload

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Upload to Vercel Dashboard**
   - Drag and drop files to Vercel dashboard
   - Configure settings as needed

## 🔧 Customization

### Colors and Branding
Edit the TailwindCSS configuration in `index.html`:

```javascript
tailwind.config = {
    theme: {
        extend: {
            colors: {
                primary: {
                    500: '#your-brand-color',
                    // ... other shades
                }
            }
        }
    }
}
```

### Content Changes
- Update text content in `index.html`
- Modify pricing in the pricing calculator function
- Add/remove testimonials in the Swiper section

### Adding New Features
- Extend the JavaScript in `script.js`
- Add new TailwindCSS classes
- Update the FAQ section with new questions

## 📊 Analytics & Tracking

The page includes built-in tracking for:

- **Page Views**: Track overall traffic
- **A/B Test Performance**: Which variant converts better
- **Conversion Tracking**: Trial signups, demo requests
- **User Interactions**: FAQ opens, pricing calculator usage
- **Performance Metrics**: Core Web Vitals

### Integrating Analytics
Replace the tracking functions with your analytics provider:

```javascript
// Example: Google Analytics
function trackConversion(type) {
    gtag('event', 'conversion', {
        event_category: 'engagement',
        event_label: type
    });
}
```

## 🔒 Security Features

- **Content Security Policy**: Prevents XSS attacks
- **Security Headers**: X-Frame-Options, X-Content-Type-Options
- **HTTPS Only**: Forces secure connections
- **Input Validation**: Sanitized user inputs

## 🎨 Design System

### Colors
- **Primary**: Blue gradient (#667eea to #764ba2)
- **Secondary**: Purple gradient (#8b5cf6 to #a855f7)
- **Accent**: Green (#10b981) for success states
- **Neutral**: Gray scale for text and backgrounds

### Typography
- **Primary Font**: Inter (Google Fonts)
- **Sizes**: Responsive scaling from mobile to desktop
- **Weights**: 300, 400, 500, 600, 700, 800

### Spacing
- **Base Unit**: 0.25rem (4px)
- **Scale**: Powers of 2 (0.5rem, 1rem, 2rem, 4rem, etc.)
- **Container**: Max-width 1200px with responsive padding

## 🧪 Testing

### Local Testing
```bash
# Start development server
npm run dev

# Build for production
npm run build
```

### Performance Testing
- **Lighthouse**: Run in Chrome DevTools
- **WebPageTest**: Test loading performance
- **GTmetrix**: Analyze optimization opportunities

### Accessibility Testing
- **WAVE**: Web accessibility evaluation tool
- **axe**: Automated accessibility testing
- **Screen Readers**: Test with NVDA, JAWS, VoiceOver

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **TailwindCSS** for the utility-first CSS framework
- **Swiper** for the carousel functionality
- **Vercel** for the hosting platform
- **Inter Font** by Rasmus Andersson
- **Stripe** for design inspiration

## 📞 Support

For support, email support@taskflow.com or join our Discord community.

---

**Built with ❤️ by the TaskFlow team**

*This landing page demonstrates modern web development practices and is perfect for showcasing in developer portfolios and interviews.*
