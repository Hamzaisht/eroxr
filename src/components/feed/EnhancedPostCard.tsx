
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, Share, Bookmark, MoreVertical } from "lucide-react";
import { UniversalMediaRenderer } from "@/components/media/UniversalMediaRenderer";
import { MediaType } from "@/utils/media/types";
import { useState } from "react";

interface MediaAsset {
  id: string;
  url: string;
  type: 'image' | 'video' | 'audio' | 'document';
  alt_text?: string;
}

interface PostData {
  id: string;
  content: string;
  creator: {
    id: string;
    username: string;
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

  return (
    <Card className="bg-luxury-darker border-luxury-neutral/10 overflow-hidden">
      <CardContent className="p-0">
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback>
                {post.creator.username[0]?.toUpperCase() || "U"}
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

        {/* Media */}
        {post.media_assets && post.media_assets.length > 0 && (
          <div className="relative">
            {post.media_assets.length === 1 ? (
              <UniversalMediaRenderer
                media={{
                  url: post.media_assets[0].url,
                  type: post.media_assets[0].type as MediaType,
                  alt: post.media_assets[0].alt_text
                }}
                className="w-full aspect-square object-cover"
              />
            ) : (
              <div className="grid grid-cols-2 gap-1">
                {post.media_assets.slice(0, 4).map((asset, index) => (
                  <div key={asset.id} className="relative">
                    <UniversalMediaRenderer
                      media={{
                        url: asset.url,
                        type: asset.type as MediaType,
                        alt: asset.alt_text
                      }}
                      className="w-full aspect-square object-cover"
                    />
                    {index === 3 && post.media_assets!.length > 4 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white text-lg font-semibold">
                          +{post.media_assets!.length - 4}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
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
