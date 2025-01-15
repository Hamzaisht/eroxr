import { useState, useEffect, useRef } from "react";
import { Play, Pause, Volume2, VolumeX, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

interface VideoPlayerProps {
  url: string;
  poster?: string;
  className?: string;
  index?: number;
  onIndexChange?: (index: number) => void;
  onError?: () => void;
  autoPlay?: boolean;
}

export const VideoPlayer = ({ 
  url, 
  poster, 
  className,
  index,
  onIndexChange,
  onError,
  autoPlay = false
}: VideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => {
      console.log("Video loaded successfully:", url);
      setIsLoading(false);
      setHasError(false);
      if (autoPlay) {
        video.play().catch(console.error);
      }
    };

    const handleError = (e: Event) => {
      console.error("Video loading error:", e);
      setIsLoading(false);
      setHasError(true);
      if (onError) onError();
      toast({
        title: "Video Error",
        description: "Failed to load video. Please try again later.",
        variant: "destructive",
      });
    };

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('error', handleError);
    video.load();

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('error', handleError);
    };
  }, [url, onError, toast, autoPlay]);

  const togglePlay = () => {
    if (!videoRef.current || hasError) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error("Error playing video:", error);
          setHasError(true);
          if (onError) onError();
          toast({
            title: "Playback Error",
            description: "Unable to play video. Please try again.",
            variant: "destructive",
          });
        });
      }
      if (typeof index !== 'undefined' && onIndexChange) {
        onIndexChange(index);
      }
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  if (hasError) {
    return (
      <div className="relative aspect-video bg-luxury-darker/50 rounded-lg flex items-center justify-center">
        <p className="text-sm text-red-400">Failed to load video</p>
      </div>
    );
  }

  return (
    <div className={cn("relative group overflow-hidden rounded-lg", className)}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-luxury-darker/50 backdrop-blur-sm z-10">
          <Loader2 className="w-8 h-8 animate-spin text-luxury-primary" />
        </div>
      )}
      
      <video
        ref={videoRef}
        src={url}
        poster={poster}
        className="w-full h-full object-cover"
        playsInline
        loop
        muted={isMuted}
        preload="metadata"
      />
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
      >
        <div className="flex gap-4">
          <button
            onClick={togglePlay}
            className="p-3 rounded-full bg-luxury-primary/20 hover:bg-luxury-primary/30 transition-colors backdrop-blur-sm"
          >
            {isPlaying ? (
              <Pause className="h-6 w-6 text-white" />
            ) : (
              <Play className="h-6 w-6 text-white" />
            )}
          </button>
          
          <button
            onClick={toggleMute}
            className="p-3 rounded-full bg-luxury-primary/20 hover:bg-luxury-primary/30 transition-colors backdrop-blur-sm"
          >
            {isMuted ? (
              <VolumeX className="h-6 w-6 text-white" />
            ) : (
              <Volume2 className="h-6 w-6 text-white" />
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};