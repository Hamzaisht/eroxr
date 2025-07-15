import React from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Share2, Crown, Lock, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { usePlatformSubscription } from '@/hooks/usePlatformSubscription';
import { useToast } from '@/hooks/use-toast';

interface FreemiumPostCardProps {
  creator: {
    username: string;
    avatar_url?: string;
  };
  preview: {
    content: string;
    timestamp: string;
    hasMedia?: boolean;
    mediaCount?: number;
  };
  engagement: {
    likes: number;
    comments: number;
    shares: number;
  };
}

export const FreemiumPostCard = ({ creator, preview, engagement }: FreemiumPostCardProps) => {
  const { createPlatformSubscription, isLoading } = usePlatformSubscription();
  const { toast } = useToast();

  const handleUpgrade = async () => {
    try {
      await createPlatformSubscription();
      toast({
        title: "Redirecting to checkout",
        description: "Upgrade to unlock all posts and features!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to start subscription process",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="bg-luxury-darker/50 border-luxury-neutral/10 overflow-hidden">
      {/* Header */}
      <div className="p-4 pb-2">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={creator.avatar_url} />
            <AvatarFallback className="bg-luxury-primary text-white">
              {creator.username?.[0]?.toUpperCase() || '?'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="font-semibold text-white">{creator.username}</p>
              <Crown className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-xs text-luxury-neutral">{preview.timestamp}</p>
          </div>
          <div className="bg-amber-500/20 px-2 py-1 rounded-full">
            <span className="text-xs text-amber-400 font-medium">Premium</span>
          </div>
        </div>
      </div>

      {/* Content Preview - OnlyFans Style */}
      <div className="px-4 pb-2">
        <div className="relative p-4 rounded-lg bg-gradient-to-r from-gray-900/50 to-gray-800/50 border border-gray-700/30">
          <p className="text-gray-400 filter blur-[2px] select-none leading-relaxed">
            {preview.content.substring(0, 120)}...
          </p>
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60 rounded-lg flex items-center justify-center">
            <div className="bg-black/80 backdrop-blur-sm px-4 py-2 rounded-full border border-yellow-400/30">
              <span className="text-yellow-400 text-sm font-medium flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Unlock to read more
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* OnlyFans-Style Blurred Media */}
      {preview.hasMedia && (
        <div className="px-4 pb-2">
          <div className="relative aspect-video rounded-xl overflow-hidden group cursor-pointer">
            {/* Realistic blurred background */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 via-pink-500/20 to-orange-400/30" />
            <div 
              className="absolute inset-0 backdrop-blur-3xl" 
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                filter: 'blur(8px)'
              }}
            />
            
            {/* Gradient overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            
            {/* Center lock overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div 
                className="bg-black/70 backdrop-blur-md rounded-2xl p-6 text-center border border-white/10 shadow-2xl"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div
                  animate={{ 
                    rotate: [0, -5, 5, 0],
                    scale: [1, 1.1, 1, 1.05, 1]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    repeatType: "reverse" 
                  }}
                >
                  <Lock className="w-12 h-12 text-yellow-400 mx-auto mb-3 drop-shadow-lg" />
                </motion.div>
                <p className="text-white font-bold text-lg mb-1">
                  {preview.mediaCount} Exclusive {preview.mediaCount === 1 ? 'Photo' : 'Photos'}
                </p>
                <p className="text-gray-300 text-sm mb-3">4K Quality • Uncensored</p>
                <div className="bg-gradient-to-r from-pink-500 to-orange-400 text-white text-xs font-bold px-3 py-1 rounded-full">
                  MEMBERS ONLY
                </div>
              </motion.div>
            </div>
            
            {/* Subtle shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 animate-shimmer" />
          </div>
        </div>
      )}

      {/* Engagement Stats - Teaser */}
      <div className="px-4 pb-2">
        <div className="flex items-center gap-6 text-sm text-luxury-neutral">
          <div className="flex items-center gap-1 opacity-60">
            <Heart className="w-4 h-4" />
            <span>{engagement.likes}</span>
          </div>
          <div className="flex items-center gap-1 opacity-60">
            <MessageCircle className="w-4 h-4" />
            <span>{engagement.comments}</span>
          </div>
          <div className="flex items-center gap-1 opacity-60">
            <Share2 className="w-4 h-4" />
            <span>{engagement.shares}</span>
          </div>
          <div className="flex-1" />
          <div className="flex items-center gap-1 text-amber-400">
            <Sparkles className="w-3 h-3" />
            <span className="text-xs">Members only</span>
          </div>
        </div>
      </div>

      {/* OnlyFans-Style Premium CTA */}
      <motion.div 
        className="p-5 bg-gradient-to-r from-pink-600/20 via-purple-600/20 to-orange-500/20 border-t border-gradient-to-r from-pink-500/30 to-orange-500/30 backdrop-blur-sm"
        whileHover={{ scale: 1.01 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-white font-bold text-lg mb-1">Unlock Full Access</p>
            <p className="text-gray-300 text-sm mb-2">Join thousands of premium members</p>
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                Unlimited posts
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                4K quality
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                No ads
              </span>
            </div>
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={handleUpgrade}
              disabled={isLoading}
              size="lg"
              className="bg-gradient-to-r from-pink-500 via-purple-500 to-orange-400 hover:from-pink-600 hover:via-purple-600 hover:to-orange-500 text-white font-bold px-8 py-3 rounded-xl shadow-lg transform transition-all duration-200"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Crown className="w-5 h-5 mr-2" />
                  Subscribe Now
                </>
              )}
            </Button>
          </motion.div>
        </div>
        
        {/* Pulsing glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-orange-500/10 rounded-b-lg opacity-50 animate-pulse" />
      </motion.div>
    </Card>
  );
};