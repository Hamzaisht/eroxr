import { useState, useEffect } from "react";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { getPlayableMediaUrl, addCacheBuster } from "@/utils/media/getPlayableMediaUrl";
import { 
  debugMediaUrl, 
  attemptImageCorsWorkaround, 
  fetchImageAsBlob, 
  extractDirectImagePath,
  tryAllImageLoadingStrategies,
  handleJsonContentTypeIssue,
  forceFetchAsContentType,
  isDebugErrorResponse
} from "@/utils/media/debugMediaUtils";
import { WatermarkOverlay } from "@/components/media/WatermarkOverlay";
import { cn } from "@/lib/utils";
import { checkUrlContentType, inferContentTypeFromUrl, fixUrlContentType } from "@/utils/media/urlUtils";
import { supabase } from "@/integrations/supabase/client";

interface MediaImageProps {
  url: string | null;
  alt?: string;
  className?: string;
  onLoad?: () => void;
  onError?: () => void;
  showWatermark?: boolean;
  creatorId?: string;
  onClick?: () => void;
}

export const MediaImage = ({
  url,
  alt = "Image",
  className = "",
  onLoad,
  onError,
  showWatermark = false,
  creatorId,
  onClick
}: MediaImageProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [displayUrl, setDisplayUrl] = useState<string | null>(null);
  const [useFallbackImage, setUseFallbackImage] = useState(false);
  const [fallbackDataUrl, setFallbackDataUrl] = useState<string | null>(null);
  const [isCorsError, setIsCorsError] = useState(false);
  const [isContentTypeMismatch, setIsContentTypeMismatch] = useState(false);
  const [loadingStrategy, setLoadingStrategy] = useState<string>('standard');

  useEffect(() => {
    if (!url) {
      setLoadError(true);
      setIsLoading(false);
      return;
    }
    
    // Process the URL
    const processUrl = async () => {
      setIsLoading(true);
      setLoadError(false);
      setUseFallbackImage(false);
      setIsCorsError(false);
      setIsContentTypeMismatch(false);
      setLoadingStrategy('standard');
      
      // Generate basic URL
      const processedUrl = getPlayableMediaUrl({ media_url: url });
      let cachedUrl = processedUrl ? addCacheBuster(processedUrl) : null;
      
      console.log("MediaImage - original URL:", url);
      console.log("MediaImage - processed URL:", processedUrl);
      
      // If URL contains Supabase storage and appears to be failing, try to get a signed URL
      if (processedUrl && processedUrl.includes('supabase') && processedUrl.includes('/storage/v1/object/public/')) {
        try {
          // Extract bucket and path information
          const storagePattern = /\/storage\/v1\/object\/public\/([^\/]+)\/(.+)/;
          const match = processedUrl.match(storagePattern);
          
          if (match) {
            const bucket = match[1];
            const path = match[2].split('?')[0]; // Remove query params
            
            console.log(`Trying signed URL approach for bucket: ${bucket}, path: ${path}`);
            
            // Try to get a signed URL with extended expiry
            const { data, error } = await supabase.storage
              .from(bucket)
              .createSignedUrl(path, 60 * 60); // 1 hour expiry
              
            if (data?.signedUrl && !error) {
              console.log("Successfully created signed URL:", data.signedUrl);
              cachedUrl = data.signedUrl;
              setLoadingStrategy('signed-url');
            } else {
              console.warn("Failed to create signed URL:", error);
            }
          }
        } catch (err) {
          console.error("Error creating signed URL:", err);
        }
      }
      
      // Try direct path as backup strategy
      const directUrl = processedUrl ? extractDirectImagePath(processedUrl) : null;
      if (directUrl && (!cachedUrl || cachedUrl.includes('supabase'))) {
        console.log("Also trying direct path approach:", directUrl);
        // Keep the signed URL as primary, but store direct URL as backup
        if (!cachedUrl) {
          cachedUrl = addCacheBuster(directUrl);
          setLoadingStrategy('direct-path');
        }
      }
      
      setDisplayUrl(cachedUrl);
    };
    
    processUrl();
    setRetryCount(0);
  }, [url]);
  
  const handleLoad = () => {
    setIsLoading(false);
    setLoadError(false);
    if (onLoad) onLoad();
  };
  
  const handleError = () => {
    setIsLoading(false);
    setLoadError(true);
    
    // Debug and attempt recovery
    if (displayUrl) {
      console.error(`Image load error for URL: ${displayUrl}`);
      
      // Try different strategies for recovery
      if (retryCount < 3) {
        setRetryCount(prev => prev + 1);
        
        setTimeout(() => {
          // On first retry - add a new cache buster
          if (retryCount === 0) {
            const freshUrl = url ? addCacheBuster(getPlayableMediaUrl({ media_url: url })) : null;
            setDisplayUrl(freshUrl);
            setIsLoading(true);
            setLoadError(false);
            setLoadingStrategy('fresh-url-retry');
          } 
          // On second retry - try force fetch approach
          else if (retryCount === 1) {
            forceFetchAsContentType(displayUrl!, 'image')
              .then(forcedUrl => {
                if (forcedUrl) {
                  setFallbackDataUrl(forcedUrl);
                  setUseFallbackImage(true);
                  setIsLoading(true);
                  setLoadError(false);
                  setLoadingStrategy('forced-type-retry');
                } else {
                  // If that fails, try direct URL
                  const directPath = url && extractDirectImagePath(url);
                  if (directPath) {
                    const directUrl = addCacheBuster(directPath);
                    setDisplayUrl(directUrl);
                    setIsLoading(true);
                    setLoadError(false);
                    setLoadingStrategy('direct-path-retry');
                  }
                }
              });
          }
          // On third retry - try signed URL approach directly
          else if (retryCount === 2 && url && url.includes('supabase')) {
            try {
              // Extract bucket and path information
              const storagePattern = /\/storage\/v1\/object\/public\/([^\/]+)\/(.+)/;
              const match = url.match(storagePattern);
              
              if (match) {
                const bucket = match[1];
                const path = match[2].split('?')[0]; // Remove query params
                
                // Try to get a signed URL with extended expiry
                supabase.storage
                  .from(bucket)
                  .createSignedUrl(path, 60 * 60 * 24) // 24 hour expiry
                  .then(({ data }) => {
                    if (data?.signedUrl) {
                      setDisplayUrl(data.signedUrl);
                      setIsLoading(true);
                      setLoadError(false);
                      setLoadingStrategy('direct-signed-url');
                    }
                  });
              }
            } catch (err) {
              console.error("Error in third retry:", err);
            }
          }
        }, 1000);
      } else if (onError) {
        onError();
      }
    } else if (onError) {
      onError();
    }
  };
  
  const handleRetry = () => {
    setRetryCount(0);
    setIsLoading(true);
    setLoadError(false);
    setUseFallbackImage(false);
    
    // Try all strategies at once for manual retry
    if (url) {
      // This is a user-initiated retry, so we'll be more aggressive
      // Start by getting a fresh signed URL if it's a Supabase URL
      if (url.includes('supabase') && url.includes('/storage/v1/object/')) {
        try {
          const storagePattern = /\/storage\/v1\/object\/public\/([^\/]+)\/(.+)/;
          const match = url.match(storagePattern);
          
          if (match) {
            const bucket = match[1];
            const path = match[2].split('?')[0]; // Remove query params
            
            // Try to get a signed URL with extended expiry
            supabase.storage
              .from(bucket)
              .createSignedUrl(path, 60 * 60 * 24) // 24 hour expiry
              .then(({ data }) => {
                if (data?.signedUrl) {
                  console.log("Manual retry: Got fresh signed URL");
                  setDisplayUrl(data.signedUrl);
                  setLoadingStrategy('manual-signed-url');
                  return;
                }
                
                // If signed URL fails, try direct path approach
                const directPath = extractDirectImagePath(url);
                if (directPath) {
                  console.log("Manual retry: Trying direct path");
                  setDisplayUrl(addCacheBuster(directPath));
                  setLoadingStrategy('manual-direct-path');
                } else {
                  // Last resort - fresh standard URL
                  const freshUrl = addCacheBuster(url);
                  setDisplayUrl(freshUrl);
                  setLoadingStrategy('manual-standard');
                }
              })
              .catch(() => {
                // Try direct blob fetch as fallback
                fetchImageAsBlob(url).then(blobUrl => {
                  if (blobUrl) {
                    setFallbackDataUrl(blobUrl);
                    setUseFallbackImage(true);
                    setLoadingStrategy('manual-blob');
                  } else {
                    const freshUrl = addCacheBuster(url);
                    setDisplayUrl(freshUrl);
                    setLoadingStrategy('manual-fallback');
                  }
                });
              });
          }
        } catch (err) {
          console.error("Error in manual retry:", err);
          const freshUrl = addCacheBuster(url);
          setDisplayUrl(freshUrl);
          setLoadingStrategy('manual-error-fallback');
        }
      } else {
        // Non-Supabase URL, try standard approaches
        const processedUrl = getPlayableMediaUrl({ media_url: url });
        if (processedUrl) {
          // Try all strategies
          tryAllImageLoadingStrategies(processedUrl)
            .then(result => {
              if (result.success) {
                setFallbackDataUrl(result.url);
                setUseFallbackImage(true);
                setLoadingStrategy(`manual-retry-${result.strategy}`);
              } else {
                const freshUrl = addCacheBuster(processedUrl);
                setDisplayUrl(freshUrl);
                setLoadingStrategy('manual-retry-standard');
              }
            });
        }
      }
    }
  };
  
  const handleImageClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };
  
  if (!displayUrl && !useFallbackImage) {
    return (
      <div className={`flex items-center justify-center bg-luxury-darker/50 ${className}`}>
        <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
        <p className="text-white/70">Image unavailable</p>
      </div>
    );
  }
  
  return (
    <div 
      className={cn(
        "relative overflow-hidden",
        className
      )}
      onClick={handleImageClick}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
          <Loader2 className="h-8 w-8 animate-spin text-white/80" />
        </div>
      )}
      
      {loadError && retryCount >= 3 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 z-10">
          <AlertCircle className="h-10 w-10 text-red-500 mb-2" />
          <p className="text-white/80 mb-3 text-center px-4">
            Failed to load image
          </p>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleRetry();
            }}
            className="flex items-center gap-2 px-3 py-2 bg-white/20 hover:bg-white/30 text-white rounded"
          >
            <RefreshCw className="h-4 w-4" /> 
            Retry
          </button>
          <div className="text-white/50 text-xs mt-2 px-2 text-center">
            {loadingStrategy !== 'standard' && `Last attempt: ${loadingStrategy}`}
          </div>
        </div>
      )}
      
      {/* Use fallback data URL if available */}
      {useFallbackImage && fallbackDataUrl ? (
        <img
          src={fallbackDataUrl}
          alt={alt}
          className={cn(
            "w-full h-full object-cover",
            loadError ? 'hidden' : ''
          )}
          onLoad={handleLoad}
          onError={handleError}
          style={{ display: isLoading ? 'none' : 'block' }}
        />
      ) : (
        <img
          src={displayUrl || ''}
          alt={alt}
          className={cn(
            "w-full h-full object-cover",
            loadError ? 'hidden' : ''
          )}
          onLoad={handleLoad}
          onError={handleError}
          style={{ display: isLoading ? 'none' : 'block' }}
          crossOrigin="anonymous"
        />
      )}

      {showWatermark && !loadError && !isLoading && creatorId && (
        <WatermarkOverlay 
          username={creatorId} 
          creatorId={creatorId} 
        />
      )}
    </div>
  );
};
