/**
 * Critical Image Optimization Utilities
 * Fixes 1-2 second media loading delays
 */

export interface ImageTransformOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'jpg' | 'png' | 'auto';
  resize?: 'fill' | 'contain' | 'cover';
}

/**
 * Generate optimized Supabase image URL with transformations
 * This dramatically reduces loading times by:
 * - Converting to WebP format (60-80% smaller)
 * - Resizing to appropriate dimensions
 * - Optimizing quality for bandwidth
 */
export const getOptimizedImageUrl = (
  path: string, 
  bucket: string = 'media',
  options: ImageTransformOptions = {}
): string => {
  if (!path) return '';
  
  // If it's already a full URL, return as is
  if (path.startsWith('http')) {
    return path;
  }
  
  const {
    width,
    height, 
    quality = 85,
    format = 'webp',
    resize = 'cover'
  } = options;
  
  // Clean the path
  const cleanPath = path.replace(/^\/+/, '');
  
  // Build transformation parameters
  const transforms = [];
  
  if (width || height) {
    const w = width || '';
    const h = height || '';
    transforms.push(`resize=${w}x${h}`);
  }
  
  if (quality !== 85) {
    transforms.push(`quality=${quality}`);
  }
  
  if (format !== 'auto') {
    transforms.push(`format=${format}`);
  }
  
  if (resize !== 'cover') {
    transforms.push(`fit=${resize}`);
  }
  
  // Supabase storage transformation URL
  const baseUrl = `https://ysqbdaeohlupucdmivkt.supabase.co/storage/v1/object/public/${bucket}/${cleanPath}`;
  
  if (transforms.length > 0) {
    return `${baseUrl}?${transforms.join('&')}`;
  }
  
  return baseUrl;
};

/**
 * Pre-defined optimization presets for different use cases
 */
export const IMAGE_PRESETS = {
  // Avatar images - small, fast loading
  avatar_small: { width: 40, height: 40, quality: 90, format: 'webp' as const },
  avatar_medium: { width: 80, height: 80, quality: 90, format: 'webp' as const },
  avatar_large: { width: 160, height: 160, quality: 95, format: 'webp' as const },
  
  // Post thumbnails - balance of quality and speed
  post_thumbnail: { width: 400, height: 300, quality: 85, format: 'webp' as const },
  post_preview: { width: 800, height: 600, quality: 90, format: 'webp' as const },
  
  // Full resolution for premium content
  post_full: { width: 1920, height: 1080, quality: 95, format: 'webp' as const },
  
  // Dating profile optimizations
  profile_card: { width: 300, height: 400, quality: 90, format: 'webp' as const },
  profile_hero: { width: 800, height: 1000, quality: 95, format: 'webp' as const },
  
  // Story thumbnails - very fast loading
  story_thumb: { width: 120, height: 120, quality: 80, format: 'webp' as const },
  
  // Banner images
  banner_small: { width: 800, height: 200, quality: 85, format: 'webp' as const },
  banner_large: { width: 1600, height: 400, quality: 90, format: 'webp' as const },
};

/**
 * Get optimized URL using preset
 */
export const getOptimizedUrl = (
  path: string,
  preset: keyof typeof IMAGE_PRESETS,
  bucket: string = 'media'
): string => {
  return getOptimizedImageUrl(path, bucket, IMAGE_PRESETS[preset]);
};

/**
 * Preload critical images for instant display
 */
export const preloadImages = (urls: string[]): Promise<void[]> => {
  return Promise.all(
    urls.map(url => 
      new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => reject(new Error(`Failed to load ${url}`));
        img.src = url;
      })
    )
  );
};

/**
 * Preload user avatars for instant display
 */
export const preloadUserAvatars = (userIds: string[]): void => {
  userIds.forEach(userId => {
    const avatarUrl = getOptimizedUrl(`avatars/${userId}`, 'avatar_medium', 'avatars');
    const img = new Image();
    img.src = avatarUrl;
  });
};

/**
 * Generate responsive image URLs for different screen sizes
 */
export const getResponsiveImageUrls = (
  path: string,
  bucket: string = 'media'
): { small: string; medium: string; large: string } => {
  return {
    small: getOptimizedImageUrl(path, bucket, { width: 400, quality: 80, format: 'webp' }),
    medium: getOptimizedImageUrl(path, bucket, { width: 800, quality: 85, format: 'webp' }),
    large: getOptimizedImageUrl(path, bucket, { width: 1600, quality: 90, format: 'webp' }),
  };
};

/**
 * Check if image format is supported for optimization
 */
export const supportsOptimization = (mimeType: string): boolean => {
  const supportedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  return supportedTypes.includes(mimeType.toLowerCase());
};

/**
 * Generate blur placeholder for smooth loading
 */
export const generateBlurPlaceholder = (width: number = 10, height: number = 10): string => {
  return `data:image/svg+xml;base64,${btoa(
    `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#4a5568;stop-opacity:0.3" />
          <stop offset="100%" style="stop-color:#2d3748;stop-opacity:0.5" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grad1)" />
    </svg>`
  )}`;
};