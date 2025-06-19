
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
 * Updates a user's profile status using ONLY the RLS-bypass function - no fallbacks
 * @param userId The user ID whose profile status to update
 * @param status The new status value
 * @returns Result object with data and error
 */
export async function updateProfileStatus(
  userId: string, 
  status: Database['public']['Tables']['profiles']['Row']['status']
): Promise<{ data: any; error: any }> {
  try {
    console.log('🔒 updateProfileStatus: Using RLS-bypass function for status update');
    
    // Use ONLY the RLS-bypass function - crystal clear execution path
    const { data: result, error: rpcError } = await supabase.rpc('rls_bypass_profile_update', {
      p_user_id: userId,
      p_username: null,
      p_bio: null,
      p_location: null,
      p_avatar_url: null,
      p_banner_url: null,
      p_interests: null,
      p_profile_visibility: null,
      p_status: status,
    });
    
    if (rpcError || !result?.success) {
      console.error('❌ updateProfileStatus: RLS-bypass function error:', rpcError || result?.error);
      throw new Error(rpcError?.message || result?.error || 'Profile status update failed');
    }
    
    console.log('✅ updateProfileStatus: Profile status updated successfully via RLS-bypass');
    
    return { data: { status }, error: null };
  } catch (error) {
    console.error('💥 updateProfileStatus: Profile status update error:', error);
    return { data: null, error };
  }
}
