import { MediaType } from '@/types/media';

export interface MediaItem {
  url: string;
  type: 'image' | 'video' | 'audio';
  thumbnail?: string;
}

export const processMediaSource = (source: any): MediaItem | null => {
  if (!source) return null;
  
  let url: string | null = null;
  
  // Extract URL from various source formats
  if (typeof source === 'string') {
    url = source;
  } else if (source.url) {
    url = source.url;
  } else if (source.media_url) {
    url = Array.isArray(source.media_url) ? source.media_url[0] : source.media_url;
  } else if (source.video_url) {
    url = source.video_url;
  }
  
  if (!url) return null;
  
  // Determine media type from URL
  const extension = url.split('.').pop()?.toLowerCase() || '';
  let type: 'image' | 'video' | 'audio' = 'image';
  
  if (['mp4', 'webm', 'mov', 'avi'].includes(extension)) {
    type = 'video';
  } else if (['mp3', 'wav', 'ogg'].includes(extension)) {
    type = 'audio';
  }
  
  return {
    url,
    type,
    thumbnail: source.thumbnail
  };
};

export const cleanMediaUrl = (url: string): string => {
  if (!url) return '';
  
  // Remove any query parameters that might cause issues
  try {
    const urlObj = new URL(url);
    // Keep essential parameters, remove problematic ones
    urlObj.searchParams.delete('token');
    return urlObj.toString();
  } catch {
    return url;
  }
};
