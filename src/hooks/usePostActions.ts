
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";

export const usePostActions = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleLike = useMutation({
    mutationFn: async ({ postId, isLiked }: { postId: string; isLiked: boolean }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      if (isLiked) {
        // Unlike - remove from post_likes (trigger will handle everything else)
        const { error } = await supabase
          .from('post_likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);
        
        if (error) throw error;
      } else {
        // Like - add to post_likes (trigger will handle everything else)
        const { error } = await supabase
          .from('post_likes')
          .insert({
            post_id: postId,
            user_id: user.id
          });
        
        if (error) throw error;
      }

      // Database triggers automatically:
      // - Update posts.likes_count
      // - Update trending_content table
      // - Calculate new trending scores
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['home-posts'] });
      queryClient.invalidateQueries({ queryKey: ['trending-posts'] });
      queryClient.invalidateQueries({ queryKey: ['trending-creators'] });
    },
    onError: (error) => {
      console.error('Like error:', error);
      toast({
        title: "Error",
        description: "Failed to update like status",
        variant: "destructive",
      });
    },
  });

  const handleDelete = useMutation({
    mutationFn: async (postId: string) => {
      // Delete the post - triggers will handle trending_content cleanup
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['home-posts'] });
      queryClient.invalidateQueries({ queryKey: ['trending-posts'] });
      queryClient.invalidateQueries({ queryKey: ['trending-creators'] });
      toast({
        title: "Success",
        description: "Post deleted successfully",
      });
    },
    onError: (error) => {
      console.error('Delete error:', error);
      toast({
        title: "Error",
        description: "Failed to delete post",
        variant: "destructive",
      });
    },
  });

  // Create wrapper functions that match the expected signatures
  const likePost = (postId: string, isLiked?: boolean) => {
    handleLike.mutate({ postId, isLiked: isLiked || false });
  };

  const deletePost = (postId: string) => {
    handleDelete.mutate(postId);
  };

  return {
    handleLike: likePost,
    handleDelete: deletePost,
    isLiking: handleLike.isPending,
    isDeleting: handleDelete.isPending,
  };
};
