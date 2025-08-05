#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// File paths
const mainAppPath = path.join(__dirname, 'App.js');
const cameraAppPath = path.join(__dirname, 'App-Camera.js');
const simpleAppPath = path.join(__dirname, 'App-Simple.js');
const webAppPath = path.join(__dirname, 'App-Web.js');
const indexPath = path.join(__dirname, 'index.js');

// Check which version is currently active
function getCurrentVersion() {
  try {
    const indexContent = fs.readFileSync(indexPath, 'utf8');
    if (indexContent.includes("from './App-Camera")) {
      return 'camera';
    } else if (indexContent.includes("from './App-Simple")) {
      return 'simple';
    } else if (indexContent.includes("from './App-Web")) {
      return 'web';
    } else {
      return 'main';
    }
  } catch (error) {
    return 'unknown';
  }
}

// Switch to a specific version
function switchToVersion(version) {
  let appFile;
  let versionName;
  
  switch (version) {
    case 'camera':
      appFile = './App-Camera';
      versionName = 'Camera Test Version';
      break;
    case 'simple':
      appFile = './App-Simple';
      versionName = 'Simple Version (No Camera)';
      break;
    case 'web':
      appFile = './App-Web';
      versionName = 'Web Optimized Version';
      break;
    case 'main':
    default:
      appFile = './App';
      versionName = 'Main Version';
      break;
  }
  
  const indexContent = `import { registerRootComponent } from 'expo';
import App from '${appFile}';

// Register the main component
registerRootComponent(App);
`;

  try {
    fs.writeFileSync(indexPath, indexContent);
    console.log(`✅ Switched to ${versionName}`);
    console.log(`📱 App will now use: ${appFile}.js`);
    return true;
  } catch (error) {
    console.error('❌ Error switching version:', error.message);
    return false;
  }
}

// Main function
function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  if (!command) {
    console.log('🛡️ Gluten Guardian - Version Switcher\n');
    console.log('Usage: node switch-version.js [version]\n');
    console.log('Available versions:');
    console.log('  main   - Main version (manual barcode entry)');
    console.log('  camera - Camera test version (with barcode scanning)');
    console.log('  simple - Simple version (backup, no camera)');
    console.log('  web    - Web optimized version (for static deployment)\n');
    console.log(`Current version: ${getCurrentVersion()}\n`);
    console.log('Example: node switch-version.js camera');
    return;
  }
  
  const currentVersion = getCurrentVersion();
  console.log(`Current version: ${currentVersion}`);
  
  if (command === currentVersion) {
    console.log(`✅ Already using ${command} version`);
    return;
  }
  
  if (!['main', 'camera', 'simple', 'web'].includes(command)) {
    console.error('❌ Invalid version. Use: main, camera, simple, or web');
    return;
  }
  
  switchToVersion(command);
}

main();
