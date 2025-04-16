
import { useState, useEffect, useCallback } from 'react';
import { useMedia } from './useMedia';
import { MediaSource, MediaType } from '@/utils/media/types';

interface UseMediaProcessorOptions {
  autoLoad?: boolean;
  onComplete?: () => void;
  onError?: (error: string) => void;
  timeout?: number;
}

/**
 * A simplified hook that builds on useMedia to provide
 * a streamlined API for processing media sources
 */
export const useMediaProcessor = (
  source: MediaSource | string | null | undefined,
  options: UseMediaProcessorOptions = {}
) => {
  const [processingError, setProcessingError] = useState<string | null>(null);
  
  // Use the base media hook
  const {
    url: mediaUrl,
    mediaType,
    isLoading,
    isError: mediaError,
    errorMessage: mediaErrorMessage,
    retry: retryMedia
  } = useMedia(source, options);

  // Expose a simplified retry function
  const retry = useCallback(() => {
    setProcessingError(null);
    retryMedia();
  }, [retryMedia]);

  // Combine errors from both media and processing
  const isError = mediaError || !!processingError;
  
  // Combine error messages
  const errorMessage = processingError || mediaErrorMessage;

  return {
    mediaUrl,
    mediaType,
    isLoading,
    isError,
    errorMessage,
    retry
  };
};
