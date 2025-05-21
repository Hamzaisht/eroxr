
import { useState, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { NewPostMediaUpload } from "@/components/post/NewPostMediaUpload";
import { Loader2 } from "lucide-react";

export const NewPostCreator: React.FC = () => {
  const [content, setContent] = useState("");
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const session = useSession();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session?.user?.id) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create a post.",
        variant: "destructive"
      });
      return;
    }
    
    if (!content.trim() && mediaUrls.length === 0) {
      toast({
        title: "Empty Post",
        description: "Please add some content or media to your post.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from("posts")
        .insert({
          creator_id: session.user.id,
          content,
          media_url: mediaUrls.length > 0 ? mediaUrls : null
        });
      
      if (error) throw error;
      
      toast({
        title: "Post Created",
        description: "Your post has been published successfully."
      });
      
      // Reset form
      setContent("");
      setMediaUrls([]);
    } catch (error: any) {
      console.error("Post submission error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create post. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMediaUploadProgress = (isActive: boolean) => {
    setIsUploading(isActive);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-md">
      <Textarea
        placeholder="What's on your mind?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="min-h-[100px]"
      />
      
      <NewPostMediaUpload 
        onMediaUrlsChange={setMediaUrls} 
        onUploadProgress={handleMediaUploadProgress}
      />
      
      <div className="flex justify-end">
        <Button 
          type="submit" 
          disabled={isSubmitting || isUploading}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Posting...
            </>
          ) : (
            "Create Post"
          )}
        </Button>
      </div>
    </form>
  );
};
