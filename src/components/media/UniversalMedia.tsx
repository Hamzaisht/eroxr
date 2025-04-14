
import { useState } from "react";
import { MediaLoadingState } from "@/components/media/states/MediaLoadingState";
import { MediaErrorState } from "@/components/media/states/MediaErrorState";
import { VideoPlayer } from "@/components/video/VideoPlayer";
import { MediaImage } from "@/components/media/MediaImage";
import { useMediaHandler } from "@/hooks/useMediaHandler";

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
  const [showDebugInfo, setShowDebugInfo] = useState(false);
  
  const {
    isLoading,
    loadError,
    retryCount,
    accessibleUrl,
    effectiveUrl,
    isVideoContent,
    handleLoad,
    handleError,
    handleRetry
  } = useMediaHandler({
    item,
    onError,
    onLoad,
    maxRetries: 3
  });

  if (!effectiveUrl) {
    return (
      <div className={`flex items-center justify-center bg-luxury-darker/80 ${className}`}>
        <p className="text-luxury-neutral py-8">Media unavailable</p>
      </div>
    );
  }
  
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      e.stopPropagation();
      onClick();
    }
  };
  
  // Enable debug info after multiple retries
  if (retryCount >= 2 && !showDebugInfo) {
    setShowDebugInfo(true);
  }

  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      onClick={handleClick}
    >
      {isLoading && <MediaLoadingState />}
      
      {loadError && (
        <MediaErrorState 
          onRetry={handleRetry}
          accessibleUrl={accessibleUrl}
          retryCount={retryCount}
          hideDebugInfo={!showDebugInfo}
        />
      )}
      
      {isVideoContent ? (
        <VideoPlayer
          url={effectiveUrl || ''}
          autoPlay={autoPlay}
          className="w-full h-full"
          onError={handleError}
          onEnded={onEnded}
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
