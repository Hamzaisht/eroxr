
import { supabase } from '@/integrations/supabase/client';

export const useWatermarkService = () => {
  /**
   * Gets a username for watermarking videos
   */
  const getUsernameForWatermark = async (userId: string): Promise<string> => {
    try {
      // Query the profiles table to get the username
      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', userId)
        .single();

      if (error) throw error;
      
      return data?.username || 'eroxr';
    } catch (error) {
      console.error("Error fetching watermark username:", error);
      return 'eroxr'; // Default fallback
    }
  };

  return {
    getUsernameForWatermark
  };
};
