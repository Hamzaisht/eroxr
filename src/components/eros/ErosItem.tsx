
import { useState, memo } from "react";
import { motion } from "framer-motion";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ErosVideoPlayer } from "./ErosVideoPlayer";
import { Heart, MessageSquare, Share2, MoreHorizontal } from "lucide-react";

export interface ErosItemData {
  id: string;
  title?: string;
  description?: string;
  videoUrl: string;
  thumbnailUrl?: string;
  creator: {
    id: string;
    name: string;
    username?: string;
    avatar?: string;
  };
  likes: number;
  comments: number;
  hasLiked?: boolean;
}

interface ErosItemProps {
  item: ErosItemData;
  isActive: boolean;
  onLike: (id: string) => void;
  onComment: (id: string) => void;
  onShare: (id: string) => void;
}

export const ErosItem = memo(({ 
  item, 
  isActive,
  onLike,
  onComment,
  onShare
}: ErosItemProps) => {
  const [hasLiked, setHasLiked] = useState(item.hasLiked || false);
  const [isVideoError, setIsVideoError] = useState(false);
  const session = useSession();
  const { toast } = useToast();

  const handleLikeClick = () => {
    if (!session) {
      toast({
        title: "Sign in required",
        description: "Please sign in to like content"
      });
      return;
    }
    
    setHasLiked(prev => !prev);
    onLike(item.id);
  };

  const handleCommentClick = () => {
    onComment(item.id);
  };

  const handleShareClick = () => {
    onShare(item.id);
  };

  const handleVideoError = () => {
    setIsVideoError(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="relative h-[100dvh] w-full snap-start snap-always"
    >
      {/* Video Background */}
      <div className="absolute inset-0">
        {isVideoError ? (
          <div className="w-full h-full bg-luxury-darker flex items-center justify-center">
            <p className="text-luxury-neutral/70">Unable to load video</p>
          </div>
        ) : (
          <ErosVideoPlayer
            videoUrl={item.videoUrl}
            thumbnailUrl={item.thumbnailUrl}
            isActive={isActive}
            onError={handleVideoError}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70" />
      </div>
      
      {/* Content Overlay */}
      <div className="absolute inset-x-0 bottom-0 z-10 p-4 text-white">
        <div className="flex items-end justify-between">
          <div className="flex-1">
            {/* Creator Info */}
            <div className="flex items-center mb-2">
              <Avatar className="h-8 w-8 mr-2 border border-white/20">
                <AvatarImage src={item.creator.avatar} />
                <AvatarFallback>
                  {item.creator.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-bold text-sm">
                  {item.creator.username || item.creator.name}
                </p>
              </div>
              <Button variant="secondary" size="sm" className="ml-2 h-7 px-2 text-xs">
                Follow
              </Button>
            </div>
            
            {/* Description */}
            {item.description && (
              <p className="text-sm line-clamp-2 mb-4 max-w-[80%]">
                {item.description}
              </p>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col items-center gap-4">
            <button
              onClick={handleLikeClick}
              className="flex flex-col items-center"
            >
              <div className={`p-2 rounded-full ${hasLiked ? 'text-red-500' : 'text-white'} bg-black/30`}>
                <Heart className={`w-6 h-6 ${hasLiked ? 'fill-current' : ''}`} />
              </div>
              <span className="text-xs mt-1">{item.likes + (hasLiked && !item.hasLiked ? 1 : 0)}</span>
            </button>
            
            <button 
              onClick={handleCommentClick}
              className="flex flex-col items-center"
            >
              <div className="p-2 rounded-full bg-black/30">
                <MessageSquare className="w-6 h-6" />
              </div>
              <span className="text-xs mt-1">{item.comments}</span>
            </button>
            
            <button
              onClick={handleShareClick}
              className="flex flex-col items-center"
            >
              <div className="p-2 rounded-full bg-black/30">
                <Share2 className="w-6 h-6" />
              </div>
              <span className="text-xs mt-1">Share</span>
            </button>
            
            <button className="flex flex-col items-center">
              <div className="p-2 rounded-full bg-black/30">
                <MoreHorizontal className="w-6 h-6" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

ErosItem.displayName = "ErosItem";
