
import { Card } from "@/components/ui/card";

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

interface ProfileContentProps {
  profile: ProfileData;
  isOwnProfile: boolean;
}

export const ProfileContent = ({ profile, isOwnProfile }: ProfileContentProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-6">
        <Card className="p-6 bg-gray-800/50 border-gray-700">
          <h2 className="text-xl font-bold text-white mb-4">About</h2>
          {profile.bio ? (
            <p className="text-gray-300">{profile.bio}</p>
          ) : (
            <p className="text-gray-500 italic">
              {isOwnProfile ? "Add a bio to tell others about yourself." : "No bio available."}
            </p>
          )}
        </Card>

        {/* Posts/Media Section */}
        <Card className="p-6 bg-gray-800/50 border-gray-700">
          <h2 className="text-xl font-bold text-white mb-4">Posts</h2>
          <p className="text-gray-500 italic">No posts yet.</p>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        <Card className="p-6 bg-gray-800/50 border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Profile Info</h3>
          <div className="space-y-3">
            <div>
              <span className="text-gray-400">Username:</span>
              <span className="text-white ml-2">{profile.username}</span>
            </div>
            {profile.location && (
              <div>
                <span className="text-gray-400">Location:</span>
                <span className="text-white ml-2">{profile.location}</span>
              </div>
            )}
            <div>
              <span className="text-gray-400">Joined:</span>
              <span className="text-white ml-2">
                {new Date(profile.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
