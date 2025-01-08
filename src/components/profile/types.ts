import type { Profile } from "@/integrations/supabase/types";

export interface ProfileHeaderProps {
  profile: Profile;
  isOwnProfile: boolean;
  isEditing?: boolean;
  setIsEditing?: (value: boolean) => void;
}