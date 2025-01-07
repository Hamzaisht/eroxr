import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { PostHeader } from "./PostHeader";
import { getImageStyles, generateSrcSet, getResponsiveSizes } from "@/lib/image-utils";
import { MediaViewer } from "@/components/media/MediaViewer";
import { Post } from "@/components/feed/types";

interface PostCardProps {
  post: Post;
  onLike?: (postId: string) => Promise<void>;
  onDelete?: (postId: string, creatorId: string) => Promise<void>;
  currentUserId?: string;
}

export const PostCard = ({ post, onLike, onDelete, currentUserId }: PostCardProps) => {
  const [liked, setLiked] = useState(post.has_liked);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);

  const handleLike = async () => {
    if (onLike) {
      await onLike(post.id);
      setLiked(!liked);
    }
  };

  return (
    <Card className="overflow-hidden bg-luxury-dark border-luxury-primary/10">
      <PostHeader 
        post={post} 
        isOwner={currentUserId === post.creator_id}
        onDelete={onDelete}
      />
      
      {post.media_url && post.media_url.length > 0 && (
        <div className="relative">
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex">
              {post.media_url.map((url, index) => (
                <div
                  key={index}
                  className="min-w-full h-full cursor-pointer"
                  onClick={() => setSelectedMedia(url)}
                >
                  <img
                    src={url}
                    alt={`Post media ${index + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    loading="eager"
                    decoding="sync"
                    srcSet={generateSrcSet(url)}
                    sizes={getResponsiveSizes()}
                    style={getImageStyles()}
                  />
                </div>
              ))}
            </div>
          </div>
          
          {post.media_url.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1">
              {post.media_url.map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "w-2 h-2 rounded-full",
                    currentImageIndex === index
                      ? "bg-white"
                      : "bg-white/50"
                  )}
                />
              ))}
            </div>
          )}
        </div>
      )}

      <CardContent className="space-y-4">
        <p className="text-white/90">{post.content}</p>
        
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "text-white/70 hover:text-white hover:bg-white/10",
              liked && "text-red-500 hover:text-red-600"
            )}
            onClick={handleLike}
          >
            <Heart className="w-5 h-5 mr-1.5" />
            {post.likes_count || 0}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="text-white/70 hover:text-white hover:bg-white/10"
          >
            <MessageCircle className="w-5 h-5 mr-1.5" />
            {post.comments_count || 0}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="text-white/70 hover:text-white hover:bg-white/10"
          >
            <Share2 className="w-5 h-5 mr-1.5" />
            Share
          </Button>
        </div>
      </CardContent>

      <MediaViewer 
        media={selectedMedia} 
        onClose={() => setSelectedMedia(null)} 
      />
    </Card>
  );
};