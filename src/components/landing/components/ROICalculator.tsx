
import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DollarSign } from "lucide-react";

export const ROICalculator = () => {
  const [subscribers, setSubscribers] = useState<number>(100);
  const [pricePerSub, setPricePerSub] = useState<number>(5);
  
  const monthlyEarnings = subscribers * pricePerSub;
  const yearlyEarnings = monthlyEarnings * 12;
  
  return (
    <div className="w-full max-w-lg mx-auto p-6 rounded-2xl bg-luxury-dark/50 backdrop-blur-xl border border-luxury-primary/20">
      <h3 className="text-2xl font-bold text-white mb-6">Calculate Your Potential</h3>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-luxury-neutral mb-2">
            Number of Subscribers
          </label>
          <Input
            type="number"
            min="0"
            value={subscribers}
            onChange={(e) => setSubscribers(Number(e.target.value))}
            className="bg-luxury-darker/50 border-luxury-primary/30 text-white"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-luxury-neutral mb-2">
            Price per Subscription ($)
          </label>
          <Input
            type="number"
            min="0"
            step="0.5"
            value={pricePerSub}
            onChange={(e) => setPricePerSub(Number(e.target.value))}
            className="bg-luxury-darker/50 border-luxury-primary/30 text-white"
          />
        </div>
        
        <div className="pt-6">
          <motion.div 
            className="p-4 rounded-xl bg-gradient-to-r from-luxury-primary/10 to-luxury-accent/10 border border-luxury-primary/20"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-luxury-neutral">Monthly Earnings</span>
              <span className="text-2xl font-bold text-white flex items-center">
                <DollarSign className="w-5 h-5 text-luxury-primary mr-1" />
                {monthlyEarnings.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-luxury-neutral">Yearly Earnings</span>
              <span className="text-2xl font-bold text-white flex items-center">
                <DollarSign className="w-5 h-5 text-luxury-primary mr-1" />
                {yearlyEarnings.toLocaleString()}
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
