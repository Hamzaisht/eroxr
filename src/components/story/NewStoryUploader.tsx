
import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { MediaUploader } from "@/components/media/MediaUploader";
import { NewMediaRenderer } from "@/components/media/NewMediaRenderer";
import { getContentType } from "@/utils/mediaUtils";
import { Loader2, X } from "lucide-react";

export const NewStoryUploader: React.FC = () => {
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const session = useSession();
  const { toast } = useToast();

  const handleMediaComplete = (url: string) => {
    setMediaUrl(url);
  };

  const handlePublish = async () => {
    if (!session?.user?.id) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create a story.",
        variant: "destructive"
      });
      return;
    }
    
    if (!mediaUrl) {
      toast({
        title: "No Media",
        description: "Please upload an image or video for your story.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const contentType = getContentType(mediaUrl);
      
      const { error } = await supabase
        .from("stories")
        .insert({
          creator_id: session.user.id,
          media_url: mediaUrl,
          content_type: contentType,
          is_public: true,
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours from now
        });
      
      if (error) throw error;
      
      toast({
        title: "Story Published",
        description: "Your story has been published successfully."
      });
      
      // Reset form
      setMediaUrl(null);
    } catch (error: any) {
      console.error("Story submission error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to publish story. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClearMedia = () => {
    setMediaUrl(null);
  };

  return (
    <div className="space-y-4 p-4 border rounded-md">
      <h2 className="text-lg font-bold">Create Story</h2>
      
      {mediaUrl ? (
        <div className="relative">
          <NewMediaRenderer
            item={mediaUrl}
            className="w-full h-[70vh] max-h-[500px] rounded-md overflow-hidden"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={handleClearMedia}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <MediaUploader
          context="story"
          onComplete={handleMediaComplete}
          buttonText="Upload Story Media"
        />
      )}
      
      {mediaUrl && (
        <div className="flex justify-end">
          <Button 
            onClick={handlePublish} 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Publishing...
              </>
            ) : (
              "Publish Story"
            )}
          </Button>
        </div>
      )}
    </div>
  );
};
