
import { motion } from 'framer-motion';
import { Heart, Eye, Users, Crown, Star, Zap } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface EroxrProfileStatsProps {
  profileId: string;
}

export const EroxrProfileStats = ({ profileId }: EroxrProfileStatsProps) => {
  const { data: stats } = useQuery({
    queryKey: ['profile-stats', profileId],
    queryFn: async () => {
      const [postsResult, followersResult, likesResult] = await Promise.all([
        supabase
          .from('posts')
          .select('id, likes_count, view_count')
          .eq('creator_id', profileId),
        supabase
          .from('followers')
          .select('id')
          .eq('following_id', profileId),
        supabase
          .from('post_likes')
          .select('id')
          .eq('user_id', profileId)
      ]);

      const posts = postsResult.data || [];
      const totalLikes = posts.reduce((sum, post) => sum + (post.likes_count || 0), 0);
      const totalViews = posts.reduce((sum, post) => sum + (post.view_count || 0), 0);

      return {
        posts: posts.length,
        followers: followersResult.data?.length || 0,
        totalLikes,
        totalViews,
        following: likesResult.data?.length || 0,
      };
    },
  });

  const statItems = [
    { 
      icon: Star, 
      label: 'Divine Posts', 
      value: stats?.posts || 0,
      color: 'from-yellow-400 to-yellow-600'
    },
    { 
      icon: Users, 
      label: 'Followers', 
      value: stats?.followers || 0,
      color: 'from-luxury-primary to-luxury-accent'
    },
    { 
      icon: Heart, 
      label: 'Total Likes', 
      value: stats?.totalLikes || 0,
      color: 'from-red-400 to-pink-500'
    },
    { 
      icon: Eye, 
      label: 'Total Views', 
      value: stats?.totalViews || 0,
      color: 'from-blue-400 to-cyan-500'
    },
  ];

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="px-8 py-8"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {statItems.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="relative group"
              >
                <div className="bg-luxury-darker/50 backdrop-blur-xl rounded-2xl p-6 border border-luxury-primary/20 hover:border-yellow-400/40 transition-all duration-300 text-center relative overflow-hidden">
                  {/* Background Glow */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                  
                  <div className={`w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <div className="text-3xl font-bold text-luxury-neutral mb-2">
                    {stat.value.toLocaleString()}
                  </div>
                  
                  <div className="text-luxury-muted text-sm font-medium">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};
