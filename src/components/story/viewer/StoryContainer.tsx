
import { Story } from "@/integrations/supabase/types/story";
import { StoryControls } from "./StoryControls";
import { StoryContent } from "./StoryContent";
import { NavigationButtons } from "./NavigationButtons";
import { StoryProgress } from "./StoryProgress";
import { StoryHeader } from "./StoryHeader";
import { StoryActions } from "./StoryActions";
import { ViewersSheet } from "./ViewersSheet";
import { RotatingContentPanel } from "./panels/RotatingContentPanel";

interface StoryContainerProps {
  stories: Story[];
  currentStory: Story;
  currentIndex: number;
  progress: number;
  isPaused: boolean;
  timeRemaining: string;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onPause: () => void;
  onResume: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
}

export const StoryContainer = ({
  stories,
  currentStory,
  currentIndex,
  progress,
  isPaused,
  timeRemaining,
  onClose,
  onNext,
  onPrevious,
  onPause,
  onResume,
  onDelete,
  onEdit,
}: StoryContainerProps) => {
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-[100] overflow-hidden">
      <div className="relative w-full h-full lg:h-[85vh] max-w-[1400px] mx-auto flex">
        {/* Story Section */}
        <div className="relative flex-1 bg-black overflow-hidden">
          <div className="absolute inset-0 flex flex-col overflow-hidden">
            {/* Progress Bar */}
            <div className="absolute top-0 left-0 right-0 z-50 p-4">
              <StoryProgress
                stories={stories}
                currentIndex={currentIndex}
                progress={progress}
                isPaused={isPaused}
              />
            </div>

            {/* Story Header */}
            <StoryHeader
              story={currentStory}
              timeRemaining={timeRemaining}
              onClose={onClose}
            />

            {/* Main Content */}
            <div className="flex-1 relative overflow-hidden">
              <StoryContent
                story={currentStory}
                onNext={onNext}
                isPaused={isPaused}
              />
            </div>

            {/* Navigation and Controls */}
            <StoryControls
              onPrevious={onPrevious}
              onNext={onNext}
              onPause={onPause}
              onResume={onResume}
            />

            {/* Action Buttons */}
            <div className="absolute bottom-4 right-4 z-50">
              <StoryActions
                story={currentStory}
                onDelete={onDelete}
                onEdit={onEdit}
              />
            </div>

            {/* Navigation Buttons */}
            <NavigationButtons
              onPrevious={onPrevious}
              onNext={onNext}
              currentIndex={currentIndex}
              totalStories={stories.length}
            />
          </div>
        </div>

        {/* Rotating Content Panel - Only visible on desktop */}
        <div className="hidden lg:block w-[500px]">
          <RotatingContentPanel />
        </div>
      </div>
    </div>
  );
};
