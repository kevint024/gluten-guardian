# 🚀 Manual GitHub Pages Deployment

Since GitHub Actions is having permission issues, here's how to deploy manually:

## Quick Manual Deployment

### Step 1: Build and Commit
```bash
# Make sure you're on the right branch
git checkout New-Web-Version

# Build the production version
npm run build:web
npm run prepare-pages

# Add all changes
git add .
git commit -m "🚀 Deploy web version with scanner fixes"
```

### Step 2: Create gh-pages branch
```bash
# Create orphan branch for GitHub Pages
git checkout --orphan gh-pages

# Remove all files except dist
git rm -rf .
git clean -fxd

# Copy dist files to root
cp -r dist/* .
cp dist/.nojekyll .

# Add and commit
git add .
git commit -m "🚀 Deploy to GitHub Pages"

# Push to GitHub
git push origin gh-pages --force
```

### Step 3: Configure GitHub Pages
1. Go to https://github.com/kevint024/gluten-guardian/settings/pages
2. Under "Source", select "Deploy from a branch"
3. Select "gh-pages" branch
4. Select "/ (root)" folder
5. Click "Save"

### Step 4: Access Your App
Your app will be available at: **https://kevint024.github.io/gluten-guardian/**

## Alternative: Using GitHub CLI

If you have GitHub CLI installed:

```bash
# Build
npm run build:web && npm run prepare-pages

# Deploy using gh CLI
gh workflow run deploy.yml --ref New-Web-Version
```

## Troubleshooting GitHub Actions

### Fix Permissions:
1. Go to Settings → Actions → General
2. Set "Workflow permissions" to "Read and write permissions"
3. Check "Allow GitHub Actions to create and approve pull requests"
4. Save changes

### Enable Pages:
1. Go to Settings → Pages
2. Set Source to "GitHub Actions"
3. Save

Then trigger the workflow again by pushing a commit.

## Windows PowerShell Commands

```powershell
# Build
npm run build:web
npm run prepare-pages

# Manual deployment
git checkout --orphan gh-pages
git rm -rf *
Copy-Item -Path "dist\*" -Destination "." -Recurse
Copy-Item -Path "dist\.nojekyll" -Destination "."
git add .
git commit -m "Deploy to GitHub Pages"
git push origin gh-pages --force

# Go back to main branch
git checkout New-Web-Version
```

Your app should be live within 1-2 minutes! 🎉
