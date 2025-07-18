import { motion, useInView } from "framer-motion";
import { Check, Star, Crown, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";

interface PricingTier {
  name: string;
  price: string;
  yearlyPrice: string;
  description: string;
  features: string[];
  icon: React.ReactNode;
  popular?: boolean;
  gradient: string;
}

const pricingTiers: PricingTier[] = [
  {
    name: "Explorer",
    price: "Free",
    yearlyPrice: "Free",
    description: "Perfect for getting started",
    features: [
      "Access to exclusive content",
      "Basic messaging",
      "Mobile app access",
      "Community access"
    ],
    icon: <Star className="w-6 h-6" />,
    gradient: "from-blue-600 to-purple-600"
  },
  {
    name: "Premium",
    price: "$19.99",
    yearlyPrice: "$199.99",
    description: "Most popular choice",
    features: [
      "Everything in Explorer",
      "Unlimited messaging",
      "HD video content",
      "Priority support",
      "Early access features",
      "Advanced filters"
    ],
    icon: <Crown className="w-6 h-6" />,
    popular: true,
    gradient: "from-purple-600 to-pink-600"
  },
  {
    name: "Elite",
    price: "$39.99",
    yearlyPrice: "$399.99",
    description: "Ultimate creator experience",
    features: [
      "Everything in Premium",
      "Direct creator calls",
      "Custom content requests",
      "VIP status badge",
      "Behind-the-scenes access",
      "Monthly exclusive events"
    ],
    icon: <Zap className="w-6 h-6" />,
    gradient: "from-pink-600 to-red-600"
  }
];

export const PricingSection = () => {
  const [isYearly, setIsYearly] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 60,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.6
      }
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center py-24 overflow-hidden">
      {/* Cinematic Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/20 to-black" />
      
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-purple-500/30 rounded-full"
            initial={{ 
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
              scale: 0
            }}
            animate={{
              y: [null, -100, -200],
              scale: [0, 1, 0],
              opacity: [0, 0.6, 0]
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "easeOut"
            }}
          />
        ))}
      </div>

      <div ref={ref} className="relative z-10 w-full max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-6xl font-display font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
            Choose Your Experience
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Unlock premium content and connect with your favorite creators
          </p>

          {/* Monthly/Yearly Toggle */}
          <motion.div 
            className="flex items-center justify-center gap-4 mb-16"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <span className={`text-lg transition-colors ${!isYearly ? 'text-white' : 'text-gray-400'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className="relative w-16 h-8 bg-gray-700 rounded-full p-1 transition-colors hover:bg-gray-600"
            >
              <motion.div
                className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-lg"
                animate={{ x: isYearly ? 32 : 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            </button>
            <span className={`text-lg transition-colors ${isYearly ? 'text-white' : 'text-gray-400'}`}>
              Yearly
            </span>
            {isYearly && (
              <motion.span 
                className="text-sm text-green-400 font-medium"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                Save 20%
              </motion.span>
            )}
          </motion.div>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {pricingTiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              variants={cardVariants}
              className={`relative glass-card-heavy rounded-2xl p-8 border-2 transition-all duration-500 hover:scale-105 ${
                tier.popular 
                  ? 'border-purple-500/50 shadow-[0_0_40px_rgba(168,85,247,0.3)]' 
                  : 'border-white/10 hover:border-purple-400/30'
              }`}
            >
              {tier.popular && (
                <motion.div
                  className="absolute -top-4 left-1/2 transform -translate-x-1/2"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.5 + index * 0.2, type: "spring" }}
                >
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full text-sm font-bold">
                    Most Popular
                  </div>
                </motion.div>
              )}

              <div className="text-center mb-8">
                <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-r ${tier.gradient} mb-4`}>
                  {tier.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                <p className="text-gray-400">{tier.description}</p>
              </div>

              <div className="text-center mb-8">
                <div className="text-4xl font-bold text-white mb-2">
                  {isYearly ? tier.yearlyPrice : tier.price}
                  {tier.price !== "Free" && (
                    <span className="text-lg text-gray-400 font-normal">
                      /{isYearly ? 'year' : 'month'}
                    </span>
                  )}
                </div>
                {isYearly && tier.price !== "Free" && (
                  <div className="text-sm text-gray-500 line-through">
                    {tier.price}/month
                  </div>
                )}
              </div>

              <div className="space-y-4 mb-8">
                {tier.features.map((feature, featureIndex) => (
                  <motion.div
                    key={feature}
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.8 + index * 0.1 + featureIndex * 0.05 }}
                  >
                    <Check className="w-5 h-5 text-purple-400 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </motion.div>
                ))}
              </div>

              <Button
                className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
                  tier.popular
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl hover:scale-105'
                    : 'bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/30'
                }`}
              >
                {tier.price === "Free" ? "Get Started" : "Upgrade Now"}
              </Button>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <p className="text-gray-400 text-lg mb-6">
            All plans include 24/7 support and 30-day money-back guarantee
          </p>
          <div className="flex justify-center gap-8 text-sm text-gray-500">
            <span>✓ No hidden fees</span>
            <span>✓ Cancel anytime</span>
            <span>✓ Instant activation</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};