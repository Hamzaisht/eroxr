
import { RefObject } from "react";
import { AlertTriangle } from "lucide-react";

interface RemoteVideoProps {
  videoRef: RefObject<HTMLVideoElement>;
  isConnecting: boolean;
  remoteStream: MediaStream | null;
  recipientUsername: string;
}

export function RemoteVideo({ 
  videoRef, 
  isConnecting, 
  remoteStream, 
  recipientUsername 
}: RemoteVideoProps) {
  return (
    <div className="relative bg-gray-900 rounded-lg overflow-hidden">
      <video 
        ref={videoRef}
        autoPlay 
        className="w-full h-full object-cover" 
      />
      {(!remoteStream || isConnecting) && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 mx-auto mb-2 text-yellow-400" />
            <p className="text-gray-300">Waiting for {recipientUsername || 'user'} to join...</p>
          </div>
        </div>
      )}
      <div className="absolute bottom-4 left-4">
        <div className="px-2 py-1 bg-black/60 rounded-md text-white text-sm">
          {recipientUsername || 'User'}
        </div>
      </div>
    </div>
  );
}
