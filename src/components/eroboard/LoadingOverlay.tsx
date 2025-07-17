import { motion } from "framer-motion";
import { BarChart3, Loader2 } from "lucide-react";

interface LoadingOverlayProps {
  message?: string;
  className?: string;
}

export function LoadingOverlay({ message = "Loading analytics data...", className = "" }: LoadingOverlayProps) {
  return (
    <div className={`min-h-screen bg-background flex items-center justify-center ${className}`}>
      <motion.div 
        className="flex flex-col items-center space-y-6 p-8"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Animated Logo/Icon */}
        <motion.div
          className="relative"
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            rotate: { duration: 4, repeat: Infinity, ease: "linear" },
            scale: { duration: 2, repeat: Infinity }
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/40 rounded-full blur-xl" />
          <div className="relative bg-gradient-to-r from-primary/10 to-primary/20 p-4 rounded-full border border-primary/20">
            <BarChart3 className="h-12 w-12 text-primary" />
          </div>
        </motion.div>

        {/* Loading Text with Animation */}
        <motion.div
          className="text-center space-y-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <h3 className="text-lg font-semibold text-foreground">
            {message}
          </h3>
          <p className="text-sm text-muted-foreground">
            Preparing your comprehensive analytics dashboard
          </p>
        </motion.div>

        {/* Animated Progress Bar */}
        <motion.div 
          className="w-64 h-1 bg-muted rounded-full overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full"
            animate={{ 
              x: [-256, 256],
              scaleX: [0.3, 1, 0.3]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>

        {/* Loading Dots */}
        <motion.div 
          className="flex space-x-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-primary rounded-full"
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}