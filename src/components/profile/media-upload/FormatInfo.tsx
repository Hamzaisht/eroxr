
import { motion } from "framer-motion";
import { ImageIcon, Video } from "lucide-react";

interface FormatInfoProps {
  type: 'avatar' | 'banner';
}

export const FormatInfo = ({ type }: FormatInfoProps) => {
  const isAvatar = type === 'avatar';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="grid grid-cols-2 gap-6 text-sm"
    >
      <div className="text-center p-6 rounded-3xl bg-gradient-to-br from-luxury-darker/40 to-luxury-dark/40 border border-luxury-primary/20 backdrop-blur-sm">
        <div className="w-12 h-12 mx-auto mb-4 bg-luxury-primary/20 rounded-2xl flex items-center justify-center">
          <ImageIcon className="w-6 h-6 text-luxury-primary" />
        </div>
        <div className="font-bold text-luxury-neutral mb-2 text-lg">Sacred Images</div>
        <div className="text-luxury-muted mb-2">JPG, PNG, GIF, WebP</div>
        <div className="text-luxury-muted/70 text-xs">
          {isAvatar ? '🔮 Perfect circles honor divine symmetry' : '🏛️ Recommended: 1500x500px for optimal viewing'}
        </div>
      </div>
      {!isAvatar && (
        <div className="text-center p-6 rounded-3xl bg-gradient-to-br from-luxury-darker/40 to-luxury-dark/40 border border-luxury-accent/20 backdrop-blur-sm">
          <div className="w-12 h-12 mx-auto mb-4 bg-luxury-accent/20 rounded-2xl flex items-center justify-center">
            <Video className="w-6 h-6 text-luxury-accent" />
          </div>
          <div className="font-bold text-luxury-neutral mb-2 text-lg">Living Art</div>
          <div className="text-luxury-muted mb-2">MP4, WebM, MOV</div>
          <div className="text-luxury-muted/70 text-xs">⚡ Eternal loops of divine beauty</div>
        </div>
      )}
    </motion.div>
  );
};
