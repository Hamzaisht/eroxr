
import React from 'react';
import { Ghost } from "lucide-react";

interface GhostModeIndicatorProps {
  isVisible: boolean;
}

export const GhostModeIndicator = ({ isVisible }: GhostModeIndicatorProps) => {
  if (!isVisible) return null;
  
  return (
    <div className="fixed bottom-16 left-4 z-50 bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs text-white border border-purple-500/30 shadow-lg flex items-center space-x-1">
      <Ghost className="h-3.5 w-3.5 text-purple-400" />
      <span>Ghost Mode Active</span>
    </div>
  );
};
