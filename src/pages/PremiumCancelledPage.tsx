
import { motion } from 'framer-motion';
import { XCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function PremiumCancelledPage() {
  const navigate = useNavigate();

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
          <div className="p-4 rounded-full bg-red-500/20 border border-red-500/30">
            <XCircle className="w-16 h-16 text-red-400" />
          </div>
        </motion.div>

        <div className="space-y-4">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-3xl font-bold text-white"
          >
            Subscription Cancelled
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-slate-300 text-lg"
          >
            No worries! You can always upgrade to premium later to unlock all features.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-3"
        >
          <Button
            onClick={() => navigate('/home')}
            className="w-full bg-luxury-primary hover:bg-luxury-primary/90 text-white font-semibold py-3 rounded-xl"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          
          <Button
            onClick={() => navigate('/premium')}
            variant="outline"
            className="w-full border-luxury-primary/30 text-luxury-primary hover:bg-luxury-primary/10"
          >
            View Premium Benefits
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
