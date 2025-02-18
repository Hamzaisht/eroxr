
import { motion } from "framer-motion";

interface StoryImageProps {
  mediaUrl: string;
  username: string;
  isPaused: boolean;
}

export const StoryImage = ({ mediaUrl, username }: StoryImageProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative w-full h-full"
    >
      <img
        src={mediaUrl}
        alt={`Story by ${username}`}
        className="w-full h-full object-contain"
        loading="eager"
      />
    </motion.div>
  );
};
