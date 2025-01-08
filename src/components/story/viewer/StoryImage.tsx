import { motion } from "framer-motion";

interface StoryImageProps {
  mediaUrl: string;
  username: string;
  isPaused: boolean;
}

export const StoryImage = ({ mediaUrl, username, isPaused }: StoryImageProps) => {
  return (
    <motion.img
      key={mediaUrl}
      src={mediaUrl}
      alt={`Story by ${username}`}
      className="h-full w-full object-cover"
      initial={{ opacity: 0, scale: 1.1 }}
      animate={{ 
        opacity: 1, 
        scale: isPaused ? 1.05 : 1,
      }}
      exit={{ opacity: 0 }}
      transition={{ 
        duration: 0.3,
        scale: {
          duration: 0.2,
        }
      }}
      style={{ 
        pointerEvents: 'none',
        WebkitUserSelect: 'none',
        userSelect: 'none'
      }}
      onContextMenu={(e) => e.preventDefault()}
    />
  );
};