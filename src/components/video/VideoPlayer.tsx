
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, VolumeX, Loader2, AlertCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { getUsernameForWatermark } from "@/utils/watermarkUtils";

interface VideoPlayerProps {
  url: string;
  poster?: string;
  className?: string;
  autoPlay?: boolean;
  onError?: () => void;
  onEnded?: () => void;
  onLoadedData?: () => void;
  creatorId?: string;
  playOnHover?: boolean;
  showCloseButton?: boolean;
  onClose?: () => void;
  onClick?: () => void;
  controls?: boolean;
}

export const VideoPlayer = ({ 
  url, 
  poster,
  className,
  autoPlay = false,
  onError,
  onEnded,
  creatorId,
  playOnHover = false,
  showCloseButton = false,
  onClose,
  onLoadedData,
  onClick,
  controls = true
}: VideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const handleError = () => {
    setError(true);
    setIsLoading(false);
    if (onError) onError();
  };
  
  const handleLoad = () => {
    setIsLoading(false);
    setError(false);
    if (onLoadedData) onLoadedData();
  };
  
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(error => {
          console.error("Error playing video:", error);
          if (onError) onError();
        });
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };
  
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleVideoEnded = () => {
      if (onEnded) onEnded();
    };
    
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleVideoEnded);
    
    if (autoPlay && !isLoading) {
      video.play().catch(error => console.error("Autoplay prevented:", error));
    }
    
    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleVideoEnded);
    };
  }, [autoPlay, isLoading, onEnded]);

  return (
    <div 
      className={cn("relative overflow-hidden", className)}
      onClick={onClick}
    >
      {/* Loading state */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
          <Loader2 className="h-8 w-8 animate-spin text-white/80" />
        </div>
      )}
      
      {/* Error state */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-10">
          <div className="text-center">
            <AlertCircle className="mx-auto h-10 w-10 text-red-500 mb-2" />
            <p className="text-white/90">Failed to load video</p>
          </div>
        </div>
      )}
      
      {/* Video element */}
      <video
        ref={videoRef}
        src={url}
        poster={poster}
        className="w-full h-full object-cover"
        muted={isMuted}
        playsInline
        loop
        controls={controls}
        onError={handleError}
        onLoadedData={handleLoad}
        onEnded={onEnded}
      />
      
      {/* Video controls overlay */}
      {controls && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 hover:opacity-100 transition-opacity">
          <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full bg-black/30 text-white hover:bg-black/50"
              onClick={(e) => {
                e.stopPropagation();
                togglePlay();
              }}
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full bg-black/30 text-white hover:bg-black/50"
              onClick={(e) => {
                e.stopPropagation();
                toggleMute();
              }}
            >
              {isMuted ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          {showCloseButton && onClose && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8 rounded-full bg-black/30 text-white hover:bg-black/50"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
