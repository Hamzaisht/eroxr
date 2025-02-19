
import { motion } from "framer-motion";

interface StoryProgressProps {
  stories: any[];
  currentIndex: number;
  progress: number;
  isPaused: boolean;
}

export const StoryProgress = ({
  stories,
  currentIndex,
  progress,
  isPaused
}: StoryProgressProps) => {
  return (
    <div className="absolute top-0 left-0 right-0 z-20 p-2">
      <div className="flex gap-1">
        {stories.map((_, index) => (
          <div
            key={index}
            className="relative h-[3px] flex-1 bg-white/20 overflow-hidden rounded-full"
          >
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ 
                scaleX: index < currentIndex ? 1 : index === currentIndex ? progress / 100 : 0 
              }}
              transition={{ 
                duration: index === currentIndex && !isPaused ? 0.1 : 0,
                ease: "linear"
              }}
              className="absolute inset-0 bg-white origin-left"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
