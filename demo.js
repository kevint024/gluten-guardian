// Demo script to test ingredient analysis logic
// Run this with: node demo.js

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

// Analyze ingredients for gluten content
function analyzeIngredients(ingredients) {
  if (!ingredients || typeof ingredients !== 'string') {
    return {
      status: 'error',
      message: 'No ingredients provided',
      flaggedIngredients: []
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
}

// Test cases
const testCases = [
  {
    name: "Unsafe - Bread",
    ingredients: "wheat flour, yeast, salt, sugar, vegetable oil"
  },
  {
    name: "Safe - Rice Cake", 
    ingredients: "brown rice, salt"
  },
  {
    name: "Caution - Soy Sauce",
    ingredients: "water, soybeans, salt, natural flavoring"
  },
  {
    name: "Unsafe - Cereal",
    ingredients: "whole wheat, barley malt, sugar, vitamins"
  },
  {
    name: "Safe - Fresh Fruit",
    ingredients: "apples"
  }
];

console.log("🛡️ Gluten Guardian - Ingredient Analysis Demo\n");

testCases.forEach((testCase, index) => {
  console.log(`Test ${index + 1}: ${testCase.name}`);
  console.log(`Ingredients: ${testCase.ingredients}`);
  
  const result = analyzeIngredients(testCase.ingredients);
  
  let statusIcon;
  switch(result.status) {
    case 'safe': statusIcon = '✅'; break;
    case 'caution': statusIcon = '⚠️'; break;
    case 'unsafe': statusIcon = '❌'; break;
    default: statusIcon = '❓';
  }
  
  console.log(`Result: ${statusIcon} ${result.status.toUpperCase()} - ${result.message}`);
  
  if (result.flaggedIngredients.length > 0) {
    console.log(`Gluten ingredients found: ${result.flaggedIngredients.join(', ')}`);
  }
  
  if (result.ambiguousIngredients.length > 0) {
    console.log(`Ambiguous ingredients: ${result.ambiguousIngredients.join(', ')}`);
  }
  
  console.log("-".repeat(50));
});

console.log("\n✨ Demo completed! This shows how the Gluten Guardian app analyzes ingredients.");
console.log("📱 Install the full app to scan barcodes and get real product data!");
