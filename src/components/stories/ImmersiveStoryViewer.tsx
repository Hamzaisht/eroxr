
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Trash2, AlertCircle, RefreshCw, Eye, Heart, Share2 } from "lucide-react";
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
  
  const progressInterval = useRef<NodeJS.Timeout>();
  const hideUITimeout = useRef<NodeJS.Timeout>();
  const session = useSession();
  const { toast } = useToast();

  const currentStory = stories[currentIndex];
  const isVideo = currentStory?.content_type === 'video' || !!currentStory?.video_url;
  const mediaUrl = isVideo ? currentStory?.video_url : currentStory?.media_url;
  const isOwner = session?.user?.id === currentStory?.creator_id;
  const duration = isVideo ? 0 : 5000;

  const isValidMediaUrl = useCallback((url: string | null): boolean => {
    if (!url) return false;
    if (url.includes('undefined')) return false;
    if (url.includes('stories/stories/')) return false;
    return url.startsWith('http');
  }, []);

  const handleMediaLoad = useCallback(() => {
    setIsLoading(false);
    setHasError(false);
  }, []);

  const handleMediaError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
    console.error('Failed to load story media:', mediaUrl);
  }, [mediaUrl]);

  const retryLoadMedia = useCallback(() => {
    setIsLoading(true);
    setHasError(false);
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

  // Auto-hide UI after 3 seconds
  const handleUserInteraction = useCallback(() => {
    setShowUI(true);
    if (hideUITimeout.current) {
      clearTimeout(hideUITimeout.current);
    }
    hideUITimeout.current = setTimeout(() => {
      setShowUI(false);
    }, 3000);
  }, []);

  // Progress bar logic
  useEffect(() => {
    if (!isVideo && !isPaused && !isLoading && !hasError) {
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
  }, [currentIndex, isPaused, isVideo, isLoading, hasError, duration, handleNext]);

  // Reset states when story changes
  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
    setProgress(0);
  }, [currentIndex]);

  // Auto-hide UI
  useEffect(() => {
    handleUserInteraction();
    return () => {
      if (hideUITimeout.current) {
        clearTimeout(hideUITimeout.current);
      }
    };
  }, [handleUserInteraction]);

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
          handleNext();
          break;
        case 'Escape':
          onClose();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrevious, onClose, handleUserInteraction]);

  if (!currentStory) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="fixed inset-0 z-[100] overflow-hidden"
        onClick={handleUserInteraction}
        style={{
          background: `
            radial-gradient(circle at 20% 30%, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(245, 158, 11, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(239, 68, 68, 0.08) 0%, transparent 70%),
            linear-gradient(135deg, #000000 0%, #0a0a0a 100%)
          `
        }}
      >
        {/* Animated Background Mesh */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 story-mesh-bg" style={{
            backgroundImage: `
              linear-gradient(rgba(139, 92, 246, 0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(139, 92, 246, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }} />
          {/* Floating Particles */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-luxury-primary rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [-20, 20, -20],
                x: [-10, 10, -10],
                opacity: [0.2, 0.8, 0.2],
                scale: [0.5, 1.2, 0.5],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* Holographic Progress Ring */}
        <AnimatePresence>
          {showUI && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute top-6 left-1/2 transform -translate-x-1/2 z-50"
            >
              <div className="flex space-x-2">
                {stories.map((_, index) => (
                  <motion.div
                    key={index}
                    className="relative w-20 h-1 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm"
                    style={{
                      boxShadow: '0 0 10px rgba(139, 92, 246, 0.3)',
                    }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-luxury-primary via-luxury-accent to-luxury-secondary rounded-full"
                      style={{
                        width: index < currentIndex ? '100%' : 
                               index === currentIndex ? `${progress}%` : '0%'
                      }}
                      animate={{
                        boxShadow: index === currentIndex 
                          ? ['0 0 5px rgba(139, 92, 246, 0.5)', '0 0 15px rgba(139, 92, 246, 0.8)', '0 0 5px rgba(139, 92, 246, 0.5)']
                          : '0 0 5px rgba(139, 92, 246, 0.3)'
                      }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Creator Header */}
        <AnimatePresence>
          {showUI && (
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="absolute top-20 left-6 z-50"
              style={{
                background: 'rgba(0, 0, 0, 0.6)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                borderRadius: '20px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              }}
            >
              <div className="flex items-center space-x-3 p-4">
                <motion.div
                  className="relative"
                  whileHover={{ scale: 1.1 }}
                  animate={{
                    boxShadow: ['0 0 10px rgba(139, 92, 246, 0.5)', '0 0 20px rgba(139, 92, 246, 0.8)', '0 0 10px rgba(139, 92, 246, 0.5)']
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-luxury-primary/50">
                    {currentStory.creator.avatar_url ? (
                      <img
                        src={currentStory.creator.avatar_url}
                        alt={currentStory.creator.username || 'User'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-luxury-primary to-luxury-accent flex items-center justify-center text-white font-bold">
                        {(currentStory.creator.username || 'U').slice(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>
                </motion.div>
                <div>
                  <p className="text-white font-medium text-sm">{currentStory.creator.username || 'User'}</p>
                  <p className="text-luxury-primary text-xs">
                    {new Date(currentStory.created_at).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Action Controls */}
        <AnimatePresence>
          {showUI && (
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              className="absolute top-20 right-6 z-50 flex flex-col space-y-3"
            >
              <motion.button
                onClick={onClose}
                className="w-12 h-12 rounded-full bg-black/60 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:border-luxury-primary/50 transition-all"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                style={{
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                }}
              >
                <X className="w-5 h-5" />
              </motion.button>

              {isOwner && (
                <motion.button
                  onClick={handleDelete}
                  className="w-12 h-12 rounded-full bg-red-500/20 backdrop-blur-xl border border-red-500/30 flex items-center justify-center text-red-400 hover:border-red-400/50 transition-all"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  style={{
                    boxShadow: '0 8px 32px rgba(239, 68, 68, 0.2)',
                  }}
                >
                  <Trash2 className="w-5 h-5" />
                </motion.button>
              )}

              <motion.button
                className="w-12 h-12 rounded-full bg-luxury-primary/20 backdrop-blur-xl border border-luxury-primary/30 flex items-center justify-center text-luxury-primary hover:border-luxury-primary/50 transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                style={{
                  boxShadow: '0 8px 32px rgba(139, 92, 246, 0.2)',
                }}
              >
                <Heart className="w-5 h-5" />
              </motion.button>

              <motion.button
                className="w-12 h-12 rounded-full bg-luxury-accent/20 backdrop-blur-xl border border-luxury-accent/30 flex items-center justify-center text-luxury-accent hover:border-luxury-accent/50 transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                style={{
                  boxShadow: '0 8px 32px rgba(245, 158, 11, 0.2)',
                }}
              >
                <Share2 className="w-5 h-5" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Immersive Content */}
        <div className="absolute inset-0 flex items-center justify-center">
          {!isValidMediaUrl(mediaUrl) || hasError ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center space-y-6"
              style={{
                background: 'rgba(0, 0, 0, 0.8)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '24px',
                padding: '2rem',
                boxShadow: '0 8px 32px rgba(239, 68, 68, 0.2)',
              }}
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <AlertCircle className="w-16 h-16 text-red-400" />
              </motion.div>
              <p className="text-white text-center text-lg">Content Unavailable</p>
              <p className="text-white/60 text-center text-sm">This story may have been corrupted or removed</p>
              <Button 
                onClick={retryLoadMedia} 
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key={currentStory.id}
              initial={{ opacity: 0, scale: 0.95, rotateY: 10 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0, scale: 0.95, rotateY: -10 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative w-full h-full max-w-lg mx-auto"
              style={{
                filter: 'drop-shadow(0 0 30px rgba(139, 92, 246, 0.3))',
              }}
            >
              <div 
                className="relative w-full h-full rounded-3xl overflow-hidden story-border-glow"
                style={{
                  background: 'rgba(0, 0, 0, 0.2)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: `
                    0 0 50px rgba(139, 92, 246, 0.3),
                    inset 0 0 50px rgba(139, 92, 246, 0.1)
                  `,
                }}
              >
                <div className="absolute inset-[2px] rounded-3xl overflow-hidden bg-black">
                  {isVideo ? (
                    <video
                      src={mediaUrl}
                      className="w-full h-full object-cover"
                      autoPlay
                      controls={false}
                      onLoadedData={handleMediaLoad}
                      onError={handleMediaError}
                      onEnded={handleNext}
                      onPause={() => setIsPaused(true)}
                      onPlay={() => setIsPaused(false)}
                      muted={false}
                      playsInline
                    />
                  ) : (
                    <img
                      src={mediaUrl}
                      alt="Story content"
                      className="w-full h-full object-cover"
                      onLoad={handleMediaLoad}
                      onError={handleMediaError}
                    />
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Invisible Touch/Click Areas */}
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

        {/* Floating Navigation Orbs */}
        <AnimatePresence>
          {showUI && (
            <>
              {currentIndex > 0 && (
                <motion.button
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  onClick={handlePrevious}
                  className="absolute left-6 top-1/2 transform -translate-y-1/2 z-50 w-16 h-16 rounded-full bg-black/40 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:border-luxury-primary/50 transition-all"
                  whileHover={{ 
                    scale: 1.1,
                    boxShadow: '0 0 30px rgba(139, 92, 246, 0.5)'
                  }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ChevronLeft className="w-8 h-8" />
                </motion.button>
              )}

              {currentIndex < stories.length - 1 && (
                <motion.button
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  onClick={handleNext}
                  className="absolute right-6 top-1/2 transform -translate-y-1/2 z-50 w-16 h-16 rounded-full bg-black/40 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:border-luxury-primary/50 transition-all"
                  whileHover={{ 
                    scale: 1.1,
                    boxShadow: '0 0 30px rgba(139, 92, 246, 0.5)'
                  }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ChevronRight className="w-8 h-8" />
                </motion.button>
              )}
            </>
          )}
        </AnimatePresence>

        {/* Loading Orbital */}
        {isLoading && !hasError && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 flex items-center justify-center z-60 bg-black/50 backdrop-blur-sm"
          >
            <div className="relative">
              <motion.div
                className="w-20 h-20 border-4 border-luxury-primary/30 border-t-luxury-primary rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute inset-2 w-16 h-16 border-4 border-luxury-accent/30 border-b-luxury-accent rounded-full"
                animate={{ rotate: -360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Eye className="w-6 h-6 text-luxury-primary" />
              </div>
            </div>
          </motion.div>
        )}

        {/* Energy Scanlines */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <motion.div
            className="absolute inset-0"
            style={{
              background: `repeating-linear-gradient(
                0deg,
                transparent,
                transparent 2px,
                rgba(139, 92, 246, 0.1) 2px,
                rgba(139, 92, 246, 0.1) 4px
              )`
            }}
            animate={{ y: ['0%', '100%', '0%'] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
