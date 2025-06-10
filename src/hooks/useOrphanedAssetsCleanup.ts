
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useOrphanedAssetsCleanup = () => {
  const { toast } = useToast();

  const cleanupOrphanedAssets = useCallback(async (userId: string) => {
    console.log('Cleanup - Starting orphaned assets cleanup for user:', userId);
    
    try {
      // Find assets that are orphaned (no post_id) and older than 1 hour
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
      
      const { data: orphanedAssets, error: findError } = await supabase
        .from('media_assets')
        .select('id, storage_path, created_at')
        .eq('user_id', userId)
        .is('post_id', null)
        .lt('created_at', oneHourAgo);

      if (findError) {
        console.error('Cleanup - Error finding orphaned assets:', findError);
        return;
      }

      if (!orphanedAssets || orphanedAssets.length === 0) {
        console.log('Cleanup - No orphaned assets found for cleanup');
        return;
      }

      console.log('Cleanup - Found orphaned assets to cleanup:', orphanedAssets);

      // Delete the orphaned assets from the database
      const { error: deleteError } = await supabase
        .from('media_assets')
        .delete()
        .in('id', orphanedAssets.map(asset => asset.id));

      if (deleteError) {
        console.error('Cleanup - Error deleting orphaned assets:', deleteError);
        return;
      }

      // TODO: Also delete files from storage bucket if needed
      // This would require additional storage API calls

      console.log(`Cleanup - Successfully cleaned up ${orphanedAssets.length} orphaned assets`);
      
      if (orphanedAssets.length > 0) {
        toast({
          title: "Cleanup Complete",
          description: `Removed ${orphanedAssets.length} orphaned media files`,
        });
      }

    } catch (error) {
      console.error('Cleanup - Unexpected error during cleanup:', error);
    }
  }, [toast]);

  const linkOrphanedAssetsToPost = useCallback(async (postId: string, assetIds: string[], userId: string) => {
    console.log('Cleanup - Linking orphaned assets to post:', { postId, assetIds, userId });
    
    try {
      const { data: linkedAssets, error: linkError } = await supabase
        .from('media_assets')
        .update({ post_id: postId })
        .in('id', assetIds)
        .eq('user_id', userId)
        .is('post_id', null)
        .select();

      if (linkError) {
        console.error('Cleanup - Error linking assets to post:', linkError);
        throw linkError;
      }

      console.log('Cleanup - Successfully linked assets:', linkedAssets);
      return linkedAssets;

    } catch (error) {
      console.error('Cleanup - Failed to link orphaned assets:', error);
      throw error;
    }
  }, []);

  return {
    cleanupOrphanedAssets,
    linkOrphanedAssetsToPost
  };
};
