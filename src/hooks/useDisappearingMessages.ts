import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useDisappearingMessages = () => {
  useEffect(() => {
    // Check for expired messages every 30 seconds
    const interval = setInterval(async () => {
      try {
        // Mark expired snaps as expired
        await supabase
          .from('direct_messages')
          .update({ is_expired: true })
          .eq('message_type', 'snap')
          .lt('expires_at', new Date().toISOString())
          .eq('is_expired', false);

        // Delete media files for expired snaps that have been viewed
        const { data: expiredSnaps } = await supabase
          .from('direct_messages')
          .select('id, media_url')
          .eq('message_type', 'snap')
          .eq('is_expired', true)
          .not('viewed_at', 'is', null);

        if (expiredSnaps) {
          for (const snap of expiredSnaps) {
            if (snap.media_url && snap.media_url.length > 0) {
              // Extract file name from URL
              const url = snap.media_url[0];
              const fileName = url.split('/').pop();
              
              if (fileName) {
                // Delete from storage
                await supabase.storage
                  .from('messages')
                  .remove([fileName]);
                
                // Clear media_url from database
                await supabase
                  .from('direct_messages')
                  .update({ media_url: null })
                  .eq('id', snap.id);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error cleaning up expired messages:', error);
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);
};