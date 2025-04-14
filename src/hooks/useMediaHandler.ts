
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
  maxRetries = 3
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

  // Create a reliable URL once on mount or when item changes
  useEffect(() => {
    // Get the URL safely
    const sourceUrl = getPlayableMediaUrl(item);
    
    // Apply cache busting only once
    const urlWithCacheBuster = sourceUrl ? addCacheBuster(sourceUrl) : null;
    
    setAccessibleUrl(urlWithCacheBuster);
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
        const sourceUrl = getPlayableMediaUrl(item);
        const freshUrl = sourceUrl ? addCacheBuster(sourceUrl) : null;
        setAccessibleUrl(freshUrl);
      }, delay);
    } else if (onError) {
      onError();
    }
  }, [accessibleUrl, isVideoContent, item, maxRetries, onError, retryCount]);

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
    const sourceUrl = getPlayableMediaUrl(item);
    const freshUrl = sourceUrl ? addCacheBuster(sourceUrl) : null;
    setAccessibleUrl(freshUrl);
  }, [item]);

  return {
    isLoading,
    loadError,
    retryCount,
    accessibleUrl,
    effectiveUrl: accessibleUrl, // Use this for rendering
    isVideoContent,
    handleLoad,
    handleError,
    handleRetry
  };
};
