
import { Plus } from "lucide-react";
import { motion } from "framer-motion";

export const StoryUploadButton = () => {
  return (
    <>
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-luxury-primary to-luxury-accent opacity-20 blur-lg group-hover:opacity-40 transition-opacity duration-300" />
        <Plus className="w-8 h-8 text-white/80 relative z-10 group-hover:scale-110 transition-transform duration-300" />
      </div>
      <span className="text-xs text-white/60 mt-2 group-hover:text-white/80 transition-colors duration-300">
        Add Story
      </span>
    </>
  );
};
