
import { useState, useEffect } from "react";
import { getPlayableMediaUrl, addCacheBuster } from "@/utils/media/getPlayableMediaUrl";
import { getContentType } from "@/utils/mediaUtils";
import { VideoPlayer } from "@/components/video/VideoPlayer";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { ErrorComponent } from "@/components/ErrorComponent";

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
  
  // Get media URL using our utility function and add cache buster
  useEffect(() => {
    try {
      const url = getPlayableMediaUrl(item);
      setMediaUrl(url);
      
      // Add cache buster to prevent caching issues
      const cachedUrl = url ? addCacheBuster(url) : null;
      setDisplayUrl(cachedUrl);
      
      // Debug log
      console.debug("Media processed:", { 
        original: item?.media_url || item?.video_url,
        resolvedUrl: url,
        cachedUrl
      });
      
      // Reset states when item or URL changes
      setIsLoading(true);
      setLoadError(false);
      setRetryCount(0);
    } catch (error) {
      console.error("Error processing media URL:", error);
      setLoadError(true);
      setIsLoading(false);
    }
  }, [item]);
  
  // Determine media type
  const isVideo = 
    item?.content_type === "video" || 
    item?.media_type === "video" || 
    (displayUrl && (
      displayUrl.toLowerCase().endsWith(".mp4") || 
      displayUrl.toLowerCase().endsWith(".webm") || 
      displayUrl.toLowerCase().endsWith(".mov") ||
      displayUrl.includes("video")
    ));
  
  const handleLoad = () => {
    setIsLoading(false);
    setLoadError(false);
    if (onLoad) onLoad();
  };
  
  const handleError = () => {
    setIsLoading(false);
    setLoadError(true);
    
    console.error("Media load error:", { 
      url: displayUrl,
      item 
    });
    
    // Try retry logic
    if (retryCount < 2) {
      setRetryCount(prev => prev + 1);
      // Allow some time before retry
      setTimeout(() => {
        // Get a fresh URL with a new cache buster
        const freshUrl = mediaUrl ? addCacheBuster(mediaUrl) : null;
        setDisplayUrl(freshUrl);
        setLoadError(false);
        setIsLoading(true);
      }, 2000);
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
    // Get a fresh URL with a new cache buster
    const freshUrl = mediaUrl ? addCacheBuster(mediaUrl) : null;
    setDisplayUrl(freshUrl);
  };
  
  // If media URL couldn't be determined
  if (!displayUrl) {
    return <ErrorComponent message="Media unavailable" className={className} />;
  }
  
  // Handle click
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div 
      className={`relative ${className}`}
      onClick={handleClick}
    >
      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
          <Loader2 className="h-8 w-8 animate-spin text-white/80" />
        </div>
      )}
      
      {/* Error state with retry */}
      {loadError && retryCount >= 2 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 z-10">
          <AlertCircle className="h-10 w-10 text-red-500 mb-2" />
          <p className="text-white/80 mb-3">Failed to load media</p>
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
      
      {/* Media content */}
      {isVideo ? (
        <VideoPlayer
          url={displayUrl}
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
        <img
          src={displayUrl}
          alt={item?.alt_text || "Media content"}
          className={`w-full h-full object-cover ${loadError ? 'hidden' : ''}`}
          onLoad={handleLoad}
          onError={handleError}
          style={{ display: isLoading ? 'none' : 'block' }}
          crossOrigin="anonymous"
        />
      )}
    </div>
  );
};
