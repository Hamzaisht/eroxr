
import { MediaSource } from './types';
import { extractMediaUrl } from './mediaUtils';

/**
 * Get a playable media URL from a source URL
 * This handles various transformations needed for different media sources
 */
export function getPlayableMediaUrl(url: string): string {
  if (!url) return '';
  
  // Handle special cases for various media hosting services
  
  // YouTube
  if (url.includes('youtube.com/watch') || url.includes('youtu.be/')) {
    const videoId = url.includes('youtu.be/') 
      ? url.split('youtu.be/')[1].split('?')[0]
      : url.includes('v=') 
        ? url.split('v=')[1].split('&')[0]
        : '';
    
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1&rel=0`;
    }
  }
  
  // Vimeo
  if (url.includes('vimeo.com/')) {
    const videoId = url.split('vimeo.com/')[1].split('?')[0];
    if (videoId) {
      return `https://player.vimeo.com/video/${videoId}?autoplay=1`;
    }
  }
  
  // For standard URLs, just return the URL as is
  return url;
}

/**
 * Process a MediaSource to get a playable URL
 */
export function getPlayableMediaUrlFromSource(source: string | MediaSource): string {
  const url = extractMediaUrl(source);
  if (!url) return '';
  
  return getPlayableMediaUrl(url);
}

/**
 * Get a thumbnail URL for a video
 */
export function getVideoThumbnailUrl(videoUrl: string): string | null {
  if (!videoUrl) return null;
  
  // YouTube thumbnail
  if (videoUrl.includes('youtube.com/watch') || videoUrl.includes('youtu.be/')) {
    const videoId = videoUrl.includes('youtu.be/') 
      ? videoUrl.split('youtu.be/')[1].split('?')[0]
      : videoUrl.includes('v=') 
        ? videoUrl.split('v=')[1].split('&')[0]
        : '';
    
    if (videoId) {
      return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    }
  }
  
  // For other videos, we don't have a reliable way to get thumbnails
  return null;
}
