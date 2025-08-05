export default {
  expo: {
    name: "Gluten Guardian",
    slug: "gluten-guardian",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      }
    },
    web: {
      favicon: "./assets/favicon.png",
      bundler: "metro",
      output: "single"
    },
    plugins: [
      [
        "expo-camera",
        {
          cameraPermission: "Allow Gluten Guardian to access your camera to scan barcodes."
        }
      ]
    ]
  }
};
