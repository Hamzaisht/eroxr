
import { Wifi, WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConnectionIndicatorProps {
  status: 'connected' | 'disconnected' | 'connecting';
  className?: string;
}

export const ConnectionIndicator = ({ status, className }: ConnectionIndicatorProps) => {
  if (status === 'connected') return null;
  
  return (
    <div className={cn(
      "flex items-center gap-2 px-3 py-2 rounded-md text-sm",
      status === 'connecting' ? "bg-amber-500/10 text-amber-300" : "bg-red-500/10 text-red-300",
      className
    )}>
      {status === 'connecting' ? (
        <>
          <div className="w-3 h-3 rounded-full bg-amber-400 animate-pulse" />
          <span>Connecting...</span>
        </>
      ) : (
        <>
          <WifiOff className="h-4 w-4" />
          <span>Connection lost. Reconnecting...</span>
        </>
      )}
    </div>
  );
};
