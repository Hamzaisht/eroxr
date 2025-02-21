
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
        <div className="relative w-24 h-24">
          {/* Greek Key Pattern Border */}
          <motion.div 
            className="absolute inset-0 rounded-full"
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            {/* Generate Greek key pattern segments */}
            {[...Array(16)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1.5 h-3 bg-luxury-primary"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: `
                    rotate(${i * (360 / 16)}deg) 
                    translateX(3rem) 
                    rotate(${i * (360 / 16)}deg)
                  `,
                }}
              >
                <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-luxury-primary" />
              </div>
            ))}
          </motion.div>

          {/* Inner Circle - Main logo container */}
          <div className="absolute inset-3 rounded-full bg-gradient-to-br from-luxury-darker to-[#1A1F2C] flex items-center justify-center overflow-hidden">
            {/* Combined Heart Symbol */}
            <motion.div
              className="relative w-10 h-10"
              initial={{ scale: 0.9, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
            >
              {/* Heart shape */}
              <div className="absolute inset-0">
                <div className="absolute w-5 h-8 bg-gradient-to-br from-luxury-primary to-luxury-accent rounded-t-full"
                     style={{ left: '0', transform: 'rotate(-45deg) translateY(-50%)' }} />
                <div className="absolute w-5 h-8 bg-gradient-to-bl from-luxury-primary to-luxury-accent rounded-t-full"
                     style={{ right: '0', transform: 'rotate(45deg) translateY(-50%)' }} />
              </div>

              {/* Animated glow effect */}
              <motion.div
                className="absolute inset-0 bg-luxury-accent/20 blur-md"
                initial={{ opacity: 0.2 }}
                animate={{ opacity: 0.6 }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut"
                }}
              />
            </motion.div>
          </div>
        </div>

        {/* Logo Text */}
        <motion.div 
          className="mt-4 space-y-1"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-4xl font-bold bg-gradient-to-r from-luxury-primary to-luxury-accent bg-clip-text text-transparent">
            EROXR
          </h2>
          <p className="text-sm text-luxury-primary/80 tracking-wider">GOD OF LOVE</p>
        </motion.div>
      </motion.div>
      <p className="text-luxury-neutral/80">Create your account</p>
    </div>
  );
};
