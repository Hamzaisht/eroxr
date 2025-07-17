import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, 
  Image, 
  FileText, 
  Music, 
  Video, 
  Mic,
  X,
  Zap,
  Plus
} from 'lucide-react';
import { SnapCamera } from './SnapCamera';
import { cn } from '@/lib/utils';

interface MediaAttachmentHubProps {
  onClose: () => void;
  onMediaSelect: (blob: Blob, type: 'snax' | 'media', duration?: number) => void;
}

export const MediaAttachmentHub = ({ onClose, onMediaSelect }: MediaAttachmentHubProps) => {
  const [showCamera, setShowCamera] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const categories = [
    { id: 'snax', name: 'Snax', icon: Zap, action: () => setShowCamera(true) },
    { id: 'photos', name: 'Photos', icon: Image, action: () => handleFileUpload('image/*') },
    { id: 'videos', name: 'Videos', icon: Video, action: () => handleFileUpload('video/*') },
    { id: 'voice', name: 'Voice', icon: Mic, action: () => console.log('Voice recording') },
    { id: 'music', name: 'Music', icon: Music, action: () => handleFileUpload('audio/*') },
    { id: 'documents', name: 'Files', icon: FileText, action: () => handleFileUpload('*/*') }
  ];

  const handleFileUpload = (accept: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = accept;
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        onMediaSelect(file, 'media');
        onClose();
      }
    };
    input.click();
  };

  const handleCameraCapture = (blob: Blob, isSnax = false, duration?: number) => {
    onMediaSelect(blob, isSnax ? 'snax' : 'media', duration);
    setShowCamera(false);
    onClose();
  };

  if (showCamera) {
    return (
      <SnapCamera
        onCapture={(blob) => handleCameraCapture(blob, true)}
        onClose={() => setShowCamera(false)}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-50"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Fluid container with dark theme */}
      <motion.div 
        className="relative rounded-lg overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, #0D1117, #161B22)',
          border: '1px solid hsla(var(--border) / 0.3)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          width: '200px'
        }}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.05, type: "spring", stiffness: 300, damping: 25 }}
        onMouseLeave={() => setHoveredIndex(null)}
      >
        {/* Vertical stack layout */}
        <div className="flex flex-col">
          {categories.map((category, index) => {
            const Icon = category.icon;
            const isSnax = category.id === 'snax';
            const isHovered = hoveredIndex === index;
            const hasHover = hoveredIndex !== null;
            
            return (
              <motion.button
                key={category.id}
                className="relative flex items-center gap-3 px-4 py-3 cursor-pointer border-none bg-transparent text-left"
                style={{
                  color: isSnax ? 'hsl(var(--primary))' : 'white',
                }}
                animate={{
                  filter: hasHover && !isHovered ? 'blur(1px)' : 'blur(0px)',
                  scale: hasHover && !isHovered ? 0.95 : 1,
                  backgroundColor: isHovered ? 'rgba(33, 38, 44, 0.8)' : 'transparent'
                }}
                transition={{ 
                  duration: 0.3,
                  ease: "easeOut"
                }}
                whileTap={{
                  scale: 0.95,
                  backgroundColor: 'rgba(26, 31, 36, 0.9)'
                }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  category.action();
                }}
                onMouseEnter={() => setHoveredIndex(index)}
              >
                {/* Left accent line */}
                <motion.div
                  className="absolute left-0 top-1 w-1 rounded-full"
                  style={{
                    height: 'calc(100% - 8px)',
                    backgroundColor: '#2F81F7'
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: isHovered ? 1 : 0
                  }}
                  transition={{ duration: 0.2 }}
                />
                
                {/* Icon */}
                <motion.div
                  animate={{
                    scale: isHovered ? 1.05 : 1
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <Icon 
                    className="h-4 w-4 flex-shrink-0"
                    style={{
                      color: isSnax ? 'hsl(var(--primary))' : '#8B949E'
                    }}
                  />
                </motion.div>
                
                {/* Label */}
                <span className="text-sm font-medium">
                  {category.name}
                </span>
                
                {/* Ripple effect */}
                <motion.div
                  className="absolute inset-0"
                  style={{
                    background: `radial-gradient(circle, hsla(var(--primary) / 0.1), transparent 70%)`,
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  whileTap={{ scale: 2, opacity: [0, 0.3, 0] }}
                  transition={{ duration: 0.4 }}
                />
              </motion.button>
            );
          })}
        </div>
        
        {/* Enhanced floating label */}
        <AnimatePresence>
          {hoveredIndex !== null && (
            <motion.div
              className="absolute -top-16 left-1/2 transform -translate-x-1/2 pointer-events-none"
              initial={{ 
                opacity: 0, 
                y: 10, 
                scale: 0.8,
                filter: "blur(4px)"
              }}
              animate={{ 
                opacity: 1, 
                y: 0, 
                scale: 1,
                filter: "blur(0px)"
              }}
              exit={{ 
                opacity: 0, 
                y: 10, 
                scale: 0.8,
                filter: "blur(4px)"
              }}
              transition={{ 
                type: "spring",
                stiffness: 400,
                damping: 25,
                duration: 0.2
              }}
            >
              <div
                className="px-4 py-2 rounded-xl text-sm font-medium tracking-wide whitespace-nowrap"
                style={{
                  background: 'linear-gradient(135deg, hsla(var(--primary) / 0.9), hsla(var(--primary) / 0.7))',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid hsla(var(--primary) / 0.3)',
                  color: 'hsla(var(--primary-foreground) / 0.95)',
                  boxShadow: '0 8px 32px hsla(var(--primary) / 0.4), inset 0 1px 0 hsla(var(--foreground) / 0.1)'
                }}
              >
                {categories[hoveredIndex].name}
                
                {/* Arrow pointing down */}
                <div
                  className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0"
                  style={{
                    borderLeft: '6px solid transparent',
                    borderRight: '6px solid transparent',
                    borderTop: '6px solid hsla(var(--primary) / 0.9)',
                    filter: 'drop-shadow(0 2px 4px hsla(var(--primary) / 0.2))'
                  }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Subtle pulse animation for the container */}
        <motion.div
          className="absolute inset-0 rounded-3xl"
          style={{
            background: 'linear-gradient(135deg, hsla(var(--primary) / 0.05), transparent)',
            opacity: 0
          }}
          animate={{
            opacity: [0, 0.3, 0]
          }}
          transition={{
            duration: 3,
            ease: "easeInOut",
            repeat: Infinity,
            repeatDelay: 2
          }}
        />
      </motion.div>
      
      {/* Close overlay */}
      <motion.div
        className="fixed inset-0 -z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
    </motion.div>
  );
};