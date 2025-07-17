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
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 20 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 25,
        mass: 0.8
      }}
      className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-50"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Main container with glass morphism */}
      <motion.div 
        className="relative bg-background/80 backdrop-blur-3xl rounded-3xl border border-primary/20 shadow-2xl p-6"
        style={{
          background: 'linear-gradient(145deg, hsla(var(--background) / 0.95), hsla(var(--background) / 0.85))',
          boxShadow: '0 25px 60px -12px hsla(var(--primary) / 0.25), 0 0 0 1px hsla(var(--primary) / 0.1), inset 0 1px 0 hsla(var(--foreground) / 0.05)'
        }}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 20 }}
      >
        {/* Grid layout for better organization */}
        <div className="grid grid-cols-3 gap-4 w-fit">
          {categories.map((category, index) => {
            const Icon = category.icon;
            const isSnax = category.id === 'snax';
            
            return (
              <motion.button
                key={category.id}
                className="group relative w-16 h-16 rounded-2xl flex flex-col items-center justify-center overflow-hidden"
                style={{
                  background: isSnax 
                    ? 'linear-gradient(135deg, hsla(var(--primary) / 0.15), hsla(var(--primary) / 0.05))'
                    : 'linear-gradient(135deg, hsla(var(--muted) / 0.8), hsla(var(--muted) / 0.4))',
                  backdropFilter: 'blur(20px)',
                  border: `1px solid hsla(var(--${isSnax ? 'primary' : 'muted-foreground'}) / 0.2)`,
                  boxShadow: hoveredIndex === index 
                    ? '0 8px 32px hsla(var(--primary) / 0.3), inset 0 1px 0 hsla(var(--foreground) / 0.1)'
                    : '0 4px 16px hsla(var(--foreground) / 0.05), inset 0 1px 0 hsla(var(--foreground) / 0.05)'
                }}
                initial={{ 
                  scale: 0, 
                  opacity: 0,
                  rotateY: -90 
                }}
                animate={{ 
                  scale: 1, 
                  opacity: 1,
                  rotateY: 0 
                }}
                transition={{ 
                  delay: index * 0.08 + 0.2,
                  duration: 0.6,
                  type: "spring",
                  stiffness: 300,
                  damping: 20
                }}
                whileHover={{ 
                  scale: 1.1,
                  y: -2,
                  transition: { 
                    type: "spring", 
                    stiffness: 400, 
                    damping: 15,
                    duration: 0.15
                  }
                }}
                whileTap={{ 
                  scale: 0.95,
                  transition: { duration: 0.1 }
                }}
                onClick={category.action}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Background glow effect */}
                <motion.div
                  className="absolute inset-0 rounded-2xl"
                  style={{
                    background: isSnax 
                      ? 'radial-gradient(circle at center, hsla(var(--primary) / 0.2), transparent 70%)'
                      : 'radial-gradient(circle at center, hsla(var(--muted-foreground) / 0.1), transparent 70%)',
                    opacity: hoveredIndex === index ? 1 : 0
                  }}
                  transition={{ duration: 0.3 }}
                />
                
                {/* Icon */}
                <motion.div
                  initial={{ scale: 1 }}
                  animate={{ 
                    scale: hoveredIndex === index ? 1.1 : 1,
                    rotate: hoveredIndex === index ? 5 : 0
                  }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 400, 
                    damping: 20,
                    duration: 0.2
                  }}
                >
                  <Icon 
                    className={cn(
                      "h-5 w-5 transition-all duration-300",
                      isSnax 
                        ? "text-primary group-hover:text-primary" 
                        : "text-muted-foreground group-hover:text-foreground"
                    )}
                  />
                </motion.div>
                
                {/* Subtle shimmer effect */}
                <motion.div
                  className="absolute inset-0 rounded-2xl"
                  style={{
                    background: 'linear-gradient(45deg, transparent 30%, hsla(var(--foreground) / 0.03) 50%, transparent 70%)',
                    backgroundSize: '200% 200%'
                  }}
                  animate={{
                    backgroundPosition: hoveredIndex === index ? ['0% 0%', '100% 100%'] : '0% 0%'
                  }}
                  transition={{
                    duration: 1,
                    ease: "easeInOut",
                    repeat: hoveredIndex === index ? Infinity : 0,
                    repeatType: "reverse"
                  }}
                />
                
                {/* Ripple effect on click */}
                <motion.div
                  className="absolute inset-0 rounded-2xl"
                  style={{
                    background: `radial-gradient(circle, hsla(var(--primary) / 0.2), transparent 70%)`,
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