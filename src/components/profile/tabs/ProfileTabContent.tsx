
import { ProfileEditForm } from "../edit/ProfileEditForm";
import type { Profile } from "@/integrations/supabase/types/profile";

interface ProfileTabContentProps {
  profile: Profile;
  onSuccess: () => void;
}

export const ProfileTabContent = ({ profile, onSuccess }: ProfileTabContentProps) => {
  return (
    <div className="w-full max-w-2xl mx-auto py-6">
      <ProfileEditForm 
        profile={profile} 
        onSuccess={onSuccess}
        onCancel={() => {}} // This component doesn't need cancel functionality in tab context
      />
    </div>
  );
};
