import { motion, useTransform, MotionValue, useMotionValue, useSpring } from 'framer-motion';
import { useRef, useState } from 'react';

interface Interactive3DHeroProps {
  scrollYProgress: MotionValue<number>;
}

// Mouse-following spotlight effect
const InteractiveSpotlight = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springX = useSpring(mouseX, { damping: 25, stiffness: 200 });
  const springY = useSpring(mouseY, { damping: 25, stiffness: 200 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    mouseX.set(x * 100);
    mouseY.set(y * 100);
  };

  return (
    <motion.div 
      className="absolute inset-0 pointer-events-none"
      onMouseMove={handleMouseMove}
      style={{
        background: `radial-gradient(circle 600px at ${springX}% ${springY}%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)`
      }}
    />
  );
};

// Floating elements with parallax
const FloatingElements = ({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) => {
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <>
      <motion.div 
        className="absolute top-20 left-20 w-4 h-4 bg-purple-400 rounded-full opacity-60"
        style={{ y: y1 }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.6, 1, 0.6]
        }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <motion.div 
        className="absolute top-40 right-32 w-3 h-3 bg-pink-400 rounded-full opacity-80"
        style={{ y: y2 }}
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.8, 0.4, 0.8]
        }}
        transition={{ duration: 4, repeat: Infinity, delay: 1 }}
      />
      <motion.div 
        className="absolute bottom-32 left-1/3 w-2 h-2 bg-cyan-400 rounded-full opacity-70"
        style={{ y: y3 }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.7, 1, 0.7]
        }}
        transition={{ duration: 5, repeat: Infinity, delay: 2 }}
      />
    </>
  );
};

export const Interactive3DHero = ({ scrollYProgress }: Interactive3DHeroProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95]);
  const textY = useTransform(scrollYProgress, [0, 0.3], [0, -100]);

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Interactive Mouse Spotlight */}
      <InteractiveSpotlight />
      
      {/* CSS-based 3D Effect Background */}
      <div className="absolute inset-0 opacity-60">
        {/* Floating 3D-style orbs */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full blur-lg ${
              i % 3 === 0 ? 'bg-purple-500/30' : 
              i % 3 === 1 ? 'bg-pink-500/30' : 'bg-cyan-500/30'
            }`}
            style={{
              width: `${60 + i * 20}px`,
              height: `${60 + i * 20}px`,
              left: `${20 + i * 15}%`,
              top: `${20 + i * 10}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, 20, 0],
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5
            }}
          />
        ))}
      </div>

      {/* Floating Parallax Elements */}
      <FloatingElements scrollYProgress={scrollYProgress} />

      {/* Animated Grid Background */}
      <div className="absolute inset-0 opacity-10">
        <motion.div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(139, 92, 246, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(139, 92, 246, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
          animate={{
            backgroundPosition: ['0px 0px', '50px 50px']
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
      </div>

      {/* Content */}
      <motion.div 
        className="relative z-20 text-center px-6 max-w-6xl mx-auto"
        style={{ opacity, scale, y: textY }}
      >
        {/* Premium Badge with Micro Animation */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.span 
            className="inline-flex items-center px-6 py-3 rounded-full bg-white/5 border border-white/20 text-sm text-gray-300 backdrop-blur-md relative overflow-hidden"
            whileHover={{ scale: 1.05 }}
            onHoverStart={() => setIsLoaded(true)}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20"
              initial={{ x: '-100%' }}
              animate={isLoaded ? { x: '100%' } : { x: '-100%' }}
              transition={{ duration: 0.6 }}
            />
            <span className="relative z-10 flex items-center gap-2">
              ✨ The Premium Creator Platform
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              >
                ⚡
              </motion.div>
            </span>
          </motion.span>
        </motion.div>

        {/* Main Title with Advanced Typography */}
        <motion.h1 
          className="text-6xl md:text-8xl lg:text-9xl font-bold mb-8 leading-[0.85] tracking-tight"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.4 }}
        >
          <motion.span 
            className="block text-white font-light"
            whileHover={{ 
              scale: 1.02,
              textShadow: '0 0 20px rgba(255, 255, 255, 0.5)'
            }}
          >
            Create.
          </motion.span>
          <motion.span 
            className="block bg-gradient-to-r from-purple-400 via-pink-400 to-purple-300 bg-clip-text text-transparent font-bold relative"
            whileHover={{ scale: 1.02 }}
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
            }}
            transition={{ duration: 5, repeat: Infinity }}
            style={{
              backgroundSize: '200% 200%'
            }}
          >
            Connect.
            <motion.div
              className="absolute -inset-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 blur-xl -z-10"
              animate={{
                opacity: [0.5, 1, 0.5],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </motion.span>
          <motion.span 
            className="block text-white font-light"
            whileHover={{ 
              scale: 1.02,
              textShadow: '0 0 20px rgba(255, 255, 255, 0.5)'
            }}
          >
            Earn.
          </motion.span>
        </motion.h1>
        
        {/* Subtitle with Parallax */}
        <motion.p 
          className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed font-light"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          style={{
            y: useTransform(scrollYProgress, [0, 0.2], [0, -20])
          }}
        >
          Join the most exclusive creator platform. Premium content, premium audience, premium earnings.
        </motion.p>
        
        {/* Interactive Buttons */}
        <motion.div 
          className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <motion.button 
            className="group relative px-10 py-5 bg-white text-black text-lg font-medium rounded-full overflow-hidden min-w-[250px]"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600"
              initial={{ x: '-100%' }}
              whileHover={{ x: '0%' }}
              transition={{ duration: 0.3 }}
            />
            <span className="relative z-10 flex items-center justify-center gap-3 group-hover:text-white transition-colors">
              Start Creating
              <motion.svg 
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </motion.svg>
            </span>
          </motion.button>
          
          <motion.button 
            className="group px-10 py-5 border-2 border-white/30 text-white text-lg font-medium rounded-full hover:bg-white/10 hover:border-white/50 transition-all duration-300 backdrop-blur-sm min-w-[250px] relative overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20"
              initial={{ scale: 0 }}
              whileHover={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            />
            <span className="relative z-10">Explore Platform</span>
          </motion.button>
        </motion.div>

        {/* Enhanced Stats with Micro Interactions */}
        <motion.div 
          className="grid grid-cols-3 gap-8 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
        >
          {[
            { value: '85%', label: 'Revenue Share', color: 'from-purple-400 to-purple-600' },
            { value: '$2.5M+', label: 'Creator Earnings', color: 'from-pink-400 to-pink-600' },
            { value: '50K+', label: 'Active Members', color: 'from-cyan-400 to-cyan-600' }
          ].map((stat, index) => (
            <motion.div 
              key={index}
              className="text-center group cursor-pointer"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 + index * 0.1 }}
            >
              <div className={`text-3xl md:text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform`}>
                {stat.value}
              </div>
              <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                {stat.label}
              </div>
              <motion.div
                className={`h-1 w-0 mx-auto mt-2 bg-gradient-to-r ${stat.color} group-hover:w-full transition-all duration-500`}
              />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
      
      {/* Bottom Gradient with Parallax */}
      <motion.div 
        className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black to-transparent pointer-events-none"
        style={{
          opacity: useTransform(scrollYProgress, [0, 0.1], [1, 0.5])
        }}
      />
    </section>
  );
};