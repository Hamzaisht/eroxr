
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Crown, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePlatformSubscription } from '@/hooks/usePlatformSubscription';
import { useNavigate } from 'react-router-dom';

export const PremiumSuccess = () => {
  const { refreshSubscription } = usePlatformSubscription();
  const navigate = useNavigate();

  useEffect(() => {
    // Refresh subscription status when user lands here
    setTimeout(() => {
      refreshSubscription();
    }, 2000);
  }, [refreshSubscription]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-luxury-darker via-luxury-dark to-luxury-darker flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-md w-full text-center space-y-8 bg-luxury-dark/50 backdrop-blur-xl rounded-3xl p-8 border border-luxury-primary/20"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          className="flex justify-center"
        >
          <div className="relative">
            <div className="p-4 rounded-full bg-green-500/20 border border-green-500/30">
              <CheckCircle className="w-16 h-16 text-green-400" />
            </div>
            <div className="absolute -top-2 -right-2">
              <Crown className="w-8 h-8 text-amber-400" />
            </div>
          </div>
        </motion.div>

        <div className="space-y-4">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-3xl font-bold text-white flex items-center justify-center gap-2"
          >
            <Sparkles className="w-6 h-6 text-amber-400" />
            Welcome to Premium!
            <Sparkles className="w-6 h-6 text-amber-400" />
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-slate-300 text-lg"
          >
            Your subscription has been activated successfully. You now have access to all premium features!
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-2 gap-3 text-sm text-slate-300"
        >
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            Direct messaging
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            Media viewing
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            Full platform access
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            No ads
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Button
            onClick={() => navigate('/home')}
            className="w-full bg-gradient-to-r from-luxury-primary to-luxury-accent hover:from-luxury-primary/90 hover:to-luxury-accent/90 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Start Exploring
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};
