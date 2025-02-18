
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMediaQuery } from "@/hooks/use-mobile";
import { StoryProgress } from "./viewer/StoryProgress";
import { StoryHeader } from "./viewer/StoryHeader";
import { StoryVideo } from "./viewer/StoryVideo";
import { StoryImage } from "./viewer/StoryImage";
import { StoryControls } from "./viewer/StoryControls";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Story {
  id: string;
  media_url?: string | null;
  video_url?: string | null;
  duration?: number | null;
  creator: {
    id: string;
    username: string;
    avatar_url: string;
  };
}

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
  const videoRef = useRef<HTMLVideoElement>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");
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

  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    
    if (x < width / 3) {
      handlePrevious();
    } else if (x > (width * 2) / 3) {
      handleNext();
    }
  };

  const handleError = () => {
    toast({
      title: "Error",
      description: "Failed to load story content",
      variant: "destructive",
    });
  };

  const handleMouseDown = () => setIsPaused(true);
  const handleMouseUp = () => setIsPaused(false);
  const handleMouseLeave = () => setIsPaused(false);
  const handleTouchStart = () => setIsPaused(true);
  const handleTouchEnd = () => setIsPaused(false);

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
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        />

        <motion.div
          key={currentStory.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 flex items-center justify-center bg-black"
        >
          {isVideo ? (
            <StoryVideo
              ref={videoRef}
              videoUrl={currentStory.video_url!}
              onEnded={handleNext}
              isPaused={isPaused}
            />
          ) : (
            <StoryImage
              mediaUrl={currentStory.media_url || ''}
              username={currentStory.creator.username}
              isPaused={isPaused}
            />
          )}
        </motion.div>

        {/* Navigation buttons - visible on desktop only */}
        {!isMobile && (
          <AnimatePresence>
            {currentIndex > 0 && (
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onClick={handlePrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 text-white/70 hover:text-white transition-colors"
                aria-label="Previous story"
              >
                <ChevronLeft className="h-8 w-8" />
              </motion.button>
            )}
            {currentIndex < stories.length - 1 && (
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-white/70 hover:text-white transition-colors"
                aria-label="Next story"
              >
                <ChevronRight className="h-8 w-8" />
              </motion.button>
            )}
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
};
