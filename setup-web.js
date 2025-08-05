#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Setting up Gluten Guardian as a Static Web App...\n');

// Step 1: Switch to web version
console.log('1. Switching to web-optimized version...');
try {
  execSync('node switch-version.js web', { stdio: 'inherit' });
  console.log('✅ Switched to web version\n');
} catch (error) {
  console.error('❌ Failed to switch to web version:', error.message);
  process.exit(1);
}

// Step 2: Install dependencies
console.log('2. Installing dependencies...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Dependencies installed\n');
} catch (error) {
  console.error('❌ Failed to install dependencies:', error.message);
  process.exit(1);
}

// Step 3: Build web version
console.log('3. Building web application...');
try {
  execSync('npm run build:web', { stdio: 'inherit' });
  console.log('✅ Web build completed\n');
} catch (error) {
  console.error('❌ Failed to build web version:', error.message);
  process.exit(1);
}

// Step 4: Create deployment info
const deploymentInfo = {
  name: "Gluten Guardian",
  description: "Gluten-free food scanner and ingredient analyzer",
  buildDate: new Date().toISOString(),
  version: "1.0.0",
  platform: "web",
  deploymentInstructions: {
    local: "Run 'npm run serve' to test locally",
    netlify: "Deploy the 'dist' folder to Netlify",
    vercel: "Deploy the 'dist' folder to Vercel",
    githubPages: "Deploy the 'dist' folder to GitHub Pages"
  }
};

fs.writeFileSync(
  path.join(__dirname, 'dist', 'deployment-info.json'),
  JSON.stringify(deploymentInfo, null, 2)
);

console.log('🎉 Static web app setup complete!\n');
console.log('📁 Built files are in the "dist" folder');
console.log('🌐 To test locally, run: npm run serve');
console.log('☁️  To deploy, upload the "dist" folder to your hosting service\n');

console.log('🚀 Deployment Options:');
console.log('• Netlify: Drag & drop the "dist" folder');
console.log('• Vercel: Run "vercel" in the project directory');
console.log('• GitHub Pages: Push "dist" contents to gh-pages branch');
console.log('• Any static host: Upload "dist" folder contents\n');

console.log('✨ Gluten Guardian is ready to help people stay gluten-free!');
