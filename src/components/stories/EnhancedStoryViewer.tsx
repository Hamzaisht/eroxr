
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Story } from "@/components/story/types";
import { UniversalStoryContainer } from "./viewer/UniversalStoryContainer";
import { StoryMediaDisplay } from "./viewer/StoryMediaDisplay";
import { StoryNavigationTouch } from "./viewer/StoryNavigationTouch";
import { StoryProgressBar } from "./viewer/StoryProgressBar";
import { StoryHeader } from "./viewer/StoryHeader";

interface EnhancedStoryViewerProps {
  stories: Story[];
  initialStoryIndex?: number;
  onClose: () => void;
}

export const EnhancedStoryViewer = ({
  stories,
  initialStoryIndex = 0,
  onClose
}: EnhancedStoryViewerProps) => {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(initialStoryIndex);
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  const progressInterval = useRef<NodeJS.Timeout>();
  const session = useSession();
  const { toast } = useToast();

  const currentStory = stories[currentStoryIndex];
  const isVideo = currentStory?.content_type === 'video' || !!currentStory?.video_url;
  const mediaUrl = isVideo ? currentStory?.video_url : currentStory?.media_url;
  const isOwner = session?.user?.id === currentStory?.creator_id;

  // Calculate story segments
  const getStoryDuration = useCallback(() => {
    if (isVideo) {
      return 30000; // 30 second segments for videos
    }
    return (currentStory?.duration || 10) * 1000;
  }, [currentStory, isVideo]);

  const getTotalBlocks = useCallback(() => {
    if (isVideo) {
      // For videos, create 30-second blocks (simulate Snapchat behavior)
      return Math.max(1, Math.ceil((currentStory?.duration || 30) / 30));
    }
    return 1; // Images are single block
  }, [currentStory, isVideo]);

  const totalBlocks = getTotalBlocks();
  const blockDuration = getStoryDuration();

  const handleNext = useCallback(() => {
    if (currentBlockIndex < totalBlocks - 1) {
      // Move to next block within story
      setCurrentBlockIndex(prev => prev + 1);
      setProgress(0);
    } else if (currentStoryIndex < stories.length - 1) {
      // Move to next story
      setCurrentStoryIndex(prev => prev + 1);
      setCurrentBlockIndex(0);
      setProgress(0);
    } else {
      onClose();
    }
  }, [currentBlockIndex, totalBlocks, currentStoryIndex, stories.length, onClose]);

  const handlePrevious = useCallback(() => {
    if (currentBlockIndex > 0) {
      // Move to previous block within story
      setCurrentBlockIndex(prev => prev - 1);
      setProgress(0);
    } else if (currentStoryIndex > 0) {
      // Move to previous story
      const prevStoryIndex = currentStoryIndex - 1;
      const prevStory = stories[prevStoryIndex];
      const prevIsVideo = prevStory?.content_type === 'video' || !!prevStory?.video_url;
      const prevTotalBlocks = prevIsVideo ? Math.max(1, Math.ceil((prevStory?.duration || 30) / 30)) : 1;
      
      setCurrentStoryIndex(prevStoryIndex);
      setCurrentBlockIndex(prevTotalBlocks - 1);
      setProgress(0);
    }
  }, [currentBlockIndex, currentStoryIndex, stories]);

  const handlePause = useCallback(() => {
    setIsPaused(true);
  }, []);

  const handleResume = useCallback(() => {
    setIsPaused(false);
  }, []);

  const handleDelete = async () => {
    if (!isOwner || !currentStory) return;

    try {
      const { error } = await supabase
        .from('stories')
        .update({ is_active: false })
        .eq('id', currentStory.id);

      if (error) throw error;

      toast({
        title: "Story deleted",
        description: "Your story has been removed successfully",
      });

      window.dispatchEvent(new CustomEvent('story-deleted'));
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

  const handleAddStory = () => {
    onClose();
    window.dispatchEvent(new CustomEvent('open-story-upload'));
  };

  // Progress tracking for images
  useEffect(() => {
    if (!isVideo && !isPaused) {
      progressInterval.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            handleNext();
            return 0;
          }
          return prev + (100 / blockDuration) * 100;
        });
      }, 100);
    }

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [currentStoryIndex, currentBlockIndex, isPaused, isVideo, blockDuration, handleNext]);

  // Reset states when story changes
  useEffect(() => {
    setProgress(0);
    setCurrentBlockIndex(0);
  }, [currentStoryIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          handlePrevious();
          break;
        case 'ArrowRight':
        case ' ':
          e.preventDefault();
          handleNext();
          break;
        case 'Escape':
          onClose();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrevious, onClose]);

  if (!currentStory) return null;

  return (
    <AnimatePresence>
      <UniversalStoryContainer>
        {/* Progress bar */}
        <StoryProgressBar
          stories={stories}
          currentStoryIndex={currentStoryIndex}
          currentBlockIndex={currentBlockIndex}
          totalBlocks={totalBlocks}
          progress={progress}
          isPaused={isPaused}
        />

        {/* Header */}
        <StoryHeader
          story={currentStory}
          isOwner={isOwner}
          onClose={onClose}
          onDelete={isOwner ? handleDelete : undefined}
          onAddStory={handleAddStory}
        />

        {/* Media content */}
        <StoryMediaDisplay
          mediaUrl={mediaUrl}
          isVideo={isVideo}
          onMediaEnd={handleNext}
          isPaused={isPaused}
        />

        {/* Touch navigation */}
        <StoryNavigationTouch
          onNext={handleNext}
          onPrevious={handlePrevious}
          onPause={handlePause}
          onResume={handleResume}
        />

        {/* Duration indicator */}
        <div className="absolute bottom-6 left-6 z-40 text-white text-sm bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full border border-white/40">
          {isVideo ? 
            `Segment ${currentBlockIndex + 1}/${totalBlocks}` : 
            `${(currentStory?.duration || 10)}s`
          }
        </div>
      </UniversalStoryContainer>
    </AnimatePresence>
  );
};
