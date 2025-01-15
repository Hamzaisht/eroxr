import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const usePostActions = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleDelete = async (postId: string) => {
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['posts'] });
      
      toast({
        title: "Success",
        description: "Post deleted successfully",
      });
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Error",
        description: "Failed to delete post",
        variant: "destructive",
      });
    }
  };

  const handleLike = async (postId: string) => {
    try {
      const { data: existingLike } = await supabase
        .from('post_likes')
        .select()
        .eq('post_id', postId)
        .maybeSingle();

      if (existingLike) {
        await supabase
          .from('post_likes')
          .delete()
          .eq('post_id', postId);

        toast({
          title: "Unliked",
          description: "Post removed from your likes",
        });
      } else {
        await supabase
          .from('post_likes')
          .insert([{ post_id: postId }]);

        toast({
          title: "Liked!",
          description: "Post added to your likes",
        });
      }

      queryClient.invalidateQueries({ queryKey: ['posts'] });
    } catch (error) {
      console.error('Like error:', error);
      toast({
        title: "Error",
        description: "Failed to update like status",
        variant: "destructive",
      });
    }
  };

  return {
    handleDelete,
    handleLike,
  };
};