import { ProfileBanner } from "@/components/profile/banner/ProfileBanner";
import { ProfileInfo } from "@/components/profile/ProfileInfo";
import { ProfileStats } from "@/components/profile/ProfileStats";
import { ProfileHeaderStatus } from "./ProfileHeaderStatus";
import { ProfileActions } from "@/components/profile/ProfileActions";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import type { ProfileHeaderProps } from "../types";

export const ProfileHeaderContainer = ({
  profile,
  isOwnProfile,
  isEditing,
  setIsEditing,
}: ProfileHeaderProps) => {
  const getMediaType = (url: string): 'video' | 'gif' | 'image' => {
    if (!url) return 'image';
    if (url.match(/\.(mp4|webm|ogg)$/i)) return 'video';
    if (url.match(/\.gif$/i)) return 'gif';
    return 'image';
  };

  return (
    <div className="relative">
      <ProfileBanner 
        profile={profile}
        getMediaType={getMediaType}
        isOwnProfile={isOwnProfile}
      />
      
      <div className="container mx-auto px-4">
        <div className="relative -mt-24 flex flex-col items-center gap-6 z-20">
          <div className="flex flex-col items-center">
            <ProfileAvatar 
              profile={profile}
              getMediaType={getMediaType}
              isOwnProfile={isOwnProfile}
            />
            
            <div className="mt-4">
              <ProfileHeaderStatus 
                isOwnProfile={isOwnProfile}
                availability="online"
              />
            </div>
          </div>
          
          <div className="w-full max-w-3xl space-y-6 text-center">
            <ProfileInfo profile={profile} />
            
            <div className="flex justify-center">
              <ProfileStats />
            </div>
            
            {isOwnProfile && (
              <div className="flex justify-center gap-4">
                <ProfileActions
                  isOwnProfile={isOwnProfile}
                  isEditing={isEditing}
                  onEdit={() => setIsEditing?.(true)}
                  onSave={() => setIsEditing?.(false)}
                  onCancel={() => setIsEditing?.(false)}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};