
import { motion, AnimatePresence } from "framer-motion";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface MediaPreviewProps {
  currentUrl?: string;
  preview: string | null;
  fileType: 'image' | 'video' | null;
  type: 'avatar' | 'banner';
}

export const MediaPreview = ({ currentUrl, preview, fileType, type }: MediaPreviewProps) => {
  const isAvatar = type === 'avatar';

  return (
    <AnimatePresence mode="wait">
      {(currentUrl || preview) && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="text-center"
        >
          <div className={cn(
            "mx-auto overflow-hidden border-2 border-luxury-primary/30 bg-luxury-darker/50 relative group backdrop-blur-sm",
            isAvatar ? "w-40 h-40 rounded-full" : "w-full h-56 rounded-3xl"
          )}>
            {preview && fileType === 'video' ? (
              <video
                src={preview}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={preview || currentUrl}
                alt={isAvatar ? "Avatar preview" : "Banner preview"}
                className="w-full h-full object-cover"
              />
            )}
            {fileType === 'video' && (
              <div className="absolute top-3 right-3 bg-black/70 rounded-xl px-3 py-1 flex items-center gap-2">
                <Play className="w-3 h-3 text-white" />
                <span className="text-xs text-white font-medium">ETERNAL LOOP</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-luxury-primary/10 via-transparent to-luxury-accent/10 opacity-50" />
          </div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-luxury-muted mt-4 font-medium"
          >
            {preview ? '✨ New divine essence awaits' : '🏛️ Current sacred media'}
            {fileType === 'video' && ' • Eternal video loop'}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
