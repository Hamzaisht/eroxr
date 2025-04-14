
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StoryContainer } from "./viewer/StoryContainer";
import { useToast } from "@/hooks/use-toast";
import { Story } from "@/integrations/supabase/types/story";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";

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
  const session = useSession();

  const currentStory = stories[currentIndex];
  const isVideo = currentStory?.content_type === 'video' || currentStory?.media_type === 'video' || !!currentStory?.video_url;
  const duration = isVideo ? 0 : (currentStory?.duration || 5) * 1000;
  const isOwner = session?.user?.id === currentStory?.creator_id;

  useEffect(() => {
    if (!isVideo && !isPaused) {
      // Clear any existing interval
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
      
      // Reset progress
      setProgress(0);
      
      // Set a new interval
      progressInterval.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            handleNext();
            return 0;
          }
          return prev + (100 / duration) * 100;
        });
      }, 100);
    } else if (isVideo) {
      // For videos, don't use progress interval
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
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

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('stories')
        .delete()
        .eq('id', currentStory.id);

      if (error) throw error;

      toast({
        title: "Story deleted",
        description: "Your story has been removed successfully",
      });
      
      // Update local state and handle deletion
      window.dispatchEvent(new CustomEvent('story-deleted'));
      
      if (stories.length === 1) {
        onClose();
      } 
      else if (currentIndex === stories.length - 1) {
        handlePrevious();
      }
      else {
        setProgress(0);
      }
    } catch (error) {
      console.error('Error deleting story:', error);
      toast({
        title: "Error",
        description: "Failed to delete story",
        variant: "destructive",
      });
    }
  };

  const handleEdit = () => {
    toast({
      title: "Coming soon",
      description: "Story editing will be available soon",
    });
  };

  const timeRemaining = isVideo 
    ? "Video"
    : `${Math.ceil((duration - (progress / 100) * duration) / 1000)}s`;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50"
        onClick={(e) => e.stopPropagation()}
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
          onDelete={isOwner ? handleDelete : undefined}
          onEdit={isOwner ? handleEdit : undefined}
          timeRemaining={timeRemaining}
        />
      </motion.div>
    </AnimatePresence>
  );
};
