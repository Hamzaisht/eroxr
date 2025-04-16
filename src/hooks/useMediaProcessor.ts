
import { useState, useEffect, useCallback } from 'react';
import { MediaSource, MediaType } from '@/utils/media/types';
import { determineMediaType, extractMediaUrl, addCacheBuster } from '@/utils/media/mediaUtils';

interface MediaProcessorOptions {
  autoLoad?: boolean;
  maxRetries?: number;
}

export function useMediaProcessor(source: MediaSource | string | null | undefined, options: MediaProcessorOptions = {}) {
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<MediaType>(MediaType.UNKNOWN);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [retryCount, setRetryCount] = useState<number>(0);

  const { autoLoad = true, maxRetries = 3 } = options;

  const processMedia = useCallback(async () => {
    if (!source) {
      setIsError(true);
      setErrorMessage('No media source provided');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setIsError(false);

      // Determine media type
      const type = determineMediaType(source);
      setMediaType(type);

      // Extract URL
      let url = extractMediaUrl(source);
      if (!url) {
        throw new Error('Could not extract media URL');
      }

      // Add cache buster if retrying
      if (retryCount > 0) {
        url = addCacheBuster(url);
      }

      setMediaUrl(url);
      setIsLoading(false);
    } catch (error) {
      console.error('Error processing media:', error);
      setIsError(true);
      setErrorMessage(error instanceof Error ? error.message : String(error));
      setIsLoading(false);
    }
  }, [source, retryCount]);

  // Process media when source changes or on retry
  useEffect(() => {
    if (autoLoad) {
      processMedia();
    }
  }, [processMedia, autoLoad]);

  // Function to manually retry
  const retry = useCallback(() => {
    setRetryCount(prev => prev + 1);
  }, []);

  return {
    mediaUrl,
    mediaType,
    isLoading,
    isError,
    errorMessage,
    retry,
    retryCount,
    processMedia,
  };
}
