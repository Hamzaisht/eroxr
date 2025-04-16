
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
      
      // Extract and process the media URL
      let processedUrl = extractMediaUrl(mediaSource);
      
      if (!processedUrl) {
        console.error('Could not extract media URL from source:', mediaSource);
        throw new Error('Could not process media URL');
      }

      // Clean up the URL by removing any duplicate query parameters
      const urlObj = new URL(processedUrl);
      processedUrl = urlObj.toString();
      
      console.log('Processing media URL:', processedUrl);
      
      // Check URL accessibility
      const accessibility = await checkUrlAccessibility(processedUrl);
      
      if (!accessibility.accessible) {
        console.error('Media URL not accessible:', processedUrl, accessibility.error);
        throw new Error(`Media URL is not accessible: ${accessibility.error || 'Unknown error'}`);
      }
      
      // Set the processed URL
      setUrl(processedUrl);
      setIsLoading(false);
      
    } catch (error) {
      console.error('Error loading media:', error);
      const errorMsg = error instanceof Error ? error.message : String(error);
      setIsError(true);
      setErrorMessage(errorMsg);
      setIsLoading(false);
      if (onError) onError(errorMsg);
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
    console.log('Retrying media load...');
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
