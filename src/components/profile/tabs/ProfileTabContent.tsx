
import { ProfileForm } from "../ProfileForm";
import type { Profile } from "@/integrations/supabase/types/profile";

interface ProfileTabContentProps {
  profile: Profile;
  onSuccess: () => void;
}

export const ProfileTabContent = ({ profile, onSuccess }: ProfileTabContentProps) => {
  return (
    <div className="w-full max-w-2xl mx-auto py-6">
      <ProfileForm profile={profile} onSuccess={onSuccess} />
    </div>
  );
};
