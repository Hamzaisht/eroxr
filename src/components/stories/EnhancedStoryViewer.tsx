
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

// Group stories by user
const groupStoriesByUser = (stories: Story[]) => {
  const grouped = stories.reduce((acc, story) => {
    const userId = story.creator_id;
    if (!acc[userId]) {
      acc[userId] = [];
    }
    acc[userId].push(story);
    return acc;
  }, {} as Record<string, Story[]>);

  // Sort stories within each user group by creation date (newest first)
  Object.keys(grouped).forEach(userId => {
    grouped[userId].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  });

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
  const currentUserStories = groupedStories[userIds[currentUserIndex]] || [];
  const initialStoryInUserGroup = currentUserStories.findIndex(story => story.id === initialStory?.id);
  
  const [currentUserStoryIndex, setCurrentUserStoryIndex] = useState(currentUserIndex);
  const [currentStoryInGroup, setCurrentStoryInGroup] = useState(initialStoryInUserGroup >= 0 ? initialStoryInUserGroup : 0);
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
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
      // Move to next block within current story
      setCurrentBlockIndex(prev => prev + 1);
      setProgress(0);
    } else if (currentStoryInGroup < currentUserStories.length - 1) {
      // Move to next story within current user's stories
      setCurrentStoryInGroup(prev => prev + 1);
      setCurrentBlockIndex(0);
      setProgress(0);
    } else if (currentUserStoryIndex < userIds.length - 1) {
      // Move to next user's stories
      setCurrentUserStoryIndex(prev => prev + 1);
      setCurrentStoryInGroup(0);
      setCurrentBlockIndex(0);
      setProgress(0);
    } else {
      // No more stories, close viewer
      onClose();
    }
  }, [currentBlockIndex, totalBlocks, currentStoryInGroup, currentUserStories.length, currentUserStoryIndex, userIds.length, onClose]);

  const handlePrevious = useCallback(() => {
    if (currentBlockIndex > 0) {
      // Move to previous block within current story
      setCurrentBlockIndex(prev => prev - 1);
      setProgress(0);
    } else if (currentStoryInGroup > 0) {
      // Move to previous story within current user's stories
      const prevStoryIndex = currentStoryInGroup - 1;
      const prevStory = currentUserStories[prevStoryIndex];
      const prevIsVideo = prevStory?.content_type === 'video' || !!prevStory?.video_url;
      const prevTotalBlocks = prevIsVideo ? Math.max(1, Math.ceil((prevStory?.duration || 30) / 30)) : 1;
      
      setCurrentStoryInGroup(prevStoryIndex);
      setCurrentBlockIndex(prevTotalBlocks - 1);
      setProgress(0);
    } else if (currentUserStoryIndex > 0) {
      // Move to previous user's stories (go to their last story)
      const prevUserIndex = currentUserStoryIndex - 1;
      const prevUserStories = groupedStories[userIds[prevUserIndex]] || [];
      const lastStoryIndex = prevUserStories.length - 1;
      const lastStory = prevUserStories[lastStoryIndex];
      const lastIsVideo = lastStory?.content_type === 'video' || !!lastStory?.video_url;
      const lastTotalBlocks = lastIsVideo ? Math.max(1, Math.ceil((lastStory?.duration || 30) / 30)) : 1;
      
      setCurrentUserStoryIndex(prevUserIndex);
      setCurrentStoryInGroup(lastStoryIndex);
      setCurrentBlockIndex(lastTotalBlocks - 1);
      setProgress(0);
    }
  }, [currentBlockIndex, currentStoryInGroup, currentUserStories, currentUserStoryIndex, userIds, groupedStories]);

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
  }, [currentUserStoryIndex, currentStoryInGroup, currentBlockIndex, isPaused, isVideo, blockDuration, handleNext]);

  // Reset states when story changes
  useEffect(() => {
    setProgress(0);
    setCurrentBlockIndex(0);
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

        {/* User stories indicator */}
        <div className="absolute bottom-6 right-6 z-40 text-white text-xs bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full border border-white/40">
          {currentStoryInGroup + 1}/{currentUserStories.length}
        </div>
      </UniversalStoryContainer>
    </AnimatePresence>
  );
};
