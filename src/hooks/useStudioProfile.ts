
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { StudioProfile } from '@/components/studio/types';

export const useStudioProfile = (profileId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['studio-profile', profileId],
    queryFn: async () => {
      console.log('🎨 Studio: Fetching profile for ID:', profileId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', profileId)
        .single();
      
      if (error) {
        console.error('❌ Studio: Profile fetch error:', error);
        throw error;
      }
      
      console.log('✅ Studio: Profile fetched successfully:', data);
      return data as StudioProfile;
    },
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (updates: Partial<StudioProfile>) => {
      console.log('🎨 Studio: Updating profile with:', updates);
      
      // Try using the RPC function first, fallback to direct update
      try {
        const { error } = await supabase.rpc('studio_update_profile', {
          p_username: updates.username || null,
          p_bio: updates.bio || null,
          p_location: updates.location || null,
          p_avatar_url: updates.avatar_url || null,
          p_banner_url: updates.banner_url || null,
          p_interests: updates.interests || null,
        });

        if (error) throw error;
      } catch (rpcError) {
        console.warn('⚠️ Studio: RPC update failed, trying direct update:', rpcError);
        
        // Fallback to direct update
        const { error } = await supabase
          .from('profiles')
          .update({
            username: updates.username,
            bio: updates.bio,
            location: updates.location,
            avatar_url: updates.avatar_url,
            banner_url: updates.banner_url,
            interests: updates.interests,
            updated_at: new Date().toISOString(),
          })
          .eq('id', profileId);

        if (error) {
          console.error('❌ Studio: Direct update error:', error);
          throw error;
        }
      }

      console.log('✅ Studio: Profile updated successfully');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studio-profile', profileId] });
      toast({
        title: "Studio Profile Updated",
        description: "Your profile has been updated successfully!",
      });
    },
    onError: (error: any) => {
      console.error('💥 Studio: Profile update failed:', error);
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    },
  });

  return {
    profile,
    isLoading,
    error,
    updateProfile: updateProfileMutation.mutate,
    isUpdating: updateProfileMutation.isLoading,
  };
};
