
import { useState, useEffect, useCallback, useRef } from 'react';
import { extractMediaUrl, getContentType, determineMediaType } from '@/utils/media/mediaUtils';
import { MediaType, MediaSource } from '@/utils/media/types';
import { checkUrlAccessibility, getDirectMediaUrl } from '@/utils/media/mediaUrlUtils';

interface UseMediaOptions {
  autoLoad?: boolean;
  onComplete?: () => void;
  onError?: (error: string) => void;
  timeout?: number;
}

/**
 * Hook for processing and validating media sources
 * Handles URL extraction, validation, and provides states for loading and error conditions
 */
export const useMedia = (
  source: MediaSource | string | null | undefined,
  options: UseMediaOptions = {}
) => {
  const [url, setUrl] = useState<string>('');
  const [mediaType, setMediaType] = useState<MediaType>(MediaType.UNKNOWN);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [retryCount, setRetryCount] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  
  const { autoLoad = true, onComplete, onError, timeout = 30000 } = options;
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMounted = useRef(true);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  
  // Function to process and load the media
  const loadMedia = useCallback(async (mediaSource: MediaSource | string | null | undefined) => {
    if (!mediaSource) {
      if (isMounted.current) {
        setIsError(true);
        setErrorMessage('No media source provided');
        setIsLoading(false);
        if (onError) onError('No media source provided');
      }
      return;
    }
    
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Set a new timeout for the operation
    timeoutRef.current = setTimeout(() => {
      if (isMounted.current && isLoading) {
        setIsError(true);
        setErrorMessage('Media loading timed out');
        setIsLoading(false);
        if (onError) onError('Media loading timed out');
      }
    }, timeout);
    
    try {
      if (isMounted.current) {
        setIsLoading(true);
        setIsError(false);
      }
      
      // Determine the media type
      const type = determineMediaType(mediaSource);
      if (isMounted.current) {
        setMediaType(type);
      }

      console.log(`Processing media source (type: ${type}):`, mediaSource);
      
      // Extract and process the media URL
      let rawUrl = extractMediaUrl(mediaSource);
      
      if (!rawUrl) {
        throw new Error('Could not extract media URL from source');
      }
      
      console.log('Extracted raw URL:', rawUrl);
      
      // Process the URL to ensure it's complete and valid
      const processedUrl = getDirectMediaUrl(rawUrl);
      
      console.log('Processed URL with cache busting:', processedUrl);
      
      // Check URL accessibility
      const accessibility = await checkUrlAccessibility(processedUrl);
      console.log('URL accessibility check:', accessibility);
      
      if (!accessibility.accessible) {
        throw new Error(`Media URL is not accessible: ${accessibility.error || 'Unknown error'}`);
      }
      
      // Set the processed URL
      if (isMounted.current) {
        setUrl(processedUrl);
        setIsLoading(false);
      }
      
    } catch (error) {
      console.error('Error loading media:', error);
      const errorMsg = error instanceof Error ? error.message : String(error);
      
      if (isMounted.current) {
        setIsError(true);
        setErrorMessage(errorMsg);
        setIsLoading(false);
        if (onError) onError(errorMsg);
      }
    } finally {
      // Clear the timeout as the operation finished
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }
  }, [isLoading, onError, timeout]);

  // Load media when source changes or on retry
  useEffect(() => {
    if (autoLoad) {
      loadMedia(source);
    }
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
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
    mediaType,
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
