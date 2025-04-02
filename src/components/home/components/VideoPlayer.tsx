
import { useState, useEffect, useRef, forwardRef } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, VolumeX, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface VideoPlayerProps {
  url: string;
  index?: number;
  poster?: string;
  isMuted: boolean;
  isCurrentVideo: boolean;
  onMuteChange: (muted: boolean) => void;
  onIndexChange?: (index: number) => void;
  className?: string;
  onError?: () => void;
}

export const VideoPlayer = forwardRef<HTMLVideoElement, VideoPlayerProps>(({
  url,
  index,
  poster,
  isMuted,
  isCurrentVideo,
  onMuteChange,
  onIndexChange,
  className,
  onError
}, ref) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const internalVideoRef = useRef<HTMLVideoElement>(null);
  
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

  useEffect(() => {
    const video = getVideoElement();
    if (!video) return;

    const handleLoadedData = () => {
      setIsLoaded(true);
      setIsBuffering(false);
      console.log("Video loaded successfully:", url);
      if (video.paused && isCurrentVideo) {
        video.play().catch(console.error);
      }
    };

    const handleWaiting = () => {
      setIsBuffering(true);
    };

    const handlePlaying = () => {
      setIsBuffering(false);
    };

    const handleError = (e: Event) => {
      console.error("Video loading error:", e);
      setIsBuffering(false);
      if (onError) onError();
    };

    video.addEventListener("loadeddata", handleLoadedData);
    video.addEventListener("waiting", handleWaiting);
    video.addEventListener("playing", handlePlaying);
    video.addEventListener("error", handleError);

    // Reset video state when URL changes
    setIsPlaying(false);
    setIsLoaded(false);
    setIsBuffering(true);
    video.load();

    return () => {
      video.removeEventListener("loadeddata", handleLoadedData);
      video.removeEventListener("waiting", handleWaiting);
      video.removeEventListener("playing", handlePlaying);
      video.removeEventListener("error", handleError);
    };
  }, [url, onError, isCurrentVideo]);

  useEffect(() => {
    const video = getVideoElement();
    if (!video) return;

    if (isCurrentVideo) {
      video.play().catch(console.error);
    } else {
      video.pause();
      video.currentTime = 0;
    }
  }, [isCurrentVideo]);

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
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!getVideoElement()) return;
    onMuteChange(!isMuted);
  };

  // Handle video tap to toggle play/pause
  const handleVideoTap = (e: React.MouseEvent) => {
    // Prevent click from reaching controls underneath
    e.preventDefault();
    e.stopPropagation();
    togglePlay();
  };

  return (
    <div className={cn("relative group", className)}>
      {isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <Loader2 className="w-8 h-8 animate-spin text-white" />
        </div>
      )}
      
      <video
        ref={videoRef as React.RefObject<HTMLVideoElement>}
        src={url}
        poster={poster}
        muted={isMuted}
        playsInline
        loop
        className="w-full h-full object-cover"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onClick={handleVideoTap}
      />
      
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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
        </div>
      </div>
    </div>
  );
});

VideoPlayer.displayName = "VideoPlayer";
