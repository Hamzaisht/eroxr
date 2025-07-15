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
    <Card className="bg-luxury-darker/80 border-luxury-primary/20 overflow-hidden backdrop-blur-sm">
      {/* Header */}
      <div className="p-4 pb-2">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 ring-2 ring-luxury-primary/30">
            <AvatarImage src={creator.avatar_url} />
            <AvatarFallback className="bg-luxury-primary text-white font-bold">
              {creator.username?.[0]?.toUpperCase() || '?'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="font-semibold text-white">{creator.username}</p>
              <Crown className="w-4 h-4 text-luxury-accent" />
            </div>
            <p className="text-xs text-luxury-neutral/70">{preview.timestamp}</p>
          </div>
          <div className="bg-luxury-accent/20 border border-luxury-accent/30 px-3 py-1 rounded-full">
            <span className="text-xs text-luxury-accent font-bold">PREMIUM</span>
          </div>
        </div>
      </div>

      {/* Content Preview - Luxury Style */}
      <div className="px-4 pb-2">
        <div className="relative p-4 rounded-lg bg-luxury-dark/50 border border-luxury-primary/10">
          <p className="text-luxury-neutral/60 filter blur-[1px] select-none leading-relaxed">
            {preview.content.substring(0, 120)}...
          </p>
          <div className="absolute inset-0 bg-gradient-to-r from-luxury-dark/80 via-transparent to-luxury-dark/80 rounded-lg flex items-center justify-center">
            <div className="bg-luxury-darker/90 backdrop-blur-sm px-4 py-2 rounded-full border border-luxury-accent/40">
              <span className="text-luxury-accent text-sm font-medium flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Unlock to read more
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Luxury-Style Blurred Media */}
      {preview.hasMedia && (
        <div className="px-4 pb-2">
          <div className="relative aspect-video rounded-xl overflow-hidden group cursor-pointer border border-luxury-primary/20">
            {/* Luxury blurred background */}
            <div className="absolute inset-0 bg-gradient-to-br from-luxury-primary/30 via-luxury-accent/20 to-luxury-primary/30" />
            <div className="absolute inset-0 backdrop-blur-3xl" />
            
            {/* Luxury gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-luxury-dark/90 via-luxury-dark/30 to-transparent" />
            
            {/* Center lock overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div 
                className="bg-luxury-darker/80 backdrop-blur-md rounded-2xl p-6 text-center border border-luxury-primary/20 shadow-2xl"
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
                  <Lock className="w-12 h-12 text-luxury-accent mx-auto mb-3 drop-shadow-lg" />
                </motion.div>
                <p className="text-white font-bold text-lg mb-1">
                  {preview.mediaCount} Exclusive {preview.mediaCount === 1 ? 'Photo' : 'Photos'}
                </p>
                <p className="text-luxury-neutral text-sm mb-3">4K Quality • Uncensored</p>
                <div className="bg-gradient-to-r from-luxury-primary to-luxury-accent text-white text-xs font-bold px-3 py-1 rounded-full">
                  MEMBERS ONLY
                </div>
              </motion.div>
            </div>
            
            {/* Luxury shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-luxury-primary/10 to-transparent transform -skew-x-12 animate-shimmer" />
          </div>
        </div>
      )}

      {/* Engagement Stats - Luxury Theme */}
      <div className="px-4 pb-2">
        <div className="flex items-center gap-6 text-sm text-luxury-neutral/70">
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
          <div className="flex items-center gap-1 text-luxury-accent">
            <Sparkles className="w-3 h-3" />
            <span className="text-xs">Members only</span>
          </div>
        </div>
      </div>

      {/* Luxury Premium CTA */}
      <motion.div 
        className="relative p-5 bg-gradient-to-r from-luxury-primary/20 via-luxury-accent/20 to-luxury-primary/20 border-t border-luxury-primary/30 backdrop-blur-sm overflow-hidden"
        whileHover={{ scale: 1.01 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        {/* Background glow */}
        <div className="absolute inset-0 bg-luxury-primary/5 opacity-50" />
        
        <div className="relative flex items-center justify-between">
          <div className="flex-1">
            <p className="text-white font-bold text-lg mb-1">Unlock Full Access</p>
            <p className="text-luxury-neutral text-sm mb-2">Join thousands of premium members</p>
            <div className="flex items-center gap-3 text-xs text-luxury-neutral/80">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-luxury-accent rounded-full"></span>
                Unlimited posts
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-luxury-accent rounded-full"></span>
                4K quality
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-luxury-accent rounded-full"></span>
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
              className="bg-gradient-to-r from-luxury-primary to-luxury-accent hover:from-luxury-secondary hover:to-luxury-accent text-white font-bold px-8 py-3 rounded-xl shadow-luxury transform transition-all duration-200 border border-luxury-primary/30"
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
      </motion.div>
    </Card>
  );
};