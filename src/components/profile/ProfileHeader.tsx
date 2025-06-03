
interface ProfileData {
  id: string;
  username: string;
  bio?: string;
  avatar_url?: string;
  banner_url?: string;
  location?: string;
  created_at: string;
  updated_at: string;
}

interface ProfileHeaderProps {
  profile: ProfileData;
  isOwnProfile: boolean;
  onEditClick: () => void;
}

export const ProfileHeader = ({ profile, isOwnProfile, onEditClick }: ProfileHeaderProps) => {
  return (
    <div className="flex items-center gap-6">
      <div className="flex-1">
        <h1 className="text-3xl font-bold text-white">{profile.username}</h1>
        {profile.bio && (
          <p className="text-gray-300 mt-2">{profile.bio}</p>
        )}
        {profile.location && (
          <p className="text-gray-400 mt-1">📍 {profile.location}</p>
        )}
      </div>
      
      {isOwnProfile && (
        <button
          onClick={onEditClick}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Edit Profile
        </button>
      )}
    </div>
  );
};
