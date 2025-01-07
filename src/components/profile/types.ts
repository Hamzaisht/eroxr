import { z } from "zod";
import type { AvailabilityStatus } from "@/components/ui/availability-indicator";
import type { Profile as SupabaseProfile } from "@/integrations/supabase/types/profile";

// Profile form schema
export const profileSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be less than 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  location: z.string().optional(),
  interests: z.string().optional(),
  profile_visibility: z.boolean().default(true),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

// Extend the Supabase Profile type to ensure social_links is properly typed
export interface Profile extends Omit<SupabaseProfile, 'social_links'> {
  social_links?: Record<string, any> | null;
}

export interface ProfileHeaderProps {
  profile: Profile;
  isOwnProfile: boolean;
  isEditing: boolean;
  availability: AvailabilityStatus;
  showAvatarPreview: boolean;
  showBannerPreview: boolean;
  setShowAvatarPreview: (show: boolean) => void;
  setShowBannerPreview: (show: boolean) => void;
  setAvailability: (status: AvailabilityStatus) => void;
  handleSave: () => void;
  handleClose: () => void;
  setIsEditing: (editing: boolean) => void;
  onGoLive?: () => void;
}

export type { AvailabilityStatus };