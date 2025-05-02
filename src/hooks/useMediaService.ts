
import { useState, useEffect, useCallback } from 'react';
import { MediaType, MediaSource } from '@/utils/media/types';
import { determineMediaType, extractMediaUrl } from '@/utils/media/mediaUtils';
import { getPlayableMediaUrl } from '@/utils/media/mediaUrlUtils';
import { reportMediaError } from '@/utils/media/mediaMonitoring';

interface MediaServiceOptions {
  maxRetries?: number;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * Hook for handling media processing, loading states, and errors
 * @param source - The media source (URL, object, or file)
 * @param options - Configuration options
 * @returns Media service object with url, states, and control methods
 */
export const useMediaService = (
  source: MediaSource | string | null | undefined,
  options: MediaServiceOptions = {}
) => {
  const { maxRetries = 2, onLoad, onError } = options;

  const [url, setUrl] = useState<string | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<MediaType>(MediaType.UNKNOWN);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Process the source URL and determine media type
  useEffect(() => {
    if (!source) {
      setErrorMessage('No media source provided');
      setHasError(true);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setHasError(false);
    setErrorMessage(null);

    try {
      // Extract and process the URL
      const sourceUrl = typeof source === 'string' ? source : extractMediaUrl(source);
      if (!sourceUrl) {
        throw new Error('Could not extract media URL');
      }
      
      // Process the URL for playback
      const processedUrl = getPlayableMediaUrl(sourceUrl);
      setUrl(processedUrl);
      
      // Set the thumbnail URL if available
      if (typeof source === 'object' && source) {
        const thumbUrl = source.thumbnail_url || 
                        source.poster || 
                        source.video_thumbnail_url;
        if (thumbUrl) {
          setThumbnailUrl(getPlayableMediaUrl(thumbUrl));
        }
      }
      
      // Determine the media type
      const type = determineMediaType(source);
      setMediaType(type);
      
    } catch (err: any) {
      console.error('Error processing media source:', err);
      setErrorMessage(err.message || 'Failed to process media');
      setHasError(true);
      
      // Report the error
      reportMediaError(
        typeof source === 'string' ? source : JSON.stringify(source),
        'processing_error',
        retryCount,
        'unknown',
        'useMediaService'
      );
      
      if (onError) onError();
    } finally {
      setIsLoading(false);
    }
  }, [source, retryCount, onError]);

  // Method to handle successful media load
  const handleLoad = useCallback(() => {
    setIsLoading(false);
    setHasError(false);
    
    if (onLoad) onLoad();
  }, [onLoad]);

  // Method to handle media loading error
  const handleError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
    setErrorMessage('Failed to load media');
    
    if (onError) onError();
  }, [onError]);

  // Method to retry loading media
  const retry = useCallback(() => {
    if (retryCount >= maxRetries) {
      console.warn(`Max retries (${maxRetries}) reached for media:`, source);
      return;
    }
    
    setRetryCount(prev => prev + 1);
    setIsLoading(true);
    setHasError(false);
    setErrorMessage(null);
  }, [retryCount, maxRetries, source]);

  return {
    url,
    thumbnailUrl,
    mediaType,
    isLoading,
    hasError,
    errorMessage,
    retry,
    handleLoad,
    handleError,
  };
};
