
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { UsernameField } from "./form-fields/UsernameField";
import { BioField } from "./form-fields/BioField";
import { LocationField } from "./form-fields/LocationField";
import { InterestsField } from "./form-fields/InterestsField";
import { VisibilityField } from "./form-fields/VisibilityField";
import { profileSchema, type ProfileFormValues } from "./types";
import type { Profile } from "@/integrations/supabase/types/profile";
import { useQueryClient } from "@tanstack/react-query";

interface ProfileFormProps {
  profile?: Profile | null;
  onSuccess?: () => void;
}

export const ProfileForm = ({ profile, onSuccess }: ProfileFormProps) => {
  const { toast } = useToast();
  const session = useSession();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [canChangeUsername, setCanChangeUsername] = useState(true);
  const [lastUsernameChange, setLastUsernameChange] = useState<string | null>(null);
  const [currentUsername, setCurrentUsername] = useState("");

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: "",
      bio: "",
      location: "",
      interests: [],
      profile_visibility: true,
    },
  });

  useEffect(() => {
    if (profile) {
      console.log("Setting form values with profile:", profile);
      setCurrentUsername(profile.username || "");
      form.reset({
        username: profile.username || "",
        bio: profile.bio || "",
        location: profile.location || "",
        interests: profile.interests || [],
        profile_visibility: profile.profile_visibility ?? true,
      });

      const lastChange = profile.last_username_change;
      setLastUsernameChange(lastChange);
      if (lastChange) {
        const daysSinceChange = Math.floor(
          (Date.now() - new Date(lastChange).getTime()) / (1000 * 60 * 60 * 24)
        );
        setCanChangeUsername(daysSinceChange >= 60);
      }
    }
  }, [profile, form]);

  const onSubmit = async (values: ProfileFormValues) => {
    if (!session?.user?.id) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "Please sign in to update your profile",
      });
      return;
    }

    setIsLoading(true);
    console.log("Submitting form values:", values);

    try {
      console.log('🔧 ProfileForm: Using RPC bypass function for profile update');
      
      // Use the RPC bypass function for profile updates to avoid RLS issues
      const { error } = await supabase.rpc('update_profile_bypass_rls', {
        p_user_id: session.user.id,
        p_username: values.username || null,
        p_bio: values.bio || null,
        p_location: values.location || null,
        p_interests: values.interests || null,
        p_profile_visibility: values.profile_visibility
      });

      if (error) {
        console.error('❌ ProfileForm: RPC function error:', error);
        throw error;
      }

      console.log('✅ ProfileForm: Profile updated successfully');

      await queryClient.invalidateQueries({ queryKey: ["profile"] });
      await queryClient.invalidateQueries({ queryKey: ["profileStats"] });

      toast({
        title: "Success",
        description: "Your profile has been updated.",
      });
      
      onSuccess?.();
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update profile. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <UsernameField
          value={form.watch('username')}
          onChange={(value) => form.setValue('username', value)}
          isLoading={isLoading}
          canChangeUsername={canChangeUsername}
          currentUsername={currentUsername}
          lastUsernameChange={lastUsernameChange}
        />
        <BioField
          value={form.watch('bio')}
          onChange={(value) => form.setValue('bio', value)}
        />
        <LocationField
          value={form.watch('location')}
          onChange={(value) => form.setValue('location', value)}
        />
        <InterestsField
          value={form.watch('interests')}
          onChange={(value) => form.setValue('interests', value)}
        />
        <VisibilityField
          value={form.watch('profile_visibility') ? 'public' : 'private'}
          onChange={(value) => form.setValue('profile_visibility', value === 'public')}
        />

        <div className="flex gap-4 justify-end">
          <Button 
            type="submit" 
            disabled={isLoading}
            className="bg-luxury-primary hover:bg-luxury-primary/90"
          >
            {isLoading ? "Updating..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
