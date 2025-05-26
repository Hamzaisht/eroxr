
/**
 * Calculates aspect ratio dimensions for media display
 */
export const calculateAspectRatioDimensions = (
  containerWidth: number,
  containerHeight: number,
  maxWidth: number,
  maxHeight: number
) => {
  const aspectRatio = containerWidth / containerHeight;
  
  let width = maxWidth;
  let height = maxWidth / aspectRatio;
  
  if (height > maxHeight) {
    height = maxHeight;
    width = maxHeight * aspectRatio;
  }
  
  return { width, height };
};

/**
 * Gets responsive dimensions based on container size
 */
export const getResponsiveDimensions = (
  originalWidth: number,
  originalHeight: number,
  containerWidth: number,
  containerHeight: number
) => {
  const aspectRatio = originalWidth / originalHeight;
  
  let width = containerWidth;
  let height = containerWidth / aspectRatio;
  
  if (height > containerHeight) {
    height = containerHeight;
    width = containerHeight * aspectRatio;
  }
  
  return { width, height };
};
