import { motion, useTransform, MotionValue } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useState, useEffect } from "react";

interface WhyEroxrExistsProps {
  scrollYProgress: MotionValue<number>;
}

export const WhyEroxrExists = ({ scrollYProgress }: WhyEroxrExistsProps) => {
  const [ref, inView] = useInView({ threshold: 0.3, triggerOnce: false });
  const [currentScene, setCurrentScene] = useState(0);

  const scenes = [
    {
      title: "Break Free From Platform Control",
      description: "Stop losing income to shadow bans and algorithm changes. Your content reaches your audience directly, without platform interference limiting your growth.",
      gradient: "from-purple-600 to-pink-600"
    },
    {
      title: "Maximize Your Creator Income", 
      description: "Earn 85% vs industry standard 45-55%. That's $850 vs $500 per $1000 earned. Direct fan payments, instant withdrawals, zero hidden fees.",
      gradient: "from-green-600 to-emerald-600"
    },
    {
      title: "Join the Premium Revolution",
      description: "High-value audience willing to pay premium prices for quality content. Connect with fans who truly appreciate and support your work.",
      gradient: "from-pink-600 to-red-600"
    }
  ];

  // Auto-advance scenes
  useEffect(() => {
    if (!inView) return;
    
    const interval = setInterval(() => {
      setCurrentScene((prev) => (prev + 1) % scenes.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [inView, scenes.length]);

  const x = useTransform(scrollYProgress, [0.1, 0.4], [0, -100]);

  return (
    <section id="why-eroxr" ref={ref} className="relative min-h-screen flex items-center py-20 overflow-hidden bg-black">
      {/* Modern Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:20px_20px]" />
        </div>
        
        {/* Floating orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            className="absolute top-20 left-20 w-40 h-40 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-2xl"
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
            className="absolute bottom-40 right-20 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-xl"
            animate={{ 
              y: [0, 20, 0],
              x: [0, -10, 0]
            }}
            transition={{ 
              duration: 10, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: 2
            }}
          />
        </div>
      </div>
      
      <div className="relative w-full max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Why Creators Choose{" "}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              EROXR
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto font-light">
            Break free from platform restrictions and start earning what you deserve.
          </p>
        </motion.div>

        {/* Modern Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {scenes.map((scene, index) => (
            <motion.div
              key={index}
              className="group relative bg-gray-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all duration-300"
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              {/* Gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${scene.gradient} opacity-5 rounded-2xl`} />
              
              {/* Number indicator */}
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r ${scene.gradient} text-white font-bold text-lg mb-6`}>
                {index + 1}
              </div>

              {/* Content */}
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">
                {scene.title}
              </h3>
              
              <p className="text-gray-400 leading-relaxed font-light">
                {scene.description}
              </p>

              {/* Hover glow effect */}
              <motion.div
                className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${scene.gradient} opacity-0 -z-10 blur-xl`}
                whileHover={{ opacity: 0.1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};