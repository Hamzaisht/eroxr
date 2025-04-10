
import { supabase } from "@/integrations/supabase/client";

/**
 * Get username for watermark display from a user ID
 */
export const getUsernameForWatermark = async (userId: string): Promise<string> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    
    return data?.username || userId.substring(0, 8);
  } catch (err) {
    console.error('Error fetching username for watermark:', err);
    // Return a shortened version of the ID as fallback
    return userId.substring(0, 8);
  }
};
