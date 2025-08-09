# 🚀 GitHub Pages Deployment Guide

## ✅ Pre-Deployment Checklist

### 1. **Local Testing Complete**
- [x] App builds successfully with `npm run build:web`
- [x] Production build serves correctly on `http://localhost:3000`
- [x] Manual barcode entry works (test with `3017620422003`)
- [x] API calls to Open Food Facts work
- [x] Camera permissions handled gracefully
- [x] All screens navigate correctly

### 2. **GitHub Pages Preparation**
- [x] `.nojekyll` file created to bypass Jekyll
- [x] Absolute paths converted to relative paths
- [x] Files ready in `dist/` directory

## 🌐 Deployment Steps

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Deploy web version with barcode scanner fixes"
git push origin New-Web-Version
```

### Step 2: Enable GitHub Pages
1. Go to your repository: `https://github.com/kevint024/gluten-guardian`
2. Click **Settings** tab
3. Scroll to **Pages** section
4. Set **Source** to "Deploy from a branch"
5. Select **Branch**: `New-Web-Version`
6. Select **Folder**: `/ (root)` or `/dist` if available
7. Click **Save**

### Step 3: Deploy Files
Since GitHub Pages expects files in the root, you need to either:

**Option A: Deploy from `dist/` branch**
```bash
# Create a deployment branch with just the dist files
git checkout --orphan gh-pages
git rm -rf .
cp -r dist/* .
git add .
git commit -m "Deploy to GitHub Pages"
git push origin gh-pages
```

**Option B: Use GitHub Actions (Recommended)**
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [ New-Web-Version ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm install
      - name: Build web app
        run: |
          npm run use-web
          npm run build:web
          npm run prepare-pages
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

## 🧪 Production Testing

### Test URL (after deployment):
`https://kevint024.github.io/gluten-guardian/`

### Tests to Run:
1. **Basic Functionality**
   - [ ] App loads without errors
   - [ ] All navigation buttons work
   - [ ] UI displays correctly

2. **Manual Barcode Entry**
   - [ ] Click "🔢 Enter Barcode"
   - [ ] Enter `3017620422003` (Nutella)
   - [ ] Should find product with ingredients
   - [ ] Should show "UNSAFE" status (contains gluten)

3. **Camera Scanner**
   - [ ] Click "📷 Scan Barcode"
   - [ ] Should request camera permissions
   - [ ] Should show clear error if HTTPS not available
   - [ ] Should gracefully fallback to manual entry

4. **Search Functions**
   - [ ] Food product search works
   - [ ] Dish search works
   - [ ] Manual ingredient analysis works

5. **Storage & Favorites**
   - [ ] Can add items to favorites
   - [ ] Favorites persist between sessions
   - [ ] Cache works for repeated lookups

## 🔍 HTTPS Requirements

### Camera Scanner Requirements:
- ✅ **localhost**: Works for local testing
- ✅ **GitHub Pages**: Automatically uses HTTPS
- ❌ **HTTP sites**: Camera won't work due to browser security

### API Calls:
- ✅ **Open Food Facts**: Works over HTTPS
- ✅ **GitHub Pages**: Mixed content allowed for API calls

## 🐛 Troubleshooting

### If deployment fails:
1. Check GitHub Actions logs
2. Verify `dist/` directory has correct files
3. Ensure `.nojekyll` file exists
4. Check for console errors in browser

### If camera doesn't work:
- Expected behavior on GitHub Pages (HTTPS)
- Check browser permissions
- Fallback to manual entry should work

### If API calls fail:
- Check browser console for CORS errors
- Verify network connectivity
- Open Food Facts API should work from GitHub Pages

## 📊 Performance Expectations

### Bundle Size:
- Main bundle: ~477 kB (acceptable for web)
- QuaggaJS adds ~200 kB for camera scanning
- Total initial load: ~700 kB

### Features Working on GitHub Pages:
- ✅ Manual barcode entry
- ✅ API calls to Open Food Facts
- ✅ Product search
- ✅ Dish search
- ✅ Ingredient analysis
- ✅ Local storage/favorites
- ✅ Camera scanner (with HTTPS)

### Known Limitations:
- Camera requires user permission
- Some corporate networks may block camera
- Older browsers may not support all features

## 🎯 Success Criteria

The deployment is successful if:
1. **App loads** on `https://kevint024.github.io/gluten-guardian/`
2. **Manual barcode** `3017620422003` finds Nutella
3. **Navigation** between all screens works
4. **No console errors** for core functionality
5. **Mobile responsive** design works

Ready to deploy! 🚀
