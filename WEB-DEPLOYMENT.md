# 🌐 Gluten Guardian - Web Deployment Guide

Your Expo app is now configured for static web deployment! Here are your deployment options:

**Last updated:** August 5, 2025

## 🚀 Quick Deploy Options

### Option 1: GitHub Pages (Automated) ⭐ **RECOMMENDED**

✅ **COMPLETED SETUP!** Your app is now ready for GitHub Pages deployment.

1. **Code has been pushed** ✅
   ```bash
   git add .
   git commit -m "Configure app for GitHub Pages deployment"
   git push origin Web-version
   ```

2. **Enable GitHub Pages:**
   - Go to your repo: `https://github.com/kevint024/gluten-guardian`
   - Settings → Pages
   - Source: "GitHub Actions"
   - The workflow will automatically deploy on push!

3. **Your site will be live at:**
   `https://kevint024.github.io/gluten-guardian/`

### ✅ Configuration Changes Made:

- ✅ Removed `"output": "static"` from app.json to fix expo-router errors
- ✅ Added `.nojekyll` file for GitHub Pages compatibility
- ✅ Added URL scheme for better web support
- ✅ GitHub Actions workflow is properly configured
- ✅ Web build tested successfully (422 kB bundle)

### Option 2: Netlify (Drag & Drop)

1. **Build locally:**
   ```bash
   cd gluten-guardian
   npx expo export --platform web
   ```

2. **Deploy:**
   - Go to [netlify.com](https://netlify.com)
   - Drag the `dist` folder to Netlify
   - Instant deployment!

### Option 3: Vercel

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   cd gluten-guardian
   npx expo export --platform web
   vercel --prod dist
   ```

## 📁 Build Output

Your static files are in the `dist` folder:
```
dist/
├── index.html          # Main HTML file
├── favicon.ico         # Favicon
├── metadata.json       # App metadata
└── _expo/
    └── static/
        └── js/
            └── web/
                └── index-[hash].js  # Main JavaScript bundle (422 kB)
```

## 🔧 Build Commands

- **Development:** `npm start`
- **Web Development:** `npm run web` 
- **Build for Production:** `npx expo export --platform web`
- **Preview Build:** `npx serve dist`

## ⚙️ Configuration

The app is configured for:
- ✅ Static site generation
- ✅ GitHub Pages compatibility
- ✅ Optimized web bundles
- ✅ Automatic deployment via GitHub Actions
- ✅ Progressive Web App (PWA) features

## 🌟 Features on Web

- ✅ Manual ingredient checking
- ✅ Barcode lookup (manual entry)
- ✅ Food product search
- ✅ Dish/recipe search
- ✅ Favorites system
- ✅ Local storage persistence
- ⚠️ Camera scanning (limited - web browsers have restrictions)

## 🔗 Live Demo

Once deployed, your app will be available at:
- **GitHub Pages:** `https://kevint024.github.io/gluten-guardian/`
- **Custom domain:** Configure in GitHub Pages settings

## 💡 Tips

1. **Camera on Web:** Browser camera access requires HTTPS
2. **Mobile-First:** The responsive design works great on mobile browsers
3. **PWA:** Users can "Add to Home Screen" on mobile
4. **Offline:** Basic functionality works offline after first load
