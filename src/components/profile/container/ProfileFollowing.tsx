
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Users, Lock } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface ProfileFollowingProps {
  userId: string;
}

export const ProfileFollowing = ({ userId }: ProfileFollowingProps) => {
  const { data: following, isLoading, error } = useQuery({
    queryKey: ['user-following', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('followers')
        .select(`
          *,
          following:profiles!followers_following_id_fkey(
            id,
            username,
            avatar_url,
            bio,
            location
          )
        `)
        .eq('follower_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    staleTime: 30000,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-luxury-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-400 mb-2">Failed to load following</p>
        <p className="text-gray-500 text-sm">Please try refreshing the page</p>
      </div>
    );
  }

  if (!following?.length) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 mx-auto mb-6 bg-luxury-primary/10 rounded-full flex items-center justify-center">
          <Users className="w-12 h-12 text-luxury-primary" />
        </div>
        <h3 className="text-xl font-semibold text-luxury-neutral mb-2">Not following anyone yet</h3>
        <p className="text-luxury-muted mb-4">Discover and follow creators you love</p>
        <div className="flex items-center justify-center gap-2 text-sm text-luxury-muted/60">
          <Lock className="w-4 h-4" />
          <span>Only visible to you</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-luxury-neutral">Following</h2>
        <div className="flex items-center gap-2 text-sm text-luxury-muted/60">
          <Lock className="w-4 h-4" />
          <span>Private list</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {following.map((follow) => {
          const profile = follow.following as any;
          return (
            <motion.div
              key={follow.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-luxury-dark/30 backdrop-blur-xl rounded-2xl p-6 border border-luxury-primary/10 hover:border-luxury-primary/20 transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={profile.avatar_url || undefined} />
                  <AvatarFallback className="bg-luxury-primary/20 text-luxury-primary">
                    {(profile.username || 'U').charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-luxury-neutral truncate">
                    {profile.username || 'Anonymous'}
                  </h3>
                  {profile.bio && (
                    <p className="text-sm text-luxury-muted truncate">{profile.bio}</p>
                  )}
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full border-luxury-primary/30 text-luxury-neutral hover:bg-luxury-primary/10"
              >
                View Profile
              </Button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
