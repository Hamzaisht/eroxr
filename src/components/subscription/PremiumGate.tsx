
import { motion } from 'framer-motion';
import { Crown, Lock, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePlatformSubscription } from '@/hooks/usePlatformSubscription';
import { useToast } from '@/hooks/use-toast';

interface PremiumGateProps {
  children: React.ReactNode;
  feature: string;
  showUpgrade?: boolean;
}

export const PremiumGate = ({ children, feature, showUpgrade = true }: PremiumGateProps) => {
  const { hasPremium, createPlatformSubscription, isLoading } = usePlatformSubscription();
  const { toast } = useToast();

  if (hasPremium) {
    return <>{children}</>;
  }

  const handleUpgrade = async () => {
    try {
      await createPlatformSubscription();
      toast({
        title: "Redirecting to checkout",
        description: "You'll be redirected to complete your premium subscription.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to start subscription process",
        variant: "destructive",
      });
    }
  };

  if (!showUpgrade) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative p-8 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5 rounded-2xl" />
      
      <div className="relative z-10 text-center space-y-6">
        <div className="flex justify-center">
          <div className="p-3 rounded-full bg-amber-500/20 border border-amber-500/30">
            <Crown className="w-8 h-8 text-amber-400" />
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-400" />
            Premium Access Required
            <Sparkles className="w-6 h-6 text-amber-400" />
          </h3>
          <p className="text-slate-300 text-lg">
            Unlock {feature} and all premium features for just <span className="font-bold text-amber-400">49 SEK/month</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-300 max-w-md mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-amber-400 rounded-full" />
            Direct messaging
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-amber-400 rounded-full" />
            Media viewing
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-amber-400 rounded-full" />
            Full platform access
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-amber-400 rounded-full" />
            No ads
          </div>
        </div>

        <Button
          onClick={handleUpgrade}
          disabled={isLoading}
          className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Processing...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Crown className="w-5 h-5" />
              Upgrade to Premium
            </div>
          )}
        </Button>

        <p className="text-xs text-slate-400">
          Cancel anytime • Secure payment via Stripe
        </p>
      </div>
    </motion.div>
  );
};
