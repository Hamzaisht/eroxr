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
    <main className="flex-1 min-h-screen w-full transition-all duration-300">
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className={cn(
            "w-full min-h-screen",
            isErosRoute ? 'pt-0' : 'pt-16 px-4 md:px-6'
          )}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </main>
  );
};