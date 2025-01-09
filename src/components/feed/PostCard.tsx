import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { PostHeader } from "./PostHeader";
import { getImageStyles, generateSrcSet, getResponsiveSizes } from "@/lib/image-utils";
import { MediaViewer } from "@/components/media/MediaViewer";
import { Post } from "@/components/feed/types";
import { ProtectedMedia } from "@/components/security/ProtectedMedia";
import { CommentSection } from "./CommentSection";
import { ShareDialog } from "./ShareDialog";

interface PostCardProps {
  post: Post;
  onLike?: (postId: string) => Promise<void>;
  onDelete?: (postId: string, creatorId: string) => Promise<void>;
  onComment?: () => void;
  currentUserId?: string;
}

export const PostCard = ({ 
  post, 
  onLike, 
  onDelete,
  onComment,
  currentUserId 
}: PostCardProps) => {
  const [liked, setLiked] = useState(post.has_liked);
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const handleLike = async () => {
    if (onLike) {
      await onLike(post.id);
      setLiked(!liked);
    }
  };

  const handleCommentClick = () => {
    if (onComment) {
      onComment();
    }
    setShowComments(!showComments);
  };

  const isVideo = (url: string) => {
    return url.match(/\.(mp4|webm|ogg)$/i);
  };

  const hasMedia = post.media_url && post.media_url.length > 0;

  return (
    <Card className="post-card">
      <PostHeader 
        post={post} 
        isOwner={currentUserId === post.creator_id}
        onDelete={onDelete}
      />
      
      {hasMedia && (
        <ProtectedMedia contentOwnerId={post.creator_id}>
          <div className="relative w-full mt-4 overflow-hidden rounded-xl">
            <div className="overflow-x-auto scrollbar-hide w-full">
              <div className="flex w-full">
                {post.media_url.map((url, index) => (
                  <div
                    key={index}
                    className="min-w-full h-full cursor-pointer group"
                    onClick={() => setSelectedMedia(url)}
                  >
                    {isVideo(url) ? (
                      <video
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        controls
                        playsInline
                        preload="metadata"
                      >
                        <source src={url} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <img
                        src={url}
                        alt={`Post media ${index + 1}`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="eager"
                        decoding="sync"
                        srcSet={generateSrcSet(url)}
                        sizes={getResponsiveSizes()}
                        style={getImageStyles()}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ProtectedMedia>
      )}

      <CardContent className="space-y-4 pt-4">
        <p className="text-luxury-neutral/90">{post.content}</p>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="post-action"
            onClick={handleLike}
          >
            <Heart className={cn("w-5 h-5", liked && "fill-current text-luxury-primary")} />
            <span>{post.likes_count || 0}</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="post-action"
            onClick={handleCommentClick}
          >
            <MessageCircle className="w-5 h-5" />
            <span>{post.comments_count || 0}</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="post-action"
            onClick={() => setIsShareDialogOpen(true)}
          >
            <Share2 className="w-5 h-5" />
            Share
          </Button>
        </div>

        {showComments && (
          <CommentSection 
            postId={post.id} 
            commentsCount={post.comments_count} 
          />
        )}
      </CardContent>

      <MediaViewer 
        media={selectedMedia} 
        onClose={() => setSelectedMedia(null)} 
      />

      <ShareDialog 
        open={isShareDialogOpen} 
        onOpenChange={setIsShareDialogOpen}
        postId={post.id}
      />
    </Card>
  );
};
