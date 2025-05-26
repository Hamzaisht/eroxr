
import { AlertCircle, Play } from "lucide-react";
import { motion } from "framer-motion";

interface VideoPlayerProps {
  url: string;
  poster?: string;
  onError: () => void;
  onEnded?: () => void;
}

export const VideoPlayer = ({ url, poster, onError, onEnded }: VideoPlayerProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="relative min-w-[300px] max-w-[500px] aspect-video cursor-pointer group"
    >
      <div className="w-full h-full flex items-center justify-center bg-black rounded-lg">
        <div className="text-center">
          <Play className="w-12 h-12 text-white/60 mx-auto mb-2" />
          <p className="text-white/80 text-sm">Video player coming soon</p>
        </div>
      </div>
    </motion.div>
  );
};
