import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MoreVertical, Trash, Edit } from "lucide-react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Post } from "./types";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PostHeaderProps {
  post: Post;
  isOwner: boolean;
  onDelete: (postId: string, creatorId: string) => Promise<void>;
}

export const PostHeader = ({ post, isOwner, onDelete }: PostHeaderProps) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);
  const { toast } = useToast();

  const handleEdit = async () => {
    try {
      const { error } = await supabase
        .from("posts")
        .update({ content: editedContent })
        .eq("id", post.id);

      if (error) throw error;

      toast({
        title: "Post updated",
        description: "Your post has been successfully updated.",
      });
      setIsEditDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update post. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to={`/profile/${post.creator_id}`}>
            <Avatar className="h-10 w-10 cursor-pointer hover:opacity-80 transition-opacity">
              <AvatarImage 
                src={post.creator.avatar_url || "https://via.placeholder.com/40"} 
                alt={post.creator.username || "Anonymous"} 
              />
              <AvatarFallback>{post.creator.username?.[0]?.toUpperCase() || 'A'}</AvatarFallback>
            </Avatar>
          </Link>
          <div>
            <Link 
              to={`/profile/${post.creator_id}`}
              className="hover:underline"
            >
              <h3 className="font-semibold">
                {post.creator.username || "Anonymous"}
              </h3>
            </Link>
            <p className="text-sm text-muted-foreground">
              {new Date(post.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
        {isOwner && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Post
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-destructive focus:text-destructive"
                onClick={() => onDelete(post.id, post.creator_id)}
              >
                <Trash className="h-4 w-4 mr-2" />
                Delete Post
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

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
    </>
  );
};