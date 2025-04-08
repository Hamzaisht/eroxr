
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Maximize, X, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { VideoLoadingState } from "./VideoLoadingState";
import { VideoErrorState } from "./VideoErrorState";
import { PremiumErosOverlay } from "@/components/home/PremiumErosOverlay";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { VideoControls } from "./VideoControls";
import { VideoPremiumCheck } from "./VideoPremiumCheck";
import { VideoFullscreenButton } from "./VideoFullscreenButton";
import { getUsernameForWatermark } from "@/utils/watermarkUtils";

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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [username, setUsername] = useState<string>('eroxr');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const session = useSession();

  const { canPlayFull, previewDuration, handleTimeUpdate } = VideoPremiumCheck({
    isPremium,
    videoId,
    session
  });
  
  useEffect(() => {
    if (creatorId) {
      getUsernameForWatermark(creatorId).then(name => {
        setUsername(name);
      }).catch(error => {
        console.error("Error fetching watermark username:", error);
      });
    }
  }, [creatorId]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => {
      setIsLoaded(true);
      setHasError(false);
      setRetryCount(0);
      console.log("Video loaded successfully:", url);
      if (autoPlay) {
        video.play().catch(e => console.error("Autoplay failed:", e));
      }
    };

    const handleError = (e: Event) => {
      console.error("Video loading error:", e, video.error?.code, video.error?.message);
      setHasError(true);
      setIsLoaded(false);
      if (onError) onError();
    };
    
    const handleWaiting = () => {
      // Video is buffering
      console.log("Video buffering");
    };

    video.addEventListener("loadeddata", handleLoadedData);
    video.addEventListener("error", handleError);
    video.addEventListener("waiting", handleWaiting);

    // Reset states when URL changes
    setIsLoaded(false);
    setHasError(false);
    if (url) {
      // For some video URLs, use query string to avoid caching
      const timestamp = Date.now();
      const videoUrl = url.includes('?') ? 
        `${url}&_t=${timestamp}` : 
        `${url}?_t=${timestamp}`;
      
      // Use proper URL handling for network issues
      try {
        video.src = videoUrl;
        video.load();
      } catch (err) {
        console.error("Error setting video source:", err);
        setHasError(true);
      }
    }

    return () => {
      video.removeEventListener("loadeddata", handleLoadedData);
      video.removeEventListener("error", handleError);
      video.removeEventListener("waiting", handleWaiting);
    };
  }, [url, onError, autoPlay]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(error => {
        console.error('Video playback error:', error);
        toast({
          title: "Playback Error",
          description: "Unable to play video. Please try again.",
          variant: "destructive",
        });
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
    setRetryCount(prev => prev + 1);
    
    // Create a new URL with cache buster
    const cacheBuster = `?cacheBuster=${Date.now()}`;
    const urlWithCacheBuster = url.includes('?') 
      ? `${url}&cacheBuster=${Date.now()}`
      : `${url}${cacheBuster}`;
    
    // Completely reload the video element
    try {
      videoRef.current.src = urlWithCacheBuster;
      videoRef.current.load();
      
      // Set a timeout to reset retry state if it's taking too long
      setTimeout(() => {
        if (!isLoaded) {
          setIsRetrying(false);
          setHasError(true);
        }
      }, 10000); // 10 second timeout
    } catch (error) {
      console.error("Error reloading video:", error);
      setIsRetrying(false);
      setHasError(true);
    }
  };

  const { toggleFullscreen } = VideoFullscreenButton({
    containerRef,
    setIsFullscreen,
    toast
  });

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    if (!playOnHover || !videoRef.current) return;
    
    const container = containerRef.current;
    if (!container) return;
    
    const handleMouseEnter = () => {
      if (videoRef.current) {
        videoRef.current.play().catch(e => console.error("Hover play failed:", e));
        setIsPlaying(true);
      }
    };
    
    const handleMouseLeave = () => {
      if (videoRef.current) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    };
    
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [playOnHover]);

  return (
    <div 
      ref={containerRef}
      className={cn(
        "relative group overflow-hidden bg-black w-full h-full",
        className
      )}
      onClick={onClick}
    >
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        {!isLoaded && !hasError && !isRetrying && <VideoLoadingState />}
        
        {hasError && !isRetrying && (
          <VideoErrorState 
            onRetry={handleRetry} 
            errorDetails="Failed to load media content. Please try again later."
          />
        )}
        
        {isRetrying && <VideoLoadingState />}
        
        <video
          ref={videoRef}
          muted={isMuted}
          playsInline
          loop={canPlayFull}
          onTimeUpdate={handleTimeUpdate}
          className={cn(
            "w-full h-full object-contain",
            (hasError || !isLoaded) && "opacity-0",
            isLoaded && !hasError && "opacity-100 transition-opacity duration-300"
          )}
          style={{
            objectFit: "contain",
            backgroundColor: "black",
            maxWidth: "100%",
            maxHeight: "100%"
          }}
          poster={poster}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onClick={(e) => {
            if (onClick) {
              e.stopPropagation();
              onClick();
            } else {
              e.stopPropagation();
              togglePlay();
            }
          }}
        />
      </div>
      
      {isLoaded && !hasError && creatorId && (
        <div className="watermark-overlay">
          www.eroxr.com/@{username}
        </div>
      )}

      {isPremium && !canPlayFull && isLoaded && (
        <PremiumErosOverlay 
          thumbnailUrl={poster}
          previewDuration={previewDuration}
        />
      )}
      
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/60 to-transparent z-10"></div>
      
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
      
      {showCloseButton && onClose && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 z-50 h-8 w-8 rounded-full bg-black/50 hover:bg-black/70 text-white"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
      
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute bottom-4 left-4 flex items-center gap-2">
          <VideoControls 
            isPlaying={isPlaying}
            isMuted={isMuted}
            onPlayPause={togglePlay}
            onMuteToggle={toggleMute}
          />
          
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full bg-black/20 hover:bg-black/40"
            onClick={(e) => {
              e.stopPropagation();
              toggleFullscreen();
            }}
          >
            <Maximize className="h-4 w-4 text-white" />
          </Button>
        </div>
      </div>
    </div>
  );
};
