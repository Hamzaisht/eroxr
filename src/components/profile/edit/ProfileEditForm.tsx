
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { User, FileText, MapPin } from "lucide-react";
import type { Profile } from "@/integrations/supabase/types/profile";

const profileEditSchema = z.object({
  username: z.string().min(1, "Username is required"),
  bio: z.string().max(500, "Bio must be 500 characters or less").optional(),
  location: z.string().max(100, "Location must be 100 characters or less").optional(),
});

type ProfileEditFormData = z.infer<typeof profileEditSchema>;

interface ProfileEditFormProps {
  profile: Profile;
  onSuccess: () => void;
  onCancel: () => void;
}

export const ProfileEditForm = ({ profile, onSuccess, onCancel }: ProfileEditFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<ProfileEditFormData>({
    resolver: zodResolver(profileEditSchema),
    defaultValues: {
      username: profile.username || "",
      bio: profile.bio || "",
      location: profile.location || "",
    },
  });

  const onSubmit = async (data: ProfileEditFormData) => {
    setIsLoading(true);
    console.log('🔧 ProfileEditForm: Starting profile update with new clean function');

    try {
      // Use the new clean RPC function
      const { error } = await supabase.rpc('update_user_profile', {
        p_username: data.username || null,
        p_bio: data.bio || null,
        p_location: data.location || null
      });

      if (error) {
        console.error('❌ ProfileEditForm: Clean RPC function error:', error);
        throw error;
      }

      console.log('✅ ProfileEditForm: Profile updated successfully with clean function');

      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });

      onSuccess();
    } catch (error: any) {
      console.error('💥 ProfileEditForm: Profile update error:', error);
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
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* Username Field */}
      <div className="space-y-2">
        <Label htmlFor="username" className="text-luxury-neutral flex items-center gap-2">
          <User className="w-4 h-4" />
          Username
        </Label>
        <Input
          id="username"
          {...form.register("username")}
          className="bg-luxury-darker/50 border-luxury-primary/20 text-luxury-neutral rounded-xl h-12"
          placeholder="Enter your username"
          disabled={isLoading}
        />
        {form.formState.errors.username && (
          <p className="text-red-400 text-sm">{form.formState.errors.username.message}</p>
        )}
      </div>

      {/* Bio Field */}
      <div className="space-y-2">
        <Label htmlFor="bio" className="text-luxury-neutral flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Bio
        </Label>
        <Textarea
          id="bio"
          {...form.register("bio")}
          className="bg-luxury-darker/50 border-luxury-primary/20 text-luxury-neutral min-h-[120px] rounded-xl"
          placeholder="Tell us about yourself..."
          maxLength={500}
          disabled={isLoading}
        />
        <div className="text-xs text-luxury-muted text-right">
          {form.watch("bio")?.length || 0}/500 characters
        </div>
        {form.formState.errors.bio && (
          <p className="text-red-400 text-sm">{form.formState.errors.bio.message}</p>
        )}
      </div>

      {/* Location Field */}
      <div className="space-y-2">
        <Label htmlFor="location" className="text-luxury-neutral flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          Location
        </Label>
        <Input
          id="location"
          {...form.register("location")}
          className="bg-luxury-darker/50 border-luxury-primary/20 text-luxury-neutral rounded-xl h-12"
          placeholder="Where are you located?"
          disabled={isLoading}
        />
        {form.formState.errors.location && (
          <p className="text-red-400 text-sm">{form.formState.errors.location.message}</p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
          className="border-luxury-primary/30 text-luxury-primary hover:bg-luxury-primary/10 px-6"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-gradient-to-r from-luxury-primary to-luxury-accent hover:from-luxury-primary/90 hover:to-luxury-accent/90 text-white px-6 font-semibold"
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
};
