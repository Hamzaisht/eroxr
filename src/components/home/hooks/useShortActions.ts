
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useSoundEffects } from "@/hooks/use-sound-effects";

export const useShortActions = () => {
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
        // Unsave
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
        // Save
        const { error: saveError } = await supabase
          .from("post_saves")
          .insert([{ post_id: shortId, user_id: session.user.id }]);

        if (saveError) throw saveError;

        toast({
          title: "Video saved",
          description: "Video added to your saved items",
        });
      }

      // Invalidate query to refresh data
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    } catch (error) {
      console.error("Error handling save:", error);
      toast({
        title: "Action failed",
        description: "Failed to save/unsave the video",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (shortId: string) => {
    if (!session?.user?.id) {
      toast({
        title: "Sign in required",
        description: "Please sign in to delete this video",
        variant: "destructive",
      });
      return;
    }

    try {
      // Get the post to check creator_id and video URL
      const { data: post, error: postError } = await supabase
        .from("posts")
        .select("creator_id, video_urls")
        .eq("id", shortId)
        .single();

      if (postError) throw postError;

      // Check if user is the creator
      if (post.creator_id !== session.user.id) {
        toast({
          title: "Permission denied",
          description: "You can only delete your own videos",
          variant: "destructive",
        });
        return;
      }

      // Delete the post
      const { error: deleteError } = await supabase
        .from("posts")
        .delete()
        .eq("id", shortId);

      if (deleteError) throw deleteError;

      // Try to delete the video file from storage (best effort)
      if (post.video_urls && post.video_urls.length > 0) {
        // Extract the path from URL
        const videoUrl = post.video_urls[0];
        const path = videoUrl.split("/").pop();
        
        if (path) {
          await supabase.storage
            .from("videos")
            .remove([`${session.user.id}/${path}`]);
        }
      }

      // Invalidate query to refresh data
      queryClient.invalidateQueries({ queryKey: ["posts"] });

      toast({
        title: "Video deleted",
        description: "Your video has been deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting video:", error);
      toast({
        title: "Delete failed",
        description: "Failed to delete the video",
        variant: "destructive",
      });
    }
  };

  return { handleLike, handleSave, handleDelete };
};
