
import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useMediaQuery } from "@/hooks/use-mobile";

interface MainContentProps {
  children: ReactNode;
  isErosRoute?: boolean;
}

export const MainContent = ({ children, isErosRoute = false }: MainContentProps) => {
  const location = useLocation();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");

  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={`relative w-full min-h-screen ${isMobile ? 'pt-12' : isTablet ? 'pt-14' : 'pt-16'}`}
    >
      <div className={`${isErosRoute ? 'max-w-none p-0' : 'container mx-auto px-0 sm:px-2 md:px-4 lg:px-6'}`}>
        {children}
      </div>
    </motion.div>
  );
};
