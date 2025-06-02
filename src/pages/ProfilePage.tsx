
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileTabs } from "@/components/profile/ProfileTabs";
import { ProfileContent } from "@/components/profile/ProfileContent";
import { CreatorDashboard } from "@/components/profile/CreatorDashboard";
import { useSession } from "@supabase/auth-helpers-react";

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
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [isFollowing, setIsFollowing] = useState(false);
  const { toast } = useToast();
  const session = useSession();

  const isOwnProfile = session?.user && profile?.id === session.user.id;

  useEffect(() => {
    if (!username) return;
    fetchProfile();
  }, [username]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      
      // Get profile data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single();

      if (profileError) throw profileError;

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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Profile Not Found</h1>
          <p className="text-gray-400">The user you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-pink-500/5 animate-pulse" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 w-full">
        {/* Profile Header */}
        <ProfileHeader 
          profile={profile}
          isOwnProfile={isOwnProfile}
          isFollowing={isFollowing}
          onFollowToggle={setIsFollowing}
        />

        {/* Creator Dashboard - Only for creators viewing their own profile */}
        {isOwnProfile && profile.is_creator && (
          <CreatorDashboard profile={profile} />
        )}

        {/* Profile Tabs */}
        <ProfileTabs 
          activeTab={activeTab}
          onTabChange={setActiveTab}
          isCreator={profile.is_creator}
        />

        {/* Profile Content */}
        <ProfileContent 
          profile={profile}
          activeTab={activeTab}
          isOwnProfile={isOwnProfile}
        />
      </div>
    </div>
  );
}
