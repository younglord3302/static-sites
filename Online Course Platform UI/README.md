# LearnHub - Online Course Platform UI

A modern, responsive online course platform built with vanilla JavaScript, TailwindCSS, and Vite. Features course catalog, search/filter functionality, cart system, and enrollment tracking - all stored locally using localStorage.

## 🚀 Live Demo

[View Live Demo](https://your-deployed-url.com) *(Deploy when ready)*

## ✨ Features

### Core Functionality
- **Course Catalog**: Browse 8+ professional courses across Web Development, Data Science, Design, and Business
- **Advanced Search & Filters**: Search by title, instructor, tags; filter by category, level, price
- **Sorting Options**: Sort by relevance, newest, rating, price (low/high)
- **Cart System**: Add/remove courses, view cart summary, mock checkout
- **Enrollment Tracking**: Mark courses as enrolled with progress tracking
- **Progress Monitoring**: Track lesson completion and overall course progress
- **Responsive Design**: Fully responsive across desktop, tablet, and mobile

### User Experience
- **Modern UI**: Clean, professional design with TailwindCSS
- **Interactive Elements**: Hover states, loading skeletons, smooth transitions
- **Toast Notifications**: Real-time feedback for user actions
- **Accessibility**: Keyboard navigation, ARIA labels, semantic HTML
- **Performance**: Lazy-loaded images, efficient filtering/sorting

## 🛠 Tech Stack

- **Frontend**: HTML5, Vanilla JavaScript (ES6 Modules), TailwindCSS
- **Build Tool**: Vite (fast development server + optimized builds)
- **Icons**: Heroicons (via SVG)
- **Fonts**: Inter & Poppins (Google Fonts)
- **Images**: Unsplash API for course thumbnails and instructor avatars
- **Storage**: localStorage for cart, enrollment, and progress data

## 📁 Project Structure

```
learnhub/
├── index.html              # Main catalog/home page
├── course.html             # Course detail template (future)
├── lesson.html             # Lesson player template (future)
├── dashboard.html          # User dashboard template (future)
├── src/
│   ├── main.js            # Application entry point
│   ├── style.css          # Global styles + TailwindCSS
│   └── counter.js         # Unused Vite template file
├── js/
│   ├── catalog.js         # Course catalog management
│   └── storage.js         # localStorage helpers
├── data/
│   └── courses.json       # Course data and curriculum
├── assets/                 # Static assets (images, icons)
├── public/                 # Public assets
├── package.json
├── vite.config.js         # Vite configuration
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 20.18+ (though Vite works with 20.19+ or 22.12+ recommended)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd learnhub
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
   http://localhost:5173
   ```

### Build for Production

```bash
npm run build
npm run preview  # Preview production build locally
```

## 📚 Course Data Structure

Courses are stored in `data/courses.json` with the following schema:

```json
{
  "id": "course-101",
  "title": "Modern JavaScript: From Zero to Production",
  "slug": "modern-javascript-zero-to-production",
  "price": 49.99,
  "category": "Web Development",
  "level": "Intermediate",
  "rating": 4.8,
  "thumbnail": "https://...",
  "instructor": {
    "name": "Asha Kapoor",
    "avatar": "https://...",
    "bio": "..."
  },
  "curriculum": [
    {
      "section": "Getting Started",
      "lessons": [
        {"id": "l1", "title": "Intro & Setup", "duration": "5:20", "locked": false}
      ]
    }
  ]
}
```

## 🎯 Features in Detail

### Search & Discovery
- **Real-time Search**: Instant results as you type
- **Multi-field Search**: Searches title, description, instructor, and tags
- **Advanced Filters**: Category, skill level, price range
- **Smart Sorting**: Relevance-based sorting with fallback to rating

### Cart & Enrollment
- **Persistent Cart**: Cart contents saved across sessions
- **Enrollment Flow**: Mock checkout process with success feedback
- **Progress Tracking**: Lesson completion and overall progress bars
- **Local Storage**: All user data stored locally (no backend required)

### User Experience
- **Loading States**: Skeleton loaders for smooth UX
- **Toast Notifications**: Contextual feedback for all actions
- **Responsive Grid**: Adaptive course cards for all screen sizes
- **Keyboard Navigation**: Full keyboard accessibility

## 🔧 Customization

### Adding New Courses
1. Add course data to `data/courses.json`
2. Include high-quality images from Unsplash
3. Update instructor information
4. Ensure curriculum follows the established structure

### Styling Changes
- Modify TailwindCSS classes in HTML templates
- Update custom CSS variables in `src/style.css`
- Adjust color scheme by changing CSS custom properties

### Feature Extensions
- Add new filter types in `js/catalog.js`
- Extend storage capabilities in `js/storage.js`
- Add new UI components following existing patterns

## 📱 Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px
- **Large Desktop**: > 1280px

## 🎨 Design System

### Colors
- **Primary**: #0f6fff (Blue)
- **Accent**: #ff7a59 (Orange)
- **Surface**: #ffffff (White)
- **Muted**: #f5f7fb (Light Gray)
- **Text**: #0f1724 (Dark Gray)

### Typography
- **Headings**: Poppins (Google Fonts)
- **Body**: Inter (Google Fonts)
- **Sizes**: Responsive scaling from 14px to 36px+

## 🧪 Testing

### Manual Testing Checklist
- [ ] Course catalog loads and displays correctly
- [ ] Search functionality works across all fields
- [ ] Filters apply correctly and show results
- [ ] Sorting changes order appropriately
- [ ] Cart add/remove functions properly
- [ ] Checkout process completes successfully
- [ ] Enrollment tracking persists across sessions
- [ ] Responsive layout works on all screen sizes
- [ ] Keyboard navigation functions
- [ ] Screen reader compatibility

## 🚀 Deployment

### Netlify (Recommended)
1. Build the project: `npm run build`
2. Upload `dist/` folder to Netlify
3. Set build command: `npm run build`
4. Set publish directory: `dist`

### Vercel
1. Connect GitHub repository
2. Vercel auto-detects Vite configuration
3. Deploy automatically on push

### GitHub Pages
1. Build the project
2. Use GitHub Actions to deploy `dist/` folder
3. Enable GitHub Pages on the repository

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **Images**: Unsplash for course thumbnails and instructor avatars
- **Icons**: Heroicons for UI elements
- **Fonts**: Google Fonts for typography
- **Framework**: Vite for build tooling
- **Styling**: TailwindCSS for utility-first CSS

---

**Built with ❤️ for learning and showcasing modern web development skills**
