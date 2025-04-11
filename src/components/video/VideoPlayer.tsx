
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
  onLoadedData,
  creatorId,
  playOnHover = false,
  showCloseButton = false,
  onClose,
  onClick,
  controls = true
}: VideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Reset status when URL changes
  useEffect(() => {
    setIsLoading(true);
    setError(false);
    setRetryCount(0);
    
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, [url]);
  
  const handleError = () => {
    setError(true);
    setIsLoading(false);
    console.error("Video error occurred for URL:", url);
    
    // Try to reload if we haven't tried too many times
    if (retryCount < 2) {
      setRetryCount(prevCount => prevCount + 1);
      setTimeout(() => {
        if (videoRef.current) {
          // Try refreshing the video element
          videoRef.current.pause();
          videoRef.current.removeAttribute('src');
          
          setTimeout(() => {
            if (videoRef.current) {
              // Add a cache busting parameter
              const cacheBuster = `${url}${url.includes('?') ? '&' : '?'}cb=${Date.now()}`;
              videoRef.current.src = cacheBuster;
              videoRef.current.load();
            }
          }, 500);
        }
      }, 1000);
    } else if (onError) {
      onError();
    }
  };
  
  const handleLoad = () => {
    setIsLoading(false);
    setError(false);
    if (onLoadedData) onLoadedData();
    
    // Try autoplay if requested
    if (autoPlay && videoRef.current && videoRef.current.paused) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.warn("Autoplay prevented:", error);
          // Most browsers require user interaction before playing with sound
          if (videoRef.current) {
            videoRef.current.muted = true;
            videoRef.current.play().catch(e => console.error("Even muted autoplay failed:", e));
          }
        });
      }
    }
  };
  
  const togglePlay = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.error("Error playing video:", error);
            // Try with muted if it fails
            if (videoRef.current && !videoRef.current.muted) {
              videoRef.current.muted = true;
              setIsMuted(true);
              videoRef.current.play().catch(e => {
                console.error("Even muted playback failed:", e);
                if (onError) onError();
              });
            } else if (onError) {
              onError();
            }
          });
        }
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  const toggleMute = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };
  
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    // Reset video state when URL changes
    setIsPlaying(false);
    setIsLoading(true);
    setError(false);
    
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleVideoEnded = () => {
      setIsPlaying(false);
      if (onEnded) onEnded();
    };
    const handleLoadedData = () => {
      handleLoad();
    };
    const handleVideoError = () => {
      handleError();
    };
    
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleVideoEnded);
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('error', handleVideoError);
    
    // Try to autoplay when component mounts
    if (autoPlay && !isLoading) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.warn("Autoplay prevented:", error);
          // Most browsers require user interaction before playing with sound
          video.muted = true;
          setIsMuted(true);
          video.play().catch(e => console.error("Even muted autoplay failed:", e));
        });
      }
    }
    
    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleVideoEnded);
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('error', handleVideoError);
    };
  }, [autoPlay, url, onEnded, onError]);

  // Handle click on the video container
  const handleVideoClick = (e: React.MouseEvent) => {
    if (onClick) {
      onClick();
    } else {
      togglePlay(e);
    }
  };

  return (
    <div 
      className={cn("relative overflow-hidden", className)}
      onClick={handleVideoClick}
    >
      {/* Loading state */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
          <Loader2 className="h-8 w-8 animate-spin text-white/80" />
        </div>
      )}
      
      {/* Error state */}
      {error && retryCount >= 2 && (
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
        onLoadedData={handleLoad}
        onEnded={onEnded}
        onError={handleError}
      />
      
      {/* Video controls overlay */}
      {controls && !error && (
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
