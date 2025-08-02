# 🛡️ Gluten Guardian

A React Native Expo app that helps users with gluten allergies scan food products and check for gluten ingredients.

## 📱 Features

### Core Functionality
- **Barcode Scanning**: Use your device camera to scan food product barcodes
- **Ingredient Analysis**: Automatically analyzes ingredients for gluten content
- **Manual Ingredient Checker**: Input ingredients manually for analysis
- **Product Database**: Integration with Open Food Facts API for comprehensive product information

### Smart Analysis
- **Gluten Detection**: Identifies common gluten-containing ingredients including:
  - wheat, barley, rye, malt, semolina, triticale, spelt, farro
  - durum, vital wheat gluten, graham flour, brewer's yeast
  - modified food starch, maltodextrin, hydrolyzed wheat protein, and more
- **Ambiguous Ingredient Warnings**: Flags potentially problematic ingredients
- **Three-Level Safety Rating**:
  - ✅ **Safe**: No gluten ingredients found
  - ⚠️ **Caution**: May contain hidden gluten sources
  - ❌ **Unsafe**: Contains known gluten ingredients

### User Experience
- **Favorites**: Save safe products locally for quick reference
- **Offline Caching**: Previously scanned products are cached for offline access
- **Clean UI**: Mobile-friendly interface with intuitive navigation
- **Fast Results**: Quick analysis and clear visual feedback

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- Expo CLI
- Expo Go app on your mobile device (for testing)

### Installation

1. **Clone or download the project**
   ```bash
   cd gluten-guardian
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on your device**
   - Scan the QR code with Expo Go app (Android)
   - Scan the QR code with Camera app (iOS)
   - Or run on simulator: `npm run ios` or `npm run android`

### Running on Different Platforms

```bash
# Run on Android device/emulator
npm run android

# Run on iOS device/simulator (macOS only)
npm run ios

# Run in web browser
npm run web
```

## 🔧 Technical Stack

- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and toolchain
- **expo-barcode-scanner**: Barcode scanning functionality
- **@react-native-async-storage/async-storage**: Local data persistence
- **Open Food Facts API**: Product information database

## 📖 Usage Guide

### 1. Scanning Products
1. Tap "📷 Scan Barcode" on the home screen
2. Allow camera permissions when prompted
3. Point your camera at a product barcode
4. Wait for automatic scanning and analysis

### 2. Manual Ingredient Check
1. Tap "✏️ Manual Check" on the home screen
2. Enter or paste the ingredient list
3. Tap "🔍 Analyze Ingredients" to get results

### 3. Managing Favorites
1. After scanning a safe product, tap "☆ Add to Favorites"
2. Access your favorites from the home screen
3. Remove items by tapping "Remove" in the favorites list

### 4. Understanding Results
- **✅ Safe**: No gluten ingredients detected
- **⚠️ Caution**: Contains ambiguous ingredients that may hide gluten
- **❌ Unsafe**: Contains known gluten ingredients

## 🔒 Privacy & Permissions

- **Camera Permission**: Required for barcode scanning
- **Internet Access**: Needed to fetch product data from Open Food Facts API
- **Local Storage**: Only product data and favorites are stored locally
- **No Personal Data**: No personal information is collected or transmitted

## 🌐 API Integration

This app uses the [Open Food Facts](https://world.openfoodfacts.org/) API:
- Free and open database of food products
- Comprehensive ingredient information
- No API key required
- Offline caching for previously scanned products

## 🧪 Testing

### Manual Testing Checklist
- [ ] Barcode scanning works with various product types
- [ ] Manual ingredient analysis provides accurate results
- [ ] Favorites can be added and removed
- [ ] Offline cached products load correctly
- [ ] Camera permissions are handled properly
- [ ] Error handling works for invalid barcodes

### Test Products
Try scanning these common products:
- Bread products (likely unsafe)
- Rice cakes (likely safe)
- Soy sauce (likely caution)
- Fresh fruits/vegetables (likely safe)

## 🚀 Deployment

### For Expo Snack
1. Copy the App.js code to a new Expo Snack
2. Add the required dependencies in the Snack interface
3. Test on your device using the Expo Go app

### For Production Build
1. Configure app signing
2. Run `expo build:android` or `expo build:ios`
3. Submit to app stores following Expo documentation

## ⚠️ Disclaimers

- **Medical Advice**: This app is for informational purposes only and should not replace medical advice
- **Ingredient Changes**: Manufacturers may change ingredients; always check product labels
- **Database Accuracy**: Product information depends on Open Food Facts database accuracy
- **Gluten Sensitivity**: Consult healthcare providers for severe gluten allergies

## 🤝 Contributing

Contributions are welcome! Areas for improvement:
- Additional gluten ingredient detection
- Enhanced UI/UX
- Offline mode improvements
- Accessibility features
- Multi-language support

## 📄 License

This project is open source and available under the MIT License.

## 🆘 Support

For issues or questions:
1. Check that all dependencies are properly installed
2. Ensure camera permissions are granted
3. Verify internet connection for API calls
4. Check Expo CLI and React Native versions

## 🙏 Acknowledgments

- [Open Food Facts](https://world.openfoodfacts.org/) for the free product database
- [Expo](https://expo.dev/) for the excellent development platform
- The React Native community for comprehensive documentation
- Gluten-free community for ingredient awareness

---

**Made with ❤️ for the gluten-free community**
