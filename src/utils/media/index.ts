
// Basic media type definitions only
export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  UNKNOWN = 'unknown'
}

export interface BasicMediaItem {
  url: string;
  type: MediaType;
}

// Simple URL validation
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Basic media type detection from URL
export const getMediaTypeFromUrl = (url: string): MediaType => {
  if (!url) return MediaType.UNKNOWN;
  
  const extension = url.split('.').pop()?.toLowerCase() || '';
  
  if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(extension)) {
    return MediaType.IMAGE;
  }
  
  if (['mp4', 'webm', 'mov'].includes(extension)) {
    return MediaType.VIDEO;
  }
  
  if (['mp3', 'wav', 'ogg'].includes(extension)) {
    return MediaType.AUDIO;
  }
  
  return MediaType.UNKNOWN;
};
