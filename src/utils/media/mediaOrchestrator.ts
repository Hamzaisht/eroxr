
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
}

// Stable media cache to prevent unnecessary re-renders
class MediaOrchestrator {
  private requestMap = new Map<string, MediaRequest>();
  private stableUrlCache = new Map<string, string>();
  private processingQueue: string[] = [];
  private isProcessing = false;
  private maxConcurrent = 4;
  private activeRequests = 0;

  // Create a stable unique ID for a media source
  public createMediaId(source: string | MediaSource): string {
    if (!source) return '';
    
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
    const mediaType = source.media_type || determineMediaType(source);
    
    // Create a composite key
    const compositeKey = `${primaryUrl}|${creatorId}|${mediaType}`;
    return this.hashString(compositeKey);
  }
  
  // Simple string hash function for creating stable IDs
  private hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(36);
  }
  
  // Get a stable, cacheable URL for a media source
  public getStableUrl(source: string | MediaSource | null, cacheBuster = true): string | null {
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
  public registerMediaRequest(source: string | MediaSource): MediaRequest {
    const mediaId = this.createMediaId(source);
    const url = this.getStableUrl(source);
    const type = typeof source === 'object' ? (source.media_type || determineMediaType(source)) : determineMediaType(source);
    
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
    if (this.processingQueue.length === 0 || this.activeRequests >= this.maxConcurrent) {
      this.isProcessing = false;
      return;
    }
    
    this.isProcessing = true;
    
    // Get the next request from the queue
    const mediaId = this.processingQueue.shift();
    if (!mediaId || !this.requestMap.has(mediaId)) {
      // Skip and process next
      this.processQueue();
      return;
    }
    
    const request = this.requestMap.get(mediaId)!;
    
    // Skip if already processed
    if (request.status === 'success' || request.status === 'error') {
      this.processQueue();
      return;
    }
    
    // Update status and increment active requests
    request.status = 'loading';
    this.activeRequests++;
    
    try {
      // Simulate preloading the media
      await this.preloadMedia(request.url, request.type);
      
      // Mark as successful
      request.status = 'success';
    } catch (error) {
      // Mark as failed
      request.status = 'error';
      
      // Retry if under limit
      if (request.retries < 2) {
        request.retries++;
        request.status = 'pending';
        this.addToProcessingQueue(mediaId);
      }
    } finally {
      this.activeRequests--;
      
      // Process next
      this.processQueue();
    }
  }
  
  // Preload media content before showing
  private async preloadMedia(url: string | null, type: MediaType): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!url) {
        reject(new Error('No URL provided'));
        return;
      }
      
      const timeout = setTimeout(() => {
        reject(new Error('Media preload timed out'));
      }, 15000); // 15 second timeout
      
      if (type === MediaType.IMAGE || type === MediaType.GIF) {
        const img = new Image();
        
        img.onload = () => {
          clearTimeout(timeout);
          resolve();
        };
        
        img.onerror = () => {
          clearTimeout(timeout);
          reject(new Error('Image failed to load'));
        };
        
        img.src = url;
      } else if (type === MediaType.VIDEO) {
        const video = document.createElement('video');
        
        video.preload = 'metadata';
        
        video.onloadedmetadata = () => {
          clearTimeout(timeout);
          resolve();
        };
        
        video.onerror = () => {
          clearTimeout(timeout);
          reject(new Error('Video failed to load'));
        };
        
        video.src = url;
      } else {
        // For other types, just resolve immediately
        clearTimeout(timeout);
        resolve();
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
  }
}

// Singleton instance
export const mediaOrchestrator = new MediaOrchestrator();
