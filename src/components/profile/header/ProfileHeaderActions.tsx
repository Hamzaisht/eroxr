
import { ProfileHeaderProps } from '../types';

export const ProfileHeaderActions = ({ profile, isOwnProfile, onEdit }: ProfileHeaderProps) => {
  if (!isOwnProfile) {
    return (
      <div className="flex space-x-2">
        <button className="px-4 py-2 bg-luxury-primary text-white rounded-md hover:bg-luxury-primary/90">
          Follow
        </button>
        <button className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600">
          Message
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={onEdit}
      className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600"
    >
      Edit Profile
    </button>
  );
};
