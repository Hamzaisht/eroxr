
// Replace Next.js imports with React Router
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSupabaseClient, useSession } from '@supabase/auth-helpers-react';

import { ProfileTabs } from './ProfileTabs';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { FollowButton } from './FollowButton';

export interface ProfileContainerProps {
  id?: string;
  isEditing?: boolean;
  setIsEditing?: (isEditing: boolean) => void;
}

export const ProfileContainer = ({ id, isEditing = false, setIsEditing = () => {} }: ProfileContainerProps) => {
  const { id: profileId } = useParams();
  const userId = id || profileId;
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const session = useSession();
  const supabase = useSupabaseClient();

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) return;

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select(`
            *,
            posts:posts(count)
          `)
          .eq('id', userId)
          .single();

        if (error) throw error;
        setProfile(data);
        
        // Check if logged-in user follows this profile
        if (session?.user?.id && session.user.id !== userId) {
          const { data: followData } = await supabase
            .from('followers')
            .select()
            .eq('follower_id', session.user.id)
            .eq('following_id', userId)
            .maybeSingle();
          
          setIsFollowing(!!followData);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: 'Error',
          description: 'Failed to load profile',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId, supabase, toast, session?.user?.id]);

  const handleFollow = async () => {
    if (!session?.user) {
      navigate('/login');
      return;
    }

    setFollowLoading(true);
    try {
      await supabase.from('followers').insert({
        follower_id: session.user.id,
        following_id: userId,
      });
      setIsFollowing(true);
      toast({
        description: `You are now following ${profile?.username}`,
      });
    } catch (error) {
      console.error('Error following user:', error);
      toast({
        title: 'Error',
        description: 'Failed to follow user',
        variant: 'destructive',
      });
    } finally {
      setFollowLoading(false);
    }
  };

  const handleUnfollow = async () => {
    if (!session?.user) return;
    
    setFollowLoading(true);
    try {
      await supabase
        .from('followers')
        .delete()
        .eq('follower_id', session.user.id)
        .eq('following_id', userId);
      
      setIsFollowing(false);
      toast({
        description: `You have unfollowed ${profile?.username}`,
      });
    } catch (error) {
      console.error('Error unfollowing user:', error);
      toast({
        title: 'Error',
        description: 'Failed to unfollow user',
        variant: 'destructive',
      });
    } finally {
      setFollowLoading(false);
    }
  };

  return (
    <div>
      {/* Profile header content */}
      
      <Tabs defaultValue="posts" className="pt-6">
        <ProfileTabs profile={profile} />
        <TabsContent value="posts">
          {/* Posts content */}
        </TabsContent>
        <TabsContent value="media">
          {/* Media content */}
        </TabsContent>
        <TabsContent value="about">
          {/* About content */}
        </TabsContent>
      </Tabs>
    </div>
  );
};
