
import { ReactNode } from "react";
import { motion } from "framer-motion";
import { useMediaQuery } from "@/hooks/use-mobile";

interface HomeLayoutProps {
  children: ReactNode;
}

export const HomeLayout = ({ children }: HomeLayoutProps) => {
  const isMobile = useMediaQuery("(max-width: 640px)");
  
  return (
    <div className="min-h-screen w-full bg-[#0D1117] relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(white,transparent_80%)] opacity-5" />
      
      {/* Animated Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className={`absolute -top-20 sm:-top-40 -right-20 sm:-right-40 h-[300px] sm:h-[500px] w-[300px] sm:w-[500px] rounded-full bg-luxury-primary/20 blur-3xl`}
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            delay: 1,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className={`absolute -bottom-20 sm:-bottom-40 -left-20 sm:-left-40 h-[300px] sm:h-[500px] w-[300px] sm:w-[500px] rounded-full bg-luxury-accent/20 blur-3xl`}
        />
      </div>
      
      {/* Content Container */}
      <div className="relative min-h-screen w-full backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full px-4 sm:px-6 md:px-8 lg:px-12 py-2 sm:py-4 space-y-4 sm:space-y-6"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
};
