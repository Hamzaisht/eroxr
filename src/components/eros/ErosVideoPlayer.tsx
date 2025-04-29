
import { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";
import { useInView } from "react-intersection-observer";
import { MediaRenderer } from "@/components/media/MediaRenderer";
import { MediaType } from "@/utils/media/types";
import { reportMediaError } from "@/utils/media/mediaMonitoring";

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
  
  const { ref: inViewRef, inView } = useInView({
    threshold: 0.6,
  });
  
  // Clean and prepare video URL
  const getCleanVideoUrl = (url: string) => {
    if (!url) return '';
    
    // Handle URL without protocol
    if (url.startsWith('//')) {
      return `https:${url}`;
    }
    
    // Add protocol if missing
    if (!url.startsWith('http')) {
      return `https://${url}`;
    }
    
    return url;
  };
  
  const processedVideoUrl = videoUrl ? getCleanVideoUrl(videoUrl) : '';
  const processedThumbnailUrl = thumbnailUrl ? getCleanVideoUrl(thumbnailUrl) : '';
  
  // Handle video playback based on visibility and active status
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    const shouldPlay = isActive && inView;
    
    if (shouldPlay && video.paused) {
      video.play()
        .then(() => setIsPlaying(true))
        .catch(err => {
          console.error("Error playing video:", err);
          setIsPlaying(false);
        });
    } else if (!shouldPlay && !video.paused) {
      video.pause();
      setIsPlaying(false);
    }
  }, [isActive, inView]);

  // Handle video error with reporting
  const handleVideoError = () => {
    console.error("Video loading error:", processedVideoUrl);
    
    // Report error for monitoring
    reportMediaError(
      processedVideoUrl,
      'load_failure',
      2,
      'video',
      'ErosVideoPlayer'
    );
    
    if (onError) onError();
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
    
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
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
      <MediaRenderer
        ref={videoRef}
        src={processedVideoUrl}
        type={MediaType.VIDEO}
        fallbackSrc={processedThumbnailUrl}
        poster={processedThumbnailUrl}
        className="w-full h-full object-cover"
        autoPlay={autoPlay && isActive}
        controls={false}
        muted={isMuted}
        loop={loop}
        onError={handleVideoError}
        onEnded={handleVideoEnded}
        maxRetries={2}
      />
      
      {/* Volume control */}
      <button
        onClick={toggleMute}
        className="absolute bottom-4 right-4 z-20 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all"
      >
        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
      </button>
    </div>
  );
}
