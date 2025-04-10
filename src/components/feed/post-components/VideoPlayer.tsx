
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Play, Pause } from "lucide-react";
import { getPlayableMediaUrl } from "@/utils/media/getPlayableMediaUrl";

interface VideoPlayerProps {
  url: string;
  poster?: string;
  onError: () => void;
  onEnded?: () => void;
}

export const VideoPlayer = ({ url, poster, onError, onEnded }: VideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Process the URL correctly using the appropriate parameter structure
  const processedUrl = getPlayableMediaUrl({media_url: url});

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(error => {
          console.error("Error playing video:", error);
          onError();
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    if (onEnded) onEnded();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="relative min-w-[300px] max-w-[500px] aspect-video cursor-pointer group"
    >
      <video
        ref={videoRef}
        src={processedUrl || undefined}
        poster={poster}
        className="w-full h-full object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
        playsInline
        loop
        onError={onError}
        onEnded={handleEnded}
      />
      <div 
        className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center"
        onClick={togglePlay}
      >
        <button className="p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors">
          {isPlaying ? (
            <Pause className="w-6 h-6 text-white" />
          ) : (
            <Play className="w-6 h-6 text-white" />
          )}
        </button>
      </div>
    </motion.div>
  );
};
