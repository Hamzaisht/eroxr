
import { X, Image, Video, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface FilePreviewProps {
  file: File;
  index: number;
  isUploading: boolean;
  onRemove: (index: number) => void;
}

export const FilePreview = ({ file, index, isUploading, onRemove }: FilePreviewProps) => {
  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image className="w-5 h-5 text-cyan-400" />;
    if (file.type.startsWith('video/')) return <Video className="w-5 h-5 text-purple-400" />;
    return <FileText className="w-5 h-5 text-pink-400" />;
  };

  return (
    <motion.div 
      className="flex items-center justify-between p-3 bg-gray-800/30 border border-gray-700/30 rounded-lg group hover:border-gray-600/50 transition-all duration-200"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-center gap-3">
        <motion.div
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.5 }}
        >
          {getFileIcon(file)}
        </motion.div>
        <div>
          <span className="text-sm text-white truncate block max-w-[200px]">
            {file.name}
          </span>
          <span className="text-xs text-gray-400">
            ({(file.size / 1024 / 1024).toFixed(1)} MB)
          </span>
        </div>
      </div>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => onRemove(index)}
        disabled={isUploading}
        className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/20 hover:text-red-400"
      >
        <X className="h-4 w-4" />
      </Button>
    </motion.div>
  );
};
