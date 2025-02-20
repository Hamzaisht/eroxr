
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
      className="absolute inset-0 bg-black aspect-[9/16] w-full h-full"
    >
      <img
        src={mediaUrl}
        alt={`Story by ${username}`}
        className="w-full h-full object-cover"
        loading="eager"
        style={{
          objectPosition: 'center center'
        }}
      />
    </motion.div>
  );
};
