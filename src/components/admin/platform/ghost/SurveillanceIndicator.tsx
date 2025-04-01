
import React from 'react';
import { AlertTriangle } from "lucide-react";
import { LiveSession } from "@/components/admin/platform/user-analytics/types";

interface SurveillanceIndicatorProps {
  isVisible: boolean;
  session?: LiveSession;
}

export const SurveillanceIndicator = ({ isVisible, session }: SurveillanceIndicatorProps) => {
  if (!isVisible || !session) return null;
  
  return (
    <div className="fixed bottom-24 left-4 z-50 bg-red-900/70 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs text-white border border-red-500/30 shadow-lg flex items-center space-x-1">
      <AlertTriangle className="h-3.5 w-3.5 text-red-400" />
      <span>Monitoring: {session.type} ({session.username})</span>
    </div>
  );
};
