
/**
 * Gets CSS styles for enlarged image display
 */
export const getEnlargedImageStyles = (): React.CSSProperties => {
  return {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain',
    margin: '0 auto',
  };
};

/**
 * Generates a srcset attribute for responsive images
 */
export const generateSrcSet = (url: string): string => {
  // If URL has query parameters, add width to them
  const hasParams = url.includes('?');
  
  return [
    `${url}${hasParams ? '&' : '?'}width=800 800w`,
    `${url}${hasParams ? '&' : '?'}width=1200 1200w`,
    `${url}${hasParams ? '&' : '?'}width=1600 1600w`,
  ].join(', ');
};

/**
 * Gets responsive sizes attribute for images
 */
export const getResponsiveSizes = (): string => {
  return '(max-width: 768px) 95vw, (max-width: 1200px) 80vw, 70vw';
};
