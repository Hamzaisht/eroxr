import React from 'react';
import { Eye, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

export const GhostModeIndicator: React.FC = () => {
  return (
    <div className="fixed top-4 right-4 z-50">
      <div className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-full",
        "bg-purple-600/20 border border-purple-500/30 backdrop-blur-xl",
        "text-purple-300 shadow-lg"
      )}>
        <div className="relative">
          <Eye className="h-4 w-4" />
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
        </div>
        <span className="text-sm font-medium">Ghost Mode</span>
        <Activity className="h-3 w-3 animate-pulse" />
      </div>
    </div>
  );
};