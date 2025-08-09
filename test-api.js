#!/usr/bin/env node

// Simple test script to verify Open Food Facts API connectivity
const testBarcodes = [
  '3017620422003', // Nutella - should work
  '7622210717283', // Toblerone - should work  
  '0041196003314', // Coca Cola - should work
  '1234567890123', // Fake barcode - should fail
];

async function testAPI() {
  console.log('🧪 Testing Open Food Facts API...\n');
  
  for (const barcode of testBarcodes) {
    console.log(`🔍 Testing barcode: ${barcode}`);
    
    try {
      const url = `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`;
      console.log(`📡 Fetching: ${url}`);
      
      const response = await fetch(url);
      console.log(`📥 HTTP Status: ${response.status}`);
      
      if (!response.ok) {
        console.log(`❌ HTTP Error: ${response.status} ${response.statusText}\n`);
        continue;
      }
      
      const data = await response.json();
      
      if (data.status === 1 && data.product) {
        console.log(`✅ Product found: ${data.product.product_name || 'Unknown'}`);
        console.log(`🏷️ Brand: ${data.product.brands || 'Unknown'}`);
        console.log(`📝 Ingredients: ${data.product.ingredients_text ? 'Available' : 'Missing'}`);
        if (data.product.ingredients_text) {
          console.log(`📄 Sample: ${data.product.ingredients_text.substring(0, 100)}...`);
        }
      } else {
        console.log(`❌ Product not found (status: ${data.status})`);
      }
      
    } catch (error) {
      console.log(`❌ Network Error: ${error.message}`);
    }
    
    console.log(''); // Empty line for spacing
  }
  
  console.log('🏁 API test completed!');
}

// Run the test
testAPI().catch(console.error);
