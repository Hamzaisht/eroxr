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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50"
      onClick={onClose}
    >
      <motion.div 
        className="relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background blur circle */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, ease: [0.175, 0.885, 0.32, 1.275] }}
          className="absolute inset-0 w-80 h-80 rounded-full"
          style={{
            background: 'radial-gradient(circle, hsla(var(--primary) / 0.03) 0%, hsla(var(--primary) / 0.08) 40%, transparent 70%)',
            backdropFilter: 'blur(40px)',
            filter: 'blur(1px)'
          }}
        />

        {/* Central plus button */}
        <motion.button
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full flex items-center justify-center z-20"
          style={{
            background: 'linear-gradient(135deg, hsla(var(--primary) / 0.15), hsla(var(--primary) / 0.05))',
            backdropFilter: 'blur(20px)',
            border: '1px solid hsla(var(--primary) / 0.2)',
            boxShadow: '0 8px 32px hsla(var(--primary) / 0.3), inset 0 1px 0 hsla(var(--foreground) / 0.1)'
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClose}
        >
          <Plus 
            className="h-6 w-6 text-foreground/70 transition-transform duration-300"
            style={{ transform: 'rotate(45deg)' }}
          />
        </motion.button>

        {/* Category buttons arranged in circle */}
        {categories.map((category, index) => {
          const Icon = category.icon;
          const angle = (index * 60) - 90; // 6 items, 60 degrees apart, starting from top
          const radius = 110;
          const x = Math.cos((angle * Math.PI) / 180) * radius;
          const y = Math.sin((angle * Math.PI) / 180) * radius;

          return (
            <motion.button
              key={category.id}
              className="absolute w-14 h-14 rounded-full flex items-center justify-center group"
              style={{
                left: `calc(50% + ${x}px - 28px)`,
                top: `calc(50% + ${y}px - 28px)`,
                background: category.id === 'snax' 
                  ? 'linear-gradient(135deg, hsla(var(--primary) / 0.2), hsla(var(--primary) / 0.1))'
                  : 'linear-gradient(135deg, hsla(var(--foreground) / 0.08), hsla(var(--foreground) / 0.03))',
                backdropFilter: 'blur(20px)',
                border: `1px solid hsla(var(--${category.id === 'snax' ? 'primary' : 'foreground'}) / 0.15)`,
                boxShadow: hoveredIndex === index 
                  ? '0 12px 40px hsla(var(--primary) / 0.4), inset 0 1px 0 hsla(var(--foreground) / 0.2)'
                  : '0 4px 20px hsla(var(--foreground) / 0.1), inset 0 1px 0 hsla(var(--foreground) / 0.1)'
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                delay: index * 0.05 + 0.2,
                duration: 0.4,
                type: "spring",
                stiffness: 260,
                damping: 20
              }}
              whileHover={{ 
                scale: 1.15,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.9 }}
              onClick={category.action}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <Icon 
                className={cn(
                  "h-5 w-5 transition-all duration-300",
                  category.id === 'snax' 
                    ? "text-primary/80 group-hover:text-primary" 
                    : "text-foreground/70 group-hover:text-foreground"
                )}
              />
              
              {/* Ripple effect on hover */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  background: `linear-gradient(135deg, hsla(var(--primary) / 0.1), transparent)`,
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={hoveredIndex === index ? { scale: 1.5, opacity: [0, 0.3, 0] } : { scale: 0, opacity: 0 }}
                transition={{ duration: 0.6 }}
              />
            </motion.button>
          );
        })}
        
        {/* Label that appears on hover */}
        <AnimatePresence>
          {hoveredIndex !== null && (
            <motion.div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 pointer-events-none"
              style={{ marginTop: '-120px' }}
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <div
                className="px-3 py-1.5 rounded-full text-xs font-medium tracking-wide"
                style={{
                  background: 'linear-gradient(135deg, hsla(var(--primary) / 0.15), hsla(var(--primary) / 0.05))',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid hsla(var(--primary) / 0.2)',
                  color: 'hsla(var(--foreground) / 0.9)',
                  boxShadow: '0 4px 20px hsla(var(--primary) / 0.2)'
                }}
              >
                {categories[hoveredIndex].name}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};