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

      {/* Content Preview - Blurred */}
      <div className="px-4 pb-2">
        <div className="relative">
          <p className="text-luxury-neutral filter blur-sm select-none">
            {preview.content.substring(0, 100)}...
          </p>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-luxury-darker" />
        </div>
      </div>

      {/* Media Preview */}
      {preview.hasMedia && (
        <div className="px-4 pb-2">
          <div className="relative bg-luxury-dark rounded-lg overflow-hidden">
            <div className="h-48 bg-gradient-to-br from-luxury-primary/20 to-luxury-accent/20 filter blur-md" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-black/60 backdrop-blur-sm rounded-lg p-4 text-center">
                <Lock className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                <p className="text-white font-medium text-sm">
                  {preview.mediaCount} Premium {preview.mediaCount === 1 ? 'Media' : 'Media Items'}
                </p>
                <p className="text-slate-300 text-xs">HD Quality • Exclusive Content</p>
              </div>
            </div>
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

      {/* Premium Unlock CTA */}
      <motion.div 
        className="p-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-t border-amber-500/20"
        whileHover={{ scale: 1.02 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white font-medium text-sm">See full post</p>
            <p className="text-slate-300 text-xs">Join to unlock all content</p>
          </div>
          <Button
            onClick={handleUpgrade}
            disabled={isLoading}
            size="sm"
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium px-4 py-2 rounded-lg"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Crown className="w-4 h-4 mr-1" />
                Unlock
              </>
            )}
          </Button>
        </div>
      </motion.div>
    </Card>
  );
};