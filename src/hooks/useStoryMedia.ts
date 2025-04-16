
import { useState, useEffect, useCallback } from 'react';
import { getPlayableMediaUrl } from '@/utils/media/urlUtils';
import { UseMediaOptions } from '@/utils/media/types';

interface UseStoryMediaReturn {
  url: string | null;
  isLoading: boolean;
  hasError: boolean;
  errorMessage?: string; // Added this property
  handleLoad: () => void;
  handleError: () => void;
  retryLoad: () => void;
  retryCount: number;
}

export const useStoryMedia = (
  url: string | null | undefined,
  mediaType: 'image' | 'video',
  isPaused: boolean,
  options?: UseMediaOptions
): UseStoryMediaReturn => {
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
  const [retryCount, setRetryCount] = useState(0);

  // Process URL and handle initial loading state
  useEffect(() => {
    if (!url) {
      setProcessedUrl(null);
      setIsLoading(false);
      setHasError(true);
      setErrorMessage("No URL provided");
      
      // Call onError callback if provided
      if (options?.onError) {
        options.onError();
      }
      return;
    }

    try {
      // Process URL (add cache busters, etc)
      const processed = getPlayableMediaUrl(url);
      setProcessedUrl(processed);
      setIsLoading(true);
      setHasError(false);
      setErrorMessage(undefined);
    } catch (error) {
      console.error(`Failed to process ${mediaType} URL:`, error);
      setProcessedUrl(null);
      setIsLoading(false);
      setHasError(true);
      setErrorMessage("Failed to process media URL");
      
      // Call onError callback if provided
      if (options?.onError) {
        options.onError();
      }
    }
  }, [url, mediaType, retryCount, options]);

  // Handle successful load
  const handleLoad = useCallback(() => {
    setIsLoading(false);
    setHasError(false);

    // For images, trigger onComplete immediately
    // For videos, onComplete is handled by onEnded event in the component
    if (mediaType === 'image' && options?.onComplete) {
      options.onComplete();
    }
  }, [mediaType, options]);

  // Handle loading error
  const handleError = useCallback(() => {
    console.error(`Failed to load ${mediaType}:`, url);
    setIsLoading(false);
    setHasError(true);
    setErrorMessage(`Failed to load ${mediaType}`);
    
    // Call onError callback if provided
    if (options?.onError) {
      options.onError();
    }
  }, [url, mediaType, options]);

  // Retry loading the media
  const retryLoad = useCallback(() => {
    setIsLoading(true);
    setHasError(false);
    setErrorMessage(undefined);
    setRetryCount(prev => prev + 1);
  }, []);

  return {
    url: processedUrl,
    isLoading,
    hasError,
    errorMessage,
    handleLoad,
    handleError,
    retryLoad,
    retryCount
  };
};

export default useStoryMedia;
