
import { motion } from "framer-motion";
import { Award, ArrowRight, CheckCircle, Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PremiumPromoBannerProps {
  onSubscriptionClick: () => void;
}

export const PremiumPromoBanner = ({ onSubscriptionClick }: PremiumPromoBannerProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="w-full bg-gradient-to-r from-purple-500/30 to-purple-700/30 rounded-lg p-5 flex flex-col sm:flex-row justify-between items-center shadow-lg border border-purple-500/30"
    >
      <div className="flex items-center gap-4 mb-4 sm:mb-0">
        <div className="bg-purple-600/20 p-3 rounded-full">
          <Award className="h-8 w-8 text-purple-400" />
        </div>
        <div>
          <h3 className="font-bold text-xl text-white mb-1">Get Access Now – 59 SEK/month</h3>
          <div className="flex flex-col gap-1">
            <p className="text-sm text-luxury-neutral flex items-center gap-1">
              <CheckCircle className="h-3 w-3 text-green-400" /> Cancel anytime, instant access
            </p>
            <p className="text-sm text-luxury-neutral flex items-center gap-1">
              <Users className="h-3 w-3 text-green-400" /> 
              <span>Over 1,000 users subscribed this week!</span>
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 w-full sm:w-auto">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-purple-500 to-purple-700 text-white px-6 py-3 rounded-md text-lg font-medium flex items-center justify-center gap-2 w-full sm:w-auto shadow-lg"
          onClick={onSubscriptionClick}
        >
          Unlock BD Ads <ArrowRight className="h-5 w-5 ml-1" />
        </motion.button>
        <div className="text-xs text-center text-luxury-neutral/70 flex items-center justify-center gap-1">
          <Clock className="h-3 w-3" /> Limited-time offer
        </div>
      </div>
    </motion.div>
  );
};
