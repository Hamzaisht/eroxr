
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, VolumeX, Maximize, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { VideoLoadingState } from "./VideoLoadingState";
import { VideoErrorState } from "./VideoErrorState";
import { VideoControls } from "./VideoControls";

interface VideoPlayerMobileProps {
  url: string;
  poster?: string;
  className?: string;
  onError?: () => void;
  autoPlay?: boolean;
  isActive?: boolean;
  onClose?: () => void;
  showCloseButton?: boolean;
}

export const VideoPlayerMobile = ({ 
  url, 
  poster, 
  className,
  onError,
  autoPlay = false,
  isActive = false,
  onClose,
  showCloseButton = false
}: VideoPlayerMobileProps) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track touch events for swipe gesture
  const touchStartY = useRef<number | null>(null);
  const touchEndY = useRef<number | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => {
      setIsLoaded(true);
      setHasError(false);
      if (autoPlay && isActive) {
        video.play().catch(e => console.error("Autoplay failed:", e));
      }
    };

    const handleError = (e: Event) => {
      console.error("Video loading error:", e);
      setHasError(true);
      setIsLoaded(false);
      if (onError) onError();
    };

    video.addEventListener("loadeddata", handleLoadedData);
    video.addEventListener("error", handleError);

    // Reset video state when URL changes
    setIsPlaying(autoPlay && isActive);
    setIsLoaded(false);
    setHasError(false);
    
    if (isActive) {
      video.load();
    }

    return () => {
      video.removeEventListener("loadeddata", handleLoadedData);
      video.removeEventListener("error", handleError);
    };
  }, [url, onError, autoPlay, isActive]);

  // Handle active state changes
  useEffect(() => {
    if (!videoRef.current) return;
    
    if (isActive) {
      if (isLoaded && !hasError) {
        videoRef.current.play().catch(e => console.error("Play failed on active:", e));
        setIsPlaying(true);
      }
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [isActive, isLoaded, hasError]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(error => {
        console.error('Video playback error:', error);
      });
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleRetry = () => {
    if (!videoRef.current) return;
    
    setIsRetrying(true);
    setHasError(false);
    
    // Force reload the video element
    videoRef.current.load();
    
    // Set a timeout to reset retry state
    setTimeout(() => {
      setIsRetrying(false);
    }, 3000);
  };

  // Handle touch events for swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = () => {
    if (!touchStartY.current || !touchEndY.current) return;
    
    const yDiff = touchStartY.current - touchEndY.current;
    const threshold = 80; // minimum distance for swipe
    
    // Emit custom events for parent component to handle
    if (Math.abs(yDiff) > threshold) {
      const event = new CustomEvent(
        yDiff > 0 ? 'swipeUp' : 'swipeDown',
        { bubbles: true }
      );
      containerRef.current?.dispatchEvent(event);
    }
    
    // Reset values
    touchStartY.current = null;
    touchEndY.current = null;
  };

  return (
    <div 
      ref={containerRef}
      className={cn(
        "relative overflow-hidden bg-black w-full h-full",
        className
      )}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Video container */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        {/* Loading state */}
        {!isLoaded && !hasError && !isRetrying && <VideoLoadingState />}
        
        {/* Error state */}
        {hasError && !isRetrying && (
          <VideoErrorState 
            onRetry={handleRetry} 
            errorDetails="The video could not be loaded. Please try again."
          />
        )}
        
        {isRetrying && <VideoLoadingState />}
        
        <video
          ref={videoRef}
          src={url}
          poster={poster}
          muted={isMuted}
          playsInline
          loop
          className={cn(
            "w-full h-full object-cover",
            (hasError || !isLoaded) && "opacity-0",
            isLoaded && !hasError && "opacity-100 transition-opacity duration-300"
          )}
          style={{
            objectFit: "cover",
            backgroundColor: "black",
            maxWidth: "100%",
            maxHeight: "100%"
          }}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onClick={togglePlay}
        />
      </div>
      
      {/* Close button if provided */}
      {showCloseButton && onClose && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 z-50 h-8 w-8 rounded-full bg-black/50 hover:bg-black/70 text-white"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
      
      {/* Video controls */}
      <VideoControls
        isPlaying={isPlaying}
        isMuted={isMuted}
        onPlayPause={togglePlay}
        onMuteToggle={toggleMute}
      />
    </div>
  );
};
