
import React from 'react';
import { Lock, Ghost } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGhostMode } from '@/hooks/useGhostMode';

interface PremiumErosOverlayProps {
  previewDuration?: number;
  thumbnailUrl?: string;
}

export const PremiumErosOverlay: React.FC<PremiumErosOverlayProps> = ({ 
  previewDuration = 5, 
  thumbnailUrl 
}) => {
  const navigate = useNavigate();
  const { isGhostMode } = useGhostMode();

  const handleUnlockClick = () => {
    navigate('/subscription');
  };

  // If in ghost mode, render a simplified overlay that doesn't block content
  if (isGhostMode) {
    return (
      <div className="absolute top-2 right-2 z-50 bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-md text-xs text-white border border-purple-500/30 shadow-lg flex items-center space-x-1">
        <Ghost className="h-3.5 w-3.5 text-purple-400" />
        <span>Viewing premium content (Ghost)</span>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center space-y-4 p-4 z-50"
    >
      {thumbnailUrl && (
        <img 
          src={thumbnailUrl} 
          alt="Blurred preview" 
          className="absolute inset-0 w-full h-full object-cover filter blur-xl opacity-50"
        />
      )}
      
      <div className="relative z-10 text-center max-w-md">
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
        >
          <Lock className="mx-auto h-12 w-12 text-luxury-primary mb-4 animate-pulse" />
        </motion.div>
        
        <h2 className="text-xl font-bold text-white mb-2">
          Unlock Full Eros Content
        </h2>
        
        <p className="text-luxury-neutral mb-4">
          Preview limited to {previewDuration} seconds. Subscribe to unlock unlimited access to premium content.
        </p>
        
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button 
            onClick={handleUnlockClick}
            className="bg-gradient-to-r from-luxury-primary to-luxury-accent hover:from-luxury-accent hover:to-luxury-primary text-white py-6 px-8 rounded-full shadow-lg"
            size="lg"
          >
            Subscribe Now - 59 SEK/month
          </Button>
        </motion.div>
        
        <p className="text-luxury-neutral/70 mt-4 text-sm">
          Cancel anytime. No refunds.
        </p>
      </div>
    </motion.div>
  );
};
