
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";

interface StoryImageProps {
  mediaUrl: string;
  username: string;
  isPaused: boolean;
  creatorId: string;
  onError?: () => void;
}

export const StoryImage = ({ mediaUrl, username, isPaused, creatorId, onError }: StoryImageProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex items-center justify-center bg-black"
    >
      <div className="text-center">
        <AlertCircle className="w-12 h-12 text-luxury-primary mb-2 mx-auto" />
        <p className="text-gray-200">Story content coming soon</p>
      </div>
    </motion.div>
  );
};
