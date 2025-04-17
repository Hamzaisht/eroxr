
import { useState } from "react";
import { motion } from "framer-motion";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ErosVideoPlayer } from "./ErosVideoPlayer";
import { Heart, MessageSquare, Share2, Bookmark, MoreHorizontal } from "lucide-react";
import { ErosVideo } from "@/types/eros";
import { formatDistanceToNow } from "date-fns";

interface ErosItemProps {
  video: ErosVideo;
  isActive: boolean;
  onLike: (id: string) => void;
  onComment: (id: string) => void;
  onShare: (id: string) => void;
  onSave: (id: string) => void;
  onMore?: (id: string) => void;
  className?: string;
}

export function ErosItem({
  video,
  isActive,
  onLike,
  onComment,
  onShare,
  onSave,
  onMore,
  className
}: ErosItemProps) {
  const [hasLiked, setHasLiked] = useState(video.hasLiked || false);
  const [hasSaved, setHasSaved] = useState(video.hasSaved || false);
  const [videoError, setVideoError] = useState(false);
  
  const session = useSession();
  const { toast } = useToast();
  
  // Format date
  const dateFormatted = video.createdAt ? 
    formatDistanceToNow(new Date(video.createdAt), { addSuffix: true }) : "";
  
  // Handle video error
  const handleVideoError = () => {
    setVideoError(true);
  };
  
  // Handle like action
  const handleLike = () => {
    if (!session) {
      toast({
        title: "Sign in required",
        description: "Please sign in to like videos",
      });
      return;
    }
    
    setHasLiked(prev => !prev);
    onLike(video.id);
  };
  
  // Handle save action
  const handleSave = () => {
    if (!session) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save videos",
      });
      return;
    }
    
    setHasSaved(prev => !prev);
    onSave(video.id);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className={`relative h-[100dvh] w-full snap-start snap-always ${className || ''}`}
    >
      {/* Video */}
      <div className="absolute inset-0 bg-black">
        <ErosVideoPlayer
          videoUrl={video.url}
          thumbnailUrl={video.thumbnailUrl}
          isActive={isActive}
          onError={handleVideoError}
        />
        
        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70 pointer-events-none" />
      </div>
      
      {/* Content Overlay */}
      <div className="absolute inset-x-0 bottom-0 p-4 z-10">
        <div className="flex items-end justify-between">
          {/* Creator info and description */}
          <div className="flex-1 mr-4">
            <div className="flex items-center gap-2 mb-2">
              <Avatar className="h-8 w-8 border border-white/20">
                <AvatarImage src={video.creator.avatarUrl} />
                <AvatarFallback>
                  {video.creator.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div>
                <p className="font-semibold text-sm text-white">
                  @{video.creator.username}
                </p>
                <p className="text-xs text-white/70">{dateFormatted}</p>
              </div>
              
              <Button variant="secondary" size="sm" className="ml-2 h-7 px-3 text-xs">
                Follow
              </Button>
            </div>
            
            {video.description && (
              <p className="text-sm text-white max-w-[80%] mb-4 line-clamp-2">
                {video.description}
              </p>
            )}
            
            {video.tags && video.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {video.tags.map((tag, idx) => (
                  <span key={idx} className="text-xs text-luxury-primary">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          
          {/* Action buttons */}
          <div className="flex flex-col items-center gap-4">
            <button
              onClick={handleLike}
              className="flex flex-col items-center"
              aria-label={hasLiked ? "Unlike" : "Like"}
            >
              <div className={`p-2 rounded-full ${hasLiked ? 'text-red-500' : 'text-white'} bg-black/30`}>
                <Heart className={`w-6 h-6 ${hasLiked ? 'fill-current' : ''}`} />
              </div>
              <span className="text-xs text-white mt-1">{video.stats.likes + (hasLiked && !video.hasLiked ? 1 : 0)}</span>
            </button>
            
            <button
              onClick={() => onComment(video.id)}
              className="flex flex-col items-center"
              aria-label="Comment"
            >
              <div className="p-2 rounded-full bg-black/30 text-white">
                <MessageSquare className="w-6 h-6" />
              </div>
              <span className="text-xs text-white mt-1">{video.stats.comments}</span>
            </button>
            
            <button
              onClick={handleSave}
              className="flex flex-col items-center"
              aria-label={hasSaved ? "Unsave" : "Save"}
            >
              <div className={`p-2 rounded-full ${hasSaved ? 'text-luxury-primary' : 'text-white'} bg-black/30`}>
                <Bookmark className={`w-6 h-6 ${hasSaved ? 'fill-current' : ''}`} />
              </div>
              <span className="text-xs text-white mt-1">Save</span>
            </button>
            
            <button
              onClick={() => onShare(video.id)}
              className="flex flex-col items-center"
              aria-label="Share"
            >
              <div className="p-2 rounded-full bg-black/30 text-white">
                <Share2 className="w-6 h-6" />
              </div>
              <span className="text-xs text-white mt-1">Share</span>
            </button>
            
            {onMore && (
              <button
                onClick={() => onMore(video.id)}
                className="flex flex-col items-center"
                aria-label="More options"
              >
                <div className="p-2 rounded-full bg-black/30 text-white">
                  <MoreHorizontal className="w-6 h-6" />
                </div>
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
