# Copilot Instructions for Gluten Guardian

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
This is a React Native Expo app called "Gluten Guardian" that helps users with gluten allergies scan food products and check for gluten ingredients.

## Key Features
- Barcode scanning using expo-barcode-scanner
- Integration with Open Food Facts API
- Manual ingredient analysis
- Local storage for favorites using AsyncStorage
- Offline caching of scanned products
- Comprehensive gluten ingredient detection

## Technical Stack
- React Native with Expo
- expo-barcode-scanner for barcode scanning
- @react-native-async-storage/async-storage for local storage
- Open Food Facts API for product data
- Native device camera integration

## Code Style Guidelines
- Use functional components with React hooks
- Follow React Native best practices
- Implement proper error handling for API calls
- Use descriptive variable and function names
- Add comments for complex logic
- Ensure accessibility considerations

## Security & Privacy
- Handle camera permissions properly
- Implement proper error handling for network requests
- Store only necessary data locally
- No sensitive user data collection

## Performance Considerations
- Implement caching for API responses
- Optimize re-renders with proper state management
- Handle loading states appropriately
- Consider offline functionality
