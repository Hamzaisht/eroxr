
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, Share, Bookmark, MoreVertical } from "lucide-react";
import { MediaRenderer } from "@/components/media/MediaRenderer";
import { useState } from "react";
import type { MediaAsset } from "./types";

interface PostProps {
  post: {
    id: string;
    content: string;
    creator: {
      id: string;
      username: string;
      avatar_url?: string | null;
      isVerified?: boolean;
    };
    createdAt: string;
    likesCount: number;
    commentsCount: number;
    isLiked?: boolean;
    isSaved?: boolean;
    media_assets?: MediaAsset[];
  };
  currentUser?: {
    id: string;
    username: string;
  };
  onLike?: (postId: string) => void;
  onDelete?: (postId: string, creatorId: string) => void;
}

export const Post = ({ post, currentUser, onLike, onDelete }: PostProps) => {
  const [isLiked, setIsLiked] = useState(post.isLiked || false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike?.(post.id);
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getInitials = (username: string) => {
    return username.charAt(0).toUpperCase();
  };

  const hasValidMedia = post.media_assets && post.media_assets.length > 0 && 
    post.media_assets.some(asset => asset.storage_path && asset.id);

  return (
    <Card className="bg-luxury-darker border-luxury-neutral/10 overflow-hidden">
      <CardContent className="p-0">
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              {post.creator.avatar_url ? (
                <AvatarImage src={post.creator.avatar_url} alt={post.creator.username} />
              ) : null}
              <AvatarFallback className="bg-luxury-darker text-luxury-neutral">
                {getInitials(post.creator.username)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-white font-semibold">{post.creator.username}</p>
              <p className="text-gray-400 text-sm">{formatTimeAgo(post.createdAt)}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            <MoreVertical className="h-4 w-4 text-gray-400" />
          </Button>
        </div>

        {/* Content */}
        {post.content && (
          <div className="px-4 pb-3">
            <p className="text-white whitespace-pre-wrap">{post.content}</p>
          </div>
        )}

        {/* Media - Only render if we have valid media */}
        {hasValidMedia && (
          <div className="relative">
            <MediaRenderer
              assets={post.media_assets}
              className="w-full"
            />
          </div>
        )}

        {/* Actions */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className={`flex items-center gap-2 ${isLiked ? 'text-red-500' : 'text-gray-400'}`}
              >
                <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
                <span>{post.likesCount}</span>
              </Button>
              
              <Button variant="ghost" size="sm" className="flex items-center gap-2 text-gray-400">
                <MessageCircle className="h-5 w-5" />
                <span>{post.commentsCount}</span>
              </Button>
              
              <Button variant="ghost" size="sm" className="text-gray-400">
                <Share className="h-5 w-5" />
              </Button>
            </div>
            
            <Button variant="ghost" size="sm" className="text-gray-400">
              <Bookmark className="h-5 w-5" />
            </Button>
          </div>
          
          {currentUser?.id === post.creator.id && onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(post.id, post.creator.id)}
              className="text-red-400 hover:text-red-300"
            >
              Delete
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
