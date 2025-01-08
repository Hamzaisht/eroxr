import { Dialog, DialogContent } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { StoryProgress } from "./viewer/StoryProgress";
import { StoryHeader } from "./viewer/StoryHeader";
import { StoryImage } from "./viewer/StoryImage";
import { StoryControls } from "./viewer/StoryControls";

interface StoryViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stories: Array<{
    id: string;
    media_url: string;
    created_at: string;
    expires_at: string;
  }>;
  creator: {
    id: string;
    username: string;
    avatar_url: string;
  };
}

export const StoryViewer = ({ open, onOpenChange, stories, creator }: StoryViewerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHoldingClick, setIsHoldingClick] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<string>("");

  // Prevent screenshots
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === 'PrintScreen') ||
        (e.ctrlKey && e.key === 'p') ||
        (e.metaKey && e.key === 'p')
      ) {
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Update time remaining
  useEffect(() => {
    if (!open) return;

    const updateTimeRemaining = () => {
      const expiryDate = new Date(stories[currentIndex].expires_at);
      const now = new Date();
      
      if (expiryDate > now) {
        setTimeRemaining(formatDistanceToNow(expiryDate, { addSuffix: true }));
      } else {
        setTimeRemaining("Expired");
        onOpenChange(false);
      }
    };

    updateTimeRemaining();
    const interval = setInterval(updateTimeRemaining, 1000);
    return () => clearInterval(interval);
  }, [currentIndex, open, stories, onOpenChange]);

  // Auto-advance timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (open && !isHoldingClick && !isPaused) {
      timer = setTimeout(() => {
        if (currentIndex < stories.length - 1) {
          setCurrentIndex(currentIndex + 1);
        } else {
          onOpenChange(false);
          setCurrentIndex(0);
        }
      }, 5000);
    }

    return () => clearTimeout(timer);
  }, [currentIndex, open, isHoldingClick, isPaused, stories.length, onOpenChange]);

  const handleClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const isRightSide = x > rect.width / 2;

    if (isRightSide) {
      if (currentIndex < stories.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        onOpenChange(false);
        setCurrentIndex(0);
      }
    } else {
      if (currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      }
    }
  };

  const handleTouchStart = () => {
    setIsHoldingClick(true);
    setIsPaused(true);
  };

  const handleTouchEnd = () => {
    setIsHoldingClick(false);
    setIsPaused(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[500px] p-0 bg-transparent border-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="relative w-full cursor-pointer"
            style={{ WebkitUserSelect: 'none', userSelect: 'none' }}
            onContextMenu={(e) => e.preventDefault()}
          >
            <AspectRatio ratio={9/16} className="bg-black">
              <StoryProgress 
                stories={stories}
                currentIndex={currentIndex}
                isPaused={isPaused}
              />
              
              <StoryHeader 
                creator={creator}
                timeRemaining={timeRemaining}
              />

              <StoryImage 
                mediaUrl={stories[currentIndex].media_url}
                username={creator.username}
                isPaused={isPaused}
              />

              <StoryControls 
                onClick={handleClick}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onMouseDown={handleTouchStart}
                onMouseUp={handleTouchEnd}
                onMouseLeave={handleTouchEnd}
              />
            </AspectRatio>
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};