
import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { AnimatedCounter } from "./AnimatedCounter";

export const ROICalculator = () => {
  const [subscribers, setSubscribers] = useState(100);
  const [pricePoint, setPricePoint] = useState(9.99);
  const prefersReducedMotion = useReducedMotion();
  
  // Memoize calculations to avoid re-rendering
  const monthlyRevenue = useCallback(() => {
    return subscribers * pricePoint * 0.8; // Assuming 20% platform fee
  }, [subscribers, pricePoint]);
  
  const yearlyRevenue = useCallback(() => {
    return monthlyRevenue() * 12;
  }, [monthlyRevenue]);
  
  const subscriberOptions = [50, 100, 500, 1000, 5000];
  const priceOptions = [4.99, 9.99, 14.99, 19.99, 29.99];
  
  // Use transform instead of margin/position for better performance
  const animations = prefersReducedMotion
    ? { 
        initial: { opacity: 0 },
        whileInView: { opacity: 1 },
        transition: { duration: 0.3 }
      }
    : {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        transition: { duration: 0.5 }
      };
  
  return (
    <motion.div 
      className="w-full max-w-3xl mx-auto glass-effect rounded-2xl p-6 sm:p-8"
      {...animations}
    >
      <div className="grid gap-8 sm:grid-cols-2">
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-3">Number of Subscribers</h3>
            <div className="flex flex-wrap gap-2">
              {subscriberOptions.map((option) => (
                <Button
                  key={option}
                  variant={subscribers === option ? "premium" : "outline"}
                  size="sm"
                  onClick={() => setSubscribers(option)}
                  className="min-w-[70px]"
                >
                  {option.toLocaleString()}
                </Button>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-3">Monthly Subscription Price</h3>
            <div className="flex flex-wrap gap-2">
              {priceOptions.map((option) => (
                <Button
                  key={option}
                  variant={pricePoint === option ? "premium" : "outline"}
                  size="sm"
                  onClick={() => setPricePoint(option)}
                  className="min-w-[70px]"
                >
                  ${option}
                </Button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex flex-col justify-center items-center p-6 rounded-xl bg-luxury-primary/10 border border-luxury-primary/30">
          <p className="text-lg text-luxury-neutral/80 mb-2">Monthly Revenue</p>
          <div className="text-4xl sm:text-5xl font-display font-bold">
            <AnimatedCounter 
              endValue={monthlyRevenue()}
              prefix="$"
              duration={1200}
              formatter={(value) => value.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              className="bg-gradient-to-r from-white to-luxury-neutral bg-clip-text text-transparent"
            />
          </div>
          
          <div className="h-px w-3/4 bg-luxury-primary/20 my-6" />
          
          <p className="text-lg text-luxury-neutral/80 mb-2">Yearly Revenue</p>
          <div className="text-4xl sm:text-5xl font-display font-bold">
            <AnimatedCounter 
              endValue={yearlyRevenue()}
              prefix="$"
              duration={1500}
              formatter={(value) => value.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              className="bg-gradient-to-r from-white to-luxury-neutral bg-clip-text text-transparent"
            />
          </div>
        </div>
      </div>
      
      <div className="mt-6 text-center text-luxury-neutral/70 text-sm">
        * Revenue estimates assume an 80% creator payout rate after platform fees. Actual results may vary.
      </div>
    </motion.div>
  );
};

export default ROICalculator;
