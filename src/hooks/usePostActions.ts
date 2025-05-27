
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";

export const usePostActions = () => {
  const session = useSession();
  const { toast } = useToast();

  const handleLike = async (postId: string) => {
    if (!session?.user?.id) {
      toast({
        title: "Authentication required",
        description: "Please log in to like posts",
        variant: "destructive",
      });
      return;
    }

    try {
      // Check if already liked
      const { data: existingLike } = await supabase
        .from('post_likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', session.user.id)
        .single();

      if (existingLike) {
        // Remove like
        await supabase
          .from('post_likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', session.user.id);
        
        // Decrement count
        await supabase.rpc('increment_counter', {
          row_id: postId,
          counter_name: 'likes_count',
          table_name: 'posts'
        });
      } else {
        // Add like
        await supabase
          .from('post_likes')
          .insert({
            post_id: postId,
            user_id: session.user.id
          });
        
        // Increment count
        await supabase.rpc('increment_counter', {
          row_id: postId,
          counter_name: 'likes_count',
          table_name: 'posts'
        });
      }
    } catch (error) {
      console.error('Error handling like:', error);
      toast({
        title: "Error",
        description: "Failed to update like",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (postId: string, creatorId: string) => {
    if (!session?.user?.id || session.user.id !== creatorId) {
      toast({
        title: "Unauthorized",
        description: "You can only delete your own posts",
        variant: "destructive",
      });
      return;
    }

    try {
      await supabase
        .from('posts')
        .delete()
        .eq('id', postId);
      
      toast({
        title: "Success",
        description: "Post deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting post:', error);
      toast({
        title: "Error",
        description: "Failed to delete post",
        variant: "destructive",
      });
    }
  };

  return { handleLike, handleDelete };
};
