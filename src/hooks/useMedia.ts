
import { useState, useEffect, useCallback } from 'react';
import { MediaSource } from '@/utils/media/types';
import { extractMediaUrl } from '@/utils/media/mediaUtils';
import { getPlayableMediaUrl } from '@/utils/media/urlUtils';

interface UseMediaOptions {
  autoLoad?: boolean;
  maxRetries?: number;
}

export const useMedia = (
  source: MediaSource | string | null,
  options: UseMediaOptions = { autoLoad: true, maxRetries: 3 }
) => {
  const [url, setUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  
  const loadMedia = useCallback(() => {
    setIsLoading(true);
    setIsError(false);
    
    try {
      if (!source) {
        setUrl(null);
        setIsLoading(false);
        return;
      }
      
      // Extract and process the URL
      const rawUrl = extractMediaUrl(source);
      if (!rawUrl) {
        setUrl(null);
        setIsError(true);
        setIsLoading(false);
        return;
      }
      
      // Add cache busting to avoid caching issues
      const processedUrl = getPlayableMediaUrl(rawUrl);
      setUrl(processedUrl);
      setIsLoading(false);
    } catch (error) {
      console.error('Error processing media URL:', error);
      setIsError(true);
      setIsLoading(false);
    }
  }, [source]);
  
  // Automatically load when component mounts or source changes
  useEffect(() => {
    if (options.autoLoad) {
      loadMedia();
    }
  }, [source, retryCount, loadMedia, options.autoLoad]);
  
  const retry = useCallback(() => {
    if (retryCount < (options.maxRetries || 3)) {
      setRetryCount(prev => prev + 1);
    }
  }, [retryCount, options.maxRetries]);
  
  return {
    url,
    isLoading,
    isError,
    retry,
    retryCount
  };
};
