import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Story } from "@/integrations/supabase/types/story";
import { StoryHeader } from "./viewer/StoryHeader";
import { StoryProgress } from "./viewer/StoryProgress";
import { StoryControls } from "./viewer/StoryControls";
import { StoryImage } from "./viewer/StoryImage";
import { StoryVideo } from "./viewer/StoryVideo";
import { useMediaQuery } from "@/hooks/use-mobile";

interface StoryViewerProps {
  stories: Story[];
  initialStoryIndex: number;
  onClose: () => void;
}

export const StoryViewer = ({ stories, initialStoryIndex, onClose }: StoryViewerProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialStoryIndex);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressInterval = useRef<NodeJS.Timeout>();
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  const STORY_DURATION = 5000; // 5 seconds for images
  
  const currentStory = stories[currentIndex];
  const isVideo = currentStory?.video_url;
  const duration = isVideo ? (currentStory.duration || 10) * 1000 : STORY_DURATION;

  useEffect(() => {
    if (!currentStory) {
      onClose();
      return;
    }

    setProgress(0);
    setIsPaused(false);

    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }

    const startTime = Date.now();
    progressInterval.current = setInterval(() => {
      if (!isPaused) {
        const elapsed = Date.now() - startTime;
        const newProgress = (elapsed / duration) * 100;
        
        if (newProgress >= 100) {
          if (currentIndex < stories.length - 1) {
            setCurrentIndex(prev => prev + 1);
          } else {
            onClose();
          }
        } else {
          setProgress(newProgress);
        }
      }
    }, 100);

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [currentIndex, currentStory, duration, isPaused, onClose, stories.length]);

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    
    if (x < rect.width / 2) {
      handlePrevious();
    } else {
      handleNext();
    }
  };

  const handleHold = () => {
    setIsPaused(true);
  };

  const handleRelease = () => {
    setIsPaused(false);
  };

  if (!currentStory) return null;

  const timeRemaining = "Just now";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
      onClick={() => onClose()}
    >
      <div 
        className={`relative ${isMobile ? 'w-full h-full' : 'w-full max-w-lg h-[80vh]'} overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        <StoryHeader
          creator={currentStory.creator}
          timeRemaining={timeRemaining}
          onClose={onClose}
        />

        <StoryProgress
          stories={stories}
          currentIndex={currentIndex}
          progress={progress}
          isPaused={isPaused}
        />

        <div className="relative h-full bg-black">
          {isVideo ? (
            <StoryVideo
              ref={videoRef}
              videoUrl={currentStory.video_url || ""}
              onEnded={handleNext}
              isPaused={isPaused}
            />
          ) : (
            <StoryImage
              mediaUrl={currentStory.media_url || ""}
              username={currentStory.creator?.username || ""}
              isPaused={isPaused}
            />
          )}

          <StoryControls
            onClick={handleContentClick}
            onTouchStart={handleHold}
            onTouchEnd={handleRelease}
            onMouseDown={handleHold}
            onMouseUp={handleRelease}
            onMouseLeave={handleRelease}
          />
        </div>
      </div>
    </motion.div>
  );
};