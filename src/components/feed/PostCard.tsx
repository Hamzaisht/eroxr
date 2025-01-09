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
    <Card className="w-full bg-luxury-dark/30 border-luxury-primary/10 backdrop-blur-xl hover:shadow-luxury transition-all duration-300">
      <PostHeader 
        post={post} 
        isOwner={currentUserId === post.creator_id}
        onDelete={onDelete}
      />
      
      {hasMedia && (
        <ProtectedMedia contentOwnerId={post.creator_id}>
          <div className="relative w-full">
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

      <CardContent className="space-y-4 w-full p-6">
        <p className="text-luxury-neutral/90 w-full">{post.content}</p>
        
        <div className="flex items-center gap-4 w-full">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "text-luxury-neutral/70 hover:text-luxury-neutral hover:bg-luxury-primary/10 flex-1 transition-colors duration-300",
              liked && "text-luxury-primary hover:text-luxury-primary/80"
            )}
            onClick={handleLike}
          >
            <Heart className={cn("w-5 h-5 mr-1.5", liked && "fill-current")} />
            {post.likes_count || 0}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="text-luxury-neutral/70 hover:text-luxury-neutral hover:bg-luxury-primary/10 flex-1 transition-colors duration-300"
            onClick={handleCommentClick}
          >
            <MessageCircle className="w-5 h-5 mr-1.5" />
            {post.comments_count || 0}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="text-luxury-neutral/70 hover:text-luxury-neutral hover:bg-luxury-primary/10 flex-1 transition-colors duration-300"
            onClick={() => setIsShareDialogOpen(true)}
          >
            <Share2 className="w-5 h-5 mr-1.5" />
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