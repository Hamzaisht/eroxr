
import { motion } from "framer-motion";

export const NotFoundScreen = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-2xl font-bold text-white mb-2">Profile not found</h1>
        <p className="text-slate-400">The profile you're looking for doesn't exist.</p>
      </motion.div>
    </div>
  );
};
