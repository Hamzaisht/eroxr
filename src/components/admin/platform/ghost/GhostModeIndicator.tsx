
import React from 'react';
import { Ghost, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface GhostModeIndicatorProps {
  isVisible: boolean;
}

export const GhostModeIndicator = ({ isVisible }: GhostModeIndicatorProps) => {
  if (!isVisible) return null;
  
  return (
    <div className="fixed bottom-16 left-4 z-50 bg-black/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs text-white border border-purple-500/50 shadow-lg flex items-center space-x-1">
      <Ghost className="h-3.5 w-3.5 text-purple-400" />
      <span>Ghost Mode Active</span>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="ml-1 text-purple-400 hover:text-purple-300">
              <Info className="h-3 w-3" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p className="text-xs max-w-xs">
              You are invisible to users. Your actions are not visible and your presence is not detected.
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
