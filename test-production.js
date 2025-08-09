#!/usr/bin/env node

/**
 * Production Build Test Script
 * Verifies that the built web app has all necessary components
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 Testing production build...\n');

const distDir = path.join(__dirname, 'dist');
const requiredFiles = [
  'index.html',
  'favicon.ico',
  '.nojekyll',
  '_expo'
];

let allTestsPassed = true;

// Test 1: Check required files exist
console.log('📁 Checking required files...');
for (const file of requiredFiles) {
  const filePath = path.join(distDir, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file} exists`);
  } else {
    console.log(`❌ ${file} missing`);
    allTestsPassed = false;
  }
}

// Test 2: Check index.html content
console.log('\n📄 Checking index.html...');
const indexPath = path.join(distDir, 'index.html');
if (fs.existsSync(indexPath)) {
  const indexContent = fs.readFileSync(indexPath, 'utf8');
  
  // Check for relative paths (not absolute)
  if (indexContent.includes('src="./_expo/') || indexContent.includes('href="./')) {
    console.log('✅ Contains relative paths');
  } else {
    console.log('⚠️ May contain absolute paths');
  }
  
  // Check for app title
  if (indexContent.includes('Gluten Guardian')) {
    console.log('✅ Contains app title');
  } else {
    console.log('❌ Missing app title');
    allTestsPassed = false;
  }
} else {
  console.log('❌ index.html not found');
  allTestsPassed = false;
}

// Test 3: Check bundle files
console.log('\n📦 Checking bundle files...');
const expoDir = path.join(distDir, '_expo');
if (fs.existsSync(expoDir)) {
  const staticDir = path.join(expoDir, 'static');
  if (fs.existsSync(staticDir)) {
    const jsDir = path.join(staticDir, 'js', 'web');
    if (fs.existsSync(jsDir)) {
      const jsFiles = fs.readdirSync(jsDir);
      const mainBundle = jsFiles.find(file => file.startsWith('index-') && file.endsWith('.js'));
      if (mainBundle) {
        const bundleSize = fs.statSync(path.join(jsDir, mainBundle)).size;
        console.log(`✅ Main bundle: ${mainBundle} (${Math.round(bundleSize / 1024)} KB)`);
        
        // Check bundle content for key components
        const bundleContent = fs.readFileSync(path.join(jsDir, mainBundle), 'utf8');
        if (bundleContent.includes('Gluten Guardian') || bundleContent.includes('GLUTEN_INGREDIENTS')) {
          console.log('✅ Bundle contains app code');
        } else {
          console.log('⚠️ Bundle may not contain expected app code');
        }
      } else {
        console.log('❌ No main bundle found');
        allTestsPassed = false;
      }
    } else {
      console.log('❌ JS directory not found');
      allTestsPassed = false;
    }
  } else {
    console.log('❌ Static directory not found');
    allTestsPassed = false;
  }
} else {
  console.log('❌ _expo directory not found');
  allTestsPassed = false;
}

// Test 4: Estimate total size
console.log('\n📊 Calculating total size...');
function getDirSize(dirPath) {
  let size = 0;
  const items = fs.readdirSync(dirPath);
  for (const item of items) {
    const itemPath = path.join(dirPath, item);
    const stats = fs.statSync(itemPath);
    if (stats.isDirectory()) {
      size += getDirSize(itemPath);
    } else {
      size += stats.size;
    }
  }
  return size;
}

if (fs.existsSync(distDir)) {
  const totalSize = getDirSize(distDir);
  console.log(`📏 Total bundle size: ${Math.round(totalSize / 1024)} KB`);
  
  if (totalSize < 2 * 1024 * 1024) { // Less than 2MB
    console.log('✅ Bundle size acceptable for web deployment');
  } else {
    console.log('⚠️ Bundle size is large (>2MB)');
  }
}

// Final result
console.log('\n' + '='.repeat(50));
if (allTestsPassed) {
  console.log('🎉 All tests passed! Ready for GitHub Pages deployment.');
  console.log('\nNext steps:');
  console.log('1. git add .');
  console.log('2. git commit -m "Deploy web version to GitHub Pages"');
  console.log('3. git push origin New-Web-Version');
  console.log('\nDeployment URL will be: https://kevint024.github.io/gluten-guardian/');
} else {
  console.log('❌ Some tests failed. Check the issues above before deploying.');
  process.exit(1);
}

console.log('\n🧪 Production build test completed!');
