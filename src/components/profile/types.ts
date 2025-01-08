import type { Profile as SupabaseProfile } from "@/integrations/supabase/types/profile";
import type { AvailabilityStatus } from "@/components/ui/availability-indicator";
import { z } from "zod";

export type Profile = SupabaseProfile;

export interface ProfileHeaderProps {
  profile: Profile;
  isOwnProfile: boolean;
  isEditing?: boolean;
  setIsEditing?: (value: boolean) => void;
}

export const profileSchema = z.object({
  username: z.string().min(3).max(50),
  bio: z.string().max(500).optional(),
  location: z.string().max(100).optional(),
  interests: z.string().optional(),
  profile_visibility: z.boolean().default(true),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;