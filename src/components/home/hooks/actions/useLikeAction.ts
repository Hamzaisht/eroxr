
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useSoundEffects } from "@/hooks/use-sound-effects";
import { ensureUserIdSet } from "@/utils/supabase/typeSafeOperations";

export const useLikeAction = () => {
  const session = useSession();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { playLikeSound } = useSoundEffects();

  const handleLike = async (shortId: string) => {
    if (!session?.user?.id) {
      toast({
        title: "Sign in required",
        description: "Please sign in to like this video",
        variant: "destructive",
      });
      return;
    }

    try {
      // Ensure user ID is set for RLS optimization
      await ensureUserIdSet();
      
      // Check if already liked
      const { data: existingLike, error: checkError } = await supabase
        .from("post_likes")
        .select("id")
        .eq("post_id", shortId)
        .eq("user_id", session.user.id)
        .single();

      if (checkError && !checkError.message.includes("No rows found")) {
        throw checkError;
      }

      if (existingLike) {
        // Unlike
        const { error: unlikeError } = await supabase
          .from("post_likes")
          .delete()
          .eq("id", existingLike.id);

        if (unlikeError) throw unlikeError;

        // Decrement likes count
        const { error: updateError } = await supabase
          .from("posts")
          .update({ likes_count: supabase.rpc('decrement', { count: 1 }) })
          .eq("id", shortId);

        if (updateError) throw updateError;
      } else {
        // Like
        const { error: likeError } = await supabase
          .from("post_likes")
          .insert([{ post_id: shortId, user_id: session.user.id }]);

        if (likeError) throw likeError;

        // Increment likes count
        const { error: updateError } = await supabase
          .from("posts")
          .update({ likes_count: supabase.rpc('increment', { count: 1 }) })
          .eq("id", shortId);

        if (updateError) throw updateError;

        // Play sound effect
        playLikeSound();
      }

      // Invalidate query to refresh data
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    } catch (error) {
      console.error("Error handling like:", error);
      toast({
        title: "Action failed",
        description: "Failed to like/unlike the video",
        variant: "destructive",
      });
    }
  };

  return { handleLike };
};
