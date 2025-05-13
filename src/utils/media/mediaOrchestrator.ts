
import { MediaType, MediaSource } from './types';
import { determineMediaType, extractMediaUrl } from './mediaUtils';
import { getFileExtension } from './mediaUrlUtils';

// Global request and response cache
interface MediaRequest {
  id: string;
  url: string | null;
  timestamp: number;
  status: 'pending' | 'loading' | 'success' | 'error';
  type: MediaType;
  retries: number;
  priority: number;
  requestCount: number;
  loadPromise?: Promise<void>;
}

// Stable media cache to prevent unnecessary re-renders
class MediaOrchestrator {
  private requestMap = new Map<string, MediaRequest>();
  private stableUrlCache = new Map<string, string>();
  private processingQueue: string[] = [];
  private isProcessing = false;
  private maxConcurrent = 4;
  private activeRequests = 0;
  private preloadTimeouts = new Map<string, NodeJS.Timeout>();
  
  // Debug mode can be enabled to troubleshoot issues
  private debug = false;
  
  constructor() {
    if (typeof window !== 'undefined') {
      // Add debug controls to window object in development
      if (process.env.NODE_ENV === 'development') {
        (window as any).__MEDIA_DEBUG__ = {
          enableDebug: () => { this.debug = true; console.log('Media debug mode enabled'); },
          disableDebug: () => { this.debug = false; console.log('Media debug mode disabled'); },
          getRequestMap: () => Array.from(this.requestMap.entries()),
          getUrlCache: () => Array.from(this.stableUrlCache.entries()),
          clearCache: () => this.clearCache(),
          forceCompleteAll: () => this.forceCompleteAllRequests()
        };
      }
    }
  }

  // Force complete all pending requests (useful for debugging)
  private forceCompleteAllRequests() {
    console.log('Forcing completion of all media requests');
    this.requestMap.forEach((request) => {
      if (request.status === 'pending' || request.status === 'loading') {
        request.status = 'success';
        // Clear any existing timeouts
        if (this.preloadTimeouts.has(request.id)) {
          clearTimeout(this.preloadTimeouts.get(request.id)!);
          this.preloadTimeouts.delete(request.id);
        }
      }
    });
    // Clear processing queue and reset active requests
    this.processingQueue = [];
    this.activeRequests = 0;
    this.isProcessing = false;
  }

  // Create a stable unique ID for a media source
  public createMediaId(source: string | MediaSource | null | undefined): string {
    if (!source) return 'null-source';
    
    if (typeof source === 'string') {
      return this.hashString(source);
    }
    
    // Extract the primary URL from the source
    const primaryUrl = source.video_url || 
                      source.media_url || 
                      source.url || 
                      source.src ||
                      (source.video_urls && source.video_urls.length > 0 ? source.video_urls[0] : '') ||
                      (source.media_urls && source.media_urls.length > 0 ? source.media_urls[0] : '');
    
    const creatorId = source.creator_id || '';
    
    // For object sources, make sure to check if media_type exists before using it
    let mediaType: MediaType = MediaType.UNKNOWN;
    if (typeof source.media_type === 'string') {
      mediaType = source.media_type as MediaType;
    } else if (source.video_url) {
      mediaType = MediaType.VIDEO;
    } else {
      mediaType = MediaType.IMAGE;
    }
    
    // Create a composite key
    const compositeKey = `${primaryUrl}|${creatorId}|${mediaType}`;
    return this.hashString(compositeKey);
  }
  
  // Simple string hash function for creating stable IDs
  private hashString(str: string): string {
    if (!str) return 'empty-string';
    
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(36);
  }
  
  // Get a stable, cacheable URL for a media source
  public getStableUrl(source: string | MediaSource | null | undefined, cacheBuster = true): string | null {
    if (!source) return null;
    
    const mediaId = this.createMediaId(source);
    
    // Check if we already have a stable URL
    if (this.stableUrlCache.has(mediaId)) {
      return this.stableUrlCache.get(mediaId) || null;
    }
    
    let url: string | null = null;
    
    // Extract the URL from the source
    if (typeof source === 'string') {
      url = source;
    } else {
      url = extractMediaUrl(source);
    }
    
    if (!url) return null;
    
    // Process the URL
    let processedUrl = url;
    
    // Add protocol if missing
    if (processedUrl.startsWith('//')) {
      processedUrl = `https:${processedUrl}`;
    }
    
    if (!processedUrl.startsWith('http') && !processedUrl.startsWith('blob:') && !processedUrl.startsWith('data:')) {
      processedUrl = `https://${processedUrl}`;
    }
    
    // Add cache busting if requested
    if (cacheBuster) {
      // Use a stable cache buster based on the URL content and hourly timestamp
      const hourTimestamp = Math.floor(Date.now() / 3600000); // Changes only once per hour
      const contentHash = this.hashString(url);
      
      const separator = processedUrl.includes('?') ? '&' : '?';
      processedUrl = `${processedUrl}${separator}cb=${hourTimestamp}-${contentHash}`;
    }
    
    // Store in cache
    this.stableUrlCache.set(mediaId, processedUrl);
    
    return processedUrl;
  }
  
  // Register a media request and prioritize its loading
  public registerMediaRequest(source: string | MediaSource | null | undefined): MediaRequest | null {
    if (!source) return null;
    
    const mediaId = this.createMediaId(source);
    const url = this.getStableUrl(source);
    
    // Determine media type based on source type
    let type: MediaType = MediaType.UNKNOWN;
    
    if (typeof source === 'string') {
      // For string sources, determine type from the URL
      if (source.match(/\.(mp4|webm|ogv|mov)($|\?)/i)) {
        type = MediaType.VIDEO;
      } else if (source.match(/\.(jpg|jpeg|png|webp|gif)($|\?)/i)) {
        type = MediaType.IMAGE;
      } else {
        type = MediaType.UNKNOWN;
      }
    } else {
      // For object sources, use the media_type property if available
      if (source.media_type) {
        type = source.media_type as MediaType;
      } else if (source.video_url) {
        type = MediaType.VIDEO;
      } else {
        type = MediaType.IMAGE;
      }
    }
    
    // Check if request already exists
    if (this.requestMap.has(mediaId)) {
      const existingRequest = this.requestMap.get(mediaId)!;
      // Increment request count to indicate priority
      existingRequest.requestCount++;
      
      // Update the request timestamp to reprioritize it
      existingRequest.timestamp = Date.now();
      
      return existingRequest;
    }
    
    // Create a new request
    const newRequest: MediaRequest = {
      id: mediaId,
      url,
      timestamp: Date.now(),
      status: 'pending',
      type,
      retries: 0,
      priority: 0,
      requestCount: 1
    };
    
    // Store the request
    this.requestMap.set(mediaId, newRequest);
    
    // Add to processing queue with priority
    this.addToProcessingQueue(mediaId);
    
    // Start processing if not already
    if (!this.isProcessing) {
      this.processQueue();
    }
    
    return newRequest;
  }
  
  // Add a media request to the processing queue with priority
  private addToProcessingQueue(mediaId: string) {
    // Add to queue if not already there
    if (!this.processingQueue.includes(mediaId)) {
      this.processingQueue.push(mediaId);
    }
    
    // Sort queue by priority and timestamp
    this.processingQueue.sort((a, b) => {
      const reqA = this.requestMap.get(a)!;
      const reqB = this.requestMap.get(b)!;
      
      // First by request count (higher is more important)
      if (reqB.requestCount !== reqA.requestCount) {
        return reqB.requestCount - reqA.requestCount;
      }
      
      // Then by timestamp (newer is more important)
      return reqB.timestamp - reqA.timestamp;
    });
  }
  
  // Process the queue of media requests
  private async processQueue() {
    if (this.processingQueue.length === 0) {
      this.isProcessing = false;
      return;
    }
    
    if (this.activeRequests >= this.maxConcurrent) {
      // Already at max concurrent requests, will be called again when a request completes
      this.isProcessing = true;
      return;
    }
    
    this.isProcessing = true;
    
    // Get the next request from the queue
    const mediaId = this.processingQueue.shift();
    if (!mediaId || !this.requestMap.has(mediaId)) {
      // Skip and process next
      setTimeout(() => this.processQueue(), 0);
      return;
    }
    
    const request = this.requestMap.get(mediaId)!;
    
    // Skip if already processed
    if (request.status === 'success' || request.status === 'error') {
      setTimeout(() => this.processQueue(), 0);
      return;
    }
    
    // Update status and increment active requests
    request.status = 'loading';
    this.activeRequests++;
    
    try {
      // Create a preload promise if it doesn't exist yet
      if (!request.loadPromise) {
        request.loadPromise = this.preloadMedia(request.url, request.type, mediaId);
      }
      
      // Wait for preload to complete with a 5-second safety timeout
      await Promise.race([
        request.loadPromise,
        new Promise<void>((resolve) => {
          const timeout = setTimeout(() => {
            if (this.debug) {
              console.warn(`Media preload timed out for ${request.url}`);
            }
            resolve();
          }, 5000);
          this.preloadTimeouts.set(mediaId, timeout);
        })
      ]);
      
      // Clear the timeout
      if (this.preloadTimeouts.has(mediaId)) {
        clearTimeout(this.preloadTimeouts.get(mediaId)!);
        this.preloadTimeouts.delete(mediaId);
      }
      
      // Mark as successful (even if timed out)
      request.status = 'success';
    } catch (error) {
      // Mark as failed
      request.status = 'error';
      if (this.debug) {
        console.error(`Media preload error for ${request.url}:`, error);
      }
      
      // Retry if under limit
      if (request.retries < 1) {
        request.retries++;
        request.status = 'pending';
        request.loadPromise = undefined; // Clear the failed promise
        this.addToProcessingQueue(mediaId);
      }
    } finally {
      this.activeRequests--;
      
      // Process next
      setTimeout(() => this.processQueue(), 0);
    }
  }
  
  // Preload media content before showing
  private async preloadMedia(url: string | null, type: MediaType, mediaId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!url) {
        reject(new Error('No URL provided'));
        return;
      }
      
      // Add a maximum wait time for media preloading (8 seconds)
      const timeout = setTimeout(() => {
        if (this.debug) {
          console.warn(`Media preload force-resolved after timeout: ${url}`);
        }
        resolve();
      }, 8000);
      
      const handleSuccess = () => {
        clearTimeout(timeout);
        resolve();
      };
      
      const handleError = (err: any) => {
        clearTimeout(timeout);
        if (this.debug) {
          console.error(`Media preload error: ${url}`, err);
        }
        reject(err);
      };
      
      // Skip preloading for already cached content - just resolve immediately
      if (url.startsWith('data:') || url.startsWith('blob:')) {
        handleSuccess();
        return;
      }
      
      // For blob URLs or data URLs, we can assume they're already available
      if (type === MediaType.IMAGE || type === MediaType.GIF) {
        // Create image element to preload
        const img = new Image();
        
        img.onload = handleSuccess;
        img.onerror = handleError;
        
        // Set source to start loading
        img.src = url;
      } else if (type === MediaType.VIDEO) {
        // For videos, just preload metadata
        const video = document.createElement('video');
        
        video.preload = 'metadata';
        
        video.onloadedmetadata = handleSuccess;
        video.onerror = handleError;
        
        // For videos that might be cross-origin
        try {
          video.crossOrigin = 'anonymous';
          video.src = url;
        } catch (err) {
          // If setting src fails, try as an object
          try {
            const source = document.createElement('source');
            source.src = url;
            video.appendChild(source);
          } catch (sourceErr) {
            handleError(sourceErr);
          }
        }
      } else {
        // For other types, just resolve immediately
        handleSuccess();
      }
    });
  }
  
  // Get request status
  public getRequestStatus(mediaId: string): MediaRequest | null {
    return this.requestMap.get(mediaId) || null;
  }
  
  // Clear cache for testing or memory management
  public clearCache() {
    this.requestMap.clear();
    this.stableUrlCache.clear();
    this.processingQueue = [];
    this.activeRequests = 0;
    
    // Clear all timeouts
    this.preloadTimeouts.forEach(timeout => clearTimeout(timeout));
    this.preloadTimeouts.clear();
  }
}

// Singleton instance
export const mediaOrchestrator = new MediaOrchestrator();

