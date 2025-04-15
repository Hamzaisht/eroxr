
import { useState, useEffect, useCallback } from 'react';
import { 
  getPlayableMediaUrl, 
  determineMediaType, 
  MediaType, 
  checkUrlAccessibility,
  extractMediaUrl,
  MediaResult
} from '@/utils/media/mediaUtils';

interface UseMediaOptions {
  autoLoad?: boolean;
  maxRetries?: number;
}

/**
 * Hook to handle media loading, error states, and retries
 */
export const useMedia = (
  mediaItem: any,
  { autoLoad = true, maxRetries = 2 }: UseMediaOptions = {}
): MediaResult & { retry: () => void; retryCount: number; isAccessible: boolean } => {
  const [url, setUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isAccessible, setIsAccessible] = useState(true);
  const mediaType = determineMediaType(mediaItem);

  const processMedia = useCallback(async () => {
    try {
      setIsLoading(true);
      setIsError(false);
      setError(null);

      // Extract media URL from the item
      const rawUrl = extractMediaUrl(mediaItem);
      if (!rawUrl) {
        throw new Error('Could not extract media URL');
      }

      // Get the playable URL
      const processedUrl = getPlayableMediaUrl(rawUrl);
      
      if (!processedUrl) {
        throw new Error('Could not get media URL');
      }

      // Check if the URL is accessible
      if (autoLoad) {
        const { accessible, error: accessError } = await checkUrlAccessibility(processedUrl);
        
        if (!accessible) {
          setIsAccessible(false);
          throw new Error(accessError || 'Media source is not accessible');
        }
        
        setIsAccessible(true);
      }

      setUrl(processedUrl);
      setIsLoading(false);
    } catch (err) {
      console.error('Error processing media:', err);
      setIsError(true);
      setError(err instanceof Error ? err.message : 'Unknown error processing media');
      setIsLoading(false);
    }
  }, [mediaItem, autoLoad]);

  // Process media on mount and when media item changes
  useEffect(() => {
    processMedia();
  }, [processMedia]);

  // Function to retry loading the media
  const retry = useCallback(() => {
    if (retryCount < maxRetries) {
      setRetryCount(prev => prev + 1);
      processMedia();
    } else {
      console.warn('Maximum retry attempts reached');
    }
  }, [retryCount, maxRetries, processMedia]);

  return {
    url,
    isLoading,
    isError,
    error,
    mediaType,
    retry,
    retryCount,
    isAccessible
  };
};
