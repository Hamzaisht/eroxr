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
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "@supabase/auth-helpers-react";
import { CommentSection } from "./CommentSection";
import { ShareDialog } from "./ShareDialog";

interface PostCardProps {
  post: Post;
  onLike?: (postId: string) => Promise<void>;
  onDelete?: (postId: string, creatorId: string) => Promise<void>;
  currentUserId?: string;
}

export const PostCard = ({ post, onLike, onDelete, currentUserId }: PostCardProps) => {
  const [liked, setLiked] = useState(post.has_liked);
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const { toast } = useToast();
  const session = useSession();

  const handleLike = async () => {
    if (!session?.user?.id) {
      toast({
        title: "Authentication required",
        description: "Please log in to like posts.",
        variant: "destructive",
      });
      return;
    }

    if (onLike) {
      await onLike(post.id);
      setLiked(!liked);
    }
  };

  const isVideo = (url: string) => {
    return url.match(/\.(mp4|webm|ogg)$/i);
  };

  const hasMedia = post.media_url && post.media_url.length > 0;

  return (
    <Card className="overflow-hidden bg-luxury-dark border-luxury-primary/10">
      <PostHeader 
        post={post} 
        isOwner={currentUserId === post.creator_id}
        onDelete={onDelete}
      />
      
      {hasMedia && (
        <ProtectedMedia contentOwnerId={post.creator_id}>
          <div className="relative">
            <div className="overflow-x-auto scrollbar-hide">
              <div className="flex">
                {post.media_url.map((url, index) => (
                  <div
                    key={index}
                    className="min-w-full h-full cursor-pointer"
                    onClick={() => setSelectedMedia(url)}
                  >
                    {isVideo(url) ? (
                      <video
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
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
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
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
          
          <CommentSection postId={post.id} commentsCount={post.comments_count} />
          
          <Button
            variant="ghost"
            size="sm"
            className="text-white/70 hover:text-white hover:bg-white/10"
            onClick={() => setIsShareDialogOpen(true)}
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

      <ShareDialog 
        open={isShareDialogOpen} 
        onOpenChange={setIsShareDialogOpen}
        postId={post.id}
      />
    </Card>
  );
};