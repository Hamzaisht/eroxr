
import { useState, useEffect, memo, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, Play, Pause, VolumeX, Volume2 } from "lucide-react";

interface ShortVideoPlayerProps {
  videoUrl: string | null;
  thumbnailUrl?: string;
  creatorId?: string;
  isCurrentVideo: boolean;
  isDeleting?: boolean;
  onError: () => void;
}

export const ShortVideoPlayer = memo(({ 
  videoUrl, 
  thumbnailUrl, 
  creatorId, 
  isCurrentVideo,
  isDeleting, 
  onError 
}: ShortVideoPlayerProps) => {
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const [error, setError] = useState(false);
  
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isCurrentVideo && isPlaying) {
      video.play().catch(() => {
        setError(true);
        onError();
      });
    } else {
      video.pause();
    }
  }, [isCurrentVideo, isPlaying, onError]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        setError(true);
        onError();
      });
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    
    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  if (isDeleting) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-black/90 backdrop-blur-sm">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-white">Deleting video...</p>
        </div>
      </div>
    );
  }
  
  if (!videoUrl || error) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-black">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-white/80">Video unavailable</p>
        </div>
      </div>
    );
  }
  
  return (
    <div 
      className="relative h-full w-full bg-black group"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
      onClick={togglePlay}
    >
      <video
        ref={videoRef}
        src={videoUrl}
        poster={thumbnailUrl}
        className="h-full w-full object-contain bg-black"
        loop
        muted={isMuted}
        playsInline
        onLoadedData={() => {
          setError(false);
          if (isCurrentVideo) {
            setIsPlaying(true);
          }
        }}
        onError={() => {
          setError(true);
          onError();
        }}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      
      {/* Play/Pause Overlay */}
      <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${
        showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
      }`}>
        {!isPlaying && (
          <div className="bg-black/50 backdrop-blur-sm rounded-full p-4">
            <Play className="w-12 h-12 text-white fill-white" />
          </div>
        )}
      </div>

      {/* Controls Overlay */}
      <div className={`absolute bottom-4 left-4 transition-opacity duration-200 ${
        showControls ? 'opacity-100' : 'opacity-0'
      }`}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleMute();
          }}
          className="bg-black/50 backdrop-blur-sm rounded-full p-2 text-white hover:bg-black/70 transition-colors"
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
      </div>

      {/* Cyberpunk Glow Border */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 border border-primary/20 shadow-lg shadow-primary/10" />
        <div className="absolute top-0 left-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>
    </div>
  );
});

ShortVideoPlayer.displayName = "ShortVideoPlayer";
