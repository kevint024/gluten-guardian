const { getDefaultConfig } = require('@expo/metro-config');

const config = getDefaultConfig(__dirname);

// Enable web support
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Set public path for GitHub Pages
if (process.env.NODE_ENV === 'production') {
  config.transformer.publicPath = '/gluten-guardian/';
}

module.exports = config;
