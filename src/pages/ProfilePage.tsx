
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileTabs } from "@/components/profile/ProfileTabs";
import { ProfileContent } from "@/components/profile/ProfileContent";
import { CreatorDashboard } from "@/components/profile/CreatorDashboard";
import { useSession } from "@supabase/auth-helpers-react";
import { motion } from "framer-motion";

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

export default function ProfilePage() {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [isFollowing, setIsFollowing] = useState(false);
  const { toast } = useToast();
  const session = useSession();

  const isOwnProfile = session?.user && profile?.id === session.user.id;

  useEffect(() => {
    if (!session?.user) {
      navigate('/login');
      return;
    }

    if (!username) {
      redirectToUserProfile();
      return;
    }

    fetchProfile();
  }, [username, session]);

  const redirectToUserProfile = async () => {
    if (!session?.user?.id) return;

    try {
      setLoading(true);
      
      let { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', session.user.id)
        .single();

      if (profileError || !profileData) {
        // Create profile if it doesn't exist
        const defaultUsername = session.user.email?.split('@')[0] || `user_${session.user.id.slice(0, 8)}`;
        
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: session.user.id,
            username: defaultUsername,
            bio: null,
            location: null
          })
          .select('username')
          .single();

        if (insertError) {
          console.error('Error creating profile:', insertError);
          toast({
            title: "Error",
            description: "Failed to create profile",
            variant: "destructive"
          });
          return;
        }

        profileData = newProfile;
      }

      if (profileData?.username) {
        navigate(`/profile/${profileData.username}`, { replace: true });
      }
    } catch (error) {
      console.error('Error redirecting to user profile:', error);
      toast({
        title: "Error",
        description: "Failed to load your profile",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async () => {
    if (!username) return;

    try {
      setLoading(true);
      
      // Get profile data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single();

      if (profileError) {
        console.error('Profile not found:', profileError);
        
        // If this could be the current user trying to access their own profile
        if (session?.user?.id) {
          const { data: currentUserProfile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (!currentUserProfile) {
            // User doesn't have a profile yet, create one
            await redirectToUserProfile();
            return;
          } else if (currentUserProfile.username !== username) {
            // Profile exists but username doesn't match - show not found
            setProfile(null);
            setLoading(false);
            return;
          }
        }
        
        setProfile(null);
        setLoading(false);
        return;
      }

      // Get follower count
      const { count: followerCount } = await supabase
        .from('followers')
        .select('*', { count: 'exact', head: true })
        .eq('following_id', profileData.id);

      // Get following count
      const { count: followingCount } = await supabase
        .from('followers')
        .select('*', { count: 'exact', head: true })
        .eq('follower_id', profileData.id);

      // Get posts count
      const { count: postsCount } = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .eq('creator_id', profileData.id);

      // Get total likes across all posts
      const { data: likesData } = await supabase
        .from('posts')
        .select('likes_count')
        .eq('creator_id', profileData.id);

      const totalLikes = likesData?.reduce((sum, post) => sum + (post.likes_count || 0), 0) || 0;

      // Check if user is a creator
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', profileData.id)
        .single();

      // Get subscription pricing if creator
      let subscriptionPrice = null;
      if (roleData?.role === 'creator') {
        const { data: pricingData } = await supabase
          .from('creator_content_prices')
          .select('monthly_price')
          .eq('creator_id', profileData.id)
          .single();
        subscriptionPrice = pricingData?.monthly_price;
      }

      // Check if current user follows this profile
      if (session?.user?.id && session.user.id !== profileData.id) {
        const { data: followData } = await supabase
          .from('followers')
          .select('id')
          .eq('follower_id', session.user.id)
          .eq('following_id', profileData.id)
          .single();
        setIsFollowing(!!followData);
      }

      setProfile({
        ...profileData,
        follower_count: followerCount || 0,
        following_count: followingCount || 0,
        likes_count: totalLikes,
        posts_count: postsCount || 0,
        is_creator: roleData?.role === 'creator',
        subscription_price: subscriptionPrice
      });

    } catch (error: any) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-2 border-cyan-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold text-white mb-4">Profile Not Found</h1>
          <p className="text-gray-400 text-lg mb-6">The user you're looking for doesn't exist.</p>
          {session?.user && (
            <div className="space-y-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => redirectToUserProfile()}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-2xl font-semibold hover:shadow-lg transition-all duration-300 mr-4"
              >
                Go to My Profile
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/home')}
                className="px-6 py-3 bg-white/10 text-white rounded-2xl font-semibold hover:bg-white/20 transition-all duration-300"
              >
                Go to Home
              </motion.button>
            </div>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/3 via-purple-500/3 to-pink-500/3 animate-pulse" />
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ 
            scale: [1.1, 1, 1.1],
            opacity: [0.1, 0.15, 0.1]
          }}
          transition={{ duration: 10, repeat: Infinity, delay: 2 }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.05, 0.1, 0.05]
          }}
          transition={{ duration: 12, repeat: Infinity, delay: 4 }}
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500/8 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"
        />
      </div>

      {/* Full-width immersive content */}
      <div className="relative z-10 w-full">
        {/* Glassmorphism Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <ProfileHeader 
            profile={profile}
            isOwnProfile={isOwnProfile}
            isFollowing={isFollowing}
            onFollowToggle={setIsFollowing}
          />
        </motion.div>

        {/* Creator Dashboard - Enhanced for creators */}
        {isOwnProfile && profile.is_creator && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <CreatorDashboard profile={profile} />
          </motion.div>
        )}

        {/* Enhanced Profile Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <ProfileTabs 
            activeTab={activeTab}
            onTabChange={setActiveTab}
            isCreator={profile.is_creator}
          />
        </motion.div>

        {/* Profile Content with enhanced performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <ProfileContent 
            profile={profile}
            activeTab={activeTab}
            isOwnProfile={isOwnProfile}
          />
        </motion.div>
      </div>
    </div>
  );
}
