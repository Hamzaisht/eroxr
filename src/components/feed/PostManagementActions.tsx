
import { useState } from "react";
import { MoreHorizontal, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PostManagementActionsProps {
  postId: string;
  isOwner: boolean;
  visibility: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const PostManagementActions = ({
  postId,
  isOwner,
  visibility,
  onEdit,
  onDelete
}: PostManagementActionsProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  if (!isOwner) return null;

  const handleDelete = async () => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;

      toast({
        title: "Post deleted",
        description: "Your post has been removed successfully",
      });

      onDelete?.();
    } catch (error) {
      console.error('Error deleting post:', error);
      toast({
        title: "Error",
        description: "Failed to delete post",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
      setShowDeleteDialog(false);
    }
  };

  const toggleVisibility = async () => {
    setIsUpdating(true);
    try {
      const newVisibility = visibility === 'public' ? 'private' : 'public';
      
      const { error } = await supabase
        .from('posts')
        .update({ visibility: newVisibility })
        .eq('id', postId);

      if (error) throw error;

      toast({
        title: "Visibility updated",
        description: `Post is now ${newVisibility}`,
      });
    } catch (error) {
      console.error('Error updating visibility:', error);
      toast({
        title: "Error",
        description: "Failed to update post visibility",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="w-8 h-8">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onEdit} disabled={isUpdating}>
            <Edit className="w-4 h-4 mr-2" />
            Edit Post
          </DropdownMenuItem>
          <DropdownMenuItem onClick={toggleVisibility} disabled={isUpdating}>
            {visibility === 'public' ? (
              <>
                <EyeOff className="w-4 h-4 mr-2" />
                Make Private
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 mr-2" />
                Make Public
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => setShowDeleteDialog(true)}
            className="text-red-600 focus:text-red-600"
            disabled={isUpdating}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Post
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this post? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={isUpdating}
            >
              {isUpdating ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
