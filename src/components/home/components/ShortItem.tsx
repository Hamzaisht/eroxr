
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, Share2, Bookmark, BookmarkCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Creator {
  id: string;
  username: string;
  avatar_url: string;
}

interface ShortItemProps {
  short: {
    id: string;
    creator: Creator;
    creator_id: string;
    content: string;
    description: string;
    video_urls: string[];
    video_thumbnail_url?: string;
    likes_count: number;
    comments_count: number;
    view_count: number;
    has_liked: boolean;
    has_saved: boolean;
    created_at: string;
    visibility: string;
  };
  isCurrentVideo: boolean;
  index: number;
  currentVideoIndex: number;
}

export const ShortItem = ({ 
  short, 
  isCurrentVideo, 
  index, 
  currentVideoIndex 
}: ShortItemProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(short.has_liked);
  const [isSaved, setIsSaved] = useState(short.has_saved);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const isVisible = isCurrentVideo;
  
  // Control video playback based on visibility
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    if (isVisible) {
      // Play when visible and add a small delay for better performance
      const playPromise = setTimeout(() => {
        try {
          video.play()
            .then(() => setIsPlaying(true))
            .catch(err => {
              console.error("Video play error:", err);
              setError("Could not play video");
              setIsPlaying(false);
            });
        } catch (err) {
          console.error("Error playing video:", err);
          setError("Could not play video");
          setIsPlaying(false);
        }
      }, 100);
      
      // Increment view count when visible
      const incrementView = async () => {
        try {
          await supabase.rpc('increment_counter', { 
            row_id: short.id, 
            counter_name: 'view_count',
            table_name: 'posts'
          });
        } catch (err) {
          console.error("Error incrementing view count:", err);
        }
      };
      
      incrementView();
      
      return () => {
        clearTimeout(playPromise);
        video.pause();
        setIsPlaying(false);
      };
    } else {
      // Pause when not visible
      video.pause();
      setIsPlaying(false);
    }
  }, [isVisible, short.id]);
  
  // Video click handler to toggle play/pause
  const handleVideoClick = () => {
    const video = videoRef.current;
    if (!video) return;
    
    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play()
        .then(() => setIsPlaying(true))
        .catch(err => {
          console.error("Video play error:", err);
          setError("Could not play video");
        });
    }
  };
  
  // Format the created_at date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    // Less than a minute
    if (diffInSeconds < 60) {
      return "Just now";
    }
    
    // Less than an hour
    if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
    }
    
    // Less than a day
    if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
    }
    
    // Less than a month
    if (diffInSeconds < 2592000) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} ${days === 1 ? "day" : "days"} ago`;
    }
    
    // Format as date
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    if (date.getFullYear() !== now.getFullYear()) {
      options.year = 'numeric';
    }
    
    return date.toLocaleDateString(undefined, options);
  };
  
  // Animation variants
  const videoVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } }
  };
  
  const slideInVariants = {
    hidden: { x: 20, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: {
        delay: 0.2,
        duration: 0.5
      }
    }
  };
  
  return (
    <motion.div
      className="h-screen w-full snap-start bg-black flex flex-col items-center relative"
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      variants={videoVariants}
    >
      {/* Main video container */}
      <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
        {/* Video element */}
        <div
          className="w-full h-full flex items-center justify-center cursor-pointer"
          onClick={handleVideoClick}
        >
          <video
            ref={videoRef}
            src={short.video_urls[0]}
            className="w-full h-full object-contain"
            poster={short.video_thumbnail_url}
            playsInline
            loop
            muted={false}
            preload="auto"
            onError={() => setError("Error loading video")}
          />
          
          {/* Error indicator */}
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80">
              <div className="text-white text-center p-4">
                <p className="font-medium">{error}</p>
                <button
                  className="mt-2 px-4 py-1 rounded-full bg-white/20 text-sm text-white"
                  onClick={() => {
                    setError(null);
                    if (videoRef.current) {
                      videoRef.current.load();
                      videoRef.current.play()
                        .then(() => setIsPlaying(true))
                        .catch(() => setError("Could not play video"));
                    }
                  }}
                >
                  Try Again
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Caption/description */}
        <div className="absolute bottom-16 left-4 right-12 bg-gradient-to-t from-black/70 to-transparent p-4 rounded-lg">
          <h3 className="font-medium text-white mb-2">@{short.creator.username}</h3>
          <p className="text-white/90 text-sm line-clamp-2">{short.description || short.content}</p>
          <p className="text-white/60 text-xs mt-1">{formatDate(short.created_at)}</p>
        </div>
        
        {/* Interaction buttons */}
        <AnimatePresence>
          {isVisible && (
            <motion.div
              className="absolute right-4 bottom-32 flex flex-col items-center gap-6"
              variants={slideInVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <button 
                className="flex flex-col items-center"
                onClick={() => setIsLiked(!isLiked)}
              >
                <div className="w-12 h-12 bg-black/30 rounded-full flex items-center justify-center">
                  <Heart 
                    className={`h-6 w-6 ${isLiked ? 'text-red-500 fill-red-500' : 'text-white'}`} 
                  />
                </div>
                <span className="text-white text-xs mt-1">{short.likes_count}</span>
              </button>
              
              <button className="flex flex-col items-center">
                <div className="w-12 h-12 bg-black/30 rounded-full flex items-center justify-center">
                  <MessageCircle className="h-6 w-6 text-white" />
                </div>
                <span className="text-white text-xs mt-1">{short.comments_count}</span>
              </button>
              
              <button className="flex flex-col items-center">
                <div className="w-12 h-12 bg-black/30 rounded-full flex items-center justify-center">
                  <Share2 className="h-6 w-6 text-white" />
                </div>
                <span className="text-white text-xs mt-1">Share</span>
              </button>
              
              <button 
                className="flex flex-col items-center"
                onClick={() => setIsSaved(!isSaved)}
              >
                <div className="w-12 h-12 bg-black/30 rounded-full flex items-center justify-center">
                  {isSaved ? (
                    <BookmarkCheck className="h-6 w-6 text-luxury-primary" />
                  ) : (
                    <Bookmark className="h-6 w-6 text-white" />
                  )}
                </div>
                <span className="text-white text-xs mt-1">Save</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
