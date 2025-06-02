
import { Upload } from 'lucide-react';
import { motion } from 'framer-motion';
import { MouseEventHandler, KeyboardEventHandler, FocusEventHandler } from 'react';

interface DropZoneProps {
  isDragActive: boolean;
  acceptedTypes: string[];
  maxFiles: number;
  onClick: MouseEventHandler<HTMLElement>;
  onKeyDown: KeyboardEventHandler<HTMLElement>;
  onFocus: FocusEventHandler<HTMLElement>;
  onBlur: FocusEventHandler<HTMLElement>;
  getInputProps: () => any;
}

export const DropZone = ({
  isDragActive,
  acceptedTypes,
  maxFiles,
  onClick,
  onKeyDown,
  onFocus,
  onBlur,
  getInputProps
}: DropZoneProps) => {
  return (
    <div
      onClick={onClick}
      onKeyDown={onKeyDown}
      onFocus={onFocus}
      onBlur={onBlur}
      tabIndex={0}
      role="button"
      aria-label="Upload files"
      className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 cursor-pointer relative overflow-hidden ${
        isDragActive 
          ? 'border-cyan-400 bg-cyan-400/5' 
          : 'border-gray-600/50 hover:border-cyan-400/40 hover:bg-gray-800/30'
      }`}
    >
      <input {...getInputProps()} />
      
      {/* Background glow effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-pink-500/5 opacity-0"
        animate={isDragActive ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.3 }}
      />
      
      <div className="relative">
        <motion.div
          animate={isDragActive ? { scale: 1.2, rotate: 10 } : { scale: 1, rotate: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Upload className="mx-auto h-8 w-8 text-cyan-400 mb-3" />
        </motion.div>
        
        <motion.p 
          className="text-sm text-gray-300 mb-2"
          animate={isDragActive ? { scale: 1.05 } : { scale: 1 }}
        >
          {isDragActive ? 'Drop files here...' : 'Drag and drop files here or click to browse'}
        </motion.p>
        
        <p className="text-xs text-gray-500">
          Supported: {acceptedTypes.join(', ')} • Max {maxFiles} files
        </p>
      </div>
    </div>
  );
};
