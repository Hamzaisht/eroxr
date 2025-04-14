
import { useState, useEffect, useCallback } from 'react';
import { getPlayableMediaUrl, addCacheBuster } from '@/utils/media/getPlayableMediaUrl';
import { debugMediaUrl } from '@/utils/media/debugMediaUtils';

interface UseMediaHandlerProps {
  item: any;
  onError?: () => void;
  onLoad?: () => void;
  maxRetries?: number;
}

export const useMediaHandler = ({ 
  item, 
  onError, 
  onLoad,
  maxRetries = 2
}: UseMediaHandlerProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [accessibleUrl, setAccessibleUrl] = useState<string | null>(null);

  // Determine content type
  const isVideoContent = Boolean(
    item?.video_url || 
    item?.media_type === 'video' || 
    item?.content_type === 'video'
  );

  // Create a reliable URL once on mount
  useEffect(() => {
    // Get the URL safely
    let urlToUse = getPlayableMediaUrl(item);
    
    // Only add a single cache buster to avoid excessive refreshing
    if (urlToUse && !urlToUse.includes('t=') && !urlToUse.includes('r=')) {
      const timestamp = Date.now();
      urlToUse = urlToUse.includes('?') 
        ? `${urlToUse}&t=${timestamp}` 
        : `${urlToUse}?t=${timestamp}`;
    }
    
    setAccessibleUrl(urlToUse);
    setIsLoading(true);
    setLoadError(false);
    setRetryCount(0);
    
  }, [item]);

  // Debug URL on error to help diagnose issues
  useEffect(() => {
    if (loadError && accessibleUrl) {
      console.log(`Debugging URL that failed to load: ${accessibleUrl}`);
      debugMediaUrl(accessibleUrl);
    }
  }, [loadError, accessibleUrl]);

  const handleError = useCallback(() => {
    console.error(`Media loading error for ${isVideoContent ? 'video' : 'image'}: ${accessibleUrl}`);
    setLoadError(true);
    setIsLoading(false);
    
    if (retryCount < maxRetries) {
      // Auto retry with increasing delay
      const delay = Math.min(1000 * (retryCount + 1), 3000);
      console.log(`Will retry in ${delay}ms (attempt ${retryCount + 1}/${maxRetries})`);
      
      setTimeout(() => {
        setRetryCount(prev => prev + 1);
        setIsLoading(true);
        setLoadError(false);
        
        // Generate a new URL with fresh cache busting
        if (accessibleUrl) {
          const timestamp = Date.now();
          const freshUrl = accessibleUrl.includes('?') 
            ? accessibleUrl.replace(/[?&]t=\d+/, '') + `&t=${timestamp}` 
            : `${accessibleUrl}?t=${timestamp}`;
          setAccessibleUrl(freshUrl);
        }
      }, delay);
    } else if (onError) {
      onError();
    }
  }, [accessibleUrl, isVideoContent, maxRetries, onError, retryCount]);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
    setLoadError(false);
    
    if (onLoad) onLoad();
  }, [onLoad]);

  const handleRetry = useCallback(() => {
    setIsLoading(true);
    setLoadError(false);
    setRetryCount(0);
    
    // Force reload with new cache buster
    if (accessibleUrl) {
      const timestamp = Date.now();
      const freshUrl = accessibleUrl.includes('?') 
        ? accessibleUrl.replace(/[?&]t=\d+/, '') + `&t=${timestamp}` 
        : `${accessibleUrl}?t=${timestamp}`;
      setAccessibleUrl(freshUrl);
    }
  }, [accessibleUrl]);

  return {
    isLoading,
    loadError,
    retryCount,
    accessibleUrl,
    effectiveUrl: accessibleUrl,
    isVideoContent,
    handleLoad,
    handleError,
    handleRetry
  };
};
