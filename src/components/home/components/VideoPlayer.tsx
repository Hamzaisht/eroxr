
import { useRef, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { VideoLoadingIndicator } from "./video/VideoLoadingIndicator";
import { VideoControlsOverlay } from "./video/VideoControlsOverlay";
import { useVideoPlayer } from "./video/useVideoPlayer";

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
  onEnded?: () => void;
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
  onError,
  onEnded
}, ref) => {
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

  const {
    isPlaying,
    isBuffering,
    togglePlay,
    toggleMute
  } = useVideoPlayer({
    url,
    videoRef: 'current' in videoRef ? videoRef : internalVideoRef,
    isCurrentVideo,
    onIndexChange,
    onMuteChange,
    index,
    onError,
    onEnded
  });

  // Handle video tap to toggle play/pause
  const handleVideoTap = (e: React.MouseEvent) => {
    // Prevent click from reaching controls underneath
    e.preventDefault();
    e.stopPropagation();
    togglePlay();
  };

  return (
    <div className={cn("relative group", className)}>
      <VideoLoadingIndicator isBuffering={isBuffering} />
      
      <video
        ref={videoRef as React.RefObject<HTMLVideoElement>}
        src={url}
        poster={poster}
        muted={isMuted}
        playsInline
        loop
        className="w-full h-full object-cover"
        onPlay={() => {}}
        onPause={() => {}}
        onEnded={onEnded}
        onClick={handleVideoTap}
      />
      
      <VideoControlsOverlay 
        isPlaying={isPlaying}
        isMuted={isMuted}
        onTogglePlay={handleVideoTap}
        onToggleMute={toggleMute}
      />
    </div>
  );
});

VideoPlayer.displayName = "VideoPlayer";
