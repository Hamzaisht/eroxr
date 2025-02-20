
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const usePostActions = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleDelete = async (postId: string, creatorId: string) => {
    try {
      // First, delete any associated media files from storage
      const { data: post } = await supabase
        .from('posts')
        .select('media_url, video_urls')
        .eq('id', postId)
        .single();

      if (post) {
        // Delete media files from storage if they exist
        if (post.media_url?.length) {
          const mediaUrls = post.media_url.map(url => {
            const [bucket, ...pathParts] = url.split('/');
            return pathParts.join('/');
          });
          await Promise.all(
            mediaUrls.map(path => supabase.storage.from('media').remove([path]))
          );
        }

        if (post.video_urls?.length) {
          const videoUrls = post.video_urls.map(url => {
            const [bucket, ...pathParts] = url.split('/');
            return pathParts.join('/');
          });
          await Promise.all(
            videoUrls.map(path => supabase.storage.from('videos').remove([path]))
          );
        }
      }

      // Now delete the post record
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId)
        .eq('creator_id', creatorId);

      if (error) throw error;

      // Invalidate and refetch all relevant queries
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['posts'] }),
        queryClient.invalidateQueries({ queryKey: ['posts', 'feed'] }),
        queryClient.invalidateQueries({ queryKey: ['posts', 'trending'] }),
        queryClient.invalidateQueries({ queryKey: ['profile-media'] }),
        queryClient.invalidateQueries({ queryKey: ['eros'] }),
        queryClient.invalidateQueries({ queryKey: ['eroboard'] })
      ]);
      
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
      const { data: existingLike, error: checkError } = await supabase
        .from('post_likes')
        .select()
        .eq('post_id', postId)
        .maybeSingle();

      if (checkError) throw checkError;

      if (existingLike) {
        const { error: unlikeError } = await supabase
          .from('post_likes')
          .delete()
          .eq('post_id', postId);

        if (unlikeError) throw unlikeError;

        toast({
          title: "Unliked",
          description: "Post removed from your likes",
        });
      } else {
        const { error: likeError } = await supabase
          .from('post_likes')
          .insert([{ post_id: postId }]);

        if (likeError) throw likeError;

        toast({
          title: "Liked!",
          description: "Post added to your likes",
        });
      }

      await queryClient.invalidateQueries({ queryKey: ['posts'] });
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
