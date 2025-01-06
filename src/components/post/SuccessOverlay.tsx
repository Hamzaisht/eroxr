import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

interface SuccessOverlayProps {
  show: boolean;
}

export const SuccessOverlay = ({ show }: SuccessOverlayProps) => {
  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", damping: 15 }}
        className="flex flex-col items-center space-y-4 text-center"
      >
        <CheckCircle2 className="w-16 h-16 text-green-500" />
        <h3 className="text-xl font-semibold">Post Created Successfully!</h3>
        <p className="text-muted-foreground">Your content is now live</p>
      </motion.div>
    </motion.div>
  );
};