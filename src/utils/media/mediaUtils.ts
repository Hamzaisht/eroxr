
import { MediaType, MediaSource } from '@/types/media';

export const determineMediaType = (source: any): MediaType => {
  if (!source) return MediaType.UNKNOWN;
  
  // If source has explicit type
  if (source.type) return source.type;
  
  // Extract URL to check extension
  const url = extractMediaUrl(source);
  if (!url) return MediaType.UNKNOWN;
  
  const extension = url.split('.').pop()?.toLowerCase() || '';
  
  // Video extensions
  if (['mp4', 'webm', 'mov', 'avi', 'mkv'].includes(extension)) {
    return MediaType.VIDEO;
  }
  
  // Image extensions
  if (['jpg', 'jpeg', 'png', 'webp', 'bmp'].includes(extension)) {
    return MediaType.IMAGE;
  }
  
  // GIF extension
  if (extension === 'gif') {
    return MediaType.GIF;
  }
  
  // Audio extensions
  if (['mp3', 'wav', 'ogg', 'aac'].includes(extension)) {
    return MediaType.AUDIO;
  }
  
  // Document extensions
  if (['pdf', 'doc', 'docx', 'txt'].includes(extension)) {
    return MediaType.DOCUMENT;
  }
  
  return MediaType.UNKNOWN;
};

export const extractMediaUrl = (source: any): string | null => {
  if (!source) return null;
  
  // If source is already a string URL
  if (typeof source === 'string') return source;
  
  // Check common URL properties
  if (source.url) return source.url;
  if (source.media_url) {
    if (Array.isArray(source.media_url)) {
      return source.media_url[0] || null;
    }
    return source.media_url;
  }
  if (source.video_url) return source.video_url;
  if (source.src) return source.src;
  
  return null;
};

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
