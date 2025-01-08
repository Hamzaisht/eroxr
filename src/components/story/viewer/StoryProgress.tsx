import { motion } from "framer-motion";

interface StoryProgressProps {
  stories: any[];
  currentIndex: number;
  isPaused: boolean;
}

export const StoryProgress = ({ stories, currentIndex, isPaused }: StoryProgressProps) => {
  return (
    <div className="absolute top-0 left-0 right-0 z-10 p-2">
      <div className="flex gap-1">
        {stories.map((_, index) => (
          <div
            key={index}
            className="relative h-1 flex-1 bg-luxury-neutral/20 overflow-hidden rounded-full"
          >
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ 
                scaleX: index < currentIndex ? 1 : index === currentIndex && !isPaused ? 1 : 0 
              }}
              transition={{ 
                duration: index === currentIndex && !isPaused ? 5 : 0,
                ease: "linear"
              }}
              className="absolute inset-0 bg-luxury-primary origin-left"
            />
          </div>
        ))}
      </div>
    </div>
  );
};