
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface VideoPlayerProps {
  url: string;
  poster?: string;
  className?: string;
  onError?: () => void;
  autoPlay?: boolean;
  playOnHover?: boolean;
}

export const VideoPlayer = ({ 
  url, 
  poster, 
  className,
  onError,
  autoPlay = false,
  playOnHover = false
}: VideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => {
      setIsLoaded(true);
      console.log("Video loaded successfully:", url);
      if (autoPlay) {
        video.play().catch(e => console.error("Autoplay failed:", e));
      }
    };

    const handleError = (e: Event) => {
      console.error("Video loading error:", e);
      if (onError) onError();
      toast({
        title: "Error",
        description: "Failed to load video. Please try again.",
        variant: "destructive",
      });
    };

    video.addEventListener("loadeddata", handleLoadedData);
    video.addEventListener("error", handleError);

    // Reset video state when URL changes
    setIsPlaying(autoPlay);
    setIsLoaded(false);
    video.load();

    return () => {
      video.removeEventListener("loadeddata", handleLoadedData);
      video.removeEventListener("error", handleError);
    };
  }, [url, onError, toast, autoPlay]);

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

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        toast({
          title: "Fullscreen Error",
          description: `Error attempting to enable fullscreen: ${err.message}`,
          variant: "destructive",
        });
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Handle fullscreen change event
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Handle play on hover
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
    >
      {/* Video container with proper aspect ratio preservation */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <div className="w-10 h-10 border-2 border-luxury-primary/50 border-t-luxury-primary rounded-full animate-spin"></div>
          </div>
        )}
        
        <video
          ref={videoRef}
          src={url}
          poster={poster}
          muted={isMuted}
          playsInline
          loop
          className="w-full h-full object-contain"
          style={{
            objectFit: "contain",
            backgroundColor: "black",
            maxWidth: "100%",
            maxHeight: "100%"
          }}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onClick={togglePlay}
        />
      </div>
      
      {/* Gradient overlay for controls */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute bottom-4 left-4 flex items-center gap-2">
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
          
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full bg-black/20 hover:bg-black/40"
            onClick={toggleFullscreen}
          >
            <Maximize className="h-4 w-4 text-white" />
          </Button>
        </div>
      </div>
    </div>
  );
};
