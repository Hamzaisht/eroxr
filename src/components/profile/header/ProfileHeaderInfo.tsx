
import { ProfileHeaderProps } from '../types';

export const ProfileHeaderInfo = ({ profile }: Pick<ProfileHeaderProps, 'profile'>) => {
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
