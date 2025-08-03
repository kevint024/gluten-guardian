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

// List of gluten-containing ingredients
const GLUTEN_INGREDIENTS = [
  'wheat', 'barley', 'rye', 'malt', 'semolina', 'triticale', 'spelt', 'farro',
  'durum', 'vital wheat gluten', 'graham flour', 'brewer\'s yeast', 'brewers yeast',
  'modified food starch', 'maltodextrin', 'hydrolyzed wheat protein', 'bulgur',
  'couscous', 'einkorn', 'emmer', 'kamut', 'seitan', 'wheat germ', 'wheat bran',
  'wheat flour', 'bread flour', 'cake flour', 'pastry flour', 'self-rising flour',
  'enriched flour', 'bleached flour', 'unbleached flour', 'whole wheat',
  'wheat starch', 'wheat protein', 'gluten', 'oats', 'oat', 'matzo', 'matzah'
];

// Ambiguous ingredients that may contain gluten
const AMBIGUOUS_INGREDIENTS = [
  'natural flavoring', 'artificial flavoring', 'modified starch', 'dextrin',
  'caramel color', 'soy sauce', 'teriyaki sauce', 'worcestershire sauce',
  'bouillon', 'broth', 'stock', 'soup base', 'seasoning', 'spice blend',
  'food starch', 'starch', 'mono and diglycerides', 'lecithin'
];

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [manualIngredients, setManualIngredients] = useState('');
  const [barcodeInput, setBarcodeInput] = useState('');
  const [foodSearchInput, setFoodSearchInput] = useState('');
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
    setCurrentScreen('result');
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
    setCurrentScreen('result');
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
        setSearchResults(productsWithIngredients.slice(0, 8)); // Limit to 8 results
      } else {
        setSearchResults([]);
        Alert.alert('No Results', 'No products found with that name. Try a different search term.');
      }
    } catch (error) {
      console.error('Error searching products:', error);
      Alert.alert('Error', 'Failed to search for products. Please check your internet connection.');
      setSearchResults([]);
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
    
    setCurrentScreen('result');
  };

  // Add/remove product from favorites
  const toggleFavorite = (product) => {
    if (!product || !product.barcode) return;
    
    const isFavorite = favorites.some(fav => fav.barcode === product.barcode);
    let newFavorites;
    
    if (isFavorite) {
      newFavorites = favorites.filter(fav => fav.barcode !== product.barcode);
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
            setCurrentScreen('scanner');
          }}
        >
          <Text style={styles.buttonText}>📷 Scan Barcode</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => setCurrentScreen('manualBarcode')}
        >
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>🔢 Enter Barcode</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => setCurrentScreen('searchFood')}
        >
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>🔍 Search Food</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => setCurrentScreen('manual')}
        >
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>✏️ Manual Check</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, styles.tertiaryButton]}
          onPress={() => setCurrentScreen('favorites')}
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
            setCurrentScreen('manual');
          }}
        >
          <Text style={styles.testButtonText}>Test Unsafe: "wheat flour, sugar, salt, yeast"</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.testButton}
          onPress={() => {
            setManualIngredients('rice flour, vegetable oil, salt');
            setCurrentScreen('manual');
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
              onPress={() => setCurrentScreen('home')}
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
              onPress={() => setCurrentScreen('home')}
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
          onPress={() => setCurrentScreen('home')}
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
    setCurrentScreen('result');
  };

  // Food Search Screen
  const renderFoodSearchScreen = () => (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Search Food Products</Text>
        <Text style={styles.subtitle}>Enter a food name to find products</Text>
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Enter food name:</Text>
        <TextInput
          style={styles.barcodeInput}
          placeholder="Enter food name (e.g., Doritos, Nutella, Cheerios)"
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
          <Text style={styles.exampleTitle}>💡 Example searches to try:</Text>
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
        onPress={() => setCurrentScreen('home')}
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
        onPress={() => setCurrentScreen('home')}
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
        onPress={() => setCurrentScreen('home')}
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
            onPress={() => setCurrentScreen('home')}
          >
            <Text style={styles.buttonText}>Go Home</Text>
          </TouchableOpacity>
        </View>
      );
    }

    const statusDisplay = getStatusDisplay(analysisResult.status);
    const isFavorite = productData.barcode && favorites.some(fav => fav.barcode === productData.barcode);

    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.resultContainer}>
          <View style={styles.resultHeader}>
            <Text style={styles.productName}>{productData.product_name}</Text>
            {productData.brands && (
              <Text style={styles.brandName}>{productData.brands}</Text>
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
              <Text style={styles.ingredientsTitle}>Full Ingredients List:</Text>
              <Text style={styles.ingredientsText}>{productData.ingredients_text}</Text>
            </View>
          )}
          
          <View style={styles.actionButtons}>
            {productData.barcode && (
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
                setCurrentScreen('scanner');
                setAnalysisResult(null);
                setProductData(null);
                setBarcodeInput('');
              }}
            >
              <Text style={styles.buttonText}>📷 Scan Another</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setCurrentScreen('home')}
        >
          <Text style={styles.backButtonText}>← Home</Text>
        </TouchableOpacity>
        
        {/* Show favorites button if we have favorites and this product can be favorited */}
        {favorites.length > 0 && (
          <TouchableOpacity
            style={[styles.backButton, { right: 20, left: 'auto' }]}
            onPress={() => setCurrentScreen('favorites')}
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
          <Text style={styles.emptyText}>No favorite products yet. Start scanning to add some!</Text>
        ) : (
          favorites.map((product, index) => {
            // Analyze the product to get gluten status
            const analysis = analyzeIngredients(product.ingredients_text);
            const statusDisplay = getStatusDisplay(analysis.status);
            
            return (
              <TouchableOpacity
                key={index}
                style={[styles.favoriteItem, { borderLeftColor: statusDisplay.color, borderLeftWidth: 5 }]}
                onPress={() => {
                  // Set up the product data and analysis result
                  setProductData(product);
                  setAnalysisResult(analysis);
                  setCurrentScreen('result');
                }}
              >
                <View style={styles.favoriteItemHeader}>
                  <View style={styles.favoriteItemInfo}>
                    <Text style={styles.favoriteProductName}>{product.product_name}</Text>
                    {product.brands && (
                      <Text style={styles.favoriteBrandName}>{product.brands}</Text>
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
                      toggleFavorite(product);
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
        onPress={() => setCurrentScreen('home')}
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
