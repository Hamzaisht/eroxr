
import { useState, useEffect, useCallback } from 'react';
import { getPlayableMediaUrl } from '@/utils/media/getPlayableMediaUrl';
import { MediaType, MediaSource } from '@/utils/media/types';
import { checkUrlAccessibility, tryRepairUrl } from '@/utils/media/mediaUrlUtils';

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
      
      // Process the URL
      const processedUrl = getPlayableMediaUrl(mediaSource);
      console.log(`Processing media URL:`, mediaSource, `-> ${processedUrl}`);
      
      if (!processedUrl) {
        throw new Error('Could not process media URL');
      }
      
      // Check if URL is accessible
      const accessibility = await checkUrlAccessibility(processedUrl);
      
      if (!accessibility.accessible) {
        console.error(`Media URL is not accessible: ${processedUrl}`, accessibility);
        
        // Try alternative URLs if available
        const alternativeUrls = tryRepairUrl(processedUrl);
        let foundAccessible = false;
        
        for (const altUrl of alternativeUrls) {
          if (altUrl === processedUrl) continue;
          
          const altAccessibility = await checkUrlAccessibility(altUrl);
          if (altAccessibility.accessible) {
            console.log(`Found accessible alternative URL: ${altUrl}`);
            setUrl(altUrl);
            foundAccessible = true;
            break;
          }
        }
        
        if (!foundAccessible) {
          throw new Error(`Media URL is not accessible: ${processedUrl}`);
        }
      } else {
        // URL is accessible
        setUrl(processedUrl);
      }
      
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

  // Handle for successful load
  const handleLoad = useCallback(() => {
    console.log(`Media loaded successfully: ${url}`);
    setIsLoaded(true);
    setIsError(false);
    if (onComplete) onComplete();
  }, [url, onComplete]);

  // Handle for load error
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
