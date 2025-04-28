
import { useState, useCallback, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { AnimatedCounter } from "./AnimatedCounter";

export const ROICalculator = () => {
  const [subscribers, setSubscribers] = useState(100);
  const [pricePoint, setPricePoint] = useState(9.99);
  const prefersReducedMotion = useReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const monthlyRevenue = useCallback(() => {
    return subscribers * pricePoint * 0.8;
  }, [subscribers, pricePoint]);
  
  const yearlyRevenue = useCallback(() => {
    return monthlyRevenue() * 12;
  }, [monthlyRevenue]);
  
  const subscriberOptions = [50, 100, 500, 1000, 5000];
  const priceOptions = [4.99, 9.99, 14.99, 19.99, 29.99];
  
  // Handle mouse movement for 3D effect
  useEffect(() => {
    if (prefersReducedMotion) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!cardRef.current) return;
      
      const rect = cardRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Calculate distance from center as percentage
      const x = ((e.clientX - centerX) / rect.width) * 8; // Reduced from 10 to 8 degrees for more subtle effect
      const y = ((centerY - e.clientY) / rect.height) * 8;
      
      setMousePosition({ x, y });
    };

    const handleMouseLeave = () => {
      // Smooth return to original position
      setMousePosition({ x: 0, y: 0 });
    };

    const currentCard = cardRef.current;
    if (currentCard) {
      currentCard.addEventListener("mousemove", handleMouseMove);
      currentCard.addEventListener("mouseleave", handleMouseLeave);
      return () => {
        currentCard.removeEventListener("mousemove", handleMouseMove);
        currentCard.removeEventListener("mouseleave", handleMouseLeave);
      };
    }
  }, [prefersReducedMotion]);

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
      <div className="relative group" ref={cardRef}>
        {/* Removed the gradient background container */}
        
        <motion.div 
          className="relative backdrop-blur-lg bg-black/30 rounded-2xl p-8 shadow-[0_0_50px_rgba(155,135,245,0.15)] transition-all duration-500"
          style={{
            transform: prefersReducedMotion ? "none" : `perspective(1000px) rotateY(${mousePosition.x}deg) rotateX(${mousePosition.y}deg)`,
            transition: "transform 0.2s ease-out",
            boxShadow: "0 10px 30px -5px rgba(0, 0, 0, 0.3), 0 0 50px -10px rgba(155, 135, 245, 0.25)"
          }}
        >
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 bg-gradient-to-r from-white to-luxury-neutral/80 bg-clip-text text-transparent drop-shadow-sm">
                  Number of Subscribers
                </h3>
                <div className="flex flex-wrap gap-2">
                  {subscriberOptions.map((option) => (
                    <Button
                      key={option}
                      variant={subscribers === option ? "premium" : "outline"}
                      size="sm"
                      onClick={() => setSubscribers(option)}
                      className="min-w-[80px] relative overflow-hidden group shadow-md hover:shadow-lg"
                    >
                      <span className="relative z-10 font-medium">{option.toLocaleString()}</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-luxury-primary to-luxury-accent opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                    </Button>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4 bg-gradient-to-r from-white to-luxury-neutral/80 bg-clip-text text-transparent drop-shadow-sm">
                  Monthly Subscription Price
                </h3>
                <div className="flex flex-wrap gap-2">
                  {priceOptions.map((option) => (
                    <Button
                      key={option}
                      variant={pricePoint === option ? "premium" : "outline"}
                      size="sm"
                      onClick={() => setPricePoint(option)}
                      className="min-w-[80px] relative overflow-hidden group shadow-md hover:shadow-lg"
                    >
                      <span className="relative z-10 font-medium">${option}</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-luxury-primary to-luxury-accent opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="relative">
              {/* Enhanced inner card with better contrast */}
              <div className="absolute inset-0 bg-gradient-to-br from-luxury-primary/15 via-luxury-accent/10 to-transparent rounded-xl" />
              <div className="relative p-6 rounded-xl backdrop-blur-md border border-white/15 shadow-lg">
                <div className="space-y-8">
                  <div className="text-center">
                    <p className="text-lg text-white/90 mb-2 font-medium">Monthly Revenue</p>
                    <div className="text-4xl sm:text-5xl font-display font-bold">
                      <AnimatedCounter 
                        endValue={monthlyRevenue()}
                        prefix="$"
                        duration={1200}
                        formatter={(value) => value.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        className="bg-gradient-to-r from-white via-luxury-neutral to-white bg-clip-text text-transparent drop-shadow-sm"
                      />
                    </div>
                  </div>
                  
                  <div className="h-px w-full bg-gradient-to-r from-transparent via-luxury-primary/30 to-transparent" />
                  
                  <div className="text-center">
                    <p className="text-lg text-white/90 mb-2 font-medium">Yearly Revenue</p>
                    <div className="text-4xl sm:text-5xl font-display font-bold">
                      <AnimatedCounter 
                        endValue={yearlyRevenue()}
                        prefix="$"
                        duration={1500}
                        formatter={(value) => value.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        className="bg-gradient-to-r from-white via-luxury-neutral to-white bg-clip-text text-transparent drop-shadow-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 text-center text-white/70 text-sm">
            * Revenue estimates assume an 80% creator payout rate after platform fees. Actual results may vary.
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ROICalculator;
