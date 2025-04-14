
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { WatermarkOverlay } from "./WatermarkOverlay";
import { getUsernameForWatermark } from "@/utils/watermarkUtils";
import { useMediaQuery } from "@/hooks/use-mobile";
import { addCacheBuster } from "@/utils/mediaUtils";

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
  const [retryUrl, setRetryUrl] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    // Reset state when URL changes
    setLoaded(false);
    setError(false);
    setRetryUrl(null);
    setRetryCount(0);
    
    if (showWatermark && creatorId) {
      getUsernameForWatermark(creatorId)
        .then(name => setUsername(name))
        .catch(() => setUsername(null));
    }
  }, [url, showWatermark, creatorId]);

  const handleLoad = () => {
    setLoaded(true);
    setError(false);
    if (onLoad) onLoad();
  };

  const handleError = () => {
    // If we're already at retry URL and still failing
    if (retryUrl === url) {
      setError(true);
      setLoaded(false);
      if (onError) onError();
      return;
    }
    
    // If we have a URL that failed, try to diagnose the issue
    if (url) {
      console.error(`Failed to load image from URL: ${url}`);
      
      // Try to load the image again with a new cache buster
      // Make sure we're not adding cache busters recursively
      const newRetryUrl = addCacheBuster(url);
      setRetryUrl(newRetryUrl);
      setRetryCount(prev => prev + 1);
      
      // Create and test a new image element
      const testImg = new Image();
      testImg.onload = () => {
        console.log("Image loaded successfully on retry with direct element");
        // Update our state to use the successful URL
        setError(false);
        setLoaded(true);
        if (onLoad) onLoad();
      };
      testImg.onerror = () => {
        console.error("Image failed to load even on retry with direct element");
        setError(true);
        setLoaded(false);
        if (onError) onError();
      };
      testImg.src = newRetryUrl;
    } else {
      setError(true);
      setLoaded(false);
      if (onError) onError();
    }
  };

  if (!url && !retryUrl) {
    return (
      <Skeleton className={`w-full h-full ${className}`} />
    );
  }

  const effectiveUrl = retryUrl || url;

  return (
    <div
      className={`relative ${className} overflow-hidden bg-black/20 ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      {!loaded && !error && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Skeleton className="w-full h-full" />
        </div>
      )}
      
      <img
        src={effectiveUrl}
        alt={alt}
        className={`w-full h-full object-cover ${loaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
        onLoad={handleLoad}
        onError={handleError}
        loading="eager"
      />
      
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
