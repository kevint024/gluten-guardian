# GitHub Actions Disabled

This directory contains disabled GitHub Actions workflows due to persistent permission issues.

The project now uses a simpler deployment strategy:

```bash
npm run deploy
```

This builds the app and commits to the `/docs` folder for GitHub Pages deployment from a branch + docs folder setup.

## Previous Issues
- GitHub Actions bot permission denied (403 errors)
- Complex token authentication requirements
- Unreliable automated deployments

## Current Solution
- Manual build process with automated git operations
- Uses `/docs` folder deployment strategy
- No GitHub Actions tokens required
- More reliable and predictable deployment
