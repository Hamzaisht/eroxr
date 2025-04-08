
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Maximize, X, Volume2, VolumeX, Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { VideoLoadingState } from "./VideoLoadingState";
import { VideoErrorState } from "./VideoErrorState";

interface VideoPlayerProps {
  url: string;
  poster?: string;
  className?: string;
  onError?: () => void;
  autoPlay?: boolean;
  playOnHover?: boolean;
  onClose?: () => void;
  showCloseButton?: boolean;
  isPremium?: boolean;
  videoId?: string;
  creatorId?: string;
  onClick?: () => void;
}

export const VideoPlayer = ({ 
  url, 
  poster, 
  className,
  onError,
  autoPlay = false,
  playOnHover = false,
  onClose,
  showCloseButton = false,
  isPremium = false,
  videoId,
  creatorId,
  onClick
}: VideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string | undefined>(undefined);
  const [retryCount, setRetryCount] = useState(0);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Make sure URL is defined and valid
  const videoUrl = url?.trim() || '';
  const MAX_RETRIES = 2;

  // Add cache buster to URL to prevent stale cache issues
  const getUrlWithCacheBuster = (baseUrl: string) => {
    const timestamp = Date.now();
    const separator = baseUrl.includes('?') ? '&' : '?';
    return `${baseUrl}${separator}t=${timestamp}`;
  };

  // Log video URL for debugging
  useEffect(() => {
    if (videoUrl) {
      console.info("Loading video from URL:", videoUrl);
    } else {
      console.warn("No video URL provided");
    }
  }, [videoUrl]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => {
      setIsLoaded(true);
      setIsLoading(false);
      setHasError(false);
      console.log("Video loaded successfully:", videoUrl);
      
      if (autoPlay) {
        video.play().catch(e => {
          console.error("Autoplay failed:", e);
          // Don't set error state on autoplay failure, just log it
        });
      }
    };

    const handleError = (e: Event) => {
      console.error("Video loading error:", e);
      const videoElement = e.target as HTMLVideoElement;
      
      // Get detailed error information
      let errorMsg = "Unknown video error";
      
      if (videoElement.error) {
        switch (videoElement.error.code) {
          case 1:
            errorMsg = "Video loading aborted";
            break;
          case 2:
            errorMsg = "Network error while loading video";
            break;
          case 3:
            errorMsg = "Video decoding failed";
            break;
          case 4:
            errorMsg = "Video not supported";
            break;
          default:
            errorMsg = `Error code: ${videoElement.error.code}`;
        }
        
        if (videoElement.error.message) {
          errorMsg += ` - ${videoElement.error.message}`;
        }
      }
      
      // Check if we should retry automatically
      if (retryCount < MAX_RETRIES) {
        console.log(`Auto-retrying video load (${retryCount + 1}/${MAX_RETRIES})...`);
        setRetryCount(prevCount => prevCount + 1);
        
        // Try with cache buster
        const newUrl = getUrlWithCacheBuster(videoUrl);
        videoElement.src = newUrl;
        videoElement.load();
        
        // Don't set error state yet, just trying again
        return;
      }
      
      setErrorDetails(errorMsg);
      setHasError(true);
      setIsLoading(false);
      if (onError) onError();
    };

    // Set up loading state
    setIsLoading(true);
    setIsLoaded(false);
    setHasError(false);

    video.addEventListener("loadedData", handleLoadedData);
    video.addEventListener("error", handleError);

    // Force reload the video with cache buster
    try {
      const urlWithCacheBuster = getUrlWithCacheBuster(videoUrl);
      video.src = urlWithCacheBuster;
      video.load();
    } catch (err) {
      console.error("Error while loading video:", err);
      setHasError(true);
      setIsLoading(false);
      setErrorDetails("Error loading video player");
    }

    return () => {
      video.removeEventListener("loadedData", handleLoadedData);
      video.removeEventListener("error", handleError);
    };
  }, [videoUrl, onError, autoPlay, retryCount]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(error => {
          console.error('Video playback error:', error);
          toast({
            title: "Playback Error",
            description: "Unable to play video. Please try again.",
            variant: "destructive",
          });
        });
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const newMuteState = !isMuted;
    videoRef.current.muted = newMuteState;
    setIsMuted(newMuteState);
  };

  const handleRetry = () => {
    if (!videoRef.current) return;
    
    setIsLoading(true);
    setHasError(false);
    setRetryCount(0);
    
    // Create a new URL with cache buster to avoid browser caching
    const newUrl = getUrlWithCacheBuster(videoUrl);
    
    videoRef.current.src = newUrl;
    videoRef.current.load();
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    
    try {
      if (document.fullscreenElement) {
        document.exitFullscreen().then(() => setIsFullscreen(false)).catch(console.error);
      } else {
        containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(console.error);
      }
    } catch (error) {
      console.error("Fullscreen error:", error);
      toast({
        title: "Fullscreen Error",
        description: "Unable to enter fullscreen mode.",
        variant: "destructive",
      });
    }
  };

  // Handle video tap to toggle play/pause when requested
  const handleVideoTap = (e: React.MouseEvent) => {
    if (onClick) {
      onClick();
      return;
    }
    
    // Prevent click from reaching controls underneath
    e.preventDefault();
    e.stopPropagation();
    togglePlay();
  };

  return (
    <div 
      ref={containerRef}
      className={cn(
        "relative overflow-hidden bg-black",
        className
      )}
      onClick={onClick && !isPlaying ? onClick : undefined}
    >
      {/* Loading State */}
      {isLoading && <VideoLoadingState />}
      
      {/* Error State */}
      {hasError && (
        <VideoErrorState 
          message={errorDetails || "Failed to load video"} 
          onRetry={handleRetry}
        />
      )}
      
      {/* Video Element */}
      <video
        ref={videoRef}
        src={videoUrl}
        poster={poster}
        muted={isMuted}
        playsInline
        loop
        className={cn(
          "w-full h-full object-contain",
          isLoading || hasError ? "invisible" : "visible",
          onClick ? "cursor-pointer" : ""
        )}
        onClick={!onClick ? handleVideoTap : undefined}
      />
      
      {/* Video Controls - only show when video is visible and not in error state */}
      {!isLoading && !hasError && !onClick && (
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full bg-black/20 hover:bg-black/40"
              onClick={togglePlay}
              type="button"
            >
              {isPlaying ? (
                <Pause className="h-4 w-4 text-white" />
              ) : (
                <Play className="h-4 w-4 text-white" />
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full bg-black/20 hover:bg-black/40"
              onClick={toggleMute}
              type="button"
            >
              {isMuted ? (
                <VolumeX className="h-4 w-4 text-white" />
              ) : (
                <Volume2 className="h-4 w-4 text-white" />
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full bg-black/20 hover:bg-black/40 ml-auto"
              onClick={toggleFullscreen}
              type="button"
            >
              <Maximize className="h-4 w-4 text-white" />
            </Button>
            
            {showCloseButton && onClose && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full bg-black/20 hover:bg-black/40"
                onClick={onClose}
                type="button"
              >
                <X className="h-4 w-4 text-white" />
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
