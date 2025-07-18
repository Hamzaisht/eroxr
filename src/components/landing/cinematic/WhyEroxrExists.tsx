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
      title: "Own your content",
      description: "Complete creative control. No algorithm suppression. Your art, your way.",
      gradient: "from-purple-600 to-pink-600"
    },
    {
      title: "Keep your earnings", 
      description: "85% revenue share. Instant payouts. No hidden fees or surprise deductions.",
      gradient: "from-green-600 to-emerald-600"
    },
    {
      title: "Go premium",
      description: "Premium audience. Premium creators. Premium experience for everyone.",
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
    <section id="why-eroxr" ref={ref} className="relative min-h-screen flex items-center py-20 overflow-hidden">
      {/* Enhanced Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-950 to-black">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/30 to-pink-900/30" />
        
        {/* Enhanced floating particles with connections */}
        <div className="absolute inset-0 opacity-40">
          {[...Array(40)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: Math.random() * 4 + 2,
                height: Math.random() * 4 + 2,
                background: `hsl(${280 + Math.random() * 30}, 100%, ${65 + Math.random() * 15}%)`,
                filter: 'blur(1px)',
                boxShadow: `0 0 ${Math.random() * 10 + 5}px hsl(${280 + Math.random() * 30}, 100%, 70%)`,
              }}
              animate={{
                y: [0, -40 - Math.random() * 20, 0],
                x: [0, Math.random() * 20 - 10, 0],
                opacity: [0.3, 0.8, 0.3],
                scale: [0.7, 1.3, 0.7],
              }}
              transition={{
                duration: 5 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
        
        {/* Neural connection lines */}
        <div className="absolute inset-0">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`line-${i}`}
              className="absolute opacity-20"
              style={{
                left: `${10 + i * 10}%`,
                top: `${20 + Math.random() * 60}%`,
                width: '1px',
                height: '60px',
                background: 'linear-gradient(to bottom, transparent, hsl(var(--primary)), transparent)',
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
              animate={{
                opacity: [0.1, 0.4, 0.1],
                scaleY: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </div>
      
      {/* Pinned Film Strip Container */}
      <div className="relative w-full max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Why EROXR Exists
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            The creator economy is broken. We're here to fix it.
          </p>
        </motion.div>

        {/* Film Strip Panels */}
        <motion.div 
          style={{ x }}
          className="flex gap-8 md:gap-12"
        >
          {scenes.map((scene, index) => (
            <motion.div
              key={index}
              className={`flex-shrink-0 w-full md:w-96 h-96 relative rounded-2xl overflow-hidden ${
                currentScene === index ? 'ring-2 ring-primary' : ''
              }`}
              style={{
                boxShadow: currentScene === index ? 'var(--glow-primary)' : 'none'
              }}
              animate={{
                scale: currentScene === index ? 1.05 : 1,
                opacity: currentScene === index ? 1 : 0.7
              }}
              transition={{ duration: 0.5 }}
            >
              {/* Scene Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${scene.gradient} opacity-20`} />
              <div className="absolute inset-0 bg-black/60" />
              
              {/* Scene Content */}
              <div className="relative z-10 h-full flex flex-col justify-center items-center text-center p-8">
                <motion.h3 
                  className="text-3xl md:text-4xl font-bold text-white mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={currentScene === index ? { opacity: 1, y: 0 } : { opacity: 0.7, y: 10 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  {scene.title}
                </motion.h3>
                
                <motion.p 
                  className="text-lg text-white/80 leading-relaxed"
                  initial={{ opacity: 0 }}
                  animate={currentScene === index ? { opacity: 1 } : { opacity: 0.6 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  {scene.description}
                </motion.p>
              </div>

              {/* Scene Indicator */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <div className="flex gap-2">
                  {scenes.map((_, i) => (
                    <motion.div
                      key={i}
                      className={`w-2 h-2 rounded-full ${
                        i === index ? 'bg-primary' : 'bg-white/30'
                      }`}
                      animate={{ scale: i === currentScene ? 1.2 : 1 }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Progress Indicator */}
        <div className="flex justify-center mt-12 gap-4">
          {scenes.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentScene(index)}
              className={`w-12 h-1 rounded-full transition-all duration-300 ${
                currentScene === index 
                  ? 'bg-primary scale-110' 
                  : 'bg-white/30 hover:bg-white/50'
              }`}
              style={{
                boxShadow: currentScene === index ? 'var(--glow-primary)' : 'none'
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};