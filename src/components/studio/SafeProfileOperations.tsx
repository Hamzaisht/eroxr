
import { supabase } from '@/integrations/supabase/client';

export interface SafeProfileUpdateParams {
  userId: string;
  username?: string;
  bio?: string;
  location?: string;
  avatar_url?: string;
  banner_url?: string;
}

export const safeProfileUpdate = async (params: SafeProfileUpdateParams) => {
  const { userId, ...updates } = params;
  
  try {
    console.log('🔒 SafeProfileOperations: Using optimized profile update service for:', userId);
    
    // Use the new optimized profile service function with SECURITY DEFINER
    const { data: result, error: rpcError } = await supabase.rpc('update_profile_service', {
      p_user_id: userId,
      p_username: updates.username || null,
      p_bio: updates.bio || null,
      p_location: updates.location || null,
      p_avatar_url: updates.avatar_url || null,
      p_banner_url: updates.banner_url || null,
    });

    if (!rpcError && result?.success) {
      console.log('✅ SafeProfileOperations: Profile updated successfully via optimized service');
      return { success: true, data: result.data, method: 'optimized_service' };
    }

    console.error('❌ SafeProfileOperations: Optimized service failed:', rpcError || result?.error);
    return { 
      success: false, 
      error: rpcError?.message || result?.error || 'Profile update failed', 
      method: 'service_failed' 
    };
    
  } catch (error: any) {
    console.error('💥 SafeProfileOperations: Critical error:', error);
    return { success: false, error: error.message, method: 'error' };
  }
};

export const safeProfileFetch = async (userId: string) => {
  try {
    console.log('🔍 SafeProfileOperations: Fetching profile with optimized RLS for:', userId);
    
    // Use direct query - optimized RLS policies handle security automatically
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (!error && data) {
      console.log('✅ SafeProfileOperations: Profile fetched successfully via optimized RLS');
      return { success: true, data, method: 'optimized_rls' };
    }

    console.error('❌ SafeProfileOperations: Profile fetch failed:', error);
    return { 
      success: false, 
      error: error?.message || 'Profile not found', 
      method: 'fetch_failed' 
    };
    
  } catch (error: any) {
    console.error('💥 SafeProfileOperations: Critical fetch error:', error);
    return { success: false, error: error.message, method: 'error' };
  }
};
