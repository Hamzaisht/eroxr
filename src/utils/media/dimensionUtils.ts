
/**
 * Calculate aspect ratio dimensions
 */
export function calculateAspectRatioDimensions(
  originalWidth: number, 
  originalHeight: number,
  targetWidth?: number,
  targetHeight?: number
): { width: number; height: number } {
  // If no target dimensions provided, return original dimensions
  if (!targetWidth && !targetHeight) {
    return { width: originalWidth, height: originalHeight };
  }
  
  // Calculate aspect ratio
  const aspectRatio = originalWidth / originalHeight;
  
  // If targetWidth is provided but not targetHeight
  if (targetWidth && !targetHeight) {
    return {
      width: targetWidth,
      height: Math.round(targetWidth / aspectRatio)
    };
  }
  
  // If targetHeight is provided but not targetWidth
  if (targetHeight && !targetWidth) {
    return {
      width: Math.round(targetHeight * aspectRatio),
      height: targetHeight
    };
  }
  
  // If both are provided, maintain aspect ratio within bounds
  if (targetWidth && targetHeight) {
    const targetRatio = targetWidth / targetHeight;
    
    if (aspectRatio > targetRatio) {
      // Width constrains
      return {
        width: targetWidth,
        height: Math.round(targetWidth / aspectRatio)
      };
    } else {
      // Height constrains
      return {
        width: Math.round(targetHeight * aspectRatio),
        height: targetHeight
      };
    }
  }
  
  // Fallback
  return { width: originalWidth, height: originalHeight };
}
