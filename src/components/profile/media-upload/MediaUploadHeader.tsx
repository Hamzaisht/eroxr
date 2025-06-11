
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X, Camera, ImageIcon } from "lucide-react";

interface MediaUploadHeaderProps {
  type: 'avatar' | 'banner';
  onClose: () => void;
  isUploading: boolean;
}

export const MediaUploadHeader = ({ type, onClose, isUploading }: MediaUploadHeaderProps) => {
  const isAvatar = type === 'avatar';

  return (
    <div className="relative p-8 pb-6 bg-gradient-to-r from-luxury-primary/10 via-luxury-accent/5 to-luxury-primary/10 border-b border-luxury-primary/20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(139,92,246,0.1),transparent_70%)]" />
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <motion.div
              className="w-14 h-14 rounded-2xl bg-gradient-to-br from-luxury-primary/30 to-luxury-accent/30 backdrop-blur-sm flex items-center justify-center"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              {isAvatar ? <Camera className="w-7 h-7 text-luxury-primary" /> : <ImageIcon className="w-7 h-7 text-luxury-primary" />}
            </motion.div>
            <motion.div
              className="absolute inset-0 rounded-2xl border-2 border-luxury-primary/30"
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-luxury-primary via-luxury-accent to-luxury-primary bg-clip-text text-transparent">
              Divine {isAvatar ? 'Avatar' : 'Banner'} Studio
            </h2>
            <p className="text-luxury-muted">Channel Eros's creative essence through sacred media</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          disabled={isUploading}
          className="text-luxury-muted hover:text-luxury-neutral rounded-xl hover:bg-luxury-primary/10 transition-all duration-300"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};
