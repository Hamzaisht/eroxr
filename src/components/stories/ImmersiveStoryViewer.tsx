
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { X, Heart, Share2, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
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
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [showUI, setShowUI] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  
  const progressInterval = useRef<NodeJS.Timeout>();
  const hideUITimeout = useRef<NodeJS.Timeout>();
  const videoRef = useRef<HTMLVideoElement>(null);
  const session = useSession();
  const { toast } = useToast();

  const currentStory = stories[currentIndex];
  const isVideo = currentStory?.content_type === 'video' || !!currentStory?.video_url;
  const mediaUrl = isVideo ? currentStory?.video_url : currentStory?.media_url;
  const isOwner = session?.user?.id === currentStory?.creator_id;
  const duration = isVideo ? 15000 : 5000; // 15s for video, 5s for image

  const isValidMediaUrl = useCallback((url: string | null): boolean => {
    if (!url) return false;
    if (url.includes('undefined')) return false;
    if (url.includes('stories/stories/')) return false;
    return url.startsWith('http');
  }, []);

  const handleNext = useCallback(() => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setProgress(0);
      setIsLoading(true);
      setHasError(false);
    } else {
      onClose();
    }
  }, [currentIndex, stories.length, onClose]);

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setProgress(0);
      setIsLoading(true);
      setHasError(false);
    }
  }, [currentIndex]);

  const togglePause = useCallback(() => {
    setIsPaused(prev => !prev);
    if (videoRef.current) {
      if (isPaused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPaused]);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
  }, [isMuted]);

  // Auto-hide UI
  const handleUserInteraction = useCallback(() => {
    setShowUI(true);
    if (hideUITimeout.current) {
      clearTimeout(hideUITimeout.current);
    }
    hideUITimeout.current = setTimeout(() => {
      setShowUI(false);
    }, 3000);
  }, []);

  // Progress logic
  useEffect(() => {
    if (!isPaused && !isLoading && !hasError) {
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
  }, [currentIndex, isPaused, isLoading, hasError, duration, handleNext]);

  // Reset states when story changes
  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
    setProgress(0);
  }, [currentIndex]);

  // Touch/swipe handling
  const handlePanEnd = useCallback((event: any, info: PanInfo) => {
    const threshold = 50;
    if (Math.abs(info.offset.x) > threshold) {
      if (info.offset.x > 0) {
        handlePrevious();
      } else {
        handleNext();
      }
    }
  }, [handleNext, handlePrevious]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      handleUserInteraction();
      switch (e.key) {
        case 'ArrowLeft':
          handlePrevious();
          break;
        case 'ArrowRight':
        case ' ':
          e.preventDefault();
          if (e.key === ' ') {
            togglePause();
          } else {
            handleNext();
          }
          break;
        case 'Escape':
          onClose();
          break;
        case 'm':
        case 'M':
          toggleMute();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrevious, onClose, handleUserInteraction, togglePause, toggleMute]);

  // Auto-show UI on mount
  useEffect(() => {
    handleUserInteraction();
    return () => {
      if (hideUITimeout.current) {
        clearTimeout(hideUITimeout.current);
      }
    };
  }, [handleUserInteraction]);

  if (!currentStory) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="fixed top-0 left-0 w-screen h-screen z-[9999] bg-black"
        onClick={handleUserInteraction}
        onPanEnd={handlePanEnd}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
      >
        {/* True 9:16 Story Container */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-full h-full max-w-[calc(100vh*9/16)] aspect-[9/16] bg-black overflow-hidden">
            
            {/* Progress Bars - Snapchat Style */}
            <AnimatePresence>
              {showUI && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="absolute top-4 left-4 right-4 z-50 flex gap-1"
                >
                  {stories.map((_, index) => (
                    <div
                      key={index}
                      className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden"
                    >
                      <motion.div
                        className="h-full bg-white rounded-full"
                        initial={{ scaleX: 0 }}
                        animate={{
                          scaleX: index < currentIndex ? 1 : 
                                 index === currentIndex ? progress / 100 : 0
                        }}
                        transition={{ duration: 0.1, ease: "linear" }}
                        style={{ transformOrigin: "left" }}
                      />
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Story Header */}
            <AnimatePresence>
              {showUI && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="absolute top-12 left-4 right-4 z-50 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-white/50">
                      {currentStory.creator.avatar_url ? (
                        <img
                          src={currentStory.creator.avatar_url}
                          alt={currentStory.creator.username || 'User'}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                          {(currentStory.creator.username || 'U').slice(0, 2).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">{currentStory.creator.username || 'User'}</p>
                      <p className="text-white/70 text-xs">
                        {new Date(currentStory.created_at).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {isVideo && (
                      <>
                        <button
                          onClick={toggleMute}
                          className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white"
                        >
                          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={togglePause}
                          className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white"
                        >
                          {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                        </button>
                      </>
                    )}
                    <button
                      onClick={onClose}
                      className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Story Content */}
            <div className="absolute inset-0">
              {!isValidMediaUrl(mediaUrl) || hasError ? (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
                  <div className="text-center text-white">
                    <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                      <X className="w-8 h-8 text-red-400" />
                    </div>
                    <p className="text-lg">Story unavailable</p>
                    <p className="text-sm text-white/60">This content cannot be displayed</p>
                  </div>
                </div>
              ) : isVideo ? (
                <video
                  ref={videoRef}
                  src={mediaUrl}
                  className="w-full h-full object-cover"
                  autoPlay
                  muted={isMuted}
                  playsInline
                  onLoadedData={() => {
                    setIsLoading(false);
                    setHasError(false);
                  }}
                  onError={() => {
                    setIsLoading(false);
                    setHasError(true);
                  }}
                  onEnded={handleNext}
                  onPause={() => setIsPaused(true)}
                  onPlay={() => setIsPaused(false)}
                />
              ) : (
                <div className="w-full h-full relative">
                  <img
                    src={mediaUrl}
                    alt="Story content"
                    className="w-full h-full object-cover"
                    onLoad={() => {
                      setIsLoading(false);
                      setHasError(false);
                    }}
                    onError={() => {
                      setIsLoading(false);
                      setHasError(true);
                    }}
                  />
                </div>
              )}
            </div>

            {/* Floating Action Buttons */}
            <AnimatePresence>
              {showUI && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="absolute right-4 bottom-20 z-50 flex flex-col space-y-3"
                >
                  <button className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white">
                    <Heart className="w-5 h-5" />
                  </button>
                  <button className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white">
                    <Share2 className="w-5 h-5" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Touch Areas for Navigation */}
            <div className="absolute inset-0 flex z-40">
              <div 
                className="flex-1 cursor-pointer" 
                onClick={handlePrevious}
                onTouchStart={() => setIsPaused(true)}
                onTouchEnd={() => setIsPaused(false)}
              />
              <div 
                className="flex-1 cursor-pointer"
                onClick={handleNext}
                onTouchStart={() => setIsPaused(true)}
                onTouchEnd={() => setIsPaused(false)}
              />
            </div>

            {/* Loading Overlay */}
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-60">
                <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
