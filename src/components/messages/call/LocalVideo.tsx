
import { RefObject } from "react";
import { Camera } from "lucide-react";

interface LocalVideoProps {
  videoRef: RefObject<HTMLVideoElement>;
  isVideoOff: boolean;
  isMuted: boolean;
}

export function LocalVideo({ videoRef, isVideoOff, isMuted }: LocalVideoProps) {
  return (
    <div className="relative bg-gray-900 rounded-lg overflow-hidden">
      <video 
        ref={videoRef}
        autoPlay 
        muted 
        className="w-full h-full object-cover" 
      />
      {isVideoOff && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
          <div className="text-center">
            <Camera className="h-12 w-12 mx-auto mb-2 text-gray-400" />
            <p className="text-gray-300">Camera is off</p>
          </div>
        </div>
      )}
      <div className="absolute bottom-4 left-4">
        <div className="px-2 py-1 bg-black/60 rounded-md text-white text-sm">
          You {isMuted && '(Muted)'}
        </div>
      </div>
    </div>
  );
}
