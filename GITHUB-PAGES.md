# GitHub Pages Deployment Guide

## 🚀 Automatic Deployment Setup

Your Gluten Guardian web app is configured for automatic deployment to GitHub Pages using GitHub Actions.

### ✅ What's Already Configured

1. **GitHub Actions Workflow** (`.github/workflows/deploy-pages.yml`)
   - Automatically builds and deploys on push to `main` or `New-Web-Version` branches
   - Uses Node.js 18 and npm for building
   - Switches to web version and builds the static site
   - Deploys to GitHub Pages

2. **Build Scripts** (in `package.json`)
   - `npm run deploy:github` - Builds for GitHub Pages deployment
   - `npm run use-web` - Switches to web version
   - `npm run build:web` - Builds static web files

### 🔧 Manual Setup Steps

To enable GitHub Pages for your repository:

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Add GitHub Pages deployment"
   git push origin New-Web-Version
   ```

2. **Enable GitHub Pages in your repo:**
   - Go to your repository on GitHub
   - Click **Settings** tab
   - Scroll down to **Pages** section
   - Under **Source**, select **GitHub Actions**
   - The workflow will automatically trigger

3. **Wait for deployment:**
   - Check the **Actions** tab to see the deployment progress
   - Once complete, your app will be live at: `https://kevint024.github.io/gluten-guardian/`

### 🌐 Your Live URLs

After deployment, your Gluten Guardian web app will be available at:

- **Main URL:** `https://kevint024.github.io/gluten-guardian/`
- **Custom Domain:** (You can configure a custom domain in GitHub Pages settings)

### 🔄 Updating Your Site

The site will automatically update whenever you push changes to the `main` or `New-Web-Version` branches. The GitHub Action will:

1. Switch to the web version
2. Install dependencies
3. Build the static files
4. Deploy to GitHub Pages

### 📱 Features Available on GitHub Pages

Your deployed web app includes:
- ✅ **Camera barcode scanning** (QuaggaJS)
- ✅ **Manual barcode lookup**
- ✅ **Ingredient analysis**
- ✅ **Food and dish search**
- ✅ **Local storage for favorites**
- ✅ **Responsive mobile design**
- ✅ **PWA capabilities**

### 🛠️ Troubleshooting

If deployment fails:
1. Check the **Actions** tab for error messages
2. Ensure all dependencies are in `package.json`
3. Test locally with `npm run deploy:github`
4. Verify the `dist/` folder is created properly

### 📊 Monitoring

- **Build Status:** Check the Actions tab for build/deploy status
- **Traffic:** GitHub provides basic analytics in Settings > Insights
- **Issues:** Monitor the Issues tab for user feedback

---

**Note:** The original mobile app (`App.js`) remains unchanged and can still be used with Expo Go for mobile development.
