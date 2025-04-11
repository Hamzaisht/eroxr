
import { useState, useEffect } from "react";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { getPlayableMediaUrl, addCacheBuster } from "@/utils/media/getPlayableMediaUrl";
import { debugMediaUrl } from "@/utils/media/debugMediaUtils";
import { WatermarkOverlay } from "@/components/media/WatermarkOverlay";

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
  
  useEffect(() => {
    if (!url) {
      setLoadError(true);
      setIsLoading(false);
      return;
    }
    
    // Process the URL
    const processedUrl = getPlayableMediaUrl({ media_url: url });
    const cachedUrl = processedUrl ? addCacheBuster(processedUrl) : null;
    setDisplayUrl(cachedUrl);
    
    // Reset state when URL changes
    setIsLoading(true);
    setLoadError(false);
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
      });
    }
    
    console.error("Image load error for URL:", url);
    
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
  };
  
  const handleRetry = () => {
    setRetryCount(0);
    setIsLoading(true);
    setLoadError(false);
    
    // Generate a fresh URL
    const processedUrl = getPlayableMediaUrl({ media_url: url });
    const freshUrl = processedUrl ? addCacheBuster(processedUrl) : null;
    setDisplayUrl(freshUrl);
  };
  
  const handleImageClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };
  
  if (!displayUrl) {
    return (
      <div className={`flex items-center justify-center bg-luxury-darker/50 ${className}`}>
        <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
        <p className="text-white/70">Image unavailable</p>
      </div>
    );
  }
  
  return (
    <div 
      className={`relative overflow-hidden ${className}`}
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
        </div>
      )}
      
      <img
        src={displayUrl}
        alt={alt}
        className={`w-full h-full object-cover ${loadError ? 'hidden' : ''}`}
        onLoad={handleLoad}
        onError={handleError}
        style={{ display: isLoading ? 'none' : 'block' }}
        crossOrigin="anonymous"
      />

      {showWatermark && !loadError && !isLoading && creatorId && (
        <WatermarkOverlay 
          username={creatorId} 
          creatorId={creatorId} 
        />
      )}
    </div>
  );
};
