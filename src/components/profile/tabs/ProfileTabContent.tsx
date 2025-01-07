import { ProfileForm } from "@/components/profile/ProfileForm";
import { ProfileTabs } from "@/components/profile/ProfileTabs";
import { CreatorsFeed } from "@/components/CreatorsFeed";

interface ProfileTabContentProps {
  profile: any;
  isEditing: boolean;
  onSave: () => void;
}

export const ProfileTabContent = ({ profile, isEditing, onSave }: ProfileTabContentProps) => {
  return isEditing ? (
    <ProfileForm onSave={onSave} />
  ) : (
    <>
      <ProfileTabs profile={profile} />
      <div className="mt-8">
        <CreatorsFeed />
      </div>
    </>
  );
};