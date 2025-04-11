
import { useState } from "react";
import { getPlayableMediaUrl, addCacheBuster } from "@/utils/media/getPlayableMediaUrl";
import { getContentType } from "@/utils/mediaUtils";
import { VideoPlayer } from "@/components/video/VideoPlayer";
import { Loader2, AlertCircle } from "lucide-react";
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
  
  // Get media URL using our utility function
  const mediaUrl = getPlayableMediaUrl(item);
  
  // Add cache buster to prevent caching issues
  const displayUrl = mediaUrl ? addCacheBuster(mediaUrl) : null;
  
  // Determine media type
  const isVideo = 
    item?.content_type === "video" || 
    item?.media_type === "video" || 
    (displayUrl && (
      displayUrl.toLowerCase().endsWith(".mp4") || 
      displayUrl.toLowerCase().endsWith(".webm") || 
      displayUrl.toLowerCase().endsWith(".mov")
    ));
  
  const handleLoad = () => {
    setIsLoading(false);
    setLoadError(false);
    if (onLoad) onLoad();
  };
  
  const handleError = () => {
    setIsLoading(false);
    setLoadError(true);
    if (onError) onError();
    
    console.error("Media load error:", { 
      url: displayUrl,
      item 
    });
  };
  
  const handleEnded = () => {
    if (onEnded) onEnded();
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
      
      {/* Error state */}
      {loadError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 z-10">
          <AlertCircle className="h-10 w-10 text-red-500 mb-2" />
          <p className="text-white/80">Failed to load media</p>
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
        />
      )}
    </div>
  );
};
