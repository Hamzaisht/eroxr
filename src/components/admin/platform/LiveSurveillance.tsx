
import { Loader2 } from "lucide-react";

interface LiveSurveillanceProps {
  sessions: any[];
  isLoading: boolean;
  error: string | null;
  onMonitorSession: (session: any) => Promise<boolean>;
  actionInProgress: string;
  onRefresh: () => Promise<void>;
}

export const LiveSurveillance = ({
  sessions,
  isLoading,
  error,
  onMonitorSession,
  actionInProgress,
  onRefresh
}: LiveSurveillanceProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Live Surveillance</h2>
      <p className="text-gray-400">No active sessions</p>
    </div>
  );
};
