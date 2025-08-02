# 🛡️ Gluten Guardian - Testing Guide

## 📱 Available App Versions

Your Gluten Guardian app now has **3 different versions** you can test safely:

### 1. **Main Version** (Current Working Version)
- ✅ **Working perfectly** - manual barcode entry
- 🔢 **Enter barcodes manually** (no camera needed)
- 🌐 **Open Food Facts API** integration
- 💾 **Offline caching** and favorites
- ✏️ **Manual ingredient checker**

### 2. **Camera Test Version** (New!)
- 📷 **Camera barcode scanning** (experimental)
- 🔢 **Manual barcode entry** (backup option)
- ⚠️ **May have compatibility issues** on some devices
- 🧪 **Testing camera functionality**

### 3. **Simple Version** (Backup)
- 🔢 **Manual barcode entry only**
- 📱 **Minimal version** for maximum compatibility
- 🛡️ **Guaranteed to work** on all devices

---

## 🔄 How to Switch Between Versions

### Using NPM Commands (Recommended):
```bash
# Switch to camera testing version
npm run use-camera

# Switch back to main working version  
npm run use-main

# Switch to simple backup version
npm run use-simple

# See available options
npm run switch
```

### Manual Switching:
```bash
node switch-version.js camera   # Test camera functionality
node switch-version.js main     # Back to working version
node switch-version.js simple   # Backup version
```

---

## 🧪 Testing Camera Version

### Step 1: Switch to Camera Version
```bash
npm run use-camera
```

### Step 2: Start the App
```bash
npm start
```

### Step 3: Test Camera Features
- 📷 **"Scan Barcode"** - Tests camera scanning
- 🔢 **"Enter Barcode"** - Manual entry (still available)
- ✏️ **"Manual Check"** - Ingredient analysis

### Step 4: If Camera Fails
```bash
npm run use-main  # Switch back to working version
```

---

## 🔍 Sample Barcodes for Testing

Try these with either version:
- `3017620422003` - Nutella (Ferrero)
- `7622210471499` - Oreo cookies  
- `4901777308503` - Sample product

---

## 🛠️ Troubleshooting

### Camera Permission Issues:
- App will request camera permission automatically
- Grant permission when prompted
- If denied, use "Grant Permission" button

### Native Module Errors:
- Switch back to main version: `npm run use-main`
- Clear Expo cache: `expo start --clear`
- Restart development server

### Performance Issues:
- Use simple version: `npm run use-simple`
- Check internet connection for API calls

---

## 📋 Current Status

- **Main Version**: ✅ Fully working
- **Camera Version**: 🧪 Experimental testing  
- **Simple Version**: ✅ Backup option

**Recommendation**: Test camera version, but keep main version as your reliable fallback!

---

## 🚀 Next Steps

1. **Test camera version** on your device
2. **Report any issues** you encounter  
3. **Compare performance** between versions
4. **Choose preferred version** for daily use

Happy testing! 🛡️
