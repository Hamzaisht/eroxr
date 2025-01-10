import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share2, Edit2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { PostHeader } from "./PostHeader";
import { getImageStyles, generateSrcSet, getResponsiveSizes } from "@/lib/image-utils";
import { MediaViewer } from "@/components/media/MediaViewer";
import { Post } from "@/components/feed/types";
import { ProtectedMedia } from "@/components/security/ProtectedMedia";
import { CommentSection } from "./CommentSection";
import { ShareDialog } from "./ShareDialog";
import { format } from "date-fns";

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

  const isEdited = post.updated_at !== post.created_at;

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
    <Card className="neo-card hover:shadow-luxury transition-all duration-300">
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
        
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 hover:bg-luxury-primary/10"
            onClick={handleLike}
          >
            <Heart className={cn("h-5 w-5", liked && "fill-luxury-primary text-luxury-primary")} />
            <span>{post.likes_count || 0}</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 hover:bg-luxury-primary/10"
            onClick={handleCommentClick}
          >
            <MessageCircle className="h-5 w-5" />
            <span>{post.comments_count || 0}</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 hover:bg-luxury-primary/10"
            onClick={() => setIsShareDialogOpen(true)}
          >
            <Share2 className="h-5 w-5" />
            <span>Share</span>
          </Button>

          {isEdited && (
            <div className="flex items-center text-sm text-luxury-neutral/60">
              <Edit2 className="h-4 w-4 mr-1" />
              <span>edited {format(new Date(post.updated_at), 'MMM d, yyyy')}</span>
            </div>
          )}
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