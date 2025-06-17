
import { Profile } from '@/integrations/supabase/types/profile';

interface ProfileHeaderInfoProps {
  profile: Profile & {
    post_count?: number;
    follower_count?: number;
    following_count?: number;
  };
}

export const ProfileHeaderInfo = ({ profile }: ProfileHeaderInfoProps) => {
  return (
    <div className="flex space-x-6 text-sm text-gray-400">
      <div className="text-center">
        <div className="font-semibold text-white">{profile.post_count || 0}</div>
        <div>Posts</div>
      </div>
      <div className="text-center">
        <div className="font-semibold text-white">{profile.follower_count || 0}</div>
        <div>Followers</div>
      </div>
      <div className="text-center">
        <div className="font-semibold text-white">{profile.following_count || 0}</div>
        <div>Following</div>
      </div>
    </div>
  );
};
