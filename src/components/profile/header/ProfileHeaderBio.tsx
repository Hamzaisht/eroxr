
import { ProfileHeaderProps } from '../types';

export const ProfileHeaderBio = ({ profile }: Pick<ProfileHeaderProps, 'profile'>) => {
  if (!profile.bio) return null;

  return (
    <div className="space-y-2">
      <p className="text-gray-300">{profile.bio}</p>
    </div>
  );
};
