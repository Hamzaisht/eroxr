import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useLocation } from "react-router-dom";

interface MainContentProps {
  children: ReactNode;
  isErosRoute?: boolean;
}

export const MainContent = ({ children, isErosRoute = false }: MainContentProps) => {
  const location = useLocation();

  return (
    <div className="min-h-screen w-full relative z-20">
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className={cn(
            "w-full min-h-screen",
            isErosRoute ? '' : 'p-4 md:p-6'
          )}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};