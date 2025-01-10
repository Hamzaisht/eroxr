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
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const handleLike = async () => {
    if (onLike) {
      await onLike(post.id);
    }
  };

  const handleCommentClick = () => {
    if (onComment) {
      onComment();
    }
    setShowComments(!showComments);
  };

  const hasMedia = post.media_url && post.media_url.length > 0;

  return (
    <Card className="bg-[#0D1117] border-luxury-neutral/10 hover:border-luxury-neutral/20 transition-all duration-300">
      <div className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="h-10 w-10 ring-2 ring-luxury-primary/20">
            <AvatarImage src={post.creator.avatar_url || ""} />
            <AvatarFallback>{post.creator.username?.[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-luxury-neutral">
              {post.creator.username}
            </h3>
            <p className="text-sm text-luxury-neutral/60">
              {format(new Date(post.created_at), 'MMM d, yyyy')}
            </p>
          </div>
        </div>

        <p className="text-luxury-neutral/90 mb-4">{post.content}</p>
        
        {hasMedia && (
          <ProtectedMedia contentOwnerId={post.creator_id}>
            <div className="relative w-full overflow-hidden rounded-xl mb-4">
              <div className="overflow-x-auto scrollbar-hide w-full">
                <div className="flex w-full">
                  {post.media_url.map((url, index) => (
                    <div
                      key={index}
                      className="min-w-full h-full cursor-pointer group"
                      onClick={() => setSelectedMedia(url)}
                    >
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
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ProtectedMedia>
        )}

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 hover:bg-luxury-primary/10"
            onClick={handleLike}
          >
            <Heart className={cn("h-5 w-5", post.has_liked && "fill-luxury-primary text-luxury-primary")} />
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
        </div>

        {showComments && (
          <CommentSection 
            postId={post.id} 
            commentsCount={post.comments_count} 
          />
        )}
      </div>

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