import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const usePostActions = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleLike = async (postId: string, userId?: string) => {
    if (!userId) {
      toast({
        title: "Authentication required",
        description: "Please log in to like posts.",
        duration: 3000,
      });
      return;
    }

    try {
      const { error: existingLikeError, data: existingLike } = await supabase
        .from("post_likes")
        .select()
        .eq("post_id", postId)
        .eq("user_id", userId)
        .maybeSingle();

      if (existingLikeError) throw existingLikeError;

      if (existingLike) {
        const { error: deleteError } = await supabase
          .from("post_likes")
          .delete()
          .eq("post_id", postId)
          .eq("user_id", userId);

        if (deleteError) throw deleteError;
      } else {
        const { error: insertError } = await supabase
          .from("post_likes")
          .insert([{ post_id: postId, user_id: userId }]);

        if (insertError) throw insertError;
      }

      queryClient.invalidateQueries({ queryKey: ["posts"] });
      
      toast({
        title: existingLike ? "Post unliked" : "Post liked",
        description: existingLike ? "You have unliked this post" : "You have liked this post",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to like post. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (postId: string, creatorId: string, userId?: string) => {
    if (!userId || userId !== creatorId) {
      toast({
        title: "Unauthorized",
        description: "You can only delete your own posts.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("posts")
        .delete()
        .eq("id", postId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["posts"] });
      
      toast({
        title: "Post deleted",
        description: "Your post has been successfully deleted.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete post. Please try again.",
        variant: "destructive",
      });
    }
  };

  return { handleLike, handleDelete };
};