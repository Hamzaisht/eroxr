
import { motion } from "framer-motion";

export const LoadingScreen = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full"
      />
    </div>
  );
};
