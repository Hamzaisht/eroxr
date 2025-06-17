
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Trash2, Plus, Eye, Share2, Download } from "lucide-react";
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
  const [storyStats, setStoryStats] = useState({ views: 0, shares: 0, screenshots: 0 });
  
  const progressInterval = useRef<NodeJS.Timeout>();
  const videoRef = useRef<HTMLVideoElement>(null);
  const session = useSession();
  const { toast } = useToast();

  const currentStory = stories[currentIndex];
  const isVideo = currentStory?.content_type === 'video' || !!currentStory?.video_url;
  const mediaUrl = isVideo ? currentStory?.video_url : currentStory?.media_url;
  const isOwner = session?.user?.id === currentStory?.creator_id;
  const duration = isVideo ? 0 : (currentStory?.duration || 5) * 1000;

  // Fetch story stats
  const fetchStoryStats = useCallback(async () => {
    if (!currentStory?.id) return;

    try {
      const { data } = await supabase
        .from('post_media_actions')
        .select('action_type')
        .eq('post_id', currentStory.id);

      if (data) {
        setStoryStats({
          views: data.filter(d => d.action_type === 'view').length,
          shares: data.filter(d => d.action_type === 'share').length,
          screenshots: data.filter(d => d.action_type === 'screenshot').length
        });
      }
    } catch (error) {
      console.error('Error fetching story stats:', error);
    }
  }, [currentStory?.id]);

  // Register view when story loads
  useEffect(() => {
    if (currentStory?.id && session?.user?.id) {
      const registerView = async () => {
        try {
          await supabase
            .from('post_media_actions')
            .insert({
              post_id: currentStory.id,
              user_id: session.user.id,
              action_type: 'view'
            });
          fetchStoryStats();
        } catch (error) {
          console.error('Error registering view:', error);
        }
      };
      registerView();
    }
  }, [currentStory?.id, session?.user?.id, fetchStoryStats]);

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
    // Trigger story upload modal
    window.dispatchEvent(new CustomEvent('open-story-upload'));
  };

  const handleShare = async () => {
    try {
      if (navigator.share && mediaUrl) {
        await navigator.share({
          title: `Story by ${currentStory.creator.username}`,
          url: mediaUrl,
        });
      } else if (mediaUrl) {
        await navigator.clipboard.writeText(mediaUrl);
        toast({
          title: "Link copied",
          description: "Story link copied to clipboard",
        });
      }

      // Register share action
      if (currentStory?.id && session?.user?.id) {
        await supabase
          .from('post_media_actions')
          .insert({
            post_id: currentStory.id,
            user_id: session.user.id,
            action_type: 'share'
          });
        fetchStoryStats();
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleScreenshot = async () => {
    // Register screenshot action
    if (currentStory?.id && session?.user?.id) {
      try {
        await supabase
          .from('post_media_actions')
          .insert({
            post_id: currentStory.id,
            user_id: session.user.id,
            action_type: 'screenshot'
          });
        fetchStoryStats();
      } catch (error) {
        console.error('Error registering screenshot:', error);
      }
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
    fetchStoryStats();
  }, [currentIndex, fetchStoryStats]);

  // Video event handlers
  const handleVideoLoad = () => {
    setIsLoading(false);
  };

  const handleVideoEnd = () => {
    handleNext();
  };

  // Listen for screenshot events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'S') {
        e.preventDefault();
        handleScreenshot();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

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
                {new Date(currentStory.created_at).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Add Story Button - always visible */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleAddStory}
              className="text-white hover:text-amber-300 hover:bg-white/10"
            >
              <Plus className="w-5 h-5" />
            </Button>

            {/* Owner Controls */}
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

            {/* Close Button */}
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

        {/* Snapchat-like Stats Panel */}
        <div className="absolute bottom-20 right-4 z-50 flex flex-col items-center space-y-4">
          {/* Views */}
          <div className="flex flex-col items-center">
            <Button
              variant="ghost"
              size="icon"
              className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-white/20"
            >
              <Eye className="w-6 h-6" />
            </Button>
            <span className="text-white text-xs mt-1 font-medium">{storyStats.views}</span>
          </div>

          {/* Shares */}
          <div className="flex flex-col items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleShare}
              className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-white/20"
            >
              <Share2 className="w-6 h-6" />
            </Button>
            <span className="text-white text-xs mt-1 font-medium">{storyStats.shares}</span>
          </div>

          {/* Screenshots */}
          <div className="flex flex-col items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleScreenshot}
              className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-white/20"
            >
              <Download className="w-6 h-6" />
            </Button>
            <span className="text-white text-xs mt-1 font-medium">{storyStats.screenshots}</span>
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
