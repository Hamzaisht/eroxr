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
    <section ref={ref} className="relative min-h-screen py-20 bg-gradient-to-b from-black via-gray-950 to-black">
      {/* Enhanced background with premium money effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-950/20 to-purple-950/20">
        {/* Floating currency symbols */}
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute font-bold opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: Math.random() * 20 + 16,
              color: i % 3 === 0 ? '#10b981' : i % 3 === 1 ? '#8b5cf6' : '#ec4899',
              filter: `blur(${Math.random() * 2}px)`,
            }}
            animate={{
              y: [0, -30 - Math.random() * 20, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0.1, 0.4, 0.1],
              rotate: [0, 360],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut",
            }}
          >
            {['$', '€', '£', '¥', '₿'][Math.floor(Math.random() * 5)]}
          </motion.div>
        ))}
        
        {/* Glowing orbs for prosperity */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`orb-${i}`}
            className="absolute rounded-full opacity-15"
            style={{
              left: `${15 + i * 12}%`,
              top: `${30 + Math.random() * 40}%`,
              width: 80 + Math.random() * 40,
              height: 80 + Math.random() * 40,
              background: `radial-gradient(circle, ${i % 2 === 0 ? '#10b981' : '#8b5cf6'} 0%, transparent 70%)`,
              filter: 'blur(25px)',
            }}
            animate={{
              y: [0, -25, 0],
              scale: [1, 1.3, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 7 + i * 1.5,
              repeat: Infinity,
              delay: i * 1,
              ease: "easeInOut",
            }}
          />
        ))}
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
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Your{" "}
            <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              Earnings
            </span>
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
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