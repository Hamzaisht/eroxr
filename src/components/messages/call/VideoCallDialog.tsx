
import { useGhostMode } from '@/hooks/useGhostMode';

interface VideoCallDialogProps {
  isOpen: boolean;
  onClose: () => void;
  recipientId: string;
}

export const VideoCallDialog = ({ isOpen, onClose, recipientId }: VideoCallDialogProps) => {
  const { isGhostMode } = useGhostMode();
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
        <div className="text-center text-white">
          <p>Video Call</p>
          {isGhostMode && (
            <p className="text-purple-400 text-sm">Ghost Mode Active</p>
          )}
        </div>
        <button
          onClick={onClose}
          className="mt-4 w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700"
        >
          End Call
        </button>
      </div>
    </div>
  );
};
