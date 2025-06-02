
import { motion } from "framer-motion";
import { Upload } from "lucide-react";

interface UploadHeaderProps {
  fileCount: number;
}

export const UploadHeader = ({ fileCount }: UploadHeaderProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.4 }}
      className="text-center mb-4"
    >
      <div className="flex justify-center items-center gap-2 mb-2">
        <motion.div
          className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Upload className="w-4 h-4 text-white" />
        </motion.div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Media Upload
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {fileCount} file{fileCount > 1 ? 's' : ''} selected
          </p>
        </div>
      </div>
    </motion.div>
  );
};
