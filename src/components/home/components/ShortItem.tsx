
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, Share2, Bookmark, BookmarkCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SimpleMediaDisplay } from "@/components/media/SimpleMediaDisplay";

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
  const [isLiked, setIsLiked] = useState(short.has_liked);
  const [isSaved, setIsSaved] = useState(short.has_saved);
  
  const isVisible = isCurrentVideo;

  useEffect(() => {
    if (isVisible) {
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
    }
  }, [isVisible, short.id]);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
    }
    if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
    }
    if (diffInSeconds < 2592000) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} ${days === 1 ? "day" : "days"} ago`;
    }
    
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    if (date.getFullYear() !== now.getFullYear()) {
      options.year = 'numeric';
    }
    
    return date.toLocaleDateString(undefined, options);
  };
  
  const videoVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } }
  };
  
  const slideInVariants = {
    hidden: { x: 20, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { delay: 0.2, duration: 0.5 }
    }
  };
  
  return (
    <motion.div
      className="h-screen w-full snap-start bg-black flex flex-col items-center relative"
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      variants={videoVariants}
    >
      <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
        {short.video_urls && short.video_urls[0] ? (
          <SimpleMediaDisplay
            url={short.video_urls[0]}
            className="w-full h-full object-contain"
            alt="Short video"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-900">
            <p className="text-white">No video available</p>
          </div>
        )}
        
        <div className="absolute bottom-16 left-4 right-12 bg-gradient-to-t from-black/70 to-transparent p-4 rounded-lg">
          <h3 className="font-medium text-white mb-2">@{short.creator.username}</h3>
          <p className="text-white/90 text-sm line-clamp-2">{short.description || short.content}</p>
          <p className="text-white/60 text-xs mt-1">{formatDate(short.created_at)}</p>
        </div>
        
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
