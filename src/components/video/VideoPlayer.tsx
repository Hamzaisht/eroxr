
import { useState, useEffect, useRef, forwardRef } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, VolumeX, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { addCacheBuster, buildStorageUrl } from "@/utils/media/getPlayableMediaUrl";
import { WatermarkOverlay } from "@/components/media/WatermarkOverlay";

interface VideoPlayerProps {
  url: string;
  index?: number;
  poster?: string;
  isMuted?: boolean;
  isCurrentVideo?: boolean;
  onMuteChange?: (muted: boolean) => void;
  onIndexChange?: (index: number) => void;
  className?: string;
  onError?: () => void;
  autoPlay?: boolean;
  creatorId?: string;
}

export const VideoPlayer = forwardRef<HTMLVideoElement, VideoPlayerProps>(({
  url,
  index,
  poster,
  isMuted = true,
  isCurrentVideo = false,
  onMuteChange,
  onIndexChange,
  className,
  onError,
  autoPlay = false,
  creatorId
}, ref) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  internalVideoRef = useRef<HTMLVideoElement>(null);
  
  // Safely handle the forwarded ref, which could be a function ref or an object ref
  const videoRef = ref || internalVideoRef;
  
  // Get actual video element, handling both function and object refs
  const getVideoElement = () => {
    if (!videoRef) return null;
    
    // For object refs (RefObject)
    if ('current' in videoRef) {
      return videoRef.current;
    }
    
    // For internal ref as fallback
    return internalVideoRef.current;
  };
  
  const { toast } = useToast();

  // Add cache buster to URL
  const videoUrl = addCacheBuster(url);

  useEffect(() => {
    const video = getVideoElement();
    if (!video) return;

    const handleLoadedData = () => {
      setIsLoaded(true);
      setIsBuffering(false);
      setHasError(false);
      console.log("Video loaded successfully:", url);
      
      // Auto play if current video or autoPlay is true
      if ((isCurrentVideo || autoPlay) && video.paused) {
        video.play().catch(error => {
          console.warn("Autoplay prevented:", error);
        });
      }
    };

    const handleWaiting = () => {
      setIsBuffering(true);
    };

    const handlePlaying = () => {
      setIsBuffering(false);
      setIsPlaying(true);
    };

    const handleError = (e: Event) => {
      console.error("Video loading error:", e, url);
      setIsBuffering(false);
      setHasError(true);
      
      // Auto retry a couple of times
      if (retryCount < 2) {
        console.log(`Auto retrying video load (${retryCount + 1}/2):`, url);
        setRetryCount(prev => prev + 1);
        
        // Wait a moment and retry with a fresh URL
        setTimeout(() => {
          if (video) {
            video.load();
          }
        }, 1000);
      } else if (onError) {
        onError();
      }
    };
    
    const handlePause = () => {
      setIsPlaying(false);
    };

    // Set up event handlers
    video.addEventListener("loadeddata", handleLoadedData);
    video.addEventListener("waiting", handleWaiting);
    video.addEventListener("playing", handlePlaying);
    video.addEventListener("error", handleError);
    video.addEventListener("pause", handlePause);

    return () => {
      video.removeEventListener("loadeddata", handleLoadedData);
      video.removeEventListener("waiting", handleWaiting);
      video.removeEventListener("playing", handlePlaying);
      video.removeEventListener("error", handleError);
      video.removeEventListener("pause", handlePause);
    };
  }, [url, retryCount, isCurrentVideo, autoPlay, onError]);

  // Handle playback state changes
  useEffect(() => {
    const video = getVideoElement();
    if (!video) return;
    
    if (isCurrentVideo && !isBuffering && !hasError) {
      video.play().catch(err => {
        console.warn("Video play error:", err);
      });
    } 
  }, [isCurrentVideo, isBuffering, hasError]);
  
  // Handle mute state
  useEffect(() => {
    const video = getVideoElement();
    if (video) {
      video.muted = isMuted;
    }
  }, [isMuted]);

  const togglePlay = () => {
    const video = getVideoElement();
    if (!video) return;
    
    if (isPlaying) {
      video.pause();
    } else {
      video.play().catch(error => {
        console.error('Video playback error:', error);
        toast({
          title: "Playback Error",
          description: "Unable to play video. Please try again.",
          variant: "destructive",
        });
      });
      
      if (typeof index !== 'undefined' && onIndexChange) {
        onIndexChange(index);
      }
    }
  };

  const toggleMute = () => {
    if (!onMuteChange) return;
    onMuteChange(!isMuted);
  };
  
  const handleRetry = () => {
    setHasError(false);
    setIsBuffering(true);
    setRetryCount(0);
    
    const video = getVideoElement();
    if (video) {
      video.load();
      video.play().catch(console.error);
    }
  };

  return (
    <div className={cn("relative group", className)}>
      {isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-10">
          <Loader2 className="w-8 h-8 animate-spin text-white" />
        </div>
      )}
      
      {hasError && retryCount >= 2 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-10">
          <AlertCircle className="w-12 h-12 text-red-500 mb-2" />
          <p className="text-white mb-4">Failed to load video</p>
          <Button
            variant="default"
            className="flex items-center gap-2"
            onClick={handleRetry}
          >
            <RefreshCw className="h-4 w-4" /> 
            Retry
          </Button>
        </div>
      )}
      
      <video
        ref={videoRef as React.RefObject<HTMLVideoElement>}
        src={videoUrl || undefined}
        poster={poster}
        muted={isMuted}
        playsInline
        loop
        className="w-full h-full object-cover"
        onClick={togglePlay}
      />
      
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full bg-black/20 hover:bg-black/40"
            onClick={togglePlay}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4 text-white" />
            ) : (
              <Play className="h-4 w-4 text-white" />
            )}
          </Button>
          
          {onMuteChange && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full bg-black/20 hover:bg-black/40"
              onClick={toggleMute}
            >
              {isMuted ? (
                <VolumeX className="h-4 w-4 text-white" />
              ) : (
                <Volume2 className="h-4 w-4 text-white" />
              )}
            </Button>
          )}
        </div>
      </div>
      
      {/* Add watermark if creator ID is provided */}
      {creatorId && !isBuffering && !hasError && (
        <WatermarkOverlay username={creatorId} />
      )}
    </div>
  );
});

VideoPlayer.displayName = "VideoPlayer";
