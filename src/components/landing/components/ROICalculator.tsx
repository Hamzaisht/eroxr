
import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { AnimatedCounter } from "./AnimatedCounter";

export const ROICalculator = () => {
  const [subscribers, setSubscribers] = useState(100);
  const [pricePoint, setPricePoint] = useState(9.99);
  const prefersReducedMotion = useReducedMotion();
  
  const monthlyRevenue = useCallback(() => {
    return subscribers * pricePoint * 0.8;
  }, [subscribers, pricePoint]);
  
  const yearlyRevenue = useCallback(() => {
    return monthlyRevenue() * 12;
  }, [monthlyRevenue]);
  
  const subscriberOptions = [50, 100, 500, 1000, 5000];
  const priceOptions = [4.99, 9.99, 14.99, 19.99, 29.99];
  
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
      className="w-full max-w-4xl mx-auto"
      {...animations}
    >
      <div className="relative group">
        {/* 3D Card Effect Container */}
        <div className="absolute inset-0 bg-gradient-to-r from-luxury-primary/20 via-luxury-accent/20 to-luxury-primary/20 rounded-2xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="relative backdrop-blur-xl bg-black/20 rounded-2xl p-8 border border-white/10 shadow-[0_0_50px_rgba(155,135,245,0.1)] transform hover:translate-y-[-2px] hover:shadow-[0_0_80px_rgba(155,135,245,0.2)] transition-all duration-500">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 bg-gradient-to-r from-white to-luxury-neutral/80 bg-clip-text text-transparent">
                  Number of Subscribers
                </h3>
                <div className="flex flex-wrap gap-2">
                  {subscriberOptions.map((option) => (
                    <Button
                      key={option}
                      variant={subscribers === option ? "premium" : "outline"}
                      size="sm"
                      onClick={() => setSubscribers(option)}
                      className="min-w-[80px] relative overflow-hidden group"
                    >
                      <span className="relative z-10">{option.toLocaleString()}</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-luxury-primary to-luxury-accent opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                    </Button>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4 bg-gradient-to-r from-white to-luxury-neutral/80 bg-clip-text text-transparent">
                  Monthly Subscription Price
                </h3>
                <div className="flex flex-wrap gap-2">
                  {priceOptions.map((option) => (
                    <Button
                      key={option}
                      variant={pricePoint === option ? "premium" : "outline"}
                      size="sm"
                      onClick={() => setPricePoint(option)}
                      className="min-w-[80px] relative overflow-hidden group"
                    >
                      <span className="relative z-10">${option}</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-luxury-primary to-luxury-accent opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-luxury-primary/10 via-luxury-accent/5 to-transparent rounded-xl" />
              <div className="relative p-6 rounded-xl backdrop-blur-sm border border-white/10">
                <div className="space-y-8">
                  <div className="text-center">
                    <p className="text-lg text-luxury-neutral/80 mb-2">Monthly Revenue</p>
                    <div className="text-4xl sm:text-5xl font-display font-bold">
                      <AnimatedCounter 
                        endValue={monthlyRevenue()}
                        prefix="$"
                        duration={1200}
                        formatter={(value) => value.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        className="bg-gradient-to-r from-white via-luxury-neutral to-white bg-clip-text text-transparent"
                      />
                    </div>
                  </div>
                  
                  <div className="h-px w-full bg-gradient-to-r from-transparent via-luxury-primary/20 to-transparent" />
                  
                  <div className="text-center">
                    <p className="text-lg text-luxury-neutral/80 mb-2">Yearly Revenue</p>
                    <div className="text-4xl sm:text-5xl font-display font-bold">
                      <AnimatedCounter 
                        endValue={yearlyRevenue()}
                        prefix="$"
                        duration={1500}
                        formatter={(value) => value.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        className="bg-gradient-to-r from-white via-luxury-neutral to-white bg-clip-text text-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 text-center text-luxury-neutral/60 text-sm">
            * Revenue estimates assume an 80% creator payout rate after platform fees. Actual results may vary.
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ROICalculator;
