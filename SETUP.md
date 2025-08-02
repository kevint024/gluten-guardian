# Gluten Guardian - Setup Instructions

## Important: Node.js Version Requirement

**Current Issue**: Your system has Node.js v16.17.0, but this Expo project requires Node.js v18 or higher.

### Quick Fix Options:

#### Option 1: Update Node.js (Recommended)
1. Download and install Node.js v18+ from [nodejs.org](https://nodejs.org/)
2. Restart your command prompt/terminal
3. Run `node --version` to verify the update
4. Then run `npm start` in the project directory

#### Option 2: Use Expo Snack (Online)
1. Visit [snack.expo.dev](https://snack.expo.dev/)
2. Create a new snack
3. Copy the contents of `App.js` into the snack
4. Add dependencies: `expo-barcode-scanner`, `@react-native-async-storage/async-storage`
5. Test directly in your browser or Expo Go app

#### Option 3: Use Expo Go App
1. Install Expo Go on your mobile device
2. After fixing Node.js version, scan QR code from `npm start`

## Testing the App

### Features to Test:
1. **Home Screen**: Navigate between different screens
2. **Barcode Scanner**: 
   - Grant camera permission
   - Scan any product barcode
   - Test with food products for best results
3. **Manual Ingredient Checker**:
   - Test with: "wheat flour, sugar, salt" (should show unsafe)
   - Test with: "rice, vegetable oil, salt" (should show safe)
   - Test with: "natural flavoring, starch" (should show caution)
4. **Favorites**: Save and remove products
5. **Offline Mode**: Test previously scanned products

### Sample Test Ingredients:

**Unsafe (contains gluten):**
```
wheat flour, barley malt, rye bread crumbs
```

**Safe (gluten-free):**
```
rice flour, corn starch, potato starch, sugar, salt
```

**Caution (ambiguous):**
```
natural flavoring, modified starch, soy sauce
```

### Common Test Barcodes:
- Try scanning cereal boxes, bread packages, or sauce bottles
- Products in the Open Food Facts database will show full information
- Products not in database will show "Product Not Found"

## Troubleshooting

### Camera Permission Issues:
- Ensure camera permissions are granted when prompted
- Check device settings if camera access is denied

### Network Issues:
- App requires internet for initial product lookup
- Previously scanned products work offline

### Build Issues:
- Update Node.js to v18+
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear Expo cache: `expo start -c`

## Production Deployment

### Expo Build:
```bash
expo build:android
expo build:ios
```

### App Store Submission:
Follow Expo's guide for app store deployment.

## Support

For technical support:
1. Update to Node.js v18+
2. Check Expo documentation
3. Verify all dependencies are installed
4. Test with Expo Snack first
