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
  console.log("MainContent rendering", { location, children }); // Debug log

  return (
    <div className="relative w-full min-h-screen">
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
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