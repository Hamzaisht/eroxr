
import React from "react";
import { Button } from "@/components/ui/button";
import { PowerOff } from "lucide-react";
import { LiveSession } from "../types";

interface ActiveSessionMonitorProps {
  isWatching: boolean;
  session?: LiveSession;
  startTime?: string;
  onStopWatching: () => Promise<boolean>;
}

export const ActiveSessionMonitor: React.FC<ActiveSessionMonitorProps> = ({
  isWatching,
  session,
  startTime,
  onStopWatching
}) => {
  if (!isWatching) return null;
  
  return (
    <div className="mt-4 p-4 bg-red-950/20 border border-red-800/30 rounded-md">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-red-400 font-medium">Active Surveillance</h3>
        <Button 
          variant="destructive" 
          size="sm" 
          onClick={onStopWatching}
        >
          <PowerOff className="h-3.5 w-3.5 mr-1.5" />
          Stop
        </Button>
      </div>
      
      <p className="text-sm text-gray-400 mb-1">
        Watching: <span className="text-white">{session?.username || 'User'}</span>
      </p>
      <p className="text-sm text-gray-400">
        Since: <span className="text-white">{startTime && 
          new Date(startTime).toLocaleTimeString()}</span>
      </p>
    </div>
  );
};
