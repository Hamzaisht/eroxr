import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  Camera, 
  Image, 
  FileText, 
  Music, 
  Video, 
  Mic,
  X,
  Zap,
  Sparkles
} from 'lucide-react';
import { SnapCamera } from './SnapCamera';
import { cn } from '@/lib/utils';

interface MediaAttachmentHubProps {
  onClose: () => void;
  onMediaSelect: (blob: Blob, type: 'snax' | 'media', duration?: number) => void;
}

export const MediaAttachmentHub = ({ onClose, onMediaSelect }: MediaAttachmentHubProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);

  const categories = [
    {
      id: 'snax',
      name: 'Snax',
      icon: Zap,
      description: 'Disappearing photos & videos',
      gradient: 'from-purple-500 to-pink-500',
      action: () => setShowCamera(true)
    },
    {
      id: 'photos',
      name: 'Photos',
      icon: Image,
      description: 'Share images',
      gradient: 'from-blue-500 to-cyan-500',
      action: () => handleFileUpload('image/*')
    },
    {
      id: 'videos',
      name: 'Videos',
      icon: Video,
      description: 'Share videos',
      gradient: 'from-red-500 to-orange-500',
      action: () => handleFileUpload('video/*')
    },
    {
      id: 'voice',
      name: 'Voice',
      icon: Mic,
      description: 'Record audio',
      gradient: 'from-green-500 to-teal-500',
      action: () => console.log('Voice recording')
    },
    {
      id: 'music',
      name: 'Music',
      icon: Music,
      description: 'Share audio files',
      gradient: 'from-indigo-500 to-purple-500',
      action: () => handleFileUpload('audio/*')
    },
    {
      id: 'documents',
      name: 'Files',
      icon: FileText,
      description: 'Share documents',
      gradient: 'from-gray-500 to-slate-500',
      action: () => handleFileUpload('*/*')
    }
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
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        background: 'radial-gradient(ellipse at center, rgba(139, 69, 19, 0.1) 0%, rgba(0, 0, 0, 0.95) 70%)',
        backdropFilter: 'blur(20px)'
      }}
    >
      <motion.div 
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="relative w-full max-w-lg"
        style={{
          background: 'linear-gradient(135deg, rgba(139, 69, 19, 0.08) 0%, rgba(160, 82, 45, 0.05) 25%, rgba(139, 69, 19, 0.08) 50%, rgba(160, 82, 45, 0.05) 75%, rgba(139, 69, 19, 0.08) 100%)',
          backdropFilter: 'blur(40px)',
          borderRadius: '24px',
          border: '1px solid rgba(139, 69, 19, 0.2)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
        }}
      >
        {/* Luxury Header */}
        <div className="relative p-8 text-center">
          <motion.button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 transition-all duration-300 flex items-center justify-center group"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="h-4 w-4 text-white/60 group-hover:text-white transition-colors" />
          </motion.button>
          
          <motion.h2 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-light tracking-wide mb-2"
            style={{
              background: 'linear-gradient(135deg, #D4AF37 0%, #FFD700 50%, #B8860B 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent'
            }}
          >
            Choose Media
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-sm text-white/60 font-light"
          >
            Select your desired sharing method
          </motion.p>
        </div>

        {/* Luxury Grid */}
        <div className="px-8 pb-8 grid grid-cols-2 gap-4">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.button
                key={category.id}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.1 * index, type: "spring", stiffness: 300, damping: 20 }}
                onClick={category.action}
                className="group relative overflow-hidden rounded-lg p-6 text-left transition-all duration-500 hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: category.id === 'snax' 
                    ? 'linear-gradient(135deg, rgba(139, 69, 19, 0.15) 0%, rgba(160, 82, 45, 0.1) 100%)'
                    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
                  border: '1px solid rgba(139, 69, 19, 0.2)',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                }}
                whileHover={{
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                }}
              >
                <div className="relative z-10">
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10">
                    <Icon className="h-5 w-5 text-white/80" />
                  </div>
                  <h3 className="font-medium text-white/90 mb-1 tracking-wide">
                    {category.name}
                  </h3>
                  <p className="text-xs text-white/50 font-light leading-relaxed">
                    {category.description}
                  </p>
                </div>
                
                {/* Luxury glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Special Snax indicator */}
                {category.id === 'snax' && (
                  <motion.div 
                    className="absolute top-2 right-2"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0.7, 1, 0.7]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Sparkles className="h-3 w-3 text-amber-400" />
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Luxury Footer */}
        <div className="px-8 pb-6 text-center">
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xs text-white/40 font-light tracking-wide"
          >
            Snax vanish after viewing • Other content remains permanent
          </motion.p>
        </div>
      </motion.div>
    </motion.div>
  );
};