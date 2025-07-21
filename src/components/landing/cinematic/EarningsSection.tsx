import { motion, useTransform, MotionValue } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { TrendingUp, DollarSign, Shield, Zap } from "lucide-react";

interface EarningsSectionProps {
  scrollYProgress: MotionValue<number>;
}

export const EarningsSection = ({ scrollYProgress }: EarningsSectionProps) => {
  const [ref, inView] = useInView({ threshold: 0.3 });

  const stats = [
    {
      icon: TrendingUp,
      value: "85%",
      label: "Revenue Share",
      description: "Keep 85% of everything you earn",
      color: "from-green-400 to-emerald-400"
    },
    {
      icon: DollarSign,
      value: "$4,200",
      label: "Avg Monthly Income",
      description: "Top creators earning consistently",
      color: "from-yellow-400 to-orange-400"
    },
    {
      icon: Zap,
      value: "Instant",
      label: "Payouts",
      description: "Get paid immediately, no waiting",
      color: "from-purple-400 to-pink-400"
    },
    {
      icon: Shield,
      value: "100%",
      label: "Secure",
      description: "Stripe-powered, bank-level security",
      color: "from-blue-400 to-cyan-400"
    }
  ];

  const trustBadges = [
    { name: "Stripe Secured", logo: "💳" },
    { name: "Transparent", logo: "🔍" },
    { name: "Creator First", logo: "🎨" },
    { name: "No Hidden Fees", logo: "💯" }
  ];

  const y = useTransform(scrollYProgress, [0.3, 0.7], [100, -100]);

  return (
    <section ref={ref} className="relative min-h-screen py-20 bg-black">
      {/* Modern gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black" />
      
      {/* Subtle animated elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating orbs */}
        <motion.div 
          className="absolute top-32 right-32 w-24 h-24 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-full blur-xl"
          animate={{ 
            y: [0, -15, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
        <motion.div 
          className="absolute bottom-40 left-32 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-2xl"
          animate={{ 
            y: [0, 20, 0],
            x: [0, -10, 0]
          }}
          transition={{ 
            duration: 8, 
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
            Maximize Your{" "}
            <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              Earnings
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto font-light">
            Built for creators who want to maximize their income and maintain full control over their content.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 50, scale: 0.9 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <motion.div
                className="relative bg-gray-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center"
                whileHover={{ 
                  scale: 1.05,
                  borderColor: "rgba(255, 255, 255, 0.2)"
                }}
                transition={{ duration: 0.3 }}
              >
                {/* Icon */}
                <motion.div
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${stat.color} mb-4`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <stat.icon className="w-8 h-8 text-white" />
                </motion.div>

                {/* Value */}
                <motion.div
                  className={`text-4xl md:text-5xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}
                  initial={{ scale: 0 }}
                  animate={inView ? { scale: 1 } : { scale: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                >
                  {stat.value}
                </motion.div>

                {/* Label */}
                <h3 className="text-xl font-semibold text-white mb-2">
                  {stat.label}
                </h3>

                {/* Description */}
                <p className="text-white/70 text-sm leading-relaxed">
                  {stat.description}
                </p>

                {/* Hover Glow */}
                <motion.div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${stat.color} opacity-0 -z-10 blur-xl`}
                  whileHover={{ opacity: 0.1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="bg-gray-900/30 backdrop-blur-sm border border-white/10 rounded-2xl p-8"
        >
          <h3 className="text-2xl font-semibold text-white text-center mb-8">
            Trusted by creators worldwide
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {trustBadges.map((badge, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                className="flex flex-col items-center text-center p-4 rounded-xl hover:bg-white/5 transition-all duration-300"
              >
                <div className="text-3xl mb-2">{badge.logo}</div>
                <span className="text-white/80 font-medium">{badge.name}</span>
              </motion.div>
            ))}
          </div>

          {/* Feature Highlight */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="text-center mt-8 p-6 bg-gradient-to-r from-green-900/20 to-emerald-900/20 rounded-xl border border-green-400/20"
          >
            <p className="text-green-400 font-semibold mb-2">No Hidden Fees Promise</p>
            <p className="text-white/80">
              What you see is what you get. No surprise deductions, no complex fee structures.
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};