#!/usr/bin/env node

/**
 * GitHub Pages Deployment Script
 * Ensures proper files are in place for GitHub Pages deployment
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Preparing for GitHub Pages deployment...');

// Ensure dist directory exists
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  console.error('❌ dist/ directory not found. Run npm run build:web first.');
  process.exit(1);
}

// Create .nojekyll file to prevent Jekyll processing
const nojekyllPath = path.join(distDir, '.nojekyll');
if (!fs.existsSync(nojekyllPath)) {
  fs.writeFileSync(nojekyllPath, '');
  console.log('✅ Created .nojekyll file');
} else {
  console.log('✅ .nojekyll file already exists');
}

// Fix absolute paths in index.html for GitHub Pages
const indexPath = path.join(distDir, 'index.html');
if (fs.existsSync(indexPath)) {
  let indexContent = fs.readFileSync(indexPath, 'utf8');
  
  // Convert absolute paths to relative paths
  indexContent = indexContent.replace(/href="\/favicon\.ico"/g, 'href="./favicon.ico"');
  indexContent = indexContent.replace(/src="\/_expo\//g, 'src="./_expo/');
  
  fs.writeFileSync(indexPath, indexContent);
  console.log('✅ Fixed paths in index.html for GitHub Pages');
} else {
  console.log('❌ index.html not found');
}

// Check for required files
const requiredFiles = ['index.html', 'favicon.ico'];
const missingFiles = requiredFiles.filter(file => 
  !fs.existsSync(path.join(distDir, file))
);

if (missingFiles.length > 0) {
  console.error('❌ Missing required files:', missingFiles.join(', '));
  process.exit(1);
}

console.log('✅ GitHub Pages deployment files are ready!');
console.log('📁 Files in dist/:');

// List all files in dist
const files = fs.readdirSync(distDir, { withFileTypes: true });
files.forEach(file => {
  const icon = file.isDirectory() ? '📁' : '📄';
  console.log(`   ${icon} ${file.name}`);
});

console.log('\n🌐 Ready for GitHub Pages deployment!');
console.log('💡 Push to GitHub and enable Pages in repository settings.');
