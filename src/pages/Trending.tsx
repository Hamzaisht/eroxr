import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { 
  TrendingUp, 
  ArrowLeft, 
  Star, 
  Heart, 
  MessageCircle, 
  Share2,
  Play,
  Users,
  Crown,
  Flame
} from "lucide-react";

interface TrendingCreator {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  banner: string;
  followers: number;
  likes: number;
  growth: number;
  isVerified: boolean;
  isPremium: boolean;
  category: string;
}

interface TrendingPost {
  id: string;
  creator: string;
  content: string;
  likes: number;
  comments: number;
  shares: number;
  views: number;
  mediaUrl?: string;
  mediaType: 'image' | 'video' | 'text';
  timeAgo: string;
}

const Trending = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'creators' | 'posts'>('creators');
  const [trendingCreators, setTrendingCreators] = useState<TrendingCreator[]>([]);
  const [trendingPosts, setTrendingPosts] = useState<TrendingPost[]>([]);

  useEffect(() => {
    // Mock data for trending creators
    setTrendingCreators([
      {
        id: '1',
        username: 'sarah_creates',
        displayName: 'Sarah Johnson',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150',
        banner: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400',
        followers: 125000,
        likes: 2500000,
        growth: 34.5,
        isVerified: true,
        isPremium: true,
        category: 'Lifestyle'
      },
      {
        id: '2',
        username: 'alex_fitness',
        displayName: 'Alex Martinez',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        banner: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
        followers: 89000,
        likes: 1800000,
        growth: 28.2,
        isVerified: true,
        isPremium: false,
        category: 'Fitness'
      },
      {
        id: '3',
        username: 'emma_artist',
        displayName: 'Emma Wilson',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
        banner: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400',
        followers: 76000,
        likes: 1200000,
        growth: 22.1,
        isVerified: false,
        isPremium: true,
        category: 'Art'
      }
    ]);

    // Mock data for trending posts
    setTrendingPosts([
      {
        id: '1',
        creator: 'sarah_creates',
        content: 'Just dropped my new morning routine! Who else is ready to glow up? ✨',
        likes: 12500,
        comments: 234,
        shares: 89,
        views: 125000,
        mediaType: 'video',
        timeAgo: '2h'
      },
      {
        id: '2',
        creator: 'alex_fitness',
        content: 'This 5-minute workout will change your life! Try it and let me know how it goes 💪',
        likes: 8900,
        comments: 156,
        shares: 234,
        views: 89000,
        mediaType: 'video',
        timeAgo: '4h'
      },
      {
        id: '3',
        creator: 'emma_artist',
        content: 'Finished this piece today! What do you think? 🎨',
        likes: 5600,
        comments: 89,
        shares: 45,
        views: 34000,
        mediaType: 'image',
        timeAgo: '6h'
      }
    ]);
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-luxury-gradient">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <motion.div 
          className="flex items-center gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate(-1)}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <TrendingUp className="h-8 w-8 text-luxury-primary" />
            <h1 className="text-3xl font-bold text-white">Trending</h1>
          </div>
          <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
            <Flame className="h-3 w-3 mr-1" />
            Hot
          </Badge>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div 
          className="flex gap-2 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Button
            variant={activeTab === 'creators' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('creators')}
            className={activeTab === 'creators' 
              ? 'bg-luxury-primary text-white' 
              : 'text-white hover:bg-white/10'
            }
          >
            <Users className="h-4 w-4 mr-2" />
            Trending Creators
          </Button>
          <Button
            variant={activeTab === 'posts' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('posts')}
            className={activeTab === 'posts' 
              ? 'bg-luxury-primary text-white' 
              : 'text-white hover:bg-white/10'
            }
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            Trending Posts
          </Button>
        </motion.div>

        {/* Content */}
        {activeTab === 'creators' ? (
          <motion.div 
            className="grid gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {trendingCreators.map((creator, index) => (
              <motion.div
                key={creator.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              >
                <Card className="bg-black/40 border-luxury-primary/20 backdrop-blur-sm overflow-hidden hover:border-luxury-primary/40 transition-colors">
                  <div className="h-32 bg-gradient-to-r from-luxury-primary/20 to-luxury-accent/20" 
                       style={{ backgroundImage: `url(${creator.banner})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                  <CardContent className="pt-6 relative">
                    <div className="flex items-start gap-4">
                      <div className="relative">
                        <img 
                          src={creator.avatar} 
                          alt={creator.displayName}
                          className="w-16 h-16 rounded-full border-4 border-luxury-primary/30 -mt-8 relative z-10"
                        />
                        {creator.isVerified && (
                          <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
                            <Star className="h-3 w-3 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold text-white truncate">{creator.displayName}</h3>
                          {creator.isPremium && (
                            <Crown className="h-4 w-4 text-luxury-primary" />
                          )}
                        </div>
                        <p className="text-white/70 text-sm">@{creator.username}</p>
                        <Badge variant="secondary" className="mt-2">
                          {creator.category}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="text-green-400 text-sm font-semibold mb-1">
                          +{creator.growth}% growth
                        </div>
                        <Button size="sm" className="bg-luxury-primary hover:bg-luxury-primary/90">
                          Follow
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-white/10">
                      <div className="text-center">
                        <div className="text-xl font-bold text-white">{formatNumber(creator.followers)}</div>
                        <div className="text-white/60 text-xs">Followers</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-white">{formatNumber(creator.likes)}</div>
                        <div className="text-white/60 text-xs">Likes</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-luxury-primary">#{index + 1}</div>
                        <div className="text-white/60 text-xs">Ranking</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            className="grid gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {trendingPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              >
                <Card className="bg-black/40 border-luxury-primary/20 backdrop-blur-sm hover:border-luxury-primary/40 transition-colors">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="text-luxury-primary font-bold text-lg">#{index + 1}</div>
                        <span className="text-white font-semibold">@{post.creator}</span>
                        <span className="text-white/60 text-sm">{post.timeAgo}</span>
                      </div>
                    </div>
                    <p className="text-white mb-4">{post.content}</p>
                    
                    {post.mediaType === 'video' && (
                      <div className="bg-black/60 rounded-lg p-8 mb-4 flex items-center justify-center">
                        <Play className="h-12 w-12 text-luxury-primary" />
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-white/70">
                          <Heart className="h-4 w-4" />
                          <span>{formatNumber(post.likes)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-white/70">
                          <MessageCircle className="h-4 w-4" />
                          <span>{formatNumber(post.comments)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-white/70">
                          <Share2 className="h-4 w-4" />
                          <span>{formatNumber(post.shares)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-white/70">
                          <Play className="h-4 w-4" />
                          <span>{formatNumber(post.views)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Trending;