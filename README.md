# React Link Website

A modern, beautiful link-in-bio style website built with React and Vite.

## Features

- 🎨 Beautiful gradient design with animations
- 📱 Fully responsive for all devices
- ⚡ Fast and lightweight
- 🎯 Easy to customize
- 🔗 Multiple link cards with icons
- 🌐 Social media icons

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open your browser and visit `http://localhost:5173`

### Build for Production

```bash
npm run build
```

## Customization

### Update Your Profile

Edit `src/components/ProfileSection.jsx`:
- Change the profile name
- Update the bio text
- Replace the avatar URL

### Add/Edit Links

Edit the `links` array in `src/App.jsx`:
```javascript
const links = [
  {
    id: 1,
    title: 'Your Link Title',
    url: 'https://your-url.com',
    icon: '🎯'
  },
  // Add more links...
]
```

### Update Social Media Links

Edit the `socialLinks` array in `src/App.jsx` with your social media URLs.

### Customize Colors

The main gradient colors can be changed in:
- `src/index.css` - Background gradient
- `src/components/LinkCard.css` - Link card gradients
- `src/components/SocialLinks.css` - Social icon gradients

## Technologies

- React 18
- Vite
- CSS3 with animations
- Modern ES6+ JavaScript

## License

MIT
