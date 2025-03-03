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
import { MoreHorizontal, Edit2, Trash2, AlertCircle, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  const [isEditing, setIsEditing] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
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

  const handleEdit = async () => {
    try {
      if (!editedContent.trim()) {
        setEditError("Content cannot be empty");
        return;
      }
      
      setIsEditing(true);
      setEditError(null);
      
      const { error } = await supabase
        .from("posts")
        .update({ 
          content: editedContent,
          updated_at: new Date().toISOString()
        })
        .eq("id", post.id);

      if (error) throw error;
      
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      setIsEditDialogOpen(false);
      
      toast({
        title: "Post updated",
        description: "Your post has been successfully updated.",
      });
    } catch (error) {
      console.error('Edit error:', error);
      setEditError("Failed to update post. Please try again.");
    } finally {
      setIsEditing(false);
    }
  };

  const handleRetryEdit = () => {
    setEditError(null);
    handleEdit();
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="hover:bg-luxury-neutral/10">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40 bg-luxury-darker/95 backdrop-blur-md border-luxury-primary/20">
                <DropdownMenuItem 
                  onClick={() => setIsEditDialogOpen(true)}
                  className="text-luxury-neutral hover:text-white cursor-pointer"
                >
                  <Edit2 className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="text-red-500 hover:text-red-300 focus:text-red-300 cursor-pointer"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
              disabled={isEditing}
            />
            
            {editError && (
              <Alert variant="destructive" className="bg-luxury-darker border-red-500/20">
                <div className="flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  <AlertDescription>{editError}</AlertDescription>
                </div>
              </Alert>
            )}
            
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => setIsEditDialogOpen(false)}
                disabled={isEditing}
              >
                Cancel
              </Button>
              
              {editError ? (
                <Button 
                  onClick={handleRetryEdit}
                  disabled={isEditing}
                >
                  Retry
                </Button>
              ) : (
                <Button 
                  onClick={handleEdit}
                  disabled={isEditing}
                >
                  {isEditing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

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
