
import { useRef, useState } from "react";
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
  
  // Track hover states for each pricing card
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  
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
      price: "$2.99",
      period: "per week",
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
      price: "$10.99",
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

  // Function to handle 3D tilt effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Calculate rotation based on mouse position
    const rotateX = ((y - centerY) / centerY) * -7;
    const rotateY = ((x - centerX) / centerX) * 7;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    
    // Add glow effect positioning
    const glow = card.querySelector('.card-glow') as HTMLElement;
    if (glow) {
      glow.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(155, 135, 245, 0.4) 0%, transparent 70%)`;
      glow.style.opacity = '1';
    }
    
    setHoveredCard(index);
  };

  // Function to reset transform on mouse leave
  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    
    // Reset glow
    const glow = card.querySelector('.card-glow') as HTMLElement;
    if (glow) {
      glow.style.opacity = '0';
    }
    
    setHoveredCard(null);
  };

  return (
    <section
      ref={sectionRef}
      className="relative py-24 px-4 sm:px-6 bg-luxury-darker/50 overflow-hidden"
    >
      <div ref={ref} className="container mx-auto max-w-7xl relative z-10">
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

        {/* Pricing Tiers with enhanced 3D interaction */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((tier, i) => (
            <motion.div
              key={i}
              className={`relative rounded-xl overflow-hidden border-0 backdrop-blur-sm transition-all duration-500 ${
                tier.popular
                  ? "bg-gradient-to-br from-luxury-dark/80 to-black/70 shadow-[0_0_30px_rgba(155,135,245,0.25)]"
                  : "bg-gradient-to-br from-luxury-dark/60 to-luxury-darker/70"
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
              onMouseMove={(e) => handleMouseMove(e, i)}
              onMouseLeave={handleMouseLeave}
            >
              {/* Interactive glow effect */}
              <div 
                className="card-glow absolute inset-0 opacity-0 transition-opacity duration-300"
                aria-hidden="true"
              />
              
              {/* Animated border effect */}
              <div className="absolute inset-0 border border-luxury-primary/30 rounded-xl" />
              
              {/* Animated corner highlights */}
              <div 
                className={`absolute top-0 right-0 w-20 h-20 rounded-bl-full bg-gradient-to-bl from-luxury-primary/20 to-transparent transform transition-all duration-500 ${
                  hoveredCard === i ? "opacity-100" : "opacity-0"
                }`}
              />
              <div 
                className={`absolute bottom-0 left-0 w-20 h-20 rounded-tr-full bg-gradient-to-tr from-luxury-accent/20 to-transparent transform transition-all duration-500 ${
                  hoveredCard === i ? "opacity-100" : "opacity-0"
                }`}
              />
              
              {/* Animated corner accents */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-luxury-primary/50 rounded-tl-lg transform -translate-x-1 -translate-y-1 transition-all duration-500" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-luxury-accent/50 rounded-br-lg transform translate-x-1 translate-y-1 transition-all duration-500" />
              
              {/* Popular badge with improved animation */}
              {tier.popular && (
                <div className="absolute top-0 right-0">
                  <div className="bg-gradient-to-r from-luxury-primary to-luxury-accent text-white px-6 py-1 transform rotate-45 translate-x-[30%] translate-y-[10%]">
                    <span className="inline-block animate-pulse-slow">POPULAR</span>
                  </div>
                </div>
              )}
              
              {/* Tier Content */}
              <div className="p-8 relative z-10">
                <h3 className={`text-2xl font-bold mb-2 ${
                  tier.popular ? "text-luxury-primary" : "text-white"
                }`}>
                  {tier.name}
                </h3>
                
                {/* Price with floating animation */}
                <div className="mb-4 relative">
                  <motion.span 
                    className="text-4xl font-bold text-white"
                    animate={hoveredCard === i ? {
                      y: [0, -5, 0],
                      transition: { 
                        repeat: Infinity, 
                        duration: 2,
                        ease: "easeInOut"
                      }
                    } : {}}
                  >
                    {tier.price}
                  </motion.span>
                  <span className="text-luxury-neutral">/{tier.period}</span>
                </div>
                
                {/* Description */}
                <p className="text-luxury-neutral mb-6">{tier.description}</p>
                
                {/* Features with animated appear */}
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, j) => (
                    <motion.li 
                      key={j} 
                      className="flex items-start"
                      initial={{ opacity: 0, x: -10 }}
                      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                      transition={{ delay: 0.3 + (i * 0.1) + (j * 0.05), duration: 0.5 }}
                    >
                      <span className={`mr-2 mt-1 ${
                        tier.popular ? "text-luxury-accent" : "text-luxury-primary"
                      }`}>
                        <Check className="w-4 h-4" />
                      </span>
                      <span className="text-luxury-neutral">{feature}</span>
                    </motion.li>
                  ))}
                </ul>
                
                {/* CTA Button with hover effect */}
                <Button
                  asChild
                  className={`w-full relative overflow-hidden group ${
                    tier.popular
                      ? "bg-gradient-to-r from-luxury-primary to-luxury-accent hover:from-luxury-accent hover:to-luxury-primary text-white"
                      : "bg-transparent border border-luxury-primary/30 text-luxury-primary hover:bg-luxury-primary/10"
                  }`}
                >
                  <Link to={tier.ctaTo}>
                    <span className="relative z-10">{tier.cta}</span>
                    <span className="absolute inset-0 bg-white/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                  </Link>
                </Button>
              </div>
              
              {/* Subtle particle effects */}
              {hoveredCard === i && (
                <>
                  <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-luxury-primary/30 animate-float opacity-70" />
                  <div className="absolute top-3/4 right-1/4 w-3 h-3 rounded-full bg-luxury-accent/30 animate-float opacity-70" style={{ animationDelay: '0.5s' }} />
                  <div className="absolute bottom-1/4 left-1/2 w-2 h-2 rounded-full bg-white/20 animate-float opacity-70" style={{ animationDelay: '1s' }} />
                </>
              )}
              
              {/* Enhanced background effect for hovered card */}
              <div 
                className={`absolute inset-0 bg-gradient-to-r from-luxury-primary/5 to-luxury-accent/5 opacity-0 transition-opacity duration-500 ${
                  hoveredCard === i ? "opacity-100" : ""
                }`}
              />
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Enhanced background effects */}
      <div className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full bg-luxury-primary/5 blur-3xl -z-10 animate-pulse-slow" />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-luxury-accent/5 blur-3xl -z-10 animate-pulse-slow" style={{ animationDelay: '1s' }} />
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        {Array.from({ length: 8 }).map((_, i) => (
          <div 
            key={i}
            className="absolute w-2 h-2 rounded-full bg-luxury-primary/20 animate-float"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${6 + Math.random() * 4}s`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>
      
      {/* Grid background */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5 -z-10" />
    </section>
  );
};
