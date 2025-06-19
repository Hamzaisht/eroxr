
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { safeProfileUpdate, safeProfileFetch } from '@/components/studio/SafeProfileOperations';
import type { StudioProfile } from '@/components/studio/types';

export const useStudioProfile = (profileId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['studio-profile', profileId],
    queryFn: async () => {
      console.log('🎨 useStudioProfile: Fetching profile for ID:', profileId);
      
      // Use the safe profile fetch operation
      const result = await safeProfileFetch(profileId);
      
      if (!result.success) {
        console.error('❌ useStudioProfile: Profile fetch failed:', result.error);
        throw new Error(result.error || 'Failed to fetch profile');
      }
      
      console.log('✅ useStudioProfile: Profile fetched successfully');
      return result.data as StudioProfile;
    },
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    enabled: !!profileId,
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (updates: Partial<StudioProfile>) => {
      console.log('🎨 useStudioProfile: Updating profile with:', updates);
      
      // Use the safe profile update operation
      const result = await safeProfileUpdate({
        userId: profileId,
        ...updates
      });
      
      if (!result.success) {
        console.error('❌ useStudioProfile: Profile update failed:', result.error);
        throw new Error(result.error || 'Failed to update profile');
      }
      
      console.log('✅ useStudioProfile: Profile updated successfully');
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studio-profile', profileId] });
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully!",
      });
    },
    onError: (error: any) => {
      console.error('💥 useStudioProfile: Profile update failed:', error);
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update profile. Please try again.",
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
