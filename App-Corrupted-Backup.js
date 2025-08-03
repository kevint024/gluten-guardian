import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  // 🔍 API Search Function with FREE alternatives
  const searchRecipes = async () => {
    if (!searchQuery.trim()) {
      Alert.alert('Please enter a search term');
      return;
    }

    setLoading(true);
    setRecipes([]);
    
    console.log('🔍 Starting recipe search for:', searchQuery);
    console.log('📊 Using FREE recipe APIs only!');

    try {
      // 🥗 TRY API #1: RecipeDB (1000+ free recipes)
      console.log('🥗 Trying RecipeDB API...');
      const recipeDbUrl = `https://recipedb.spoonacular.com/recipes/search?query=${encodeURIComponent(searchQuery)}&number=20`;
      console.log('📡 RecipeDB Request URL:', recipeDbUrl);
      
      const recipeDbResponse = await fetch(recipeDbUrl);
      console.log('📈 RecipeDB Response Status:', recipeDbResponse.status);
      
      if (recipeDbResponse.ok) {
        const recipeDbData = await recipeDbResponse.json();
        console.log('✅ RecipeDB Success! Found recipes:', recipeDbData.results?.length || 0);
        
        if (recipeDbData.results && recipeDbData.results.length > 0) {
          const formattedRecipes = recipeDbData.results.map(recipe => ({
            id: recipe.id,
            title: recipe.title,
            image: recipe.image,
            readyInMinutes: recipe.readyInMinutes,
            servings: recipe.servings,
            source: 'RecipeDB',
            sourceEmoji: '🥗'
          }));
          
          setRecipes(formattedRecipes);
          setLoading(false);
          console.log('🎉 RecipeDB search completed successfully!');
          return;
        }
      }

      // 🍳 TRY API #2: Tasty API (4000+ free recipes)
      console.log('🍳 Trying Tasty API...');
      const tastyUrl = `https://tasty.p.rapidapi.com/recipes/list?from=0&size=20&q=${encodeURIComponent(searchQuery)}`;
      console.log('📡 Tasty Request URL:', tastyUrl);
      
      const tastyResponse = await fetch(tastyUrl, {
        headers: {
          'X-RapidAPI-Key': 'your-rapidapi-key-here', // Free tier available
          'X-RapidAPI-Host': 'tasty.p.rapidapi.com'
        }
      });
      console.log('📈 Tasty Response Status:', tastyResponse.status);
      
      if (tastyResponse.ok) {
        const tastyData = await tastyResponse.json();
        console.log('✅ Tasty Success! Found recipes:', tastyData.results?.length || 0);
        
        if (tastyData.results && tastyData.results.length > 0) {
          const formattedRecipes = tastyData.results.map(recipe => ({
            id: recipe.id,
            title: recipe.name,
            image: recipe.thumbnail_url,
            readyInMinutes: recipe.cook_time_minutes,
            servings: recipe.num_servings,
            source: 'Tasty',
            sourceEmoji: '🍳'
          }));
          
          setRecipes(formattedRecipes);
          setLoading(false);
          console.log('🎉 Tasty search completed successfully!');
          return;
        }
      }

      // 🥘 TRY API #3: TheMealDB (300+ curated recipes)
      console.log('🥘 Trying TheMealDB API...');
      const mealDbUrl = `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(searchQuery)}`;
      console.log('📡 TheMealDB Request URL:', mealDbUrl);
      
      const mealDbResponse = await fetch(mealDbUrl);
      console.log('📈 TheMealDB Response Status:', mealDbResponse.status);
      
      if (mealDbResponse.ok) {
        const mealDbData = await mealDbResponse.json();
        console.log('✅ TheMealDB Success! Found recipes:', mealDbData.meals?.length || 0);
        
        if (mealDbData.meals && mealDbData.meals.length > 0) {
          const formattedRecipes = mealDbData.meals.map(recipe => ({
            id: recipe.idMeal,
            title: recipe.strMeal,
            image: recipe.strMealThumb,
            readyInMinutes: 30, // Default time
            servings: 4, // Default servings
            source: 'TheMealDB',
            sourceEmoji: '🥘',
            instructions: recipe.strInstructions
          }));
          
          setRecipes(formattedRecipes);
          setLoading(false);
          console.log('🎉 TheMealDB search completed successfully!');
          return;
        }
      }

      // 🍲 OPTIONAL: Edamam Recipe API ($9/month - good value)
      console.log('🍲 All free APIs exhausted. Consider Edamam for $9/month...');
      
      setLoading(false);
      Alert.alert(
        'No Recipes Found',
        'Try a different search term or check your internet connection.',
        [{ text: 'OK' }]
      );
      console.log('❌ No recipes found from any free API');
      
    } catch (error) {
      console.error('💥 Recipe search error:', error);
      setLoading(false);
      Alert.alert('Error', 'Failed to search recipes. Please try again.');
    }
  };

  // 📱 Recipe Card Component
  const RecipeCard = ({ item }) => (
    <TouchableOpacity
      style={styles.recipeCard}
      onPress={() => setSelectedRecipe(item)}
    >
      <Image source={{ uri: item.image }} style={styles.recipeImage} />
      <View style={styles.recipeInfo}>
        <Text style={styles.recipeTitle}>{item.title}</Text>
        <Text style={styles.recipeSource}>
          {item.sourceEmoji} {item.source}
        </Text>
        <View style={styles.recipeStats}>
          <Text style={styles.statText}>⏱️ {item.readyInMinutes} min</Text>
          <Text style={styles.statText}>🍽️ {item.servings} servings</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  // 📄 Recipe Detail Modal Component
  const RecipeDetail = () => (
    <View style={styles.modal}>
      <ScrollView style={styles.modalContent}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => setSelectedRecipe(null)}
        >
          <Text style={styles.closeButtonText}>✕ Close</Text>
        </TouchableOpacity>
        
        <Image source={{ uri: selectedRecipe.image }} style={styles.detailImage} />
        <Text style={styles.detailTitle}>{selectedRecipe.title}</Text>
        <Text style={styles.detailSource}>
          {selectedRecipe.sourceEmoji} From {selectedRecipe.source}
        </Text>
        
        <View style={styles.detailStats}>
          <Text style={styles.detailStat}>⏱️ {selectedRecipe.readyInMinutes} minutes</Text>
          <Text style={styles.detailStat}>🍽️ {selectedRecipe.servings} servings</Text>
        </View>
        
        {selectedRecipe.instructions && (
          <View style={styles.instructionsSection}>
            <Text style={styles.instructionsTitle}>📝 Instructions:</Text>
            <Text style={styles.instructionsText}>{selectedRecipe.instructions}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🛡️ Gluten Guardian</Text>
        <Text style={styles.subtitle}>Free Recipe Search</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for gluten-free recipes..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={searchRecipes}
        />
        <TouchableOpacity style={styles.searchButton} onPress={searchRecipes}>
          <Text style={styles.searchButtonText}>🔍 Search</Text>
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Searching free recipe APIs...</Text>
        </View>
      )}

      <FlatList
        data={recipes}
        renderItem={({ item }) => <RecipeCard item={item} />}
        keyExtractor={(item) => item.id.toString()}
        style={styles.recipeList}
        showsVerticalScrollIndicator={false}
      />

      {selectedRecipe && <RecipeDetail />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#4CAF50',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: 'white',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginRight: 10,
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  searchButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  recipeList: {
    flex: 1,
    padding: 15,
  },
  recipeCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  recipeImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  recipeInfo: {
    padding: 15,
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  recipeSource: {
    fontSize: 14,
    color: '#4CAF50',
    marginBottom: 8,
  },
  recipeStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statText: {
    fontSize: 14,
    color: '#666',
  },
  modal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 12,
    maxHeight: '80%',
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 15,
  },
  closeButtonText: {
    fontSize: 18,
    color: '#666',
  },
  detailImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  detailTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    padding: 15,
    paddingBottom: 5,
  },
  detailSource: {
    fontSize: 16,
    color: '#4CAF50',
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  detailStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
    marginHorizontal: 15,
  },
  detailStat: {
    fontSize: 16,
    color: '#666',
  },
  instructionsSection: {
    padding: 15,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  instructionsText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
});
