
import { useEffect } from "react";
import { StoryControls } from "./StoryControls";
import { StoryContent } from "./StoryContent";
import { NavigationButtons } from "./NavigationButtons";
import { StoryProgress } from "./StoryProgress";
import { StoryHeader } from "./StoryHeader";
import { ViewersSheet } from "./ViewersSheet";
import { Story } from "@/integrations/supabase/types/story";
import { useMediaQuery } from "@/hooks/use-mobile";
import { initializeScreenshotProtection } from "@/lib/security";
import { useSession } from "@supabase/auth-helpers-react";
import { X } from "lucide-react";
import { motion } from "framer-motion";

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
  onDelete?: () => void;
  onEdit?: () => void;
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
  onDelete,
  onEdit,
  timeRemaining,
}: StoryContainerProps) => {
  const session = useSession();

  useEffect(() => {
    if (session?.user?.id) {
      initializeScreenshotProtection(session.user.id, currentStory.creator_id);
    }
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [session?.user?.id, currentStory.creator_id]);

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
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black snap-y snap-mandatory overflow-y-auto"
    >
      <div className="w-full h-[100dvh] relative snap-start">
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/20 pointer-events-none z-[1]" />

        {/* Close Button - Floating */}
        <button
          onClick={onClose}
          className="fixed top-4 right-4 z-[102] p-2 rounded-full bg-black/50 hover:bg-black/70 transition-all"
        >
          <X className="w-6 h-6 text-white" />
        </button>

        {/* Progress Bar - Floating */}
        <div className="absolute top-0 left-0 right-0 z-[101] p-4">
          <StoryProgress
            stories={stories}
            currentIndex={currentIndex}
            progress={progress}
            isPaused={isPaused}
          />
        </div>

        {/* Story Content */}
        <div className="absolute inset-0">
          <StoryContent 
            story={currentStory}
            onNext={onNext}
            isPaused={isPaused}
          />
        </div>

        {/* Story Controls */}
        <StoryControls
          onClick={handleContentClick}
          onMouseDown={onPause}
          onMouseUp={onResume}
          onMouseLeave={onResume}
          onTouchStart={onPause}
          onTouchEnd={onResume}
        />

        {/* Navigation Buttons - Floating */}
        <NavigationButtons
          currentIndex={currentIndex}
          totalStories={stories.length}
          onNext={onNext}
          onPrevious={onPrevious}
        />

        {/* Viewers Sheet */}
        <ViewersSheet 
          open={false}
          onOpenChange={() => {}}
        />
      </div>
    </motion.div>
  );
};
