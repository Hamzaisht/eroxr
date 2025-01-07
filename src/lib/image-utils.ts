export const getImageStyles = (minWidth?: number, minHeight?: number) => ({
  imageRendering: "high-quality" as const,
  minWidth: minWidth ? `${minWidth}px` : undefined,
  minHeight: minHeight ? `${minHeight}px` : undefined,
  objectFit: "cover" as const,
  quality: 100,
  loading: "eager" as const,
});

export const getEnlargedImageStyles = () => ({
  imageRendering: "high-quality" as const,
  maxWidth: "95vw",
  maxHeight: "95vh",
  quality: 100,
  loading: "eager" as const,
});

// Helper function to generate srcSet for responsive images
export const generateSrcSet = (url: string) => {
  if (!url) return undefined;
  
  // Define widths for different screen sizes
  const widths = [640, 750, 828, 1080, 1200, 1920, 2048, 3840];
  
  // Generate srcSet string
  return widths
    .map((w) => {
      // Add width parameter to URL
      const srcUrl = new URL(url);
      srcUrl.searchParams.set('width', w.toString());
      srcUrl.searchParams.set('quality', '100');
      return `${srcUrl.toString()} ${w}w`;
    })
    .join(', ');
};

// Helper to get optimal sizes attribute
export const getResponsiveSizes = () => {
  return "(max-width: 640px) 100vw, (max-width: 1080px) 75vw, 50vw";
};