
import { motion } from "framer-motion";
import { Zap } from "lucide-react";

interface UploadSuccessMessageProps {
  uploadSuccess: boolean;
}

export const UploadSuccessMessage = ({ uploadSuccess }: UploadSuccessMessageProps) => {
  if (!uploadSuccess) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="text-center space-y-3 p-6 rounded-xl bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 border border-cyan-500/20 mt-8"
    >
      <motion.div 
        className="flex items-center justify-center gap-2"
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Zap className="w-5 h-5 text-cyan-400" />
        <p className="text-lg font-semibold text-white">Your content is ready!</p>
      </motion.div>
      <p className="text-sm text-gray-400">
        Add a caption and share your amazing content with the world
      </p>
    </motion.div>
  );
};
