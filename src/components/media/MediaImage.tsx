
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
  const [contentTypeInfo, setContentTypeInfo] = useState<{
    contentType: string | null;
    isValid: boolean;
  }>({ contentType: null, isValid: true });
  
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
      
      // Process the URL
      const processedUrl = getPlayableMediaUrl({ media_url: url });
      let cachedUrl = processedUrl ? addCacheBuster(processedUrl) : null;
      
      console.log("MediaImage - original URL:", url);
      console.log("MediaImage - processed URL:", processedUrl);
      
      // Try alternate path approach if the URL contains storage/v1/object/public
      const directUrl = processedUrl ? extractDirectImagePath(processedUrl) : null;
      if (directUrl) {
        console.log("Trying direct path approach:", directUrl);
        cachedUrl = addCacheBuster(directUrl);
        setLoadingStrategy('direct-path');
      }
      
      setDisplayUrl(cachedUrl);
      
      // Pre-check content type
      if (cachedUrl && !cachedUrl.startsWith('data:') && !cachedUrl.includes(window.location.origin)) {
        try {
          // Check URL content type
          const contentTypeResult = await checkUrlContentType(cachedUrl);
          setContentTypeInfo({
            contentType: contentTypeResult.contentType,
            isValid: contentTypeResult.isValid
          });
          
          console.log(`Content type check for ${cachedUrl}:`, contentTypeResult);
          
          // Handle content type issues
          if (
            !contentTypeResult.isValid && 
            contentTypeResult.status === 200 &&
            contentTypeResult.contentType === 'application/json'
          ) {
            // We have a content type mismatch - wrong content type but successful response
            setIsContentTypeMismatch(true);
            
            // Try to infer correct content type from URL
            const inferredType = inferContentTypeFromUrl(cachedUrl);
            if (inferredType) {
              console.log(`Inferred content type: ${inferredType} for ${cachedUrl}`);
              
              // Fix the content type
              const fixedUrl = await fixUrlContentType(cachedUrl, inferredType);
              if (fixedUrl && fixedUrl !== cachedUrl) {
                setFallbackDataUrl(fixedUrl);
                setUseFallbackImage(true);
                setLoadingStrategy('content-type-fix');
                console.log(`Fixed content type using blob URL: ${fixedUrl}`);
                return;
              }
            }
            
            // If we couldn't infer or fix, try additional strategies
            const result = await tryAllImageLoadingStrategies(cachedUrl);
            if (result.success) {
              setFallbackDataUrl(result.url);
              setUseFallbackImage(true);
              setLoadingStrategy(`inferred-${result.strategy}`);
              return;
            }
          } else if (!contentTypeResult.isValid) {
            // Try debug utility
            const debugResult = await debugMediaUrl(cachedUrl);
            console.log("URL debug result:", debugResult);
            
            if (isDebugErrorResponse(debugResult) && debugResult.isCorsError) {
              setIsCorsError(true);
              const corsWorkaround = await attemptImageCorsWorkaround(cachedUrl);
              setFallbackDataUrl(corsWorkaround);
              setUseFallbackImage(true);
              setLoadingStrategy('cors-error-preemptive');
            } else if (!isDebugErrorResponse(debugResult) && debugResult.contentType?.includes('application/json')) {
              // Handle JSON content type
              const fixedUrl = await handleJsonContentTypeIssue(cachedUrl);
              if (fixedUrl) {
                setFallbackDataUrl(fixedUrl);
                setUseFallbackImage(true);
                setLoadingStrategy('json-content-fix');
              }
            }
          }
        } catch (err) {
          console.error("Error during URL pre-check:", err);
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
      console.error(`Image load error for URL: ${displayUrl}`);
      
      // Check if we need to try fixing content type
      if (isContentTypeMismatch || contentTypeInfo.contentType === 'application/json') {
        // Try fixing the content type
        const inferredType = inferContentTypeFromUrl(displayUrl);
        
        if (inferredType) {
          console.log(`Attempting to fix content type to ${inferredType}`);
          
          fixUrlContentType(displayUrl, inferredType)
            .then(fixedUrl => {
              if (fixedUrl !== displayUrl) {
                setFallbackDataUrl(fixedUrl);
                setUseFallbackImage(true);
                setIsLoading(true);
                setLoadError(false);
                setLoadingStrategy('error-content-type-fix');
              }
            })
            .catch(err => {
              console.error("Content type fix failed:", err);
            });
          
          return;
        }
      }
      
      // Try fallback approaches
      if (retryCount < 2) {
        setRetryCount(prev => prev + 1);
        
        setTimeout(() => {
          if (retryCount === 1) {
            // On second retry, try force fetch approach
            const mediaType = 'image';
            forceFetchAsContentType(displayUrl, mediaType)
              .then(forcedUrl => {
                if (forcedUrl) {
                  setFallbackDataUrl(forcedUrl);
                  setUseFallbackImage(true);
                  setIsLoading(true);
                  setLoadError(false);
                  setLoadingStrategy('forced-type-retry');
                  return;
                }
                
                // If that fails too, try a fresh URL
                const freshUrl = url ? addCacheBuster(getPlayableMediaUrl({ media_url: url })) : null;
                setDisplayUrl(freshUrl);
                setIsLoading(true);
                setLoadError(false);
                setLoadingStrategy('fresh-url-retry');
              });
          } else {
            // First retry - use a fresh cache-busted URL
            const freshUrl = url ? addCacheBuster(getPlayableMediaUrl({ media_url: url })) : null;
            setDisplayUrl(freshUrl);
            setIsLoading(true);
            setLoadError(false);
            setLoadingStrategy('simple-retry');
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
    setIsContentTypeMismatch(false);
    setIsCorsError(false);
    
    // Try all strategies at once
    if (url) {
      const processedUrl = getPlayableMediaUrl({ media_url: url });
      if (processedUrl) {
        // First try to fix the content type
        const inferredType = inferContentTypeFromUrl(processedUrl);
        if (inferredType) {
          fixUrlContentType(processedUrl, inferredType)
            .then(fixedUrl => {
              if (fixedUrl !== processedUrl) {
                setFallbackDataUrl(fixedUrl);
                setUseFallbackImage(true);
                setLoadingStrategy('manual-retry-fix');
                return;
              }
              return forceFetchAsContentType(processedUrl, 'image');
            })
            .then(forcedUrl => {
              if (forcedUrl) {
                setFallbackDataUrl(forcedUrl);
                setUseFallbackImage(true);
                setLoadingStrategy('manual-retry-forced');
              } else {
                // Last resort - try all strategies
                return tryAllImageLoadingStrategies(processedUrl);
              }
            })
            .then(result => {
              if (result && result.success) {
                setFallbackDataUrl(result.url);
                setUseFallbackImage(true);
                setLoadingStrategy(`manual-retry-${result.strategy}`);
              } else {
                const freshUrl = addCacheBuster(processedUrl);
                setDisplayUrl(freshUrl);
                setLoadingStrategy('manual-retry-standard');
              }
            })
            .catch(() => {
              // Fallback to standard approach
              const freshUrl = addCacheBuster(processedUrl);
              setDisplayUrl(freshUrl);
              setLoadingStrategy('manual-retry-fallback');
            });
        } else {
          // If we can't infer type, try all strategies
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
          <div className="text-white/50 text-xs mt-2 px-2 text-center">
            {loadingStrategy !== 'standard' && `Last attempt: ${loadingStrategy}`}
            {contentTypeInfo.contentType && ` (server returned: ${contentTypeInfo.contentType})`}
          </div>
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
