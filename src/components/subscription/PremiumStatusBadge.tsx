import { Crown, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { usePlatformSubscription } from '@/hooks/usePlatformSubscription';
import { useNavigate } from 'react-router-dom';

export const PremiumStatusBadge = () => {
  const { hasPremium, isLoading } = usePlatformSubscription();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-700/50 animate-pulse">
        <div className="w-4 h-4 bg-slate-600 rounded-full" />
        <div className="w-16 h-3 bg-slate-600 rounded" />
      </div>
    );
  }

  if (hasPremium) {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30"
      >
        <Crown className="w-4 h-4 text-amber-400" />
        <span className="text-amber-400 font-medium text-sm">Premium</span>
        <Star className="w-3 h-3 text-amber-400" />
      </motion.div>
    );
  }

  return (
    <Button
      onClick={() => navigate('/subscription')}
      variant="outline"
      size="sm"
      className="flex items-center gap-2 border-amber-500/30 text-amber-400 hover:bg-amber-500/10 hover:border-amber-500/50"
    >
      <Crown className="w-4 h-4" />
      <span className="text-sm">Upgrade</span>
    </Button>
  );
};