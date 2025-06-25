
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  username: string | null;
  bio: string | null;
  location: string | null;
  avatar_url: string | null;
  banner_url: string | null;
  interests: string[] | null;
  created_at: string;
}

export const useProfile = (profileId: string) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      console.log('🎯 Profile: Fetching profile for:', profileId);
      
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('id, username, bio, location, avatar_url, banner_url, interests, created_at')
        .eq('id', profileId)
        .single();

      if (fetchError) {
        console.error('❌ Profile: Fetch failed:', fetchError);
        setError(fetchError.message || 'Profile not found');
        setProfile(null);
        return;
      }

      console.log('✅ Profile: Profile fetched successfully');
      setProfile(data as Profile);
      setError(null);
    } catch (err: any) {
      console.error('💥 Profile: Critical error:', err);
      setError(err.message);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    try {
      console.log('🎯 Profile: Updating profile with:', updates);
      
      const { data, error: updateError } = await supabase
        .from('profiles')
        .update({
          username: updates.username,
          bio: updates.bio,
          location: updates.location,
          avatar_url: updates.avatar_url,
          banner_url: updates.banner_url,
          interests: updates.interests,
          updated_at: new Date().toISOString()
        })
        .eq('id', profileId)
        .select()
        .single();

      if (updateError) {
        console.error('❌ Profile: Update failed:', updateError);
        throw new Error(updateError.message || 'Update failed');
      }

      console.log('✅ Profile: Profile updated successfully');
      setProfile(prev => prev ? { ...prev, ...updates } : null);
      return true;
    } catch (err: any) {
      console.error('💥 Profile: Update error:', err);
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
