
import { motion } from "framer-motion";
import { Story } from "@/integrations/supabase/types/story";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trash2, Play, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

interface StoryItemProps {
  story: Story;
  isStacked?: boolean;
  stackCount?: number;
  onClick: () => void;
  onDelete?: () => void;
}

export const StoryItem = ({ 
  story, 
  isStacked, 
  stackCount = 0,
  onClick,
  onDelete
}: StoryItemProps) => {
  const [isMediaLoading, setIsMediaLoading] = useState(true);
  const [hasMediaError, setHasMediaError] = useState(false);
  
  // Determine media type with fallbacks
  const mediaType = story.media_type || story.content_type || (story.video_url ? 'video' : 'image');
  const isVideo = mediaType === 'video' || !!story.video_url;
  const mediaUrl = isVideo ? story.video_url : story.media_url;
  
  // Format timestamp
  const storyDate = new Date(story.created_at);
  const timeAgo = getTimeAgo(storyDate);
  
  useEffect(() => {
    // Reset loading state when story changes
    setIsMediaLoading(true);
    setHasMediaError(false);
  }, [story.id]);
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default navigation
    onClick();
  };
  
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default navigation
    e.stopPropagation();
    if (onDelete) onDelete();
  };
  
  const handleMediaLoad = () => {
    setIsMediaLoading(false);
  };
  
  const handleMediaError = () => {
    setIsMediaLoading(false);
    setHasMediaError(true);
  };
  
  return (
    <div className="relative">
      {/* Stacked appearance for multiple stories */}
      {isStacked && stackCount > 0 && (
        <>
          <div className="absolute -right-1 -bottom-1 w-24 h-36 rounded-xl bg-luxury-dark/40 transform rotate-3" />
          <div className="absolute -right-2 -bottom-2 w-24 h-36 rounded-xl bg-luxury-dark/60 transform rotate-6" />
        </>
      )}
      
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative w-24 h-36 rounded-xl overflow-hidden cursor-pointer group border border-luxury-primary/20"
        onClick={handleClick}
      >
        {/* Gradient overlay for better text visibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 z-10" />
        
        {/* Loading state */}
        {isMediaLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-5">
            <Loader2 className="w-6 h-6 text-luxury-primary animate-spin" />
          </div>
        )}
        
        {/* Error state */}
        {hasMediaError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 z-5">
            <div className="text-red-500">
              <AlertTriangle className="w-6 h-6 mx-auto" />
              <p className="text-[10px] mt-1 text-center">Media error</p>
            </div>
          </div>
        )}
        
        {/* Media preview */}
        {isVideo ? (
          <>
            <video
              src={mediaUrl || ''}
              className="w-full h-full object-cover"
              muted
              playsInline
              onLoadedData={handleMediaLoad}
              onError={handleMediaError}
            />
            {/* Video indicator with play icon */}
            <div className="absolute top-2 left-2 bg-black/40 rounded-full p-1 z-20">
              <Play className="w-3 h-3 text-white fill-current" />
            </div>
          </>
        ) : (
          <>
            <img
              src={mediaUrl || ''}
              alt=""
              className="w-full h-full object-cover"
              loading="eager"
              onLoad={handleMediaLoad}
              onError={handleMediaError}
            />
            {/* Image indicator */}
            <div className="absolute top-2 left-2 bg-black/40 rounded-full p-1 z-20">
              <ImageIcon className="w-3 h-3 text-white" />
            </div>
          </>
        )}

        {/* Creator avatar */}
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-20">
          <Avatar className="w-8 h-8 ring-2 ring-luxury-primary/30 group-hover:ring-luxury-primary/60 transition-all duration-200">
            <AvatarImage src={story.creator?.avatar_url || ''} />
            <AvatarFallback>{story.creator?.username?.[0]?.toUpperCase() || '?'}</AvatarFallback>
          </Avatar>
        </div>

        {/* Delete button for owner */}
        {onDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute top-2 right-2 z-20"
          >
            <Button
              variant="destructive"
              size="icon"
              className="w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleDelete}
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </motion.div>
        )}

        {/* Username and time */}
        <div className="absolute bottom-2 left-2 right-2 z-20">
          <p className="text-xs text-white/90 truncate text-center font-medium">
            {story.creator?.username || 'Unknown'}
          </p>
          <p className="text-[10px] text-white/70 text-center mt-0.5">
            {isStacked && stackCount > 0 ? `+${stackCount} more` : timeAgo}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

// Helper function to format time ago
function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  
  if (diffSecs < 60) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${Math.floor(diffHours / 24)}d ago`;
}

// Missing icon component
const AlertTriangle = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
    <line x1="12" y1="9" x2="12" y2="13"></line>
    <line x1="12" y1="17" x2="12.01" y2="17"></line>
  </svg>
);
