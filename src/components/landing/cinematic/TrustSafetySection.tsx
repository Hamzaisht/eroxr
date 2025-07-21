import { motion, useTransform, MotionValue } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Shield, Lock, Eye, Heart, CheckCircle, Users, Star } from "lucide-react";

interface TrustSafetySectionProps {
  scrollYProgress: MotionValue<number>;
}

export const TrustSafetySection = ({ scrollYProgress }: TrustSafetySectionProps) => {
  const [ref, inView] = useInView({ threshold: 0.3 });

  const securityFeatures = [
    {
      icon: Shield,
      title: "Advanced Content Protection",
      description: "Military-grade DRM protection prevents unauthorized downloads and sharing. Your content stays yours.",
      color: "from-blue-400 to-blue-600"
    },
    {
      icon: Lock,
      title: "Secure Payment Processing",
      description: "PCI-DSS compliant payment processing with Stripe. Your financial data is protected by bank-level security.",
      color: "from-green-400 to-green-600"
    },
    {
      icon: Eye,
      title: "Smart Content Moderation",
      description: "AI-powered content review ensures platform safety while respecting creator freedom and artistic expression.",
      color: "from-purple-400 to-purple-600"
    },
    {
      icon: Heart,
      title: "Mental Health Support",
      description: "24/7 creator wellness resources and dedicated support team for safety concerns and mental health.",
      color: "from-pink-400 to-pink-600"
    }
  ];

  const trustMetrics = [
    {
      icon: Users,
      value: "50K+",
      label: "Protected Creators",
      description: "Creators trust us with their content"
    },
    {
      icon: Shield,
      value: "99.9%",
      label: "Uptime Security",
      description: "Reliable platform availability"
    },
    {
      icon: CheckCircle,
      value: "100%",
      label: "GDPR Compliant",
      description: "Full data protection compliance"
    },
    {
      icon: Star,
      value: "4.9/5",
      label: "Safety Rating",
      description: "Creator satisfaction with safety"
    }
  ];

  const certifications = [
    { name: "SOC 2 Type II", icon: "🔒" },
    { name: "PCI DSS Compliant", icon: "💳" },
    { name: "GDPR Compliant", icon: "🇪🇺" },
    { name: "Age Verification", icon: "✅" }
  ];

  const y = useTransform(scrollYProgress, [0.5, 0.8], [100, -100]);

  return (
    <section ref={ref} className="relative min-h-screen py-20 bg-black">
      {/* Modern background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black" />
      
      {/* Subtle security-themed elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute top-40 right-40 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-green-500/10 rounded-full blur-2xl"
          animate={{ 
            y: [0, -20, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
        <motion.div 
          className="absolute bottom-40 left-40 w-24 h-24 bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-full blur-xl"
          animate={{ 
            y: [0, 15, 0],
            x: [0, 10, 0]
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 1
          }}
        />
      </div>

      <motion.div 
        style={{ y }}
        className="max-w-7xl mx-auto px-6"
      >
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Trust &{" "}
            <span className="bg-gradient-to-r from-blue-400 via-green-400 to-blue-400 bg-clip-text text-transparent">
              Safety
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-400 max-w-4xl mx-auto leading-relaxed font-light">
            Your safety, privacy, and creative freedom are our top priorities. We've built the most secure creator platform in the industry.
          </p>
        </motion.div>

        {/* Security Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {securityFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <motion.div
                className="relative bg-gray-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8"
                whileHover={{ 
                  scale: 1.02,
                  borderColor: "rgba(255, 255, 255, 0.2)"
                }}
                transition={{ duration: 0.3 }}
              >
                {/* Icon */}
                <motion.div
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${feature.color} mb-6`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </motion.div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-white/70 leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover glow */}
                <motion.div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${feature.color} opacity-0 -z-10 blur-xl`}
                  whileHover={{ opacity: 0.1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Trust Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-gradient-to-r from-gray-900/40 to-gray-800/40 backdrop-blur-sm border border-white/10 rounded-2xl p-8 mb-16"
        >
          <h3 className="text-3xl font-bold text-white text-center mb-12">
            Platform Trust Metrics
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {trustMetrics.map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                className="text-center"
              >
                <motion.div
                  className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  <metric.icon className="w-8 h-8 text-white" />
                </motion.div>
                
                <div className="text-3xl font-bold text-white mb-2">{metric.value}</div>
                <div className="text-lg font-semibold text-white/90 mb-1">{metric.label}</div>
                <div className="text-sm text-white/70">{metric.description}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Certifications */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="bg-gray-900/30 backdrop-blur-sm border border-white/10 rounded-2xl p-8"
        >
          <h3 className="text-2xl font-semibold text-white text-center mb-8">
            Security Certifications & Compliance
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {certifications.map((cert, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                className="flex flex-col items-center text-center p-4 rounded-xl hover:bg-white/5 transition-all duration-300"
              >
                <div className="text-4xl mb-3">{cert.icon}</div>
                <span className="text-white/90 font-medium text-sm">{cert.name}</span>
              </motion.div>
            ))}
          </div>

          {/* Safety Promise */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="text-center mt-8 p-6 bg-gradient-to-r from-blue-900/20 to-green-900/20 rounded-xl border border-blue-400/20"
          >
            <p className="text-blue-400 font-semibold mb-2">Our Safety Promise</p>
            <p className="text-white/80 leading-relaxed">
              We maintain the highest standards of platform safety while preserving creator freedom. 
              Your content, your rules, our protection.
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};