import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const usePostLikes = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleLike = async (postId: string, userId: string) => {
    try {
      // First check if post exists
      const { data: post, error: postError } = await supabase
        .from("posts")
        .select()
        .eq("id", postId)
        .maybeSingle();

      if (postError) {
        console.error("Post fetch error:", postError);
        throw postError;
      }
      
      if (!post) {
        toast({
          title: "Error",
          description: "This post no longer exists.",
          variant: "destructive",
        });
        return;
      }

      // Check if user has already liked the post
      const { data: existingLike, error: existingLikeError } = await supabase
        .from("post_likes")
        .select()
        .eq("post_id", postId)
        .eq("user_id", userId)
        .maybeSingle();

      if (existingLikeError) {
        console.error("Existing like check error:", existingLikeError);
        throw existingLikeError;
      }

      if (existingLike) {
        // Unlike the post
        const { error: deleteError } = await supabase
          .from("post_likes")
          .delete()
          .eq("post_id", postId)
          .eq("user_id", userId);

        if (deleteError) {
          console.error("Delete like error:", deleteError);
          throw deleteError;
        }
      } else {
        // Like the post
        const { error: insertError } = await supabase
          .from("post_likes")
          .insert([{ post_id: postId, user_id: userId }]);

        if (insertError) {
          console.error("Insert like error:", insertError);
          throw insertError;
        }
      }

      // Invalidate posts query to refresh the UI
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      
    } catch (error) {
      console.error("Like action error:", error);
      toast({
        title: "Error",
        description: "Failed to update like status. Please try again.",
        variant: "destructive",
      });
    }
  };

  return { handleLike };
};