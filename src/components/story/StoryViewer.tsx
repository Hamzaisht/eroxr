import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { StoryHeader } from "./viewer/StoryHeader";
import { StoryProgress } from "./viewer/StoryProgress";
import { StoryControls } from "./viewer/StoryControls";
import { StoryImage } from "./viewer/StoryImage";
import { StoryVideo } from "./viewer/StoryVideo";
import { formatDistanceToNow } from "date-fns";
import { Story } from "@/integrations/supabase/types/story";
import { motion, AnimatePresence } from "framer-motion";

interface StoryViewerProps {
  stories: Story[];
  initialStoryIndex: number;
  onClose: () => void;
}

export const StoryViewer = ({ stories, initialStoryIndex, onClose }: StoryViewerProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialStoryIndex);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState<string>("");
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const updateTimeRemaining = () => {
      const expiryDate = new Date(stories[currentIndex].expires_at);
      const timeLeft = formatDistanceToNow(expiryDate, { addSuffix: true });
      setTimeRemaining(timeLeft);
    };

    updateTimeRemaining();
    const interval = setInterval(updateTimeRemaining, 60000);

    // Close story if expired
    const expiryDate = new Date(stories[currentIndex].expires_at);
    if (expiryDate < new Date()) {
      onClose();
    }

    return () => clearInterval(interval);
  }, [currentIndex, stories, onClose]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const currentStory = stories[currentIndex];

    if (!isPaused && !currentStory.video_url) {
      const duration = 5000; // 5 seconds for images
      const interval = 50; // Update progress every 50ms
      let elapsed = 0;

      timer = setInterval(() => {
        elapsed += interval;
        setProgress((elapsed / duration) * 100);

        if (elapsed >= duration) {
          if (currentIndex < stories.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setProgress(0);
          } else {
            onClose();
          }
        }
      }, interval);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [currentIndex, isPaused, stories, onClose]);

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setProgress(0);
    }
  };

  const handlePress = () => {
    setIsPaused(true);
  };

  const handleRelease = () => {
    setIsPaused(false);
  };

  const currentStory = stories[currentIndex];

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] p-0 gap-0 bg-transparent border-none">
        <div className="relative w-full h-full overflow-hidden rounded-lg bg-luxury-darker">
          <AnimatePresence mode="wait">
            {currentStory.video_url ? (
              <StoryVideo
                ref={videoRef}
                key={`video-${currentStory.id}`}
                videoUrl={currentStory.video_url}
                onEnded={handleNext}
                isPaused={isPaused}
              />
            ) : (
              <StoryImage
                key={`image-${currentStory.id}`}
                mediaUrl={currentStory.media_url || ''}
                username={currentStory.creator.username || 'Anonymous'}
                isPaused={isPaused}
              />
            )}
          </AnimatePresence>

          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/50" />

          <StoryHeader
            creator={currentStory.creator}
            timeRemaining={timeRemaining}
            onClose={onClose}
          />

          <StoryProgress
            stories={stories}
            currentIndex={currentIndex}
            progress={progress}
          />

          <StoryControls
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              if (x < rect.width / 2) {
                handlePrevious();
              } else {
                handleNext();
              }
            }}
            onTouchStart={handlePress}
            onTouchEnd={handleRelease}
            onMouseDown={handlePress}
            onMouseUp={handleRelease}
            onMouseLeave={handleRelease}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};