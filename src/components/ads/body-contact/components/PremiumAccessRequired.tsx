
import { useNavigate } from "react-router-dom";
import { Shield, AlertCircle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BodyContactAccessCheckResult } from "../types";

interface PremiumAccessRequiredProps {
  accessResult: BodyContactAccessCheckResult;
}

export const PremiumAccessRequired = ({ accessResult }: PremiumAccessRequiredProps) => {
  const navigate = useNavigate();
  
  const isNotLoggedIn = accessResult.reasonCodes.includes("NOT_LOGGED_IN");
  const isNotVerified = accessResult.reasonCodes.includes("NOT_VERIFIED");
  const isNotPremium = accessResult.reasonCodes.includes("NOT_PREMIUM");

  return (
    <div className="p-6 rounded-xl glass-effect space-y-6">
      <div className="flex items-center gap-3 text-luxury-primary">
        <Shield className="h-8 w-8" />
        <h2 className="text-2xl font-bold">Premium Access Required</h2>
      </div>
      
      <p className="text-luxury-neutral">
        Body Contact is an exclusive feature for verified premium members.
      </p>
      
      <div className="space-y-3 mt-4">
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
      
      <div className="flex flex-col sm:flex-row gap-3 mt-4">
        {isNotLoggedIn && (
          <Button 
            onClick={() => navigate('/login')}
            className="bg-gradient-to-r from-luxury-primary to-luxury-accent text-white"
          >
            Sign In
          </Button>
        )}
        
        {!isNotLoggedIn && isNotVerified && (
          <Button 
            onClick={() => navigate('/verification')}
            className="bg-gradient-to-r from-luxury-primary to-luxury-accent text-white"
          >
            Verify ID
          </Button>
        )}
        
        {!isNotLoggedIn && isNotPremium && (
          <Button 
            onClick={() => navigate('/subscription')}
            className="bg-gradient-to-r from-luxury-primary to-luxury-accent text-white"
          >
            Upgrade to Premium
          </Button>
        )}
      </div>
      
      <p className="text-sm text-luxury-neutral/80 mt-4">
        Premium members enjoy exclusive Body Contact features for only 59 SEK/month.
      </p>
    </div>
  );
};
