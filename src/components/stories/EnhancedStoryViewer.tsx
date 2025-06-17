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

// Group stories by user while maintaining chronological order
const groupStoriesByUser = (stories: Story[]) => {
  const grouped = stories.reduce((acc, story) => {
    const userId = story.creator_id;
    if (!acc[userId]) {
      acc[userId] = [];
    }
    acc[userId].push(story);
    return acc;
  }, {} as Record<string, Story[]>);

  // Keep stories in their original order (already chronological from the query)
  return grouped;
};

export const EnhancedStoryViewer = ({
  stories,
  initialStoryIndex = 0,
  onClose
}: EnhancedStoryViewerProps) => {
  // Group stories by user
  const groupedStories = groupStoriesByUser(stories);
  const userIds = Object.keys(groupedStories);
  
  // Find which user group contains the initial story
  const initialStory = stories[initialStoryIndex];
  const initialUserIndex = userIds.findIndex(userId => userId === initialStory?.creator_id);
  const currentUserIndex = initialUserIndex >= 0 ? initialUserIndex : 0;
  
  // Find which story within the user's stories is the initial one
  const initialUserStories = groupedStories[userIds[currentUserIndex]] || [];
  const initialStoryInUserGroup = initialUserStories.findIndex(story => story.id === initialStory?.id);
  
  const [currentUserStoryIndex, setCurrentUserStoryIndex] = useState(currentUserIndex);
  const [currentStoryInGroup, setCurrentStoryInGroup] = useState(initialStoryInUserGroup >= 0 ? initialStoryInUserGroup : 0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  const progressInterval = useRef<NodeJS.Timeout>();
  const session = useSession();
  const { toast } = useToast();

  // Get current story data
  const currentUserStories = groupedStories[userIds[currentUserStoryIndex]] || [];
  const currentStory = currentUserStories[currentStoryInGroup];
  const isVideo = currentStory?.content_type === 'video' || !!currentStory?.video_url;
  const mediaUrl = isVideo ? currentStory?.video_url : currentStory?.media_url;
  const isOwner = session?.user?.id === currentStory?.creator_id;

  // Get story duration - simplified without segments
  const getStoryDuration = useCallback(() => {
    if (isVideo) {
      return (currentStory?.duration || 30) * 1000; // Full video duration
    }
    return (currentStory?.duration || 10) * 1000; // Image duration
  }, [currentStory, isVideo]);

  const storyDuration = getStoryDuration();

  const handleNext = useCallback(() => {
    if (currentStoryInGroup < currentUserStories.length - 1) {
      // Move to next story within current user's stories
      setCurrentStoryInGroup(prev => prev + 1);
      setProgress(0);
    } else if (currentUserStoryIndex < userIds.length - 1) {
      // Move to next user's stories
      setCurrentUserStoryIndex(prev => prev + 1);
      setCurrentStoryInGroup(0);
      setProgress(0);
    } else {
      // No more stories, close viewer
      onClose();
    }
  }, [currentStoryInGroup, currentUserStories.length, currentUserStoryIndex, userIds.length, onClose]);

  const handlePrevious = useCallback(() => {
    if (currentStoryInGroup > 0) {
      // Move to previous story within current user's stories
      setCurrentStoryInGroup(prev => prev - 1);
      setProgress(0);
    } else if (currentUserStoryIndex > 0) {
      // Move to previous user's stories (go to their last story)
      const prevUserIndex = currentUserStoryIndex - 1;
      const prevUserStories = groupedStories[userIds[prevUserIndex]] || [];
      const lastStoryIndex = prevUserStories.length - 1;
      
      setCurrentUserStoryIndex(prevUserIndex);
      setCurrentStoryInGroup(lastStoryIndex);
      setProgress(0);
    }
  }, [currentStoryInGroup, currentUserStoryIndex, userIds, groupedStories]);

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

  // Progress tracking for images (videos handle their own progress)
  useEffect(() => {
    if (!isVideo && !isPaused) {
      progressInterval.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            handleNext();
            return 0;
          }
          return prev + (100 / storyDuration) * 100;
        });
      }, 100);
    }

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [currentUserStoryIndex, currentStoryInGroup, isPaused, isVideo, storyDuration, handleNext]);

  // Reset progress when story changes
  useEffect(() => {
    setProgress(0);
  }, [currentUserStoryIndex, currentStoryInGroup]);

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
        {/* Progress bar - show progress for current user's stories */}
        <StoryProgressBar
          stories={currentUserStories}
          currentStoryIndex={currentStoryInGroup}
          currentBlockIndex={0}
          totalBlocks={1}
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
          {`${(currentStory?.duration || (isVideo ? 30 : 10))}s`}
        </div>

        {/* User stories indicator */}
        <div className="absolute bottom-6 right-6 z-40 text-white text-xs bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full border border-white/40">
          {currentStoryInGroup + 1}/{currentUserStories.length}
        </div>
      </UniversalStoryContainer>
    </AnimatePresence>
  );
};
