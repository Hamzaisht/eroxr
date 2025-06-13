
import { motion } from "framer-motion";
import { Edit, Settings, UserPlus, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProfileHeaderProps {
  profile: {
    id: string;
    username?: string;
    bio?: string;
    avatar_url?: string;
    banner_url?: string;
    follower_count?: number;
    following_count?: number;
    post_count?: number;
  };
  isOwnProfile: boolean;
  onEditClick: () => void;
}

export const ProfileHeader = ({ profile, isOwnProfile, onEditClick }: ProfileHeaderProps) => {
  return (
    <div className="relative">
      {/* Banner */}
      <div className="w-full h-80 relative overflow-hidden">
        {profile.banner_url ? (
          <img 
            src={profile.banner_url} 
            alt="Profile banner"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-luxury-primary/30 via-luxury-accent/20 to-luxury-dark" />
        )}
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-luxury-dark/80 via-transparent to-transparent" />
      </div>

      {/* Profile Info */}
      <div className="relative px-8 pb-8">
        <div className="flex flex-col md:flex-row items-start md:items-end gap-6 -mt-16">
          {/* Avatar */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative"
          >
            <div className="w-32 h-32 rounded-full border-4 border-luxury-dark overflow-hidden bg-luxury-darker shadow-2xl">
              {profile.avatar_url ? (
                <img 
                  src={profile.avatar_url} 
                  alt={profile.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-luxury-primary/20 flex items-center justify-center">
                  <span className="text-3xl font-bold text-luxury-primary">
                    {profile.username?.[0]?.toUpperCase() || 'U'}
                  </span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Info and Actions */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-luxury-neutral mb-2">
                  {profile.username || 'Unknown User'}
                </h1>
                {profile.bio && (
                  <p className="text-luxury-muted text-lg mb-4 max-w-2xl">
                    {profile.bio}
                  </p>
                )}
                
                {/* Stats */}
                <div className="flex gap-6 text-sm">
                  <div className="text-center">
                    <div className="font-bold text-luxury-neutral">{profile.post_count || 0}</div>
                    <div className="text-luxury-muted">Posts</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-luxury-neutral">{profile.follower_count || 0}</div>
                    <div className="text-luxury-muted">Followers</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-luxury-neutral">{profile.following_count || 0}</div>
                    <div className="text-luxury-muted">Following</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                {isOwnProfile ? (
                  <>
                    <Button
                      onClick={onEditClick}
                      className="bg-luxury-primary hover:bg-luxury-primary/90 text-white px-6 py-2 rounded-xl"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                    <Button
                      variant="outline"
                      className="border-luxury-primary/30 text-luxury-primary hover:bg-luxury-primary/10 px-6 py-2 rounded-xl"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Button>
                  </>
                ) : (
                  <>
                    <Button className="bg-luxury-primary hover:bg-luxury-primary/90 text-white px-6 py-2 rounded-xl">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Follow
                    </Button>
                    <Button
                      variant="outline"
                      className="border-luxury-primary/30 text-luxury-primary hover:bg-luxury-primary/10 px-6 py-2 rounded-xl"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Message
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
