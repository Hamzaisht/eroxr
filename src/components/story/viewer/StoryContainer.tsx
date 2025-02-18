
import { motion } from "framer-motion";
import { StoryControls } from "./StoryControls";
import { StoryContent } from "./StoryContent";
import { NavigationButtons } from "./NavigationButtons";
import { StoryProgress } from "./StoryProgress";
import { StoryHeader } from "./StoryHeader";
import { Story } from "@/integrations/supabase/types/story";
import { useMediaQuery } from "@/hooks/use-mobile";

interface StoryContainerProps {
  stories: Story[];
  currentStory: Story;
  currentIndex: number;
  progress: number;
  isPaused: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onPause: () => void;
  onResume: () => void;
  timeRemaining: string;
}

export const StoryContainer = ({
  stories,
  currentStory,
  currentIndex,
  progress,
  isPaused,
  onClose,
  onNext,
  onPrevious,
  onPause,
  onResume,
  timeRemaining,
}: StoryContainerProps) => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    
    if (x < width / 3) {
      onPrevious();
    } else if (x > (width * 2) / 3) {
      onNext();
    }
  };

  return (
    <div 
      className={`relative ${isMobile ? 'w-full h-full' : 'w-full max-w-lg h-[80vh]'} overflow-hidden`}
      onClick={(e) => e.stopPropagation()}
    >
      <StoryProgress
        stories={stories}
        currentIndex={currentIndex}
        progress={progress}
        isPaused={isPaused}
      />

      <StoryHeader
        creator={currentStory.creator}
        timeRemaining={timeRemaining}
        onClose={onClose}
      />

      <StoryControls
        onClick={handleContentClick}
        onMouseDown={onPause}
        onMouseUp={onResume}
        onMouseLeave={onResume}
        onTouchStart={onPause}
        onTouchEnd={onResume}
      />

      <StoryContent 
        story={currentStory}
        onNext={onNext}
        isPaused={isPaused}
      />

      {!isMobile && (
        <NavigationButtons
          currentIndex={currentIndex}
          totalStories={stories.length}
          onNext={onNext}
          onPrevious={onPrevious}
        />
      )}
    </div>
  );
};
