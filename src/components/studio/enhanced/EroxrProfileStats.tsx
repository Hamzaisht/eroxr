import { motion } from 'framer-motion';
import { Crown, Heart, Eye, Users, Star, Zap } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface EroxrProfileStatsProps {
  profileId: string;
}

export const EroxrProfileStats = ({ profileId }: EroxrProfileStatsProps) => {
  const { data: stats } = useQuery({
    queryKey: ['profile-stats', profileId],
    queryFn: async () => {
      // Get basic stats
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', profileId)
        .single();

      // Get post count
      const { count: postCount } = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .eq('creator_id', profileId)
        .eq('visibility', 'public');

      return {
        followers: 0, // Placeholder - implement when followers table exists
        following: 0, // Placeholder - implement when followers table exists
        posts: postCount || 0,
        likes: 0, // Placeholder - aggregate from posts
        views: 0, // Placeholder - aggregate from posts
      };
    },
    staleTime: 60000,
  });

  const statItems = [
    { icon: Users, label: 'Followers', value: stats?.followers || 0, color: 'from-blue-400 to-cyan-400' },
    { icon: Heart, label: 'Following', value: stats?.following || 0, color: 'from-pink-400 to-rose-400' },
    { icon: Star, label: 'Posts', value: stats?.posts || 0, color: 'from-yellow-400 to-amber-400' },
    { icon: Eye, label: 'Total Views', value: stats?.views || 0, color: 'from-purple-400 to-violet-400' },
    { icon: Zap, label: 'Total Likes', value: stats?.likes || 0, color: 'from-green-400 to-emerald-400' },
  ];

  return (
    <div className="px-8 py-12 bg-slate-800/20 backdrop-blur-xl border-y border-slate-700/30">
      <div className="max-w-7xl mx-auto">
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-slate-100 mb-8 text-center flex items-center justify-center gap-3"
        >
          <Crown className="w-8 h-8 text-yellow-400" />
          Divine Statistics
        </motion.h3>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {statItems.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.05 }}
              className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/30 text-center group"
            >
              <div className={`w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-r ${stat.color} p-3 group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className="w-full h-full text-white" />
              </div>
              <div className="text-3xl font-bold text-slate-100 mb-2">
                {stat.value.toLocaleString()}
              </div>
              <div className="text-slate-400 text-sm font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
