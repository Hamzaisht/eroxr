
import { useEffect, useRef, useState } from 'react';
import { Loader2, RefreshCw, AlertCircle, X, Volume2, VolumeX } from 'lucide-react';
import { VideoErrorState } from './VideoErrorState';
import { VideoLoadingState } from './VideoLoadingState';

interface VideoPlayerProps {
  url: string;
  poster?: string;
  className?: string;
  autoPlay?: boolean;
  controls?: boolean;
  muted?: boolean;
  loop?: boolean;
  playOnHover?: boolean;
  showCloseButton?: boolean;
  onClick?: () => void;
  onError?: () => void;
  onEnded?: () => void;
  onLoadedData?: () => void;
  onClose?: () => void;
  creatorId?: string;
}

export const VideoPlayer = ({
  url,
  poster,
  className = "",
  autoPlay = false,
  controls = true,
  muted = false,
  loop = true,
  playOnHover = false,
  showCloseButton = false,
  onClick,
  onError,
  onEnded,
  onLoadedData,
  onClose,
  creatorId
}: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(muted);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isStalled, setIsStalled] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [debugInfo, setDebugInfo] = useState<{url: string; status: string}>({
    url: url || '',
    status: 'initial'
  });
  
  // Process URL to ensure it's directly usable
  const processedUrl = url ? ensureDirectUrl(url) : '';

  // Helper function for ensuring direct URL access
  function ensureDirectUrl(sourceUrl: string): string {
    // If already a blob or data URL, use directly
    if (sourceUrl.startsWith('blob:') || sourceUrl.startsWith('data:')) {
      return sourceUrl;
    }
    
    // Add cache busting for regular URLs
    const cacheBuster = `t=${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    return sourceUrl.includes('?') ? 
      `${sourceUrl}&${cacheBuster}` : 
      `${sourceUrl}?${cacheBuster}`;
  }

  // Handle video events
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    setDebugInfo(prev => ({ ...prev, url: processedUrl, status: 'loading' }));
    console.log(`Loading video: ${processedUrl}`);
    
    const handleLoadStart = () => {
      setIsLoading(true);
      setIsStalled(false);
      setDebugInfo(prev => ({ ...prev, status: 'loadstart' }));
    };
    
    const handleLoadedData = () => {
      setIsLoading(false);
      setIsStalled(false);
      setDebugInfo(prev => ({ ...prev, status: 'loaded' }));
      console.log(`Video loaded successfully: ${processedUrl}`);
      
      if (onLoadedData) onLoadedData();
      
      if (autoPlay && video.paused) {
        video.play().catch(e => {
          console.warn("Auto-play prevented:", e);
        });
      }
    };
    
    const handleError = (e: Event) => {
      console.error("Video error:", e);
      console.error("Video error source:", processedUrl);
      setDebugInfo(prev => ({ ...prev, status: 'error' }));
      setIsLoading(false);
      setHasError(true);
      
      if (onError) onError();
    };
    
    const handleEnd = () => {
      setIsPlaying(false);
      setDebugInfo(prev => ({ ...prev, status: 'ended' }));
      if (onEnded) onEnded();
    };
    
    const handleStalled = () => {
      setIsStalled(true);
      setDebugInfo(prev => ({ ...prev, status: 'stalled' }));
      console.warn(`Video stalled: ${processedUrl}`);
    };
    
    const handlePlaying = () => {
      setIsPlaying(true);
      setIsLoading(false);
      setIsStalled(false);
      setDebugInfo(prev => ({ ...prev, status: 'playing' }));
    };

    const handlePause = () => {
      setIsPlaying(false);
      setDebugInfo(prev => ({ ...prev, status: 'paused' }));
    };
    
    // Set up all event listeners
    video.addEventListener("loadstart", handleLoadStart);
    video.addEventListener("loadeddata", handleLoadedData);
    video.addEventListener("error", handleError);
    video.addEventListener("ended", handleEnd);
    video.addEventListener("stalled", handleStalled);
    video.addEventListener("playing", handlePlaying);
    video.addEventListener("pause", handlePause);
    video.addEventListener("waiting", handleStalled);
    
    return () => {
      // Clean up event listeners
      video.removeEventListener("loadstart", handleLoadStart);
      video.removeEventListener("loadeddata", handleLoadedData);
      video.removeEventListener("error", handleError);
      video.removeEventListener("ended", handleEnd);
      video.removeEventListener("stalled", handleStalled);
      video.removeEventListener("playing", handlePlaying);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("waiting", handleStalled);
    };
  }, [processedUrl, autoPlay, onError, onEnded, onLoadedData]);
  
  // Handle playOnHover logic
  useEffect(() => {
    if (!playOnHover || !videoRef.current) return;
    
    const element = videoRef.current;
    
    const handleMouseEnter = () => {
      if (element.paused && !hasError) {
        element.play().catch(console.error);
      }
    };
    
    const handleMouseLeave = () => {
      if (!element.paused) {
        element.pause();
      }
    };
    
    if (playOnHover) {
      element.addEventListener('mouseenter', handleMouseEnter);
      element.addEventListener('mouseleave', handleMouseLeave);
    }
    
    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [playOnHover, hasError]);
  
  // Handle retry logic
  const handleRetry = () => {
    const video = videoRef.current;
    if (!video) return;
    
    setIsLoading(true);
    setHasError(false);
    setIsStalled(false);
    setRetryCount(prev => prev + 1);
    
    // Generate a completely new cache-busted URL
    const freshUrl = ensureDirectUrl(url);
    
    console.log(`Retrying video with fresh URL: ${freshUrl}`);
    setDebugInfo(prev => ({ ...prev, url: freshUrl, status: 'retrying' }));
    
    // Set the new URL and reload
    video.src = freshUrl;
    video.load();
  };
  
  // Handle mute toggling
  const toggleMute = () => {
    if (!videoRef.current) return;
    setIsMuted(!isMuted);
    videoRef.current.muted = !isMuted;
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Loading state */}
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
      
      {/* Close button */}
      {showCloseButton && onClose && (
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 p-1 rounded-full bg-black/50 text-white hover:bg-black/70 z-20"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
      )}
      
      {/* Volume control - only show if video is playing */}
      {!hasError && !isLoading && controls && (
        <button
          onClick={toggleMute}
          className="absolute bottom-3 right-3 p-1.5 rounded-full bg-black/50 text-white hover:bg-black/70 z-10"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      )}

      {/* Video element */}
      <video
        ref={videoRef}
        src={processedUrl || undefined}
        className="w-full h-full object-contain"
        controls={controls}
        poster={poster}
        playsInline
        muted={isMuted}
        loop={loop}
        onClick={onClick}
      />
      
      {/* Debug info in development mode */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-xs text-white/70 px-2 py-0.5">
          Status: {debugInfo.status}
        </div>
      )}
    </div>
  );
};
