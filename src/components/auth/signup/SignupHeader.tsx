
import { motion } from "framer-motion";

export const SignupHeader = () => {
  return (
    <div className="text-center space-y-2">
      <motion.div 
        className="relative flex flex-col items-center justify-center mb-6"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="relative w-20 h-20">
          {/* Outer Circle - Versace-inspired border */}
          <motion.div 
            className="absolute inset-0 rounded-full border-2 border-luxury-primary"
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            {/* Decorative elements */}
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1.5 h-1.5 bg-luxury-accent"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: `rotate(${i * 45}deg) translateX(2.5rem) translate(-50%, -50%)`,
                }}
              />
            ))}
          </motion.div>

          {/* Inner Circle - Main logo container */}
          <div className="absolute inset-2 rounded-full bg-gradient-to-br from-luxury-darker to-[#1A1F2C] flex items-center justify-center overflow-hidden">
            {/* Freya's Wings */}
            <motion.div
              className="absolute w-full h-full"
              initial={{ rotate: -10, scale: 0.9 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
            >
              <div className="absolute left-1/2 top-1/2 w-4 h-8 -translate-x-1/2 -translate-y-1/2">
                <div className="absolute left-0 w-4 h-4 bg-gradient-to-r from-luxury-primary to-luxury-accent transform -rotate-45 rounded-tl-full" />
                <div className="absolute right-0 w-4 h-4 bg-gradient-to-l from-luxury-primary to-luxury-accent transform rotate-45 rounded-tr-full" />
              </div>
            </motion.div>

            {/* Eros's Arrow */}
            <motion.div
              className="absolute w-6 h-0.5 bg-gradient-to-r from-luxury-primary via-luxury-accent to-luxury-primary"
              initial={{ rotate: 45, scale: 0.8, opacity: 0.5 }}
              animate={{ rotate: 225, scale: 1.2, opacity: 1 }}
              transition={{ duration: 3, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
            >
              <div className="absolute -right-1 -top-1 w-2 h-2 bg-luxury-accent transform rotate-45" />
            </motion.div>
          </div>
        </div>

        {/* Logo Text */}
        <motion.h2 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-4 text-4xl font-bold bg-gradient-to-r from-luxury-primary to-luxury-accent bg-clip-text text-transparent"
        >
          EROXR
        </motion.h2>
      </motion.div>
      <p className="text-luxury-neutral/80">Create your account</p>
    </div>
  );
};
