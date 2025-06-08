
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@supabase/auth-helpers-react';
import { useToast } from '@/hooks/use-toast';
import { Loader2, UserPlus, UserMinus } from 'lucide-react';
import { motion } from 'framer-motion';

interface FollowButtonProps {
  profileId: string;
  initialIsFollowing?: boolean;
  onFollowChange?: (isFollowing: boolean) => void;
}

export const FollowButton = ({ profileId, initialIsFollowing = false, onFollowChange }: FollowButtonProps) => {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isLoading, setIsLoading] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const session = useSession();
  const { toast } = useToast();

  useEffect(() => {
    checkFollowStatus();
    getFollowerCount();
  }, [profileId, session]);

  const checkFollowStatus = async () => {
    if (!session?.user || !profileId) return;

    try {
      const { data, error } = await supabase
        .from('followers')
        .select('id')
        .eq('follower_id', session.user.id)
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
    if (!session?.user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to follow other users.",
        variant: "destructive",
      });
      return;
    }

    if (session.user.id === profileId) {
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
          .eq('follower_id', session.user.id)
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
            follower_id: session.user.id,
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
      transition={{ delay: 0.6 }}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      className="flex flex-col items-center gap-1"
    >
      <Button
        variant={isFollowing ? "outline" : "default"}
        className={
          isFollowing 
            ? "bg-transparent border-luxury-primary text-luxury-primary hover:bg-luxury-primary/10 font-semibold px-6 py-3 rounded-xl transition-all duration-300 group" 
            : "bg-button-gradient hover:bg-hover-gradient text-white font-semibold px-6 py-3 rounded-xl shadow-button hover:shadow-button-hover transition-all duration-300 group"
        }
        onClick={handleFollowToggle}
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
        ) : isFollowing ? (
          <UserMinus className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
        ) : (
          <UserPlus className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
        )}
        {isFollowing ? "Following" : "Follow"}
      </Button>
      {followerCount > 0 && (
        <motion.span 
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 0.5 }}
          className="text-xs text-luxury-muted"
        >
          {followerCount} followers
        </motion.span>
      )}
    </motion.div>
  );
};
