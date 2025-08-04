import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  TextInput,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CameraView, Camera } from 'expo-camera';

// Comprehensive list of gluten-containing ingredients with variations
const GLUTEN_INGREDIENTS = [
  // Wheat and wheat derivatives
  'wheat', 'triticum', 'wheat flour', 'whole wheat', 'whole wheat flour', 'wheat grain',
  'wheat bran', 'wheat germ', 'wheat starch', 'wheat protein', 'wheat gluten',
  'vital wheat gluten', 'wheat berries', 'wheat grass', 'wheatgrass', 'wheat meal',
  'cracked wheat', 'durum wheat', 'durum', 'durum flour', 'semolina', 'semolina flour',
  'farina', 'cream of wheat', 'wheat middlings', 'wheat shorts', 'red wheat', 'white wheat',
  
  // Flour types (wheat-based)
  'flour', 'white flour', 'plain flour', 'all-purpose flour', 'bread flour', 'cake flour',
  'pastry flour', 'self-rising flour', 'self-raising flour', 'enriched flour', 'bleached flour',
  'unbleached flour', 'graham flour', 'whole grain flour', 'stone ground flour',
  'organic flour', 'bromated flour', 'patent flour', 'high gluten flour',
  
  // Barley and barley derivatives
  'barley', 'hordeum', 'barley flour', 'barley malt', 'barley extract', 'barley grass',
  'pearl barley', 'hulled barley', 'pot barley', 'scotch barley', 'barley flakes',
  'barley meal', 'malted barley', 'barley syrup', 'barley malt syrup',
  
  // Rye and rye derivatives
  'rye', 'secale', 'rye flour', 'rye bread', 'rye meal', 'rye flakes', 'rye berries',
  'pumpernickel', 'dark rye', 'light rye', 'medium rye', 'whole rye',
  
  // Malt and malt derivatives
  'malt', 'malted', 'malt extract', 'malt flavoring', 'malt syrup', 'malt vinegar',
  'malted milk', 'malted barley flour', 'diastatic malt', 'non-diastatic malt',
  'malted wheat', 'malted grain', 'malt powder', 'liquid malt extract',
  'dry malt extract', 'barley malt extract', 'wheat malt extract',
  
  // Ancient grains (gluten-containing)
  'spelt', 'triticum spelta', 'dinkel', 'farro', 'triticum dicoccum', 'emmer',
  'einkorn', 'triticum monococcum', 'kamut', 'triticum turgidum', 'khorasan wheat',
  'triticale', 'triticosecale',
  
  // Processed wheat products
  'bulgur', 'bulgar', 'burghul', 'cracked wheat', 'couscous', 'seitan', 'wheat meat',
  'fu', 'gluten flour', 'textured wheat protein', 'hydrolyzed wheat protein',
  'wheat protein isolate', 'wheat amino acids', 'wheat peptides',
  
  // Fermentation and brewing ingredients
  'brewer\'s yeast', 'brewers yeast', 'nutritional yeast', 'yeast extract',
  'autolyzed yeast', 'torula yeast', 'beer', 'ale', 'lager', 'stout', 'porter',
  'whiskey', 'whisky', 'bourbon', 'scotch', 'rye whiskey', 'wheat beer',
  
  // Starches and thickeners (wheat-based)
  'wheat starch', 'modified wheat starch', 'food starch', 'modified food starch',
  'starch', 'cereal starch', 'vegetable starch', 'edible starch',
  
  // Protein derivatives
  'gluten', 'wheat gluten', 'vital gluten', 'seitan', 'wheat protein',
  'hydrolyzed vegetable protein', 'hydrolyzed plant protein', 'textured vegetable protein',
  'vegetable protein', 'plant protein', 'protein isolate',
  
  // Oats (often cross-contaminated)
  'oats', 'oat', 'oat flour', 'oat bran', 'oat meal', 'oatmeal', 'rolled oats',
  'steel cut oats', 'quick oats', 'instant oats', 'oat fiber', 'oat protein',
  
  // Bread and baked goods ingredients
  'bread', 'breadcrumbs', 'bread crumbs', 'panko', 'croutons', 'stuffing',
  'dressing', 'matzo', 'matzah', 'matza', 'communion wafer', 'wafer',
  'graham', 'graham crackers', 'digestive biscuits',
  
  // Pasta and noodles
  'pasta', 'noodles', 'spaghetti', 'macaroni', 'linguine', 'fettuccine',
  'penne', 'rigatoni', 'fusilli', 'orzo', 'ramen', 'udon', 'soba',
  'egg noodles', 'wheat noodles', 'semolina pasta',
  
  // Additives and preservatives
  'maltodextrin', 'dextrin', 'cyclodextrin', 'wheat dextrin', 'maltose',
  'glucose syrup', 'wheat glucose', 'caramel coloring', 'caramel color',
  'brown rice syrup', 'rice syrup', 'natural flavor', 'artificial flavor',
  
  // International and specialty ingredients
  'atta', 'maida', 'sooji', 'suji', 'dalia', 'lapsi', 'upma', 'vermicelli',
  'sevai', 'shemai', 'bihun', 'mee hoon', 'som tam', 'pad thai sauce',
  'hoisin sauce', 'oyster sauce', 'black bean sauce', 'soy sauce',
  'shoyu', 'tamari', 'miso', 'tempura batter', 'panko breadcrumbs',
  
  // Cereal and breakfast ingredients
  'cereal', 'muesli', 'granola', 'wheat flakes', 'bran flakes', 'wheat biscuits',
  'shredded wheat', 'wheat squares', 'puffed wheat', 'wheat germ oil',
  
  // Thickening and binding agents
  'wheat binder', 'cereal binder', 'vegetable gum', 'wheat fiber',
  'cellulose', 'microcrystalline cellulose', 'carboxymethyl cellulose',
  
  // Less obvious sources
  'communion bread', 'eucharist', 'host', 'prescription medication',
  'vitamin', 'supplement', 'pharmaceutical glaze', 'tablet coating',
  'capsule', 'liquid medication', 'cough syrup', 'lozenge',
  
  // Cross-contamination prone
  'shared facility', 'may contain wheat', 'processed in facility', 'same equipment'
];

// Comprehensive list of ambiguous ingredients that may contain gluten
const AMBIGUOUS_INGREDIENTS = [
  // Flavorings and extracts
  'natural flavoring', 'natural flavor', 'artificial flavoring', 'artificial flavor',
  'natural and artificial flavoring', 'flavor', 'flavoring', 'vanilla extract',
  'almond extract', 'lemon extract', 'rum extract', 'brandy extract',
  'imitation vanilla', 'artificial vanilla', 'vanilla flavoring',
  
  // Starches (source unclear)
  'modified starch', 'modified food starch', 'food starch', 'starch',
  'vegetable starch', 'plant starch', 'cereal starch', 'edible starch',
  'pregelatinized starch', 'corn starch', 'potato starch', 'tapioca starch',
  'rice starch', 'arrowroot starch', 'cassava starch',
  
  // Dextrin and maltodextrin (can be from wheat)
  'dextrin', 'maltodextrin', 'wheat dextrin', 'corn dextrin', 'potato dextrin',
  'tapioca dextrin', 'cyclodextrin', 'resistant dextrin', 'fibersol',
  
  // Sauces and condiments
  'soy sauce', 'tamari', 'shoyu', 'teriyaki sauce', 'worcestershire sauce',
  'hoisin sauce', 'oyster sauce', 'fish sauce', 'black bean sauce',
  'brown sauce', 'steak sauce', 'barbecue sauce', 'marinara sauce',
  'pasta sauce', 'pizza sauce', 'alfredo sauce', 'pesto sauce',
  'salad dressing', 'ranch dressing', 'italian dressing', 'caesar dressing',
  
  // Broths and stocks
  'bouillon', 'broth', 'stock', 'soup base', 'chicken broth', 'beef broth',
  'vegetable broth', 'bone broth', 'consomme', 'demi-glace',
  'gravy', 'sauce mix', 'seasoning packet', 'soup mix',
  
  // Seasonings and spice blends
  'seasoning', 'spice blend', 'spice mix', 'herb blend', 'curry powder',
  'garam masala', 'chinese five spice', 'italian seasoning', 'poultry seasoning',
  'taco seasoning', 'chili powder', 'onion powder', 'garlic powder',
  'celery salt', 'seasoned salt', 'meat tenderizer', 'flavor enhancer',
  
  // Protein sources (processing unclear)
  'hydrolyzed vegetable protein', 'hydrolyzed plant protein', 'vegetable protein',
  'plant protein', 'protein isolate', 'protein concentrate', 'textured protein',
  'soy protein', 'pea protein', 'rice protein', 'hemp protein',
  'autolyzed yeast extract', 'yeast extract', 'nutritional yeast',
  
  // Emulsifiers and stabilizers
  'mono and diglycerides', 'monoglycerides', 'diglycerides', 'lecithin',
  'soy lecithin', 'sunflower lecithin', 'polysorbate 80', 'polysorbate 60',
  'carrageenan', 'xanthan gum', 'guar gum', 'locust bean gum',
  'agar', 'pectin', 'gellan gum', 'cellulose gum',
  
  // Coloring agents
  'caramel color', 'caramel coloring', 'caramel', 'natural color',
  'artificial color', 'annatto', 'beta carotene', 'turmeric extract',
  'paprika extract', 'natural coloring', 'color added',
  
  // Sweeteners and syrups
  'glucose syrup', 'corn syrup', 'high fructose corn syrup', 'rice syrup',
  'brown rice syrup', 'barley malt syrup', 'wheat syrup', 'malt syrup',
  'golden syrup', 'inverted sugar', 'dextrose', 'maltose',
  
  // Vinegars (some may contain gluten)
  'malt vinegar', 'spirit vinegar', 'distilled vinegar', 'grain vinegar',
  'white vinegar', 'flavored vinegar', 'balsamic vinegar', 'wine vinegar',
  
  // Alcoholic beverages and extracts
  'beer', 'ale', 'lager', 'stout', 'porter', 'wheat beer', 'barley wine',
  'malt beverage', 'flavored malt beverage', 'wine', 'cooking wine',
  'sherry', 'port', 'vermouth', 'sake', 'mirin', 'cooking sake',
  
  // Processed meats and seafood
  'sausage', 'hot dog', 'frankfurter', 'bratwurst', 'kielbasa', 'pepperoni',
  'salami', 'bologna', 'lunch meat', 'deli meat', 'processed meat',
  'meat substitute', 'veggie burger', 'veggie sausage', 'imitation crab',
  'surimi', 'fish cake', 'kamaboko', 'tempura',
  
  // Dairy and dairy alternatives
  'processed cheese', 'cheese spread', 'cheese sauce', 'blue cheese',
  'roquefort', 'cottage cheese', 'cream cheese', 'sour cream',
  'yogurt', 'flavored yogurt', 'ice cream', 'frozen yogurt',
  'non-dairy creamer', 'coffee creamer', 'whipped topping',
  
  // Baking and confectionery
  'baking powder', 'baking soda', 'cream of tartar', 'vanilla powder',
  'cocoa powder', 'chocolate', 'chocolate chips', 'candy',
  'licorice', 'gummy candy', 'hard candy', 'marshmallows',
  'frosting', 'icing', 'cake mix', 'cookie mix', 'brownie mix',
  
  // Supplements and vitamins
  'vitamin', 'mineral supplement', 'multivitamin', 'protein powder',
  'meal replacement', 'energy bar', 'granola bar', 'nutrition bar',
  'probiotic', 'prebiotic', 'fiber supplement', 'digestive enzyme',
  
  // Medications and health products
  'prescription medication', 'over-the-counter medication', 'cough syrup',
  'liquid medication', 'tablet coating', 'capsule', 'lozenge',
  'antacid', 'pain reliever', 'cold medicine', 'allergy medicine',
  
  // Restaurant and fast food items
  'breading', 'batter', 'coating', 'marinade', 'rub', 'glaze',
  'stuffing', 'filling', 'crust', 'pie crust', 'pizza crust',
  'bread bowl', 'wrap', 'tortilla', 'taco shell', 'nacho cheese',
  
  // Asian cuisine ingredients
  'miso', 'tempura batter', 'panko', 'wasabi', 'ponzu', 'tonkatsu sauce',
  'okonomiyaki sauce', 'yakisoba sauce', 'udon soup', 'ramen broth',
  'dumplings', 'gyoza', 'won ton', 'spring roll', 'egg roll',
  
  // Processed and convenience foods
  'instant soup', 'cup noodles', 'ramen noodles', 'mac and cheese',
  'frozen dinner', 'tv dinner', 'microwave meal', 'canned soup',
  'soup mix', 'gravy mix', 'sauce packet', 'seasoning packet',
  
  // Cosmetics and personal care (ingestion risk)
  'lipstick', 'lip balm', 'lip gloss', 'toothpaste', 'mouthwash',
  'lip treatment', 'cosmetic', 'makeup', 'personal care product',
  
  // Cross-contamination warnings
  'may contain', 'processed in facility', 'manufactured on equipment',
  'shared equipment', 'same facility', 'cross contamination possible',
  'not certified gluten-free', 'contains traces'
];

// Common dishes and their typical ingredients for gluten analysis
const DISH_DATABASE = {
  // Italian Dishes
  'pasta': { ingredients: 'wheat flour, durum wheat semolina, eggs', status: 'unsafe', description: 'Traditional pasta is made with wheat flour' },
  'pizza': { ingredients: 'wheat flour, yeast, cheese, tomato sauce', status: 'unsafe', description: 'Pizza dough contains wheat flour' },
  'lasagna': { ingredients: 'wheat pasta, cheese, meat, tomato sauce, wheat flour', status: 'unsafe', description: 'Contains wheat pasta and often wheat flour in sauce' },
  'spaghetti': { ingredients: 'wheat flour, durum wheat semolina', status: 'unsafe', description: 'Made with wheat flour' },
  'ravioli': { ingredients: 'wheat flour, eggs, cheese, filling', status: 'unsafe', description: 'Pasta wrapper contains wheat flour' },
  'risotto': { ingredients: 'arborio rice, broth, cheese, wine', status: 'caution', description: 'Rice-based but broth may contain gluten' },
  
  // Asian Dishes
  'ramen': { ingredients: 'wheat noodles, broth, soy sauce, miso', status: 'unsafe', description: 'Noodles contain wheat, soy sauce often contains wheat' },
  'udon': { ingredients: 'wheat flour, salt, water', status: 'unsafe', description: 'Thick wheat noodles' },
  'lo mein': { ingredients: 'wheat noodles, vegetables, soy sauce', status: 'unsafe', description: 'Wheat noodles and soy sauce contain gluten' },
  'pad thai': { ingredients: 'rice noodles, tamarind, fish sauce, peanuts', status: 'caution', description: 'Rice noodles are safe but sauces may contain gluten' },
  'pho': { ingredients: 'rice noodles, beef broth, herbs, spices', status: 'caution', description: 'Rice noodles are safe but broth may contain gluten' },
  'fried rice': { ingredients: 'rice, soy sauce, eggs, vegetables', status: 'caution', description: 'Rice is safe but soy sauce often contains wheat' },
  'sushi': { ingredients: 'rice, fish, nori, wasabi, soy sauce', status: 'caution', description: 'Rice and fish are safe but soy sauce contains wheat' },
  'tempura': { ingredients: 'wheat flour, seafood, vegetables, oil', status: 'unsafe', description: 'Batter made with wheat flour' },
  'teriyaki': { ingredients: 'meat, teriyaki sauce, soy sauce', status: 'unsafe', description: 'Teriyaki sauce typically contains soy sauce with wheat' },
  
  // Mexican Dishes
  'tacos': { ingredients: 'corn tortillas, meat, vegetables, cheese', status: 'safe', description: 'Corn tortillas are naturally gluten-free' },
  'burritos': { ingredients: 'wheat flour tortillas, beans, rice, meat', status: 'unsafe', description: 'Flour tortillas contain wheat' },
  'quesadillas': { ingredients: 'wheat flour tortillas, cheese', status: 'unsafe', description: 'Flour tortillas contain wheat' },
  'enchiladas': { ingredients: 'corn tortillas, sauce, cheese, meat', status: 'caution', description: 'Corn tortillas are safe but sauce may contain flour' },
  'nachos': { ingredients: 'corn chips, cheese, jalapeños', status: 'safe', description: 'Corn chips are naturally gluten-free' },
  'tamales': { ingredients: 'corn masa, meat, vegetables', status: 'safe', description: 'Made with corn masa, naturally gluten-free' },
  
  // Indian Dishes
  'naan': { ingredients: 'wheat flour, yogurt, yeast', status: 'unsafe', description: 'Bread made with wheat flour' },
  'chapati': { ingredients: 'wheat flour, water, salt', status: 'unsafe', description: 'Flatbread made with wheat flour' },
  'roti': { ingredients: 'wheat flour, water', status: 'unsafe', description: 'Flatbread made with wheat flour' },
  'curry': { ingredients: 'spices, vegetables, meat, coconut milk', status: 'caution', description: 'Usually safe but some thickeners may contain gluten' },
  'biryani': { ingredients: 'basmati rice, spices, meat, yogurt', status: 'safe', description: 'Rice-based dish, naturally gluten-free' },
  'dal': { ingredients: 'lentils, spices, turmeric', status: 'safe', description: 'Lentil-based, naturally gluten-free' },
  
  // American/Western Dishes
  'burger': { ingredients: 'wheat flour bun, meat, vegetables', status: 'unsafe', description: 'Bun contains wheat flour' },
  'sandwich': { ingredients: 'wheat bread, filling', status: 'unsafe', description: 'Bread contains wheat flour' },
  'fried chicken': { ingredients: 'chicken, wheat flour, spices', status: 'unsafe', description: 'Breading contains wheat flour' },
  'fish and chips': { ingredients: 'fish, wheat flour batter, potatoes', status: 'unsafe', description: 'Batter contains wheat flour' },
  'pancakes': { ingredients: 'wheat flour, eggs, milk, baking powder', status: 'unsafe', description: 'Made with wheat flour' },
  'waffles': { ingredients: 'wheat flour, eggs, milk, sugar', status: 'unsafe', description: 'Made with wheat flour' },
  'french toast': { ingredients: 'wheat bread, eggs, milk', status: 'unsafe', description: 'Made with wheat bread' },
  'mac and cheese': { ingredients: 'wheat pasta, cheese, milk', status: 'unsafe', description: 'Pasta contains wheat' },
  
  // Soups
  'chicken noodle soup': { ingredients: 'wheat noodles, chicken, vegetables, broth', status: 'unsafe', description: 'Noodles contain wheat' },
  'clam chowder': { ingredients: 'clams, cream, potatoes, wheat flour', status: 'unsafe', description: 'Often thickened with wheat flour' },
  'french onion soup': { ingredients: 'onions, broth, cheese, wheat bread', status: 'unsafe', description: 'Served with wheat bread croutons' },
  'miso soup': { ingredients: 'miso paste, tofu, seaweed', status: 'caution', description: 'Miso may contain wheat or barley' },
  
  // Desserts
  'cake': { ingredients: 'wheat flour, sugar, eggs, butter', status: 'unsafe', description: 'Made with wheat flour' },
  'cookies': { ingredients: 'wheat flour, sugar, butter', status: 'unsafe', description: 'Made with wheat flour' },
  'pie': { ingredients: 'wheat flour crust, filling', status: 'unsafe', description: 'Crust contains wheat flour' },
  'bread pudding': { ingredients: 'wheat bread, eggs, milk, sugar', status: 'unsafe', description: 'Made with wheat bread' },
  'donuts': { ingredients: 'wheat flour, sugar, oil', status: 'unsafe', description: 'Made with wheat flour' },
  'muffins': { ingredients: 'wheat flour, sugar, eggs, milk', status: 'unsafe', description: 'Made with wheat flour' },
  
  // Salads (generally safe)
  'caesar salad': { ingredients: 'lettuce, parmesan, dressing', status: 'caution', description: 'Salad is safe but croutons contain wheat' },
  'greek salad': { ingredients: 'lettuce, tomatoes, olives, feta cheese', status: 'safe', description: 'Naturally gluten-free ingredients' },
  'cobb salad': { ingredients: 'lettuce, chicken, bacon, eggs, cheese', status: 'safe', description: 'Naturally gluten-free ingredients' },
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
  // Camera-specific states
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    loadFavorites();
    loadCache();
  }, []);

  // Clean up search results when switching screens
  const switchToScreen = (screenName) => {
    // Clear search results and inputs when switching screens to prevent cross-contamination
    setSearchResults([]);
    setLoading(false);
    
    // Clear inputs based on the screen we're leaving
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

  // Validate search results to prevent cross-contamination between food and dish searches
  const validateAndSetSearchResults = (results, resultType) => {
    if (!Array.isArray(results)) {
      setSearchResults([]);
      return;
    }

    // Filter results based on expected type
    const validResults = results.filter(result => {
      if (!result || typeof result !== 'object') return false;
      
      if (resultType === 'food') {
        // Food products should have: product_name, ingredients_text, code
        return result.product_name && 
               typeof result.product_name === 'string' &&
               result.ingredients_text &&
               typeof result.ingredients_text === 'string';
      } else if (resultType === 'dish') {
        // Dishes should have: name, ingredients, status, description
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

  // Get camera permissions
  const getCameraPermissions = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  // Load favorites from AsyncStorage
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

  // Load cache from AsyncStorage
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

  // Save favorites to AsyncStorage
  const saveFavorites = async (newFavorites) => {
    try {
      await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
      setFavorites(newFavorites);
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  };

  // Save cache to AsyncStorage
  const saveCache = async (newCache) => {
    try {
      await AsyncStorage.setItem('productCache', JSON.stringify(newCache));
      setCache(newCache);
    } catch (error) {
      console.error('Error saving cache:', error);
    }
  };

  // Handle barcode lookup
  const handleBarcodeAnalysis = () => {
    if (!barcodeInput.trim()) {
      Alert.alert('Error', 'Please enter a barcode to analyze.');
      return;
    }
    
    fetchProductData(barcodeInput.trim());
    switchToScreen('result');
  };

  // Analyze ingredients for gluten content
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

    // Check for gluten-containing ingredients
    GLUTEN_INGREDIENTS.forEach(ingredient => {
      if (lowerIngredients.includes(ingredient.toLowerCase())) {
        flaggedGluten.push(ingredient);
      }
    });

    // Check for ambiguous ingredients
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

  // Fetch product data from Open Food Facts API
  const fetchProductData = async (barcode) => {
    setLoading(true);
    
    // Check cache first
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
        
        // Cache the product data
        const newCache = { ...cache, [barcode]: product };
        saveCache(newCache);
        
        // Analyze ingredients
        const result = analyzeIngredients(product.ingredients_text);
        setAnalysisResult(result);
      } else {
        Alert.alert('Product Not Found', 'This product is not in the Open Food Facts database.');
        setProductData(null);
        setAnalysisResult(null);
      }
    } catch (error) {
      console.error('Error fetching product data:', error);
      Alert.alert('Error', 'Failed to fetch product information. Please check your internet connection.');
      setProductData(null);
      setAnalysisResult(null);
    } finally {
      setLoading(false);
    }
  };

  // Handle manual ingredient analysis
  const handleManualAnalysis = () => {
    if (!manualIngredients.trim()) {
      Alert.alert('Error', 'Please enter ingredients to analyze.');
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

  // Search for food products by name
  const searchFoodProducts = async (searchTerm) => {
    if (!searchTerm || searchTerm.trim().length < 2) {
      Alert.alert('Error', 'Please enter at least 2 characters to search.');
      return;
    }

    setLoading(true);
    setSearchResults([]);

    try {
      const response = await fetch(`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(searchTerm)}&json=true&page_size=10&fields=code,product_name,brands,ingredients_text`);
      const data = await response.json();
      
      if (data.products && data.products.length > 0) {
        // Filter out products without ingredients
        const productsWithIngredients = data.products.filter(product => 
          product.ingredients_text && product.ingredients_text.trim().length > 0
        );
        validateAndSetSearchResults(productsWithIngredients.slice(0, 8), 'food'); // Limit to 8 results
      } else {
        validateAndSetSearchResults([], 'food');
        Alert.alert('No Results', 'No products found with that name. Try a different search term.');
      }
    } catch (error) {
      console.error('Error searching products:', error);
      Alert.alert('Error', 'Failed to search for products. Please check your internet connection.');
      validateAndSetSearchResults([], 'food');
    } finally {
      setLoading(false);
    }
  };

  // Search for dishes/recipes using multiple APIs for comprehensive coverage
  const searchDishes = async (searchTerm) => {
    if (!searchTerm || searchTerm.trim().length < 2) {
      Alert.alert('Error', 'Please enter at least 2 characters to search.');
      return;
    }

    setLoading(true);
    setSearchResults([]);

    try {
      let searchResults = [];

      // 1. Try MealDB by Category (Free, no key required) - Start with category search
      try {
        console.log('🔍 Searching MealDB by category for:', searchTerm);
        
        // First try a direct search
        let mealDBResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(searchTerm)}`);
        let mealDBData = await mealDBResponse.json();
        
        console.log('📡 MealDB Direct Search Response Status:', mealDBResponse.status);
        console.log('📋 MealDB Direct Search Data:', mealDBData);
        
        if (mealDBData.meals && mealDBData.meals.length > 0) {
          console.log(`✅ MealDB direct search found ${mealDBData.meals.length} recipes`);
          
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
              instructions: meal.strInstructions,
              category: meal.strCategory,
              area: meal.strArea,
              image: meal.strMealThumb,
              status: analysis.status,
              description: `${meal.strCategory} dish from ${meal.strArea}`,
              source: 'MealDB',
              analysis: analysis
            };
          });
          
          searchResults = mealDBResults.filter(result => result.ingredients && result.ingredients.trim());
          console.log(`🎯 MealDB processed ${searchResults.length} valid recipes`);
        } else {
          console.log('❌ MealDB direct search returned no recipes');
        }
      } catch (mealDBError) {
        console.log('❌ MealDB API Error:', mealDBError.message);
        console.log('MealDB API not available, trying alternatives...');
      }

      // 2. Try Tasty API (Free, 4000+ recipes) - Better alternative to Recipe Puppy
      if (searchResults.length < 3) {
        try {
          console.log('🔍 Searching Tasty API for:', searchTerm);
          const tastyResponse = await fetch(
            `https://tasty.p.rapidapi.com/recipes/list?from=0&size=6&q=${encodeURIComponent(searchTerm)}`,
            {
              method: 'GET',
              headers: {
                'X-RapidAPI-Key': '8238c2f035msh09d241fe20a515ep1d0ad8jsnbb9cc63ab3f6', // Use 'demo' for testing - get free key from RapidAPI
                'X-RapidAPI-Host': 'tasty.p.rapidapi.com'
              }
            }
          );
          
          console.log('📡 Tasty API Response Status:', tastyResponse.status);
          
          if (tastyResponse.ok) {
            const tastyData = await tastyResponse.json();
            console.log('📋 Tasty API Data:', tastyData);
            
            if (tastyData.results && tastyData.results.length > 0) {
              console.log(`✅ Tasty found ${tastyData.results.length} recipes`);
              const tastyResults = tastyData.results.slice(0, 4).map(recipe => {
                // Extract ingredients from sections
                let ingredientsText = '';
                if (recipe.sections && recipe.sections.length > 0) {
                  const allIngredients = [];
                  recipe.sections.forEach(section => {
                    if (section.components) {
                      section.components.forEach(component => {
                        if (component.ingredient && component.ingredient.name) {
                          allIngredients.push(component.ingredient.name.toLowerCase());
                        }
                      });
                    }
                  });
                  ingredientsText = allIngredients.join(', ');
                }
                
                const analysis = analyzeIngredients(ingredientsText);
                
                return {
                  name: recipe.name || recipe.title,
                  ingredients: ingredientsText,
                  instructions: 'See source for full instructions',
                  category: recipe.tags ? recipe.tags[0]?.name || 'Recipe' : 'Recipe',
                  area: 'Various',
                  image: recipe.thumbnail_url || null,
                  status: analysis.status,
                  description: `${recipe.tags ? recipe.tags[0]?.name || 'Recipe' : 'Recipe'} • ${recipe.cook_time_minutes ? recipe.cook_time_minutes + ' min' : 'Quick recipe'}`,
                  source: 'Tasty',
                  analysis: analysis,
                  cook_time: recipe.cook_time_minutes
                };
              });
              
              // Add Tasty results that aren't duplicates
              tastyResults.forEach(result => {
                if (result.ingredients && result.ingredients.trim() && 
                    !searchResults.some(existing => 
                      existing.name.toLowerCase() === result.name.toLowerCase()
                    )) {
                  searchResults.push(result);
                }
              });
              console.log(`🎯 Tasty processed ${tastyResults.length} valid recipes, total now: ${searchResults.length}`);
            } else {
              console.log('❌ Tasty returned no recipes');
            }
          } else {
            console.log('❌ Tasty API request failed with status:', tastyResponse.status);
          }
        } catch (tastyError) {
          console.log('❌ Tasty API Error:', tastyError.message);
          console.log('Tasty API not available, trying alternatives...');
        }
      }

      // 3. Try MealDB Category Search (if direct search didn't work well)
      if (searchResults.length < 3) {
        try {
          console.log('🔍 Trying MealDB category search for:', searchTerm);
          
          // Try searching by first letter or common categories
          const commonCategories = ['Chicken', 'Beef', 'Pork', 'Seafood', 'Vegetarian', 'Dessert', 'Pasta'];
          const matchingCategory = commonCategories.find(cat => 
            searchTerm.toLowerCase().includes(cat.toLowerCase()) || 
            cat.toLowerCase().includes(searchTerm.toLowerCase())
          );
          
          if (matchingCategory) {
            const categoryResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${matchingCategory}`);
            const categoryData = await categoryResponse.json();
            
            console.log('📡 MealDB Category Search Response Status:', categoryResponse.status);
            console.log('📋 MealDB Category Data:', categoryData);
            
            if (categoryData.meals && categoryData.meals.length > 0) {
              console.log(`✅ MealDB category search found ${categoryData.meals.length} recipes`);
              
              // Get details for first few meals
              const detailedMeals = await Promise.all(
                categoryData.meals.slice(0, 3).map(async meal => {
                  try {
                    const detailResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`);
                    const detailData = await detailResponse.json();
                    return detailData.meals ? detailData.meals[0] : null;
                  } catch {
                    return null;
                  }
                })
              );
              
              const validMeals = detailedMeals.filter(meal => meal !== null);
              
              validMeals.forEach(meal => {
                const ingredients = [];
                for (let i = 1; i <= 20; i++) {
                  const ingredient = meal[`strIngredient${i}`];
                  if (ingredient && ingredient.trim()) {
                    ingredients.push(ingredient.trim().toLowerCase());
                  }
                }
                
                const ingredientsText = ingredients.join(', ');
                const analysis = analyzeIngredients(ingredientsText);
                
                const result = {
                  name: meal.strMeal,
                  ingredients: ingredientsText,
                  instructions: meal.strInstructions,
                  category: meal.strCategory,
                  area: meal.strArea,
                  image: meal.strMealThumb,
                  status: analysis.status,
                  description: `${meal.strCategory} dish from ${meal.strArea}`,
                  source: 'MealDB',
                  analysis: analysis
                };
                
                if (!searchResults.some(existing => 
                  existing.name.toLowerCase() === result.name.toLowerCase()
                )) {
                  searchResults.push(result);
                }
              });
              
              console.log(`🎯 MealDB category search added ${validMeals.length} recipes, total now: ${searchResults.length}`);
            }
          }
        } catch (categoryError) {
          console.log('❌ MealDB Category Search Error:', categoryError.message);
        }
      }

      // 4. Try Edamam Recipe API (2+ million recipes) - Alternative free option
      if (searchResults.length < 2) {
        try {
          console.log('🔍 Searching Edamam API for:', searchTerm);
          // Using demo credentials - in production, you'd need your own API key
          const edamamResponse = await fetch(
            `https://api.edamam.com/search?q=${encodeURIComponent(searchTerm)}&app_id=demo&app_key=demo&from=0&to=6`
          );
          
          console.log('📡 Edamam API Response Status:', edamamResponse.status);
          
          if (edamamResponse.ok) {
            const edamamData = await edamamResponse.json();
            console.log('📋 Edamam API Data:', edamamData);
            
            if (edamamData.hits && edamamData.hits.length > 0) {
              console.log(`✅ Edamam found ${edamamData.hits.length} recipes`);
              const edamamResults = edamamData.hits.slice(0, 3).map(hit => {
                const recipe = hit.recipe;
                const ingredientsText = recipe.ingredientLines ? 
                  recipe.ingredientLines.join(', ').toLowerCase() : '';
                
                const analysis = analyzeIngredients(ingredientsText);
                
                return {
                  name: recipe.label,
                  ingredients: ingredientsText,
                  instructions: 'See source for full instructions',
                  category: recipe.dishType ? recipe.dishType[0] : 'Main Course',
                  area: recipe.cuisineType ? recipe.cuisineType[0] : 'International',
                  image: recipe.image,
                  status: analysis.status,
                  description: `${recipe.dishType ? recipe.dishType[0] : 'Recipe'} • ${Math.round(recipe.calories || 0)} cal`,
                  source: 'Edamam',
                  analysis: analysis,
                  calories: Math.round(recipe.calories || 0)
                };
              });
              
              // Add Edamam results that aren't duplicates
              edamamResults.forEach(result => {
                if (!searchResults.some(existing => 
                  existing.name.toLowerCase() === result.name.toLowerCase()
                )) {
                  searchResults.push(result);
                }
              });
              console.log(`🎯 Edamam processed ${edamamResults.length} valid recipes, total now: ${searchResults.length}`);
            } else {
              console.log('❌ Edamam returned no recipes');
            }
          } else {
            console.log('❌ Edamam API request failed with status:', edamamResponse.status);
          }
        } catch (edamamError) {
          console.log('❌ Edamam API Error:', edamamError.message);
          console.log('Edamam API not available, using local database...');
        }
      }

      // 5. Fall back to local database if APIs don't provide enough results
      if (searchResults.length < 2) {
        console.log('🔍 Searching Local Database for:', searchTerm);
        const lowerSearchTerm = searchTerm.toLowerCase().trim();
        const matchingDishes = [];

        // Search through dish database
        Object.keys(DISH_DATABASE).forEach(dishName => {
          if (dishName.includes(lowerSearchTerm) || lowerSearchTerm.includes(dishName)) {
            const dish = DISH_DATABASE[dishName];
            matchingDishes.push({
              name: dishName.charAt(0).toUpperCase() + dishName.slice(1),
              ...dish,
              source: 'Local Database'
            });
          }
        });

        // Also search for partial matches in static database
        if (matchingDishes.length < 5) {
          Object.keys(DISH_DATABASE).forEach(dishName => {
            const words = lowerSearchTerm.split(' ');
            const dishWords = dishName.split(' ');
            
            const hasPartialMatch = words.some(word => 
              dishWords.some(dishWord => 
                dishWord.includes(word) || word.includes(dishWord)
              )
            );

            if (hasPartialMatch && !matchingDishes.some(dish => dish.name.toLowerCase() === dishName)) {
              const dish = DISH_DATABASE[dishName];
              matchingDishes.push({
                name: dishName.charAt(0).toUpperCase() + dishName.slice(1),
                ...dish,
                source: 'Local Database'
              });
            }
          });
        }

        // Add local results that aren't duplicates
        matchingDishes.forEach(result => {
          if (!searchResults.some(existing => 
            existing.name.toLowerCase() === result.name.toLowerCase()
          )) {
            searchResults.push(result);
          }
        });
        console.log(`🎯 Local Database found ${matchingDishes.length} dishes, total now: ${searchResults.length}`);
      }

      console.log(`🏁 Final search results: ${searchResults.length} total recipes found`);
      validateAndSetSearchResults(searchResults.slice(0, 8), 'dish'); // Limit to 8 results
      
      if (searchResults.length === 0) {
        Alert.alert('No Results', 'No dishes found with that name. Try searching for common dishes like "chicken", "pasta", "soup", etc.');
      }
    } catch (error) {
      console.error('Error searching dishes:', error);
      Alert.alert('Error', 'Failed to search for dishes. Please check your internet connection.');
      validateAndSetSearchResults([], 'dish');
    } finally {
      setLoading(false);
    }
  };

  // Handle selecting a product from search results
  const handleProductSelection = (product) => {
    const productData = {
      product_name: product.product_name || 'Unknown Product',
      ingredients_text: product.ingredients_text || '',
      brands: product.brands || '',
      barcode: product.code
    };
    
    setProductData(productData);
    
    // Analyze ingredients
    const result = analyzeIngredients(productData.ingredients_text);
    setAnalysisResult(result);
    
    // Cache the product data if it has a barcode
    if (product.code) {
      const newCache = { ...cache, [product.code]: productData };
      saveCache(newCache);
    }
    
    switchToScreen('result');
  };

  // Handle selecting a dish from search results
  const handleDishSelection = (dish) => {
    const productData = {
      product_name: dish.name,
      ingredients_text: dish.ingredients,
      brands: dish.source === 'TheMealDB' ? `${dish.category} - ${dish.area}` : 
              dish.source === 'Spoonacular' ? `${dish.category} - ${dish.area}` :
              dish.source === 'Edamam' ? `${dish.category} - ${dish.area}` :
              'General Recipe',
      barcode: null,
      isDish: true,
      dishDescription: dish.description,
      dishCategory: dish.category,
      dishArea: dish.area,
      dishImage: dish.image,
      dishSource: dish.source,
      servings: dish.servings,
      calories: dish.calories
    };
    
    setProductData(productData);
    
    // Use the analysis from API search if available, otherwise create new analysis
    let analysisResult;
    if (dish.analysis) {
      analysisResult = dish.analysis;
    } else if (dish.status === 'safe') {
      analysisResult = {
        status: 'safe',
        message: dish.description,
        flaggedIngredients: [],
        ambiguousIngredients: []
      };
    } else if (dish.status === 'caution') {
      analysisResult = {
        status: 'caution',
        message: dish.description,
        flaggedIngredients: [],
        ambiguousIngredients: ['Check sauce ingredients', 'Verify preparation method']
      };
    } else {
      // Extract gluten ingredients for unsafe dishes
      const flaggedGluten = [];
      const lowerIngredients = dish.ingredients.toLowerCase();
      GLUTEN_INGREDIENTS.forEach(ingredient => {
        if (lowerIngredients.includes(ingredient.toLowerCase())) {
          flaggedGluten.push(ingredient);
        }
      });
      
      analysisResult = {
        status: 'unsafe',
        message: dish.description,
        flaggedIngredients: flaggedGluten,
        ambiguousIngredients: []
      };
    }
    
    setAnalysisResult(analysisResult);
    switchToScreen('result');
  };

  // Add/remove product from favorites
  const toggleFavorite = (product) => {
    if (!product) return;
    
    // For dishes, use the dish name as identifier; for products, use barcode
    const identifier = product.isDish ? product.product_name : product.barcode;
    if (!identifier) return;
    
    const isFavorite = favorites.some(fav => 
      fav.isDish ? fav.product_name === identifier : fav.barcode === identifier
    );
    
    let newFavorites;
    
    if (isFavorite) {
      newFavorites = favorites.filter(fav => 
        fav.isDish ? fav.product_name !== identifier : fav.barcode !== identifier
      );
    } else {
      // Add timestamp when adding to favorites
      const favoriteProduct = {
        ...product,
        dateAdded: new Date().toISOString()
      };
      newFavorites = [...favorites, favoriteProduct];
    }
    
    saveFavorites(newFavorites);
  };

  // Get status icon and color
  const getStatusDisplay = (status) => {
    switch (status) {
      case 'safe':
        return { icon: '✅', color: '#4CAF50', text: 'Safe' };
      case 'caution':
        return { icon: '⚠️', color: '#FF9800', text: 'Caution' };
      case 'unsafe':
        return { icon: '❌', color: '#F44336', text: 'Unsafe' };
      default:
        return { icon: '❓', color: '#9E9E9E', text: 'Unknown' };
    }
  };

  // Home Screen
  const renderHomeScreen = () => (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🛡️ Gluten Guardian</Text>
        <Text style={styles.subtitle}>Your gluten-free companion</Text>
        <Text style={styles.note}>📱 Camera-Enabled Version - Scan barcodes or enter manually</Text>
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={() => {
            if (hasPermission === null) {
              getCameraPermissions();
            }
            setScanned(false); // Reset scanned state
            switchToScreen('scanner');
          }}
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
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>🍽️ Search Dishes</Text>
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
            setManualIngredients('wheat flour, sugar, salt, yeast');
            switchToScreen('manual');
          }}
        >
          <Text style={styles.testButtonText}>Test Unsafe: "wheat flour, sugar, salt, yeast"</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.testButton}
          onPress={() => {
            setManualIngredients('rice flour, vegetable oil, salt');
            switchToScreen('manual');
          }}
        >
          <Text style={styles.testButtonText}>Test Safe: "rice flour, vegetable oil, salt"</Text>
        </TouchableOpacity>
      </View>
      
      <StatusBar style="auto" />
    </SafeAreaView>
  );

  // Barcode Scanner Screen
  const renderScannerScreen = () => {
    if (hasPermission === null) {
      return (
        <SafeAreaView style={styles.container}>
          <View style={styles.permissionContainer}>
            <Text style={styles.permissionText}>Camera permission required</Text>
            <TouchableOpacity style={styles.button} onPress={getCameraPermissions}>
              <Text style={styles.buttonText}>Grant Camera Permission</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={() => switchToScreen('home')}
            >
              <Text style={styles.buttonText}>Back to Home</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      );
    }
    if (hasPermission === false) {
      return (
        <SafeAreaView style={styles.container}>
          <View style={styles.permissionContainer}>
            <Text style={styles.permissionText}>Camera access denied. Please enable camera permissions in settings.</Text>
            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={() => switchToScreen('home')}
            >
              <Text style={styles.buttonText}>Back to Home</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      );
    }

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Scan Product Barcode</Text>
          <Text style={styles.subtitle}>Align the barcode within the frame to scan</Text>
        </View>
        
        <View style={styles.scannerContainer}>
          <CameraView
            style={styles.scanner}
            barcodeScannerSettings={{
              barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e', 'code128', 'code39'],
            }}
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          />
          <View style={styles.scannerOverlay}>
            <View style={styles.scannerFrame} />
          </View>
        </View>
        
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => switchToScreen('home')}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  };

  // Handle barcode scanned from camera
  const handleBarCodeScanned = ({ data }) => {
    // Validate that we have valid barcode data
    if (!data || typeof data !== 'string' || data.trim().length === 0) {
      Alert.alert('Error', 'Invalid barcode data received. Please try scanning again.');
      setScanned(false);
      return;
    }
    
    setScanned(true);
    setBarcodeInput(data);
    fetchProductData(data);
    switchToScreen('result');
  };

  // Food Search Screen
  const renderFoodSearchScreen = () => (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Search Food Products</Text>
        <Text style={styles.subtitle}>Enter a food product name to find packaged items</Text>
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Enter product name:</Text>
        <TextInput
          style={styles.barcodeInput}
          placeholder="Enter product name (e.g., Doritos, Nutella, Cheerios)"
          value={foodSearchInput}
          onChangeText={setFoodSearchInput}
          autoCapitalize="words"
          onSubmitEditing={() => searchFoodProducts(foodSearchInput)}
        />
        
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={() => searchFoodProducts(foodSearchInput)}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? '🔍 Searching...' : '🔍 Search Products'}
          </Text>
        </TouchableOpacity>
        
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2196F3" />
            <Text style={styles.loadingText}>Searching for products...</Text>
          </View>
        )}
        
        {searchResults.length > 0 && (
          <ScrollView style={styles.searchResultsContainer}>
            <Text style={styles.resultsTitle}>Found {searchResults.length} products:</Text>
            {searchResults.map((product, index) => (
              <TouchableOpacity
                key={index}
                style={styles.searchResultItem}
                onPress={() => handleProductSelection(product)}
              >
                <Text style={styles.searchResultName}>{product.product_name}</Text>
                {product.brands && (
                  <Text style={styles.searchResultBrand}>{product.brands}</Text>
                )}
                <Text style={styles.searchResultPreview}>
                  {product.ingredients_text.substring(0, 100)}
                  {product.ingredients_text.length > 100 ? '...' : ''}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
        
        <View style={styles.exampleSection}>
          <Text style={styles.exampleTitle}>💡 Example product searches to try:</Text>
          <TouchableOpacity
            style={styles.exampleButton}
            onPress={() => {
              setFoodSearchInput('Doritos');
              searchFoodProducts('Doritos');
            }}
          >
            <Text style={styles.exampleButtonText}>Try: Doritos</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.exampleButton}
            onPress={() => {
              setFoodSearchInput('Cheerios');
              searchFoodProducts('Cheerios');
            }}
          >
            <Text style={styles.exampleButtonText}>Try: Cheerios</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => switchToScreen('home')}
      >
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );

  // Dish Search Screen
  const renderDishSearchScreen = () => (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Search Dishes & Recipes</Text>
        <Text style={styles.subtitle}>Enter a dish name to check for gluten</Text>
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Enter dish name:</Text>
        <TextInput
          style={styles.barcodeInput}
          placeholder="Enter dish name (e.g., pasta, pizza, tacos, curry)"
          value={dishSearchInput}
          onChangeText={setDishSearchInput}
          autoCapitalize="words"
          onSubmitEditing={() => searchDishes(dishSearchInput)}
        />
        
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={() => searchDishes(dishSearchInput)}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? '🔍 Searching...' : '🔍 Search Dishes'}
          </Text>
        </TouchableOpacity>
        
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2196F3" />
            <Text style={styles.loadingText}>Searching for dish recipes...</Text>
          </View>
        )}
        
        {searchResults.length > 0 && (
          <ScrollView style={styles.searchResultsContainer}>
            <Text style={styles.resultsTitle}>Found {searchResults.length} dishes:</Text>
            {searchResults.map((dish, index) => {
              const statusDisplay = getStatusDisplay(dish.status);
              return (
                <TouchableOpacity
                  key={index}
                  style={[styles.searchResultItem, styles.dishResultItem]}
                  onPress={() => handleDishSelection(dish)}
                >
                  <View style={styles.dishResultHeader}>
                    <View style={styles.dishResultInfo}>
                      <Text style={styles.searchResultName}>{dish.name}</Text>
                      {dish.source && (
                        <Text style={styles.dishSourceText}>
                          📡 {dish.source}
                          {dish.category && dish.area && ` • ${dish.category} • ${dish.area}`}
                          {dish.servings && ` • Serves ${dish.servings}`}
                          {dish.calories && ` • ${dish.calories} cal`}
                        </Text>
                      )}
                    </View>
                    <View style={styles.dishStatusContainer}>
                      <Text style={styles.dishStatusIcon}>{statusDisplay.icon}</Text>
                      <Text style={[styles.dishStatusText, { color: statusDisplay.color }]}>
                        {statusDisplay.text}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.dishDescription}>{dish.description}</Text>
                  <Text style={styles.searchResultPreview}>
                    Ingredients: {dish.ingredients.length > 100 ? 
                      dish.ingredients.substring(0, 100) + '...' : 
                      dish.ingredients}
                  </Text>
                  {(dish.source === 'MealDB' || dish.source === 'Tasty' || dish.source === 'Edamam') && (
                    <Text style={styles.realRecipeTag}>🍽️ Real Recipe Data</Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}
        
        <View style={styles.exampleSection}>
          <Text style={styles.exampleTitle}>💡 Example dish searches to try:</Text>
          <Text style={styles.exampleSubtitle}>🌐 Searches 1000+ free recipes from MealDB, Tasty, Edamam + local database</Text>
          <TouchableOpacity
            style={styles.exampleButton}
            onPress={() => {
              setDishSearchInput('chicken tikka masala');
              searchDishes('chicken tikka masala');
            }}
          >
            <Text style={styles.exampleButtonText}>Try: Chicken Tikka Masala</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.exampleButton}
            onPress={() => {
              setDishSearchInput('chocolate cake');
              searchDishes('chocolate cake');
            }}
          >
            <Text style={styles.exampleButtonText}>Try: Chocolate Cake</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.exampleButton}
            onPress={() => {
              setDishSearchInput('vegetable stir fry');
              searchDishes('vegetable stir fry');
            }}
          >
            <Text style={styles.exampleButtonText}>Try: Vegetable Stir Fry</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => switchToScreen('home')}
      >
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );

  // Manual Barcode Entry Screen
  const renderManualBarcodeScreen = () => (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Manual Barcode Entry</Text>
        <Text style={styles.subtitle}>Enter a product barcode to look up</Text>
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Enter barcode:</Text>
        <TextInput
          style={styles.barcodeInput}
          placeholder="Enter barcode number (e.g., 123456789012)"
          value={barcodeInput}
          onChangeText={setBarcodeInput}
          keyboardType="numeric"
          maxLength={20}
        />
        
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={handleBarcodeAnalysis}
        >
          <Text style={styles.buttonText}>🔍 Look Up Product</Text>
        </TouchableOpacity>
        
        <View style={styles.exampleSection}>
          <Text style={styles.exampleTitle}>💡 Example barcodes to try:</Text>
          <TouchableOpacity
            style={styles.exampleButton}
            onPress={() => setBarcodeInput('3017620422003')}
          >
            <Text style={styles.exampleButtonText}>Try: 3017620422003 (Nutella)</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.exampleButton}
            onPress={() => setBarcodeInput('8901030865881')}
          >
            <Text style={styles.exampleButtonText}>Try: 8901030865881 (Maggi Noodles)</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => switchToScreen('home')}
      >
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );

  // Manual Input Screen
  const renderManualScreen = () => (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Manual Ingredient Check</Text>
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Enter ingredients list:</Text>
        <TextInput
          style={styles.textInput}
          multiline
          numberOfLines={8}
          placeholder="Enter ingredients separated by commas..."
          value={manualIngredients}
          onChangeText={setManualIngredients}
        />
        
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={handleManualAnalysis}
        >
          <Text style={styles.buttonText}>🔍 Analyze Ingredients</Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => switchToScreen('home')}
      >
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );

  // Result Screen
  const renderResultScreen = () => {
    if (loading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#2196F3" />
          <Text style={styles.loadingText}>Analyzing product...</Text>
        </View>
      );
    }

    if (!analysisResult || !productData) {
      return (
        <View style={styles.container}>
          <Text style={styles.errorText}>No analysis data available</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => switchToScreen('home')}
          >
            <Text style={styles.buttonText}>Go Home</Text>
          </TouchableOpacity>
        </View>
      );
    }

    const statusDisplay = getStatusDisplay(analysisResult.status);
    const identifier = productData.isDish ? productData.product_name : productData.barcode;
    const isFavorite = identifier && favorites.some(fav => 
      fav.isDish ? fav.product_name === identifier : fav.barcode === identifier
    );

    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.resultContainer}>
          <View style={styles.resultHeader}>
            <Text style={styles.productName}>{productData.product_name}</Text>
            {productData.brands && (
              <Text style={styles.brandName}>{productData.brands}</Text>
            )}
            {productData.isDish && (
              <Text style={styles.dishNote}>
                📋 {productData.dishSource === 'TheMealDB' || productData.dishSource === 'Spoonacular' || productData.dishSource === 'Edamam' ? 
                     'Real Recipe Analysis' : 'General Recipe Analysis'}
              </Text>
            )}
            {productData.dishCategory && productData.dishArea && (
              <Text style={styles.dishCategoryText}>
                {productData.dishCategory} • {productData.dishArea}
                {productData.servings && ` • Serves ${productData.servings}`}
                {productData.calories && ` • ${productData.calories} calories`}
              </Text>
            )}
          </View>
          
          <View style={[styles.statusCard, { borderColor: statusDisplay.color }]}>
            <Text style={styles.statusIcon}>{statusDisplay.icon}</Text>
            <Text style={[styles.statusText, { color: statusDisplay.color }]}>
              {statusDisplay.text}: {analysisResult.message}
            </Text>
          </View>
          
          {analysisResult.flaggedIngredients && analysisResult.flaggedIngredients.length > 0 && (
            <View style={styles.flaggedSection}>
              <Text style={styles.flaggedTitle}>🚫 Gluten-containing ingredients:</Text>
              {analysisResult.flaggedIngredients.map((ingredient, index) => (
                <Text key={index} style={styles.flaggedItem}>• {ingredient}</Text>
              ))}
            </View>
          )}
          
          {analysisResult.ambiguousIngredients && analysisResult.ambiguousIngredients.length > 0 && (
            <View style={styles.flaggedSection}>
              <Text style={styles.cautionTitle}>⚠️ Potentially problematic ingredients:</Text>
              {analysisResult.ambiguousIngredients.map((ingredient, index) => (
                <Text key={index} style={styles.cautionItem}>• {ingredient}</Text>
              ))}
            </View>
          )}
          
          {productData.ingredients_text && (
            <View style={styles.ingredientsSection}>
              <Text style={styles.ingredientsTitle}>
                {productData.isDish ? 'Typical Ingredients:' : 'Full Ingredients List:'}
              </Text>
              <Text style={styles.ingredientsText}>{productData.ingredients_text}</Text>
              {productData.isDish && (
                <Text style={styles.dishDisclaimer}>
                  ⚠️ Note: {productData.dishSource === 'MealDB' || productData.dishSource === 'Tasty' || productData.dishSource === 'Edamam' ? 
                    'This analysis is based on a real recipe from a comprehensive recipe database. However, preparation methods and ingredient brands may vary between restaurants and home cooking.' :
                    'This is a general analysis of typical ingredients. Actual recipes may vary significantly.'
                  } Always check with the chef or restaurant for specific ingredients.
                </Text>
              )}
            </View>
          )}
          
          <View style={styles.actionButtons}>
            {identifier && (
              <TouchableOpacity
                style={[styles.button, isFavorite ? styles.favoriteButton : styles.secondaryButton]}
                onPress={() => toggleFavorite(productData)}
              >
                <Text style={[styles.buttonText, !isFavorite && styles.secondaryButtonText]}>
                  {isFavorite ? '⭐ Remove from Favorites' : '☆ Add to Favorites'}
                </Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={() => {
                setScanned(false); // Reset scanned state
                setAnalysisResult(null);
                setProductData(null);
                setBarcodeInput('');
                setDishSearchInput('');
                if (productData.isDish) {
                  switchToScreen('searchDish');
                } else {
                  switchToScreen('scanner');
                }
              }}
            >
              <Text style={styles.buttonText}>
                {productData.isDish ? '🍽️ Search Another Dish' : '📷 Scan Another'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => switchToScreen('home')}
        >
          <Text style={styles.backButtonText}>← Home</Text>
        </TouchableOpacity>
        
        {/* Show favorites button if we have favorites and this product can be favorited */}
        {favorites.length > 0 && (
          <TouchableOpacity
            style={[styles.backButton, { right: 20, left: 'auto' }]}
            onPress={() => switchToScreen('favorites')}
          >
            <Text style={styles.backButtonText}>⭐ Favorites</Text>
          </TouchableOpacity>
        )}
      </SafeAreaView>
    );
  };

  // Favorites Screen
  const renderFavoritesScreen = () => (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>⭐ Favorite Products</Text>
        <Text style={styles.subtitle}>Tap any item to view full analysis</Text>
      </View>
      
      <ScrollView style={styles.favoritesContainer}>
        {favorites.length === 0 ? (
          <Text style={styles.emptyText}>No favorite products or dishes yet. Start scanning or searching to add some!</Text>
        ) : (
          favorites.map((item, index) => {
            // Analyze the product to get gluten status
            const analysis = analyzeIngredients(item.ingredients_text);
            const statusDisplay = getStatusDisplay(analysis.status);
            
            return (
              <TouchableOpacity
                key={index}
                style={[styles.favoriteItem, { borderLeftColor: statusDisplay.color, borderLeftWidth: 5 }]}
                onPress={() => {
                  // Set up the product data and analysis result
                  setProductData(item);
                  setAnalysisResult(analysis);
                  switchToScreen('result');
                }}
              >
                <View style={styles.favoriteItemHeader}>
                  <View style={styles.favoriteItemInfo}>
                    <Text style={styles.favoriteProductName}>{item.product_name}</Text>
                    {item.brands && (
                      <Text style={styles.favoriteBrandName}>{item.brands}</Text>
                    )}
                    {item.isDish && (
                      <Text style={styles.favoriteDishTag}>🍽️ Recipe</Text>
                    )}
                  </View>
                  <View style={styles.favoriteStatusContainer}>
                    <Text style={styles.favoriteStatusIcon}>{statusDisplay.icon}</Text>
                    <Text style={[styles.favoriteStatusText, { color: statusDisplay.color }]}>
                      {statusDisplay.text}
                    </Text>
                  </View>
                </View>
                
                {/* Show flagged ingredients if any */}
                {analysis.flaggedIngredients && analysis.flaggedIngredients.length > 0 && (
                  <View style={styles.favoriteWarning}>
                    <Text style={styles.favoriteWarningText}>
                      ⚠️ Contains: {analysis.flaggedIngredients.slice(0, 2).join(', ')}
                      {analysis.flaggedIngredients.length > 2 ? '...' : ''}
                    </Text>
                  </View>
                )}
                
                {/* Show ambiguous ingredients if any and no gluten ingredients */}
                {analysis.ambiguousIngredients && analysis.ambiguousIngredients.length > 0 && 
                 (!analysis.flaggedIngredients || analysis.flaggedIngredients.length === 0) && (
                  <View style={styles.favoriteCaution}>
                    <Text style={styles.favoriteCautionText}>
                      ⚠️ May contain: {analysis.ambiguousIngredients.slice(0, 2).join(', ')}
                      {analysis.ambiguousIngredients.length > 2 ? '...' : ''}
                    </Text>
                  </View>
                )}
                
                <View style={styles.favoriteActions}>
                  <TouchableOpacity
                    style={styles.removeFavoriteButton}
                    onPress={(e) => {
                      e.stopPropagation(); // Prevent triggering the main onPress
                      toggleFavorite(item);
                    }}
                  >
                    <Text style={styles.removeFavoriteText}>Remove</Text>
                  </TouchableOpacity>
                  <Text style={styles.tapHintText}>Tap to view details →</Text>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
      
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => switchToScreen('home')}
      >
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );

  // Main render function
  switch (currentScreen) {
    case 'scanner':
      return renderScannerScreen();
    case 'manualBarcode':
      return renderManualBarcodeScreen();
    case 'searchFood':
      return renderFoodSearchScreen();
    case 'searchDish':
      return renderDishSearchScreen();
    case 'manual':
      return renderManualScreen();
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
  },
  header: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  buttonContainer: {
    paddingHorizontal: 20,
    gap: 15,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
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
  favoriteButton: {
    backgroundColor: '#FF9800',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  secondaryButtonText: {
    color: '#2196F3',
  },
  tertiaryButtonText: {
    color: '#FF9800',
  },
  scannerContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  scanner: {
    flex: 1,
  },
  scannerOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerFrame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: 'white',
    backgroundColor: 'transparent',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  permissionText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#333',
    marginBottom: 20,
  },
  scannerText: {
    color: 'white',
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  inputContainer: {
    paddingHorizontal: 20,
    flex: 1,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    backgroundColor: 'white',
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  barcodeInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 18,
    backgroundColor: 'white',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'monospace',
  },
  resultContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  resultHeader: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 5,
  },
  brandName: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  statusCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    marginBottom: 20,
  },
  statusIcon: {
    fontSize: 48,
    marginBottom: 10,
  },
  statusText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  flaggedSection: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  flaggedTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F44336',
    marginBottom: 10,
  },
  flaggedItem: {
    fontSize: 14,
    color: '#F44336',
    marginBottom: 5,
  },
  cautionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF9800',
    marginBottom: 10,
  },
  cautionItem: {
    fontSize: 14,
    color: '#FF9800',
    marginBottom: 5,
  },
  ingredientsSection: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  ingredientsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  ingredientsText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  actionButtons: {
    gap: 10,
    marginBottom: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  searchResultsContainer: {
    maxHeight: 300,
    marginTop: 15,
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  searchResultItem: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  searchResultName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  searchResultBrand: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  searchResultPreview: {
    fontSize: 12,
    color: '#888',
    lineHeight: 16,
  },
  errorText: {
    fontSize: 18,
    color: '#F44336',
    textAlign: 'center',
    marginBottom: 20,
  },
  favoritesContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  favoriteItem: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  favoriteItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  favoriteItemInfo: {
    flex: 1,
    marginRight: 10,
  },
  favoriteStatusContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 60,
  },
  favoriteStatusIcon: {
    fontSize: 24,
    marginBottom: 2,
  },
  favoriteStatusText: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  favoriteWarning: {
    backgroundColor: '#ffebee',
    padding: 8,
    borderRadius: 6,
    marginBottom: 8,
  },
  favoriteWarningText: {
    fontSize: 12,
    color: '#c62828',
    fontWeight: '500',
  },
  favoriteCaution: {
    backgroundColor: '#fff3e0',
    padding: 8,
    borderRadius: 6,
    marginBottom: 8,
  },
  favoriteCautionText: {
    fontSize: 12,
    color: '#ef6c00',
    fontWeight: '500',
  },
  favoriteActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  tapHintText: {
    fontSize: 12,
    color: '#2196F3',
    fontStyle: 'italic',
  },
  favoriteProductName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  favoriteBrandName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  removeFavoriteButton: {
    alignSelf: 'flex-end',
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#F44336',
    borderRadius: 6,
  },
  removeFavoriteText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 50,
    paddingHorizontal: 20,
  },
  dishNote: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 5,
  },
  dishDisclaimer: {
    fontSize: 12,
    color: '#FF9800',
    fontStyle: 'italic',
    marginTop: 10,
    lineHeight: 16,
  },
  dishResultItem: {
    backgroundColor: '#f8f9fa',
  },
  dishResultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  dishStatusContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 60,
  },
  dishStatusIcon: {
    fontSize: 20,
    marginBottom: 2,
  },
  dishStatusText: {
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  dishDescription: {
    fontSize: 13,
    color: '#555',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  favoriteDishTag: {
    fontSize: 12,
    color: '#FF9800',
    fontWeight: 'bold',
  },
  dishCategoryText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 2,
  },
  dishResultInfo: {
    flex: 1,
    marginRight: 10,
  },
  dishSourceText: {
    fontSize: 11,
    color: '#2196F3',
    marginTop: 3,
    fontWeight: '500',
  },
  realRecipeTag: {
    fontSize: 11,
    color: '#4CAF50',
    fontWeight: 'bold',
    marginTop: 5,
    textAlign: 'right',
  },
  exampleSubtitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  testSection: {
    marginTop: 20,
    padding: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
  },
  testTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  testButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
  },
  testButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  note: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
  },
  exampleSection: {
    marginTop: 15,
    padding: 15,
    backgroundColor: '#e8f5e8',
    borderRadius: 8,
  },
  exampleTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  exampleText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  exampleButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    marginVertical: 4,
  },
  exampleButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
  },
  scanner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  scannerFrame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: 'white',
    backgroundColor: 'transparent',
  },
  scannerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
