
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Trash2, Edit, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Story } from "@/components/story/types";

interface ImmersiveStoryViewerProps {
  stories: Story[];
  initialStoryIndex?: number;
  onClose: () => void;
}

export const ImmersiveStoryViewer = ({
  stories,
  initialStoryIndex = 0,
  onClose
}: ImmersiveStoryViewerProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialStoryIndex);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const progressInterval = useRef<NodeJS.Timeout>();
  const videoRef = useRef<HTMLVideoElement>(null);
  const session = useSession();
  const { toast } = useToast();

  const currentStory = stories[currentIndex];
  const isVideo = currentStory?.content_type === 'video' || !!currentStory?.video_url;
  const mediaUrl = isVideo ? currentStory?.video_url : currentStory?.media_url;
  const isOwner = session?.user?.id === currentStory?.creator_id;
  const duration = isVideo ? 0 : (currentStory?.duration || 5) * 1000;

  const handleNext = useCallback(() => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setProgress(0);
      setIsLoading(true);
    } else {
      onClose();
    }
  }, [currentIndex, stories.length, onClose]);

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setProgress(0);
      setIsLoading(true);
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

      // Trigger refresh and close viewer
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

  // Progress bar logic for images
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

  // Reset states when story changes
  useEffect(() => {
    setIsLoading(true);
    setProgress(0);
  }, [currentIndex]);

  // Video event handlers
  const handleVideoLoad = () => {
    setIsLoading(false);
  };

  const handleVideoEnd = () => {
    handleNext();
  };

  const togglePlayPause = () => {
    if (isVideo && videoRef.current) {
      if (isPaused) {
        videoRef.current.play();
        setIsPaused(false);
      } else {
        videoRef.current.pause();
        setIsPaused(true);
      }
    } else {
      setIsPaused(!isPaused);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Calculate time remaining for display
  const getTimeRemaining = () => {
    if (isVideo) return "Video";
    const remaining = Math.ceil((duration - (progress / 100) * duration) / 1000);
    return `${remaining}s`;
  };

  if (!currentStory) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
      >
        {/* Progress bars */}
        <div className="absolute top-4 left-4 right-4 z-50 flex space-x-1">
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
        <div className="absolute top-8 left-4 right-4 z-50 flex items-center justify-between text-white">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-white/20">
              {currentStory.creator.avatar_url ? (
                <img
                  src={currentStory.creator.avatar_url}
                  alt={currentStory.creator.username || 'User'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sm font-bold">
                  {(currentStory.creator.username || 'U').slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <p className="text-sm font-medium">{currentStory.creator.username || 'User'}</p>
              <p className="text-xs text-white/60">
                {getTimeRemaining()} • {new Date(currentStory.created_at).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {isOwner && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleDelete}
                  className="text-white hover:text-red-400 hover:bg-red-400/10"
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
              </>
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
          {isVideo ? (
            <video
              ref={videoRef}
              src={mediaUrl || undefined}
              className="max-w-full max-h-full object-contain"
              autoPlay={!isPaused}
              muted={isMuted}
              onLoadedData={handleVideoLoad}
              onEnded={handleVideoEnd}
              onPause={() => setIsPaused(true)}
              onPlay={() => setIsPaused(false)}
            />
          ) : (
            <img
              src={mediaUrl || undefined}
              alt="Story content"
              className="max-w-full max-h-full object-contain"
              onLoad={() => setIsLoading(false)}
            />
          )}

          {/* Control overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={togglePlayPause}
                className="text-white bg-black/50 hover:bg-black/70"
              >
                {isPaused ? <Play className="w-6 h-6" /> : <Pause className="w-6 h-6" />}
              </Button>
              {isVideo && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleMute}
                  className="text-white bg-black/50 hover:bg-black/70"
                >
                  {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                </Button>
              )}
            </div>
          </div>

          {/* Navigation arrows */}
          <div className="absolute inset-y-0 left-4 flex items-center">
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

          <div className="absolute inset-y-0 right-4 flex items-center">
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
          <div className="absolute inset-0 flex md:hidden">
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
