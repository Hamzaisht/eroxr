
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface SimpleProfile {
  id: string;
  username: string | null;
  bio: string | null;
  location: string | null;
  avatar_url: string | null;
  banner_url: string | null;
  interests: string[] | null;
  created_at: string;
}

export const useSimpleProfile = (profileId: string) => {
  const [profile, setProfile] = useState<SimpleProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      console.log('🎯 SimpleProfile: Fetching profile with optimized RLS for:', profileId);
      
      // Use optimized RLS policies - they handle security automatically
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('id, username, bio, location, avatar_url, banner_url, interests, created_at')
        .eq('id', profileId)
        .single();

      if (fetchError) {
        console.error('❌ SimpleProfile: Fetch failed with optimized RLS:', fetchError);
        setError(fetchError.message || 'Profile not found');
        setProfile(null);
        return;
      }

      console.log('✅ SimpleProfile: Profile fetched successfully via optimized RLS');
      setProfile(data as SimpleProfile);
      setError(null);
    } catch (err: any) {
      console.error('💥 SimpleProfile: Critical error:', err);
      setError(err.message);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<SimpleProfile>) => {
    try {
      console.log('🎯 SimpleProfile: Updating profile via optimized service with:', updates);
      
      // Use the new optimized profile update service
      const { data: result, error: rpcError } = await supabase.rpc('update_profile_service', {
        p_user_id: profileId,
        p_username: updates.username || null,
        p_bio: updates.bio || null,
        p_location: updates.location || null,
        p_avatar_url: updates.avatar_url || null,
        p_banner_url: updates.banner_url || null,
      });

      if (rpcError || !result?.success) {
        console.error('❌ SimpleProfile: Update failed via optimized service:', rpcError || result?.error);
        throw new Error(rpcError?.message || result?.error || 'Update failed');
      }

      console.log('✅ SimpleProfile: Profile updated successfully via optimized service');
      setProfile(prev => prev ? { ...prev, ...updates } : null);
      return true;
    } catch (err: any) {
      console.error('💥 SimpleProfile: Update error:', err);
      throw err;
    }
  };

  useEffect(() => {
    if (profileId) {
      fetchProfile();
    }
  }, [profileId]);

  return { profile, loading, error, updateProfile, refetch: fetchProfile };
};
