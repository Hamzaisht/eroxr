
import { useState, useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { Loader2, Volume2, VolumeX } from "lucide-react";
import { useMediaProcessor } from "@/hooks/useMediaProcessor";

interface ErosVideoPlayerProps {
  videoUrl: string | null;
  thumbnailUrl?: string;
  isActive: boolean;
  onError?: () => void;
}

export const ErosVideoPlayer = ({
  videoUrl,
  thumbnailUrl,
  isActive,
  onError
}: ErosVideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const { ref: inViewRef, inView } = useInView({
    threshold: 0.6,
  });
  
  const { 
    mediaUrl: processedVideoUrl, 
    isLoading, 
    isError, 
    retry 
  } = useMediaProcessor(videoUrl ? { video_url: videoUrl } : null);
  
  const { 
    mediaUrl: processedThumbnail 
  } = useMediaProcessor(thumbnailUrl ? { media_url: thumbnailUrl } : null);
  
  // Control playback when the video becomes active or inactive
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
  const handleLoaded = () => {
    setIsLoaded(true);
    console.log("Video loaded successfully");
  };
  
  // Handle video error
  const handleError = () => {
    console.error("Video loading error:", processedVideoUrl);
    if (onError) onError();
  };
  
  // Toggle play/pause
  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    const video = videoRef.current;
    if (!video) return;
    
    if (video.paused) {
      video.play()
        .then(() => setIsPlaying(true))
        .catch(err => {
          console.error("Error playing video:", err);
        });
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };
  
  // Toggle mute
  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted(prev => !prev);
  };

  return (
    <div
      ref={inViewRef}
      className="relative w-full h-full overflow-hidden"
      onClick={togglePlay}
    >
      {/* Video element */}
      <video
        ref={videoRef}
        src={processedVideoUrl || undefined}
        poster={processedThumbnail || undefined}
        className="absolute inset-0 w-full h-full object-cover"
        playsInline
        loop
        muted={isMuted}
        onLoadedData={handleLoaded}
        onError={handleError}
      />
      
      {/* Loading overlay */}
      {(isLoading || !isLoaded) && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-luxury-primary" />
        </div>
      )}
      
      {/* Error overlay */}
      {isError && (
        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-4 text-center">
          <p className="text-luxury-neutral mb-2">Failed to load video</p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              retry();
            }}
            className="px-4 py-1 bg-luxury-primary text-white rounded-md text-sm"
          >
            Retry
          </button>
        </div>
      )}
      
      {/* Video controls */}
      {isLoaded && !isLoading && !isError && (
        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={toggleMute}
            className="p-2 rounded-full bg-black/50 text-white"
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
        </div>
      )}
    </div>
  );
};
