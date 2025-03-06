
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface VideoControlsProps {
  isHovered: boolean;
  isPlaying: boolean;
  isMuted: boolean;
  togglePlay: () => void;
  toggleMute: () => void;
}

export const VideoControls = ({ 
  isHovered, 
  isPlaying, 
  isMuted, 
  togglePlay, 
  toggleMute 
}: VideoControlsProps) => {
  return (
    <motion.div 
      className="absolute bottom-4 left-4 z-20 flex items-center gap-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: isHovered || isPlaying ? 1 : 0.8 }}
      transition={{ duration: 0.3 }}
    >
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={togglePlay}
        className="w-12 h-12 rounded-full bg-luxury-primary/80 backdrop-blur-sm flex items-center justify-center hover:bg-luxury-primary transition-colors shadow-lg"
      >
        {isPlaying ? (
          <Pause className="w-5 h-5 text-white" />
        ) : (
          <Play className="w-5 h-5 text-white ml-0.5" />
        )}
      </motion.button>
      
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleMute}
        className="w-10 h-10 rounded-full bg-luxury-dark/80 backdrop-blur-sm flex items-center justify-center hover:bg-luxury-dark transition-colors shadow-lg"
      >
        {isMuted ? (
          <VolumeX className="w-4 h-4 text-white" />
        ) : (
          <Volume2 className="w-4 h-4 text-white" />
        )}
      </motion.button>
    </motion.div>
  );
};
