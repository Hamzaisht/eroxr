
import { motion } from "framer-motion";
import { Zap } from "lucide-react";

interface UploadHeaderProps {
  fileCount: number;
}

export const UploadHeader = ({ fileCount }: UploadHeaderProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.6 }}
      className="text-center mb-8"
    >
      <div className="flex justify-center items-center gap-3 mb-4">
        <motion.div
          className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Zap className="w-6 h-6 text-white" />
        </motion.div>
        <div>
          <motion.h2
            className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              backgroundSize: '200% auto',
            }}
          >
            Media Upload Portal
          </motion.h2>
          <p className="text-gray-300">
            {fileCount} file{fileCount > 1 ? 's' : ''} ready for processing
          </p>
        </div>
      </div>
    </motion.div>
  );
};
