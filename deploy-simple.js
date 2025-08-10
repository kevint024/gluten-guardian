#!/usr/bin/env node

/**
 * Simple Deployment Script for Gluten Guardian
 * Builds and deploys to GitHub Pages without GitHub Actions
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Starting Simple Deployment Process...\n');

try {
  // Step 1: Clean previous builds
  console.log('🧹 Cleaning previous builds...');
  if (fs.existsSync('dist')) {
    fs.rmSync('dist', { recursive: true, force: true });
  }
  if (fs.existsSync('docs')) {
    fs.rmSync('docs', { recursive: true, force: true });
  }

  // Step 2: Switch to web version
  console.log('🔄 Switching to web version...');
  execSync('npm run use-web', { stdio: 'inherit' });

  // Step 3: Build the application
  console.log('📦 Building web application...');
  execSync('npm run build:web', { stdio: 'inherit' });

  // Step 4: Create docs directory (GitHub Pages from /docs)
  console.log('📁 Preparing GitHub Pages files...');
  
  if (!fs.existsSync('dist')) {
    throw new Error('Build failed - dist directory not found');
  }

  // Copy dist to docs (GitHub Pages /docs strategy)
  fs.cpSync('dist', 'docs', { recursive: true });
  
  // Create .nojekyll file
  fs.writeFileSync('docs/.nojekyll', '');
  
  // Create CNAME file if domain is configured
  const customDomain = process.env.CUSTOM_DOMAIN;
  if (customDomain) {
    fs.writeFileSync('docs/CNAME', customDomain);
  }

  // Step 5: Commit and push docs
  console.log('📤 Deploying to GitHub...');
  
  execSync('git add docs/', { stdio: 'inherit' });
  
  const timestamp = new Date().toISOString();
  const commitMessage = `🚀 Deploy web build - ${timestamp}

Built from: ${process.env.GITHUB_SHA || 'local'}
Branch: New-Web-Version
Size: ${getDirSize('docs')} KB`;

  try {
    execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });
    execSync('git push origin New-Web-Version', { stdio: 'inherit' });
  } catch (error) {
    if (error.message.includes('nothing to commit')) {
      console.log('✅ No changes to deploy');
    } else {
      throw error;
    }
  }

  console.log('\n✅ Deployment Complete!');
  console.log('📋 Next Steps:');
  console.log('1. Go to GitHub Repository Settings → Pages');
  console.log('2. Set Source to "Deploy from a branch"');
  console.log('3. Select "New-Web-Version" branch and "/docs" folder');
  console.log('4. Your app will be live at: https://kevint024.github.io/gluten-guardian/');

} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  process.exit(1);
}

function getDirSize(dirPath) {
  let totalSize = 0;
  
  function calculateSize(currentPath) {
    const stats = fs.statSync(currentPath);
    if (stats.isFile()) {
      totalSize += stats.size;
    } else if (stats.isDirectory()) {
      const files = fs.readdirSync(currentPath);
      files.forEach(file => {
        calculateSize(path.join(currentPath, file));
      });
    }
  }
  
  if (fs.existsSync(dirPath)) {
    calculateSize(dirPath);
  }
  
  return Math.round(totalSize / 1024); // Convert to KB
}
