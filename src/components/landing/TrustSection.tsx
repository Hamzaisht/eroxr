
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { useCounterAnimation } from "@/hooks/use-counter-animation";
import { Lock, Shield, CreditCard } from "lucide-react";

export const TrustSection = () => {
  const [ref, isInView] = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.2,
    triggerOnce: true,
  });
  
  const sectionRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);
  
  const earningsCounter = useCounterAnimation(12500000, { 
    duration: 3000,
    formatter: (value) => `$${Math.floor(value).toLocaleString()}`
  });
  
  const creatorsCounter = useCounterAnimation(15700, { 
    duration: 2500,
    formatter: (value) => `${Math.floor(value).toLocaleString()}+`
  });
  
  const payoutsCounter = useCounterAnimation(98.7, { 
    duration: 3000,
    formatter: (value) => `${value.toFixed(1)}%`
  });
  
  const trustItems = [
    {
      icon: <Lock className="w-10 h-10 text-luxury-primary" />,
      title: "Encrypted & Private",
      description:
        "Military-grade encryption protects your content from unauthorized access. Your data is private and secure.",
    },
    {
      icon: <Shield className="w-10 h-10 text-luxury-primary" />,
      title: "Content Ownership",
      description:
        "You own what you create. We never claim rights to your content or share it with third parties.",
    },
    {
      icon: <CreditCard className="w-10 h-10 text-luxury-primary" />,
      title: "Fast, Reliable Payouts",
      description:
        "Get paid on time, every time with flexible payout options and the lowest fees in the industry.",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative py-24 px-4 sm:px-6"
    >
      <div ref={ref} className="container mx-auto max-w-7xl">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            <span className="text-white">Why Choose </span>
            <span className="bg-gradient-to-r from-luxury-primary to-luxury-accent bg-clip-text text-transparent">
              Eroxr?
            </span>
          </h2>
          <p className="text-luxury-neutral text-lg max-w-2xl mx-auto">
            We prioritize your security, ownership, and financial success
          </p>
        </motion.div>

        {/* Stats Counter Row */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ y }}
        >
          {/* Total Creator Earnings */}
          <div className="flex flex-col items-center p-6 bg-gradient-to-br from-luxury-dark to-luxury-darker border border-luxury-primary/10 rounded-xl">
            <h3 className="text-2xl font-bold text-luxury-neutral mb-2">Total Creator Earnings</h3>
            <p className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-luxury-primary to-luxury-accent bg-clip-text text-transparent animate-pulse">
              {earningsCounter.displayValue}
            </p>
          </div>
          
          {/* Active Creators */}
          <div className="flex flex-col items-center p-6 bg-gradient-to-br from-luxury-dark to-luxury-darker border border-luxury-primary/10 rounded-xl">
            <h3 className="text-2xl font-bold text-luxury-neutral mb-2">Active Creators</h3>
            <p className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-luxury-primary to-luxury-accent bg-clip-text text-transparent animate-pulse">
              {creatorsCounter.displayValue}
            </p>
          </div>
          
          {/* Payout Success Rate */}
          <div className="flex flex-col items-center p-6 bg-gradient-to-br from-luxury-dark to-luxury-darker border border-luxury-primary/10 rounded-xl">
            <h3 className="text-2xl font-bold text-luxury-neutral mb-2">Payout Success Rate</h3>
            <p className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-luxury-primary to-luxury-accent bg-clip-text text-transparent animate-pulse">
              {payoutsCounter.displayValue}
            </p>
          </div>
        </motion.div>

        {/* Trust Items */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {trustItems.map((item, i) => (
            <motion.div
              key={i}
              className="flex flex-col items-center text-center p-8"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.3 + i * 0.1 }}
            >
              <motion.div 
                className="mb-6 p-4 rounded-full bg-luxury-dark/80 border border-luxury-primary/20 shadow-[0_0_20px_rgba(155,135,245,0.15)]"
                whileHover={{ 
                  scale: 1.1,
                  rotate: 5,
                  boxShadow: "0 0 30px rgba(155,135,245,0.3)"
                }}
              >
                {item.icon}
              </motion.div>
              <h3 className="text-2xl font-bold text-white mb-3">{item.title}</h3>
              <p className="text-luxury-neutral">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 rounded-full bg-luxury-primary/5 blur-3xl -z-10" />
    </section>
  );
};
