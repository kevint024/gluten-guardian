# Copilot Instructions for Gluten Guardian

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilot-instructionsmd-file -->

## Project Architecture
This React Native Expo app uses a **multi-version architecture** with version switching via `switch-version.js`. The main app is in `App.js` with alternative versions (`App-Camera.js`, `App-Simple.js`) for different use cases.

### Version Management Pattern
- Use `npm run use-main|use-camera|use-simple` to switch app versions
- The `index.js` file dynamically imports the active version
- Each version has different feature sets (camera vs manual only)

## Core Analysis Engine
The app's intelligence centers around three comprehensive ingredient databases in `App.js`:

### `GLUTEN_INGREDIENTS` Array (19+ lines)
- **800+ specific gluten-containing ingredients** including wheat variants, ancient grains, processed derivatives
- Organized by categories: wheat/flour types, barley/rye, malt derivatives, processed products
- **Critical pattern**: When adding ingredients, group by source grain and include ALL variations

### `AMBIGUOUS_INGREDIENTS` Array (115+ lines)  
- **200+ ingredients that may hide gluten** - sauces, starches, flavorings, processed foods
- **Key insight**: These trigger "Caution" status requiring user verification
- **Pattern**: Include both generic terms ("natural flavor") and specific brands/products

### `DISH_DATABASE` Object (235+ lines)
- **Pre-analyzed common dishes** with ingredients, safety status, and descriptions
- **Structure**: `dishName: { ingredients, status: 'safe|caution|unsafe', description }`
- **Multi-cuisine coverage**: Italian, Asian, Mexican, Indian, American dishes

## Multi-API Search Architecture
The `searchDishes()` function demonstrates the app's resilient API integration pattern:

1. **Primary**: TheMealDB API (free, no key) - searches 1000+ recipes
2. **Secondary**: Tasty API (RapidAPI) - modern recipe database  
3. **Tertiary**: Edamam API - 2+ million recipes
4. **Fallback**: Local `DISH_DATABASE` for common dishes

**Critical pattern**: Always implement fallback chains for external APIs since free APIs are unreliable.

## State Management Patterns
- **Screen navigation**: `currentScreen` state with `switchToScreen()` function that clears cross-contaminated data
- **Data validation**: `validateAndSetSearchResults()` prevents mixing food product and dish search results
- **Caching strategy**: AsyncStorage for both `favorites` and `productCache` with immediate save-on-change

## Development Workflow
- **Testing**: Use `node demo.js` to test ingredient analysis logic outside React Native
- **Quick iteration**: Modify ingredient databases directly in `App.js` (no separate config files)
- **Device testing**: Use `npm start` then Expo Go app for real barcode scanning

## API Integration Specifics
- **Open Food Facts**: `https://world.openfoodfacts.org/api/v0/product/{barcode}.json` - no auth required
- **Error handling pattern**: Always check `data.status === 1 && data.product` before using response
- **Rate limiting**: No explicit limits, but implement caching to avoid repeated calls

## UI Architecture Patterns
- **Single-file component approach**: All screens in one `App.js` with conditional rendering
- **Status display system**: Three-tier safety rating with specific icons/colors (✅🟡❌)
- **Search result separation**: Different handlers for food products vs dishes to prevent data mixing

## Critical Gotchas
- **Camera permissions**: Must handle null/false states gracefully before showing camera
- **Ingredient analysis**: Case-insensitive matching but preserve original case in results
- **Search validation**: Always filter results by expected type to prevent React Native crashes
- **State cleanup**: Clear search inputs/results when switching between search types
