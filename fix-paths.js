const fs = require('fs');
const path = require('path');

// Fix paths for GitHub Pages deployment
function fixGitHubPagesPaths() {
  const distPath = path.join(__dirname, 'dist');
  const indexPath = path.join(distPath, 'index.html');
  
  if (fs.existsSync(indexPath)) {
    let content = fs.readFileSync(indexPath, 'utf8');
    
    // Replace absolute paths with relative paths for GitHub Pages
    content = content.replace(/href="\/favicon\.ico"/g, 'href="./favicon.ico"');
    content = content.replace(/src="\/_expo\//g, 'src="./_expo/');
    content = content.replace(/href="\/_expo\//g, 'href="./_expo/');
    
    fs.writeFileSync(indexPath, content);
    console.log('✅ Fixed GitHub Pages paths in index.html');
  } else {
    console.log('❌ index.html not found in dist folder');
  }
}

fixGitHubPagesPaths();
