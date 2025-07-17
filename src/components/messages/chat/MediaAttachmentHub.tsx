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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4"
    >
      <div className="w-full max-w-md bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-xl rounded-3xl border border-border/50 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/50">
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Choose Media Type
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Select what you want to share
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full hover:bg-destructive/10 hover:text-destructive"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Categories Grid */}
        <div className="p-6 grid grid-cols-2 gap-4">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.button
                key={category.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                onClick={category.action}
                className={cn(
                  "group relative overflow-hidden rounded-2xl p-6 text-left transition-all duration-300",
                  "bg-gradient-to-br", category.gradient,
                  "hover:scale-105 hover:shadow-xl active:scale-95"
                )}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                <div className="relative z-10">
                  <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-white mb-1">
                    {category.name}
                  </h3>
                  <p className="text-xs text-white/80">
                    {category.description}
                  </p>
                </div>
                
                {/* Special Snax indicator */}
                {category.id === 'snax' && (
                  <div className="absolute top-2 right-2">
                    <Sparkles className="h-4 w-4 text-yellow-300 animate-pulse" />
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              Snax disappear after viewing • Other media is permanent
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};