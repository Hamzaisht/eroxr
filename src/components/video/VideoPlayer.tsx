
import { useState, useRef, useEffect } from 'react';
import { Play, Volume2, VolumeX, X } from 'lucide-react';
import { Watermark } from '@/components/shared/Watermark';

interface VideoPlayerProps {
  url: string;
  className?: string;
  autoPlay?: boolean;
  controls?: boolean;
  muted?: boolean;
  loop?: boolean;
  playOnHover?: boolean;
  poster?: string;
  showCloseButton?: boolean;
  username?: string;
  onClose?: () => void;
  onPlay?: () => void;
  onPause?: () => void;
  onError?: () => void;
  onEnded?: () => void;
}

export const VideoPlayer = ({
  url,
  className,
  autoPlay = false,
  controls = false,
  muted = true,
  loop = true,
  playOnHover = false,
  poster,
  showCloseButton = false,
  username,
  onClose,
  onPlay,
  onPause,
  onError,
  onEnded
}: VideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(muted);
  const [showControls, setShowControls] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    const handlePlay = () => {
      setIsPlaying(true);
      if (onPlay) onPlay();
    };
    
    const handlePause = () => {
      setIsPlaying(false);
      if (onPause) onPause();
    };
    
    const handleEnded = () => {
      setIsPlaying(false);
      if (onEnded) onEnded();
    };
    
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);
    
    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
    };
  }, [onPlay, onPause, onEnded]);
  
  const handlePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;
    
    if (isPlaying) {
      video.pause();
    } else {
      video.play().catch(err => {
        console.error('Error playing video:', err);
        if (onError) onError();
      });
    }
  };
  
  const handleMouseEnter = () => {
    setShowControls(true);
    
    if (playOnHover && videoRef.current && !isPlaying) {
      videoRef.current.play().catch(err => {
        console.error('Error auto-playing on hover:', err);
        if (onError) onError();
      });
    }
  };
  
  const handleMouseLeave = () => {
    setShowControls(false);
    
    if (playOnHover && videoRef.current && isPlaying && !autoPlay) {
      videoRef.current.pause();
    }
  };
  
  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };
  
  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClose) onClose();
  };
  
  return (
    <div 
      className={`relative ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <video
        ref={videoRef}
        src={url}
        className="w-full h-full object-cover"
        autoPlay={autoPlay}
        muted={isMuted}
        loop={loop}
        controls={controls}
        poster={poster}
        playsInline
        onError={onError}
      />
      
      {!controls && showControls && (
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            className="bg-black/50 rounded-full p-3 text-white hover:bg-black/70 transition-colors"
            onClick={handlePlayPause}
          >
            {isPlaying ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <Play className="w-6 h-6" />
            )}
          </button>
        </div>
      )}
      
      {!controls && showControls && (
        <div className="absolute bottom-2 right-2">
          <button 
            onClick={toggleMute}
            className="bg-black/50 rounded-full p-2 text-white hover:bg-black/70 transition-colors"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>
        </div>
      )}
      
      {showCloseButton && (
        <button
          className="absolute top-2 right-2 bg-black/50 rounded-full p-1.5 text-white hover:bg-black/70 transition-colors z-10"
          onClick={handleClose}
        >
          <X className="w-4 h-4" />
        </button>
      )}
      
      {/* Watermark */}
      {username && <Watermark username={username} />}
    </div>
  );
};
