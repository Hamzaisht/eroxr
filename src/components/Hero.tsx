
import { useSession } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform, useSpring, useScroll } from "framer-motion";
import { useMouseParallax } from "@/hooks/use-mouse-parallax";
import { useInView } from "react-intersection-observer";

export const Hero = () => {
  const session = useSession();
  const navigate = useNavigate();
  const { x, y } = useMouseParallax(0.1);
  const containerRef = useRef<HTMLDivElement>(null);
  const [textRef, textInView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  
  // Scroll effects
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  const y2 = useTransform(scrollYProgress, [0, 0.5], [0, 100]);
  
  useEffect(() => {
    if (session) {
      navigate("/home");
    }
  }, [session, navigate]);

  // Floating text effect
  const textVariants = {
    hidden: { opacity: 0 },
    visible: (i: number) => ({
      opacity: 1,
      transition: {
        delay: i * 0.1,
      }
    })
  };

  // Split text for character animation
  const titleText = "Welcome to EROXR";
  const titleChars = titleText.split("");

  return (
    <motion.div 
      ref={containerRef}
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #0D1117 0%, #161B22 100%)",
      }}
    >
      {/* Parallax background elements */}
      <motion.div 
        style={{ x, y }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(white,transparent_80%)] opacity-5" />
      </motion.div>

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full px-4 sm:px-8 md:px-16 lg:px-24"
        style={{ opacity, scale, y: y2 }}
      >
        <div className="relative backdrop-blur-xl bg-white/5 rounded-2xl p-8 shadow-2xl border border-luxury-primary/20">
          <div className="absolute inset-0 bg-gradient-to-br from-luxury-primary/10 via-luxury-accent/5 to-transparent rounded-2xl" />
          
          {/* Animated neon border */}
          <motion.div 
            className="absolute inset-0 rounded-2xl"
            animate={{
              boxShadow: [
                "0 0 5px rgba(155, 135, 245, 0.1)",
                "0 0 15px rgba(155, 135, 245, 0.2)",
                "0 0 5px rgba(155, 135, 245, 0.1)"
              ]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
          />
          
          <div className="relative">
            <div className="text-center mb-12">
              <motion.h1 
                ref={textRef}
                className="text-4xl md:text-5xl font-bold relative overflow-hidden py-2"
              >
                <div className="flex justify-center">
                  {titleChars.map((char, index) => (
                    <motion.span
                      key={index}
                      custom={index}
                      variants={textVariants}
                      initial="hidden"
                      animate={textInView ? "visible" : "hidden"}
                      className={`inline-block ${char === " " ? "w-[0.3em]" : ""}`}
                    >
                      {char !== " " ? (
                        <motion.span
                          className="inline-block bg-gradient-to-r from-luxury-primary to-luxury-accent bg-clip-text text-transparent"
                          animate={{
                            y: [0, -3, 0],
                          }}
                          transition={{
                            duration: 2,
                            delay: index * 0.05,
                            repeat: Infinity,
                            repeatType: "reverse",
                            ease: "easeInOut",
                          }}
                        >
                          {char}
                        </motion.span>
                      ) : (
                        char
                      )}
                    </motion.span>
                  ))}
                </div>
              </motion.h1>
              
              <motion.p 
                className="text-luxury-neutral/80 mt-4 max-w-xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <span className="relative">
                  Join our exclusive community
                  <motion.span 
                    className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-luxury-primary/40 to-transparent"
                    animate={{ 
                      scaleX: [0, 1, 0],
                      x: ["-100%", "0%", "100%"]
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity,
                      repeatDelay: 1
                    }}
                  />
                </span>
              </motion.p>
            </div>
            
            <div className="text-center space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="space-y-4"
              >
                <motion.button
                  onClick={() => navigate("/register")}
                  className="w-full h-14 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 hover:from-pink-600 hover:via-purple-600 hover:to-cyan-600 text-white font-semibold text-lg rounded-xl transition-all duration-500 transform"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Get Started
                </motion.button>
                
                <p className="text-sm text-gray-400">
                  Already have an account?{" "}
                  <motion.button
                    onClick={() => navigate("/login")}
                    className="relative text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Sign in
                  </motion.button>
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ 
          y: [0, 10, 0],
          opacity: [0.5, 0.8, 0.5]
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{ opacity: useTransform(scrollYProgress, [0, 0.2], [1, 0]) }}
      >
        <motion.div 
          className="flex flex-col items-center"
          whileHover={{ scale: 1.1 }}
        >
          <div className="h-16 w-px bg-gradient-to-b from-luxury-primary/50 to-transparent" />
          <span className="text-xs text-luxury-neutral/50 uppercase tracking-widest mt-2">Scroll</span>
        </motion.div>
      </motion.div>
      
      {/* Floating particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-luxury-primary/20"
          style={{
            width: Math.random() * 6 + 2,
            height: Math.random() * 6 + 2,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: Math.random() * 5 + 5,
            delay: Math.random() * 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </motion.div>
  );
};
