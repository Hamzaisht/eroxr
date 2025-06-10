
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";
import { useAuth } from "@/contexts/AuthContext";

export const usePostActions = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  const handleLike = useMutation({
    mutationFn: async (postId: string) => {
      if (!user) throw new Error("User not authenticated");

      // Check if user already liked this post
      const { data: existingLike, error: checkError } = await supabase
        .from('post_likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (checkError) throw checkError;

      if (existingLike) {
        // Unlike - remove from post_likes
        const { error } = await supabase
          .from('post_likes')
          .delete()
          .eq('id', existingLike.id);
        
        if (error) throw error;
        return { action: 'unliked' };
      } else {
        // Like - add to post_likes  
        const { error } = await supabase
          .from('post_likes')
          .insert({
            post_id: postId,
            user_id: user.id
          });
        
        if (error) throw error;
        return { action: 'liked' };
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['home-posts'] });
      queryClient.invalidateQueries({ queryKey: ['trending-posts'] });
      queryClient.invalidateQueries({ queryKey: ['trending-creators'] });
      
      toast({
        title: data.action === 'liked' ? "Liked!" : "Unliked",
        description: data.action === 'liked' ? "You liked this post" : "You removed your like",
      });
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
      if (!user) throw new Error("User not authenticated");

      // First verify the user owns this post
      const { data: post, error: fetchError } = await supabase
        .from('posts')
        .select('creator_id')
        .eq('id', postId)
        .single();

      if (fetchError) throw fetchError;
      if (post.creator_id !== user.id) {
        throw new Error("You can only delete your own posts");
      }

      // Delete the post - triggers will handle cleanup
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
  const likePost = (postId: string) => {
    handleLike.mutate(postId);
  };

  const deletePost = (postId: string) => {
    handleDelete.mutate(postId);
  };

  return {
    handleLike: likePost,
    handleDelete: deletePost,
    isLiking: handleLike.isLoading,
    isDeleting: handleDelete.isLoading,
  };
};
