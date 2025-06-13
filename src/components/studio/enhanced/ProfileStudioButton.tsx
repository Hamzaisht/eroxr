
import { motion } from 'framer-motion';
import { Settings, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProfileStudioButtonProps {
  onEditClick?: () => void;
}

export const ProfileStudioButton = ({ onEditClick }: ProfileStudioButtonProps) => {
  return (
    <motion.div 
      whileHover={{ scale: 1.05, y: -2 }} 
      whileTap={{ scale: 0.95 }}
      className="relative group"
    >
      <Button
        onClick={onEditClick}
        className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black px-8 py-3 rounded-2xl font-semibold text-lg shadow-luxury relative overflow-hidden"
      >
        {/* Shimmer Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        
        <Palette className="w-5 h-5 mr-2 relative z-10" />
        <span className="relative z-10">Enter Studio</span>
      </Button>
      
      {/* Glowing Border */}
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-2xl blur opacity-50 group-hover:opacity-75 transition-opacity duration-300 -z-10" />
    </motion.div>
  );
};
