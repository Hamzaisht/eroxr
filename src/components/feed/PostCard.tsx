import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { MediaViewer } from "@/components/media/MediaViewer";
import { ShareDialog } from "./ShareDialog";
import { CommentSection } from "./CommentSection";
import { PostHeader } from "./post-components/PostHeader";
import { PostContent } from "./post-components/PostContent";
import { PostActions } from "./post-components/PostActions";
import { PostMenu } from "./post-components/PostMenu";
import { getPlayableMediaUrl } from "@/utils/media/getPlayableMediaUrl";
import { PostEditDialog } from "./post-components/PostEditDialog";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import { Post } from "./types";
import { Loader2 } from "lucide-react";

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
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const { toast } = useToast();
  const isOwner = currentUserId && post.creator_id === currentUserId;

  console.log('PostCard - currentUserId:', currentUserId);
  console.log('PostCard - post.creator_id:', post.creator_id);
  console.log('PostCard - isOwner:', isOwner);

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

  const handleDelete = async () => {
    if (onDelete && isOwner) {
      try {
        setIsDeleting(true);
        setDeleteError(null);
        await onDelete(post.id, post.creator_id);
        setIsDeleteDialogOpen(false);
        toast({
          title: "Post deleted",
          description: "Your post has been successfully removed.",
        });
      } catch (error) {
        console.error('Delete error:', error);
        setDeleteError("Failed to delete post. Please try again.");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleRetryDelete = () => {
    setDeleteError(null);
    handleDelete();
  };

  return (
    <Card className="bg-[#0D1117] border-luxury-neutral/10 hover:border-luxury-neutral/20 transition-all duration-300">
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <PostHeader
            creator={post.creator}
            createdAt={post.created_at}
            updatedAt={post.updated_at}
          />
          {isOwner && (
            <PostMenu 
              onEdit={() => setIsEditDialogOpen(true)} 
              onDelete={() => setIsDeleteDialogOpen(true)} 
            />
          )}
        </div>

        <PostContent
          content={post.content}
          mediaUrls={post.media_url}
          videoUrls={post.video_urls}
          creatorId={post.creator_id}
          onMediaClick={setSelectedMedia}
        />

        <PostActions
          hasLiked={post.has_liked}
          likesCount={post.likes_count}
          commentsCount={post.comments_count}
          onLike={handleLike}
          onComment={handleCommentClick}
          onShare={() => setIsShareDialogOpen(true)}
        />

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
        creatorId={post.creator_id}
      />

      <ShareDialog 
        open={isShareDialogOpen} 
        onOpenChange={setIsShareDialogOpen}
        postId={post.id}
      />

      <PostEditDialog
        postId={post.id}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        initialContent={post.content}
      />

      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
        error={deleteError}
        onRetry={handleRetryDelete}
      />
    </Card>
  );
};
