
import { useState, useEffect, useCallback } from 'react';
import { MediaSource, MediaType } from '@/utils/media/types';
import { extractMediaUrl, getPlayableMediaUrl, determineMediaType } from '@/utils/mediaUtils';

interface UseMediaOptions {
  autoLoad?: boolean;
  onComplete?: () => void;
  onError?: (error: string) => void;
  timeout?: number;
}

interface UseMediaState {
  url: string | null;
  mediaType: MediaType;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
  retryCount: number;
}

/**
 * A hook for processing and managing media URLs
 */
export const useMedia = (
  source: MediaSource | string | null | undefined,
  options: UseMediaOptions = {}
) => {
  const [state, setState] = useState<UseMediaState>({
    url: null,
    mediaType: 'unknown',
    isLoading: true,
    isError: false,
    errorMessage: null,
    retryCount: 0
  });

  // Extract options
  const { onError, onComplete } = options;

  // Process the media source to extract and validate the URL
  const processMediaSource = useCallback(async () => {
    if (!source) {
      setState(prev => ({
        ...prev,
        url: null,
        isLoading: false,
        isError: true,
        errorMessage: 'No media source provided'
      }));
      return;
    }

    try {
      setState(prev => ({ ...prev, isLoading: true, isError: false, errorMessage: null }));
      
      // Extract the raw URL from the source
      const rawUrl = extractMediaUrl(source);
      if (!rawUrl) {
        throw new Error('No URL could be extracted from the source');
      }

      // Process the URL to make it playable
      const processedUrl = getPlayableMediaUrl(rawUrl);
      if (!processedUrl) {
        throw new Error('Failed to process media URL');
      }

      // Determine the media type
      const mediaType = determineMediaType(source);

      // Update state with the processed URL and media type
      setState(prev => ({
        ...prev,
        url: processedUrl,
        mediaType,
        isLoading: false,
        isError: false,
        errorMessage: null
      }));

      if (onComplete) onComplete();
    } catch (error: any) {
      console.error('Error processing media source:', error);
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        isError: true,
        errorMessage: error.message || 'Unknown error processing media'
      }));
      
      if (onError) onError(error.message || 'Unknown error processing media');
    }
  }, [source, onComplete, onError]);

  // Process the media source on mount or when source changes
  useEffect(() => {
    processMediaSource();
  }, [processMediaSource]);

  // Function to retry processing the media source
  const retry = useCallback(() => {
    setState(prev => ({
      ...prev,
      retryCount: prev.retryCount + 1,
      isLoading: true,
      isError: false,
      errorMessage: null
    }));
    
    processMediaSource();
  }, [processMediaSource]);

  return {
    ...state,
    retry
  };
};
