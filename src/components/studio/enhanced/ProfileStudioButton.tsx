
import { motion } from 'framer-motion';
import { Settings, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProfileStudioButtonProps {
  onEditClick?: () => void;
}

export const ProfileStudioButton = ({ onEditClick }: ProfileStudioButtonProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
    >
      <Button
        onClick={onEditClick}
        className="bg-gradient-to-r from-slate-600 to-gray-600 hover:from-slate-500 hover:to-gray-500 text-white px-8 py-3 rounded-2xl font-semibold text-lg shadow-2xl border border-slate-500/30"
      >
        <Crown className="w-5 h-5 mr-2" />
        Divine Studio
      </Button>
    </motion.div>
  );
};
