
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
      <div className={`container mx-auto py-6 px-4 ${isErosRoute ? 'max-w-none p-0' : 'max-w-7xl'}`}>
        {children}
      </div>
    </motion.div>
  );
};
