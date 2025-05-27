
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";
import { updateTrendingMetrics } from "@/utils/supabase/trending-helpers";

export const usePostActions = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleLike = useMutation({
    mutationFn: async ({ postId, isLiked }: { postId: string; isLiked: boolean }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      if (isLiked) {
        // Unlike
        const { error } = await supabase
          .from('post_likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);
        
        if (error) throw error;

        // Update post likes count by decrementing
        const { error: updateError } = await supabase
          .rpc('increment_counter', { 
            row_id: postId, 
            counter_name: 'likes_count',
            table_name: 'posts'
          });
        
        if (updateError) {
          // Fallback: manual decrement
          const { data: currentPost } = await supabase
            .from('posts')
            .select('likes_count')
            .eq('id', postId)
            .single();
          
          if (currentPost) {
            await supabase
              .from('posts')
              .update({ likes_count: Math.max(0, (currentPost.likes_count || 0) - 1) })
              .eq('id', postId);
          }
        }

        // Update trending metrics
        const { data: post } = await supabase
          .from('posts')
          .select('likes_count')
          .eq('id', postId)
          .single();
        
        if (post) {
          await updateTrendingMetrics(postId, { likes: post.likes_count || 0 });
        }
      } else {
        // Like
        const { error } = await supabase
          .from('post_likes')
          .insert({
            post_id: postId,
            user_id: user.id
          });
        
        if (error) throw error;

        // Update post likes count by incrementing
        const { error: updateError } = await supabase
          .rpc('increment_counter', { 
            row_id: postId, 
            counter_name: 'likes_count',
            table_name: 'posts'
          });
        
        if (updateError) {
          // Fallback: manual increment
          const { data: currentPost } = await supabase
            .from('posts')
            .select('likes_count')
            .eq('id', postId)
            .single();
          
          if (currentPost) {
            await supabase
              .from('posts')
              .update({ likes_count: (currentPost.likes_count || 0) + 1 })
              .eq('id', postId);
          }
        }

        // Update trending metrics
        const { data: post } = await supabase
          .from('posts')
          .select('likes_count')
          .eq('id', postId)
          .single();
        
        if (post) {
          await updateTrendingMetrics(postId, { likes: post.likes_count || 0 });
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['home-posts'] });
      queryClient.invalidateQueries({ queryKey: ['trending-posts'] });
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
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['home-posts'] });
      queryClient.invalidateQueries({ queryKey: ['trending-posts'] });
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
    isLiking: handleLike.isLoading,
    isDeleting: handleDelete.isLoading,
  };
};
