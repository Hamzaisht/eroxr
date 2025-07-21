import { motion, useTransform, MotionValue } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Upload, DollarSign, TrendingUp } from "lucide-react";

interface HowItWorksProps {
  scrollYProgress: MotionValue<number>;
}

export const HowItWorks = ({ scrollYProgress }: HowItWorksProps) => {
  const [ref, inView] = useInView({ threshold: 0.3 });

  const steps = [
    {
      icon: Upload,
      title: "Upload",
      description: "Create and upload your premium content in minutes. Full creative control, no restrictions.",
      color: "from-blue-400 to-cyan-400",
      delay: 0.2
    },
    {
      icon: DollarSign,
      title: "Monetize", 
      description: "Set your prices, create tiers, and start earning immediately. Multiple revenue streams available.",
      color: "from-green-400 to-emerald-400",
      delay: 0.4
    },
    {
      icon: TrendingUp,
      title: "Go Viral",
      description: "Leverage our promotion tools and community features to reach millions of potential fans.",
      color: "from-purple-400 to-pink-400",
      delay: 0.6
    }
  ];

  const y1 = useTransform(scrollYProgress, [0.4, 0.8], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0.4, 0.8], [0, -200]);
  const y3 = useTransform(scrollYProgress, [0.4, 0.8], [0, -300]);

  const parallaxTransforms = [y1, y2, y3];

  return (
    <section ref={ref} className="relative min-h-screen py-20 bg-black overflow-hidden">
      {/* Modern background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black">
        {/* Floating orbs */}
        <motion.div 
          className="absolute top-32 left-32 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-2xl"
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
          className="absolute bottom-32 right-32 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-xl"
          animate={{ 
            y: [0, 15, 0],
            x: [0, -10, 0]
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 1
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            How It{" "}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Works
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto font-light">
            Three simple steps to start earning from your content and building your creator empire.
          </p>
        </motion.div>

        {/* Modern Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.6, delay: step.delay }}
              className="group text-center"
            >
              {/* Step Card */}
              <motion.div
                className="relative bg-gray-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all duration-300"
                whileHover={{ scale: 1.02, y: -5 }}
              >
                {/* Step number */}
                <div className="absolute -top-4 left-8">
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center text-white font-bold text-sm`}>
                    {index + 1}
                  </div>
                </div>

                {/* Icon */}
                <motion.div
                  className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r ${step.color} mb-6`}
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <step.icon className="w-10 h-10 text-white" />
                </motion.div>

                {/* Content */}
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  {step.title}
                </h3>

                <p className="text-gray-400 leading-relaxed font-light">
                  {step.description}
                </p>

                {/* Hover glow */}
                <motion.div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${step.color} opacity-0 -z-10 blur-xl`}
                  whileHover={{ opacity: 0.1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-center mt-20"
        >
          <motion.button
            className="px-12 py-6 text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-full shadow-[0_0_30px_rgba(168,85,247,0.3)]"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 0 50px rgba(168, 85, 247, 0.5)"
            }}
            whileTap={{ scale: 0.95 }}
          >
            Start Your Journey
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};