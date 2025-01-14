import { motion } from "framer-motion";
import { Play, Loader2 } from "lucide-react";
import { useState } from "react";

interface VideoPreviewProps {
  videoUrl: string;
}

export const VideoPreview = ({ videoUrl }: VideoPreviewProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      className="relative w-28 h-40 rounded-xl overflow-hidden shadow-lg bg-luxury-dark/30 backdrop-blur-xl border border-luxury-neutral/10"
    >
      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-luxury-dark/50">
          <Loader2 className="w-6 h-6 animate-spin text-luxury-primary" />
        </div>
      )}

      {/* Video Element */}
      <video
        src={videoUrl}
        className="w-full h-full object-cover"
        autoPlay={isPlaying}
        loop
        muted
        playsInline
        onLoadedData={() => setIsLoading(false)}
        onError={() => setIsLoading(false)}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

      {/* Play Button Overlay */}
      {!isPlaying && !isLoading && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsPlaying(true)}
          className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors group"
        >
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="w-12 h-12 rounded-full bg-luxury-primary/20 backdrop-blur-xl flex items-center justify-center border border-luxury-primary/30 group-hover:border-luxury-primary/50 transition-colors"
          >
            <Play className="w-6 h-6 text-white" />
          </motion.div>
        </motion.button>
      )}

      {/* Progress Bar */}
      {isPlaying && (
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 10, ease: "linear" }}
          className="absolute bottom-0 left-0 right-0 h-1 bg-luxury-primary/50"
        />
      )}
    </motion.div>
  );
};