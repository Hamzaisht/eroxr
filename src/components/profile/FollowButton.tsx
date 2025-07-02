
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, UserPlus, UserMinus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useNavigate } from 'react-router-dom';

interface FollowButtonProps {
  profileId: string;
  initialIsFollowing?: boolean;
  onFollowChange?: (isFollowing: boolean) => void;
}

export const FollowButton = ({ profileId, initialIsFollowing = false, onFollowChange }: FollowButtonProps) => {
  const { user, isLoggedIn } = useCurrentUser();
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isLoading, setIsLoading] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      checkFollowStatus();
    }
    getFollowerCount();
  }, [profileId, isLoggedIn]);

  const handleAuthRequired = () => {
    toast({
      title: "Sign in required",
      description: "Please sign in to follow other users.",
      variant: "destructive",
    });
    navigate('/login');
  };

  const checkFollowStatus = async () => {
    if (!user || !profileId) return;

    try {
      const { data, error } = await supabase
        .from('followers')
        .select('id')
        .eq('follower_id', user.id)
        .eq('following_id', profileId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking follow status:', error);
        return;
      }

      setIsFollowing(!!data);
    } catch (error) {
      console.error('Error checking follow status:', error);
    }
  };

  const getFollowerCount = async () => {
    try {
      const { count, error } = await supabase
        .from('followers')
        .select('*', { count: 'exact', head: true })
        .eq('following_id', profileId);

      if (error) throw error;
      setFollowerCount(count || 0);
    } catch (error) {
      console.error('Error getting follower count:', error);
    }
  };
  
  const handleFollowToggle = async () => {
    if (!isLoggedIn) {
      handleAuthRequired();
      return;
    }

    if (user?.id === profileId) {
      toast({
        title: "Cannot follow yourself",
        description: "You cannot follow your own profile.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (isFollowing) {
        const { error } = await supabase
          .from('followers')
          .delete()
          .eq('follower_id', user!.id)
          .eq('following_id', profileId);
          
        if (error) throw error;
        
        setIsFollowing(false);
        setFollowerCount(prev => Math.max(0, prev - 1));
        onFollowChange?.(false);
        
        toast({
          title: "Unfollowed",
          description: "You are no longer following this user.",
        });
      } else {
        const { error } = await supabase
          .from('followers')
          .insert({
            follower_id: user!.id,
            following_id: profileId,
          });
          
        if (error) throw error;
        
        setIsFollowing(true);
        setFollowerCount(prev => prev + 1);
        onFollowChange?.(true);
        
        toast({
          title: "Following",
          description: "You are now following this user.",
        });
      }
    } catch (error: any) {
      console.error('Error toggling follow status:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update follow status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="flex flex-col items-center gap-2"
    >
      <Button
        variant={isFollowing ? "outline" : "default"}
        className={
          isFollowing 
            ? "bg-white/10 border-white/20 text-white hover:bg-white/20 font-medium px-8 py-3 rounded-full transition-all duration-300 group backdrop-blur-xl" 
            : "bg-primary hover:bg-primary/90 text-white font-medium px-8 py-3 rounded-full transition-all duration-300 group"
        }
        onClick={handleFollowToggle}
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : isFollowing ? (
          <UserMinus className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
        ) : (
          <UserPlus className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
        )}
        {!isLoggedIn ? "Sign in to Follow" : isFollowing ? "Following" : "Follow"}
      </Button>
      {followerCount > 0 && (
        <motion.span 
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 3 }}
          className="text-xs text-white/40 font-medium"
        >
          {followerCount} {followerCount === 1 ? 'follower' : 'followers'}
        </motion.span>
      )}
    </motion.div>
  );
};
