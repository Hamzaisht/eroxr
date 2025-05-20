
import { v4 as uuidv4 } from 'uuid';
import { MediaType, MediaSource } from '@/types/media';

/**
 * Creates a unique file path for upload
 * @param userId The user ID for the upload
 * @param file The file to create a path for
 * @param prefix Optional prefix for the path
 * @returns A unique path string
 */
export const createUniqueFilePath = (userId: string, file: File, prefix: string = ''): string => {
  // Get file extension
  const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';

  // Create a UUID-based filename
  const uniqueId = uuidv4();
  const timestamp = Date.now();
  
  // Construct path with user ID, optional prefix, timestamp, and uuid
  const path = prefix 
    ? `${userId}/${prefix}/${timestamp}_${uniqueId}.${fileExtension}` 
    : `${userId}/${timestamp}_${uniqueId}.${fileExtension}`;
    
  return path;
};

/**
 * Determines the type of media from a URL or file extension
 * @param url Media URL or file path
 * @returns The detected MediaType
 */
export const determineMediaType = (url: string): MediaType => {
  const lowercaseUrl = url.toLowerCase();
  
  if (/\.(jpg|jpeg|png|webp)($|\?)/.test(lowercaseUrl)) {
    return MediaType.IMAGE;
  } else if (/\.(mp4|webm|mov|avi)($|\?)/.test(lowercaseUrl)) {
    return MediaType.VIDEO;
  } else if (/\.(mp3|wav|ogg|m4a)($|\?)/.test(lowercaseUrl)) {
    return MediaType.AUDIO;
  } else if (/\.(gif)($|\?)/.test(lowercaseUrl)) {
    return MediaType.GIF;
  } else if (/\.(pdf|doc|docx|xls|xlsx|ppt|pptx|txt)($|\?)/.test(lowercaseUrl)) {
    return MediaType.DOCUMENT;
  }
  
  return MediaType.UNKNOWN;
};

/**
 * Extracts a clean URL from various media source formats
 * @param media The media source (string URL or MediaSource object)
 * @returns The extracted URL string
 */
export const extractMediaUrl = (media: string | MediaSource): string => {
  if (!media) return '';
  
  if (typeof media === 'string') {
    return media;
  }
  
  if ('url' in media) {
    return media.url;
  }
  
  if ('media_url' in (media as any)) {
    return (media as any).media_url;
  }
  
  if ('video_url' in (media as any)) {
    return (media as any).video_url;
  }
  
  return '';
};

/**
 * Normalizes different media source formats into a standard MediaSource object
 * @param source The input media source (string URL or object with media properties)
 * @returns A standardized MediaSource object
 */
export const normalizeMediaSource = (source: string | any): MediaSource => {
  if (!source) {
    return { url: '', type: MediaType.UNKNOWN };
  }
  
  if (typeof source === 'string') {
    return {
      url: source,
      type: determineMediaType(source)
    };
  }
  
  // Handle various object formats
  const url = source.url || source.media_url || source.video_url || '';
  const type = source.type || source.media_type || determineMediaType(url);
  const creator_id = source.creator_id || source.user_id || undefined;
  
  return {
    url,
    type,
    creator_id,
    metadata: source.metadata || undefined
  };
};

/**
 * Converts a file to a base64 data URL
 * @param file The file to convert
 * @returns A promise that resolves to the data URL
 */
export const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Creates a URL for previewing a file
 * @param file The file to create a preview for
 * @returns A blob URL for the file
 */
export const createFilePreview = (file: File): string => {
  return URL.createObjectURL(file);
};

/**
 * Revokes a previously created file preview URL
 * @param url The URL to revoke
 */
export const revokeFilePreview = (url: string): void => {
  if (url && url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
};

/**
 * Gets a file's MIME type
 * @param file The file
 * @returns The MIME type string
 */
export const getFileMimeType = (file: File): string => {
  return file.type;
};

/**
 * Run a comprehensive diagnostic on a file object
 * This helps identify issues with file objects that may cause upload failures
 */
export const runFileDiagnostic = (file: File): { valid: boolean, error?: string } => {
  if (!file) {
    console.warn('FILE DIAGNOSTIC: File is null or undefined');
    return { valid: false, error: 'File is null or undefined' };
  }
  
  if (!(file instanceof File)) {
    console.warn('FILE DIAGNOSTIC: Not a File instance');
    return { valid: false, error: 'Not a valid File instance' };
  }
  
  if (file.size === 0) {
    console.warn('FILE DIAGNOSTIC: File has zero size');
    return { valid: false, error: 'File has zero size' };
  }
  
  // Log diagnostic info for debugging
  console.log('FILE DIAGNOSTIC:', {
    isFile: file instanceof File,
    name: file.name,
    size: file.size,
    type: file.type,
    lastModified: new Date(file.lastModified).toISOString()
  });
  
  return { valid: true };
};
