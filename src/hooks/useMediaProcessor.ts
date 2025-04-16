
import { useState, useEffect, useCallback } from 'react';
import { MediaSource, MediaType } from '@/utils/media/types';
import { determineMediaType, extractMediaUrl } from '@/utils/media/mediaUtils';
import { getPlayableMediaUrl } from '@/utils/media/urlUtils';

interface UseMediaProcessorOptions {
  autoLoad?: boolean;
  maxRetries?: number;
}

export const useMediaProcessor = (
  source: MediaSource | string | null,
  options: UseMediaProcessorOptions = { autoLoad: true }
) => {
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<MediaType | string>(MediaType.UNKNOWN);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  
  const processMedia = useCallback(() => {
    setIsLoading(true);
    setIsError(false);
    
    try {
      if (!source) {
        setMediaUrl(null);
        setIsLoading(false);
        setIsError(true);
        return;
      }
      
      // Determine media type
      const type = determineMediaType(source);
      setMediaType(type);
      
      // Extract and process URL
      const rawUrl = extractMediaUrl(source);
      if (!rawUrl) {
        setMediaUrl(null);
        setIsError(true);
        setIsLoading(false);
        return;
      }
      
      // Add cache busting to avoid caching issues
      const processedUrl = getPlayableMediaUrl(rawUrl);
      setMediaUrl(processedUrl);
      setIsLoading(false);
    } catch (error) {
      console.error('Error processing media:', error);
      setIsError(true);
      setIsLoading(false);
    }
  }, [source]);
  
  // Automatically process when component mounts or source changes
  useEffect(() => {
    if (options.autoLoad) {
      processMedia();
    }
  }, [source, retryCount, processMedia, options.autoLoad]);
  
  const retry = useCallback(() => {
    if (retryCount < (options.maxRetries || 3)) {
      setRetryCount(prev => prev + 1);
    }
  }, [retryCount, options.maxRetries]);
  
  return {
    mediaUrl,
    mediaType,
    isLoading,
    isError,
    retry,
    process: processMedia
  };
};
