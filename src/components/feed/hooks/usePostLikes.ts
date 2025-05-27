
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";

export const usePostLikes = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const session = useSession();

  const handleLike = async (postId: string) => {
    if (!session?.user?.id) {
      toast({
        title: "Authentication required",
        description: "Please log in to like posts.",
        variant: "destructive",
      });
      return;
    }

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
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (existingLikeError) {
        console.error("Existing like check error:", existingLikeError);
        throw existingLikeError;
      }

      if (existingLike) {
        // Unlike the post - database triggers will handle everything
        const { error: deleteError } = await supabase
          .from("post_likes")
          .delete()
          .eq("post_id", postId)
          .eq("user_id", session.user.id);

        if (deleteError) {
          console.error("Delete like error:", deleteError);
          throw deleteError;
        }
      } else {
        // Like the post - database triggers will handle everything
        const { error: insertError } = await supabase
          .from("post_likes")
          .insert([{ post_id: postId, user_id: session.user.id }]);

        if (insertError) {
          console.error("Insert like error:", insertError);
          throw insertError;
        }
      }

      // Database triggers automatically:
      // - Update posts.likes_count
      // - Update trending_content.likes and score
      // - Maintain data consistency

      // Invalidate posts query to refresh the UI
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["trending-posts"] });
      
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
