
import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { PostContent } from "./post-components/PostContent";

interface PostCardProps {
  id: string;
  content: string;
  creatorId: string;
  createdAt: string;
  creator: {
    username: string;
    avatarUrl?: string;
    isVerified?: boolean;
  };
  likesCount?: number;
  commentsCount?: number;
  isLiked?: boolean;
  isSaved?: boolean;
}

export const PostCard = ({
  id,
  content,
  creatorId,
  createdAt,
  creator,
  likesCount = 0,
  commentsCount = 0,
  isLiked = false,
  isSaved = false,
}: PostCardProps) => {
  const { toast } = useToast();
  const [liked, setLiked] = useState(isLiked);
  const [saved, setSaved] = useState(isSaved);

  const handleLike = () => {
    setLiked(!liked);
    toast({
      title: liked ? "Post unliked" : "Post liked",
      description: liked ? "Removed from your likes" : "Added to your likes",
    });
  };

  const handleSave = () => {
    setSaved(!saved);
    toast({
      title: saved ? "Post unsaved" : "Post saved",
      description: saved ? "Removed from saved posts" : "Added to saved posts",
    });
  };

  const handleShare = () => {
    toast({
      title: "Sharing feature coming soon",
      description: "We're working on implementing post sharing",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-6 bg-luxury-darker border-luxury-neutral/20">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={creator.avatarUrl} />
              <AvatarFallback>
                {creator.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div>
              <div className="flex items-center gap-1">
                <span className="font-semibold text-luxury-text">
                  {creator.username}
                </span>
                {creator.isVerified && (
                  <span className="text-luxury-primary">✓</span>
                )}
              </div>
              <span className="text-sm text-luxury-neutral">
                {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
              </span>
            </div>
          </div>
          
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <PostContent
          content={content}
          creatorId={creatorId}
        />

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-luxury-neutral/20">
          <div className="flex items-center gap-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`flex items-center gap-2 ${
                liked ? "text-red-500" : "text-luxury-neutral"
              }`}
            >
              <Heart className={`h-5 w-5 ${liked ? "fill-current" : ""}`} />
              <span>{likesCount}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 text-luxury-neutral"
            >
              <MessageCircle className="h-5 w-5" />
              <span>{commentsCount}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="text-luxury-neutral"
            >
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSave}
            className={saved ? "text-luxury-primary" : "text-luxury-neutral"}
          >
            <Bookmark className={`h-5 w-5 ${saved ? "fill-current" : ""}`} />
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};
