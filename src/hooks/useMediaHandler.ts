
import { useState, useEffect, useCallback } from 'react';
import { getPlayableMediaUrl, addCacheBuster } from '@/utils/media/getPlayableMediaUrl';
import { debugMediaUrl } from '@/utils/media/debugMediaUtils';
import { fixUrlContentType, inferContentTypeFromUrl } from '@/utils/media/urlUtils';

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
  const [fixedUrl, setFixedUrl] = useState<string | null>(null);
  
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
    
    // If we can determine content type, try to infer and fix
    if (sourceUrl) {
      const inferredType = inferContentTypeFromUrl(sourceUrl);
      
      // If we're dealing with media that might have content-type mismatches
      const withCacheBuster = addCacheBuster(sourceUrl);
      setAccessibleUrl(withCacheBuster);
      
      // Try to create a blob URL with the correct content type if we can infer it
      if (inferredType && (isVideoContent || sourceUrl.includes('supabase'))) {
        fixUrlContentType(withCacheBuster || sourceUrl, inferredType)
          .then(blobUrl => {
            setFixedUrl(blobUrl);
          })
          .catch(() => {
            // If fixing fails, continue with normal URL
            console.log("Failed to create blob URL with correct content type");
            setFixedUrl(null);
          });
      } else {
        setFixedUrl(null);
      }
    } else {
      setAccessibleUrl(null);
      setFixedUrl(null);
    }
    
    setIsLoading(true);
    setLoadError(false);
    setRetryCount(0);
  }, [item, isVideoContent]);

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
    
    // If we're using a blob URL and it failed, try falling back to the original URL
    if (fixedUrl && retryCount === 0) {
      console.log("Blob URL failed, falling back to original URL");
      setFixedUrl(null); // Will force using accessibleUrl instead
      setRetryCount(prev => prev + 1);
      setIsLoading(true);
      setLoadError(false);
      return;
    }
    
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
        
        // If previously trying with blob URL failed, don't try again
        if (retryCount === 1 && fixedUrl) {
          setFixedUrl(null);
        }
      }, delay);
    } else if (onError) {
      onError();
    }
  }, [accessibleUrl, fixedUrl, isVideoContent, item, maxRetries, onError, retryCount]);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
    setLoadError(false);
    
    if (onLoad) onLoad();
  }, [onLoad]);

  const handleRetry = useCallback(() => {
    setIsLoading(true);
    setLoadError(false);
    setRetryCount(0);
    setFixedUrl(null);
    
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
    effectiveUrl: fixedUrl || accessibleUrl, // Use blob URL if available, otherwise normal URL
    isVideoContent,
    handleLoad,
    handleError,
    handleRetry
  };
};
