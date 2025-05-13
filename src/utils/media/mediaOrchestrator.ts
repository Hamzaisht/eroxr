
import { MediaSource, MediaType } from "./types";
import { getPlayableMediaUrl, extractMediaUrl } from "./urlUtils";
import { determineMediaType } from "./mediaUtils";

/**
 * MediaOrchestrator is responsible for managing and optimizing media loading
 * across the application to prevent performance issues when many media elements
 * are displayed simultaneously.
 */
class MediaOrchestrator {
  private mediaRegistry: Map<string, MediaSource | string>;
  private preloadQueue: string[];
  private isProcessingQueue: boolean;
  private maxConcurrentLoads: number;
  private activeLoads: number;

  constructor() {
    this.mediaRegistry = new Map();
    this.preloadQueue = [];
    this.isProcessingQueue = false;
    this.maxConcurrentLoads = 3; // Maximum concurrent media loads
    this.activeLoads = 0;
  }

  /**
   * Create a unique ID for a media source
   */
  createMediaId(source: MediaSource | string): string {
    if (!source) return '';
    
    let url = '';
    let type = '';
    
    if (typeof source === 'string') {
      url = source;
      type = determineMediaType(source).toString();
    } else {
      url = extractMediaUrl(source) || '';
      type = source.media_type?.toString() || determineMediaType(source).toString();
    }
    
    // Create a simple hash of the URL
    let hash = 0;
    for (let i = 0; i < url.length; i++) {
      hash = ((hash << 5) - hash) + url.charCodeAt(i);
      hash |= 0; // Convert to 32bit integer
    }
    
    return `${type}-${Math.abs(hash)}`.substring(0, 20);
  }

  /**
   * Register a media item for potential preloading
   */
  registerMediaRequest(source: MediaSource | string): void {
    if (!source) return;
    
    const mediaId = this.createMediaId(source);
    
    // If already registered, don't duplicate
    if (this.mediaRegistry.has(mediaId)) return;
    
    // Add to registry
    this.mediaRegistry.set(mediaId, source);
    
    // Add to preload queue, prioritizing videos
    let priority = 1;
    
    if (typeof source !== 'string' && source.media_type === MediaType.VIDEO) {
      priority = 0;
    } else if (typeof source !== 'string' && source.video_url) {
      priority = 0;
    }
    
    // Insert into queue based on priority
    if (priority === 0) {
      this.preloadQueue.unshift(mediaId);
    } else {
      this.preloadQueue.push(mediaId);
    }
    
    // Start processing if not already doing so
    if (!this.isProcessingQueue) {
      this.processPreloadQueue();
    }
  }

  /**
   * Process the preload queue, loading media items in sequence
   */
  private async processPreloadQueue(): Promise<void> {
    if (this.preloadQueue.length === 0) {
      this.isProcessingQueue = false;
      return;
    }

    this.isProcessingQueue = true;

    // Process as many items as allowed by maxConcurrentLoads
    while (this.preloadQueue.length > 0 && this.activeLoads < this.maxConcurrentLoads) {
      const mediaId = this.preloadQueue.shift();
      if (!mediaId) continue;

      this.activeLoads++;
      this.preloadMedia(mediaId)
        .finally(() => {
          this.activeLoads--;
          if (this.preloadQueue.length > 0) {
            this.processPreloadQueue();
          } else {
            this.isProcessingQueue = false;
          }
        });
    }
  }

  /**
   * Preload a specific media item
   */
  private async preloadMedia(mediaId: string): Promise<void> {
    const source = this.mediaRegistry.get(mediaId);
    if (!source) return;

    try {
      const url = typeof source === 'string' ? source : extractMediaUrl(source);
      if (!url) return;

      const playableUrl = getPlayableMediaUrl(url);
      if (!playableUrl) return;

      const mediaType = typeof source === 'string' 
        ? determineMediaType(source) 
        : (source.media_type as MediaType || determineMediaType(source));

      // Create appropriate element based on media type
      if (mediaType === MediaType.VIDEO) {
        const video = document.createElement('video');
        video.preload = 'metadata'; // Just load metadata, not the whole video
        video.src = playableUrl;
        video.muted = true;
        video.playsInline = true;
        
        // Wait for metadata to load, then stop loading
        await new Promise<void>((resolve) => {
          video.onloadedmetadata = () => {
            video.onloadedmetadata = null;
            video.src = '';
            resolve();
          };
          video.onerror = () => {
            console.error('Error preloading video:', playableUrl);
            resolve();
          };
          
          // Safety timeout
          setTimeout(resolve, 5000);
        });
      } else if (mediaType === MediaType.IMAGE || mediaType === MediaType.GIF) {
        // Preload image
        const img = new Image();
        await new Promise<void>((resolve) => {
          img.onload = () => resolve();
          img.onerror = () => {
            console.error('Error preloading image:', playableUrl);
            resolve();
          };
          img.src = playableUrl;
          
          // Safety timeout
          setTimeout(resolve, 5000);
        });
      }
    } catch (error) {
      console.error('Error during media preload:', error);
    }
  }
}

// Export a singleton instance for app-wide use
export const mediaOrchestrator = new MediaOrchestrator();
