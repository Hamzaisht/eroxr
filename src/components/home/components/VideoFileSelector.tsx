
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { RefObject } from "react";

interface VideoFileSelectorProps {
  fileInputRef: RefObject<HTMLInputElement>;
  isSubmitting: boolean;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const VideoFileSelector = ({
  fileInputRef,
  isSubmitting,
  onFileSelect
}: VideoFileSelectorProps) => {
  return (
    <motion.div 
      className="flex flex-col items-center"
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <input
        ref={fileInputRef}
        id="video"
        type="file"
        accept="video/mp4,video/webm,video/quicktime"
        onChange={onFileSelect}
        className="hidden"
      />
      <Button
        onClick={() => fileInputRef.current?.click()}
        className="w-full h-40 rounded-lg border-2 border-dashed border-luxury-primary/20 hover:border-luxury-primary/40 transition-colors"
        variant="outline"
        disabled={isSubmitting}
      >
        <div className="flex flex-col items-center gap-2">
          <Upload className="h-8 w-8 text-luxury-primary" />
          <span>Click to select video</span>
          <span className="text-xs text-luxury-neutral/60">
            MP4, WebM, or MOV (max 100MB)
          </span>
        </div>
      </Button>
    </motion.div>
  );
};
