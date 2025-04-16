
import { useState, useEffect, useCallback } from 'react';
import { extractMediaUrl, getContentType } from '@/utils/media/mediaUtils';
import { MediaType, MediaSource } from '@/utils/media/types';
import { checkUrlAccessibility } from '@/utils/media/mediaUrlUtils';

interface UseMediaOptions {
  autoLoad?: boolean;
  onComplete?: () => void;
  onError?: (error: string) => void;
}

export const useMedia = (
  source: MediaSource | string | null | undefined,
  options: UseMediaOptions = {}
) => {
  const [url, setUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [retryCount, setRetryCount] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  
  const { autoLoad = true, onComplete, onError } = options;

  // Function to process and load the media
  const loadMedia = useCallback(async (mediaSource: MediaSource | string | null | undefined) => {
    if (!mediaSource) {
      setIsError(true);
      setErrorMessage('No media source provided');
      setIsLoading(false);
      if (onError) onError('No media source provided');
      return;
    }
    
    try {
      setIsLoading(true);
      setIsError(false);
      
      // Extract media URL from source
      const extractedUrl = extractMediaUrl(mediaSource);
      
      if (!extractedUrl) {
        throw new Error('Could not process media URL');
      }
      
      console.log('Processing media URL:', extractedUrl);
      
      // Check URL accessibility
      const accessibility = await checkUrlAccessibility(extractedUrl);
      
      if (!accessibility.accessible) {
        throw new Error(`Media URL is not accessible: ${extractedUrl}`);
      }
      
      setUrl(extractedUrl);
      setIsLoading(false);
      
    } catch (error) {
      console.error('Error loading media:', error);
      setIsError(true);
      setErrorMessage(error instanceof Error ? error.message : String(error));
      setIsLoading(false);
      if (onError) onError(error instanceof Error ? error.message : String(error));
    }
  }, [onError]);

  // Load media when source changes or on retry
  useEffect(() => {
    if (autoLoad) {
      loadMedia(source);
    }
  }, [source, autoLoad, loadMedia, retryCount]);

  // Handle successful load
  const handleLoad = useCallback(() => {
    console.log(`Media loaded successfully: ${url}`);
    setIsLoaded(true);
    setIsError(false);
    if (onComplete) onComplete();
  }, [url, onComplete]);

  // Handle load error
  const handleError = useCallback(() => {
    console.error(`Error loading media: ${url}`);
    setIsError(true);
    setErrorMessage('Failed to load media content');
    if (onError) onError('Failed to load media content');
  }, [url, onError]);

  // Retry loading
  const retry = useCallback(() => {
    setRetryCount(prev => prev + 1);
    setIsError(false);
    setIsLoading(true);
  }, []);

  return {
    url,
    isLoading,
    isError,
    errorMessage,
    isLoaded,
    retryCount,
    handleLoad,
    handleError,
    retry
  };
};
