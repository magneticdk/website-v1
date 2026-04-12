# Resource Toolkit Website

A modern, professional toolkit website built with React and Vite. Features a searchable resource library with category filtering, responsive design, and clean UI.

## ✨ Features

- **Search Functionality** - Real-time search across titles, descriptions, and tags
- **Category Filtering** - Filter resources by category (Guides, Templates, Videos, etc.)
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **Resource Cards** - Beautiful cards with type badges, categories, and tags
- **Interactive UI** - Smooth animations and hover effects
- **Modern Stack** - Built with React 18 + Vite for blazing fast performance

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Open your browser:
- The site will be available at `http://localhost:5174` (or the next available port)

### Build for Production

```bash
npm run build
```

The production files will be in the `dist` folder.

## 📁 Project Structure

```
src/
├── components/
│   ├── Header.jsx/css          # Top navigation bar
│   ├── SearchBar.jsx/css       # Search input with live filtering
│   ├── CategoryFilter.jsx/css  # Category filter buttons
│   ├── ResourceGrid.jsx/css    # Grid layout for resources
│   ├── ResourceCard.jsx/css    # Individual resource cards
│   └── Footer.jsx/css          # Footer section
├── data/
│   └── resources.js            # Resource data and categories
├── App.jsx/css                 # Main application component
├── main.jsx                    # React entry point
└── index.css                   # Global styles
```

## 🎨 Customization

### Adding New Resources

Edit `src/data/resources.js`:

```javascript
{
  id: 13,
  title: "Your Resource Title",
  description: "Description of your resource",
  category: "Guides", // Must match a category
  type: "PDF", // PDF, Document, Video, Download, etc.
  url: "https://your-url.com",
  tags: ["tag1", "tag2"]
}
```

### Adding New Categories

Add to the `categories` array in `src/data/resources.js`:

```javascript
export const categories = [
  "All",
  "Guides",
  "Templates",
  "Videos",
  "Your New Category"
];
```

### Customizing Colors

Edit CSS variables in `src/index.css`:

```css
:root {
  --color-primary: #2563eb;        /* Main brand color */
  --color-primary-dark: #1e40af;   /* Darker variant */
  --color-text: #1e293b;           /* Main text color */
  --color-border: #e2e8f0;         /* Border color */
  /* ... more variables */
}
```

### Customizing Type Icons

Edit the `typeIcons` object in `src/components/ResourceCard.jsx`:

```javascript
const typeIcons = {
  PDF: '📄',
  Document: '📝',
  Video: '🎥',
  YourType: '🎯'
}
```

## 🎯 Features in Detail

### Search
- Searches across resource titles, descriptions, and tags
- Real-time filtering as you type
- Clear button to reset search

### Category Filter
- Filter resources by category
- "All" shows everything
- Active category is highlighted
- Smooth transitions

### Resource Cards
- Type badge showing resource format
- Category badge for organization
- Descriptive title and text
- Up to 2 tags displayed
- Arrow indicator on hover
- Links open in new tab

### Responsive Design
- Desktop: 3-column grid
- Tablet: 2-column grid  
- Mobile: Single column
- Touch-friendly on mobile devices

## 📱 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Modern mobile browsers

## 🛠️ Technologies Used

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **CSS3** - Styling with CSS variables
- **ES6+** - Modern JavaScript

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🚢 Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Netlify

```bash
npm run build
# Drag and drop the 'dist' folder to Netlify
```

### GitHub Pages

Add to `vite.config.js`:
```javascript
export default defineConfig({
  plugins: [react()],
  base: '/your-repo-name/',
})
```

Then:
```bash
npm install --save-dev gh-pages
# Add to package.json scripts:
# "deploy": "npm run build && gh-pages -d dist"
npm run deploy
```

## 🎓 Learning Resources

This project demonstrates:
- React component architecture
- State management with useState
- Array filtering and searching
- Responsive CSS Grid
- CSS custom properties (variables)
- Modern ES6+ features

## 💡 Tips

- Keep resource descriptions concise (2-3 lines)
- Use relevant tags for better searchability
- Choose appropriate type icons
- Test on mobile devices
- Update URLs to real resources before deploying

## 📄 License

MIT License - Feel free to use for your own projects!

## 🤝 Contributing

Feel free to fork, modify, and use this toolkit for your own needs!

## 📧 Support

For issues or questions, please check:
1. All dependencies are installed (`npm install`)
2. Node.js version is 14 or higher
3. Port 5174 is available
4. Browser console for errors

---

**Built with ❤️ using React + Vite**

Enjoy your new toolkit website! 🎉
