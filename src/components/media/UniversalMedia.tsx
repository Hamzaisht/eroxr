import { useState, useEffect } from "react";
import { getPlayableMediaUrl, addCacheBuster, checkUrlAccessibility } from "@/utils/media/getPlayableMediaUrl";
import { getContentType } from "@/utils/mediaUtils";
import { VideoPlayer } from "@/components/video/VideoPlayer";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { ErrorComponent } from "@/components/ErrorComponent";
import { WatermarkOverlay } from "@/components/media/WatermarkOverlay";
import { 
  debugMediaUrl, 
  handleJsonContentTypeIssue, 
  forceFetchAsContentType,
  isDebugErrorResponse
} from "@/utils/media/debugMediaUtils";
import { MediaImage } from "@/components/media/MediaImage";

interface UniversalMediaProps {
  item: any;
  className?: string;
  onError?: () => void;
  onLoad?: () => void;
  onEnded?: () => void;
  onLoadedData?: () => void;
  autoPlay?: boolean;
  controls?: boolean;
  showWatermark?: boolean;
  onClick?: () => void;
}

export const UniversalMedia = ({
  item,
  className = "",
  onError,
  onLoad,
  onEnded,
  onLoadedData,
  autoPlay = false,
  controls = true,
  showWatermark = false,
  onClick
}: UniversalMediaProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [displayUrl, setDisplayUrl] = useState<string | null>(null);
  const [accessibleUrl, setAccessibleUrl] = useState<boolean>(true);
  const [isContentTypeMismatch, setIsContentTypeMismatch] = useState(false);
  const [fallbackUrl, setFallbackUrl] = useState<string | null>(null);
  
  useEffect(() => {
    const setupMediaUrl = async () => {
      try {
        let url = getPlayableMediaUrl(item);
        
        // Special handling for stories bucket which has content-type issues
        if (url && 
            (url.includes('/stories/') || 
             (item.content_type === 'story' || item.media_type === 'story'))) {
          
          console.log("Detected story media, applying special handling");
          
          // If it's from the stories bucket and we can identify it from the URL
          if (url.includes('supabase.co/storage/v1/object/public/stories/')) {
            // Try to modify the URL to use the render endpoint
            url = url.replace(
              'storage/v1/object/public/stories/',
              'storage/v1/render/image/public/stories/'
            );
          }
        }
        
        setMediaUrl(url);
        
        if (url) {
          const cachedUrl = addCacheBuster(url);
          setDisplayUrl(cachedUrl);
          
          const isAccessible = await checkUrlAccessibility(cachedUrl || '');
          setAccessibleUrl(isAccessible);
          
          if (!isAccessible) {
            console.warn("Media URL is not accessible:", cachedUrl);
          }
          
          // Check for content type mismatch proactively
          try {
            const debugResult = await debugMediaUrl(cachedUrl);
            
            // Use our type guard to safely check properties
            if (!isDebugErrorResponse(debugResult)) {
              // Check if this is a JSON response when we expect an image/video
              if (debugResult.isJSON || (debugResult.contentType && debugResult.contentType.includes('application/json'))) {
                console.warn("Content type mismatch detected:", debugResult.contentType);
                setIsContentTypeMismatch(true);
                
                // Try to handle JSON content type issue
                const jsonFixUrl = await handleJsonContentTypeIssue(cachedUrl);
                if (jsonFixUrl) {
                  setFallbackUrl(jsonFixUrl);
                } else {
                  // If JSON fix fails, try force fetch
                  const mediaType = isVideo(item, cachedUrl) ? 'video' : 'image';
                  const forcedUrl = await forceFetchAsContentType(cachedUrl, mediaType);
                  if (forcedUrl) {
                    setFallbackUrl(forcedUrl);
                  }
                }
              }
            }
          } catch (err) {
            console.error("Error in content type check:", err);
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
          isAccessible: accessibleUrl,
          fallbackUrl: fallbackUrl
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
  
  // Determine if the content should be treated as a video
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
  
  const handleLoad = () => {
    setIsLoading(false);
    setLoadError(false);
    if (onLoad) onLoad();
  };
  
  const handleError = () => {
    setIsLoading(false);
    setLoadError(true);
    
    if (displayUrl) {
      debugMediaUrl(displayUrl).then(result => {
        console.log("Media URL debug result:", result);
        
        // Check for content type mismatch using our type guard
        if (!isDebugErrorResponse(result) && result.contentType && result.contentType.includes('application/json')) {
          setIsContentTypeMismatch(true);
          
          handleJsonContentTypeIssue(displayUrl).then(fixedUrl => {
            if (fixedUrl) {
              setFallbackUrl(fixedUrl);
              setLoadError(false);
              setIsLoading(true);
            }
          }).catch(console.error);
        }
      });
    }
    
    console.error("Media load error:", { 
      url: displayUrl,
      item,
      accessibleUrl,
      isContentTypeMismatch
    });
    
    if (retryCount < 3) {
      setRetryCount(prev => prev + 1);
      setTimeout(() => {
        if (retryCount === 1 && !fallbackUrl && displayUrl) {
          // On second retry, try force fetch approach if we don't have a fallback yet
          const mediaType = isVideoContent ? 'video' : 'image';
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
            })
            .catch(() => {
              // Last resort - fresh URL
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
      }, 1000 * (retryCount + 1));
    } else if (onError) {
      onError();
    }
  };
  
  const handleEnded = () => {
    if (onEnded) onEnded();
  };
  
  const handleRetry = () => {
    setLoadError(false);
    setIsLoading(true);
    setRetryCount(0);
    
    // On manual retry, try all approaches
    if (displayUrl) {
      // First try the content-type fix approach
      handleJsonContentTypeIssue(displayUrl)
        .then(fixedUrl => {
          if (fixedUrl) {
            setFallbackUrl(fixedUrl);
            return;
          }
          
          // If that fails, try force fetch
          const mediaType = isVideoContent ? 'video' : 'image';
          return forceFetchAsContentType(displayUrl, mediaType);
        })
        .then(forcedUrl => {
          if (forcedUrl && forcedUrl !== fallbackUrl) {
            setFallbackUrl(forcedUrl);
          } else {
            // Last resort - fresh URL
            const freshUrl = mediaUrl ? addCacheBuster(mediaUrl) : null;
            setDisplayUrl(freshUrl);
          }
        })
        .catch(() => {
          // Fallback to a fresh cache-busted URL
          const url = getPlayableMediaUrl(item);
          setMediaUrl(url);
          const freshUrl = url ? addCacheBuster(url) : null;
          setDisplayUrl(freshUrl);
        });
    }
  };
  
  if (!displayUrl && !fallbackUrl) {
    return <ErrorComponent 
      message="Media unavailable" 
      className={className} 
      onRetry={handleRetry}
    />;
  }
  
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

  // Determine which URL to use
  const effectiveUrl = fallbackUrl || displayUrl;

  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      onClick={handleClick}
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
            {!accessibleUrl 
              ? "Media access error (CORS or authentication)" 
              : isContentTypeMismatch
                ? "Content type mismatch error"
                : "Failed to load media"}
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
          
          <div className="text-white/50 text-xs mt-2">
            {isContentTypeMismatch && "Server returned incorrect content type"}
          </div>
        </div>
      )}
      
      {isVideoContent ? (
        <VideoPlayer
          url={effectiveUrl || ''}
          autoPlay={autoPlay}
          className="w-full h-full"
          onError={handleError}
          onEnded={handleEnded}
          onLoadedData={onLoadedData || handleLoad}
          creatorId={item?.creator_id}
          controls={controls}
          onClick={onClick}
        />
      ) : (
        <MediaImage
          url={effectiveUrl}
          alt={item?.alt_text || "Media content"}
          className="w-full h-full"
          onLoad={handleLoad}
          onError={handleError}
          showWatermark={showWatermark}
          creatorId={item?.creator_id}
          onClick={onClick}
        />
      )}
    </div>
  );
};
