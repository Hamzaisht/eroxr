
import React from 'react';
import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface PremiumErosOverlayProps {
  previewDuration?: number;
  thumbnailUrl?: string;
}

export const PremiumErosOverlay: React.FC<PremiumErosOverlayProps> = ({ 
  previewDuration = 5, 
  thumbnailUrl 
}) => {
  const navigate = useNavigate();

  const handleUnlockClick = () => {
    navigate('/subscription');
  };

  return (
    <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center space-y-4 p-4">
      {thumbnailUrl && (
        <img 
          src={thumbnailUrl} 
          alt="Blurred preview" 
          className="absolute inset-0 w-full h-full object-cover filter blur-xl opacity-50"
        />
      )}
      
      <div className="relative z-10 text-center">
        <Lock className="mx-auto h-12 w-12 text-luxury-primary mb-4 animate-pulse" />
        
        <h2 className="text-xl font-bold text-white mb-2">
          Unlock Full Eros Content
        </h2>
        
        <p className="text-luxury-neutral mb-4">
          Preview limited to {previewDuration} seconds. Subscribe to view full content.
        </p>
        
        <Button 
          onClick={handleUnlockClick}
          className="bg-gradient-to-r from-luxury-primary to-luxury-accent hover:from-luxury-accent hover:to-luxury-primary text-white"
        >
          Subscribe Now - 59 SEK/month
        </Button>
      </div>
    </div>
  );
};
