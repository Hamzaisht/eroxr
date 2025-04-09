
import { useState, useEffect, useRef } from "react";
import { X, Play, Pause, VolumeX, Volume2, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface VideoPlayerProps {
  url: string;
  poster?: string;
  className?: string;
  autoPlay?: boolean;
  showControls?: boolean;
  showCloseButton?: boolean;
  onClose?: () => void;
  creatorId?: string;
  onError?: () => void;
  playOnHover?: boolean;
  onClick?: () => void;
  onLoadedData?: () => void;
}

export const VideoPlayer = ({
  url,
  poster,
  className,
  autoPlay = false,
  showControls = false,
  showCloseButton = false,
  onClose,
  creatorId,
  onError,
  playOnHover = false,
  onClick,
  onLoadedData,
}: VideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [hasRetried, setHasRetried] = useState(false);
  const [isStalled, setIsStalled] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const stallTimerRef = useRef<NodeJS.Timeout | null>(null);
  const loadingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Log the URL for debugging
  useEffect(() => {
    console.log("VideoPlayer rendering with URL:", url);
  }, [url]);

  // Handle play/pause toggle
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(error => {
          console.warn("Error playing video:", error);
        });
      }
    }
  };

  // Handle mute/unmute toggle
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleRetry = () => {
    if (videoRef.current) {
      setIsLoading(true);
      setIsError(false);
      setIsStalled(false);
      
      // Add cache buster to force reload
      const cacheBuster = getUrlWithCacheBuster(url);
      console.log("Retrying with URL:", cacheBuster);
      videoRef.current.src = cacheBuster;
      videoRef.current.load();
      setHasRetried(true);
      
      // Set up a stall timer again
      if (stallTimerRef.current) {
        clearTimeout(stallTimerRef.current);
      }
      
      stallTimerRef.current = setTimeout(() => {
        setIsStalled(true);
      }, 10000);
    }
  };

  const getUrlWithCacheBuster = (url: string) => {
    if (!url) return url;
    
    const timestamp = Date.now();
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}t=${timestamp}&r=${Math.random().toString(36).substring(2, 10)}`;
  };

  // Handle click events
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (!showControls) {
      togglePlay();
    }
  };

  // Handle playOnHover
  useEffect(() => {
    if (!videoRef.current || !playOnHover) return;

    const handleMouseEnter = () => {
      if (videoRef.current && !isError) {
        videoRef.current.play().catch(err => console.warn("Autoplay on hover prevented:", err));
      }
    };

    const handleMouseLeave = () => {
      if (videoRef.current) {
        videoRef.current.pause();
      }
    };

    const videoElement = videoRef.current;
    if (playOnHover) {
      videoElement.addEventListener('mouseenter', handleMouseEnter);
      videoElement.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (playOnHover && videoElement) {
        videoElement.removeEventListener('mouseenter', handleMouseEnter);
        videoElement.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [playOnHover, isError]);

  // Set up video event listeners
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    console.log("Setting up video with src:", url);
    
    // Set up stall detection
    if (stallTimerRef.current) {
      clearTimeout(stallTimerRef.current);
    }
    
    stallTimerRef.current = setTimeout(() => {
      if (isLoading) {
        console.log("Video loading stalled after 8 seconds");
        setIsStalled(true);
      }
    }, 8000);
    
    // Set up loading timeout
    if (loadingTimerRef.current) {
      clearTimeout(loadingTimerRef.current);
    }
    
    loadingTimerRef.current = setTimeout(() => {
      if (isLoading && !hasRetried) {
        console.log("Video loading timed out, retrying...");
        handleRetry();
      } else if (isLoading && hasRetried) {
        console.log("Video failed after retry, showing error");
        setIsError(true);
        setIsLoading(false);
      }
    }, 15000);

    // Event handlers
    const handleLoaded = () => {
      console.log("Video loaded successfully:", url);
      setIsLoading(false);
      setIsError(false);
      setIsStalled(false);
      
      if (autoPlay) {
        video.play().catch(err => {
          console.warn("Autoplay prevented:", err);
          setIsPlaying(false);
        });
      }
      
      if (stallTimerRef.current) {
        clearTimeout(stallTimerRef.current);
      }
      
      if (loadingTimerRef.current) {
        clearTimeout(loadingTimerRef.current);
      }
      
      // Call onLoadedData callback if provided
      if (onLoadedData) {
        onLoadedData();
      }
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    
    const handleVideoError = (e: Event) => {
      console.warn("Video error:", e, "URL:", url);
      
      // Call onError callback if provided
      if (onError) {
        onError();
      }
      
      if (!hasRetried) {
        console.log("First error, retrying with cache buster");
        handleRetry();
      } else {
        console.log("Already retried, showing error state");
        setIsError(true);
        setIsLoading(false);
      }
    };
    
    const handleStalled = () => {
      console.warn("Video playback stalled:", url);
      setIsStalled(true);
    };

    // Add event listeners
    video.addEventListener('loadeddata', handleLoaded);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('error', handleVideoError);
    video.addEventListener('stalled', handleStalled);

    // Set initial video properties
    video.muted = isMuted;
    
    // Add cache buster to URL and retry if needed
    if (!hasRetried) {
      const cachedUrl = getUrlWithCacheBuster(url);
      console.log("Using cached URL:", cachedUrl);
      video.src = cachedUrl;
    }

    // Clean up event listeners
    return () => {
      if (stallTimerRef.current) {
        clearTimeout(stallTimerRef.current);
      }
      
      if (loadingTimerRef.current) {
        clearTimeout(loadingTimerRef.current);
      }
      
      video.removeEventListener('loadeddata', handleLoaded);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('error', handleVideoError);
      video.removeEventListener('stalled', handleStalled);
    };
  }, [url, autoPlay, isMuted, onError, hasRetried, onLoadedData]);

  return (
    <div 
      className={cn("relative overflow-hidden", className)}
      onClick={handleClick}
    >
      {/* Loading indicator */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center z-20"
          >
            {isStalled ? (
              <div className="flex flex-col items-center gap-2">
                <AlertCircle className="h-8 w-8 text-yellow-500" />
                <p className="text-sm text-white/80">Video is taking longer than usual...</p>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRetry();
                  }}
                  className="mt-2 px-3 py-1.5 bg-luxury-primary/80 hover:bg-luxury-primary rounded-md flex items-center gap-1"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Retry</span>
                </button>
              </div>
            ) : (
              <Loader2 className="h-8 w-8 text-white animate-spin" />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error state */}
      <AnimatePresence>
        {isError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-20"
          >
            <AlertCircle className="h-8 w-8 text-red-500" />
            <p className="text-sm text-white/80 mt-2">Failed to load video</p>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleRetry();
              }}
              className="mt-4 px-3 py-1.5 bg-luxury-primary/80 hover:bg-luxury-primary rounded-md flex items-center gap-1"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Retry</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video element */}
      <video
        ref={videoRef}
        poster={poster}
        className={cn(
          "w-full h-full object-cover",
          isError && "invisible" 
        )}
        playsInline
        loop
        muted={isMuted}
        controls={showControls}
      />

      {/* Play/Pause overlay */}
      {!showControls && !isLoading && !isError && !onClick && (
        <div className="absolute inset-0 flex items-center justify-center" onClick={togglePlay}>
          <AnimatePresence>
            {!isPlaying && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="p-3 rounded-full bg-luxury-primary/30 backdrop-blur-sm hover:bg-luxury-primary/50 transition-colors"
              >
                <Play className="h-6 w-6 text-white" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Bottom controls */}
      {!showControls && !isLoading && !isError && (
        <div className="absolute bottom-2 right-2 flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleMute();
            }}
            className="p-1.5 rounded-full bg-black/30 hover:bg-black/50 transition-colors"
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4 text-white" />
            ) : (
              <Volume2 className="h-4 w-4 text-white" />
            )}
          </button>
        </div>
      )}

      {/* Close button */}
      {showCloseButton && onClose && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onClose) onClose();
          }}
          className="absolute top-2 right-2 p-1.5 rounded-full bg-black/30 hover:bg-black/50 transition-colors z-30"
        >
          <X className="h-4 w-4 text-white" />
        </button>
      )}
    </div>
  );
};
