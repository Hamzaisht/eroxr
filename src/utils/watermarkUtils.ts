
import { supabase } from "@/integrations/supabase/client";

export const getUsernameForWatermark = async (userId: string): Promise<string> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', userId)
      .single();
    
    if (error || !data?.username) {
      console.warn('Could not fetch username, using default', error);
      return userId.slice(0, 8); // Use first 8 characters of user ID if username not found
    }
    
    return data.username;
  } catch (error) {
    console.error('Error fetching username for watermark:', error);
    return userId.slice(0, 8);
  }
};
