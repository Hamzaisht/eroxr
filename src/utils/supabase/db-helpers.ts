
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types/database.types";

export async function createPost(
  post: Database['public']['Tables']['posts']['Insert'],
  options?: { withMetadata?: boolean },
  errorCallback?: (error: any) => void
) {
  try {
    // Create post - database triggers automatically handle trending_content
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
 * Updates a user's profile status using RPC bypass function to avoid RLS issues
 * @param userId The user ID whose profile status to update
 * @param status The new status value
 * @returns Result object with data and error
 */
export async function updateProfileStatus(
  userId: string, 
  status: Database['public']['Tables']['profiles']['Row']['status']
): Promise<{ data: any; error: any }> {
  try {
    console.log('🔧 updateProfileStatus: Using RPC bypass function for status update');
    
    // Use the RPC bypass function to avoid RLS recursion issues
    const { error } = await supabase.rpc('update_profile_bypass_rls', {
      p_user_id: userId,
      p_status: status
    });
    
    if (error) {
      console.error('❌ updateProfileStatus: RPC bypass function error:', error);
      throw error;
    }
    
    console.log('✅ updateProfileStatus: Profile status updated successfully via RPC bypass');
    
    return { data: { status }, error: null };
  } catch (error) {
    console.error('💥 updateProfileStatus: Profile status update error:', error);
    return { data: null, error };
  }
}
