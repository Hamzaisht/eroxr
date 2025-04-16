
import type { Profile as SupabaseProfile } from "@/integrations/supabase/types/profile";
import type { AvailabilityStatus } from "@/utils/media/types";
import { z } from "zod";

export type Profile = SupabaseProfile;

export interface ProfileHeaderProps {
  profile: Profile;
  isOwnProfile: boolean;
  isEditing?: boolean;
  setIsEditing?: (value: boolean) => void;
  availability?: AvailabilityStatus;
}

export const profileSchema = z.object({
  username: z.string()
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username must be less than 50 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers and underscores"),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  location: z.string().max(100, "Location must be less than 100 characters").optional(),
  interests: z.string().optional(),
  profile_visibility: z.boolean().default(true),
  status: z.enum(['online', 'offline', 'away', 'busy']).optional(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
