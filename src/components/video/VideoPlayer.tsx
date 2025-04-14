
import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Loader2 } from "lucide-react";
import { getDisplayableMediaUrl } from "@/utils/media/urlUtils";
import { VideoLoadingState } from "./VideoLoadingState";
import { VideoErrorState } from "./VideoErrorState";

interface VideoPlayerProps {
  url: string;
  className?: string;
  poster?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
  onError?: () => void;
  onEnded?: () => void;
  onLoadedData?: () => void;
  creatorId?: string;
  onClick?: () => void;
}

export const VideoPlayer = ({ 
  url, 
  className = "", 
  poster, 
  autoPlay = false,
  loop = true,
  muted = false,
  controls = true,
  onError,
  onEnded,
  onLoadedData,
  creatorId,
  onClick
}: VideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(muted);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isStalled, setIsStalled] = useState(false);
  const [retryAttempt, setRetryAttempt] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const stallTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Process URL for optimal playback
  const processedUrl = getDisplayableMediaUrl(url);

  // Video event handlers
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    const handleLoadStart = () => {
      setIsLoading(true);
      setHasError(false);
      
      // Set a timeout to detect stalled loading
      if (stallTimeoutRef.current) {
        clearTimeout(stallTimeoutRef.current);
      }
      stallTimeoutRef.current = setTimeout(() => {
        setIsStalled(true);
      }, 8000);
    };
    
    const handleLoadedData = () => {
      setIsLoading(false);
      setIsStalled(false);
      if (stallTimeoutRef.current) {
        clearTimeout(stallTimeoutRef.current);
      }
      
      if (onLoadedData) onLoadedData();
      
      // Auto-play if specified
      if (autoPlay && video.paused) {
        video.play().catch(e => {
          console.warn("Auto-play prevented:", e);
        });
      }
    };
    
    const handleError = (e: Event) => {
      console.error("Video error:", e);
      setIsLoading(false);
      setHasError(true);
      if (stallTimeoutRef.current) {
        clearTimeout(stallTimeoutRef.current);
      }
      
      if (onError) onError();
    };
    
    const handleEnd = () => {
      setIsPlaying(false);
      if (onEnded) onEnded();
    };
    
    const handleStalled = () => {
      setIsStalled(true);
    };
    
    const handlePlaying = () => {
      setIsLoading(false);
      setIsStalled(false);
      setIsPlaying(true);
      
      if (stallTimeoutRef.current) {
        clearTimeout(stallTimeoutRef.current);
      }
    };
    
    // Add event listeners
    video.addEventListener("loadstart", handleLoadStart);
    video.addEventListener("loadeddata", handleLoadedData);
    video.addEventListener("error", handleError);
    video.addEventListener("ended", handleEnd);
    video.addEventListener("stalled", handleStalled);
    video.addEventListener("playing", handlePlaying);
    video.addEventListener("waiting", handleStalled);
    
    // Clean up
    return () => {
      video.removeEventListener("loadstart", handleLoadStart);
      video.removeEventListener("loadeddata", handleLoadedData);
      video.removeEventListener("error", handleError);
      video.removeEventListener("ended", handleEnd);
      video.removeEventListener("stalled", handleStalled);
      video.removeEventListener("playing", handlePlaying);
      video.removeEventListener("waiting", handleStalled);
      
      if (stallTimeoutRef.current) {
        clearTimeout(stallTimeoutRef.current);
      }
    };
  }, [autoPlay, onError, onEnded, onLoadedData]);
  
  // Update video when URL changes
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    setIsLoading(true);
    setHasError(false);
    video.load();
    
  }, [processedUrl, retryAttempt]);
  
  // Toggle play/pause
  const togglePlay = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    
    const video = videoRef.current;
    if (!video) return;
    
    if (isPlaying) {
      video.pause();
    } else {
      video.play().catch(e => {
        console.error("Play error:", e);
        if (onError) onError();
      });
    }
    
    setIsPlaying(!isPlaying);
  };
  
  // Toggle mute
  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    setIsMuted(!isMuted);
    
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
  };
  
  // Retry loading the video
  const handleRetry = () => {
    setIsLoading(true);
    setHasError(false);
    setIsStalled(false);
    setRetryAttempt(prev => prev + 1);
  };

  return (
    <div className={`relative overflow-hidden bg-black ${className}`}>
      {/* Video element */}
      <video
        ref={videoRef}
        src={processedUrl || undefined}
        poster={poster}
        className={`w-full h-full object-contain ${isLoading || hasError ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        playsInline
        loop={loop}
        muted={isMuted}
        onClick={onClick || togglePlay}
      />
      
      {/* Loading indicator */}
      {isLoading && (
        <VideoLoadingState 
          isStalled={isStalled} 
          onRetry={handleRetry} 
        />
      )}
      
      {/* Error state */}
      {hasError && (
        <VideoErrorState 
          message="Failed to load video" 
          onRetry={handleRetry} 
        />
      )}
      
      {/* Controls */}
      {controls && !hasError && !isLoading && (
        <div 
          className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
          onClick={onClick || togglePlay}
        >
          <button 
            className="p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
            onClick={togglePlay}
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 text-white" />
            ) : (
              <Play className="w-6 h-6 text-white" />
            )}
          </button>
          
          {/* Mute button */}
          <button
            className="absolute bottom-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
            onClick={toggleMute}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-white/80" />
            ) : (
              <Volume2 className="w-4 h-4 text-white/80" />
            )}
          </button>
        </div>
      )}
    </div>
  );
};
