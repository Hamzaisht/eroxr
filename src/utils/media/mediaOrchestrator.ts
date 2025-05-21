import { MediaType } from './types';
import { extractMediaUrl } from './mediaUtils';

/**
 * Media orchestrator configuration
 */
interface MediaOrchestratorConfig {
  defaultPlayerOptions?: Record<string, any>;
  defaultImageOptions?: Record<string, any>;
  enableCaching?: boolean;
  enableLazyLoading?: boolean;
  enableAnalytics?: boolean;
}

/**
 * Media item to be orchestrated
 */
interface MediaItem {
  id: string;
  url: string;
  type: MediaType;
  metadata?: Record<string, any>;
}

/**
 * Media cache entry
 */
interface MediaCacheEntry {
  item: MediaItem;
  loaded: boolean;
  error: boolean;
  timestamp: number;
}

/**
 * Helper function to validate media URLs
 */
export function isValidMediaUrl(url: string | undefined | null): boolean {
  return typeof url === 'string' && 
         url.startsWith('https://') && 
         !url.includes('undefined') && 
         !url.includes('null');
}

/**
 * Media orchestrator class for managing media across the application
 */
export class MediaOrchestrator {
  private config: MediaOrchestratorConfig;
  private mediaCache: Map<string, MediaCacheEntry>;
  private mediaTypes: Map<string, MediaType>;

  constructor(config: MediaOrchestratorConfig = {}) {
    this.config = {
      enableCaching: true,
      enableLazyLoading: true,
      enableAnalytics: false,
      ...config
    };
    
    this.mediaCache = new Map();
    this.mediaTypes = new Map();
    
    this.initializeMediaTypes();
  }

  /**
   * Initialize media type mappings
   */
  private initializeMediaTypes(): void {
    // Image extensions
    ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg', 'bmp'].forEach(ext => {
      this.mediaTypes.set(ext, MediaType.IMAGE);
    });
    
    // Video extensions
    ['mp4', 'webm', 'mov', 'avi', 'mkv'].forEach(ext => {
      this.mediaTypes.set(ext, MediaType.VIDEO);
    });
    
    // Audio extensions
    ['mp3', 'wav', 'ogg', 'aac', 'm4a'].forEach(ext => {
      this.mediaTypes.set(ext, MediaType.AUDIO);
    });
    
    // Document extensions
    ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].forEach(ext => {
      this.mediaTypes.set(ext, MediaType.DOCUMENT);
    });
  }

  /**
   * Register a media item
   */
  registerMedia(item: MediaItem): void {
    if (this.config.enableCaching) {
      this.mediaCache.set(item.id, {
        item,
        loaded: false,
        error: false,
        timestamp: Date.now()
      });
    }
    
    if (this.config.enableAnalytics) {
      this.trackMediaRegistration(item);
    }
  }

  /**
   * Preload a media item
   */
  async preloadMedia(id: string): Promise<boolean> {
    const entry = this.mediaCache.get(id);
    
    if (!entry) return false;
    
    try {
      if (entry.item.type === MediaType.IMAGE) {
        await this.preloadImage(entry.item.url);
      } else if (entry.item.type === MediaType.VIDEO) {
        await this.preloadVideo(entry.item.url);
      }
      
      this.mediaCache.set(id, {
        ...entry,
        loaded: true,
        error: false,
        timestamp: Date.now()
      });
      
      return true;
    } catch (error) {
      this.mediaCache.set(id, {
        ...entry,
        loaded: false,
        error: true,
        timestamp: Date.now()
      });
      
      console.error(`Failed to preload media ${id}:`, error);
      return false;
    }
  }

  /**
   * Preload an image
   */
  private preloadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
      
      img.src = url;
    });
  }

  /**
   * Preload a video
   */
  private preloadVideo(url: string): Promise<HTMLVideoElement> {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      
      video.onloadeddata = () => resolve(video);
      video.onerror = () => reject(new Error(`Failed to load video: ${url}`));
      
      video.preload = 'auto';
      video.src = url;
      video.load();
    });
  }

  /**
   * Get media type from URL
   */
  getMediaTypeFromUrl(url: string): MediaType {
    // Extract extension
    const extension = url.split('.').pop()?.toLowerCase();
    
    if (!extension) return MediaType.UNKNOWN;
    
    // Check if GIF
    if (extension === 'gif') return MediaType.GIF;
    
    // Return mapped type or unknown
    return this.mediaTypes.get(extension) || MediaType.UNKNOWN;
  }

  /**
   * Track media registration (for analytics)
   */
  private trackMediaRegistration(item: MediaItem): void {
    // Implement analytics tracking here
    console.log('Media registered:', item);
  }

  /**
   * Clear the media cache
   */
  clearCache(): void {
    this.mediaCache.clear();
  }

  /**
   * Remove expired items from cache
   */
  cleanupCache(maxAge: number = 30 * 60 * 1000): void {
    const now = Date.now();
    
    this.mediaCache.forEach((entry, id) => {
      if (now - entry.timestamp > maxAge) {
        this.mediaCache.delete(id);
      }
    });
  }

  /**
   * Get a media item by ID
   */
  getMediaById(id: string): MediaItem | null {
    const entry = this.mediaCache.get(id);
    return entry ? entry.item : null;
  }

  /**
   * Process a media source to normalize it
   */
  processMediaSource(source: any): MediaItem | null {
    if (!source) return null;
    
    const url = extractMediaUrl(source);
    
    // Validate URL
    if (!isValidMediaUrl(url)) return null;
    
    const id = source.id || `media-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const type = source.media_type || this.getMediaTypeFromUrl(url);
    
    return {
      id,
      url,
      type,
      metadata: source
    };
  }
}

// Create and export a singleton instance
export const mediaOrchestrator = new MediaOrchestrator();
