
import React from 'react';
import { AlertCircle } from 'lucide-react';

export function VideoContent({ 
  ad, 
  isActive = false, 
  isPreviewMode = false,
  isHovered = false,
  isAnimation = false
}) {
  return (
    <div className="relative w-full h-full aspect-[9/16]">
      <div className="w-full h-full flex items-center justify-center bg-luxury-darker/50">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-luxury-neutral mx-auto mb-2" />
          <p className="text-luxury-neutral">Video content coming soon</p>
        </div>
      </div>
    </div>
  );
}
