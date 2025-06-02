
import { motion } from "framer-motion";
import { CheckCircle, Upload, Image, Video, Mic } from "lucide-react";

interface FilePreviewItemProps {
  file: File;
  index: number;
  preview?: string;
  uploadSuccess: boolean;
  uploadInProgress: boolean;
}

export const FilePreviewItem = ({
  file,
  index,
  preview,
  uploadSuccess,
  uploadInProgress
}: FilePreviewItemProps) => {
  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image className="w-5 h-5 text-cyan-400" />;
    if (file.type.startsWith('video/')) return <Video className="w-5 h-5 text-purple-400" />;
    if (file.type.startsWith('audio/')) return <Mic className="w-5 h-5 text-pink-400" />;
    return <Upload className="w-5 h-5 text-blue-400" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-800/50 to-gray-700/50 border border-gray-600/30 p-4 hover:border-cyan-500/50 transition-all duration-300"
      whileHover={{ scale: 1.02 }}
    >
      {/* Ambient glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative space-y-3">
        {/* File Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div 
              className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-gray-700 to-gray-600"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              {getFileIcon(file)}
            </motion.div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-white truncate">{file.name}</p>
              <p className="text-xs text-gray-400">
                {(file.size / 1024 / 1024).toFixed(1)} MB
              </p>
            </div>
          </div>
          
          {/* Status Indicator */}
          <div className="flex items-center gap-2">
            {uploadSuccess && (
              <motion.div 
                className="flex items-center justify-center w-6 h-6 rounded-full bg-green-500/20"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <CheckCircle className="w-4 h-4 text-green-400" />
              </motion.div>
            )}
            
            {uploadInProgress && (
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/20">
                <Upload className="w-4 h-4 text-blue-400 animate-spin" />
              </div>
            )}
          </div>
        </div>
        
        {/* Image Preview */}
        {preview && (
          <div className="relative overflow-hidden rounded-lg bg-gray-800">
            <img 
              src={preview} 
              alt={file.name}
              className="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        )}
        
        {/* Progress Indicator */}
        {uploadInProgress && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Uploading...</span>
              <span className="text-blue-400">Processing</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-1">
              <motion.div 
                className="bg-gradient-to-r from-cyan-500 to-purple-500 h-1 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </div>
        )}
        
        {/* Success State */}
        {uploadSuccess && (
          <motion.div 
            className="flex items-center gap-2 text-xs text-green-400 bg-green-500/10 rounded-lg px-3 py-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <CheckCircle className="w-3 h-3" />
            <span>Ready to post</span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
