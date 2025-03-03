
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { AlertCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PostEditDialogProps {
  postId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialContent: string;
}

export const PostEditDialog = ({
  postId,
  open,
  onOpenChange,
  initialContent,
}: PostEditDialogProps) => {
  const [editedContent, setEditedContent] = useState(initialContent);
  const [isEditing, setIsEditing] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

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
        .eq("id", postId);

      if (error) throw error;
      
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      onOpenChange(false);
      
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
    <Dialog open={open} onOpenChange={onOpenChange}>
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
              onClick={() => onOpenChange(false)}
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
  );
};
