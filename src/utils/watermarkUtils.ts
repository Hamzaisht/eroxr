
import { supabase } from "@/integrations/supabase/client";

export const getUsernameForWatermark = async (userId: string): Promise<string> => {
  try {
    // First check if userId might actually be a username (in some legacy cases)
    if (userId.length < 20 && !userId.includes('-')) {
      console.log('Using userId as username since it appears to be a username already:', userId);
      return userId;
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching username:', error);
      // Fall back to a safer default that isn't a user ID
      return 'eroxr-user';
    }
    
    if (!data?.username) {
      console.warn('Username not found for user ID:', userId);
      // Fall back to a safer default that isn't a user ID
      return 'eroxr-user';
    }
    
    console.log('Successfully fetched username:', data.username);
    return data.username;
  } catch (error) {
    console.error('Unexpected error fetching username for watermark:', error);
    // Fall back to a safer default that isn't a user ID
    return 'eroxr-user';
  }
};
