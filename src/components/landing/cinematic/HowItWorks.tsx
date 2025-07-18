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
    <section ref={ref} className="relative min-h-screen py-20 bg-gradient-to-b from-black via-purple-950/20 to-black overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-purple-400/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-6">
            How It{" "}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Works
            </span>
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Three simple steps to start earning from your content and building your creator empire.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="space-y-32">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              style={{ y: parallaxTransforms[index] }}
              className={`flex flex-col ${
                index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
              } items-center gap-12 lg:gap-20`}
            >
              {/* Step Content */}
              <motion.div
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                transition={{ duration: 0.8, delay: step.delay }}
                className="flex-1 text-center lg:text-left"
              >
                <div className="flex items-center justify-center lg:justify-start mb-6">
                  <motion.div
                    className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r ${step.color} mr-4`}
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <step.icon className="w-10 h-10 text-white" />
                  </motion.div>
                  <div className={`text-6xl font-bold bg-gradient-to-r ${step.color} bg-clip-text text-transparent`}>
                    0{index + 1}
                  </div>
                </div>

                <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  {step.title}
                </h3>

                <p className="text-xl text-white/70 leading-relaxed max-w-lg">
                  {step.description}
                </p>
              </motion.div>

              {/* Step Visual */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.8, delay: step.delay + 0.2 }}
                className="flex-1"
              >
                <div className="relative">
                  {/* Main Visual Container */}
                  <motion.div
                    className={`w-80 h-80 rounded-2xl bg-gradient-to-br ${step.color} p-1`}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="w-full h-full bg-black rounded-xl flex items-center justify-center overflow-hidden">
                      {/* Step Icon Large */}
                      <motion.div
                        animate={{
                          rotate: [0, 10, -10, 0],
                          scale: [1, 1.1, 1],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <step.icon className="w-32 h-32 text-white/20" />
                      </motion.div>
                    </div>
                  </motion.div>

                  {/* Floating Elements */}
                  <motion.div
                    className="absolute -top-4 -right-4 w-8 h-8 bg-pink-400 rounded-full"
                    animate={{
                      y: [0, -10, 0],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: 0.5
                    }}
                  />
                  <motion.div
                    className="absolute -bottom-4 -left-4 w-6 h-6 bg-purple-400 rounded-full"
                    animate={{
                      y: [0, 10, 0],
                      opacity: [0.3, 0.8, 0.3]
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      delay: 1
                    }}
                  />
                </div>
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