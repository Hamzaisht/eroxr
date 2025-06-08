
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { 
  Users, 
  Heart, 
  Eye, 
  DollarSign, 
  Crown, 
  Zap, 
  TrendingUp,
  Star,
  Award
} from "lucide-react";

interface ProfileStatsProps {
  profileId: string;
  isOwnProfile: boolean;
}

interface Stats {
  followers: number;
  following: number;
  posts: number;
  totalLikes: number;
  totalViews: number;
  earnings?: number;
  subscriptionTier?: string;
}

export const ProfileStats = ({ profileId, isOwnProfile }: ProfileStatsProps) => {
  const [stats, setStats] = useState<Stats>({
    followers: 0,
    following: 0,
    posts: 0,
    totalLikes: 0,
    totalViews: 0,
    earnings: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, [profileId]);

  const fetchStats = async () => {
    try {
      setLoading(true);

      // Fetch all stats in parallel
      const [
        followersData,
        followingData,
        postsData,
        likesData,
        creatorMetrics
      ] = await Promise.all([
        supabase.from('followers').select('id').eq('following_id', profileId),
        supabase.from('followers').select('id').eq('follower_id', profileId),
        supabase.from('posts').select('id, view_count, likes_count').eq('creator_id', profileId),
        supabase.from('post_likes').select('id').eq('user_id', profileId),
        supabase.from('creator_metrics').select('*').eq('user_id', profileId).single()
      ]);

      const totalViews = postsData.data?.reduce((sum, post) => sum + (post.view_count || 0), 0) || 0;
      const totalLikes = postsData.data?.reduce((sum, post) => sum + (post.likes_count || 0), 0) || 0;

      setStats({
        followers: followersData.data?.length || 0,
        following: followingData.data?.length || 0,
        posts: postsData.data?.length || 0,
        totalLikes,
        totalViews,
        earnings: creatorMetrics.data?.earnings || 0,
        subscriptionTier: 'Premium' // Mock for now
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const statsData = [
    {
      icon: Users,
      label: "Followers",
      value: formatNumber(stats.followers),
      color: "text-luxury-primary",
      bgColor: "bg-luxury-primary/20",
      public: true
    },
    {
      icon: Heart,
      label: "Following",
      value: formatNumber(stats.following),
      color: "text-luxury-accent",
      bgColor: "bg-luxury-accent/20",
      public: true
    },
    {
      icon: Star,
      label: "Posts",
      value: formatNumber(stats.posts),
      color: "text-luxury-secondary",
      bgColor: "bg-luxury-secondary/20",
      public: true
    },
    {
      icon: Heart,
      label: "Total Likes",
      value: formatNumber(stats.totalLikes),
      color: "text-red-400",
      bgColor: "bg-red-400/20",
      public: true
    },
    {
      icon: Eye,
      label: "Total Views",
      value: formatNumber(stats.totalViews),
      color: "text-blue-400",
      bgColor: "bg-blue-400/20",
      public: true
    },
    {
      icon: DollarSign,
      label: "Earnings",
      value: `$${formatNumber(stats.earnings || 0)}`,
      color: "text-green-400",
      bgColor: "bg-green-400/20",
      public: false
    }
  ];

  const visibleStats = isOwnProfile ? statsData : statsData.filter(stat => stat.public);

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="bg-luxury-dark/30 backdrop-blur-xl border border-luxury-primary/20 rounded-2xl p-4 animate-pulse"
          >
            <div className="w-full h-16" />
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
    >
      {visibleStats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          whileHover={{ 
            scale: 1.05, 
            y: -4,
            rotateY: 5
          }}
          className="bg-luxury-dark/50 backdrop-blur-xl border border-luxury-primary/20 hover:border-luxury-primary/40 rounded-2xl p-4 transition-all duration-300 hover:shadow-luxury group relative overflow-hidden cursor-pointer"
        >
          {/* Animated background gradient */}
          <motion.div
            initial={{ x: '-100%' }}
            whileHover={{ x: '100%' }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-luxury-primary/10 to-transparent"
          />

          <div className="flex items-center justify-between mb-3 relative z-10">
            <motion.div
              whileHover={{ 
                scale: 1.2,
                rotate: 360
              }}
              transition={{ duration: 0.5 }}
              className={`w-10 h-10 ${stat.bgColor} rounded-xl flex items-center justify-center`}
            >
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </motion.div>
            {stat.label === "Earnings" && isOwnProfile && (
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Crown className="w-4 h-4 text-yellow-500" />
              </motion.div>
            )}
          </div>
          
          <div className="space-y-1 relative z-10">
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
              className={`text-2xl font-bold ${stat.color}`}
            >
              {stat.value}
            </motion.div>
            <div className="text-luxury-muted text-sm font-medium">
              {stat.label}
            </div>
          </div>
        </motion.div>
      ))}

      {/* Premium Tier Badge for own profile with enhanced animations */}
      {isOwnProfile && stats.subscriptionTier && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          whileHover={{ 
            scale: 1.05, 
            y: -4,
            rotateY: 10
          }}
          className="bg-gradient-to-br from-luxury-primary/20 to-luxury-accent/20 backdrop-blur-xl border border-luxury-primary/40 rounded-2xl p-4 transition-all duration-300 hover:shadow-luxury group relative overflow-hidden cursor-pointer"
        >
          {/* Animated shimmer effect */}
          <motion.div
            animate={{ 
              x: [-100, 200],
              opacity: [0, 1, 0]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              repeatDelay: 3
            }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
          />

          <div className="flex items-center justify-between mb-3 relative z-10">
            <motion.div
              whileHover={{ 
                scale: 1.2,
                rotate: [0, 360]
              }}
              transition={{ duration: 0.8 }}
              className="w-10 h-10 bg-gradient-to-r from-luxury-primary to-luxury-accent rounded-xl flex items-center justify-center"
            >
              <Crown className="w-5 h-5 text-white" />
            </motion.div>
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Zap className="w-4 h-4 text-luxury-accent" />
            </motion.div>
          </div>
          
          <div className="space-y-1 relative z-10">
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="text-2xl font-bold bg-gradient-to-r from-luxury-primary to-luxury-accent bg-clip-text text-transparent"
            >
              {stats.subscriptionTier}
            </motion.div>
            <div className="text-luxury-muted text-sm font-medium">
              Creator Tier
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};
