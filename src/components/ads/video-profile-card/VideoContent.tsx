
import { motion } from 'framer-motion';
import { Video, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DatingAd } from '@/types/dating';
import { useState } from 'react';

interface VideoContentProps {
  ad: DatingAd;
  isActive: boolean;
  isHovered: boolean;
  isAnimation?: boolean;
}

export const VideoContent = ({ ad, isActive, isHovered, isAnimation = false }: VideoContentProps) => {
  const variants = {
    idle: { scale: 1.01, opacity: 0.9 },
    active: { scale: 1, opacity: 1 }
  };

  return (
    <div className="relative aspect-video w-full h-[60vh] overflow-hidden bg-black">
      <div className="w-full h-full flex flex-col items-center justify-center bg-luxury-darker/50">
        <Video className="w-16 h-16 text-luxury-neutral/30" />
        <p className="text-luxury-neutral/70 mt-4">Video content coming soon</p>
      </div>
    </div>
  );
};
