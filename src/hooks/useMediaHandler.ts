
import { useState, useEffect } from "react";
import { getPlayableMediaUrl, addCacheBuster, checkUrlAccessibility } from "@/utils/media/getPlayableMediaUrl";
import { 
  debugMediaUrl, 
  handleJsonContentTypeIssue, 
  forceFetchAsContentType,
  isDebugErrorResponse
} from "@/utils/media/debugMediaUtils";
import { checkUrlContentType, inferContentTypeFromUrl, fixUrlContentType } from "@/utils/media/urlUtils";
import { supabase } from "@/integrations/supabase/client";

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
  const [contentTypeInfo, setContentTypeInfo] = useState<{
    contentType: string | null;
    isValid: boolean;
  }>({ contentType: null, isValid: true });

  // Initialize the media URL
  useEffect(() => {
    const setupMediaUrl = async () => {
      try {
        // Get basic playable URL
        const url = getPlayableMediaUrl(item);
        setMediaUrl(url);
        
        if (url) {
          // Try to get a signed URL for Supabase storage
          if (url.includes('supabase') && url.includes('/storage/v1/object/public/')) {
            try {
              // Extract bucket and path information
              const storagePattern = /\/storage\/v1\/object\/public\/([^\/]+)\/(.+)/;
              const match = url.match(storagePattern);
              
              if (match) {
                const bucket = match[1];
                const path = match[2].split('?')[0]; // Remove query params
                
                // Try to get a signed URL with extended expiry
                const { data, error } = await supabase.storage
                  .from(bucket)
                  .createSignedUrl(path, 60 * 60); // 1 hour expiry
                  
                if (data?.signedUrl && !error) {
                  console.log("Created signed URL for media:", data.signedUrl);
                  setDisplayUrl(data.signedUrl);
                  setAccessibleUrl(true);
                } else {
                  // Fallback to standard URL with cache buster
                  const cachedUrl = addCacheBuster(url);
                  setDisplayUrl(cachedUrl);
                  
                  // Check if URL is accessible
                  const isAccessible = await checkUrlAccessibility(cachedUrl || '');
                  setAccessibleUrl(isAccessible);
                }
              } else {
                // Not a Supabase URL we can parse, use standard approach
                const cachedUrl = addCacheBuster(url);
                setDisplayUrl(cachedUrl);
                
                // Check if URL is accessible
                const isAccessible = await checkUrlAccessibility(cachedUrl || '');
                setAccessibleUrl(isAccessible);
              }
            } catch (err) {
              console.error("Error creating signed URL:", err);
              // Fallback to standard URL with cache buster
              const cachedUrl = addCacheBuster(url);
              setDisplayUrl(cachedUrl);
            }
          } else {
            // Not a Supabase URL, use standard approach
            const cachedUrl = addCacheBuster(url);
            setDisplayUrl(cachedUrl);
            
            // Check if URL is accessible
            const isAccessible = await checkUrlAccessibility(cachedUrl || '');
            setAccessibleUrl(isAccessible);
          }
          
          setIsLoading(true);
          setLoadError(false);
          setRetryCount(0);
        } else {
          setLoadError(true);
          setIsLoading(false);
          if (onError) onError();
        }
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
    
    console.error("Media load error:", { 
      url: displayUrl,
      item,
      accessibleUrl
    });
    
    if (retryCount < 3) {
      setRetryCount(prev => prev + 1);
      setTimeout(() => {
        // On first retry, just use a fresh cache-busted URL
        if (retryCount === 0) {
          const freshUrl = mediaUrl ? addCacheBuster(mediaUrl) : null;
          setDisplayUrl(freshUrl);
          setLoadError(false);
          setIsLoading(true);
        }
        // On second retry, check if it's a Supabase URL and try to sign it
        else if (retryCount === 1 && mediaUrl && mediaUrl.includes('supabase') && mediaUrl.includes('/storage/v1/object/public/')) {
          try {
            const storagePattern = /\/storage\/v1\/object\/public\/([^\/]+)\/(.+)/;
            const match = mediaUrl.match(storagePattern);
            
            if (match) {
              const bucket = match[1];
              const path = match[2].split('?')[0];
              
              // Try to get a signed URL with extended expiry
              supabase.storage
                .from(bucket)
                .createSignedUrl(path, 60 * 60 * 24) // 24 hour expiry
                .then(({ data }) => {
                  if (data?.signedUrl) {
                    console.log("Got signed URL on retry:", data.signedUrl);
                    setDisplayUrl(data.signedUrl);
                    setLoadError(false);
                    setIsLoading(true);
                    return;
                  }
                  
                  // If that fails, try force fetch approach
                  const mediaType = isVideo(item, displayUrl!) ? 'video' : 'image';
                  return forceFetchAsContentType(displayUrl!, mediaType);
                })
                .then(forcedUrl => {
                  if (forcedUrl) {
                    setFallbackUrl(forcedUrl);
                    setLoadError(false);
                    setIsLoading(true);
                    return;
                  }
                })
                .catch(err => {
                  console.error("Error in retry:", err);
                  // Last resort - fresh URL
                  const freshUrl = mediaUrl ? addCacheBuster(mediaUrl) : null;
                  setDisplayUrl(freshUrl);
                  setLoadError(false);
                  setIsLoading(true);
                });
            } else {
              // Not a Supabase URL we can parse, try force fetch approach
              const mediaType = isVideo(item, displayUrl!) ? 'video' : 'image';
              forceFetchAsContentType(displayUrl!, mediaType)
                .then(forcedUrl => {
                  if (forcedUrl) {
                    setFallbackUrl(forcedUrl);
                    setLoadError(false);
                    setIsLoading(true);
                    return;
                  }
                  
                  // Last resort - fresh URL
                  const freshUrl = mediaUrl ? addCacheBuster(mediaUrl) : null;
                  setDisplayUrl(freshUrl);
                  setLoadError(false);
                  setIsLoading(true);
                });
            }
          } catch (err) {
            console.error("Error in second retry:", err);
            // Fallback to standard approach
            const freshUrl = mediaUrl ? addCacheBuster(mediaUrl) : null;
            setDisplayUrl(freshUrl);
            setLoadError(false);
            setIsLoading(true);
          }
        }
        // On third retry, try force fetch as last resort
        else {
          // Try the force fetch approach
          if (displayUrl) {
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
            // Last resort - fresh URL
            const freshUrl = mediaUrl ? addCacheBuster(mediaUrl) : null;
            setDisplayUrl(freshUrl);
            setLoadError(false);
            setIsLoading(true);
          }
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
    
    // On manual retry, try get a signed URL first if it's a Supabase URL
    if (mediaUrl && mediaUrl.includes('supabase') && mediaUrl.includes('/storage/v1/object/public/')) {
      try {
        const storagePattern = /\/storage\/v1\/object\/public\/([^\/]+)\/(.+)/;
        const match = mediaUrl.match(storagePattern);
        
        if (match) {
          const bucket = match[1];
          const path = match[2].split('?')[0];
          
          // Try to get a signed URL with extended expiry
          supabase.storage
            .from(bucket)
            .createSignedUrl(path, 60 * 60 * 24) // 24 hour expiry
            .then(({ data }) => {
              if (data?.signedUrl) {
                setDisplayUrl(data.signedUrl);
                return;
              }
              
              // If that fails, try force fetch approach
              const mediaType = isVideo(item, mediaUrl) ? 'video' : 'image';
              return forceFetchAsContentType(mediaUrl, mediaType);
            })
            .then(forcedUrl => {
              if (forcedUrl) {
                setFallbackUrl(forcedUrl);
              } else {
                // Last resort - fresh URL
                const freshUrl = addCacheBuster(mediaUrl);
                setDisplayUrl(freshUrl);
              }
            })
            .catch(() => {
              // Fallback to standard approach
              const freshUrl = addCacheBuster(mediaUrl);
              setDisplayUrl(freshUrl);
            });
        } else {
          // Not a Supabase URL we can parse, use standard approach
          const freshUrl = addCacheBuster(mediaUrl);
          setDisplayUrl(freshUrl);
        }
      } catch (err) {
        console.error("Error in manual retry:", err);
        // Fallback to standard approach
        const freshUrl = addCacheBuster(mediaUrl);
        setDisplayUrl(freshUrl);
      }
    } else if (mediaUrl) {
      // Not a Supabase URL, use standard approach
      const freshUrl = addCacheBuster(mediaUrl);
      setDisplayUrl(freshUrl);
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
    contentTypeInfo,
    handleLoad,
    handleError,
    handleRetry
  };
};
