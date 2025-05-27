
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";
import { updateTrendingMetrics } from "@/utils/supabase/trending-helpers";

export const usePostActions = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleLike = useMutation({
    mutationFn: async ({ postId, isLiked }: { postId: string; isLiked: boolean }) => {
      if (isLiked) {
        // Unlike
        const { error } = await supabase
          .from('post_likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', (await supabase.auth.getUser()).data.user?.id);
        
        if (error) throw error;

        // Update post likes count
        const { error: updateError } = await supabase
          .from('posts')
          .update({ likes_count: supabase.sql`likes_count - 1` })
          .eq('id', postId);
        
        if (updateError) throw updateError;

        // Update trending metrics
        const { data: post } = await supabase
          .from('posts')
          .select('likes_count')
          .eq('id', postId)
          .single();
        
        if (post) {
          await updateTrendingMetrics(postId, { likes: post.likes_count });
        }
      } else {
        // Like
        const { error } = await supabase
          .from('post_likes')
          .insert({
            post_id: postId,
            user_id: (await supabase.auth.getUser()).data.user?.id
          });
        
        if (error) throw error;

        // Update post likes count
        const { error: updateError } = await supabase
          .from('posts')
          .update({ likes_count: supabase.sql`likes_count + 1` })
          .eq('id', postId);
        
        if (updateError) throw updateError;

        // Update trending metrics
        const { data: post } = await supabase
          .from('posts')
          .select('likes_count')
          .eq('id', postId)
          .single();
        
        if (post) {
          await updateTrendingMetrics(postId, { likes: post.likes_count });
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['home-posts'] });
      queryClient.invalidateQueries({ queryKey: ['trending-posts'] });
    },
    onError: (error) => {
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
      toast({
        title: "Error",
        description: "Failed to delete post",
        variant: "destructive",
      });
    },
  });

  return {
    handleLike: handleLike.mutate,
    handleDelete: handleDelete.mutate,
    isLiking: handleLike.isPending,
    isDeleting: handleDelete.isPending,
  };
};
