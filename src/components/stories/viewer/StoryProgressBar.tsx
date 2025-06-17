
import { motion } from "framer-motion";

interface StoryProgressBarProps {
  stories: any[];
  currentStoryIndex: number;
  currentBlockIndex: number;
  totalBlocks: number;
  progress: number;
  isPaused: boolean;
}

export const StoryProgressBar = ({
  stories,
  currentStoryIndex,
  currentBlockIndex,
  totalBlocks,
  progress,
  isPaused
}: StoryProgressBarProps) => {
  return (
    <div className="absolute top-0 left-0 right-0 z-50 p-4">
      <div className="flex gap-1">
        {stories.map((_, storyIndex) => {
          const isCurrentStory = storyIndex === currentStoryIndex;
          const isCompletedStory = storyIndex < currentStoryIndex;
          
          if (isCurrentStory && totalBlocks > 1) {
            // Multiple blocks for current story (video segments)
            return (
              <div key={storyIndex} className="flex-1 flex gap-1">
                {Array.from({ length: totalBlocks }, (_, blockIndex) => (
                  <div
                    key={`${storyIndex}-${blockIndex}`}
                    className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden"
                  >
                    <motion.div
                      className="h-full bg-white"
                      initial={{ width: 0 }}
                      animate={{
                        width: blockIndex < currentBlockIndex ? '100%' :
                               blockIndex === currentBlockIndex ? `${progress}%` : '0%'
                      }}
                      transition={{
                        duration: blockIndex === currentBlockIndex && !isPaused ? 0.1 : 0,
                        ease: "linear"
                      }}
                    />
                  </div>
                ))}
              </div>
            );
          }
          
          // Single block for story
          return (
            <div
              key={storyIndex}
              className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden"
            >
              <motion.div
                className="h-full bg-white"
                initial={{ width: 0 }}
                animate={{
                  width: isCompletedStory ? '100%' :
                         isCurrentStory ? `${progress}%` : '0%'
                }}
                transition={{
                  duration: isCurrentStory && !isPaused ? 0.1 : 0,
                  ease: "linear"
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
