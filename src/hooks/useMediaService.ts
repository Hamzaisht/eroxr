
import { useState, useEffect, useCallback } from 'react';
import { MediaType } from '@/utils/media/types';
import { determineMediaType } from '@/utils/media/mediaUtils';
import { getPlayableUrl, normalizeMediaUrl, extractMediaUrl } from '@/utils/media/mediaUrlUtils';

interface MediaServiceOptions {
  autoLoad?: boolean;
  maxRetries?: number;
  retryDelay?: number;
  onError?: (error: string) => void;
  onLoad?: () => void;
}

interface MediaServiceState {
  url: string | null;
  normalizedUrl: string | null;
  mediaType: MediaType;
  isLoading: boolean;
  hasError: boolean;
  errorMessage: string | null;
  retryCount: number;
  isRetrying: boolean;
  thumbnailUrl: string | null;
}

/**
 * A comprehensive hook for handling all media operations
 * @param source - The media source (URL, object, etc.)
 * @param options - Configuration options
 * @returns Media state and operations
 */
export function useMediaService(source: any, options: MediaServiceOptions = {}) {
  const {
    autoLoad = true,
    maxRetries = 2,
    retryDelay = 1500,
    onError,
    onLoad
  } = options;

  const [state, setState] = useState<MediaServiceState>({
    url: null,
    normalizedUrl: null,
    mediaType: MediaType.UNKNOWN,
    isLoading: autoLoad,
    hasError: false,
    errorMessage: null,
    retryCount: 0,
    isRetrying: false,
    thumbnailUrl: null
  });

  // Process the media source to get the final URL
  const processMedia = useCallback(async () => {
    if (!source) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        hasError: true,
        errorMessage: 'No media source provided'
      }));
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, hasError: false, errorMessage: null }));

    try {
      // Extract the raw URL
      const extractedUrl = extractMediaUrl(source);
      
      if (!extractedUrl) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          hasError: true,
          errorMessage: 'Could not extract media URL'
        }));
        return;
      }

      // Normalize the URL
      const normalized = normalizeMediaUrl(extractedUrl);
      
      // Get playable URL
      const playableUrl = getPlayableUrl(extractedUrl);
      
      // Determine the media type
      const mediaType = determineMediaType(source);
      
      // Get thumbnail for video content
      let thumbnailUrl = null;
      if (mediaType === MediaType.VIDEO && typeof source === 'object') {
        thumbnailUrl = source.thumbnail_url || 
                       source.video_thumbnail_url || 
                       source.poster || 
                       null;
      }

      setState(prev => ({
        ...prev,
        url: playableUrl,
        normalizedUrl: normalized,
        mediaType,
        isLoading: false,
        hasError: false,
        errorMessage: null,
        thumbnailUrl
      }));
      
      if (onLoad) onLoad();
    } catch (err: any) {
      console.error('Error processing media:', err);
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        hasError: true,
        errorMessage: err.message || 'Failed to process media'
      }));
      
      if (onError) onError(err.message || 'Failed to process media');
    }
  }, [source, onError, onLoad]);

  // Handle retries with exponential backoff
  const retryWithBackoff = useCallback(() => {
    if (state.retryCount >= maxRetries) {
      console.error(`Maximum retry attempts (${maxRetries}) reached for media:`, source);
      return;
    }

    setState(prev => ({ 
      ...prev, 
      isRetrying: true,
      retryCount: prev.retryCount + 1
    }));

    // Calculate exponential backoff delay
    const delay = retryDelay * Math.pow(2, state.retryCount);
    
    setTimeout(() => {
      processMedia();
      setState(prev => ({ ...prev, isRetrying: false }));
    }, delay);
  }, [state.retryCount, maxRetries, retryDelay, source, processMedia]);

  // Process media on mount or when source changes
  useEffect(() => {
    if (autoLoad) {
      processMedia();
    }
  }, [processMedia, autoLoad]);

  // Manual retry function
  const retry = useCallback(() => {
    setState(prev => ({ ...prev, retryCount: 0 }));
    processMedia();
  }, [processMedia]);

  return {
    ...state,
    processMedia,
    retry,
    retryWithBackoff
  };
}
