
import { useState, useEffect } from 'react';
import { getPlayableMediaUrl, addCacheBuster } from '@/utils/media/getPlayableMediaUrl';
import { debugMediaUrl } from '@/utils/media/debugMediaUtils';

interface UseMediaHandlerProps {
  item: any;
  onError?: () => void;
  onLoad?: () => void;
}

export const useMediaHandler = ({ 
  item, 
  onError, 
  onLoad 
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
    
    // Add a single cache buster to avoid excessive refreshing
    if (urlToUse) {
      urlToUse = addCacheBuster(urlToUse);
    }
    
    console.log(`Media URL for ${isVideoContent ? 'video' : 'image'}: ${urlToUse}`);
    setAccessibleUrl(urlToUse);
    
  }, [item, isVideoContent]);

  // Handle loading state reset
  useEffect(() => {
    if (accessibleUrl) {
      setIsLoading(true);
      setLoadError(false);
    }
  }, [accessibleUrl]);

  // Debug URL on error to help diagnose issues
  useEffect(() => {
    if (loadError && accessibleUrl) {
      console.log(`Debugging URL that failed to load: ${accessibleUrl}`);
      debugMediaUrl(accessibleUrl);
    }
  }, [loadError, accessibleUrl]);

  const handleError = () => {
    console.error(`Media loading error for ${isVideoContent ? 'video' : 'image'}: ${accessibleUrl}`);
    setLoadError(true);
    setIsLoading(false);
    setRetryCount(prev => prev + 1);
    
    if (onError) onError();
  };

  const handleLoad = () => {
    setIsLoading(false);
    setLoadError(false);
    
    if (onLoad) onLoad();
  };

  const handleRetry = () => {
    setIsLoading(true);
    setLoadError(false);
    setRetryCount(prev => prev + 1);
    
    // Force reload with new cache buster
    if (accessibleUrl) {
      setAccessibleUrl(addCacheBuster(accessibleUrl));
    }
  };

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
