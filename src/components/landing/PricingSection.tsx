
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";

export const PricingSection = () => {
  const [ref, isInView] = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.1,
    triggerOnce: true,
  });
  
  const sectionRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, -5]);
  
  const tiers = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Get started with basic creator tools",
      features: [
        "Basic content uploads",
        "Limited messaging",
        "Standard profile",
        "Public content only",
      ],
      cta: "Start Free",
      ctaTo: "/register",
      popular: false
    },
    {
      name: "Premium",
      price: "$9.99",
      period: "per month",
      description: "Everything you need to grow your audience",
      features: [
        "Unlimited content uploads",
        "Priority messaging",
        "Advanced analytics",
        "Custom profile page",
        "Pay-per-view content",
        "24/7 support",
      ],
      cta: "Go Premium",
      ctaTo: "/register?plan=premium",
      popular: true
    },
    {
      name: "Elite",
      price: "$19.99",
      period: "per month",
      description: "Full suite of professional tools",
      features: [
        "All Premium features",
        "HD livestreaming",
        "Zero platform fees",
        "Exclusive community tools",
        "Custom branding options",
        "Priority payouts",
      ],
      cta: "Choose Elite",
      ctaTo: "/register?plan=elite",
      popular: false
    }
  ];

  return (
    <section
      ref={sectionRef}
      className="relative py-24 px-4 sm:px-6 bg-luxury-darker/50"
    >
      <div ref={ref} className="container mx-auto max-w-7xl">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          style={{ y }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            <span className="text-white">Simple, Transparent </span>
            <span className="bg-gradient-to-r from-luxury-primary to-luxury-accent bg-clip-text text-transparent">
              Pricing
            </span>
          </h2>
          <p className="text-luxury-neutral text-lg max-w-2xl mx-auto">
            Choose the perfect plan to match your content creation journey
          </p>
        </motion.div>

        {/* Pricing Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((tier, i) => (
            <motion.div
              key={i}
              className={`relative rounded-xl overflow-hidden border transition-all duration-500 ${
                tier.popular
                  ? "border-luxury-primary/50 bg-gradient-to-br from-luxury-dark to-black shadow-[0_0_30px_rgba(155,135,245,0.25)]"
                  : "border-luxury-primary/10 bg-gradient-to-br from-luxury-dark to-luxury-darker"
              }`}
              initial={{ opacity: 0, y: 50, rotateY: 15 }}
              animate={isInView ? { 
                opacity: 1, 
                y: 0, 
                rotateY: 0 
              } : { 
                opacity: 0, 
                y: 50, 
                rotateY: 15 
              }}
              transition={{ 
                duration: 0.7, 
                delay: 0.1 * i,
                ease: "easeOut" 
              }}
              style={{ rotate: rotate }}
              whileHover={{
                y: -10,
                boxShadow: "0 30px 60px rgba(0,0,0,0.3)",
                transition: { duration: 0.3 }
              }}
            >
              {/* Popular badge */}
              {tier.popular && (
                <div className="absolute top-0 right-0">
                  <div className="bg-gradient-to-r from-luxury-primary to-luxury-accent text-white px-6 py-1 transform rotate-45 translate-x-[30%] translate-y-[10%]">
                    POPULAR
                  </div>
                </div>
              )}
              
              {/* Tier Content */}
              <div className="p-8">
                <h3 className={`text-2xl font-bold mb-2 ${
                  tier.popular ? "text-luxury-primary" : "text-white"
                }`}>
                  {tier.name}
                </h3>
                
                {/* Price */}
                <div className="mb-4">
                  <span className="text-4xl font-bold text-white">{tier.price}</span>
                  <span className="text-luxury-neutral">/{tier.period}</span>
                </div>
                
                {/* Description */}
                <p className="text-luxury-neutral mb-6">{tier.description}</p>
                
                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, j) => (
                    <li key={j} className="flex items-start">
                      <span className={`mr-2 mt-1 ${
                        tier.popular ? "text-luxury-accent" : "text-luxury-primary"
                      }`}>
                        <Check className="w-4 h-4" />
                      </span>
                      <span className="text-luxury-neutral">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                {/* CTA Button */}
                <Button
                  asChild
                  className={`w-full ${
                    tier.popular
                      ? "bg-gradient-to-r from-luxury-primary to-luxury-accent hover:from-luxury-accent hover:to-luxury-primary text-white"
                      : "bg-transparent border border-luxury-primary/30 text-luxury-primary hover:bg-luxury-primary/10"
                  }`}
                >
                  <Link to={tier.ctaTo}>{tier.cta}</Link>
                </Button>
              </div>
              
              {/* Tier Background Effect */}
              {tier.popular && (
                <div 
                  className="absolute inset-0 bg-luxury-primary/10 -z-10"
                  style={{
                    background: "radial-gradient(circle at top right, rgba(155,135,245,0.15), transparent 60%)"
                  }}
                />
              )}
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-luxury-dark to-transparent -z-10" />
      <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-luxury-dark to-transparent -z-10" />
    </section>
  );
};
