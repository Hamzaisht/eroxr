
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, VolumeX, Loader2, AlertCircle, X, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { getUsernameForWatermark } from "@/utils/watermarkUtils";
import { addCacheBuster } from "@/utils/media/getPlayableMediaUrl";
import { debugMediaUrl } from "@/utils/media/debugMediaUtils";

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
  const [stallDetected, setStallDetected] = useState(false);
  const [stallTimer, setStallTimer] = useState<NodeJS.Timeout | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const currentUrlRef = useRef<string>(url);
  
  useEffect(() => {
    if (currentUrlRef.current !== url) {
      currentUrlRef.current = url;
      setIsLoading(true);
      setError(false);
      setRetryCount(0);
      setStallDetected(false);
      
      if (stallTimer) {
        clearTimeout(stallTimer);
      }
      
      if (videoRef.current) {
        videoRef.current.load();
      }
    }
  }, [url]);
  
  useEffect(() => {
    if (isLoading && !error && videoRef.current) {
      const timer = setTimeout(() => {
        if (isLoading) {
          setStallDetected(true);
        }
      }, 10000);
      
      setStallTimer(timer);
      
      return () => {
        clearTimeout(timer);
      };
    }
  }, [isLoading, error]);
  
  const handleError = () => {
    setError(true);
    setIsLoading(false);
    setStallDetected(false);
    console.error("Video error occurred for URL:", url);
    
    if (url) {
      // Fixed by removing .then()
      debugMediaUrl(url);
      console.log("Debugging URL for video error:", url);
    }
    
    if (stallTimer) {
      clearTimeout(stallTimer);
    }
    
    if (retryCount < 3) {
      setRetryCount(prevCount => prevCount + 1);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.pause();
          videoRef.current.removeAttribute('src');
          
          setTimeout(() => {
            if (videoRef.current) {
              const cacheBuster = addCacheBuster(url) || url;
              videoRef.current.src = cacheBuster;
              videoRef.current.load();
              setIsLoading(true);
              setError(false);
            }
          }, 500);
        }
      }, 1000 * (retryCount + 1));
    } else if (onError) {
      onError();
    }
  };
  
  const handleLoad = () => {
    setIsLoading(false);
    setError(false);
    setStallDetected(false);
    
    if (stallTimer) {
      clearTimeout(stallTimer);
    }
    
    if (onLoadedData) onLoadedData();
    
    if (autoPlay && videoRef.current && videoRef.current.paused) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.warn("Autoplay prevented:", error);
          if (videoRef.current) {
            videoRef.current.muted = true;
            setIsMuted(true);
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
  
  const handleManualRetry = () => {
    if (videoRef.current) {
      setRetryCount(0);
      setError(false);
      setIsLoading(true);
      setStallDetected(false);
      
      const cacheBuster = addCacheBuster(url) || url;
      
      videoRef.current.pause();
      videoRef.current.removeAttribute('src');
      
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.src = cacheBuster;
          videoRef.current.load();
        }
      }, 300);
    }
  };
  
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
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
    const handleWaiting = () => {
      setIsLoading(true);
    };
    const handlePlaying = () => {
      setIsLoading(false);
      setStallDetected(false);
      
      if (stallTimer) {
        clearTimeout(stallTimer);
      }
    };
    
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleVideoEnded);
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('error', handleVideoError);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('playing', handlePlaying);
    
    if (autoPlay && !isLoading) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.warn("Autoplay prevented:", error);
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
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('playing', handlePlaying);
      
      if (stallTimer) {
        clearTimeout(stallTimer);
      }
    };
  }, [autoPlay, url, onEnded, onError]);
  
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
      {isLoading && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-10">
          {stallDetected ? (
            <div className="text-center">
              <AlertCircle className="mx-auto h-8 w-8 text-yellow-500 mb-2" />
              <p className="text-white/80 text-sm mb-2">Video is taking longer than expected</p>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleManualRetry();
                }}
                className="bg-luxury-primary/20 hover:bg-luxury-primary/40 border-luxury-primary/40"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Retry
              </Button>
            </div>
          ) : (
            <Loader2 className="h-8 w-8 animate-spin text-white/80" />
          )}
        </div>
      )}
      
      {error && retryCount >= 3 && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-10">
          <div className="text-center px-4">
            <AlertCircle className="mx-auto h-10 w-10 text-red-500 mb-2" />
            <p className="text-white/90 mb-3">Failed to load video</p>
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleManualRetry();
              }}
              className="bg-luxury-primary/20 hover:bg-luxury-primary/40 border-luxury-primary/40"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Try Again
            </Button>
          </div>
        </div>
      )}
      
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
        crossOrigin="anonymous"
      />
      
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
