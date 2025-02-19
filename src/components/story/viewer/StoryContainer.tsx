
import { useEffect, useState } from "react";
import { StoryControls } from "./StoryControls";
import { StoryContent } from "./StoryContent";
import { NavigationButtons } from "./NavigationButtons";
import { StoryProgress } from "./StoryProgress";
import { StoryHeader } from "./StoryHeader";
import { StoryActions } from "./StoryActions";
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

interface ViewerStats {
  views: number;
  screenshots: number;
  shares: number;
  likes: number;
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
  const [viewerStats] = useState<ViewerStats>({ 
    views: 41300,
    screenshots: 287,
    shares: 1924,
    likes: 4597
  });
  const [showViewers, setShowViewers] = useState(false);

  useEffect(() => {
    if (session?.user?.id) {
      initializeScreenshotProtection(session.user.id, currentStory.creator_id);
    }
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

  const isOwner = session?.user?.id === currentStory.creator_id;

  return (
    <div 
      className="fixed inset-0 bg-black flex items-center justify-center z-50"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="relative w-full h-full">
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

        <StoryContent 
          story={currentStory}
          onNext={onNext}
          isPaused={isPaused}
        />

        <StoryControls
          onClick={handleContentClick}
          onMouseDown={onPause}
          onMouseUp={onResume}
          onMouseLeave={onResume}
          onTouchStart={onPause}
          onTouchEnd={onResume}
        />

        <StoryActions 
          stats={viewerStats}
          isOwner={isOwner}
          onViewersClick={() => setShowViewers(true)}
          onEdit={onEdit}
          onDelete={onDelete}
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
          open={showViewers}
          onOpenChange={setShowViewers}
        />
      </div>
    </div>
  );
};
