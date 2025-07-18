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
    <section className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black py-20 px-4">
      <div className="max-w-7xl mx-auto">
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
              className="group relative bg-gradient-to-b from-gray-900/50 to-black/50 backdrop-blur-xl border border-gray-800 hover:border-purple-500/50 rounded-2xl p-8 transition-all duration-500 hover:transform hover:-translate-y-2"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
            >
              {/* Icon */}
              <motion.div 
                className={`inline-flex items-center justify-center w-16 h-16 ${benefit.color} bg-current/10 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <benefit.icon className="w-8 h-8" />
              </motion.div>

              {/* Highlight Number */}
              <div className={`text-3xl font-bold ${benefit.color} mb-3`}>
                {benefit.highlight}
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors duration-300">
                {benefit.title}
              </h3>
              <p className="text-gray-400 leading-relaxed">
                {benefit.description}
              </p>

              {/* Hover Glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className={`absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-pink-500/5 rounded-2xl`} />
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