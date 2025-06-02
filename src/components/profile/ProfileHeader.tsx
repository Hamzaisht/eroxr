
import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Calendar, Check, MessageCircle, UserPlus, UserMinus, Share, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "@supabase/auth-helpers-react";
import { format } from "date-fns";

interface ProfileData {
  id: string;
  username: string;
  bio?: string;
  avatar_url?: string;
  location?: string;
  created_at: string;
  is_verified?: boolean;
  follower_count: number;
  following_count: number;
  likes_count: number;
  posts_count: number;
  is_creator: boolean;
  subscription_price?: number;
}

interface ProfileHeaderProps {
  profile: ProfileData;
  isOwnProfile: boolean;
  isFollowing: boolean;
  onFollowToggle: (following: boolean) => void;
}

export const ProfileHeader = ({ profile, isOwnProfile, isFollowing, onFollowToggle }: ProfileHeaderProps) => {
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const { toast } = useToast();
  const session = useSession();

  const handleFollowToggle = async () => {
    if (!session?.user) return;
    
    setIsFollowLoading(true);
    try {
      if (isFollowing) {
        await supabase
          .from('followers')
          .delete()
          .eq('follower_id', session.user.id)
          .eq('following_id', profile.id);
        onFollowToggle(false);
        toast({ description: `Unfollowed @${profile.username}` });
      } else {
        await supabase
          .from('followers')
          .insert({
            follower_id: session.user.id,
            following_id: profile.id
          });
        onFollowToggle(true);
        toast({ description: `Following @${profile.username}` });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update follow status",
        variant: "destructive"
      });
    } finally {
      setIsFollowLoading(false);
    }
  };

  return (
    <div className="w-full relative">
      {/* Banner/Cover Area */}
      <div className="h-48 md:h-64 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-900 to-transparent" />
      </div>

      {/* Profile Info Container */}
      <div className="relative -mt-16 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
            
            {/* Avatar */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl bg-gradient-to-r from-cyan-500 to-purple-500 p-1">
                <div className="w-full h-full rounded-3xl overflow-hidden bg-gray-900">
                  {profile.avatar_url ? (
                    <img 
                      src={profile.avatar_url} 
                      alt={profile.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                      <span className="text-4xl font-bold text-white">
                        {profile.username?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Verified Badge */}
              {profile.is_verified && (
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center border-4 border-gray-900">
                  <Check className="w-5 h-5 text-white" />
                </div>
              )}
            </motion.div>

            {/* Profile Info */}
            <div className="flex-1 min-w-0">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="space-y-4"
              >
                {/* Name and Username */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">
                    @{profile.username}
                    {profile.is_creator && (
                      <span className="ml-2 text-lg text-purple-400">Creator</span>
                    )}
                  </h1>
                  {profile.bio && (
                    <p className="text-gray-300 text-lg max-w-2xl">{profile.bio}</p>
                  )}
                </div>

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                  {profile.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {format(new Date(profile.created_at), 'MMMM yyyy')}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex flex-wrap gap-6 text-sm">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{profile.posts_count}</div>
                    <div className="text-gray-400">Posts</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{profile.follower_count}</div>
                    <div className="text-gray-400">Followers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{profile.following_count}</div>
                    <div className="text-gray-400">Following</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{profile.likes_count}</div>
                    <div className="text-gray-400">Likes</div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Action Buttons */}
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col gap-3 min-w-[200px]"
            >
              {isOwnProfile ? (
                <>
                  <Button 
                    className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white font-semibold"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full border-white/20 text-white hover:bg-white/10"
                  >
                    <Share className="w-4 h-4 mr-2" />
                    Share Profile
                  </Button>
                </>
              ) : (
                <>
                  {profile.is_creator && profile.subscription_price && (
                    <Button 
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white font-semibold"
                    >
                      Subscribe ${profile.subscription_price}/month
                    </Button>
                  )}
                  <Button 
                    onClick={handleFollowToggle}
                    disabled={isFollowLoading}
                    className={`w-full font-semibold ${
                      isFollowing 
                        ? 'bg-white/10 text-white hover:bg-white/20' 
                        : 'bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white'
                    }`}
                  >
                    {isFollowing ? (
                      <>
                        <UserMinus className="w-4 h-4 mr-2" />
                        Unfollow
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4 mr-2" />
                        Follow
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full border-white/20 text-white hover:bg-white/10"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Message
                  </Button>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};
