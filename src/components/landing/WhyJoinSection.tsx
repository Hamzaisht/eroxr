import { motion } from "framer-motion";
import { Shield, DollarSign, Users, Crown, Zap, Heart } from "lucide-react";

const benefits = [
  {
    icon: DollarSign,
    title: "85% Revenue Share",
    description: "Keep more of what you earn with industry-leading creator payouts",
    highlight: "85%",
    color: "text-green-400"
  },
  {
    icon: Users,
    title: "Global Audience",
    description: "Connect with fans worldwide through our premium platform",
    highlight: "2.1M+",
    color: "text-blue-400"
  },
  {
    icon: Shield,
    title: "Creator Protection",
    description: "Advanced privacy controls and content protection built-in",
    highlight: "100%",
    color: "text-purple-400"
  },
  {
    icon: Zap,
    title: "Instant Payouts",
    description: "Get paid within 24 hours with our fast payment system",
    highlight: "24h",
    color: "text-yellow-400"
  },
  {
    icon: Crown,
    title: "Premium Tools",
    description: "Advanced analytics, scheduling, and monetization features",
    highlight: "Pro",
    color: "text-pink-400"
  },
  {
    icon: Heart,
    title: "Dedicated Support",
    description: "24/7 creator success team to help you grow and succeed",
    highlight: "24/7",
    color: "text-red-400"
  }
];

export const WhyJoinSection = () => {
  return (
    <section className="min-h-screen relative overflow-hidden py-20 px-4">
      {/* Cinematic Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-950/5 to-black" />
        <div className="neural-mesh opacity-20" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-full liquid-bg" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-blue-600/8 to-purple-600/8 rounded-full liquid-bg" style={{ animationDelay: '3s' }} />
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.h2 
            className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <span className="bg-gradient-to-r from-white via-purple-300 to-pink-300 bg-clip-text text-transparent">
              Why Creators Choose EROXR
            </span>
          </motion.h2>
          <motion.p 
            className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            The most creator-friendly platform in the Nordic region
          </motion.p>
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              className="group relative glass-card-heavy morphing-card border border-gray-800/50 hover:border-purple-500/50 p-8 transition-all duration-700 magnetic-hover glow-cinematic"
              initial={{ opacity: 0, y: 50, rotateX: 45 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1, ease: [0.23, 1, 0.32, 1] }}
              viewport={{ once: true }}
              whileHover={{ 
                scale: 1.03,
                y: -8,
                rotateY: 5,
                transition: { duration: 0.3 }
              }}
            >
              {/* Premium Icon */}
              <motion.div 
                className={`inline-flex items-center justify-center w-20 h-20 ${benefit.color} bg-current/10 rounded-3xl mb-6 group-hover:scale-110 transition-all duration-500 relative overflow-hidden`}
                whileHover={{ 
                  rotate: 360,
                  boxShadow: `0 20px 40px ${benefit.color.includes('green') ? 'rgba(34, 197, 94, 0.3)' : 
                                         benefit.color.includes('blue') ? 'rgba(59, 130, 246, 0.3)' :
                                         benefit.color.includes('purple') ? 'rgba(147, 51, 234, 0.3)' :
                                         benefit.color.includes('yellow') ? 'rgba(245, 158, 11, 0.3)' :
                                         benefit.color.includes('pink') ? 'rgba(236, 72, 153, 0.3)' :
                                         'rgba(239, 68, 68, 0.3)'}`
                }}
                transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
              >
                <benefit.icon className="w-10 h-10 relative z-10" />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.6 }}
                />
              </motion.div>

              {/* Premium Highlight Number */}
              <motion.div 
                className={`text-4xl font-bold ${benefit.color} mb-4 relative`}
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                {benefit.highlight}
                <motion.div
                  className="absolute -inset-2 bg-gradient-to-r from-current/20 to-transparent rounded-lg blur-sm"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>

              {/* Enhanced Content */}
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-shimmer transition-all duration-500">
                {benefit.title}
              </h3>
              <p className="text-gray-300 leading-relaxed text-lg group-hover:text-gray-200 transition-colors duration-300">
                {benefit.description}
              </p>

              {/* Premium Hover Effects */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/5 to-purple-500/10 rounded-3xl" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-3xl" />
              </div>
              
              {/* Floating particles on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none overflow-hidden rounded-3xl">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-purple-400/60 rounded-full"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      y: [0, -20, 0],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 2 + Math.random(),
                      repeat: Infinity,
                      delay: Math.random() * 2,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to start earning?
            </h3>
            <p className="text-gray-400 mb-6">
              Join thousands of creators who've already made the switch
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
              <span>✓ No setup fees</span>
              <span>✓ Instant approval</span>
              <span>✓ 24/7 support</span>
              <span>✓ Advanced analytics</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};