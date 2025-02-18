
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { StoryContainer } from "./viewer/StoryContainer";
import { useToast } from "@/hooks/use-toast";
import { Story } from "@/integrations/supabase/types/story";

interface StoryViewerProps {
  stories: Story[];
  initialStoryIndex?: number;
  onClose: () => void;
}

export const StoryViewer = ({
  stories,
  initialStoryIndex = 0,
  onClose
}: StoryViewerProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialStoryIndex);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressInterval = useRef<NodeJS.Timeout>();
  const { toast } = useToast();

  const currentStory = stories[currentIndex];
  const isVideo = !!currentStory?.video_url;
  const duration = isVideo ? 0 : (currentStory?.duration || 5000);

  useEffect(() => {
    if (!isVideo && !isPaused) {
      progressInterval.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            handleNext();
            return 0;
          }
          return prev + (100 / duration) * 100;
        });
      }, 100);
    }

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [currentIndex, isPaused, isVideo, duration]);

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setProgress(0);
    }
  };

  const handleError = () => {
    toast({
      title: "Error",
      description: "Failed to load story content",
      variant: "destructive",
    });
  };

  const timeRemaining = isVideo 
    ? "Video"
    : `${Math.ceil((duration - (progress / 100) * duration) / 1000)}s`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
      onClick={onClose}
    >
      <StoryContainer
        stories={stories}
        currentStory={currentStory}
        currentIndex={currentIndex}
        progress={progress}
        isPaused={isPaused}
        onClose={onClose}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onPause={() => setIsPaused(true)}
        onResume={() => setIsPaused(false)}
        timeRemaining={timeRemaining}
      />
    </motion.div>
  );
};
