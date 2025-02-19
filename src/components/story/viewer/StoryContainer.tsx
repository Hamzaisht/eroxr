
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
import { motion, AnimatePresence } from "framer-motion";
import { Heart, SmilePlus, Frown, Crown, ThumbsUp } from "lucide-react";

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
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);

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

  const handleReaction = (reaction: string) => {
    setSelectedReaction(reaction);
    // TODO: Implement reaction submission to backend
    setTimeout(() => setSelectedReaction(null), 1000);
  };

  return (
    <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50">
      <div className="relative w-full h-full md:h-[100vh] md:w-[calc(100vh*9/16)] max-w-3xl mx-auto bg-black overflow-hidden">
        {/* Progress Bar */}
        <StoryProgress
          stories={stories}
          currentIndex={currentIndex}
          progress={progress}
          isPaused={isPaused}
        />

        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-20 p-4">
          <StoryHeader
            creator={currentStory.creator}
            timeRemaining={timeRemaining}
            onClose={onClose}
          />
        </div>

        {/* Main Content */}
        <StoryContent 
          story={currentStory}
          onNext={onNext}
          isPaused={isPaused}
        />

        {/* Touch Controls */}
        <StoryControls
          onClick={handleContentClick}
          onMouseDown={onPause}
          onMouseUp={onResume}
          onMouseLeave={onResume}
          onTouchStart={onPause}
          onTouchEnd={onResume}
        />

        {/* Bottom Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
          {/* Reply Input */}
          <AnimatePresence>
            {showReplyInput && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                className="mb-4"
              >
                <input
                  type="text"
                  placeholder="Write a reply..."
                  className="w-full px-4 py-3 rounded-full bg-white/10 backdrop-blur-md text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/20"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Reaction Buttons */}
          <div className="flex justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleReaction('love')}
              className={`p-3 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all ${
                selectedReaction === 'love' ? 'bg-red-500/50' : ''
              }`}
            >
              <Heart className="w-6 h-6 text-white" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleReaction('happy')}
              className="p-3 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all"
            >
              <SmilePlus className="w-6 h-6 text-white" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleReaction('sad')}
              className="p-3 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all"
            >
              <Frown className="w-6 h-6 text-white" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleReaction('crown')}
              className="p-3 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all"
            >
              <Crown className="w-6 h-6 text-white" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleReaction('like')}
              className="p-3 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all"
            >
              <ThumbsUp className="w-6 h-6 text-white" />
            </motion.button>
          </div>
        </div>

        {/* Navigation Buttons */}
        {!isMobile && (
          <NavigationButtons
            currentIndex={currentIndex}
            totalStories={stories.length}
            onNext={onNext}
            onPrevious={onPrevious}
          />
        )}

        {/* Viewers Sheet */}
        <ViewersSheet 
          open={false}
          onOpenChange={() => {}}
        />
      </div>
    </div>
  );
};
