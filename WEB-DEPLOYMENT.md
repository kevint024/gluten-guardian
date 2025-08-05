# Gluten Guardian - Web Deployment Guide

🛡️ **Gluten Guardian** is now available as a static web application! This guide will help you deploy the React Native Expo app as a static website.

## 🚀 Quick Start

### 1. Switch to Web Version
```bash
npm run use-web
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Build for Web
```bash
npm run build:web
```

### 4. Test Locally
```bash
npm run serve
```

### 5. Deploy (Automated Setup)
```bash
node setup-web.js
```

## 📁 Project Structure

```
gluten-guardian/
├── App-Web.js           # Web-optimized React Native app
├── app.config.js        # Expo web configuration
├── web/
│   ├── index.html       # HTML template with SEO
│   └── manifest.json    # PWA manifest
├── dist/                # Built web app (after build)
└── setup-web.js         # Automated deployment script
```

## 🌐 Web Features

### ✅ Full Functionality
- ✅ Barcode lookup (manual entry)
- ✅ Manual ingredient analysis  
- ✅ Product search via Open Food Facts API
- ✅ Dish database search (25+ common dishes)
- ✅ Favorites system (localStorage)
- ✅ Comprehensive gluten ingredient detection
- ✅ Web-optimized UI/UX
- ✅ Responsive design
- ✅ PWA support

### 🔄 Platform Adaptations
- **Storage**: Uses `localStorage` instead of AsyncStorage
- **Alerts**: Web-compatible `confirm()`/`alert()` dialogs
- **Camera**: Manual barcode entry (camera scanning via mobile app)
- **Styling**: Web-responsive with max-width constraints

## 🚀 Deployment Options

### 1. Netlify (Recommended)
1. Build the app: `npm run build:web`
2. Drag & drop the `dist` folder to [Netlify](https://netlify.com)
3. Your app will be live immediately!

### 2. Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Build the app: `npm run build:web`
3. Deploy: `cd dist && vercel`

### 3. GitHub Pages
1. Build the app: `npm run build:web`
2. Push `dist` contents to `gh-pages` branch
3. Enable GitHub Pages in repository settings

### 4. Any Static Host
Upload the `dist` folder contents to any static hosting service:
- Firebase Hosting
- AWS S3 + CloudFront
- Azure Static Web Apps
- Surge.sh

## 🛠️ Configuration

### Web App Manifest (`web/manifest.json`)
```json
{
  "name": "Gluten Guardian",
  "short_name": "GlutenGuardian",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#2e7d3e"
}
```

### SEO & Meta Tags (`web/index.html`)
- Open Graph tags for social sharing
- Twitter Card support
- Proper meta descriptions
- Favicon and app icons

## 🔧 Development

### Local Development
```bash
npm run use-web    # Switch to web version
npm start          # Start Expo dev server
# Open http://localhost:19006 in browser
```

### Build & Test
```bash
npm run build:web  # Build static files
npm run serve      # Test built version locally
```

### Switch Between Versions
```bash
npm run use-main     # Mobile app (full features)
npm run use-web      # Web app (no camera)
npm run use-simple   # Simple version (no camera)
npm run use-camera   # Camera test version
```

## 🌟 Key Differences from Mobile App

| Feature | Mobile App | Web App |
|---------|------------|---------|
| Barcode Scanning | Camera + Manual | Manual Only |
| Storage | AsyncStorage | localStorage |
| Alerts | Native Alerts | Browser Dialogs |
| Performance | Native | Web-optimized |
| Installation | App Store | PWA/Bookmark |

## 📱 Progressive Web App (PWA)

The web version includes PWA features:
- **Installable**: Add to home screen on mobile
- **Offline Ready**: Core functionality works offline
- **App-like Experience**: Full-screen, native feel
- **Fast Loading**: Optimized bundle size

## 🧪 Testing

### Browser Compatibility
- ✅ Chrome/Chromium (Desktop & Mobile)
- ✅ Firefox (Desktop & Mobile)  
- ✅ Safari (Desktop & Mobile)
- ✅ Edge (Desktop & Mobile)

### Features to Test
1. **Barcode Lookup**: Enter barcodes manually
2. **Manual Analysis**: Paste ingredient lists
3. **Product Search**: Search "cereal", "bread", etc.
4. **Dish Search**: Search "pizza", "pasta", etc.
5. **Favorites**: Add/remove items
6. **Storage Persistence**: Refresh page, data should remain

## 🔍 API Integration

### Open Food Facts API
- **Endpoint**: `https://world.openfoodfacts.org/api/v0/product/{barcode}.json`
- **Rate Limiting**: No authentication required
- **CORS**: Fully supported for web requests

### Local Dish Database
- 25+ pre-analyzed common dishes
- Instant search results
- No API dependencies

## 🐛 Troubleshooting

### Build Issues
```bash
# Clear cache and rebuild
npm start -- --clear
npm run build:web
```

### Storage Issues
```bash
# Check localStorage in browser DevTools
localStorage.getItem('favorites')
localStorage.getItem('productCache')
```

### Deployment Issues
```bash
# Verify build output
ls -la dist/
# Should contain: index.html, static/, manifest.json
```

## 📚 Tech Stack

- **React Native**: v0.79.5 (via react-native-web)
- **Expo**: v53.0.20 with web support
- **React Native Web**: v0.20.0
- **Storage**: HTML5 localStorage
- **Build Tool**: Expo Metro bundler
- **Deployment**: Static files (HTML/CSS/JS)

## 🤝 Contributing

To contribute to the web version:

1. Fork the repository
2. Switch to web version: `npm run use-web`
3. Make changes to `App-Web.js`
4. Test locally: `npm start`
5. Build and test: `npm run build:web && npm run serve`
6. Submit pull request

## 📄 License

Same license as the main Gluten Guardian project.

## 🆘 Support

For web-specific issues:
- Check browser console for errors
- Verify localStorage permissions
- Test in incognito/private mode
- Report issues with browser/version info

---

🌾 **Gluten Guardian Web** - Protecting you from gluten, now on any device with a browser!
