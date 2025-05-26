
interface LiveSurveillanceProps {
  sessions: any[];
  isLoading: boolean;
  error: any;
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
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Live Sessions</h3>
        <button
          onClick={onRefresh}
          className="px-3 py-1 bg-gray-700 text-white rounded-md text-sm"
        >
          Refresh
        </button>
      </div>
      
      {isLoading ? (
        <p className="text-gray-400">Loading sessions...</p>
      ) : error ? (
        <p className="text-red-400">Error loading sessions</p>
      ) : sessions.length === 0 ? (
        <p className="text-gray-400">No active sessions</p>
      ) : (
        <div className="space-y-2">
          {sessions.map((session) => (
            <div key={session.id} className="bg-gray-800 p-3 rounded-md">
              <p className="text-white">{session.username || 'Unknown User'}</p>
              <button
                onClick={() => onMonitorSession(session)}
                disabled={actionInProgress === session.id}
                className="mt-2 px-3 py-1 bg-purple-600 text-white rounded-md text-sm hover:bg-purple-700 disabled:opacity-50"
              >
                {actionInProgress === session.id ? 'Monitoring...' : 'Monitor'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
