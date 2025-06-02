
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { FilePreview } from './FilePreview';

interface FileListProps {
  selectedFiles: File[];
  isUploading: boolean;
  onRemoveFile: (index: number) => void;
}

export const FileList = ({ selectedFiles, isUploading, onRemoveFile }: FileListProps) => {
  return (
    <motion.div 
      className="mt-6 space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-purple-400" />
          <h4 className="text-sm font-medium text-white">
            Selected Files ({selectedFiles.length})
          </h4>
        </div>
        
        {selectedFiles.map((file, index) => (
          <FilePreview
            key={index}
            file={file}
            index={index}
            isUploading={isUploading}
            onRemove={onRemoveFile}
          />
        ))}
      </div>
    </motion.div>
  );
};
