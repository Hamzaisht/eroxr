
import { Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useSaveAction } from "@/components/home/hooks/actions/useSaveAction";

interface SaveButtonProps {
  postId: string;
}

export const SaveButton = ({ postId }: SaveButtonProps) => {
  const [isSaved, setIsSaved] = useState(false);
  const session = useSession();
  const { handleSave } = useSaveAction();

  // Check if the post is already saved by the current user
  useEffect(() => {
    const checkSavedStatus = async () => {
      if (!session?.user?.id) return;
      
      try {
        const { data, error } = await supabase
          .from('post_saves')
          .select('*')
          .eq('post_id', postId)
          .eq('user_id', session.user.id)
          .maybeSingle();

        if (!error && data) {
          setIsSaved(true);
        }
      } catch (error) {
        console.error("Error checking saved status:", error);
      }
    };

    checkSavedStatus();
  }, [postId, session?.user?.id]);

  // Handle save/unsave action
  const onSaveClick = async () => {
    if (!session) return;

    try {
      // Use the shared save action handler which includes proper state management
      await handleSave(postId);
      
      // Update the local state after the action
      setIsSaved(!isSaved);
    } catch (error) {
      console.error("Error handling save:", error);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="flex items-center gap-2"
      onClick={onSaveClick}
      title={isSaved ? "Unsave" : "Save"}
    >
      <Bookmark className={`h-4 w-4 ${isSaved ? "fill-primary text-primary" : ""}`} />
      Save
    </Button>
  );
};
