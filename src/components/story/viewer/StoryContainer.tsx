
import { useEffect, useState } from "react";
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
  const isMobile = useMediaQuery("(max-width: 768px)");
  const session = useSession();

  useEffect(() => {
    if (session?.user?.id) {
      initializeScreenshotProtection(session.user.id, currentStory.creator_id);
    }

    // Lock body scroll when story is open
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
    <div 
      className="fixed inset-0 bg-black z-[100] w-screen h-screen flex items-center justify-center"
      style={{ height: '100dvh' }}
    >
      {/* Use viewport units for maximum height and scale */}
      <div className="relative h-full w-full md:h-[100vh] md:w-[100vh] max-h-screen">
        <StoryProgress
          stories={stories}
          currentIndex={currentIndex}
          progress={progress}
          isPaused={isPaused}
        />

        <div className="absolute top-0 left-0 right-0 z-20 p-4">
          <StoryHeader
            creator={currentStory.creator}
            timeRemaining={timeRemaining}
            onClose={onClose}
          />
        </div>

        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <StoryContent 
            story={currentStory}
            onNext={onNext}
            isPaused={isPaused}
          />
        </div>

        <StoryControls
          onClick={handleContentClick}
          onMouseDown={onPause}
          onMouseUp={onResume}
          onMouseLeave={onResume}
          onTouchStart={onPause}
          onTouchEnd={onResume}
        />

        {!isMobile && (
          <NavigationButtons
            currentIndex={currentIndex}
            totalStories={stories.length}
            onNext={onNext}
            onPrevious={onPrevious}
          />
        )}

        <ViewersSheet 
          open={false}
          onOpenChange={() => {}}
        />
      </div>
    </div>
  );
};
