import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Eye, MessageCircle, Heart, Share2, Sparkles, ArrowRight, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePlatformSubscription } from '@/hooks/usePlatformSubscription';
import { useToast } from '@/hooks/use-toast';

interface FreemiumTeaserProps {
  children: React.ReactNode;
  contentType?: 'post' | 'media' | 'chat' | 'upload';
  className?: string;
}

export const FreemiumTeaser = ({ children, contentType = 'post', className = "" }: FreemiumTeaserProps) => {
  const { createPlatformSubscription, isLoading } = usePlatformSubscription();
  const { toast } = useToast();

  const handleUpgrade = async () => {
    try {
      await createPlatformSubscription();
      toast({
        title: "Redirecting to checkout",
        description: "Upgrade to unlock all premium features!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to start subscription process",
        variant: "destructive",
      });
    }
  };

  const getContentConfig = () => {
    switch (contentType) {
      case 'media':
        return {
          title: 'Premium Media',
          description: 'High-quality photos and videos await',
          icon: Eye,
          action: 'View Premium Content'
        };
      case 'chat':
        return {
          title: 'Direct Messaging',
          description: 'Connect directly with creators',
          icon: MessageCircle,
          action: 'Start Chatting'
        };
      case 'upload':
        return {
          title: 'Content Creation',
          description: 'Share your own amazing content',
          icon: Share2,
          action: 'Start Creating'
        };
      default:
        return {
          title: 'Premium Posts',
          description: 'Exclusive content from your favorite creators',
          icon: Heart,
          action: 'Unlock All Posts'
        };
    }
  };

  const config = getContentConfig();
  const IconComponent = config.icon;

  return (
    <div className={`relative ${className}`}>
      {/* Blurred content underneath */}
      <div className="filter blur-md select-none pointer-events-none opacity-60">
        {children}
      </div>
      
      {/* Premium overlay */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60 backdrop-blur-sm rounded-2xl flex items-center justify-center"
      >
        <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 backdrop-blur-md border border-amber-500/20 rounded-2xl p-6 max-w-sm mx-4 text-center">
          {/* Icon with glow effect */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="relative mx-auto w-16 h-16 mb-4"
          >
            <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-xl" />
            <div className="relative bg-gradient-to-br from-amber-500 to-orange-500 rounded-full p-3">
              <IconComponent className="w-10 h-10 text-white" />
            </div>
          </motion.div>

          {/* Premium badge */}
          <div className="flex items-center justify-center gap-2 mb-3">
            <Crown className="w-4 h-4 text-amber-400" />
            <span className="text-amber-400 font-semibold text-sm uppercase tracking-wider">Premium</span>
            <Crown className="w-4 h-4 text-amber-400" />
          </div>

          {/* Title and description */}
          <h3 className="text-xl font-bold text-white mb-2">{config.title}</h3>
          <p className="text-slate-300 text-sm mb-4">{config.description}</p>

          {/* Quick benefits */}
          <div className="space-y-2 mb-6 text-xs text-slate-400">
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Unlimited access</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Users className="w-3 h-3 text-amber-400" />
              <span>Direct creator messaging</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Eye className="w-3 h-3 text-amber-400" />
              <span>HD media & exclusive content</span>
            </div>
          </div>

          {/* CTA Button */}
          <Button
            onClick={handleUpgrade}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <Crown className="w-4 h-4" />
                <span>{config.action}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            )}
          </Button>

          {/* Pricing hint */}
          <p className="text-xs text-slate-400 mt-3">
            From <span className="font-semibold text-amber-400">49 SEK/month</span> • Cancel anytime
          </p>
        </div>
      </motion.div>
    </div>
  );
};