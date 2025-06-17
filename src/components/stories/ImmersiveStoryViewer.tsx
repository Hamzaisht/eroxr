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
  const [currentBlock, setCurrentBlock] = useState(0);
  
  const progressInterval = useRef<NodeJS.Timeout>();
  const videoRef = useRef<HTMLVideoElement>(null);
  const session = useSession();
  const { toast } = useToast();

  const currentStory = stories[currentIndex];
  const isVideo = currentStory?.content_type === 'video' || !!currentStory?.video_url;
  const mediaUrl = isVideo ? currentStory?.video_url : currentStory?.media_url;
  const isOwner = session?.user?.id === currentStory?.creator_id;
  
  // Calculate story blocks and duration (Snapchat-like system)
  const getStoryDuration = useCallback(() => {
    if (isVideo && videoRef.current?.duration) {
      return Math.ceil(videoRef.current.duration * 1000); // Convert to milliseconds
    }
    // Use database duration or default to 10 seconds
    return (currentStory?.duration || 10) * 1000;
  }, [currentStory, isVideo]);

  const getStoryBlocks = useCallback(() => {
    const duration = getStoryDuration();
    if (isVideo) {
      // For videos, create 30-second blocks
      return Math.ceil(duration / 30000);
    }
    // For images, use single block based on selected duration
    return 1;
  }, [getStoryDuration, isVideo]);

  const totalBlocks = getStoryBlocks();
  const blockDuration = isVideo ? 30000 : getStoryDuration(); // 30s for video blocks, full duration for images

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
    if (currentBlock < totalBlocks - 1) {
      // Move to next block of same story
      setCurrentBlock(prev => prev + 1);
      setProgress(0);
    } else if (currentIndex < stories.length - 1) {
      // Move to next story
      setCurrentIndex(prev => prev + 1);
      setCurrentBlock(0);
      setProgress(0);
      setIsLoading(true);
    } else {
      onClose();
    }
  }, [currentIndex, currentBlock, totalBlocks, stories.length, onClose]);

  const handlePrevious = useCallback(() => {
    if (currentBlock > 0) {
      // Move to previous block of same story
      setCurrentBlock(prev => prev - 1);
      setProgress(0);
    } else if (currentIndex > 0) {
      // Move to previous story
      const prevStoryIndex = currentIndex - 1;
      const prevStory = stories[prevStoryIndex];
      const prevIsVideo = prevStory?.content_type === 'video' || !!prevStory?.video_url;
      const prevTotalBlocks = prevIsVideo ? Math.ceil((prevStory?.duration || 30) / 30) : 1;
      
      setCurrentIndex(prevStoryIndex);
      setCurrentBlock(prevTotalBlocks - 1); // Start at last block of previous story
      setProgress(0);
      setIsLoading(true);
    }
  }, [currentIndex, currentBlock, stories]);

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

  // Progress bar logic for images and video blocks
  useEffect(() => {
    if (!isPaused && !isLoading) {
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
  }, [currentIndex, currentBlock, isPaused, isLoading, blockDuration, handleNext]);

  // Reset states when story changes
  useEffect(() => {
    setIsLoading(true);
    setProgress(0);
    setCurrentBlock(0);
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
        className="fixed inset-0 z-[200] bg-black flex items-center justify-center"
      >
        {/* Progress bars - Enhanced for blocks */}
        <div className="absolute top-2 left-4 right-4 z-[250] flex space-x-1">
          {Array.from({ length: totalBlocks }, (_, blockIndex) => (
            <div
              key={`${currentIndex}-${blockIndex}`}
              className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden"
            >
              <div
                className="h-full bg-white transition-all duration-100 ease-linear"
                style={{
                  width: blockIndex < currentBlock ? '100%' : 
                         blockIndex === currentBlock ? `${progress}%` : '0%'
                }}
              />
            </div>
          ))}
        </div>

        {/* Header - Repositioned to avoid search bar overlap */}
        <div className="absolute top-16 left-4 right-4 z-[250] flex items-center justify-between text-white">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-black/60 backdrop-blur-sm border-2 border-white/40">
              {currentStory.creator.avatar_url ? (
                <img
                  src={currentStory.creator.avatar_url}
                  alt={currentStory.creator.username || 'User'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sm font-bold text-white">
                  {(currentStory.creator.username || 'U').slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <p className="text-sm font-bold text-white drop-shadow-lg">{currentStory.creator.username || 'User'}</p>
              <p className="text-xs text-white/80 drop-shadow-md">
                {new Date(currentStory.created_at).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>
            </div>
          </div>

          {/* Action buttons - Better positioning and visibility */}
          <div className="flex items-center space-x-3">
            {/* Add Story Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleAddStory}
              className="w-14 h-14 text-white hover:text-amber-300 hover:bg-amber-300/20 bg-black/70 backdrop-blur-sm border-2 border-white/60 shadow-2xl hover:shadow-amber-300/25 transition-all duration-200 hover:scale-105"
            >
              <Plus className="w-7 h-7 stroke-2" />
            </Button>

            {/* Owner Controls */}
            {isOwner && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDelete}
                className="w-14 h-14 text-white hover:text-red-300 hover:bg-red-500/20 bg-black/70 backdrop-blur-sm border-2 border-white/60 shadow-2xl hover:shadow-red-500/25 transition-all duration-200 hover:scale-105"
              >
                <Trash2 className="w-7 h-7 stroke-2" />
              </Button>
            )}

            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="w-14 h-14 text-white hover:text-white/90 hover:bg-white/20 bg-black/70 backdrop-blur-sm border-2 border-white/60 shadow-2xl transition-all duration-200 hover:scale-105"
            >
              <X className="w-7 h-7 stroke-2" />
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
            {(currentIndex > 0 || currentBlock > 0) && (
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
            {(currentIndex < stories.length - 1 || currentBlock < totalBlocks - 1) && (
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

        {/* Stats Panel - Repositioned for better access */}
        <div className="absolute bottom-32 right-6 z-[240] flex flex-col items-center space-y-6">
          <div className="flex flex-col items-center">
            <Button
              variant="ghost"
              size="icon"
              className="w-14 h-14 rounded-full bg-black/60 backdrop-blur-sm text-white hover:bg-white/20 border-2 border-white/40 shadow-xl"
            >
              <Eye className="w-6 h-6" />
            </Button>
            <span className="text-white text-sm mt-2 font-bold bg-black/40 px-3 py-1 rounded-full border border-white/30">
              {storyStats.views}
            </span>
          </div>

          <div className="flex flex-col items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleShare}
              className="w-14 h-14 rounded-full bg-black/60 backdrop-blur-sm text-white hover:bg-white/20 border-2 border-white/40 shadow-xl"
            >
              <Share2 className="w-6 h-6" />
            </Button>
            <span className="text-white text-sm mt-2 font-bold bg-black/40 px-3 py-1 rounded-full border border-white/30">
              {storyStats.shares}
            </span>
          </div>

          <div className="flex flex-col items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleScreenshot}
              className="w-14 h-14 rounded-full bg-black/60 backdrop-blur-sm text-white hover:bg-white/20 border-2 border-white/40 shadow-xl"
            >
              <Download className="w-6 h-6" />
            </Button>
            <span className="text-white text-sm mt-2 font-bold bg-black/40 px-3 py-1 rounded-full border border-white/30">
              {storyStats.screenshots}
            </span>
          </div>
        </div>

        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-[230]">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Duration indicator */}
        {!isLoading && (
          <div className="absolute bottom-6 left-6 z-[240] text-white text-sm bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full border-2 border-white/40 shadow-xl">
            {isVideo ? 
              `Block ${currentBlock + 1}/${totalBlocks}` : 
              `${(currentStory?.duration || 10)}s`
            }
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
