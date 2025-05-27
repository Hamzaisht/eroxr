
import { useSession } from "@supabase/auth-helpers-react";
import { AvatarUpload } from "@/components/avatar/AvatarUpload";
import { UserAvatar } from "@/components/avatar/UserAvatar";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";

interface ProfileHeaderProps {
  profile?: {
    id: string;
    username?: string | null;
    bio?: string | null;
  } | null;
  isOwnProfile?: boolean;
  onEdit?: () => void;
}

export const ProfileHeader = ({ profile, isOwnProfile, onEdit }: ProfileHeaderProps) => {
  const session = useSession();

  return (
    <div className="relative bg-gradient-to-br from-luxury-darker to-luxury-dark rounded-lg p-6 mb-6">
      <div className="flex items-start gap-6">
        <div className="relative">
          {isOwnProfile ? (
            <AvatarUpload 
              size="xl"
              variant="overlay"
              onSuccess={() => {
                // Avatar will refresh automatically via the hook
              }}
            />
          ) : (
            <UserAvatar 
              userId={profile?.id}
              username={profile?.username}
              size="xl"
            />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">
                {profile?.username || 'Anonymous User'}
              </h1>
              {profile?.bio && (
                <p className="text-luxury-neutral text-sm mb-3">
                  {profile.bio}
                </p>
              )}
            </div>

            {isOwnProfile && onEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={onEdit}
                className="ml-4"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
