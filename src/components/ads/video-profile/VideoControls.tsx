
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { AlertCircle } from 'lucide-react';

interface VideoControlsProps {
  videoUrl: string | null;
  avatarUrl: string | null;
  isActive: boolean;
}

export const VideoControls = ({ videoUrl, avatarUrl, isActive }: VideoControlsProps) => {
  const { toast } = useToast();
  
  return (
    <div className="absolute inset-0 w-full h-full">
      <div className="h-full w-full bg-luxury-darker/50 backdrop-blur-xl flex flex-col items-center justify-center">
        <AlertCircle className="h-12 w-12 text-luxury-neutral mb-2" />
        <p className="text-luxury-neutral text-center px-4">Video content coming soon</p>
      </div>
    </div>
  );
};
