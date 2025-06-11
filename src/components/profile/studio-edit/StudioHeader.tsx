
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X, Heart } from "lucide-react";

interface StudioHeaderProps {
  onClose: () => void;
  isLoading: boolean;
  isUploading: boolean;
}

export const StudioHeader = ({ onClose, isLoading, isUploading }: StudioHeaderProps) => {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-luxury-primary/10 via-luxury-accent/5 to-luxury-primary/10" />
      <motion.div
        className="absolute inset-0 opacity-20"
        animate={{
          background: [
            "radial-gradient(circle at 20% 80%, #f472b6 0%, transparent 50%)",
            "radial-gradient(circle at 80% 20%, #8b5cf6 0%, transparent 50%)",
            "radial-gradient(circle at 40% 40%, #00f5ff 0%, transparent 50%)",
          ]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <div className="relative p-8 pb-6">
        <div className="flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <div className="relative">
              <motion.div
                className="w-14 h-14 rounded-2xl bg-gradient-to-br from-luxury-primary/30 to-luxury-accent/30 backdrop-blur-sm flex items-center justify-center"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <Heart className="w-7 h-7 text-luxury-primary" />
              </motion.div>
              <motion.div
                className="absolute -top-1 -right-1 w-4 h-4 bg-luxury-accent rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <div>
              <motion.h2 
                className="text-3xl font-bold bg-gradient-to-r from-luxury-primary via-luxury-accent to-luxury-primary bg-clip-text text-transparent"
                animate={{ backgroundPosition: ["0%", "100%", "0%"] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                Divine Profile Studio
              </motion.h2>
              <p className="text-luxury-muted">Craft your divine essence in the realm of Eros</p>
            </div>
          </motion.div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={isLoading || isUploading}
            className="text-luxury-muted hover:text-luxury-neutral rounded-xl hover:bg-luxury-primary/10"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
