
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { MediaViewer } from "@/components/media/MediaViewer";
import { ShareDialog } from "./ShareDialog";
import { CommentSection } from "./CommentSection";
import { PostHeader } from "./post-components/PostHeader";
import { PostContent } from "./post-components/PostContent";
import { PostActions } from "./post-components/PostActions";
import { Post } from "./types";
import { supabase } from "@/integrations/supabase/client";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import { useQueryClient } from "@tanstack/react-query";

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
  const [editedContent, setEditedContent] = useState(post.content);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isOwner = currentUserId === post.creator_id;

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
      await onDelete(post.id, post.creator_id);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleEdit = async () => {
    try {
      const { error } = await supabase
        .from("posts")
        .update({ 
          content: editedContent,
          updated_at: new Date().toISOString()
        })
        .eq("id", post.id);

      if (error) throw error;

      // Update the cache
      queryClient.invalidateQueries({ queryKey: ['posts'] });

      setIsEditDialogOpen(false);
      toast({
        title: "Post updated",
        description: "Your post has been successfully updated.",
      });
    } catch (error) {
      console.error('Edit error:', error);
      toast({
        title: "Update failed",
        description: "Failed to update post. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="bg-[#0D1117] border-luxury-neutral/10 hover:border-luxury-neutral/20 transition-all duration-300">
      <div className="p-4 space-y-4">
        <PostHeader
          creator={post.creator}
          createdAt={post.created_at}
          updatedAt={post.updated_at}
          isOwner={isOwner}
          onEdit={() => setIsEditDialogOpen(true)}
          onDelete={() => setIsDeleteDialogOpen(true)}
        />

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
      />

      <ShareDialog 
        open={isShareDialogOpen} 
        onOpenChange={setIsShareDialogOpen}
        postId={post.id}
      />

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Post</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              placeholder="Edit your post..."
              className="min-h-[100px]"
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEdit}>
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
      />
    </Card>
  );
};
