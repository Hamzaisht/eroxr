
import { useState } from 'react';
import { Fullscreen, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { MediaType } from '@/types/media';
import { calculateAspectRatioDimensions } from '@/utils/media/mediaUtils';
import { getPlayableMediaUrl } from '@/utils/media/urlUtils';

interface MediaContentProps {
  mediaUrl?: string;
  mediaType?: MediaType;
  className?: string;
  showControls?: boolean;
  showCloseButton?: boolean;
  creatorId?: string;
  showWatermark?: boolean;
  onClose?: () => void;
  autoPlay?: boolean;
  onClick?: () => void;
  poster?: string;
}

// Add this interface to fix the VideoPlayer props error
interface VideoPlayerProps {
  url: string;
  className?: string;
  showCloseButton?: boolean;
  onClose?: () => void;
  autoPlay?: boolean;
  onError?: () => void;
  onLoad?: () => void;
  onClick?: () => void;
}

export function MediaContent({
  mediaUrl,
  mediaType = MediaType.IMAGE,
  className,
  showControls = true,
  showCloseButton = false,
  creatorId,
  showWatermark = false,
  onClose,
  autoPlay = false,
  onClick,
  poster
}: MediaContentProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  
  if (!mediaUrl) {
    return (
      <div className={cn(
        "bg-gray-900 rounded-md flex items-center justify-center",
        className
      )}>
        <p className="text-gray-400 text-sm">No media available</p>
      </div>
    );
  }
  
  const playableUrl = getPlayableMediaUrl(mediaUrl);
  
  const handleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFullscreen(true);
  };
  
  const handleCloseFullscreen = () => {
    setIsFullscreen(false);
  };
  
  const handleImageLoad = () => {
    setIsLoaded(true);
    setHasError(false);
  };
  
  const handleImageError = () => {
    setHasError(true);
    setIsLoaded(true); // We still set loaded to true to hide loading state
  };
  
  const renderMedia = () => {
    switch (mediaType) {
      case MediaType.VIDEO:
        return <VideoPlayer 
          url={playableUrl} 
          className={className || "w-full h-full object-contain"}
          showCloseButton={showCloseButton}
          onClose={onClose}
          autoPlay={autoPlay}
          onError={() => setHasError(true)}
          onLoad={() => setIsLoaded(true)}
          onClick={onClick}
        />;
        
      case MediaType.IMAGE:
        return (
          <div 
            className={cn(
              "relative overflow-hidden",
              isLoaded && !hasError ? "" : "bg-gray-900",
              className
            )}
            onClick={onClick}
          >
            {!isLoaded && !hasError && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 animate-pulse">
                <p className="text-white text-opacity-80">Loading...</p>
              </div>
            )}
            
            {hasError ? (
              <div className="w-full h-full min-h-[200px] flex flex-col items-center justify-center bg-gray-900 text-gray-400">
                <p>Failed to load image</p>
                <Button size="sm" variant="outline" className="mt-2" onClick={() => window.open(mediaUrl, '_blank')}>
                  Open directly
                </Button>
              </div>
            ) : (
              <img
                src={playableUrl}
                alt="Media content"
                className={cn(
                  "w-full h-full object-contain",
                  isLoaded ? "opacity-100" : "opacity-0"
                )}
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
            )}
            
            {showWatermark && isLoaded && !hasError && (
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 px-2 py-1 rounded text-xs text-white">
                eroxr
              </div>
            )}
            
            {showCloseButton && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 p-1"
                onClick={onClose}
              >
                <X className="h-4 w-4 text-white" />
              </Button>
            )}
            
            {showControls && isLoaded && !hasError && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 p-1"
                onClick={handleFullscreen}
              >
                <Fullscreen className="h-4 w-4 text-white" />
              </Button>
            )}
          </div>
        );
        
      default:
        return (
          <div className={cn(
            "bg-gray-900 rounded-md flex items-center justify-center p-4",
            className
          )}>
            <p className="text-gray-400">Unsupported media type</p>
          </div>
        );
    }
  };
  
  // Calculate aspect ratio dimensions for modal display
  const aspectRatio = mediaType === MediaType.VIDEO ? 16/9 : 4/3;
  const { width, height } = calculateAspectRatioDimensions(1200, 1200/aspectRatio, 1200, 800);
  
  return (
    <>
      {renderMedia()}
      
      <Dialog open={isFullscreen} onOpenChange={handleCloseFullscreen}>
        <DialogContent 
          className="max-w-[95vw] max-h-[95vh] p-0 overflow-hidden" 
          style={{ 
            width: mediaType === MediaType.VIDEO ? '90vw' : 'auto',
            height: mediaType === MediaType.VIDEO ? '90vh' : 'auto' 
          }}
        >
          {mediaType === MediaType.IMAGE ? (
            <div className="relative w-full h-full max-h-[90vh] flex items-center justify-center bg-black">
              <img 
                src={playableUrl} 
                alt="Media content" 
                className="max-w-full max-h-[90vh] object-contain"
              />
              
              {showWatermark && (
                <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 px-2 py-1 rounded text-sm text-white">
                  eroxr
                </div>
              )}
              
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70"
                onClick={handleCloseFullscreen}
              >
                <X className="h-5 w-5 text-white" />
              </Button>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-black">
              <video
                src={playableUrl}
                className="max-w-full max-h-[90vh]"
                controls
                autoPlay
                poster={poster}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function VideoPlayer({ url, className, showCloseButton, onClose, autoPlay, onError, onLoad, onClick }: VideoPlayerProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  
  const handleLoadedData = () => {
    setIsLoaded(true);
    if (onLoad) onLoad();
  };
  
  const handleError = () => {
    if (onError) onError();
  };
  
  return (
    <div className={cn("relative overflow-hidden", className)} onClick={onClick}>
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 animate-pulse">
          <p className="text-white text-opacity-80">Loading video...</p>
        </div>
      )}
      
      <video
        src={url}
        className="w-full h-full object-contain"
        controls
        autoPlay={autoPlay}
        onLoadedData={handleLoadedData}
        onError={handleError}
        playsInline
      />
      
      {showCloseButton && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 p-1"
          onClick={onClose}
        >
          <X className="h-4 w-4 text-white" />
        </Button>
      )}
    </div>
  );
}
