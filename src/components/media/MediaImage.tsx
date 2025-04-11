
import { useState, useEffect } from "react";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { getPlayableMediaUrl, addCacheBuster } from "@/utils/media/getPlayableMediaUrl";
import { debugMediaUrl, attemptImageCorsWorkaround, fetchImageAsBlob, extractDirectImagePath } from "@/utils/media/debugMediaUtils";
import { WatermarkOverlay } from "@/components/media/WatermarkOverlay";
import { cn } from "@/lib/utils";

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
      
      // Process the URL
      const processedUrl = getPlayableMediaUrl({ media_url: url });
      let cachedUrl = processedUrl ? addCacheBuster(processedUrl) : null;
      
      // Try alternate path approach if the URL contains storage/v1/object/public
      const directUrl = processedUrl ? extractDirectImagePath(processedUrl) : null;
      if (directUrl) {
        console.log("Trying direct path approach:", directUrl);
        cachedUrl = addCacheBuster(directUrl);
      }
      
      setDisplayUrl(cachedUrl);
      
      // Check for potential CORS issues early
      if (cachedUrl && !cachedUrl.startsWith('data:') && !cachedUrl.includes(window.location.origin)) {
        try {
          // Debug the URL to check for content type issues
          const debugResult = await debugMediaUrl(cachedUrl);
          console.log("URL pre-check result:", debugResult);
          
          // Check if the content type is unexpected (e.g., application/json for an image)
          if (debugResult.contentType && 
              debugResult.contentType.includes('application/json') && 
              cachedUrl.match(/\.(jpg|jpeg|png|gif|webp|avif|svg)$/i)) {
            console.warn("Content type mismatch detected:", debugResult.contentType);
            setIsContentTypeMismatch(true);
            
            // Try to fetch as blob as a fallback
            try {
              const blobUrl = await fetchImageAsBlob(cachedUrl);
              setFallbackDataUrl(blobUrl);
              setUseFallbackImage(true);
              return;
            } catch (err) {
              console.log("Could not fetch as blob:", err);
            }
          }
          
          // For other potential CORS issues, set up a data URL fallback
          if (debugResult.isCorsError || !debugResult.success) {
            try {
              const dataUrl = await attemptImageCorsWorkaround(cachedUrl);
              setFallbackDataUrl(dataUrl);
            } catch (err) {
              console.log("Could not prepare fallback image:", err);
            }
          }
        } catch (err) {
          console.log("Error in URL pre-check:", err);
        }
      }
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
    
    // Debug the URL
    if (displayUrl) {
      debugMediaUrl(displayUrl).then(result => {
        console.log("Image URL debug result:", result);
        
        // Check if this is a CORS error
        if (result.errorType === 'TypeError' || result.isCorsError) {
          setIsCorsError(true);
          
          // Try the fallback data URL approach if we have one
          if (fallbackDataUrl && !useFallbackImage) {
            console.log("Attempting to use fallback data URL approach for CORS issue");
            setUseFallbackImage(true);
            setIsLoading(true);
            setLoadError(false);
            return;
          }
        }
        
        // Check for content type mismatch
        if (result.contentType && result.contentType.includes('application/json')) {
          setIsContentTypeMismatch(true);
          
          // Try blob approach if not already using fallback
          if (!useFallbackImage && displayUrl) {
            fetchImageAsBlob(displayUrl)
              .then(blobUrl => {
                setFallbackDataUrl(blobUrl);
                setUseFallbackImage(true);
                setIsLoading(true);
                setLoadError(false);
              })
              .catch(error => {
                console.error("Failed to fetch image as blob:", error);
              });
            return;
          }
        }
        
        // Auto-retry logic
        if (retryCount < 2) {
          setRetryCount(prev => prev + 1);
          setTimeout(() => {
            // Try a fresh cache-busted URL
            const processedUrl = getPlayableMediaUrl({ media_url: url });
            const freshUrl = processedUrl ? addCacheBuster(processedUrl) : null;
            setDisplayUrl(freshUrl);
            setIsLoading(true);
            setLoadError(false);
          }, 1000 * (retryCount + 1));
        } else if (onError) {
          onError();
        }
      });
    } else if (onError) {
      onError();
    }
  };
  
  const handleRetry = () => {
    setRetryCount(0);
    setIsLoading(true);
    setLoadError(false);
    setUseFallbackImage(false);
    setIsContentTypeMismatch(false);
    
    // Generate a fresh URL
    const processedUrl = getPlayableMediaUrl({ media_url: url });
    const freshUrl = processedUrl ? addCacheBuster(processedUrl) : null;
    
    // If we previously had a content type mismatch, try the blob approach directly
    if (isContentTypeMismatch && freshUrl) {
      fetchImageAsBlob(freshUrl)
        .then(blobUrl => {
          setFallbackDataUrl(blobUrl);
          setUseFallbackImage(true);
        })
        .catch(() => {
          // If blob approach fails, fall back to regular URL
          setDisplayUrl(freshUrl);
        });
    } else {
      setDisplayUrl(freshUrl);
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
      
      {loadError && retryCount >= 2 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 z-10">
          <AlertCircle className="h-10 w-10 text-red-500 mb-2" />
          <p className="text-white/80 mb-3 text-center px-4">
            {isCorsError 
              ? "Cross-origin error: can't load image" 
              : isContentTypeMismatch
                ? "Content type mismatch error"
                : "Failed to load image"}
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
        </div>
      )}
      
      {/* Use fallback data URL if we have CORS issues or content type mismatch */}
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
