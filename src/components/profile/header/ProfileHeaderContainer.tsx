
import { ProfileHeaderProps } from '../types';

export const ProfileHeaderContainer = ({ profile, isOwnProfile, onEdit }: ProfileHeaderProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">{profile.username}</h1>
        {isOwnProfile && onEdit && (
          <button 
            onClick={onEdit}
            className="px-4 py-2 bg-luxury-primary text-white rounded-md hover:bg-luxury-primary/90"
          >
            Edit Profile
          </button>
        )}
      </div>
      {profile.bio && (
        <p className="text-gray-300">{profile.bio}</p>
      )}
    </div>
  );
};
