
import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";

interface MainContentProps {
  children: ReactNode;
  isErosRoute?: boolean;
}

export const MainContent = ({ children, isErosRoute = false }: MainContentProps) => {
  const location = useLocation();

  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="relative w-full min-h-screen"
    >
      <div className={`${isErosRoute ? 'max-w-none p-0' : 'container mx-auto px-0 sm:px-2 md:px-4'}`}>
        {children}
      </div>
    </motion.div>
  );
};
