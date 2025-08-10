/**
 * Canvas Performance Fix for QuaggaJS
 * Fixes: Canvas2D: Multiple readback operations using getImageData are faster with the willReadFrequently attribute
 */

// Create a script to inject canvas optimization
const canvasOptimizationScript = `
// Canvas performance optimization for QuaggaJS
(function() {
  // Override Canvas 2D context creation to add willReadFrequently
  const originalGetContext = HTMLCanvasElement.prototype.getContext;
  
  HTMLCanvasElement.prototype.getContext = function(contextType, contextAttributes) {
    if (contextType === '2d') {
      const optimizedAttributes = {
        ...contextAttributes,
        willReadFrequently: true,
        alpha: false,
        desynchronized: true
      };
      
      console.log('🎨 Canvas optimized for frequent reads');
      return originalGetContext.call(this, contextType, optimizedAttributes);
    }
    
    return originalGetContext.call(this, contextType, contextAttributes);
  };
  
  console.log('✅ Canvas performance optimization loaded');
})();
`;

export default canvasOptimizationScript;
