
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { StudioProfile } from '@/components/studio/types';

const profileSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  location: z.string().max(100, 'Location must be less than 100 characters').optional(),
  interests: z.array(z.string()).optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileEditorProps {
  profile: StudioProfile;
  onUpdate: (updates: Partial<StudioProfile>) => void;
  isUpdating: boolean;
}

export const ProfileEditor = ({ profile, onUpdate, isUpdating }: ProfileEditorProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: profile.username || '',
      bio: profile.bio || '',
      location: profile.location || '',
      interests: profile.interests || [],
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    setIsSubmitting(true);
    try {
      console.log('🎨 ProfileEditor: Updating profile via RLS-bypass:', data);
      
      // Use ONLY the RLS-bypass function - crystal clear execution
      const { data: result, error: rpcError } = await supabase.rpc('rls_bypass_profile_update', {
        p_user_id: profile.id,
        p_username: data.username || null,
        p_bio: data.bio || null,
        p_location: data.location || null,
        p_avatar_url: null,
        p_banner_url: null,
        p_interests: data.interests || null,
        p_profile_visibility: null,
        p_status: null,
      });

      if (rpcError || !result?.success) {
        console.error('❌ ProfileEditor: RLS-bypass update failed:', rpcError || result?.error);
        throw new Error(rpcError?.message || result?.error || 'Failed to update profile');
      }

      console.log('✅ ProfileEditor: Profile updated successfully via RLS-bypass');
      
      onUpdate(data);
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully!",
      });
    } catch (error: any) {
      console.error('💥 ProfileEditor: Profile update error:', error);
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            {...register('username')}
            className="bg-slate-800/50 border-slate-700 text-slate-100"
            placeholder="Enter your username"
          />
          {errors.username && (
            <p className="text-red-400 text-sm mt-1">{errors.username.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            {...register('bio')}
            className="bg-slate-800/50 border-slate-700 text-slate-100 min-h-[100px]"
            placeholder="Tell us about yourself..."
          />
          {errors.bio && (
            <p className="text-red-400 text-sm mt-1">{errors.bio.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            {...register('location')}
            className="bg-slate-800/50 border-slate-700 text-slate-100"
            placeholder="Enter your location"
          />
          {errors.location && (
            <p className="text-red-400 text-sm mt-1">{errors.location.message}</p>
          )}
        </div>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting || isUpdating}
        className="w-full bg-gradient-to-r from-slate-600 to-gray-600 hover:from-slate-700 hover:to-gray-700"
      >
        {isSubmitting ? 'Updating...' : 'Update Profile'}
      </Button>
    </form>
  );
};
