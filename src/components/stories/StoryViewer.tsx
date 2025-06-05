
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface Story {
  id: string;
  creator_id: string;
  media_url: string | null;
  video_url: string | null;
  content_type: string;
  created_at: string;
  expires_at: string;
  is_active: boolean;
  creator: {
    id: string;
    username: string | null;
    avatar_url: string | null;
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
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const progressInterval = useRef<NodeJS.Timeout>();
  const touchStartX = useRef<number>(0);
  const session = useSession();
  const { toast } = useToast();

  const currentStory = stories[currentIndex];
  const isVideo = currentStory?.content_type === 'video' || !!currentStory?.video_url;
  const mediaUrl = isVideo ? currentStory?.video_url : currentStory?.media_url;
  const isOwner = session?.user?.id === currentStory?.creator_id;
  const duration = isVideo ? 0 : 5000; // 5 seconds for images, auto for videos

  const handleNext = useCallback(() => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setProgress(0);
    } else {
      onClose();
    }
  }, [currentIndex, stories.length, onClose]);

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setProgress(0);
    }
  }, [currentIndex]);

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

      // Move to next story or close if it's the last one
      if (stories.length === 1) {
        onClose();
      } else if (currentIndex === stories.length - 1) {
        handlePrevious();
      } else {
        handleNext();
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

  // Progress bar logic
  useEffect(() => {
    if (!isVideo && !isPaused && !isLoading) {
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
  }, [currentIndex, isPaused, isVideo, isLoading, duration, handleNext]);

  // Touch gesture handling
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrevious();
      }
    }
  };

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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black flex items-center justify-center"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Progress bars */}
        <div className="absolute top-4 left-4 right-4 z-10 flex space-x-1">
          {stories.map((_, index) => (
            <div
              key={index}
              className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden"
            >
              <div
                className="h-full bg-white transition-all duration-100 ease-linear"
                style={{
                  width: index < currentIndex ? '100%' : 
                         index === currentIndex ? `${progress}%` : '0%'
                }}
              />
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="absolute top-8 left-4 right-4 z-10 flex items-center justify-between text-white">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-luxury-neutral/20">
              {currentStory.creator.avatar_url ? (
                <img
                  src={currentStory.creator.avatar_url}
                  alt={currentStory.creator.username || 'User'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs">
                  {(currentStory.creator.username || 'U').slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <p className="text-sm font-medium">{currentStory.creator.username || 'User'}</p>
              <p className="text-xs text-white/60">
                {new Date(currentStory.created_at).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {isOwner && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDelete}
                className="text-white hover:text-red-400 hover:bg-red-400/10"
              >
                <Trash2 className="w-5 h-5" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:text-white/80"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Main content */}
        <div className="relative w-full h-full flex items-center justify-center">
          {mediaUrl ? (
            isVideo ? (
              <video
                src={mediaUrl}
                className="max-w-full max-h-full object-contain"
                autoPlay
                controls={false}
                muted={false}
                onLoadedData={() => setIsLoading(false)}
                onEnded={handleNext}
                onPause={() => setIsPaused(true)}
                onPlay={() => setIsPaused(false)}
              />
            ) : (
              <img
                src={mediaUrl}
                alt="Story content"
                className="max-w-full max-h-full object-contain"
                onLoad={() => setIsLoading(false)}
              />
            )
          ) : (
            <div className="w-full h-full bg-luxury-darker flex items-center justify-center">
              <p className="text-white">Story content unavailable</p>
            </div>
          )}

          {/* Navigation arrows for desktop */}
          <div className="hidden md:flex absolute inset-y-0 left-4 items-center">
            {currentIndex > 0 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePrevious}
                className="text-white/60 hover:text-white hover:bg-black/20"
              >
                <ChevronLeft className="w-8 h-8" />
              </Button>
            )}
          </div>

          <div className="hidden md:flex absolute inset-y-0 right-4 items-center">
            {currentIndex < stories.length - 1 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNext}
                className="text-white/60 hover:text-white hover:bg-black/20"
              >
                <ChevronRight className="w-8 h-8" />
              </Button>
            )}
          </div>

          {/* Touch areas for mobile */}
          <div className="md:hidden absolute inset-0 flex">
            <div className="flex-1" onClick={handlePrevious} />
            <div className="flex-1" onClick={handleNext} />
          </div>
        </div>

        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
