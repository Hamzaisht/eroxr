
import { useState, useEffect } from "react";
import { getPlayableMediaUrl, addCacheBuster, checkUrlAccessibility } from "@/utils/media/getPlayableMediaUrl";
import { 
  debugMediaUrl, 
  handleJsonContentTypeIssue, 
  forceFetchAsContentType,
  isDebugErrorResponse
} from "@/utils/media/debugMediaUtils";

interface UseMediaHandlerProps {
  item: any;
  onError?: () => void;
  onLoad?: () => void;
}

export const useMediaHandler = ({ item, onError, onLoad }: UseMediaHandlerProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [displayUrl, setDisplayUrl] = useState<string | null>(null);
  const [accessibleUrl, setAccessibleUrl] = useState<boolean>(true);
  const [fallbackUrl, setFallbackUrl] = useState<string | null>(null);

  // Initialize the media URL
  useEffect(() => {
    const setupMediaUrl = async () => {
      try {
        const url = getPlayableMediaUrl(item);
        setMediaUrl(url);
        
        if (url) {
          // Add cache buster to URL
          const cachedUrl = addCacheBuster(url);
          setDisplayUrl(cachedUrl);
          
          // Check if URL is accessible
          const isAccessible = await checkUrlAccessibility(cachedUrl || '');
          setAccessibleUrl(isAccessible);
          
          if (!isAccessible) {
            console.warn("Media URL is not accessible:", cachedUrl);
          }
        } else {
          setLoadError(true);
          setIsLoading(false);
          if (onError) onError();
        }
        
        console.debug("Media processed:", { 
          original: item?.media_url || item?.video_url,
          resolvedUrl: url,
          cachedUrl: displayUrl,
          isAccessible: accessibleUrl
        });
        
        setIsLoading(true);
        setLoadError(false);
        setRetryCount(0);
      } catch (error) {
        console.error("Error processing media URL:", error);
        setLoadError(true);
        setIsLoading(false);
        if (onError) onError();
      }
    };
    
    setupMediaUrl();
  }, [item]);

  // Handle successful media load
  const handleLoad = () => {
    setIsLoading(false);
    setLoadError(false);
    if (onLoad) onLoad();
  };
  
  // Handle media loading error
  const handleError = () => {
    setIsLoading(false);
    setLoadError(true);
    
    if (displayUrl) {
      // Try to debug the URL issue
      debugMediaUrl(displayUrl).then(result => {
        console.log("Media URL debug result:", result);
        
        if (!isDebugErrorResponse(result)) {
          // If content type mismatch detected, try to fix it
          if (result.isJSON || 
              (result.contentType && result.contentType.includes('application/json'))) {
            
            // Try to handle JSON content type issue
            handleJsonContentTypeIssue(displayUrl).then(fixedUrl => {
              if (fixedUrl) {
                setFallbackUrl(fixedUrl);
                setLoadError(false);
                setIsLoading(true);
              }
            });
          }
        }
      });
    }
    
    console.error("Media load error:", { 
      url: displayUrl,
      item,
      accessibleUrl
    });
    
    if (retryCount < 2) {
      setRetryCount(prev => prev + 1);
      setTimeout(() => {
        if (retryCount === 1 && !fallbackUrl && displayUrl) {
          // On second retry, try force fetch approach
          const mediaType = isVideo(item, displayUrl) ? 'video' : 'image';
          forceFetchAsContentType(displayUrl, mediaType)
            .then(forcedUrl => {
              if (forcedUrl) {
                setFallbackUrl(forcedUrl);
                setLoadError(false);
                setIsLoading(true);
                return;
              }
              
              // If that fails too, try a fresh URL
              const freshUrl = mediaUrl ? addCacheBuster(mediaUrl) : null;
              setDisplayUrl(freshUrl);
              setLoadError(false);
              setIsLoading(true);
            });
        } else {
          // First retry - just use a fresh cache-busted URL
          const freshUrl = mediaUrl ? addCacheBuster(mediaUrl) : null;
          setDisplayUrl(freshUrl);
          setLoadError(false);
          setIsLoading(true);
        }
      }, 1000);
    } else if (onError) {
      onError();
    }
  };
  
  // Handle manual retry
  const handleRetry = () => {
    setLoadError(false);
    setIsLoading(true);
    setRetryCount(0);
    
    // On manual retry, try all approaches
    if (displayUrl) {
      // Try the content-type fix approach
      handleJsonContentTypeIssue(displayUrl)
        .then(fixedUrl => {
          if (fixedUrl) {
            setFallbackUrl(fixedUrl);
            return;
          }
          
          // If that fails, try force fetch
          const mediaType = isVideo(item, displayUrl) ? 'video' : 'image';
          return forceFetchAsContentType(displayUrl, mediaType);
        })
        .then(forcedUrl => {
          if (forcedUrl) {
            setFallbackUrl(forcedUrl);
          } else {
            // Last resort - fresh URL
            const freshUrl = mediaUrl ? addCacheBuster(mediaUrl) : null;
            setDisplayUrl(freshUrl);
          }
        });
    }
  };

  // Helper to determine if content is video
  const isVideo = (item: any, url: string | null): boolean => {
    return item?.content_type === "video" || 
           item?.media_type === "video" || 
           (url && (
             url.toLowerCase().endsWith(".mp4") || 
             url.toLowerCase().endsWith(".webm") || 
             url.toLowerCase().endsWith(".mov") ||
             url.includes("video")
           ));
  };

  // Determine which URL to use
  const effectiveUrl = fallbackUrl || displayUrl;
  
  // Determine if content is video
  const isVideoContent = isVideo(item, effectiveUrl);

  return {
    isLoading,
    loadError,
    retryCount,
    accessibleUrl,
    effectiveUrl,
    isVideoContent,
    handleLoad,
    handleError,
    handleRetry
  };
};
