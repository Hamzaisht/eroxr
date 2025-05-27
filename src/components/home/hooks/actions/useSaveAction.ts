
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { ensureUserIdSet } from "@/utils/supabase/typeSafeOperations";

export const useSaveAction = () => {
  const session = useSession();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSave = async (shortId: string) => {
    if (!session?.user?.id) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save this video",
        variant: "destructive",
      });
      return;
    }

    try {
      // Ensure user ID is set for RLS optimization
      await ensureUserIdSet();
      
      // Check if already saved
      const { data: existingSave, error: checkError } = await supabase
        .from("post_saves")
        .select("id")
        .eq("post_id", shortId)
        .eq("user_id", session.user.id)
        .single();

      if (checkError && !checkError.message.includes("No rows found")) {
        throw checkError;
      }

      if (existingSave) {
        // Unsave - database triggers will handle trending_content updates
        const { error: unsaveError } = await supabase
          .from("post_saves")
          .delete()
          .eq("id", existingSave.id);

        if (unsaveError) throw unsaveError;

        toast({
          title: "Video removed",
          description: "Video removed from saved items",
        });
      } else {
        // Save - database triggers will handle trending_content updates
        const { error: saveError } = await supabase
          .from("post_saves")
          .insert([{ post_id: shortId, user_id: session.user.id }]);

        if (saveError) throw saveError;

        toast({
          title: "Video saved",
          description: "Video added to your saved items",
        });
      }

      // Database triggers automatically:
      // - Update trending_content.bookmarks and score
      // - Maintain data consistency

      // Invalidate query to refresh data
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["trending-posts"] });
    } catch (error) {
      console.error("Error handling save:", error);
      toast({
        title: "Action failed",
        description: "Failed to save/unsave the video",
        variant: "destructive",
      });
    }
  };

  return { handleSave };
};
