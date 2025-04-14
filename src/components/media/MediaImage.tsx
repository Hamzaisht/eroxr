
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { WatermarkOverlay } from "./WatermarkOverlay";
import { getUsernameForWatermark } from "@/utils/watermarkUtils";
import { useMediaQuery } from "@/hooks/use-mobile";
import { getDisplayableMediaUrl } from "@/utils/media/urlUtils";
import { AlertCircle, RefreshCw } from "lucide-react"; 

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
  alt = "Media content",
  className = "",
  onLoad,
  onError,
  showWatermark = false,
  creatorId,
  onClick,
}: MediaImageProps) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [retryAttempt, setRetryAttempt] = useState(0);
  const [displayUrl, setDisplayUrl] = useState<string>("");

  // Prepare the media URL and load watermark username
  useEffect(() => {
    // Reset states when URL changes
    setLoaded(false);
    setError(false);
    
    if (!url) return;
    
    // Generate a display URL with cache busting
    setDisplayUrl(getDisplayableMediaUrl(url));
    
    // Try to get watermark username if needed
    if (showWatermark && creatorId) {
      getUsernameForWatermark(creatorId)
        .then(name => setUsername(name))
        .catch(() => setUsername(null));
    }
  }, [url, showWatermark, creatorId, retryAttempt]);

  // Handle successful image load
  const handleLoad = () => {
    setLoaded(true);
    setError(false);
    if (onLoad) onLoad();
  };

  // Handle image loading error
  const handleError = () => {
    // Only show error after we've tried once already
    setError(true);
    setLoaded(false);
    if (onError) onError();
  };
  
  // Retry loading the image with a new cache buster
  const handleRetry = () => {
    setError(false);
    setLoaded(false);
    setRetryAttempt(prev => prev + 1);
  };

  // If no URL is provided, show skeleton
  if (!url) {
    return <Skeleton className={`w-full h-full ${className}`} />;
  }

  return (
    <div
      className={`relative ${className} overflow-hidden bg-black/20 ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      {/* Loading skeleton */}
      {!loaded && !error && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Skeleton className="w-full h-full" />
        </div>
      )}
      
      {/* Error state with retry button */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40">
          <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
          <p className="text-sm text-gray-200 mb-3">Failed to load image</p>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleRetry();
            }}
            className="flex items-center gap-1 px-3 py-1 bg-black/50 hover:bg-black/70 text-white rounded-md"
          >
            <RefreshCw className="h-3 w-3" /> Retry
          </button>
        </div>
      )}
      
      {/* Actual image */}
      <img
        src={displayUrl}
        alt={alt}
        className={`w-full h-full object-cover ${loaded && !error ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
        onLoad={handleLoad}
        onError={handleError}
        loading="eager"
      />
      
      {/* Watermark */}
      {showWatermark && loaded && !error && username && (
        <WatermarkOverlay
          className={isMobile ? 'text-xs' : 'text-sm'}
          username={username}
          creatorId={creatorId}
        />
      )}
    </div>
  );
};
