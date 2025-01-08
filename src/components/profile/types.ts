import type { Profile as SupabaseProfile } from "@/integrations/supabase/types/profile";
import { z } from "zod";

export type Profile = SupabaseProfile;

export interface ProfileHeaderProps {
  profile: Profile;
  isOwnProfile: boolean;
  isEditing?: boolean;
  setIsEditing?: (value: boolean) => void;
  availability?: string;
  showAvatarPreview?: boolean;
  showBannerPreview?: boolean;
  setShowAvatarPreview?: (value: boolean) => void;
  setShowBannerPreview?: (value: boolean) => void;
  setAvailability?: (value: string) => void;
  handleSave?: () => void;
  handleClose?: () => void;
  onGoLive?: () => void;
}

export const profileSchema = z.object({
  username: z.string().min(3).max(50),
  bio: z.string().max(500).optional(),
  location: z.string().max(100).optional(),
  interests: z.string().optional(),
  profile_visibility: z.boolean().default(true),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;