import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Heart, MessageCircle, Eye, Trophy } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

interface ProfileStatsProps {
  profileId: string;
}

interface StatsData {
  followers: number;
  following: number;
  posts: number;
  likes: number;
  views: number;
}

export const ProfileStats = ({ profileId }: ProfileStatsProps) => {
  const [stats, setStats] = useState<StatsData>({
    followers: 0,
    following: 0,
    posts: 0,
    likes: 0,
    views: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, [profileId]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // Fetch followers count
      const { count: followersCount } = await supabase
        .from('followers')
        .select('*', { count: 'exact', head: true })
        .eq('following_id', profileId);

      // Fetch following count
      const { count: followingCount } = await supabase
        .from('followers')
        .select('*', { count: 'exact', head: true })
        .eq('follower_id', profileId);

      // Fetch posts count
      const { count: postsCount } = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .eq('creator_id', profileId);

      // Fetch total likes on user's posts
      const { data: likesData } = await supabase
        .from('posts')
        .select('likes_count')
        .eq('creator_id', profileId);

      const totalLikes = likesData?.reduce((sum, post) => sum + (post.likes_count || 0), 0) || 0;

      // Fetch total views on user's posts
      const { data: viewsData } = await supabase
        .from('posts')
        .select('view_count')
        .eq('creator_id', profileId);

      const totalViews = viewsData?.reduce((sum, post) => sum + (post.view_count || 0), 0) || 0;

      setStats({
        followers: followersCount || 0,
        following: followingCount || 0,
        posts: postsCount || 0,
        likes: totalLikes,
        views: totalViews
      });
    } catch (error) {
      console.error('Error fetching profile stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="text-center">
            <div className="h-8 bg-muted rounded animate-pulse mb-1" />
            <div className="h-4 bg-muted rounded animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  const statItems = [
    {
      label: 'Followers',
      value: stats.followers,
      icon: Users,
      color: 'text-blue-500'
    },
    {
      label: 'Following',
      value: stats.following,
      icon: Users,
      color: 'text-green-500'
    },
    {
      label: 'Posts',
      value: stats.posts,
      icon: MessageCircle,
      color: 'text-purple-500'
    },
    {
      label: 'Likes',
      value: stats.likes,
      icon: Heart,
      color: 'text-red-500'
    },
    {
      label: 'Views',
      value: stats.views,
      icon: Eye,
      color: 'text-orange-500'
    }
  ];

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
      {statItems.map((item, index) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ 
            delay: index * 0.1,
            type: "spring",
            bounce: 0.3 
          }}
          whileHover={{ 
            scale: 1.05,
            transition: { duration: 0.2 }
          }}
          className="text-center"
        >
          <div className="stats-orb cursor-pointer group">
            <div className="relative z-10">
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.5
                }}
              >
                <item.icon className={`w-6 h-6 ${item.color} mx-auto mb-3`} />
              </motion.div>
              <div className="text-2xl font-bold text-white mb-1">
                {formatNumber(item.value)}
              </div>
              <div className="text-sm text-white/60 font-medium">
                {item.label}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};