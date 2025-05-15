
/**
 * Enum for media types
 */
export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  DOCUMENT = 'document',
  UNKNOWN = 'unknown'
}

/**
 * Interface for media source object
 */
export interface MediaSource {
  url?: string;
  video_url?: string;
  media_url?: string;
  src?: string;
  media_type?: MediaType;
  video_urls?: string[];
  media_urls?: string[];
  thumbnail_url?: string;
  poster?: string;
  creator_id?: string;
  id?: string;
}

/**
 * Interface for media options used in various media components
 */
export interface MediaOptions {
  className?: string;
  autoPlay?: boolean;
  controls?: boolean;
  muted?: boolean;
  loop?: boolean;
  poster?: string;
  onClick?: () => void;
  onError?: () => void;
  onLoad?: () => void;
  onEnded?: () => void;
  onTimeUpdate?: (time: number) => void;
}

/**
 * Interface for upload options
 */
export interface UploadOptions {
  maxSizeInMB?: number;
  contentCategory?: string;
  onProgress?: (progress: number) => void;
  autoResetOnCompletion?: boolean;
  resetDelay?: number;
}

/**
 * Helper function to normalize any media source into a standard MediaSource object
 */
export function normalizeMediaSource(source: any): MediaSource {
  if (!source) return {};

  // If it's already a string, assume it's a direct URL
  if (typeof source === "string") {
    // Try to infer media type from extension
    let mediaType = MediaType.UNKNOWN;
    const extension = source.split('.').pop()?.toLowerCase();
    
    if (extension) {
      if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'].includes(extension)) {
        mediaType = MediaType.IMAGE;
      } else if (['mp4', 'webm', 'mov', 'avi', 'mkv'].includes(extension)) {
        mediaType = MediaType.VIDEO;
      } else if (['mp3', 'wav', 'ogg', 'aac', 'm4a'].includes(extension)) {
        mediaType = MediaType.AUDIO;
      }
    }
    
    return {
      url: source,
      media_type: mediaType
    };
  }

  // If it's a MediaSource-like object, normalize it
  const mediaSource: MediaSource = { ...source };
  
  // Ensure there's a url property (required by MediaRenderer)
  if (!mediaSource.url) {
    if (mediaSource.video_url) {
      mediaSource.url = mediaSource.video_url;
      mediaSource.media_type = MediaType.VIDEO;
    } else if (mediaSource.media_url) {
      mediaSource.url = mediaSource.media_url;
      // Infer type from extension if not provided
      if (!mediaSource.media_type) {
        const ext = mediaSource.media_url.split('.').pop()?.toLowerCase();
        if (ext && ['mp4', 'webm', 'mov', 'avi', 'mkv'].includes(ext)) {
          mediaSource.media_type = MediaType.VIDEO;
        } else {
          mediaSource.media_type = MediaType.IMAGE;
        }
      }
    }
  }

  return mediaSource;
}
