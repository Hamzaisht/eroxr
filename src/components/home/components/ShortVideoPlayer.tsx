
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
    console.log('ShortVideoPlayer - No video URL or error:', { videoUrl, error });
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-black">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-white/80">Video unavailable</p>
          {!videoUrl && <p className="text-white/60 text-sm mt-2">No video URL provided</p>}
          {error && <p className="text-white/60 text-sm mt-2">Video failed to load</p>}
        </div>
      </div>
    );
  }
  
  return (
    <div 
      className="absolute inset-0 bg-black group"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
      onClick={togglePlay}
    >
      <video
        ref={videoRef}
        src={videoUrl}
        poster={thumbnailUrl}
        className="h-full w-full object-cover bg-black"
        loop
        muted={isMuted}
        playsInline
        autoPlay={isCurrentVideo}
        onLoadedData={() => {
          console.log('ShortVideoPlayer - Video loaded successfully:', videoUrl);
          setError(false);
          if (isCurrentVideo) {
            setIsPlaying(true);
          }
        }}
        onError={(e) => {
          console.error('ShortVideoPlayer - Video error:', { videoUrl, error: e });
          setError(true);
          onError();
        }}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      
      {/* Play/Pause Overlay - Only show when paused */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <div className="bg-black/60 backdrop-blur-sm rounded-full p-6">
            <Play className="w-16 h-16 text-white fill-white" />
          </div>
        </div>
      )}

      {/* Volume Control - Desktop only */}
      <div className={`hidden md:block absolute bottom-4 left-4 transition-opacity duration-200 ${
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
    </div>
  );
});

ShortVideoPlayer.displayName = "ShortVideoPlayer";
