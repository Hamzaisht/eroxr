
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

/**
 * Normalizes a media source to ensure it has consistent structure
 */
export const normalizeMediaSource = (source: any): MediaSource => {
  if (!source) {
    return {
      url: '',
      type: MediaType.UNKNOWN
    };
  }
  
  // If it's already a string, create a proper MediaSource
  if (typeof source === 'string') {
    return {
      url: source,
      type: determineMediaType(source)
    };
  }
  
  // Extract the URL
  const url = extractMediaUrl(source);
  
  return {
    url: url || '',
    type: source.type || determineMediaType(source),
    thumbnail: source.thumbnail,
    poster: source.poster,
    duration: source.duration,
    width: source.width,
    height: source.height,
    watermark: source.watermark,
    creator_id: source.creator_id,
    content_type: source.content_type,
    media_url: source.media_url,
    video_url: source.video_url,
    thumbnail_url: source.thumbnail_url,
    path: source.path,
    post_id: source.post_id
  };
};

/**
 * Creates a unique file path for uploading
 */
export const createUniqueFilePath = (
  file: File,
  options: { folder?: string; userId?: string } = {}
): string => {
  const { folder = '', userId = '' } = options;
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 10);
  const extension = file.name.split('.').pop() || '';
  
  const basePath = folder ? `${folder}/` : '';
  const userPath = userId ? `${userId}/` : '';
  
  return `${basePath}${userPath}${timestamp}-${randomString}.${extension}`;
};
