
import { useNavigate } from "react-router-dom";
import { Shield, AlertCircle, Check, Award, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BodyContactAccessCheckResult } from "../types";
import { motion } from "framer-motion";

interface PremiumAccessRequiredProps {
  accessResult: BodyContactAccessCheckResult;
}

export const PremiumAccessRequired = ({ accessResult }: PremiumAccessRequiredProps) => {
  const navigate = useNavigate();
  
  const isNotLoggedIn = accessResult.reasonCodes.includes("NOT_LOGGED_IN");
  const isNotVerified = accessResult.reasonCodes.includes("NOT_VERIFIED");
  const isNotPremium = accessResult.reasonCodes.includes("NOT_PREMIUM");

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="p-8 rounded-xl glass-effect space-y-6 border border-luxury-primary/20 bg-black/30"
    >
      <div className="flex items-center gap-3 text-luxury-primary">
        <Award className="h-10 w-10 text-purple-400" />
        <h2 className="text-2xl font-bold bg-gradient-to-r from-luxury-primary to-luxury-accent bg-clip-text text-transparent">
          Eroxr BD Ads are for Premium & Verified Users 💎
        </h2>
      </div>
      
      <p className="text-luxury-neutral text-lg">
        Upgrade for just 59 SEK/month – Cancel Anytime, Instant Access
      </p>
      
      <div className="space-y-4 mt-4 bg-black/20 p-4 rounded-lg">
        <h3 className="font-semibold text-luxury-neutral mb-3">Membership Status:</h3>
        
        <div className="flex items-center gap-2">
          {isNotLoggedIn ? (
            <AlertCircle className="h-5 w-5 text-red-500" />
          ) : (
            <Check className="h-5 w-5 text-green-500" />
          )}
          <span className={isNotLoggedIn ? "text-red-500" : "text-green-500"}>
            Active account
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          {isNotVerified ? (
            <AlertCircle className="h-5 w-5 text-red-500" />
          ) : (
            <Check className="h-5 w-5 text-green-500" />
          )}
          <span className={isNotVerified ? "text-red-500" : "text-green-500"}>
            ID or selfie verification
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          {isNotPremium ? (
            <AlertCircle className="h-5 w-5 text-red-500" />
          ) : (
            <Check className="h-5 w-5 text-green-500" />
          )}
          <span className={isNotPremium ? "text-red-500" : "text-green-500"}>
            Premium subscription
          </span>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3 mt-6">
        {isNotLoggedIn && (
          <Button 
            onClick={() => navigate('/login')}
            className="bg-gradient-to-r from-luxury-primary to-luxury-accent text-white py-6 px-8 text-lg rounded-full hover:shadow-[0_0_20px_rgba(155,135,245,0.4)]"
          >
            Sign In
          </Button>
        )}
        
        {!isNotLoggedIn && (isNotVerified || isNotPremium) && (
          <motion.div className="flex flex-col sm:flex-row gap-4 w-full">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/subscription')}
              className="flex-1 py-4 px-8 bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-lg font-medium text-lg flex items-center justify-center gap-2"
            >
              Upgrade Now <ArrowRight className="h-5 w-5 ml-1" />
            </motion.button>
            
            <Button
              variant="outline"
              onClick={() => navigate('/verification')}
              className="flex-1 py-4 border-luxury-primary/50 text-luxury-neutral hover:text-white hover:bg-luxury-primary/20"
            >
              Learn More
            </Button>
          </motion.div>
        )}
      </div>
      
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
        <div className="p-4 rounded-lg bg-black/30 border border-luxury-primary/10">
          <h4 className="font-medium text-luxury-primary mb-1">Create BD Ads</h4>
          <p className="text-sm text-luxury-neutral/80">Connect with singles and couples</p>
        </div>
        
        <div className="p-4 rounded-lg bg-black/30 border border-luxury-primary/10">
          <h4 className="font-medium text-luxury-primary mb-1">ID Verified</h4>
          <p className="text-sm text-luxury-neutral/80">Connect with real people</p>
        </div>
        
        <div className="p-4 rounded-lg bg-black/30 border border-luxury-primary/10">
          <h4 className="font-medium text-luxury-primary mb-1">Instant Access</h4>
          <p className="text-sm text-luxury-neutral/80">Start connecting today</p>
        </div>
      </div>
      
      <p className="text-sm text-luxury-neutral/70 text-center mt-4">
        Premium members enjoy exclusive Body Contact features for only 59 SEK/month.
        <br />Cancel anytime with no commitments.
      </p>
    </motion.div>
  );
};
