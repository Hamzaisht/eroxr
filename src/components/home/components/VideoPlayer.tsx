import { useState, useEffect, useRef } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface VideoPlayerProps {
  url: string;
  poster?: string;
  className?: string;
  index?: number;
  onIndexChange?: (index: number) => void;
}

export const VideoPlayer = ({ url, poster, className, index, onIndexChange }: VideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.addEventListener('loadeddata', () => setIsLoading(false));
      video.addEventListener('error', (e) => {
        console.error('Video loading error:', e);
        setIsLoading(false);
      });

      return () => {
        video.removeEventListener('loadeddata', () => setIsLoading(false));
        video.removeEventListener('error', () => setIsLoading(false));
      };
    }
  }, [url]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.error("Error playing video:", error);
          });
        }
        // Notify parent component about current video index when playing starts
        if (typeof index !== 'undefined' && onIndexChange) {
          onIndexChange(index);
        }
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className={cn("relative group overflow-hidden rounded-lg", className)}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
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
            className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm"
          >
            {isPlaying ? (
              <Pause className="h-6 w-6 text-white" />
            ) : (
              <Play className="h-6 w-6 text-white" />
            )}
          </button>
          
          <button
            onClick={toggleMute}
            className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm"
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