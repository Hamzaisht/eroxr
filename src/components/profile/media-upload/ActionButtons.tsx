
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActionButtonsProps {
  selectedFile: File | null;
  isUploading: boolean;
  fileType: 'image' | 'video' | null;
  onClose: () => void;
  onUpload: () => void;
}

export const ActionButtons = ({ selectedFile, isUploading, fileType, onClose, onUpload }: ActionButtonsProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="flex gap-6 pt-6"
    >
      <Button
        variant="outline"
        onClick={onClose}
        disabled={isUploading}
        className="flex-1 border-luxury-neutral/30 text-luxury-neutral hover:bg-luxury-neutral/10 rounded-2xl h-14 text-lg font-medium transition-all duration-300"
      >
        Abandon Quest
      </Button>
      <motion.div className="flex-1">
        <Button
          onClick={onUpload}
          disabled={!selectedFile || isUploading}
          className={cn(
            "w-full bg-gradient-to-r from-luxury-primary via-luxury-accent to-luxury-primary hover:from-luxury-primary/90 hover:via-luxury-accent/90 hover:to-luxury-primary/90 text-white rounded-2xl h-14 font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-500 relative overflow-hidden",
            isUploading && "animate-pulse"
          )}
        >
          {!isUploading && !selectedFile && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-luxury-primary/20 via-luxury-accent/20 to-luxury-primary/20"
              animate={{
                x: ["-100%", "100%"],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          )}
          <span className="relative z-10 flex items-center justify-center">
            {isUploading ? (
              <>
                <motion.div
                  className="w-6 h-6 mr-3 border-2 border-white/30 border-t-white rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                Ascending to Olympus...
              </>
            ) : selectedFile ? (
              <>
                <Upload className="w-6 h-6 mr-3" />
                Bless {fileType === 'video' ? 'Sacred Video' : 'Divine Image'}
              </>
            ) : (
              <>
                <CheckCircle className="w-6 h-6 mr-3" />
                Select Divine Media
              </>
            )}
          </span>
        </Button>
      </motion.div>
    </motion.div>
  );
};
