import { motion, useInView } from "framer-motion";
import { Shield, Lock, Eye, CreditCard, UserCheck, Award, Server, Zap } from "lucide-react";
import { useRef, useState } from "react";

interface TrustFeature {
  icon: React.ReactNode;
  title: string;
  description: string;
  badge?: string;
}

const trustFeatures: TrustFeature[] = [
  {
    icon: <Shield className="w-8 h-8" />,
    title: "Bank-Level Security",
    description: "256-bit SSL encryption protects all your data and transactions",
    badge: "SOC 2 Certified"
  },
  {
    icon: <Lock className="w-8 h-8" />,
    title: "Privacy First",
    description: "Your personal information is never shared or sold to third parties",
    badge: "GDPR Compliant"
  },
  {
    icon: <Eye className="w-8 h-8" />,
    title: "Content Protection",
    description: "Advanced DRM and watermarking prevent unauthorized sharing",
    badge: "Patent Pending"
  },
  {
    icon: <CreditCard className="w-8 h-8" />,
    title: "Secure Payments",
    description: "PCI DSS compliant payment processing with fraud protection",
    badge: "PCI Level 1"
  }
];

export const TrustSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 40,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1
    }
  };

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center py-24 overflow-hidden">
      {/* Cinematic Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-green-900/5 to-black" />
      
      {/* Security Pattern Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.1)_0%,transparent_50%)] animate-pulse" />
        <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent,rgba(34,197,94,0.05),transparent_360deg)] animate-spin" style={{ animationDuration: '20s' }} />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-6xl font-display font-bold mb-6 bg-gradient-to-r from-white via-green-200 to-emerald-200 bg-clip-text text-transparent">
            Built on Trust
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Your security and privacy are our top priorities. We've implemented enterprise-grade protection at every level.
          </p>
        </motion.div>

        {/* Trust Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {trustFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={cardVariants}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className="relative glass-card rounded-2xl p-6 border border-white/10 hover:border-green-400/30 transition-all duration-500 cursor-pointer group"
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
              whileHover={{ y: -5 }}
            >
              {/* Badge */}
              {feature.badge && (
                <motion.div
                  className="absolute -top-3 right-4"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.8 + index * 0.1, type: "spring" }}
                >
                  <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                    {feature.badge}
                  </div>
                </motion.div>
              )}

              {/* Icon */}
              <motion.div
                className="mb-4 text-green-400 transition-colors duration-300 group-hover:text-green-300"
                animate={hoveredCard === index ? { rotate: 5, scale: 1.1 } : { rotate: 0, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {feature.icon}
              </motion.div>

              {/* Content */}
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-green-100 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-400 group-hover:text-gray-300 transition-colors leading-relaxed">
                {feature.description}
              </p>

              {/* Hover Effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-green-600/10 to-emerald-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                initial={false}
                animate={hoveredCard === index ? { opacity: 0.1 } : { opacity: 0 }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Security Stats */}
        <motion.div
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          {[
            { value: "2.1M+", label: "Protected Users" },
            { value: "99.9%", label: "Uptime Guarantee" },
            { value: "0", label: "Data Breaches" },
            { value: "24/7", label: "Security Monitoring" }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 1.4 + index * 0.1, duration: 0.5 }}
            >
              <div className="text-4xl font-bold text-green-400 mb-2">{stat.value}</div>
              <div className="text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};