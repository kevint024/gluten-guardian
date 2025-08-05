import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

// Import Quagga for barcode scanning on web
let Quagga;
if (Platform.OS === 'web') {
  try {
    Quagga = require('quagga');
  } catch (e) {
    console.log('Quagga not available for barcode scanning');
  }
}

// Web-compatible storage
const webStorage = {
  getItem: async (key) => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const item = localStorage.getItem(key);
      return item;
    }
    return null;
  },
  setItem: async (key, value) => {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(key, value);
    }
  }
};

// Use localStorage on web, AsyncStorage on mobile
let AsyncStorage;
if (Platform.OS === 'web') {
  AsyncStorage = webStorage;
} else {
  try {
    AsyncStorage = require('@react-native-async-storage/async-storage').default;
  } catch (e) {
    AsyncStorage = webStorage;
  }
}

// Web-compatible Alert
const webAlert = (title, message, buttons) => {
  if (Platform.OS === 'web') {
    if (buttons && buttons.length > 1) {
      const result = confirm(`${title}\n\n${message}`);
      if (result && buttons[1].onPress) {
        buttons[1].onPress();
      } else if (!result && buttons[0].onPress) {
        buttons[0].onPress();
      }
    } else {
      alert(`${title}\n\n${message}`);
      if (buttons && buttons[0] && buttons[0].onPress) {
        buttons[0].onPress();
      }
    }
  } else {
    Alert.alert(title, message, buttons);
  }
};

// Complete ingredient databases from original App.js
const GLUTEN_INGREDIENTS = [
  'wheat', 'triticum', 'wheat flour', 'whole wheat', 'whole wheat flour', 'wheat grain',
  'wheat bran', 'wheat germ', 'wheat starch', 'wheat protein', 'wheat gluten',
  'vital wheat gluten', 'wheat berries', 'wheat grass', 'wheatgrass', 'wheat meal',
  'cracked wheat', 'durum wheat', 'durum', 'durum flour', 'semolina', 'semolina flour',
  'farina', 'cream of wheat', 'wheat middlings', 'wheat shorts', 'red wheat', 'white wheat',
  'flour', 'white flour', 'plain flour', 'all-purpose flour', 'bread flour', 'cake flour',
  'pastry flour', 'self-rising flour', 'self-raising flour', 'enriched flour', 'bleached flour',
  'unbleached flour', 'graham flour', 'whole grain flour', 'stone ground flour',
  'organic flour', 'bromated flour', 'patent flour', 'high gluten flour',
  'barley', 'hordeum', 'barley flour', 'barley malt', 'barley extract', 'barley grass',
  'pearl barley', 'hulled barley', 'pot barley', 'scotch barley', 'barley flakes',
  'barley meal', 'malted barley', 'barley syrup', 'barley malt syrup',
  'rye', 'secale', 'rye flour', 'rye bread', 'rye meal', 'rye flakes', 'rye berries',
  'pumpernickel', 'dark rye', 'light rye', 'medium rye', 'whole rye',
  'malt', 'malted', 'malt extract', 'malt flavoring', 'malt syrup', 'malt vinegar',
  'malted milk', 'malted barley flour', 'diastatic malt', 'non-diastatic malt',
  'malted wheat', 'malted grain', 'malt powder', 'liquid malt extract',
  'dry malt extract', 'barley malt extract', 'wheat malt extract',
  'spelt', 'triticum spelta', 'dinkel', 'farro', 'triticum dicoccum', 'emmer',
  'einkorn', 'triticum monococcum', 'kamut', 'triticum turgidum', 'khorasan wheat',
  'triticale', 'triticosecale', 'bulgur', 'bulgar', 'burghul', 'cracked wheat', 
  'couscous', 'seitan', 'wheat meat', 'fu', 'gluten flour', 'textured wheat protein',
  'hydrolyzed wheat protein', 'wheat protein isolate', 'wheat amino acids', 'wheat peptides',
  'brewer\'s yeast', 'brewers yeast', 'nutritional yeast', 'yeast extract',
  'autolyzed yeast', 'torula yeast', 'beer', 'ale', 'lager', 'stout', 'porter',
  'whiskey', 'whisky', 'bourbon', 'scotch', 'rye whiskey', 'wheat beer',
  'wheat starch', 'modified wheat starch', 'food starch', 'modified food starch',
  'starch', 'cereal starch', 'vegetable starch', 'edible starch',
  'gluten', 'wheat gluten', 'vital gluten', 'seitan', 'wheat protein',
  'hydrolyzed vegetable protein', 'hydrolyzed plant protein', 'textured vegetable protein',
  'vegetable protein', 'plant protein', 'protein isolate',
  'oats', 'oat', 'oat flour', 'oat bran', 'oat meal', 'oatmeal', 'rolled oats',
  'steel cut oats', 'quick oats', 'instant oats', 'oat fiber', 'oat protein',
  'bread', 'breadcrumbs', 'bread crumbs', 'panko', 'croutons', 'stuffing',
  'dressing', 'matzo', 'matzah', 'matza', 'communion wafer', 'wafer',
  'graham', 'graham crackers', 'digestive biscuits',
  'pasta', 'noodles', 'spaghetti', 'macaroni', 'linguine', 'fettuccine',
  'penne', 'rigatoni', 'fusilli', 'orzo', 'ramen', 'udon', 'soba',
  'egg noodles', 'wheat noodles', 'semolina pasta'
];

const AMBIGUOUS_INGREDIENTS = [
  'natural flavoring', 'natural flavor', 'artificial flavoring', 'artificial flavor',
  'natural and artificial flavoring', 'flavor', 'flavoring', 'vanilla extract',
  'almond extract', 'lemon extract', 'rum extract', 'brandy extract',
  'modified starch', 'modified food starch', 'food starch', 'starch',
  'vegetable starch', 'plant starch', 'cereal starch', 'edible starch',
  'dextrin', 'maltodextrin', 'wheat dextrin', 'corn dextrin', 'potato dextrin',
  'soy sauce', 'tamari', 'shoyu', 'teriyaki sauce', 'worcestershire sauce',
  'hoisin sauce', 'oyster sauce', 'fish sauce', 'black bean sauce',
  'bouillon', 'broth', 'stock', 'soup base', 'chicken broth', 'beef broth',
  'vegetable broth', 'bone broth', 'consomme', 'demi-glace',
  'seasoning', 'spice blend', 'spice mix', 'herb blend', 'curry powder',
  'hydrolyzed vegetable protein', 'hydrolyzed plant protein', 'vegetable protein',
  'mono and diglycerides', 'monoglycerides', 'diglycerides', 'lecithin',
  'caramel color', 'caramel coloring', 'caramel', 'natural color',
  'glucose syrup', 'corn syrup', 'high fructose corn syrup', 'rice syrup',
  'malt vinegar', 'spirit vinegar', 'distilled vinegar', 'grain vinegar',
  'beer', 'ale', 'lager', 'stout', 'porter', 'wheat beer',
  'sausage', 'hot dog', 'frankfurter', 'processed meat', 'lunch meat',
  'processed cheese', 'cheese spread', 'cheese sauce',
  'baking powder', 'vanilla powder', 'cocoa powder', 'chocolate',
  'vitamin', 'supplement', 'protein powder', 'meal replacement'
];

const DISH_DATABASE = {
  'pasta': { ingredients: 'wheat flour, durum wheat semolina, eggs', status: 'unsafe', description: 'Traditional pasta is made with wheat flour' },
  'pizza': { ingredients: 'wheat flour, yeast, cheese, tomato sauce', status: 'unsafe', description: 'Pizza dough contains wheat flour' },
  'risotto': { ingredients: 'arborio rice, broth, cheese, wine', status: 'caution', description: 'Rice-based but broth may contain gluten' },
  'ramen': { ingredients: 'wheat noodles, broth, soy sauce, miso', status: 'unsafe', description: 'Noodles contain wheat, soy sauce often contains wheat' },
  'pad thai': { ingredients: 'rice noodles, tamarind, fish sauce, peanuts', status: 'caution', description: 'Rice noodles are safe but sauces may contain gluten' },
  'tacos': { ingredients: 'corn tortillas, meat, vegetables, cheese', status: 'safe', description: 'Corn tortillas are naturally gluten-free' },
  'burritos': { ingredients: 'wheat flour tortillas, beans, rice, meat', status: 'unsafe', description: 'Flour tortillas contain wheat' },
  'naan': { ingredients: 'wheat flour, yogurt, yeast', status: 'unsafe', description: 'Bread made with wheat flour' },
  'curry': { ingredients: 'spices, vegetables, meat, coconut milk', status: 'caution', description: 'Usually safe but some thickeners may contain gluten' },
  'burger': { ingredients: 'wheat flour bun, meat, vegetables', status: 'unsafe', description: 'Bun contains wheat flour' },
  'fried chicken': { ingredients: 'chicken, wheat flour, spices', status: 'unsafe', description: 'Breading contains wheat flour' },
  'pancakes': { ingredients: 'wheat flour, eggs, milk, baking powder', status: 'unsafe', description: 'Made with wheat flour' },
  'caesar salad': { ingredients: 'lettuce, parmesan, dressing', status: 'caution', description: 'Salad is safe but croutons contain wheat' },
  'greek salad': { ingredients: 'lettuce, tomatoes, olives, feta cheese', status: 'safe', description: 'Naturally gluten-free ingredients' },
  'sushi': { ingredients: 'rice, fish, nori, wasabi, soy sauce', status: 'caution', description: 'Rice and fish are safe but soy sauce contains wheat' },
  'fried rice': { ingredients: 'rice, soy sauce, eggs, vegetables', status: 'caution', description: 'Rice is safe but soy sauce often contains wheat' },
  'nachos': { ingredients: 'corn chips, cheese, jalapeños', status: 'safe', description: 'Corn chips are naturally gluten-free' },
  'tamales': { ingredients: 'corn masa, meat, vegetables', status: 'safe', description: 'Made with corn masa, naturally gluten-free' },
  'biryani': { ingredients: 'basmati rice, spices, meat, yogurt', status: 'safe', description: 'Rice-based dish, naturally gluten-free' },
  'sandwich': { ingredients: 'wheat bread, filling', status: 'unsafe', description: 'Bread contains wheat flour' },
  'fish and chips': { ingredients: 'fish, wheat flour batter, potatoes', status: 'unsafe', description: 'Batter contains wheat flour' },
  'waffles': { ingredients: 'wheat flour, eggs, milk, sugar', status: 'unsafe', description: 'Made with wheat flour' },
  'french toast': { ingredients: 'wheat bread, eggs, milk', status: 'unsafe', description: 'Made with wheat bread' },
  'cobb salad': { ingredients: 'lettuce, chicken, bacon, eggs, cheese', status: 'safe', description: 'Naturally gluten-free ingredients' }
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [manualIngredients, setManualIngredients] = useState('');
  const [barcodeInput, setBarcodeInput] = useState('');
  const [foodSearchInput, setFoodSearchInput] = useState('');
  const [dishSearchInput, setDishSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [cache, setCache] = useState({});
  
  // Camera scanning states
  const [isScanning, setIsScanning] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [scannedBarcode, setScannedBarcode] = useState('');
  const [lastErrorTime, setLastErrorTime] = useState(0); // Prevent error spam
  const scannerRef = useRef(null);

  useEffect(() => {
    loadFavorites();
    loadCache();
    
    // Auto-start camera when on camera screen
    if (currentScreen === 'camera' && !isScanning && !cameraError) {
      startScanner();
    }
    
    // Cleanup scanner when component unmounts or leaving camera screen
    return () => {
      if (currentScreen !== 'camera') {
        stopScanner();
      }
    };
  }, [currentScreen]);

  useEffect(() => {
    // Cleanup on component unmount
    return () => {
      stopScanner();
    };
  }, []);

  const startScanner = async () => {
    if (!Quagga || Platform.OS !== 'web') {
      setCameraError('Camera scanning not available on this platform');
      return;
    }

    try {
      setIsScanning(true);
      setCameraError(null);
      setScannedBarcode('');

      // Initialize Quagga scanner
      Quagga.init({
        inputStream: {
          name: 'Live',
          type: 'LiveStream',
          target: scannerRef.current,
          constraints: {
            width: { ideal: 640, min: 320 },
            height: { ideal: 480, min: 240 },
            facingMode: 'environment' // Use back camera if available
          }
        },
        decoder: {
          readers: [
            'code_128_reader',
            'ean_reader',
            'ean_8_reader',
            'code_39_reader',
            'upc_reader',
            'upc_e_reader'
          ]
        },
        locate: true,
        locator: {
          halfSample: true,
          patchSize: 'medium'
        },
        numOfWorkers: 1,
        frequency: 10
      }, (err) => {
        if (err) {
          console.error('Quagga initialization error:', err);
          setCameraError('Failed to initialize camera scanner. Please try manual barcode entry.');
          setIsScanning(false);
          return;
        }
        
        // Start scanning
        Quagga.start();
        
        // Listen for barcode detection
        Quagga.onDetected((result) => {
          const code = result.codeResult.code;
          if (code && code.length >= 8 && code.length <= 18) { // Valid barcode length
            setScannedBarcode(code);
            
            // Auto-analyze the scanned barcode
            fetchProductData(code);
            switchToScreen('result');
            
            // Stop scanner after successful scan
            setTimeout(() => {
              stopScanner();
            }, 100);
          }
        });
      });

    } catch (error) {
      console.error('Camera access error:', error);
      setCameraError('Camera access denied or not available. Please allow camera access or use manual barcode entry.');
      setIsScanning(false);
    }
  };

  const stopScanner = () => {
    if (Quagga && isScanning) {
      Quagga.stop();
      Quagga.offDetected();
    }
    setIsScanning(false);
  };

  const switchToScreen = (screenName) => {
    // Stop scanner when leaving camera screen
    if (currentScreen === 'camera' && screenName !== 'camera') {
      stopScanner();
    }
    
    setSearchResults([]);
    setLoading(false);
    
    if (currentScreen === 'searchFood' && screenName !== 'searchFood') {
      setFoodSearchInput('');
    }
    if (currentScreen === 'searchDish' && screenName !== 'searchDish') {
      setDishSearchInput('');
    }
    if (currentScreen === 'manualBarcode' && screenName !== 'manualBarcode') {
      setBarcodeInput('');
    }
    if (currentScreen === 'manual' && screenName !== 'manual') {
      setManualIngredients('');
    }
    
    setCurrentScreen(screenName);
  };

  const validateAndSetSearchResults = (results, resultType) => {
    if (!Array.isArray(results)) {
      setSearchResults([]);
      return;
    }

    const validResults = results.filter(result => {
      if (!result || typeof result !== 'object') return false;
      
      if (resultType === 'food') {
        return result.product_name && 
               typeof result.product_name === 'string' &&
               result.ingredients_text &&
               typeof result.ingredients_text === 'string';
      } else if (resultType === 'dish') {
        return result.name && 
               typeof result.name === 'string' &&
               result.ingredients &&
               typeof result.ingredients === 'string' &&
               result.status;
      }
      
      return false;
    });

    setSearchResults(validResults);
  };

  const loadFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem('favorites');
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const loadCache = async () => {
    try {
      const storedCache = await AsyncStorage.getItem('productCache');
      if (storedCache) {
        setCache(JSON.parse(storedCache));
      }
    } catch (error) {
      console.error('Error loading cache:', error);
    }
  };

  const saveFavorites = async (newFavorites) => {
    try {
      await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
      setFavorites(newFavorites);
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  };

  const saveCache = async (newCache) => {
    try {
      await AsyncStorage.setItem('productCache', JSON.stringify(newCache));
      setCache(newCache);
    } catch (error) {
      console.error('Error saving cache:', error);
    }
  };

  const handleBarcodeAnalysis = () => {
    if (!barcodeInput.trim()) {
      webAlert('Error', 'Please enter a barcode to analyze.');
      return;
    }
    
    fetchProductData(barcodeInput.trim());
    switchToScreen('result');
  };

  const analyzeIngredients = (ingredients) => {
    if (!ingredients || typeof ingredients !== 'string' || ingredients.trim().length === 0) {
      return {
        status: 'error',
        message: 'No ingredients information available',
        flaggedIngredients: [],
        ambiguousIngredients: []
      };
    }

    const lowerIngredients = ingredients.toLowerCase();
    const flaggedGluten = [];
    const flaggedAmbiguous = [];

    GLUTEN_INGREDIENTS.forEach(ingredient => {
      if (lowerIngredients.includes(ingredient.toLowerCase())) {
        flaggedGluten.push(ingredient);
      }
    });

    AMBIGUOUS_INGREDIENTS.forEach(ingredient => {
      if (lowerIngredients.includes(ingredient.toLowerCase())) {
        flaggedAmbiguous.push(ingredient);
      }
    });

    if (flaggedGluten.length > 0) {
      return {
        status: 'unsafe',
        message: 'Contains known gluten ingredients',
        flaggedIngredients: flaggedGluten,
        ambiguousIngredients: flaggedAmbiguous
      };
    } else if (flaggedAmbiguous.length > 0) {
      return {
        status: 'caution',
        message: 'May contain hidden gluten sources',
        flaggedIngredients: [],
        ambiguousIngredients: flaggedAmbiguous
      };
    } else {
      return {
        status: 'safe',
        message: 'No gluten ingredients found',
        flaggedIngredients: [],
        ambiguousIngredients: []
      };
    }
  };

  const fetchProductData = async (barcode) => {
    setLoading(true);
    
    if (cache[barcode]) {
      setProductData(cache[barcode]);
      const result = analyzeIngredients(cache[barcode].ingredients_text);
      setAnalysisResult(result);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
      const data = await response.json();
      
      if (data.status === 1 && data.product) {
        const product = {
          product_name: data.product.product_name || 'Unknown Product',
          ingredients_text: data.product.ingredients_text || '',
          brands: data.product.brands || '',
          barcode: barcode
        };
        
        setProductData(product);
        
        const newCache = { ...cache, [barcode]: product };
        saveCache(newCache);
        
        const result = analyzeIngredients(product.ingredients_text);
        setAnalysisResult(result);
      } else {
        // Prevent spam by checking time since last error
        const now = Date.now();
        if (now - lastErrorTime > 3000) { // 3 second cooldown
          setLastErrorTime(now);
          webAlert('Product Not Found', 'This product is not in the Open Food Facts database. Try entering the barcode manually.');
        }
        setProductData(null);
        setAnalysisResult(null);
      }
    } catch (error) {
      console.error('Error fetching product data:', error);
      const now = Date.now();
      if (now - lastErrorTime > 3000) { // 3 second cooldown
        setLastErrorTime(now);
        webAlert('Error', 'Failed to fetch product information. Please check your internet connection.');
      }
      setProductData(null);
      setAnalysisResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleManualAnalysis = () => {
    if (!manualIngredients.trim()) {
      webAlert('Error', 'Please enter ingredients to analyze.');
      return;
    }
    
    const result = analyzeIngredients(manualIngredients);
    setAnalysisResult(result);
    setProductData({ 
      product_name: 'Manual Analysis', 
      ingredients_text: manualIngredients,
      brands: '',
      barcode: null
    });
    switchToScreen('result');
  };

  const searchFoodProducts = async (searchTerm) => {
    if (!searchTerm || searchTerm.trim().length < 2) {
      webAlert('Error', 'Please enter at least 2 characters to search.');
      return;
    }

    setLoading(true);
    setSearchResults([]);

    try {
      const response = await fetch(`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(searchTerm)}&json=true&page_size=10&fields=code,product_name,brands,ingredients_text`);
      const data = await response.json();
      
      if (data.products && data.products.length > 0) {
        const productsWithIngredients = data.products.filter(product => 
          product.ingredients_text && product.ingredients_text.trim().length > 0
        );
        validateAndSetSearchResults(productsWithIngredients.slice(0, 8), 'food');
      } else {
        validateAndSetSearchResults([], 'food');
        webAlert('No Results', 'No products found with that name. Try a different search term.');
      }
    } catch (error) {
      console.error('Error searching products:', error);
      webAlert('Error', 'Failed to search for products. Please check your internet connection.');
      validateAndSetSearchResults([], 'food');
    } finally {
      setLoading(false);
    }
  };

  const searchDishes = async (searchTerm) => {
    if (!searchTerm || searchTerm.trim().length < 2) {
      webAlert('Error', 'Please enter at least 2 characters to search.');
      return;
    }

    setLoading(true);
    setSearchResults([]);

    try {
      let searchResults = [];

      // 1. Search local database first
      const localResults = Object.keys(DISH_DATABASE)
        .filter(dish => dish.toLowerCase().includes(searchTerm.toLowerCase()))
        .map(dish => ({
          name: dish,
          ingredients: DISH_DATABASE[dish].ingredients,
          status: DISH_DATABASE[dish].status,
          description: DISH_DATABASE[dish].description,
          source: 'Local Database'
        }));

      searchResults = [...localResults];

      // 2. Try MealDB API (Free, no key required)
      if (searchResults.length < 4) {
        try {
          console.log('🔍 Searching MealDB for:', searchTerm);
          const mealDBResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(searchTerm)}`);
          const mealDBData = await mealDBResponse.json();
          
          if (mealDBData.meals && mealDBData.meals.length > 0) {
            console.log(`✅ MealDB found ${mealDBData.meals.length} recipes`);
            
            const mealDBResults = mealDBData.meals.slice(0, 4).map(meal => {
              const ingredients = [];
              for (let i = 1; i <= 20; i++) {
                const ingredient = meal[`strIngredient${i}`];
                if (ingredient && ingredient.trim()) {
                  ingredients.push(ingredient.trim().toLowerCase());
                }
              }
              
              const ingredientsText = ingredients.join(', ');
              const analysis = analyzeIngredients(ingredientsText);
              
              return {
                name: meal.strMeal,
                ingredients: ingredientsText,
                status: analysis.status,
                description: `${meal.strCategory} dish from ${meal.strArea}`,
                source: 'MealDB',
                image: meal.strMealThumb
              };
            });
            
            searchResults = [...searchResults, ...mealDBResults.filter(result => 
              result.ingredients && result.ingredients.trim() && 
              !searchResults.some(existing => existing.name.toLowerCase() === result.name.toLowerCase())
            )];
          }
        } catch (mealDBError) {
          console.log('MealDB API not available:', mealDBError.message);
        }
      }

      // 3. Fallback: Add some common dishes if no results found
      if (searchResults.length === 0) {
        const fallbackDishes = [
          { name: 'No results found', ingredients: '', status: 'unknown', description: 'Try a different search term' }
        ];
        searchResults = fallbackDishes;
      }

      validateAndSetSearchResults(searchResults.slice(0, 8), 'dish');
      
    } catch (error) {
      console.error('Error searching dishes:', error);
      validateAndSetSearchResults([], 'dish');
      webAlert('Error', 'Failed to search for dishes. Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  const analyzeDishResult = (dish) => {
    const result = analyzeIngredients(dish.ingredients);
    setAnalysisResult({
      ...result,
      dishStatus: dish.status,
      dishDescription: dish.description
    });
    setProductData({
      product_name: dish.name,
      ingredients_text: dish.ingredients,
      brands: '',
      barcode: null
    });
    switchToScreen('result');
  };

  const addToFavorites = (item) => {
    const newFavorites = [...favorites, item];
    saveFavorites(newFavorites);
    webAlert('Added to Favorites', 'This item has been saved to your favorites.');
  };

  const removeFromFavorites = (item) => {
    const newFavorites = favorites.filter(fav => 
      fav.barcode !== item.barcode || fav.product_name !== item.product_name
    );
    saveFavorites(newFavorites);
    webAlert('Removed from Favorites', 'This item has been removed from your favorites.');
  };

  const renderHomeScreen = () => (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <Text style={styles.title}>🛡️ Gluten Guardian</Text>
        <Text style={styles.subtitle}>Your gluten-free companion</Text>
        <Text style={styles.note}>🌐 Web Version - Camera scanning with fallback to manual entry</Text>
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={() => switchToScreen('camera')}
        >
          <Text style={styles.buttonText}>📷 Scan Barcode</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => switchToScreen('manualBarcode')}
        >
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>🔢 Enter Barcode</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => switchToScreen('searchFood')}
        >
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>🔍 Search Food Products</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => switchToScreen('searchDish')}
        >
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>�️ Search Dishes</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => switchToScreen('manual')}
        >
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>✏️ Manual Check</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, styles.tertiaryButton]}
          onPress={() => switchToScreen('favorites')}
        >
          <Text style={[styles.buttonText, styles.tertiaryButtonText]}>⭐ Favorites ({favorites.length})</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.testSection}>
        <Text style={styles.testTitle}>🧪 Quick Test Examples:</Text>
        <TouchableOpacity
          style={styles.testButton}
          onPress={() => {
            setBarcodeInput('3017620422003');
            switchToScreen('manualBarcode');
          }}
        >
          <Text style={styles.testButtonText}>🍫 Test Nutella (Contains Gluten)</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.testButton}
          onPress={() => {
            setManualIngredients('rice, water, salt');
            switchToScreen('manual');
          }}
        >
          <Text style={styles.testButtonText}>🍚 Test Rice (Gluten-Free)</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          🌾 Always double-check with manufacturers for severe allergies
        </Text>
      </View>
    </ScrollView>
  );

  const renderCameraScreen = () => (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <Text style={styles.title}>📷 Camera Scanner</Text>
        <Text style={styles.subtitle}>Point camera at barcode to scan automatically</Text>
      </View>

      <View style={styles.cameraContainer}>
        {cameraError ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>❌ {cameraError}</Text>
            
            <TouchableOpacity 
              style={[styles.button, styles.manualButton]} 
              onPress={() => switchToScreen('manualBarcode')}
            >
              <Text style={styles.buttonText}>📝 Manual Barcode Entry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.scannerContainer}>
            <div 
              ref={scannerRef} 
              style={{
                width: '100%',
                maxWidth: '640px',
                height: '480px',
                border: '2px solid #4CAF50',
                borderRadius: '8px',
                overflow: 'hidden',
                position: 'relative',
                backgroundColor: '#000'
              }}
            />
            
            {isScanning && (
              <View style={styles.scanningOverlay}>
                <Text style={styles.scanningText}>🔍 Scanning for barcodes...</Text>
                <Text style={styles.scanningSubtext}>Hold barcode steady in camera view</Text>
              </View>
            )}
            
            {scannedBarcode && (
              <View style={styles.scannedContainer}>
                <Text style={styles.scannedText}>✅ Scanned: {scannedBarcode}</Text>
              </View>
            )}
            
            <TouchableOpacity 
              style={[styles.button, styles.manualFallbackButton]} 
              onPress={() => switchToScreen('manualBarcode')}
            >
              <Text style={styles.buttonText}>📝 Manual Entry Instead</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity 
          style={[styles.button, styles.backButton]} 
          onPress={() => switchToScreen('home')}
        >
          <Text style={styles.buttonText}>← Back to Menu</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderManualBarcodeScreen = () => (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <Text style={styles.title}>🔍 Barcode Lookup</Text>
        <Text style={styles.subtitle}>Enter a product barcode to analyze</Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Product Barcode:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter barcode number (e.g., 1234567890123)"
          value={barcodeInput}
          onChangeText={setBarcodeInput}
          keyboardType="numeric"
        />
        
        <TouchableOpacity 
          style={[styles.button, styles.analyzeButton]} 
          onPress={handleBarcodeAnalysis}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Analyze Product</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.backButton]} 
          onPress={() => switchToScreen('home')}
        >
          <Text style={styles.buttonText}>← Back to Menu</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderManualScreen = () => (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <Text style={styles.title}>📝 Manual Analysis</Text>
        <Text style={styles.subtitle}>Enter ingredients to check for gluten</Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Ingredients List:</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          placeholder="Enter ingredients separated by commas..."
          value={manualIngredients}
          onChangeText={setManualIngredients}
          multiline
          numberOfLines={6}
        />
        
        <TouchableOpacity 
          style={[styles.button, styles.analyzeButton]} 
          onPress={handleManualAnalysis}
        >
          <Text style={styles.buttonText}>Analyze Ingredients</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.backButton]} 
          onPress={() => switchToScreen('home')}
        >
          <Text style={styles.buttonText}>← Back to Menu</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderSearchFoodScreen = () => (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <Text style={styles.title}>🍔 Search Products</Text>
        <Text style={styles.subtitle}>Find food products by name</Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Product Name:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter product name (e.g., 'cereal', 'bread')"
          value={foodSearchInput}
          onChangeText={setFoodSearchInput}
        />
        
        <TouchableOpacity 
          style={[styles.button, styles.searchButtonColor]} 
          onPress={() => searchFoodProducts(foodSearchInput)}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Search Products</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.backButton]} 
          onPress={() => switchToScreen('home')}
        >
          <Text style={styles.buttonText}>← Back to Menu</Text>
        </TouchableOpacity>
      </View>

      {searchResults.length > 0 && (
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsTitle}>Search Results:</Text>
          {searchResults.map((product, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.resultItem}
              onPress={() => {
                setProductData(product);
                const result = analyzeIngredients(product.ingredients_text);
                setAnalysisResult(result);
                switchToScreen('result');
              }}
            >
              <Text style={styles.resultName}>{product.product_name}</Text>
              {product.brands && <Text style={styles.resultBrand}>{product.brands}</Text>}
              <Text style={styles.resultIngredients} numberOfLines={2}>
                {product.ingredients_text}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScrollView>
  );

  const renderSearchDishScreen = () => (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <Text style={styles.title}>🍝 Search Dishes</Text>
        <Text style={styles.subtitle}>Find common dishes and recipes</Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Dish Name:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter dish name (e.g., 'pasta', 'pizza')"
          value={dishSearchInput}
          onChangeText={setDishSearchInput}
        />
        
        <TouchableOpacity 
          style={[styles.button, styles.searchButtonColor]} 
          onPress={() => searchDishes(dishSearchInput)}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Search Dishes</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.backButton]} 
          onPress={() => switchToScreen('home')}
        >
          <Text style={styles.buttonText}>← Back to Menu</Text>
        </TouchableOpacity>
      </View>

      {searchResults.length > 0 && (
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsTitle}>Search Results:</Text>
          {searchResults.map((dish, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.resultItem}
              onPress={() => analyzeDishResult(dish)}
            >
              <View style={styles.dishHeader}>
                <Text style={styles.resultName}>{dish.name}</Text>
                <Text style={[styles.statusBadge, 
                  dish.status === 'safe' ? styles.safeBadge :
                  dish.status === 'caution' ? styles.cautionBadge : styles.unsafeBadge
                ]}>
                  {dish.status === 'safe' ? '✅ Safe' :
                   dish.status === 'caution' ? '⚠️ Caution' : '❌ Unsafe'}
                </Text>
              </View>
              <Text style={styles.resultDescription}>{dish.description}</Text>
              <Text style={styles.resultIngredients} numberOfLines={2}>
                Ingredients: {dish.ingredients}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScrollView>
  );

  const renderResultScreen = () => {
    if (!analysisResult || !productData) {
      return (
        <View style={styles.container}>
          <Text style={styles.errorText}>No analysis data available</Text>
          <TouchableOpacity 
            style={[styles.button, styles.backButton]} 
            onPress={() => switchToScreen('home')}
          >
            <Text style={styles.buttonText}>← Back to Menu</Text>
          </TouchableOpacity>
        </View>
      );
    }

    const getStatusColor = () => {
      switch (analysisResult.status) {
        case 'safe': return '#4CAF50';
        case 'caution': return '#FF9800';
        case 'unsafe': return '#F44336';
        default: return '#666';
      }
    };

    const getStatusIcon = () => {
      switch (analysisResult.status) {
        case 'safe': return '✅';
        case 'caution': return '⚠️';
        case 'unsafe': return '❌';
        default: return '❓';
      }
    };

    const isFavorite = favorites.some(fav => 
      fav.barcode === productData.barcode && fav.product_name === productData.product_name
    );

    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Analysis Result</Text>
        </View>

        <View style={styles.resultContainer}>
          <Text style={styles.productName}>{productData.product_name}</Text>
          {productData.brands && (
            <Text style={styles.productBrand}>{productData.brands}</Text>
          )}

          <View style={[styles.statusContainer, { backgroundColor: getStatusColor() }]}>
            <Text style={styles.statusText}>
              {getStatusIcon()} {analysisResult.status.toUpperCase()}
            </Text>
            <Text style={styles.statusMessage}>{analysisResult.message}</Text>
          </View>

          {analysisResult.dishDescription && (
            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionText}>{analysisResult.dishDescription}</Text>
            </View>
          )}

          {analysisResult.flaggedIngredients && analysisResult.flaggedIngredients.length > 0 && (
            <View style={styles.flaggedContainer}>
              <Text style={styles.flaggedTitle}>⚠️ Gluten-containing ingredients found:</Text>
              {analysisResult.flaggedIngredients.map((ingredient, index) => (
                <Text key={index} style={styles.flaggedItem}>• {ingredient}</Text>
              ))}
            </View>
          )}

          {analysisResult.ambiguousIngredients && analysisResult.ambiguousIngredients.length > 0 && (
            <View style={styles.ambiguousContainer}>
              <Text style={styles.ambiguousTitle}>❓ Ingredients that may contain gluten:</Text>
              {analysisResult.ambiguousIngredients.map((ingredient, index) => (
                <Text key={index} style={styles.ambiguousItem}>• {ingredient}</Text>
              ))}
            </View>
          )}

          <View style={styles.ingredientsContainer}>
            <Text style={styles.ingredientsTitle}>Full Ingredients List:</Text>
            <Text style={styles.ingredientsText}>{productData.ingredients_text}</Text>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={[styles.button, styles.favoriteButton]} 
              onPress={() => isFavorite ? removeFromFavorites(productData) : addToFavorites(productData)}
            >
              <Text style={styles.buttonText}>
                {isFavorite ? '💔 Remove Favorite' : '💖 Add to Favorites'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.button, styles.backButton]} 
              onPress={() => switchToScreen('home')}
            >
              <Text style={styles.buttonText}>← Back to Menu</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  };

  const renderFavoritesScreen = () => (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <Text style={styles.title}>⭐ Your Favorites</Text>
        <Text style={styles.subtitle}>Saved items ({favorites.length})</Text>
      </View>

      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No favorites saved yet</Text>
          <Text style={styles.emptySubtext}>Save items from your analysis results</Text>
        </View>
      ) : (
        <View style={styles.favoritesContainer}>
          {favorites.map((item, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.favoriteItem}
              onPress={() => {
                setProductData(item);
                const result = analyzeIngredients(item.ingredients_text);
                setAnalysisResult(result);
                switchToScreen('result');
              }}
            >
              <View style={styles.favoriteItemContent}>
                <Text style={styles.favoriteItemName}>{item.product_name}</Text>
                {item.brands && <Text style={styles.favoriteItemBrand}>{item.brands}</Text>}
              </View>
              <TouchableOpacity 
                style={styles.removeButton}
                onPress={() => removeFromFavorites(item)}
              >
                <Text style={styles.removeButtonText}>Remove</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <TouchableOpacity 
        style={[styles.button, styles.backButton]} 
        onPress={() => switchToScreen('home')}
      >
        <Text style={styles.buttonText}>← Back to Menu</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  // Main render logic
  switch (currentScreen) {
    case 'camera':
      return renderCameraScreen();
    case 'manualBarcode':
      return renderManualBarcodeScreen();
    case 'manual':
      return renderManualScreen();
    case 'searchFood':
      return renderSearchFoodScreen();
    case 'searchDish':
      return renderSearchDishScreen();
    case 'result':
      return renderResultScreen();
    case 'favorites':
      return renderFavoritesScreen();
    default:
      return renderHomeScreen();
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    ...(Platform.OS === 'web' && {
      minHeight: '100vh',
      maxWidth: 800,
      margin: '0 auto',
    }),
  },
  
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },

  header: {
    alignItems: 'center',
    marginBottom: 30,
    paddingTop: Platform.OS === 'web' ? 20 : 40,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2e7d3e',
    marginBottom: 8,
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
    marginBottom: 8,
  },

  webBadge: {
    fontSize: 12,
    color: '#4CAF50',
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontWeight: '600',
  },

  menuContainer: {
    gap: 15,
  },

  menuButton: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    ...(Platform.OS === 'web' && {
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    }),
  },

  menuButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },

  menuButtonSubtext: {
    fontSize: 14,
    color: '#666',
  },

  barcodeButton: {
    borderColor: '#4CAF50',
  },

  manualButton: {
    borderColor: '#2196F3',
  },

  searchButton: {
    borderColor: '#FF9800',
  },

  dishButton: {
    borderColor: '#9C27B0',
  },

  favoritesButton: {
    borderColor: '#E91E63',
  },

  inputContainer: {
    marginBottom: 20,
  },

  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },

  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginVertical: 10,
    ...(Platform.OS === 'web' && {
      outline: 'none',
    }),
  },

  multilineInput: {
    height: 120,
    textAlignVertical: 'top',
  },

  button: {
    backgroundColor: '#2e7d3e',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 5,
    ...(Platform.OS === 'web' && {
      cursor: 'pointer',
    }),
  },

  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },

  analyzeButton: {
    backgroundColor: '#4CAF50',
  },

  searchButtonColor: {
    backgroundColor: '#FF9800',
  },

  backButton: {
    backgroundColor: '#666',
  },

  favoriteButton: {
    backgroundColor: '#E91E63',
    flex: 1,
    marginRight: 10,
  },

  resultsContainer: {
    marginTop: 20,
  },

  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },

  resultItem: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    ...(Platform.OS === 'web' && {
      cursor: 'pointer',
    }),
  },

  resultName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },

  resultBrand: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },

  resultIngredients: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },

  resultDescription: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },

  dishHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  statusBadge: {
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },

  safeBadge: {
    backgroundColor: '#E8F5E8',
    color: '#2e7d3e',
  },

  cautionBadge: {
    backgroundColor: '#FFF3E0',
    color: '#F57C00',
  },

  unsafeBadge: {
    backgroundColor: '#FFEBEE',
    color: '#D32F2F',
  },

  resultContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  productName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },

  productBrand: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },

  statusContainer: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },

  statusText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 4,
  },

  statusMessage: {
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
  },

  descriptionContainer: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },

  descriptionText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },

  flaggedContainer: {
    backgroundColor: '#FFEBEE',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },

  flaggedTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#D32F2F',
    marginBottom: 8,
  },

  flaggedItem: {
    fontSize: 14,
    color: '#D32F2F',
    marginBottom: 2,
  },

  ambiguousContainer: {
    backgroundColor: '#FFF3E0',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },

  ambiguousTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F57C00',
    marginBottom: 8,
  },

  ambiguousItem: {
    fontSize: 14,
    color: '#F57C00',
    marginBottom: 2,
  },

  ingredientsContainer: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },

  ingredientsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },

  ingredientsText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },

  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  emptyContainer: {
    alignItems: 'center',
    padding: 40,
  },

  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 8,
  },

  emptySubtext: {
    fontSize: 14,
    color: '#999',
  },

  favoritesContainer: {
    marginBottom: 20,
  },

  favoriteItem: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...(Platform.OS === 'web' && {
      cursor: 'pointer',
    }),
  },

  favoriteItemContent: {
    flex: 1,
  },

  favoriteItemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },

  favoriteItemBrand: {
    fontSize: 14,
    color: '#666',
  },

  removeButton: {
    backgroundColor: '#F44336',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },

  removeButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },

  // Home screen styles to match original
  note: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 5,
  },

  buttonContainer: {
    paddingHorizontal: 20,
    gap: 15,
  },

  primaryButton: {
    backgroundColor: '#2196F3',
  },

  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#2196F3',
  },

  tertiaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#FF9800',
  },

  secondaryButtonText: {
    color: '#2196F3',
  },

  tertiaryButtonText: {
    color: '#FF9800',
  },

  testSection: {
    paddingHorizontal: 20,
    marginTop: 30,
    marginBottom: 20,
  },

  testTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },

  testButton: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },

  testButtonText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },

  footer: {
    marginTop: 40,
    alignItems: 'center',
  },

  footerText: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
  },

  errorText: {
    fontSize: 16,
    color: '#F44336',
    textAlign: 'center',
    margin: 20,
  },

  // Camera Scanner Styles
  cameraContainer: {
    alignItems: 'center',
    padding: 20,
  },

  scannerContainer: {
    width: '100%',
    maxWidth: 640,
    marginBottom: 20,
    alignItems: 'center',
  },

  scanningOverlay: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    backgroundColor: 'rgba(76, 175, 80, 0.9)',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },

  scanningText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },

  scanningSubtext: {
    color: 'white',
    fontSize: 12,
    marginTop: 4,
  },

  scannedContainer: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    backgroundColor: 'rgba(76, 175, 80, 0.95)',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },

  scannedText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },

  cameraControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
    flexWrap: 'wrap',
  },

  startScanButton: {
    backgroundColor: '#4CAF50',
    marginHorizontal: 5,
    marginVertical: 5,
  },

  stopScanButton: {
    backgroundColor: '#F44336',
    marginHorizontal: 5,
    marginVertical: 5,
  },

  manualFallbackButton: {
    backgroundColor: '#FF9800',
    marginHorizontal: 5,
    marginVertical: 5,
  },

  errorContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    borderRadius: 8,
    marginBottom: 20,
  },

  errorSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginVertical: 10,
  },

  manualButton: {
    backgroundColor: '#FF9800',
    marginTop: 15,
  },
});
