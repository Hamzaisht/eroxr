import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Video, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShortsUploadModal } from "./ShortsUploadModal";

export const UploadFloatingButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <Button
          onClick={() => setIsModalOpen(true)}
          className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-500/90 shadow-2xl shadow-primary/25 border-2 border-white/20 backdrop-blur-sm relative overflow-hidden group"
        >
          {/* Animated background glow */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-primary/50 to-blue-500/50 rounded-full blur-xl"
            animate={{
              scale: isHovered ? 1.5 : 1,
              opacity: isHovered ? 0.7 : 0.3,
            }}
            transition={{ duration: 0.3 }}
          />
          
          {/* Icon with rotation animation */}
          <motion.div
            animate={{ 
              rotate: isHovered ? 45 : 0,
              scale: isHovered ? 1.1 : 1 
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="relative z-10"
          >
            <Plus className="w-8 h-8 text-white" />
          </motion.div>
          
          {/* Sparkle effects */}
          <motion.div
            className="absolute inset-0"
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <Sparkles className="absolute top-1 right-2 w-3 h-3 text-white/60" />
            <Sparkles className="absolute bottom-2 left-1 w-2 h-2 text-white/40" />
          </motion.div>
        </Button>
        
        {/* Tooltip */}
        <motion.div
          initial={{ opacity: 0, x: 10, scale: 0.8 }}
          animate={{ 
            opacity: isHovered ? 1 : 0,
            x: isHovered ? 0 : 10,
            scale: isHovered ? 1 : 0.8
          }}
          transition={{ duration: 0.2 }}
          className="absolute right-20 top-1/2 -translate-y-1/2 bg-black/90 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap border border-white/10"
        >
          Create Short
          <div className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-black/90" />
        </motion.div>
      </motion.div>

      <ShortsUploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUploadComplete={() => {
          // Optionally refresh the shorts feed or navigate
          window.location.reload();
        }}
      />
    </>
  );
};