
import { motion } from 'framer-motion';
import { Users, Heart, Eye, Star, Crown, Zap } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface EroxrProfileStatsProps {
  profileId: string;
}

export const EroxrProfileStats = ({ profileId }: EroxrProfileStatsProps) => {
  const { data: stats } = useQuery({
    queryKey: ['profile-stats', profileId],
    queryFn: async () => {
      // Fetch follower count
      const { count: followersCount } = await supabase
        .from('followers')
        .select('*', { count: 'exact', head: true })
        .eq('following_id', profileId);

      // Fetch posts count
      const { count: postsCount } = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .eq('creator_id', profileId);

      // Fetch total likes across all posts
      const { data: likesData } = await supabase
        .from('posts')
        .select('likes_count')
        .eq('creator_id', profileId);

      const totalLikes = likesData?.reduce((sum, post) => sum + (post.likes_count || 0), 0) || 0;

      return {
        followers: followersCount || 0,
        posts: postsCount || 0,
        likes: totalLikes,
        views: Math.floor(Math.random() * 50000) + 10000, // Placeholder
      };
    },
    staleTime: 60000,
  });

  const statItems = [
    {
      icon: Users,
      label: 'Followers',
      value: stats?.followers || 0,
      color: 'from-slate-500 to-gray-500'
    },
    {
      icon: Star,
      label: 'Posts',
      value: stats?.posts || 0,
      color: 'from-slate-600 to-gray-600'
    },
    {
      icon: Heart,
      label: 'Likes',
      value: stats?.likes || 0,
      color: 'from-slate-500 to-gray-500'
    },
    {
      icon: Eye,
      label: 'Views',
      value: stats?.views || 0,
      color: 'from-slate-600 to-gray-600'
    }
  ];

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="px-8 py-12 bg-slate-800/30 backdrop-blur-xl border-y border-slate-700/20"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Crown className="w-8 h-8 text-slate-300" />
            <h2 className="text-4xl font-bold text-slate-200">Divine Metrics</h2>
            <Crown className="w-8 h-8 text-slate-300" />
          </div>
          <p className="text-slate-400 text-lg">
            Witness the power of divine creation
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {statItems.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/30 text-center group"
              >
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${stat.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                
                <div className="text-3xl font-bold text-slate-200 mb-2">
                  {formatNumber(stat.value)}
                </div>
                
                <div className="text-slate-400 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};
