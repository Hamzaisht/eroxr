
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { StoryContainer } from "./viewer/StoryContainer";
import { useToast } from "@/hooks/use-toast";
import { Story } from "@/integrations/supabase/types/story";
import { supabase } from "@/integrations/supabase/client";

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
      onClose();
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
    // To be implemented
    toast({
      title: "Coming soon",
      description: "Story editing will be available soon",
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
      className="fixed inset-0 z-50"
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
        onDelete={handleDelete}
        onEdit={handleEdit}
        timeRemaining={timeRemaining}
      />
    </motion.div>
  );
};
