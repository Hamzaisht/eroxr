import { Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";

interface SaveButtonProps {
  postId: string;
}

export const SaveButton = ({ postId }: SaveButtonProps) => {
  const [isSaved, setIsSaved] = useState(false);
  const { toast } = useToast();
  const session = useSession();

  useEffect(() => {
    const checkSavedStatus = async () => {
      if (!session?.user?.id) return;
      
      const { data, error } = await supabase
        .from('post_saves')
        .select('*')
        .eq('post_id', postId)
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (!error && data) {
        setIsSaved(true);
      }
    };

    checkSavedStatus();
  }, [postId, session?.user?.id]);

  const handleSave = async () => {
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please log in to save posts.",
        duration: 3000,
      });
      return;
    }

    try {
      if (isSaved) {
        const { error: deleteError } = await supabase
          .from('post_saves')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', session.user.id);

        if (deleteError) throw deleteError;
        setIsSaved(false);
        
        toast({
          title: "Post unsaved",
          description: "Removed from your saved posts",
        });
      } else {
        const { error: insertError } = await supabase
          .from('post_saves')
          .insert([{ post_id: postId, user_id: session.user.id }]);

        if (insertError) throw insertError;
        setIsSaved(true);
        
        toast({
          title: "Post saved",
          description: "Added to your saved posts",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save post. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="flex items-center gap-2"
      onClick={handleSave}
    >
      <Bookmark className={`h-4 w-4 ${isSaved ? "fill-primary text-primary" : ""}`} />
      Save
    </Button>
  );
};