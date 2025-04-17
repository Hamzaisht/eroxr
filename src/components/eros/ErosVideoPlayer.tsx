
import { useState, useRef, useEffect } from "react";
import { Loader2, AlertCircle, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";
import { useInView } from "react-intersection-observer";
import { useMedia } from "@/hooks/useMedia";

interface ErosVideoPlayerProps {
  videoUrl: string;
  thumbnailUrl?: string;
  isActive: boolean;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  className?: string;
  onError?: () => void;
  onVideoEnd?: () => void;
}

export function ErosVideoPlayer({
  videoUrl,
  thumbnailUrl,
  isActive,
  autoPlay = true,
  loop = true,
  muted: initialMuted = true,
  className,
  onError,
  onVideoEnd
}: ErosVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(initialMuted);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [loadRetries, setLoadRetries] = useState(0);
  
  const { ref: inViewRef, inView } = useInView({
    threshold: 0.6,
  });
  
  // Process video URL
  const { 
    url: processedVideoUrl, 
    isLoading,
    isError: mediaError,
    retry: retryVideoLoad,
  } = useMedia(
    videoUrl ? { video_url: videoUrl } : null
  );
  
  // Process thumbnail URL
  const { 
    url: processedThumbnailUrl 
  } = useMedia(
    thumbnailUrl ? { media_url: thumbnailUrl } : null
  );

  // Control video playback based on visibility and active status
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isLoaded) return;
    
    if (isActive && inView) {
      video.play()
        .then(() => setIsPlaying(true))
        .catch(err => {
          console.error("Error playing video:", err);
          setIsPlaying(false);
        });
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }, [isActive, inView, isLoaded]);

  // Handle video loaded
  const handleVideoLoaded = () => {
    setIsLoaded(true);
    setHasError(false);
    console.log("Video loaded successfully:", processedVideoUrl);
  };
  
  // Handle video error
  const handleVideoError = () => {
    console.error("Video loading error:", processedVideoUrl);
    setHasError(true);
    
    if (loadRetries < 2) {
      setLoadRetries(prev => prev + 1);
      setTimeout(() => {
        retryVideoLoad();
      }, 1000);
    } else if (onError) {
      onError();
    }
  };
  
  // Toggle play/pause
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    
    if (video.paused) {
      video.play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };
  
  // Toggle mute
  const toggleMute = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setIsMuted(prev => !prev);
  };
  
  // Handle video end
  const handleVideoEnded = () => {
    if (onVideoEnd) onVideoEnd();
    
    if (loop && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  };
  
  return (
    <div 
      ref={inViewRef}
      className={cn(
        "relative w-full h-full overflow-hidden bg-black",
        className
      )}
      onClick={togglePlay}
    >
      {/* Actual video element */}
      {processedVideoUrl && (
        <video
          ref={videoRef}
          src={processedVideoUrl}
          poster={processedThumbnailUrl}
          className="w-full h-full object-cover"
          playsInline
          loop={loop}
          muted={isMuted}
          onLoadedData={handleVideoLoaded}
          onError={handleVideoError}
          onEnded={handleVideoEnded}
        />
      )}
      
      {/* Loading state */}
      {(isLoading || (!isLoaded && !hasError)) && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
          <Loader2 className="w-12 h-12 animate-spin text-luxury-primary" />
        </div>
      )}
      
      {/* Error state */}
      {(hasError || mediaError) && (
        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-4 text-center z-10">
          <AlertCircle className="w-12 h-12 text-red-500 mb-2" />
          <p className="text-white mb-4">Failed to load video</p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setHasError(false);
              setLoadRetries(0);
              retryVideoLoad();
            }}
            className="px-4 py-2 bg-luxury-primary text-white rounded-md"
          >
            Retry
          </button>
        </div>
      )}
      
      {/* Volume control */}
      {isLoaded && !hasError && !mediaError && (
        <button
          onClick={toggleMute}
          className="absolute bottom-4 right-4 z-20 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all"
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
      )}
    </div>
  );
}
