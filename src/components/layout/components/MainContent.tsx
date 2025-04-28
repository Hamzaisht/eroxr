
import { ReactNode, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { useMediaQuery } from "@/hooks/use-mobile";

interface MainContentProps {
  children: ReactNode;
  isErosRoute?: boolean;
}

export const MainContent = ({ children, isErosRoute = false }: MainContentProps) => {
  const location = useLocation();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");
  const contentRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: contentRef,
    offset: ["start start", "end end"]
  });
  
  // Dynamic transform effects based on scroll
  const backgroundOpacity = useTransform(scrollYProgress, [0, 0.5], [0.05, 0.02]);
  const borderGlow = useTransform(scrollYProgress, [0, 0.3, 0.5], [
    "0 0 0px rgba(155, 135, 245, 0)",
    "0 0 15px rgba(155, 135, 245, 0.1)",
    "0 0 0px rgba(155, 135, 245, 0)"
  ]);
  
  // Apply chromatic aberration effect based on scroll
  const [redX, blueX] = [
    useTransform(scrollYProgress, [0, 1], [0, 2]),
    useTransform(scrollYProgress, [0, 1], [0, -2])
  ];

  return (
    <motion.div
      ref={contentRef}
      key={location.pathname}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`relative w-full min-h-screen ${
        isMobile ? 'pt-16' : isTablet ? 'pt-18' : 'pt-20'
      }`}
    >
      {/* Subtle parallax background effect */}
      <motion.div 
        className="absolute inset-0 pointer-events-none z-[-1]"
        style={{ 
          backgroundImage: "radial-gradient(circle at 50% 50%, rgba(155, 135, 245, 0.05) 0%, rgba(22, 27, 34, 0) 70%)",
          opacity: backgroundOpacity,
          boxShadow: borderGlow
        }}
      />
      
      {/* Subtle chromatic aberration */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-[-1] opacity-30"
        style={{
          background: "transparent",
          boxShadow: "inset 0 0 50px rgba(0, 0, 0, 0.1)",
        }}
      >
        <motion.div
          className="absolute inset-0 bg-red-500/5"
          style={{ x: redX, mixBlendMode: "screen" }}
        />
        <motion.div
          className="absolute inset-0 bg-blue-500/5"
          style={{ x: blueX, mixBlendMode: "screen" }}
        />
      </motion.div>
      
      {/* Content wrapper */}
      <div className={isErosRoute ? 'w-full' : 'w-full px-4 sm:px-6 md:px-8 lg:px-12'}>
        {children}
      </div>
    </motion.div>
  );
};
