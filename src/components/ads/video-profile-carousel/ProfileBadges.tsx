
import { motion } from 'framer-motion';
import { Award, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { DatingAd } from '../types/dating';

interface ProfileBadgesProps {
  ad: DatingAd;
}

export const ProfileBadges = ({ ad }: ProfileBadgesProps) => {
  return (
    <motion.div 
      className="absolute top-3 right-3 z-30 flex flex-col gap-2"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 }}
    >
      {(ad.isPremium || ad.is_premium) && (
        <Badge className="bg-gradient-to-r from-purple-500 to-purple-700 text-white px-3 py-1 flex items-center gap-1 shadow-lg">
          <Award className="w-3.5 h-3.5" />
          <span>Premium</span>
        </Badge>
      )}
      
      {(ad.isVerified || ad.is_verified) && (
        <Badge className="bg-gradient-to-r from-green-500 to-green-700 text-white px-3 py-1 flex items-center gap-1 shadow-lg">
          <CheckCircle className="w-3.5 h-3.5" />
          <span>Verified</span>
        </Badge>
      )}
    </motion.div>
  );
};
