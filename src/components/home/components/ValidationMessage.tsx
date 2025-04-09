
import { AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ValidationMessageProps {
  message: string | null;
}

export const ValidationMessage = ({ message }: ValidationMessageProps) => {
  if (!message) return null;
  
  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="text-red-500 text-sm flex items-center gap-1 mt-1"
      >
        <AlertCircle className="h-4 w-4" />
        {message}
      </motion.div>
    </AnimatePresence>
  );
};
