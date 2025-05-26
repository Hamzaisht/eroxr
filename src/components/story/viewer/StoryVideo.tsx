
import { forwardRef, useState } from "react";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";

interface StoryVideoProps {
  videoUrl: string;
  onEnded: () => void;
  isPaused: boolean;
  creatorId: string;
  onError?: () => void;
}

export const StoryVideo = forwardRef<HTMLVideoElement, StoryVideoProps>(
  ({ videoUrl, onEnded, isPaused, creatorId, onError }, ref) => {
    const [hasError, setHasError] = useState(false);
    
    return (
      <div className="relative w-full h-full bg-black">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 flex flex-col items-center justify-center"
        >
          <AlertCircle className="w-12 h-12 text-gray-400 mb-2" />
          <p className="text-gray-200">Story content coming soon</p>
        </motion.div>
      </div>
    );
  }
);

StoryVideo.displayName = 'StoryVideo';
