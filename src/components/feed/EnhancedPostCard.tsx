
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, Share, Bookmark, MoreVertical } from "lucide-react";
import { MediaRenderer } from "@/components/media/MediaRenderer";
import { useState } from "react";

interface MediaAsset {
  id: string;
  storage_path: string;
  media_type: string;
  mime_type: string;
  alt_text?: string;
  original_name?: string;
  user_id?: string;
  post_id?: string;
  metadata?: {
    post_id?: string;
    [key: string]: any;
  };
}

interface PostData {
  id: string;
  content: string;
  creator: {
    id: string;
    username: string;
    avatar_url?: string | null;
  };
  created_at: string;
  likes_count: number;
  comments_count: number;
  has_liked?: boolean;
  media_assets?: MediaAsset[];
}

interface EnhancedPostCardProps {
  post: PostData;
  onLike: (postId: string) => void;
  onDelete?: (postId: string, creatorId: string) => void;
  currentUserId?: string;
}

export const EnhancedPostCard = ({ post, onLike, onDelete, currentUserId }: EnhancedPostCardProps) => {
  const [isLiked, setIsLiked] = useState(post.has_liked || false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike(post.id);
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
    post.media_assets.some(asset => asset.storage_path && asset.id && asset.media_type && asset.mime_type);

  console.log(`EnhancedPostCard - Rendering post ${post.id} with media:`, {
    hasMediaAssets: !!post.media_assets,
    mediaCount: post.media_assets?.length || 0,
    hasValidMedia,
    validAssets: post.media_assets?.filter(asset => asset.storage_path && asset.id && asset.media_type && asset.mime_type).length || 0,
    mediaAssets: post.media_assets
  });

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
              <p className="text-gray-400 text-sm">{formatTimeAgo(post.created_at)}</p>
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
              media={post.media_assets!.filter(asset => asset.storage_path && asset.id && asset.media_type && asset.mime_type)}
              className="w-full"
              autoPlay={false}
              controls={true}
              showWatermark={false}
              onError={() => console.error(`EnhancedPostCard - Media render error for post ${post.id}`)}
            />
          </div>
        )}

        {/* Media Debug Info */}
        {post.media_assets && post.media_assets.length > 0 && !hasValidMedia && (
          <div className="px-4 pb-3 bg-red-900/20 text-red-400 text-sm">
            <p>Debug: Found {post.media_assets.length} media assets but none are valid</p>
            <pre className="text-xs mt-1 overflow-x-auto">
              {JSON.stringify(post.media_assets, null, 2)}
            </pre>
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
                <span>{post.likes_count}</span>
              </Button>
              
              <Button variant="ghost" size="sm" className="flex items-center gap-2 text-gray-400">
                <MessageCircle className="h-5 w-5" />
                <span>{post.comments_count}</span>
              </Button>
              
              <Button variant="ghost" size="sm" className="text-gray-400">
                <Share className="h-5 w-5" />
              </Button>
            </div>
            
            <Button variant="ghost" size="sm" className="text-gray-400">
              <Bookmark className="h-5 w-5" />
            </Button>
          </div>
          
          {currentUserId === post.creator.id && onDelete && (
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
