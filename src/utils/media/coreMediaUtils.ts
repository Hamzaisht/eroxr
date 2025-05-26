
/**
 * Core media utilities - rebuilt from scratch
 */

export interface MediaItem {
  url: string;
  type: 'image' | 'video' | 'audio';
  thumbnail?: string;
}

/**
 * Simple, reliable URL validation
 */
export function isValidUrl(url: string | null | undefined): boolean {
  if (!url || typeof url !== 'string' || url.trim().length === 0) {
    return false;
  }
  
  try {
    const urlObj = new URL(url);
    return ['http:', 'https:', 'data:', 'blob:'].includes(urlObj.protocol);
  } catch {
    return false;
  }
}

/**
 * Determine media type from URL or filename
 */
export function getMediaType(url: string): 'image' | 'video' | 'audio' {
  const videoExts = /\.(mp4|webm|mov|avi|mkv|wmv|m4v|3gp|flv)($|\?)/i;
  const audioExts = /\.(mp3|wav|ogg|aac|flac|m4a)($|\?)/i;
  
  if (videoExts.test(url)) return 'video';
  if (audioExts.test(url)) return 'audio';
  return 'image';
}

/**
 * Process any media source into a standardized format
 */
export function processMediaSource(source: any): MediaItem | null {
  if (!source) return null;
  
  let url = '';
  
  // Handle different source formats
  if (typeof source === 'string') {
    url = source;
  } else if (typeof source === 'object') {
    url = source.url || source.media_url || source.video_url || source.src || '';
    
    // Handle arrays
    if (Array.isArray(url) && url.length > 0) {
      url = url[0];
    }
  }
  
  if (!isValidUrl(url)) return null;
  
  return {
    url,
    type: getMediaType(url),
    thumbnail: source?.thumbnail_url || source?.poster
  };
}

/**
 * Clean and optimize media URL
 */
export function cleanMediaUrl(url: string): string {
  if (!url) return '';
  
  // Remove multiple query parameters that might cause issues
  const cleanUrl = url.split('?')[0];
  
  // Add simple cache busting for Supabase URLs
  if (cleanUrl.includes('supabase.co')) {
    return `${cleanUrl}?v=${Date.now()}`;
  }
  
  return cleanUrl;
}
