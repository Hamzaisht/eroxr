
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { PlusCircle, Loader2 } from "lucide-react";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface NewPostCreatorProps {
  onPostCreated?: () => void;
}

export const NewPostCreator = ({ onPostCreated }: NewPostCreatorProps) => {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const session = useSession();
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!session?.user?.id) {
      toast({
        title: "Authentication required",
        description: "Please log in to create a post",
        variant: "destructive"
      });
      return;
    }

    if (!content.trim()) {
      toast({
        title: "Content required",
        description: "Please enter some content for your post",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('posts')
        .insert({
          creator_id: session.user.id,
          content: content.trim(),
          visibility: 'public'
        });

      if (error) throw error;

      // No need to manually insert into trending_content - triggers handle it automatically

      toast({
        title: "Post created",
        description: "Your post has been published successfully"
      });

      setContent("");
      if (onPostCreated) {
        onPostCreated();
      }
    } catch (error: any) {
      console.error("Error creating post:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create post",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-4 mb-6">
      <div className="space-y-4">
        <Textarea
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[100px] resize-none border-none focus-visible:ring-0 text-base"
        />
        
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Share your thoughts with the community
          </div>
          
          <Button 
            onClick={handleSubmit}
            disabled={!content.trim() || isSubmitting}
            className="bg-luxury-primary hover:bg-luxury-primary/90"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Posting...
              </>
            ) : (
              <>
                <PlusCircle className="mr-2 h-4 w-4" />
                Post
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
};
