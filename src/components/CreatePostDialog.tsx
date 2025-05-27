
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, X } from "lucide-react";
import { MediaUploadSection } from "./post/MediaUploadSection";
import { MediaAccessLevel } from "@/utils/media/types";

interface CreatePostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedFiles?: FileList | null;
  onFileSelect: (files: FileList | null) => void;
}

export const CreatePostDialog = ({ 
  open, 
  onOpenChange,
  selectedFiles,
  onFileSelect
}: CreatePostDialogProps) => {
  const [content, setContent] = useState("");
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [mediaAssetIds, setMediaAssetIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const session = useSession();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session?.user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to create a post",
        variant: "destructive"
      });
      return;
    }
    
    if (!content.trim() && mediaUrls.length === 0) {
      toast({
        title: "Empty post",
        description: "Please add some content or media to your post",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create the post
      const { data: postData, error: postError } = await supabase
        .from("posts")
        .insert({
          creator_id: session.user.id,
          content: content.trim(),
          visibility: 'public'
        })
        .select()
        .single();
        
      if (postError) throw postError;

      // Update media assets to reference this post
      if (mediaAssetIds.length > 0) {
        const { error: updateError } = await supabase
          .from('media_assets')
          .update({
            metadata: { post_id: postData.id, usage: 'post_media' }
          })
          .in('id', mediaAssetIds);

        if (updateError) {
          console.error('Error linking media to post:', updateError);
        }
      }
      
      toast({
        title: "Post created",
        description: "Your post has been published successfully",
      });
      
      // Reset form and close dialog
      setContent("");
      setMediaUrls([]);
      setMediaAssetIds([]);
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error submitting post:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create post",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleMediaUpload = (urls: string[], assetIds: string[]) => {
    setMediaUrls(prev => [...prev, ...urls]);
    setMediaAssetIds(prev => [...prev, ...assetIds]);
  };
  
  const removeMedia = (index: number) => {
    setMediaUrls(prev => prev.filter((_, i) => i !== index));
    setMediaAssetIds(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Post</DialogTitle>
          <DialogDescription>
            Share something with your audience
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea 
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[120px] resize-none"
          />
          
          {mediaUrls.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              {mediaUrls.map((url, index) => (
                <div key={index} className="relative rounded-md overflow-hidden h-24">
                  <img 
                    src={url} 
                    alt={`Upload ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeMedia(index)}
                    className="absolute top-1 right-1 bg-black/70 rounded-full p-1"
                  >
                    <X className="h-4 w-4 text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}
          
          <MediaUploadSection 
            onUploadComplete={handleMediaUpload}
            defaultAccessLevel={MediaAccessLevel.PUBLIC}
          />
          
          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Posting...
                </>
              ) : "Create Post"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
