
import { useState, useEffect, useCallback } from 'react';
import { MediaType } from '@/utils/media/types';
import { getPlayableMediaUrl, extractMediaUrl, normalizeUrl } from '@/utils/media/mediaUrlUtils';
import { determineMediaType } from '@/utils/media/mediaUtils';
import { reportMediaError } from '@/utils/media/mediaMonitoring';

interface MediaServiceOptions {
  autoLoad?: boolean;
  maxRetries?: number;
  retryDelay?: number;
  onError?: (error: string) => void;
  onLoad?: () => void;
}

/**
 * Comprehensive hook for handling media loading, processing, and error handling
 */
export function useMediaService(source: any, options: MediaServiceOptions = {}) {
  const {
    autoLoad = true,
    maxRetries = 2,
    retryDelay = 1500,
    onError,
    onLoad
  } = options;

  const [url, setUrl] = useState<string | null>(null);
  const [normalizedUrl, setNormalizedUrl] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<MediaType>(MediaType.UNKNOWN);
  const [isLoading, setIsLoading] = useState(autoLoad);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);

  // Process the media source to get the final URL
  const processMedia = useCallback(async () => {
    if (!source) {
      setIsLoading(false);
      setHasError(true);
      setErrorMessage('No media source provided');
      if (onError) onError('No media source provided');
      return;
    }

    setIsLoading(true);
    setHasError(false);
    setErrorMessage(null);

    try {
      // Extract the raw URL
      const extractedUrl = extractMediaUrl(source);
      
      if (!extractedUrl) {
        setIsLoading(false);
        setHasError(true);
        setErrorMessage('Could not extract media URL');
        if (onError) onError('Could not extract media URL');
        return;
      }

      // Normalize the URL
      const normalized = normalizeUrl(extractedUrl);
      setNormalizedUrl(normalized);
      
      // Get playable URL with cache busting
      const playableUrl = getPlayableMediaUrl(extractedUrl);
      setUrl(playableUrl);
      
      console.log('Media URL processed:', { 
        original: extractedUrl,
        normalized,
        playable: playableUrl
      });
      
      // Determine the media type
      const type = determineMediaType(source);
      setMediaType(type);
      
      // Get thumbnail for video content
      if (type === MediaType.VIDEO && typeof source === 'object') {
        const thumbnail = source.thumbnail_url || 
                         source.video_thumbnail_url || 
                         source.poster || 
                         null;
                         
        if (thumbnail) {
          setThumbnailUrl(normalizeUrl(thumbnail));
        }
      }

      setIsLoading(false);
      setHasError(false);
      
      if (onLoad) onLoad();
    } catch (err: any) {
      console.error('Error processing media:', err);
      
      setIsLoading(false);
      setHasError(true);
      setErrorMessage(err.message || 'Failed to process media');
      
      if (onError) onError(err.message || 'Failed to process media');
      
      // Report the error
      reportMediaError(
        extractMediaUrl(source), 
        'processing_error',
        retryCount,
        mediaType === MediaType.IMAGE ? 'image' : 
          mediaType === MediaType.VIDEO ? 'video' : 
          mediaType === MediaType.AUDIO ? 'audio' : 'unknown',
        'useMediaService'
      );
    }
  }, [source, onError, onLoad, retryCount, mediaType]);

  // Handle retries with exponential backoff
  const retryWithBackoff = useCallback(() => {
    if (retryCount >= maxRetries) {
      console.error(`Maximum retry attempts (${maxRetries}) reached for media:`, source);
      return;
    }

    setIsRetrying(true);
    setRetryCount(prev => prev + 1);

    // Calculate exponential backoff delay
    const delay = retryDelay * Math.pow(2, retryCount);
    
    console.log(`Retrying media load (attempt ${retryCount + 1}/${maxRetries}) after ${delay}ms delay`);
    
    setTimeout(() => {
      processMedia();
      setIsRetrying(false);
    }, delay);
  }, [retryCount, maxRetries, retryDelay, source, processMedia]);

  // Process media on mount or when source changes
  useEffect(() => {
    if (autoLoad) {
      processMedia();
    }
  }, [processMedia, autoLoad]);

  // Manual retry function
  const retry = useCallback(() => {
    setRetryCount(0);
    processMedia();
  }, [processMedia]);

  return {
    url,
    normalizedUrl,
    mediaType,
    isLoading,
    hasError,
    errorMessage,
    retryCount,
    isRetrying,
    thumbnailUrl,
    processMedia,
    retry,
    retryWithBackoff
  };
}
