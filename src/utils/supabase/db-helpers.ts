
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types/database.types";

export async function createPost(
  post: Database['public']['Tables']['posts']['Insert'],
  options?: { withMetadata?: boolean },
  errorCallback?: (error: any) => void
) {
  try {
    // Simple post creation without any trending content operations
    const { data, error } = await supabase
      .from('posts')
      .insert(post)
      .select('id')
      .single();
      
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error('Error creating post:', error);
    if (errorCallback) {
      errorCallback(error);
    }
    return { data: null, error };
  }
}

/**
 * Updates a user's profile status
 * @param userId The user ID whose profile status to update
 * @param status The new status value
 * @returns Result object with data and error
 */
export async function updateProfileStatus(
  userId: string, 
  status: Database['public']['Tables']['profiles']['Row']['status']
): Promise<{ data: any; error: any }> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({ status })
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error('Error updating profile status:', error);
    return { data: null, error };
  }
}
