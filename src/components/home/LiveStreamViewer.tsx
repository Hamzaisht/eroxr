
import { useGhostMode } from '@/hooks/useGhostMode';

export const LiveStreamViewer = () => {
  const { isGhostMode } = useGhostMode();
  
  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <div className="text-center text-gray-400">
        <p>Live Stream Viewer</p>
        {isGhostMode && (
          <p className="text-purple-400 text-sm">Ghost Mode Active</p>
        )}
      </div>
    </div>
  );
};
