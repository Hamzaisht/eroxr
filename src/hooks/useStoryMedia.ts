
import { useState, useEffect, useCallback, useRef } from 'react';
import { useMedia } from './useMedia';

interface UseStoryMediaOptions {
  onComplete?: () => void;
  onError?: (error: string) => void;
}

/**
 * Hook specifically for handling story media with auto-progression
 */
export const useStoryMedia = (
  mediaUrl: string | null | undefined,
  mediaType: 'image' | 'video',
  isPaused: boolean,
  options: UseStoryMediaOptions = {}
) => {
  const [hasError, setHasError] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [retryAttempts, setRetryAttempts] = useState(0);
  const autoProgressTimer = useRef<NodeJS.Timeout | null>(null);
  const { onComplete, onError } = options;

  // Use the base media hook for URL processing
  const {
    url,
    isLoading,
    isError: mediaError,
    errorMessage,
    retry: retryMedia
  } = useMedia(mediaUrl, {
    onError: (err) => {
      if (onError) onError(err);
    }
  });

  // Clear timer on unmount
  useEffect(() => {
    return () => {
      if (autoProgressTimer.current) {
        clearTimeout(autoProgressTimer.current);
      }
    };
  }, []);

  // For images, auto-progress after they've loaded
  useEffect(() => {
    // Auto-progression only applies to images
    if (mediaType === 'image' && hasLoaded && !isPaused && onComplete) {
      const IMAGE_DISPLAY_TIME = 5000; // 5 seconds
      autoProgressTimer.current = setTimeout(() => {
        onComplete();
      }, IMAGE_DISPLAY_TIME);
    }

    return () => {
      if (autoProgressTimer.current) {
        clearTimeout(autoProgressTimer.current);
      }
    };
  }, [mediaType, hasLoaded, isPaused, onComplete]);

  // Handle media errors
  useEffect(() => {
    if (mediaError) {
      setHasError(true);
    }
  }, [mediaError]);

  // Handle load event
  const handleLoad = useCallback(() => {
    setHasLoaded(true);
    setHasError(false);
  }, []);

  // Handle error event
  const handleError = useCallback(() => {
    setHasError(true);
    setHasLoaded(false);
  }, []);

  // Retry loading
  const retryLoad = useCallback(() => {
    setHasError(false);
    setHasLoaded(false);
    setRetryAttempts(prev => prev + 1);
    retryMedia();
  }, [retryMedia]);

  return {
    url,
    isLoading,
    hasError,
    errorMessage,
    handleLoad,
    handleError,
    retryLoad,
    retryAttempts
  };
};
