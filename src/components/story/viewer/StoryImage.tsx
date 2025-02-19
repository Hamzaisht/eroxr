
import { motion } from "framer-motion";

interface StoryImageProps {
  mediaUrl: string;
  username: string;
  isPaused: boolean;
}

export const StoryImage = ({ mediaUrl, username, isPaused }: StoryImageProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex items-center justify-center bg-black"
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
