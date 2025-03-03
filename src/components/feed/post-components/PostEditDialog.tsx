
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { AlertCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useMediaQuery } from "@/hooks/use-mobile";

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
  const isMobile = useMediaQuery("(max-width: 768px)");

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
      <DialogContent className={`${isMobile ? 'w-[90vw] p-4' : 'p-6'} max-w-md bg-luxury-darker border-luxury-primary/20`}>
        <DialogHeader>
          <DialogTitle className={`${isMobile ? 'text-lg' : 'text-xl'} text-luxury-neutral`}>Edit Post</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <Textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            placeholder="Edit your post..."
            className="min-h-[120px] bg-luxury-dark border-luxury-neutral/20 focus:border-luxury-primary/50 resize-none text-white"
            disabled={isEditing}
          />
          
          {editError && (
            <Alert variant="destructive" className="bg-luxury-darker border-red-500/20 py-2 px-3">
              <div className="flex items-center">
                <AlertCircle className="h-4 w-4 mr-2" />
                <AlertDescription className={isMobile ? "text-sm" : "text-base"}>{editError}</AlertDescription>
              </div>
            </Alert>
          )}
          
          <div className="flex justify-end gap-2 mt-4">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isEditing}
              className={`${isMobile ? 'text-sm px-3 py-1.5' : 'px-4 py-2'} bg-transparent border-luxury-neutral/30 text-luxury-neutral hover:bg-luxury-neutral/10`}
            >
              Cancel
            </Button>
            
            {editError ? (
              <Button 
                onClick={handleRetryEdit}
                disabled={isEditing}
                className={`${isMobile ? 'text-sm px-3 py-1.5' : 'px-4 py-2'} bg-luxury-primary/80 hover:bg-luxury-primary text-white`}
              >
                Retry
              </Button>
            ) : (
              <Button 
                onClick={handleEdit}
                disabled={isEditing}
                className={`${isMobile ? 'text-sm px-3 py-1.5' : 'px-4 py-2'} bg-luxury-primary/80 hover:bg-luxury-primary text-white`}
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
